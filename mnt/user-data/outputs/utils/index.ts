import { Question, LABEL_SETS, SCORE_DESCRIPTIONS, SCORE_COLORS, SCORING, EMAIL_CONFIG } from '../config';

export type Answer = number | number[] | string;

// ─── SCORE ───────────────────────────────────────────────────
export function calcScore(
  questions: Question[],
  aAnswers: Record<number, Answer>,
  bAnswers: Record<number, Answer>
): number {
  let total = 0, matched = 0;
  questions.forEach((q, i) => {
    const a = aAnswers[i], b = bAnswers[i];
    if (a === undefined || b === undefined) return;
    total++;
    if (q.type === 'written') {
      matched += (String(a).trim() && String(b).trim()) ? SCORING.writtenBothAnswered : 0;
    } else if (q.type === 'msq') {
      const aArr = Array.isArray(a) ? a : [];
      const bArr = Array.isArray(b) ? b : [];
      const inter = aArr.filter(x => bArr.includes(x)).length;
      const union = new Set([...aArr, ...bArr]).size;
      matched += union > 0 ? inter / union : 0;
    } else {
      matched += a === b ? SCORING.exactMatchPoints : SCORING.nearMatchPoints;
    }
  });
  return total > 0 ? Math.round((matched / total) * 100) : 0;
}

export function getScoreTier(score: number): number {
  if (score >= 85) return 0;
  if (score >= 70) return 1;
  if (score >= 55) return 2;
  if (score >= 40) return 3;
  if (score >= 25) return 4;
  return 5;
}

export function getLabel(score: number, labelSet: string[]): string {
  return labelSet[getScoreTier(score)];
}

export function getDesc(score: number): string {
  return SCORE_DESCRIPTIONS[getScoreTier(score)];
}

export function getScoreColors(score: number): [string, string] {
  return SCORE_COLORS[getScoreTier(score)];
}

export function getRandomLabelSet(): string[] {
  return LABEL_SETS[Math.floor(Math.random() * LABEL_SETS.length)];
}

// ─── SECURITY TOKEN ──────────────────────────────────────────
export function generateToken(length = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function generateSessionId(): string {
  return generateToken(8).toLowerCase();
}

// Session data stored in sessionStorage (tab-only, never URL-exposed)
const SESSION_KEY = 'cs_session';
const RESULT_KEY = 'cs_result_token';

export interface SessionData {
  aName: string;
  aEmail: string;
  questions: Question[];
  aAnswers: Record<number, Answer>;
  labelSet: string[];
  resultToken: string; // Only A knows this token
  sessionId: string;
  createdAt: number;
}

export function saveSession(data: SessionData): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

export function loadSession(): SessionData | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveResultToken(token: string): void {
  // Store in sessionStorage — only accessible in this tab
  sessionStorage.setItem(RESULT_KEY, token);
}

export function getResultToken(): string | null {
  return sessionStorage.getItem(RESULT_KEY);
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(RESULT_KEY);
}

// ─── ANSWER TEXT ─────────────────────────────────────────────
export function getAnswerText(q: Question, a: Answer | undefined): string {
  if (a === undefined || a === null || a === '') return '—';
  if (q.type === 'written') return String(a) || '—';
  if (Array.isArray(a)) return a.map(i => q.opts[i]).filter(Boolean).join(', ') || '—';
  return q.opts[a as number] ?? '—';
}

// ─── EMAIL ───────────────────────────────────────────────────
export async function sendResultEmail(params: {
  aEmail: string;
  aName: string;
  score: number;
  label: string;
  desc: string;
  questions: Question[];
  aAnswers: Record<number, Answer>;
  bAnswers: Record<number, Answer>;
  resultToken: string;
  sessionId: string;
}): Promise<boolean> {
  try {
    // Build answers HTML for email template
    const answersHtml = params.questions.map((q, i) => {
      const aText = getAnswerText(q, params.aAnswers[i]);
      const bText = getAnswerText(q, params.bAnswers[i]);
      return `
        <tr>
          <td style="padding:8px 12px;font-size:13px;color:#6b7280;border-bottom:1px solid #f0f0f0">${q.text}</td>
          <td style="padding:8px 12px;font-size:13px;color:#7c3aed;border-bottom:1px solid #f0f0f0">${aText}</td>
          <td style="padding:8px 12px;font-size:13px;color:#db2777;border-bottom:1px solid #f0f0f0">${bText}</td>
        </tr>`;
    }).join('');

    const payload = {
      service_id: EMAIL_CONFIG.SERVICE_ID,
      template_id: EMAIL_CONFIG.TEMPLATE_ID,
      user_id: EMAIL_CONFIG.PUBLIC_KEY,
      template_params: {
        to_email: params.aEmail,
        to_name: params.aName,
        score: params.score,
        label: params.label,
        desc: params.desc,
        results_url: `${window.location.origin}${window.location.pathname}?result=${params.sessionId}&token=${params.resultToken}`,
        answers_html: `<table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left;padding:8px 12px;font-size:12px;color:#9ca3af">Question</th><th style="text-align:left;padding:8px 12px;font-size:12px;color:#7c3aed">You</th><th style="text-align:left;padding:8px 12px;font-size:12px;color:#db2777">Them</th></tr></thead><tbody>${answersHtml}</tbody></table>`,
      },
    };

    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return res.status === 200;
  } catch {
    return false;
  }
}
