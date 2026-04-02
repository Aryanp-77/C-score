// ============================================================
//  C SCORE — MASTER CONFIG
//  Edit everything here. Never touch App.tsx or logic files.
// ============================================================

// ─── EMAIL (EmailJS) ────────────────────────────────────────
// Sign up free at https://emailjs.com
// Replace these with your real values
export const EMAIL_CONFIG = {
  SERVICE_ID: 'service_mdao1su',
  TEMPLATE_ID: 'template_yp4a8tv',
  PUBLIC_KEY: 'K798Sk097ae8bj134',
};

// EmailJS template variables you can use:
//   {{to_email}}   — A's email
//   {{to_name}}    — A's name
//   {{b_name}}     — B's name (if they enter one, else "Someone")
//   {{score}}      — numeric C score
//   {{label}}      — e.g. "Cosmic glue"
//   {{desc}}       — score description text
//   {{results_url}} — deep link back to results
//   {{answers_html}} — full HTML table of Q&A pairs

// ─── APP BRANDING ────────────────────────────────────────────
export const BRAND = {
  name: 'C Score',
  tagline: 'Ask the questions you\'re too shy to ask.',
  subtitle: 'Send a link. See how compatible you really are.',
};

// ─── CATEGORIES ─────────────────────────────────────────────
// Add, remove, or rename — the app adapts automatically
export const CATEGORIES: string[] = [
  'Emotional',
  'Romantic',
  'Friendship',
  'Fun & Humour',
  'Deep / Personal',
  'Future Goals',
  'Family',
  'Lifestyle',
  'Communication',
  'Trust & Loyalty',
  'Intimacy',
  'Social Life',
  'Career & Ambition',
  'Money & Finance',
  'Health & Fitness',
  'Spirituality',
  'Politics & Society',
  'Travel & Adventure',
  'Food & Taste',
  'Entertainment',
  'Personal Growth',
  'Conflict Style',
  'Love Language',
  'Red Flags',
];

// ─── COMPATIBILITY LABEL SETS ────────────────────────────────
// Each set has 6 labels for score ranges:
// [85-100, 70-84, 55-69, 40-54, 25-39, 0-24]
// Add as many sets as you want — one is picked randomly per session
export const LABEL_SETS: string[][] = [
  ['Cosmic glue', 'Main character energy', 'Slow burn', 'Plot twist', 'Friend zone material', 'Parallel universes'],
  ['Same soul, different body', 'The algorithm approves', 'Enemies to lovers potential', 'Chaos duo energy', 'Interesting experiment', 'Nature said no'],
  ['Universe said yes', 'Certified soulmate', 'Almost perfect', 'Lovable mess', 'Complicated', 'Hard pass'],
  ['Rare find', 'Built different together', 'Worth exploring', 'Spicy combination', 'Not quite there', 'Different species'],
  ['Endgame unlocked', 'Strong contender', 'Situationship vibes', 'Wild card', 'Just friends maybe', 'Swipe left energy'],
  ['Written in the stars', 'Undeniable chemistry', "Something's cooking", 'Chaotic neutral', 'Wrong timing maybe', 'Lost signal'],
  ['Once in a lifetime', 'Certified match', 'Potential unlocked', 'Unpredictable duo', 'Needs more work', 'Totally unmatched'],
  ['Soulmate detected', 'Too good to be true', 'Growing on each other', 'Accidental duo', 'Missing pieces', 'Different fonts'],
  ['Destined', 'Caught feelings loading', 'Mixed signals but make it cute', 'Questionable decisions', 'Not the one', 'Error 404'],
  ['Legendary duo', 'High voltage', 'Room for magic', 'Beautifully chaotic', 'On thin ice', 'No signal found'],
];

// ─── SCORE DESCRIPTIONS ──────────────────────────────────────
// One per score tier: [85+, 70+, 55+, 40+, 25+, 0+]
export const SCORE_DESCRIPTIONS: string[] = [
  'Seriously rare. You two just get each other on every level. The universe shipped you together.',
  'Real sparks here. This one has serious potential — keep pulling that thread.',
  'Solid foundation. A few differences but nothing major. Worth exploring.',
  'Interesting mix — opposites in some areas, aligned in others. Could go either way.',
  'Quite a few differences. Could still work with a lot of patience and effort.',
  'Major mismatches found. Very different people — but hey, opposites do attract sometimes.',
];

