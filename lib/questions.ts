// Constellation Question Deck - 40 Questions
// Each question works across two timeframes: recency (past few weeks) and timelessness (any time)

export interface Question {
  id: number;
  text: string;
  section: string;
}

export const QUESTIONS: Question[] = [
  // SECTION 1 — Decisions, Values & Tradeoffs
  {
    id: 1,
    section: "Decisions, Values & Tradeoffs",
    text: "Think of a moment — recently or from any time in your life — when you didn't want to show up for someone but either did or didn't. What drove your decision?",
  },
  {
    id: 2,
    section: "Decisions, Values & Tradeoffs",
    text: "Describe a moment — in the past few weeks or from years ago — when you chose comfort over contribution. Why did that choice make sense then?",
  },
  {
    id: 3,
    section: "Decisions, Values & Tradeoffs",
    text: "Recall a time — recent or older — when you misunderstood something important. How did you recover, and what did the experience teach you?",
  },
  {
    id: 4,
    section: "Decisions, Values & Tradeoffs",
    text: "In a recent busy stretch, or at any point in your life, what was the first thing you deprioritized — and what never gets cut?",
  },
  {
    id: 5,
    section: "Decisions, Values & Tradeoffs",
    text: "What's a belief about relationships, community, or responsibility that you've held recently — or always — even if others disagree?",
  },
  {
    id: 6,
    section: "Decisions, Values & Tradeoffs",
    text: "Think of a small decision — either this month or from the past — that reflected a deeper value of yours. What was it?",
  },
  {
    id: 7,
    section: "Decisions, Values & Tradeoffs",
    text: "In a recent challenge or one from the past, what was your instinct: fix the problem, fix the people, or wait? What does that reveal about you?",
  },
  {
    id: 8,
    section: "Decisions, Values & Tradeoffs",
    text: "Describe a moment — lately or from earlier in life — when you realized you were giving too much or not giving enough. What shifted afterward?",
  },
  // SECTION 2 — Autonomy, Identity & Internal Compass
  {
    id: 9,
    section: "Autonomy, Identity & Internal Compass",
    text: "In a recent chaotic moment — or one from your past — did you tighten structure or loosen it? How did you learn that about yourself?",
  },
  {
    id: 10,
    section: "Autonomy, Identity & Internal Compass",
    text: "Think of a time — recently or long ago — when you had to decide between clarity and speed. Which did you choose and why?",
  },
  {
    id: 11,
    section: "Autonomy, Identity & Internal Compass",
    text: "Recently or earlier in life, when have people misunderstood you at first? What's the truth underneath that impression?",
  },
  {
    id: 12,
    section: "Autonomy, Identity & Internal Compass",
    text: "Tell a story — from the past month or any chapter of your life — that explains why you are the way you are today.",
  },
  {
    id: 13,
    section: "Autonomy, Identity & Internal Compass",
    text: "What boundary have you strengthened recently — or at some pivotal moment in your past — and what prompted that change?",
  },
  {
    id: 14,
    section: "Autonomy, Identity & Internal Compass",
    text: "What's something you used to believe about yourself that you no longer believe? Did that shift happen recently or long ago?",
  },
  {
    id: 15,
    section: "Autonomy, Identity & Internal Compass",
    text: "Describe a moment — this month or from another season of life — when you acted differently than your usual pattern. What caused the deviation?",
  },
  // SECTION 3 — Relationships, Connection & Showing Up
  {
    id: 16,
    section: "Relationships, Connection & Showing Up",
    text: "Think of a moment — recent or older — when you opened up to someone unexpectedly. What made that possible?",
  },
  {
    id: 17,
    section: "Relationships, Connection & Showing Up",
    text: "Tell a story — from this month or anywhere in your life — about a time you stepped up without being asked. What made you feel responsible?",
  },
  {
    id: 18,
    section: "Relationships, Connection & Showing Up",
    text: "What's one uncomfortable thing you did — recently or in the past — for the sake of someone you care about?",
  },
  {
    id: 19,
    section: "Relationships, Connection & Showing Up",
    text: "When did you last feel resentment in a group — this month or at some earlier time? What expectation sat underneath that feeling?",
  },
  {
    id: 20,
    section: "Relationships, Connection & Showing Up",
    text: "Think of a recent conflict or one from years ago. What did it teach you about your conflict style?",
  },
  {
    id: 21,
    section: "Relationships, Connection & Showing Up",
    text: "Describe a moment — recent or from any stage of life — when you felt truly seen. What made that moment stand out?",
  },
  {
    id: 22,
    section: "Relationships, Connection & Showing Up",
    text: "Recently or historically, how do you decide whether someone is worth deeper investment in your life?",
  },
  // SECTION 4 — Growth, Learning & Adaptation
  {
    id: 23,
    section: "Growth, Learning & Adaptation",
    text: "Describe a time — recently or earlier in life — when you learned something faster than expected. What allowed that acceleration?",
  },
  {
    id: 24,
    section: "Growth, Learning & Adaptation",
    text: "Describe a moment — this month or from the past — when learning something took longer than expected. What made it challenging?",
  },
  {
    id: 25,
    section: "Growth, Learning & Adaptation",
    text: "What's the last meaningful thing you changed your mind about? Did the shift happen recently or gradually over time?",
  },
  {
    id: 26,
    section: "Growth, Learning & Adaptation",
    text: "Think of a moment — from the past few weeks or much earlier — when you tried something new and weren't good at it. What happened next?",
  },
  {
    id: 27,
    section: "Growth, Learning & Adaptation",
    text: "What's the most surprising thing you've learned about yourself — either recently or in the last few years?",
  },
  {
    id: 28,
    section: "Growth, Learning & Adaptation",
    text: "What's a skill or trait you're actively reshaping — now or during a past chapter — and why does it matter to you?",
  },
  // SECTION 5 — Purpose, Ambition & Fulfillment
  {
    id: 29,
    section: "Purpose, Ambition & Fulfillment",
    text: "When you imagine your ideal year — now or at a time you once lived — what are you optimizing for, and why?",
  },
  {
    id: 30,
    section: "Purpose, Ambition & Fulfillment",
    text: "Think of the happiest period of your life — recent or distant. What conditions made it possible?",
  },
  {
    id: 31,
    section: "Purpose, Ambition & Fulfillment",
    text: "What's a long-term goal you've been circling — now or historically — but haven't acted on yet? What's holding you back?",
  },
  {
    id: 32,
    section: "Purpose, Ambition & Fulfillment",
    text: "What's something you're proud of — recently or privately from your past — that no one else knows about?",
  },
  {
    id: 33,
    section: "Purpose, Ambition & Fulfillment",
    text: "What are you working toward — now or at another moment in life — that feels meaningful but also intimidating?",
  },
  {
    id: 34,
    section: "Purpose, Ambition & Fulfillment",
    text: "What do you want future you to thank present you for — this month, this year, or in the long run?",
  },
  // SECTION 6 — Community, Leadership & Shared Life
  {
    id: 35,
    section: "Community, Leadership & Shared Life",
    text: "Recently or across your life, how do you decide whether organizing something for a group should fall to you?",
  },
  {
    id: 36,
    section: "Community, Leadership & Shared Life",
    text: "Describe a moment — recent or from an earlier season — when you strengthened a community around you, intentionally or accidentally.",
  },
  {
    id: 37,
    section: "Community, Leadership & Shared Life",
    text: "What's something you quietly contribute — now or habitually in the past — that often goes unnoticed?",
  },
  {
    id: 38,
    section: "Community, Leadership & Shared Life",
    text: "Think about a time — recent or long ago — when you felt part of something bigger than yourself. What made it meaningful?",
  },
  {
    id: 39,
    section: "Community, Leadership & Shared Life",
    text: "What role do you wish you played more often in your communities — now or historically — and what stops you?",
  },
  {
    id: 40,
    section: "Community, Leadership & Shared Life",
    text: "If community were a bank account, what do you tend to deposit and withdraw — recently or throughout your life?",
  },
];

// Get question by ID
export function getQuestionById(id: number): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

// Get 4 random questions
export function getRandomQuestions(count: number = 4): Question[] {
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Get questions by IDs
export function getQuestionsByIds(ids: number[]): Question[] {
  return ids.map((id) => getQuestionById(id)).filter((q): q is Question => q !== undefined);
}

// Get single question by ID (alias for clarity)
