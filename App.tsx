import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './App.css';
import {
  ALL_QUESTIONS, CATEGORIES, BRAND, UI, Question,
} from './config';
import {
  Answer, calcScore, getLabel, getDesc, getScoreColors,
  getRandomLabelSet, generateToken, generateSessionId,
  saveSession, loadSession, saveResultToken, getResultToken,
  getAnswerText, sendResultEmail,
} from './utils';

// ─── TYPES ───────────────────────────────────────────────────
type Screen = 'welcome' | 'setup' | 'aanswer' | 'link' | 'benter' | 'banswer' | 'bthanks' | 'result';

interface State {
  screen: Screen;
  screenKey: number;
  aName: string;
  aEmail: string;
  selectedCats: string[];
  pool: Question[];
  finalQs: Question[];
  qCount: number;
  labelSet: string[];
  resultToken: string;
  sessionId: string;
  aAnswers: Record<number, Answer>;
  bAnswers: Record<number, Answer>;
  emailSent: boolean;
  emailLoading: boolean;
}

const INIT: State = {
  screen: 'welcome', screenKey: 0,
  aName: '', aEmail: '',
  selectedCats: [], pool: [], finalQs: [], qCount: UI.defaultQCount,
  labelSet: [], resultToken: '', sessionId: '',
  aAnswers: {}, bAnswers: {},
  emailSent: false, emailLoading: false,
};

// ─── PARTICLES BG ────────────────────────────────────────────
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.5 ? '192,132,252' : '244,114,182',
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="particles-canvas" />;
}

// ─── LOGO ────────────────────────────────────────────────────
function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <div className="logo" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="logo-mark">C</div>
      <span className="logo-text">{BRAND.name}</span>
    </div>
  );
}

// ─── STEP BAR ────────────────────────────────────────────────
function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="step-bar">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`step-dot${i < current ? ' done' : ''}`} />
      ))}
    </div>
  );
}