// ─── SCORE RING COLORS ───────────────────────────────────────
// Gradient color per tier [85+, 70+, 55+, 40+, 25+, 0+]
export const SCORE_COLORS: [string, string][] = [
  ['#a855f7', '#ec4899'],  // 85+ purple→pink
  ['#f97316', '#ec4899'],  // 70+ orange→pink
  ['#06b6d4', '#a855f7'],  // 55+ cyan→purple
  ['#f59e0b', '#f97316'],  // 40+ amber→orange
  ['#6b7280', '#a855f7'],  // 25+ gray→purple
  ['#374151', '#6b7280'],  // 0+  dark gray
];

// ─── ALL QUESTIONS ───────────────────────────────────────────
// type: 'mcq' = pick one | 'msq' = pick many | 'written' = free text
// Add/remove/edit freely — keep the id unique
export type QuestionType = 'mcq' | 'msq' | 'written';
export interface Question {
  id: string;
  cat: string;
  text: string;
  type: QuestionType;
  opts: string[];
  _custom?: boolean;
}

export const ALL_QUESTIONS: Question[] = [
  // EMOTIONAL
  { id: 'e1', cat: 'Emotional', text: 'How do you usually handle feeling overwhelmed?', type: 'mcq', opts: ['Talk to someone', 'Go quiet and process alone', 'Distract myself', 'Cry it out'] },
  { id: 'e2', cat: 'Emotional', text: 'What does emotional support look like to you?', type: 'mcq', opts: ['Listening without advice', 'Physical comfort', 'Practical help', 'Giving space'] },
  { id: 'e3', cat: 'Emotional', text: "When you're happy, you tend to?", type: 'mcq', opts: ['Share it with everyone', 'Keep it to myself', 'Express it physically', 'Channel it into something creative'] },
  { id: 'e4', cat: 'Emotional', text: 'How easily do you cry?', type: 'mcq', opts: ['Very easily', 'Sometimes', 'Rarely', 'Almost never'] },

  // ROMANTIC
  { id: 'r1', cat: 'Romantic', text: "What's your ideal date?", type: 'mcq', opts: ['Cozy night in', 'Adventure outside', 'Fancy dinner', 'Something spontaneous'] },
  { id: 'r2', cat: 'Romantic', text: 'How do you show affection most naturally?', type: 'msq', opts: ['Physical touch', 'Words of affirmation', 'Acts of service', 'Quality time', 'Gifts'] },
  { id: 'r3', cat: 'Romantic', text: 'In a relationship, space means?', type: 'mcq', opts: ['Absolutely essential', "Nice to have", "Don't need much", "Depends on my mood"] },
  { id: 'r4', cat: 'Romantic', text: 'How long before saying "I love you"?', type: 'mcq', opts: ['A few weeks', 'A few months', 'Over a year', 'When it feels right, no timer'] },

  // FRIENDSHIP
  { id: 'f1', cat: 'Friendship', text: 'What makes a friend irreplaceable to you?', type: 'mcq', opts: ['Loyalty', 'Honesty', 'Fun energy', 'Deep conversations'] },
  { id: 'f2', cat: 'Friendship', text: 'How many close friends do you have?', type: 'mcq', opts: ['1-2 ride or dies', 'A small circle of 5-10', 'A big social network', 'Just acquaintances really'] },
  { id: 'f3', cat: 'Friendship', text: 'Can men and women be just friends?', type: 'mcq', opts: ['Yes, always', 'Usually yes', 'Depends on the people', 'Rarely'] },

  // FUN & HUMOUR
  { id: 'fh1', cat: 'Fun & Humour', text: 'Your humour style is closest to?', type: 'mcq', opts: ['Sarcastic', 'Silly / goofy', 'Dark humour', 'Witty and dry'] },
  { id: 'fh2', cat: 'Fun & Humour', text: 'Most fun activity on a weekend?', type: 'mcq', opts: ['Explore somewhere new', 'Game night with friends', 'Netflix marathon', 'Try a new restaurant'] },
  { id: 'fh3', cat: 'Fun & Humour', text: 'You laugh most at?', type: 'mcq', opts: ['Absurd / random things', 'Self-deprecating jokes', 'Roasting friends', 'Clever wordplay'] },

  // DEEP / PERSONAL
  { id: 'dp1', cat: 'Deep / Personal', text: 'What do you value most in life?', type: 'msq', opts: ['Family', 'Freedom', 'Success', 'Love', 'Peace'] },
  { id: 'dp2', cat: 'Deep / Personal', text: 'Your biggest fear is?', type: 'mcq', opts: ['Loneliness', 'Failure', 'Being misunderstood', 'Losing someone I love'] },
  { id: 'dp3', cat: 'Deep / Personal', text: 'Do you believe people can truly change?', type: 'mcq', opts: ['Yes, always', 'Yes, but rarely', 'Only with real effort', 'No, people stay the same'] },

  // FUTURE GOALS
  { id: 'fg1', cat: 'Future Goals', text: 'Where do you see yourself in 5 years?', type: 'written', opts: [] },
  { id: 'fg2', cat: 'Future Goals', text: 'Kids in your future?', type: 'mcq', opts: ['Definitely yes', 'Maybe someday', 'Not sure yet', 'No thank you'] },
  { id: 'fg3', cat: 'Future Goals', text: 'Would you relocate for love?', type: 'mcq', opts: ['Yes, anywhere', 'Yes, but nearby only', 'Maybe if everything aligned', 'No'] },

  // FAMILY
  { id: 'fa1', cat: 'Family', text: 'How close are you with your family?', type: 'mcq', opts: ['Very close — talk daily', 'Close but independent', 'Complicated relationship', 'Not very close'] },
  { id: 'fa2', cat: 'Family', text: 'Family dinners are?', type: 'mcq', opts: ['A sacred tradition', 'Nice when they happen', 'Occasionally stressful', 'Rare in my life'] },
  { id: 'fa3', cat: 'Family', text: 'Your parents\' relationship has shaped your idea of love?', type: 'mcq', opts: ['Positively, they\'re my model', 'Somewhat', 'As a warning of what not to do', 'I don\'t let it define me'] },

  // LIFESTYLE
  { id: 'l1', cat: 'Lifestyle', text: 'Your ideal morning looks like?', type: 'mcq', opts: ['Slow and peaceful', 'Productive and early', 'Depends on the day', 'Sleep as long as possible'] },
  { id: 'l2', cat: 'Lifestyle', text: 'Your living space is usually?', type: 'mcq', opts: ['Very tidy — always', 'Organised chaos', 'A bit messy honestly', 'Depends on my mood'] },
  { id: 'l3', cat: 'Lifestyle', text: 'Pets — do you have or want them?', type: 'mcq', opts: ['Have them, love them', 'Want them someday', 'Neutral about them', 'Not a pet person'] },

  // COMMUNICATION
  { id: 'c1', cat: 'Communication', text: "When you're upset with someone, you usually?", type: 'mcq', opts: ['Talk about it right away', 'Need time then talk', 'Drop hints', 'Avoid the topic'] },
  { id: 'c2', cat: 'Communication', text: 'Texting style?', type: 'mcq', opts: ['Reply instantly', 'Reply when I can', 'Leave on read sometimes', 'Phone calls only'] },
  { id: 'c3', cat: 'Communication', text: 'You prefer to resolve conflict by?', type: 'mcq', opts: ['Talking it out face-to-face', 'Texting / writing', 'Taking space first', 'Avoiding it altogether'] },

  // TRUST & LOYALTY
  { id: 'tl1', cat: 'Trust & Loyalty', text: 'How quickly do you trust someone new?', type: 'mcq', opts: ['Fairly quickly', 'Takes time', 'Very slowly', 'Depends on vibe'] },
  { id: 'tl2', cat: 'Trust & Loyalty', text: 'Loyalty to you means?', type: 'mcq', opts: ['Never talking behind back', 'Always showing up', 'Honesty above all', 'Protecting them publicly'] },
  { id: 'tl3', cat: 'Trust & Loyalty', text: 'If a friend betrayed your trust, you would?', type: 'mcq', opts: ['Cut them off immediately', 'Give one chance', 'Try to understand why', 'Forgive and move on easily'] },

  // INTIMACY
  { id: 'i1', cat: 'Intimacy', text: 'Emotional intimacy to you means?', type: 'msq', opts: ['Vulnerability', 'Deep talks', 'Feeling safe', 'Physical closeness', 'Shared secrets'] },
  { id: 'i2', cat: 'Intimacy', text: 'Physical affection in daily life is?', type: 'mcq', opts: ['Essential — need it daily', 'Nice to have', 'Occasionally is fine', 'Not really my thing'] },

  // SOCIAL LIFE
  { id: 'sl1', cat: 'Social Life', text: 'Your social battery is?', type: 'mcq', opts: ['Always full — love people', 'Selective — close circle only', 'Recharged by alone time', 'Depends on the crowd'] },
  { id: 'sl2', cat: 'Social Life', text: 'Parties are?', type: 'mcq', opts: ['My natural habitat', 'Fun occasionally', 'Exhausting but I go', 'Hard pass'] },
  { id: 'sl3', cat: 'Social Life', text: 'Social media is?', type: 'mcq', opts: ['A big part of my life', 'Useful but I limit it', 'Mostly toxic, I avoid it', 'I barely use it'] },

  // CAREER & AMBITION
  { id: 'ca1', cat: 'Career & Ambition', text: 'Work is?', type: 'mcq', opts: ['My passion', 'A means to live', 'Important but not everything', 'Still figuring it out'] },
  { id: 'ca2', cat: 'Career & Ambition', text: 'Hustle culture is?', type: 'mcq', opts: ['My lifestyle', 'Admirable but not for me', 'Overrated', 'Toxic and harmful'] },
  { id: 'ca3', cat: 'Career & Ambition', text: 'In 10 years, success means?', type: 'written', opts: [] },

  // MONEY & FINANCE
  { id: 'mf1', cat: 'Money & Finance', text: 'Your spending style is?', type: 'mcq', opts: ['Save everything', 'Spend freely', 'Balance both', 'Impulsive but regret it'] },
  { id: 'mf2', cat: 'Money & Finance', text: 'Splitting bills in a relationship?', type: 'mcq', opts: ['Always 50/50', 'Whoever earns more pays more', 'Whoever offers pays', 'Depends on the situation'] },

  // HEALTH & FITNESS
  { id: 'hf1', cat: 'Health & Fitness', text: 'Exercise in your life is?', type: 'mcq', opts: ['Daily non-negotiable', 'A few times a week', 'Occasionally', 'Rarely'] },
  { id: 'hf2', cat: 'Health & Fitness', text: 'Mental health days are?', type: 'mcq', opts: ['Essential — I take them', 'Good but I feel guilty', 'I push through instead', 'I don\'t believe in them'] },

  // SPIRITUALITY
  { id: 'sp1', cat: 'Spirituality', text: 'Spirituality or religion in your life?', type: 'mcq', opts: ['Very important', 'Somewhat important', 'Not really my thing', 'Still exploring'] },
  { id: 'sp2', cat: 'Spirituality', text: 'You believe in?', type: 'msq', opts: ['Fate / destiny', 'Soulmates', 'Karma', 'Free will', 'The universe has a plan'] },

  // POLITICS & SOCIETY
  { id: 'ps1', cat: 'Politics & Society', text: 'You follow news and current events?', type: 'mcq', opts: ['Very closely', 'Casually', 'Only big events', 'Barely at all'] },
  { id: 'ps2', cat: 'Politics & Society', text: 'Differing political views in a relationship?', type: 'mcq', opts: ['Dealbreaker', 'Hard but workable', 'Doesn\'t matter at all', 'Depends how extreme'] },

  // TRAVEL & ADVENTURE
  { id: 'ta1', cat: 'Travel & Adventure', text: 'Travel style?', type: 'mcq', opts: ['Planned and organised', 'Completely spontaneous', 'Mix of both', 'Prefer staying home'] },
  { id: 'ta2', cat: 'Travel & Adventure', text: 'Adventure to you means?', type: 'mcq', opts: ['Physical challenge', 'New cultures', 'Trying new food', 'Just getting lost somewhere'] },
  { id: 'ta3', cat: 'Travel & Adventure', text: 'Dream destination?', type: 'written', opts: [] },

  // FOOD & TASTE
  { id: 'food1', cat: 'Food & Taste', text: 'Food preferences?', type: 'mcq', opts: ['Adventurous — try anything', 'Comfort food always', 'Healthy and clean', 'Depends on my mood'] },
  { id: 'food2', cat: 'Food & Taste', text: 'Cooking at home vs eating out?', type: 'mcq', opts: ['Cook every day', 'Mix of both', 'Mostly eat out', 'Order delivery always'] },

  // ENTERTAINMENT
  { id: 'en1', cat: 'Entertainment', text: 'Free evening — what do you pick?', type: 'mcq', opts: ['Netflix / series', 'Gaming', 'Reading', 'Go out somewhere'] },
  { id: 'en2', cat: 'Entertainment', text: 'Music taste?', type: 'msq', opts: ['Pop', 'Hip-hop / R&B', 'Rock / Indie', 'Classical / Jazz', 'Electronic'] },
  { id: 'en3', cat: 'Entertainment', text: 'You prefer?', type: 'mcq', opts: ['Movies', 'Series / TV shows', 'Podcasts', 'Books'] },

  // PERSONAL GROWTH
  { id: 'pg1', cat: 'Personal Growth', text: 'Self improvement for you is?', type: 'mcq', opts: ['A daily practice', 'Something I think about', 'Occasional effort', 'Not a priority right now'] },
  { id: 'pg2', cat: 'Personal Growth', text: 'Therapy / counselling is?', type: 'mcq', opts: ['Incredibly valuable — I do it', 'Something I\'d try', 'For people with serious issues', 'Not for me'] },

  // CONFLICT STYLE
  { id: 'cs1', cat: 'Conflict Style', text: 'In an argument you tend to?', type: 'mcq', opts: ['Stay calm and logical', 'Get emotional', 'Shut down', 'Find middle ground fast'] },
  { id: 'cs2', cat: 'Conflict Style', text: 'After a fight, you need?', type: 'mcq', opts: ['Immediate resolution', 'Some space first', 'A hug and move on', 'Time — days sometimes'] },

  // LOVE LANGUAGE
  { id: 'll1', cat: 'Love Language', text: 'Your primary love language?', type: 'mcq', opts: ['Words of affirmation', 'Quality time', 'Physical touch', 'Acts of service', 'Receiving gifts'] },
  { id: 'll2', cat: 'Love Language', text: 'You feel most loved when?', type: 'mcq', opts: ['Someone remembers small details', 'They make time for you', 'They check in randomly', 'They do things without being asked'] },

  // RED FLAGS
  { id: 'rf1', cat: 'Red Flags', text: 'Biggest deal-breaker in a relationship?', type: 'msq', opts: ['Dishonesty', 'Lack of ambition', 'Poor communication', 'Disrespect', 'Emotional unavailability'] },
  { id: 'rf2', cat: 'Red Flags', text: 'A partner who checks your phone is?', type: 'mcq', opts: ['A total dealbreaker', 'A red flag but understandable', 'Okay if there\'s a reason', 'Fine, I have nothing to hide'] },
  { id: 'rf3', cat: 'Red Flags', text: 'Past relationship count — does it matter?', type: 'mcq', opts: ['Not at all', 'A little, I\'m honest', 'Depends on the number', 'Yes it matters to me'] },
];

// ─── SCORING CONFIG ──────────────────────────────────────────
export const SCORING = {
  exactMatchPoints: 1,       // MCQ exact match
  nearMatchPoints: 0.2,      // MCQ different answer (partial credit)
  writtenBothAnswered: 0.5,  // Written — both answered = partial credit
  skippedWeight: 0,          // B skipped = 0 contribution (neutral)
};

// ─── UI CONFIG ───────────────────────────────────────────────
export const UI = {
  maxQuestionsPerSession: 30,
  defaultQCount: 10,
  sessionTokenLength: 16,
};
