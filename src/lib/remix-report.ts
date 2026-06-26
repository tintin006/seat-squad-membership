export type RemixReportPillar =
  | "The Learning Shift"
  | "Family Strategy"
  | "Teacher/Tutor Field Notes"
  | "The Remix Method"
  | "Culture & Identity"
  | "Community Markets";

export type RemixReportArticle = {
  id: string;
  title: string;
  dek: string;
  date: string;
  readTime: string;
  pillar: RemixReportPillar;
  tags: string[];
  memberTakeaway: string;
  discussionPrompt: string;
  qAndAPrompt: string;
  relatedResourceHref?: string;
  publicHref: string;
  status: "Published" | "Signal brief" | "Draft seed";
};

export const remixReportPillars: RemixReportPillar[] = [
  "The Learning Shift",
  "Family Strategy",
  "Teacher/Tutor Field Notes",
  "The Remix Method",
  "Culture & Identity",
  "Community Markets",
];

export const remixReportArticles: RemixReportArticle[] = [
  {
    id: "ai-use-agreement",
    title: "The AI Use Agreement Families Need Before the Next Shortcut Appears",
    dek: "AI rules work better when they protect thinking, trust, and authorship instead of pretending students will never use the tools.",
    date: "2026-06-07",
    readTime: "7 min",
    pillar: "Family Strategy",
    tags: ["AI literacy", "Parent strategy", "Learning routines"],
    memberTakeaway: "Build an AI agreement around disclosure, reflection, and what the learner still has to be able to explain.",
    discussionPrompt: "What AI use rule would make your home feel calmer without turning every assignment into surveillance?",
    qAndAPrompt: "How do I create an AI use agreement that protects my child's thinking without banning useful tools?",
    relatedResourceHref: "/resources",
    publicHref: "https://remixacademics.com/the-remix-report/ai-use-agreement",
    status: "Signal brief",
  },
  {
    id: "summer-support-gap",
    title: "The Summer Support Gap Is Where Families Start Looking for a New Model",
    dek: "Summer is not just a break. It is when families notice which supports disappear, which skills wobble, and which learning rhythms need rebuilding.",
    date: "2026-06-02",
    readTime: "6 min",
    pillar: "Community Markets",
    tags: ["Summer learning", "Tutoring", "Pods"],
    memberTakeaway: "Use summer as a low-pressure diagnostic: what support does your learner actually need before fall decisions harden?",
    discussionPrompt: "What support disappears for your family in summer, and what would make that gap less stressful?",
    qAndAPrompt: "What should I prioritize during summer if my child needs support but I do not want to recreate school at home?",
    relatedResourceHref: "/pods",
    publicHref: "https://remixacademics.com/the-remix-report/summer-support-gap",
    status: "Signal brief",
  },
  {
    id: "ai-evidence-receipts",
    title: "AI Evidence Receipts: The New Skill Is Showing Your Work Differently",
    dek: "As AI enters schoolwork, the useful question is not just whether a learner used a tool. It is whether they can show judgment, process, and revision.",
    date: "2026-05-29",
    readTime: "8 min",
    pillar: "The Learning Shift",
    tags: ["AI", "Assessment", "Portfolio"],
    memberTakeaway: "Portfolios need process artifacts: prompts, drafts, corrections, explanations, and what changed after feedback.",
    discussionPrompt: "What would count as real evidence of thinking in your learner's work this month?",
    qAndAPrompt: "How do I document learning when my child uses AI for brainstorming or revision?",
    relatedResourceHref: "/resources",
    publicHref: "https://remixacademics.com/the-remix-report/ai-evidence-receipts",
    status: "Signal brief",
  },
  {
    id: "sunday-night-planning",
    title: "The Sunday-Night Planning Session Is a Family Learning System",
    dek: "The week gets lighter when families stop planning only subjects and start planning energy, friction, appointments, evidence, and repair.",
    date: "2026-05-22",
    readTime: "5 min",
    pillar: "The Remix Method",
    tags: ["Planning", "Family rhythm", "Homeschool"],
    memberTakeaway: "Plan the week around the learner's actual life: energy, transitions, care work, and one meaningful win.",
    discussionPrompt: "What is one planning question that would make next week easier in your house?",
    qAndAPrompt: "What should go into a weekly homeschool planning rhythm besides lessons and attendance?",
    relatedResourceHref: "/resources",
    publicHref: "https://remixacademics.com/the-remix-report/sunday-night-planning",
    status: "Draft seed",
  },
  {
    id: "tutor-trust-signal",
    title: "Families Are Not Just Hiring Tutors. They Are Hiring Trust.",
    dek: "The next tutor market belongs to educators who can explain fit, communicate clearly, and support the whole learner context.",
    date: "2026-05-15",
    readTime: "6 min",
    pillar: "Teacher/Tutor Field Notes",
    tags: ["Tutoring", "Teacher transition", "Family trust"],
    memberTakeaway: "Credentials matter, but families also need clarity: what problem are we solving, how will we know it is working, and how will the learner feel seen?",
    discussionPrompt: "What would make you trust a tutor or learning coach before the first paid session?",
    qAndAPrompt: "What questions should I ask before hiring a tutor for a neurodivergent or homeschool learner?",
    relatedResourceHref: "/tutors",
    publicHref: "https://remixacademics.com/the-remix-report/tutor-trust-signal",
    status: "Draft seed",
  },
  {
    id: "belonging-in-alt-learning",
    title: "Alternative Learning Still Has to Answer the Belonging Question",
    dek: "A flexible learning path only works if the learner has identity safety, peer connection, adult trust, and places to be known.",
    date: "2026-05-08",
    readTime: "7 min",
    pillar: "Culture & Identity",
    tags: ["Belonging", "Identity", "Community"],
    memberTakeaway: "When evaluating a pod, co-op, tutor, or curriculum, ask what kind of belonging it creates, not only what content it covers.",
    discussionPrompt: "Where does your learner feel most known right now, and where are they still masking?",
    qAndAPrompt: "How do I evaluate whether a homeschool group or pod is genuinely affirming for my child?",
    relatedResourceHref: "/pods",
    publicHref: "https://remixacademics.com/the-remix-report/belonging-in-alt-learning",
    status: "Draft seed",
  },
];