// ─── QUESTION CARD (single-page list item) ───────────────────
function QuestionCard({
  q, idx, answers, onAnswer, delay = 0
}: {
  q: Question; idx: number; answers: Record<number, Answer>;
  onAnswer: (idx: number, val: Answer) => void; delay?: number;
}) {
  const a = answers[idx];
  const [textVal, setTextVal] = useState(typeof a === 'string' ? a : '');
  const isSelected = (i: number) => {
    if (q.type === 'msq') return Array.isArray(a) && a.includes(i);
    return a === i;
  };
  const handleOpt = (i: number) => {
    if (q.type === 'msq') {
      const cur = Array.isArray(a) ? a as number[] : [];
      const next = cur.includes(i) ? cur.filter(x => x !== i) : [...cur, i];
      onAnswer(idx, next);
    } else {
      onAnswer(idx, i);
    }
  };
  return (
    <div className="q-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="q-card-header">
        <span className="q-num">Q{idx + 1}</span>
        <span className="badge badge-purple">{q.cat}</span>
        {q.type === 'msq' && <span className="badge badge-hint">Select all that apply</span>}
      </div>
      <p className="q-text">{q.text}</p>
      {q.type === 'written' ? (
        <textarea
          rows={3}
          className="q-textarea"
          placeholder="Your answer..."
          value={textVal}
          onChange={e => { setTextVal(e.target.value); onAnswer(idx, e.target.value); }}
        />
      ) : (
        <div className="q-opts">
          {q.opts.map((opt, i) => (
            <button
              key={i}
              className={`opt-btn${isSelected(i) ? ' selected' : ''}`}
              onClick={() => handleOpt(i)}
            >
              <span className="opt-dot" />
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SCORE RING ──────────────────────────────────────────────
function ScoreRing({ score, colors }: { score: number; colors: [string, string] }) {
  const [displayed, setDisplayed] = useState(0);
  const circumference = 2 * Math.PI * 52;
  useEffect(() => {
    let frame: number;
    let cur = 0;
    const step = () => {
      cur += 2;
      if (cur >= score) { setDisplayed(score); return; }
      setDisplayed(cur);
      frame = requestAnimationFrame(step);
    };
    const t = setTimeout(() => { frame = requestAnimationFrame(step); }, 400);
    return () => { clearTimeout(t); cancelAnimationFrame(frame); };
  }, [score]);
  const offset = circumference - (displayed / 100) * circumference;
  return (
    <div className="score-ring-wrap">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle
          cx="60" cy="60" r="52"
          fill="none" stroke="url(#rg)" strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.05s linear', transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
        />
      </svg>
      <div className="score-inner">
        <span className="score-num" style={{ backgroundImage: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}>{displayed}</span>
        <span className="score-denom">/ 100</span>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────
export default function App() {
  const [s, setS] = useState<State>(INIT);

  const go = useCallback((screen: Screen, patch: Partial<State> = {}) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setS(prev => ({ ...prev, ...patch, screen, screenKey: prev.screenKey + 1 }));
  }, []);

  // Check URL for result token on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resultId = params.get('result');
    const urlToken = params.get('token');
    if (resultId && urlToken) {
      const session = loadSession();
      if (session && session.sessionId === resultId && session.resultToken === urlToken) {
        saveResultToken(urlToken);
        // Reconstruct result state
        const score = calcScore(session.questions, session.aAnswers, s.bAnswers);
        setS(prev => ({
          ...prev,
          screen: 'result',
          aName: session.aName,
          aEmail: session.aEmail,
          finalQs: session.questions,
          aAnswers: session.aAnswers,
          labelSet: session.labelSet,
          resultToken: session.resultToken,
          sessionId: session.sessionId,
          screenKey: prev.screenKey + 1,
        }));
      }
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // ── WELCOME ──
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  function handleWelcome() {
    if (!name.trim() || !email.trim()) return;
    go('setup', { aName: name.trim(), aEmail: email.trim(), labelSet: getRandomLabelSet() });
  }

  // ── SETUP (categories + count + questions all on one page) ──
  const [setupCats, setSetupCats] = useState<string[]>([]);
  const [qCount, setQCount] = useState(UI.defaultQCount);
  const [customQs, setCustomQs] = useState<Question[]>([]);
  const [showAddQ, setShowAddQ] = useState(false);
  const [newQText, setNewQText] = useState('');
  const [newQType, setNewQType] = useState<'mcq' | 'msq' | 'written'>('mcq');
  const [newQOpts, setNewQOpts] = useState('');
  const [finalQs, setFinalQs] = useState<Question[]>([]);
  const [setupReady, setSetupReady] = useState(false);

  const pool = useMemo(() => {
    return setupCats.length
      ? ALL_QUESTIONS.filter(q => setupCats.includes(q.cat))
      : [...ALL_QUESTIONS];
  }, [setupCats]);

  useEffect(() => {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setFinalQs(shuffled.slice(0, Math.min(qCount, pool.length)));
  }, [pool, qCount]);

  const allSetupQs = [...finalQs, ...customQs];

  function toggleCat(cat: string) {
    setSetupCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  }

  function replaceQ(idx: number) {
    const used = allSetupQs.map(q => q.text);
    const unused = pool.filter(q => !used.includes(q.text));
    if (!unused.length) return;
    const rep = unused[Math.floor(Math.random() * unused.length)];
    setFinalQs(prev => { const n = [...prev]; n[idx] = rep; return n; });
  }

  function removeQ(idx: number, isCustom: boolean) {
    if (isCustom) {
      setCustomQs(prev => prev.filter((_, i) => i !== idx - finalQs.length));
    } else {
      setFinalQs(prev => prev.filter((_, i) => i !== idx));
    }
  }

  function addCustomQ() {
    if (!newQText.trim()) return;
    const opts = newQType !== 'written' ? newQOpts.split('\n').map(o => o.trim()).filter(Boolean) : [];
    setCustomQs(prev => [...prev, {
      id: `c_${Date.now()}`,
      cat: 'Custom',
      text: newQText.trim(),
      type: newQType,
      opts,
      _custom: true,
    }]);
    setNewQText(''); setNewQOpts(''); setShowAddQ(false);
  }

  function handleSetupNext() {
    if (allSetupQs.length === 0) return;
    setSetupReady(true);
    setTimeout(() => {
      go('aanswer', { finalQs: allSetupQs, pool });
      setSetupReady(false);
    }, 300);
  }

  // ── A ANSWERS (all on one page) ──
  const [aAnswers, setAAnswers] = useState<Record<number, Answer>>({});
  function handleAAnswer(idx: number, val: Answer) {
    setAAnswers(prev => ({ ...prev, [idx]: val }));
  }

  function handleASubmit() {
    const token = generateToken();
    const sid = generateSessionId();
    const session = {
      aName: s.aName, aEmail: s.aEmail,
      questions: s.finalQs,
      aAnswers,
      labelSet: s.labelSet,
      resultToken: token,
      sessionId: sid,
      createdAt: Date.now(),
    };
    saveSession(session);
    saveResultToken(token);
    go('link', { aAnswers, resultToken: token, sessionId: sid });
  }

  // ── B ENTER ──
  const [bCode, setBCode] = useState('');
  const [bCodeErr, setBCodeErr] = useState(false);
  function handleBEnter() {
    const session = loadSession();
    if (!session) { setBCodeErr(true); return; }
    if (bCode.trim().toLowerCase() !== session.aName.toLowerCase()) {
      setBCodeErr(true);
      setTimeout(() => setBCodeErr(false), 800);
      return;
    }
    go('banswer', {
      aName: session.aName,
      finalQs: session.questions,
      aAnswers: session.aAnswers,
      labelSet: session.labelSet,
      resultToken: session.resultToken,
      sessionId: session.sessionId,
    });
  }

  // ── B ANSWERS (all on one page) ──
  const [bAnswers, setBAnswers] = useState<Record<number, Answer>>({});
  function handleBAnswer(idx: number, val: Answer) {
    setBAnswers(prev => ({ ...prev, [idx]: val }));
  }

  async function handleBSubmit() {
    const session = loadSession();
    if (!session) return;
    const score = calcScore(session.questions, session.aAnswers, bAnswers);
    const label = getLabel(score, session.labelSet);
    const desc = getDesc(score);

    go('bthanks', { bAnswers, emailLoading: true });

    const ok = await sendResultEmail({
      aEmail: session.aEmail,
      aName: session.aName,
      score, label, desc,
      questions: session.questions,
      aAnswers: session.aAnswers,
      bAnswers,
      resultToken: session.resultToken,
      sessionId: session.sessionId,
    });

    setS(prev => ({ ...prev, emailSent: ok, emailLoading: false }));
  }

  // ── RESULT ──
  const session = loadSession();
  const resultToken = getResultToken();
  const canSeeResult = session && resultToken && session.resultToken === resultToken;
  const resultQs = s.finalQs.length ? s.finalQs : (session?.questions ?? []);
  const resultAAnswers = Object.keys(s.aAnswers).length ? s.aAnswers : (session?.aAnswers ?? {});
  const score = calcScore(resultQs, resultAAnswers, s.bAnswers);
  const scoreColors = getScoreColors(score);
  const scoreLabel = getLabel(score, s.labelSet.length ? s.labelSet : (session?.labelSet ?? []));
  const scoreDesc = getDesc(score);

  // ─────────────────────────────────────────────────────────
  return (
    <div className="app">
      <Particles />

      <div className="app-inner" key={s.screenKey}>
        <Logo onClick={s.screen !== 'welcome' ? () => go('welcome', INIT) : undefined} />

        {/* ═══ WELCOME ═══ */}
        {s.screen === 'welcome' && (
          <div className="screen">
            <div className="hero">
              <div className="hero-badge">✦ Compatibility, reimagined</div>
              <h1 className="hero-title">{BRAND.tagline}</h1>
              <p className="hero-sub">{BRAND.subtitle}</p>
            </div>
            <div className="card card-glow animate-up" style={{ animationDelay: '200ms' }}>
              <div className="field">
                <label>Your name</label>
                <input
                  type="text" placeholder="e.g. Arjun"
                  value={name} onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleWelcome()}
                />
                <p className="field-hint">This becomes the unlock code for your link recipient.</p>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Your email</label>
                <input
                  type="email" placeholder="you@email.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleWelcome()}
                />
                <p className="field-hint">We'll email you B's answers and C Score the moment they submit.</p>
              </div>
            </div>
            <button
              className={`btn btn-primary animate-up${(!name.trim() || !email.trim()) ? ' disabled' : ''}`}
              style={{ animationDelay: '350ms' }}
              onClick={handleWelcome}
              disabled={!name.trim() || !email.trim()}
            >
              Get started →
            </button>
          </div>
        )}

        {/* ═══ SETUP ═══ */}
        {s.screen === 'setup' && (
          <div className="screen">
            <StepBar current={1} total={5} />
            <h2>Set up your questions</h2>
            <p className="screen-sub">Filter by category, set how many questions, then review and customise below.</p>

            {/* Categories */}
            <div className="section-label">Filter by category <span className="section-hint">(optional — skip to see all {ALL_QUESTIONS.length})</span></div>
            <div className="chip-grid">
              {CATEGORIES.map(cat => {
                const count = ALL_QUESTIONS.filter(q => q.cat === cat).length;
                return (
                  <button
                    key={cat}
                    className={`chip${setupCats.includes(cat) ? ' selected' : ''}`}
                    onClick={() => toggleCat(cat)}
                  >
                    {cat} <span className="chip-count">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Count */}
            <div className="section-label" style={{ marginTop: '1.5rem' }}>
              Number of questions
              <span className="section-hint"> — {pool.length} available</span>
            </div>
            <div className="count-slider-wrap">
              <span className="count-big">{Math.min(qCount, pool.length)}</span>
              <input
                type="range" min={1} max={Math.min(pool.length, UI.maxQuestionsPerSession)}
                step={1} value={Math.min(qCount, pool.length)}
                onChange={e => setQCount(parseInt(e.target.value))}
                style={{ flex: 1 }}
              />
            </div>

            {/* Questions list */}
            <div className="section-label" style={{ marginTop: '1.5rem' }}>
              Review questions
              <span className="section-hint"> — replace or remove any</span>
            </div>
            <div className="questions-list">
              {allSetupQs.map((q, i) => (
                <div key={q.id} className="setup-q-row animate-up" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="setup-q-body">
                    <span className="q-num">Q{i + 1}</span>
                    <div>
                      <p className="setup-q-text">{q.text}</p>
                      <span className="badge badge-purple">{q.cat}</span>
                    </div>
                  </div>
                  <div className="setup-q-actions">
                    {!q._custom && (
                      <button className="icon-btn" onClick={() => replaceQ(i)} title="Replace">↻</button>
                    )}
                    <button className="icon-btn icon-btn-danger" onClick={() => removeQ(i, !!q._custom)} title="Remove">✕</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add custom question */}
            {showAddQ ? (
              <div className="card add-q-card animate-up">
                <div className="field">
                  <label>Question type</label>
                  <div className="chip-grid" style={{ marginBottom: 0 }}>
                    {(['mcq', 'msq', 'written'] as const).map(t => (
                      <button key={t} className={`chip${newQType === t ? ' selected' : ''}`} onClick={() => setNewQType(t)}>
                        {t.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label>Your question</label>
                  <input type="text" placeholder="Type your question..." value={newQText} onChange={e => setNewQText(e.target.value)} />
                </div>
                {newQType !== 'written' && (
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>Options (one per line)</label>
                    <textarea rows={4} placeholder={"Option 1\nOption 2\nOption 3"} value={newQOpts} onChange={e => setNewQOpts(e.target.value)} />
                  </div>
                )}
                <div className="btn-row" style={{ marginTop: '1rem' }}>
                  <button className="btn btn-ghost" onClick={() => setShowAddQ(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={addCustomQ}>Add question</button>
                </div>
              </div>
            ) : (
              <button className="btn btn-outline" style={{ marginTop: '0.75rem' }} onClick={() => setShowAddQ(true)}>
                + Add your own question
              </button>
            )}

            <button
              className={`btn btn-primary${setupReady ? ' loading' : ''}`}
              style={{ marginTop: '1.5rem' }}
              onClick={handleSetupNext}
              disabled={allSetupQs.length === 0}
            >
              Answer your questions →
            </button>
          </div>
        )}

        {/* ═══ A ANSWERS ═══ */}
        {s.screen === 'aanswer' && (
          <div className="screen">
            <StepBar current={2} total={5} />
            <h2>Your answers</h2>
            <p className="screen-sub">Answer all questions first — your responses become the benchmark for the C Score.</p>
            <div className="questions-list">
              {s.finalQs.map((q, i) => (
                <QuestionCard
                  key={q.id} q={q} idx={i}
                  answers={aAnswers}
                  onAnswer={handleAAnswer}
                  delay={i * 50}
                />
              ))}
            </div>
            <div className="submit-section">
              <p className="submit-hint">Answered {Object.keys(aAnswers).length} of {s.finalQs.length} questions</p>
              <button className="btn btn-primary btn-lg" onClick={handleASubmit}>
                Generate link →
              </button>
            </div>
          </div>
        )}

        {/* ═══ LINK ═══ */}
        {s.screen === 'link' && (
          <div className="screen">
            <StepBar current={3} total={5} />
            <div className="success-icon animate-pop">✓</div>
            <h2>Your link is ready!</h2>
            <p className="screen-sub">Send this to the person you want to connect with. They enter your name as the unlock code.</p>
            <div className="card card-glow animate-up" style={{ animationDelay: '150ms' }}>
              <div className="info-row">
                <span className="info-label">Unlock code</span>
                <span className="unlock-code">{s.aName}</span>
              </div>
              <div className="info-row" style={{ marginTop: '1rem' }}>
                <span className="info-label">Session link</span>
                <div className="link-box">cscore.app/s/{s.sessionId}</div>
              </div>
              <button className="btn btn-primary" style={{ marginTop: '1rem' }}
                onClick={e => {
                  navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?s=${s.sessionId}`).catch(() => {});
                  const b = e.currentTarget; const t = b.textContent;
                  b.textContent = 'Copied!'; setTimeout(() => { if (b) b.textContent = t; }, 1500);
                }}>
                Copy link
              </button>
            </div>
            <div className="security-note animate-up" style={{ animationDelay: '300ms' }}>
              <span className="security-icon">🔒</span>
              <div>
                <strong>Private & secure.</strong> B will only see your questions — never your answers or the C Score. Results are sent exclusively to your email ({s.aEmail}) the moment B submits.
              </div>
            </div>
            <hr className="divider" />
            <button className="btn btn-ghost" onClick={() => go('benter')}>Preview B's experience →</button>
          </div>
        )}

        {/* ═══ B ENTER ═══ */}
        {s.screen === 'benter' && (
          <div className="screen">
            <div className="hero">
              <div className="hero-badge">✦ You've been sent a link</div>
              <h1 className="hero-title">Someone wants<br /><em>to know you</em></h1>
              <p className="hero-sub">Enter the code they gave you to unlock their questions.</p>
            </div>
            <div className={`card card-glow animate-up${bCodeErr ? ' shake' : ''}`}>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Unlock code</label>
                <input
                  type="text"
                  placeholder="Their name..."
                  value={bCode}
                  onChange={e => setBCode(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleBEnter()}
                  className={bCodeErr ? 'input-error' : ''}
                />
                <p className="field-hint">
                  {bCodeErr ? '✕ Wrong code. Try the name of the person who sent you this.' : 'Hint: it\'s the first name of the person who sent you this link.'}
                </p>
              </div>
            </div>
            <button className="btn btn-primary animate-up" style={{ animationDelay: '200ms' }} onClick={handleBEnter}>
              Unlock questions →
            </button>
          </div>
        )}

        {/* ═══ B ANSWERS ═══ */}
        {s.screen === 'banswer' && (
          <div className="screen">
            <div className="b-header">
              <span className="badge badge-pink">Answering for {s.aName}</span>
              <span className="b-hint">None are required — answer what feels right</span>
            </div>
            <div className="questions-list">
              {s.finalQs.map((q, i) => (
                <QuestionCard
                  key={q.id} q={q} idx={i}
                  answers={bAnswers}
                  onAnswer={handleBAnswer}
                  delay={i * 50}
                />
              ))}
            </div>
            <div className="submit-section">
              <p className="submit-hint">
                {Object.keys(bAnswers).length} of {s.finalQs.length} answered — you can skip any
              </p>
              <button className="btn btn-primary btn-lg" onClick={handleBSubmit}>
                Submit answers
              </button>
            </div>
          </div>
        )}

        {/* ═══ B THANKS ═══ */}
        {s.screen === 'bthanks' && (
          <div className="screen thanks-screen">
            <div className="thanks-icon animate-pop">✓</div>
            <h2>Thanks, submitted!</h2>
            <p>Your answers have been sent. That's all from you!</p>
            {s.emailLoading && <p className="email-status loading">Sending results to {s.aName}…</p>}
            {s.emailSent && <p className="email-status sent">✓ Results emailed successfully</p>}
            <div className="privacy-note">
              <span>🔒</span> The C Score and all results are private — only {s.aName} can see them.
            </div>
          </div>
        )}

        {/* ═══ RESULT ═══ */}
        {s.screen === 'result' && (
          !canSeeResult ? (
            <div className="screen thanks-screen">
              <div className="lock-icon animate-pop">🔒</div>
              <h2>Results are private</h2>
              <p>This result page is only accessible to the person who created this session.</p>
            </div>
          ) : (
            <div className="screen">
              <StepBar current={5} total={5} />
              <div className="result-hero">
                <ScoreRing score={score} colors={scoreColors} />
                <div className="score-label animate-up" style={{ animationDelay: '600ms' }}>{scoreLabel}</div>
                <p className="score-desc animate-up" style={{ animationDelay: '750ms' }}>{scoreDesc}</p>
              </div>
              <div className="card animate-up" style={{ animationDelay: '900ms' }}>
                <div className="result-header">
                  <span style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 500 }}>Your answers</span>
                  <span style={{ color: 'var(--accent2)', fontSize: 13, fontWeight: 500 }}>Their answers</span>
                </div>
                {resultQs.map((q, i) => (
                  <div key={q.id} className="ans-pair animate-up" style={{ animationDelay: `${900 + i * 60}ms` }}>
                    <p className="ans-q-text">{q.text}</p>
                    <div className="ans-cols">
                      <div className="ans-bubble ans-a">
                        <div className="ans-who">You</div>
                        {getAnswerText(q, resultAAnswers[i])}
                      </div>
                      <div className="ans-bubble ans-b">
                        <div className="ans-who">Them</div>
                        {getAnswerText(q, s.bAnswers[i])}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-ghost" style={{ marginTop: '1rem' }}
                onClick={() => { go('welcome', INIT); setAAnswers({}); setBAnswers({}); }}>
                Start a new session
              </button>
            </div>
          )
        )}

      </div>
    </div>
  );
}
