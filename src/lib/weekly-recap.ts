import { digitalDownloads } from "@/lib/digital-downloads";
import { remixReportArticles } from "@/lib/remix-report";

export type WeeklyRecapItem = {
  title: string;
  description: string;
  href: string;
  eyebrow: string;
};

export const weeklyRecapIssue = {
  issue: "Founding Week Brief",
  dateLabel: "June 26, 2026",
  subject: "Your SEAT Squad weekly reset: guides, groups, Q&A, and one next step",
  intro:
    "This weekly recap turns the community into a rhythm: what members are asking, what resources are ready, what is coming live, and one practical action to take before next week.",
  featuredDownload: digitalDownloads[0],
  featuredSignal: remixReportArticles[0],
  nextStep:
    "Choose one thing that would make next week lighter, then post it in the forum or bring it to Live Q&A.",
};

export const weeklyRecapSections: WeeklyRecapItem[] = [
  {
    eyebrow: "Start here",
    title: "Introduce yourself with one real friction point",
    description:
      "A useful founding community starts with specific context. Name the thing you are trying to solve this month.",
    href: "/forum",
  },
  {
    eyebrow: "Resource",
    title: "Download the ESA and homeschool guides",
    description:
      "The first resource library is live with state guides for Florida, Georgia, North Carolina, Arizona, and Tennessee.",
    href: "/resources",
  },
  {
    eyebrow: "Directory",
    title: "Find or submit a pod, co-op, microschool, or homeschool group",
    description:
      "The directory is seeded and ready for members to search by state or add a local group for review.",
    href: "/pods",
  },
  {
    eyebrow: "Live",
    title: "RSVP for orientation or submit a Q&A question",
    description:
      "Orientation helps new members understand the space. Weekly Q&A turns member questions into shared next steps.",
    href: "/events",
  },
];
