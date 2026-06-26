import {
  BookOpen,
  Brain,
  CalendarDays,
  ClipboardList,
  Compass,
  HeartHandshake,
  Lightbulb,
  MessageCircle,
  Route,
  Sparkles,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";

export type ResourceTrack =
  | "Start Here"
  | "Quick Relief"
  | "Learning Rhythm"
  | "Neurodivergent Support"
  | "Confidence Repair"
  | "The Crate"
  | "Tutor Fit";

export type MemberResource = {
  id: string;
  title: string;
  subtitle: string;
  track: ResourceTrack;
  format: "Guide" | "Checklist" | "Template" | "Script" | "Planner";
  time: string;
  icon: LucideIcon;
  summary: string;
  bestFor: string[];
  inside: string[];
  nextStep: string;
};

export const memberResources: MemberResource[] = [
  {
    id: "seat-start-here",
    title: "SEAT Squad Start Here Guide",
    subtitle: "A calm first map for new members.",
    track: "Start Here",
    format: "Guide",
    time: "10 min",
    icon: Compass,
    summary:
      "A short orientation to what this community is for, how to ask for help, and where to begin without feeling behind.",
    bestFor: ["New members", "Families deciding what to ask first", "Educators joining the community"],
    inside: ["Community norms", "First three actions", "Where to post what", "How SEAT Squad connects to Remix Academics"],
    nextStep: "Introduce yourself and name one thing that would make this month easier.",
  },
  {
    id: "first-30-days",
    title: "First 30 Days After Leaving Traditional School",
    subtitle: "A humane reset for families in transition.",
    track: "Quick Relief",
    format: "Guide",
    time: "20 min",
    icon: Route,
    summary:
      "A practical transition guide for families who are leaving, pausing, or supplementing traditional school and need a sane first month.",
    bestFor: ["New homeschoolers", "Hybrid families", "Families recovering from school stress"],
    inside: ["Week-by-week reset", "What not to overbuild", "Conversation prompts", "Signs your learner needs rest first"],
    nextStep: "Choose one anchor routine and one low-pressure learning win for the week.",
  },
  {
    id: "weekly-reset",
    title: "Weekly Learning Reset Template",
    subtitle: "Turn the week into useful information.",
    track: "Learning Rhythm",
    format: "Template",
    time: "12 min",
    icon: CalendarDays,
    summary:
      "A simple weekly reflection that helps families notice what worked, what dragged, and what to change next.",
    bestFor: ["Busy caregivers", "Hybrid homeschoolers", "Families trying to reduce friction"],
    inside: ["Worked / Wobbled / Try next", "Energy scan", "Subject friction tracker", "One-change planning"],
    nextStep: "Post one reset insight in the weekly thread.",
  },
  {
    id: "strengths-friction-map",
    title: "Learner Strengths + Friction Map",
    subtitle: "See the learner before fixing the lesson.",
    track: "Start Here",
    format: "Template",
    time: "18 min",
    icon: Target,
    summary:
      "A learner profile tool that separates strengths, interests, stress points, and support needs before jumping to solutions.",
    bestFor: ["Parents", "Tutors", "Learners with uneven academic profiles"],
    inside: ["Strength inventory", "Friction map", "Motivation clues", "Support hypotheses"],
    nextStep: "Pick one strength to use as the doorway into a hard subject.",
  },
  {
    id: "neurodivergent-checklist",
    title: "Neurodivergent Learning Support Checklist",
    subtitle: "Adjust the environment before blaming motivation.",
    track: "Neurodivergent Support",
    format: "Checklist",
    time: "15 min",
    icon: Brain,
    summary:
      "A practical checklist for noticing sensory load, executive function friction, transitions, attention, and communication needs.",
    bestFor: ["ADHD learners", "Autistic learners", "Twice-exceptional learners", "Caregivers seeking accommodations"],
    inside: ["Environment scan", "Task-size check", "Transition supports", "Choice and autonomy prompts"],
    nextStep: "Test one environmental support for three days before changing the curriculum.",
  },
  {
    id: "rhythm-builder",
    title: "Family Learning Rhythm Builder",
    subtitle: "A weekly structure that bends without breaking.",
    track: "Learning Rhythm",
    format: "Planner",
    time: "25 min",
    icon: ClipboardList,
    summary:
      "A flexible planning tool for designing a learning week around energy, care work, appointments, interests, and real life.",
    bestFor: ["Families with irregular schedules", "Caregivers balancing work and learning", "Pods and co-ops"],
    inside: ["Anchor blocks", "Light/heavy day planning", "Recovery slots", "Flexible subject rotation"],
    nextStep: "Build one week with fewer transitions than you think you need.",
  },
  {
    id: "kid-refuses-scripts",
    title: "When My Kid Refuses Conversation Scripts",
    subtitle: "Scripts for repair, not power struggles.",
    track: "Quick Relief",
    format: "Script",
    time: "10 min",
    icon: MessageCircle,
    summary:
      "Plainspoken scripts for approaching refusal, shutdown, bargaining, avoidance, and big feelings with more curiosity and less escalation.",
    bestFor: ["Parents in daily learning battles", "Learners rebuilding trust", "Tutors entering tense situations"],
    inside: ["Opening lines", "Repair statements", "Choice prompts", "Exit ramps"],
    nextStep: "Use one script once, then notice what changed in the learner's body language.",
  },
  {
    id: "math-confidence",
    title: "Math Confidence Repair Starter",
    subtitle: "Rebuild safety before speed.",
    track: "Confidence Repair",
    format: "Guide",
    time: "20 min",
    icon: Sparkles,
    summary:
      "A starter guide for learners who have decided they are bad at math and need visible wins before harder instruction.",
    bestFor: ["Math-anxious learners", "Middle and high school families", "Tutors designing first sessions"],
    inside: ["Confidence audit", "Low-stakes math wins", "Error-friendly routines", "When to slow down"],
    nextStep: "Choose one skill the learner can already do and make it visible.",
  },
  {
    id: "reading-triage",
    title: "Reading Struggle Triage Guide",
    subtitle: "Find the kind of reading problem before picking a tool.",
    track: "Confidence Repair",
    format: "Checklist",
    time: "20 min",
    icon: BookOpen,
    summary:
      "A practical triage guide for separating decoding, fluency, comprehension, attention, confidence, and language-load challenges.",
    bestFor: ["Caregivers worried about reading", "Tutors", "Learners masking struggle"],
    inside: ["Observation prompts", "Red flags", "Support matches", "Questions for specialists"],
    nextStep: "Observe one reading session without correcting, then map what you actually saw.",
  },
  {
    id: "interest-project",
    title: "Interest-Led Project Planner",
    subtitle: "Turn a real interest into real learning.",
    track: "The Crate",
    format: "Planner",
    time: "25 min",
    icon: Lightbulb,
    summary:
      "A project planner that turns games, music, cooking, sports, fashion, nature, or internet rabbit holes into structured learning.",
    bestFor: ["Unschooling families", "Reluctant learners", "Creative educators"],
    inside: ["Interest interview", "Skill mapping", "Project options", "Evidence of learning ideas"],
    nextStep: "Ask the learner what they would happily explain for ten minutes.",
  },
  {
    id: "tutor-fit",
    title: "Tutor/Educator Fit Checklist",
    subtitle: "Hire for trust, not just credentials.",
    track: "Tutor Fit",
    format: "Checklist",
    time: "15 min",
    icon: Users,
    summary:
      "A fit checklist for choosing tutors, coaches, or educators who understand the learner, the family context, and the support goal.",
    bestFor: ["Families seeking tutors", "Educators explaining fit", "Learning coaches"],
    inside: ["Interview questions", "Fit signals", "Warning signs", "Trial-session notes"],
    nextStep: "Name the support job before searching for a person.",
  },
  {
    id: "crate-request-remix",
    title: "The Crate Request + Remix Template",
    subtitle: "Ask for the resource you actually need.",
    track: "The Crate",
    format: "Template",
    time: "12 min",
    icon: HeartHandshake,
    summary:
      "A template for requesting practical tools from The Crate and remixing existing lessons for your learner's context.",
    bestFor: ["Members requesting resources", "Educators sharing tools", "Parents adapting schoolwork"],
    inside: ["Request format", "Learner context fields", "Constraint check", "Remix prompts"],
    nextStep: "Post one Crate request with learner context and the friction you want to solve.",
  },
];

export const tracks = Array.from(new Set(memberResources.map((resource) => resource.track)));

export const liveEventPlaceholder = {
  title: "Founding Member Orientation",
  status: "Date to be announced",
  description:
    "A recurring live gathering will be added after the first founding members help choose the best rhythm and format.",
  focusAreas: ["Community walkthrough", "Family needs listening", "Resource priorities", "Next-step support"],
};
