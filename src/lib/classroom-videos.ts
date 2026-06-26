import { Brain, CalendarDays, ClipboardList, Compass, FileText, MapPinned, ShieldCheck, type LucideIcon } from "lucide-react";
import type { SeatTier } from "@/lib/tiers";

export type ClassroomVideoCategory =
  | "Start Here"
  | "Legal + Records"
  | "Weekly Rhythm"
  | "Learner Support"
  | "Pods + Community";

export type ClassroomVideo = {
  id: string;
  title: string;
  category: ClassroomVideoCategory;
  tier: SeatTier;
  duration: string;
  icon: LucideIcon;
  summary: string;
  outcomes: string[];
  videoUrl?: string;
  starterPathOrder?: number;
};

export const classroomVideoCategories: ClassroomVideoCategory[] = [
  "Start Here",
  "Legal + Records",
  "Weekly Rhythm",
  "Learner Support",
  "Pods + Community",
];

export const classroomVideos: ClassroomVideo[] = [
  {
    id: "orientation-how-to-use-seat-squad",
    title: "How to Use SEAT Squad Without Getting Overwhelmed",
    category: "Start Here",
    tier: "free",
    duration: "8 min",
    icon: Compass,
    summary: "A quick orientation to the forum, resources, Live Q&A, weekly recap, and first useful member actions.",
    outcomes: ["Pick your first action", "Know where to ask what", "Use the dashboard as a calm home base"],
    starterPathOrder: 1,
  },
  {
    id: "first-30-days-homeschool",
    title: "The First 30 Days After Leaving Traditional School",
    category: "Start Here",
    tier: "free",
    duration: "14 min",
    icon: CalendarDays,
    summary: "A low-pressure first-month rhythm for families leaving, pausing, or supplementing school.",
    outcomes: ["Avoid overbuilding", "Create a reset month", "Notice what your learner needs first"],
    starterPathOrder: 2,
  },
  {
    id: "records-and-evidence",
    title: "Records, Attendance, and Evidence Without Panic",
    category: "Legal + Records",
    tier: "member",
    duration: "18 min",
    icon: FileText,
    summary: "A practical walkthrough for keeping useful records without turning home learning into paperwork theater.",
    outcomes: ["Track attendance", "Collect portfolio evidence", "Know what to save weekly"],
    starterPathOrder: 3,
  },
  {
    id: "weekly-learning-rhythm",
    title: "Build a Weekly Learning Rhythm That Bends",
    category: "Weekly Rhythm",
    tier: "member",
    duration: "16 min",
    icon: ClipboardList,
    summary: "Design a week around energy, appointments, care work, interest, and recovery.",
    outcomes: ["Choose anchor blocks", "Balance heavy/light days", "Plan one repair slot"],
    starterPathOrder: 4,
  },
  {
    id: "neurodivergent-supports",
    title: "Adjust the Environment Before Blaming Motivation",
    category: "Learner Support",
    tier: "member",
    duration: "20 min",
    icon: Brain,
    summary: "A family-friendly lens for sensory load, transitions, executive function, and task size.",
    outcomes: ["Spot hidden friction", "Test one support", "Reduce unnecessary battles"],
  },
  {
    id: "pod-fit-and-safety",
    title: "How to Evaluate a Pod, Co-op, or Microschool",
    category: "Pods + Community",
    tier: "pro",
    duration: "22 min",
    icon: MapPinned,
    summary: "Questions to ask before joining a group, from cost and schedule to inclusion and safety.",
    outcomes: ["Assess fit", "Ask better questions", "Protect learner belonging"],
  },
  {
    id: "ai-use-agreements",
    title: "Family AI Use Agreements and Evidence Receipts",
    category: "Learner Support",
    tier: "pro",
    duration: "19 min",
    icon: ShieldCheck,
    summary: "Set AI expectations that protect trust, authorship, and thinking rather than relying on surveillance.",
    outcomes: ["Set family AI rules", "Use evidence receipts", "Discuss authorship clearly"],
  },
];

export const starterCurriculumPath = classroomVideos
  .filter((video) => video.starterPathOrder)
  .sort((a, b) => (a.starterPathOrder || 0) - (b.starterPathOrder || 0));
