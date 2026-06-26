import {
  Archive,
  BadgeDollarSign,
  FileText,
  GraduationCap,
  MapPinned,
  type LucideIcon,
} from "lucide-react";

export type DownloadTier = "free" | "member" | "pro";

export type DownloadCategory = "ESA State Guides" | "Lesson Packs" | "Planners" | "Directories";

export type DigitalDownload = {
  id: string;
  title: string;
  state?: string;
  category: DownloadCategory;
  tier: DownloadTier;
  fileHref: string;
  storageBucket?: string;
  storagePath?: string;
  format: "PDF";
  pages: string;
  updated: string;
  icon: LucideIcon;
  summary: string;
  bestFor: string[];
  inside: string[];
};

export const digitalDownloads: DigitalDownload[] = [
  {
    id: "florida-homeschool-guide",
    title: "Florida Homeschool + ESA Resource Guide",
    state: "FL",
    category: "ESA State Guides",
    tier: "free",
    fileHref: "/api/resources/download/florida-homeschool-guide",
    storageBucket: "seat-private",
    storagePath: "downloads/esa-state-guides/florida-homeschool-guide.pdf",
    format: "PDF",
    pages: "40 pages",
    updated: "June 2026",
    icon: BadgeDollarSign,
    summary:
      "A practical Florida guide for homeschool options, PEP/ESA pathways, special needs supports, LGBTQ+ family considerations, and inclusive resources.",
    bestFor: ["Florida families", "ESA planning", "Families comparing homeschool options"],
    inside: ["Legal options", "PEP and scholarship notes", "Special needs supports", "Templates and checklists"],
  },
  {
    id: "georgia-homeschool-guide",
    title: "Georgia Homeschool + ESA Resource Guide",
    state: "GA",
    category: "ESA State Guides",
    tier: "free",
    fileHref: "/api/resources/download/georgia-homeschool-guide",
    storageBucket: "seat-private",
    storagePath: "downloads/esa-state-guides/georgia-homeschool-guide.pdf",
    format: "PDF",
    pages: "35 pages",
    updated: "June 2026",
    icon: GraduationCap,
    summary:
      "A Georgia guide covering home study requirements, Promise Scholarship context, special needs pathways, LGBTQ+ family considerations, and inclusive resources.",
    bestFor: ["Georgia families", "Home study setup", "Scholarship research"],
    inside: ["Required subjects", "Testing rhythm", "Promise Scholarship notes", "Resource directory"],
  },
  {
    id: "north-carolina-homeschool-guide",
    title: "North Carolina Homeschool + ESA Resource Guide",
    state: "NC",
    category: "ESA State Guides",
    tier: "free",
    fileHref: "/api/resources/download/north-carolina-homeschool-guide",
    storageBucket: "seat-private",
    storagePath: "downloads/esa-state-guides/north-carolina-homeschool-guide.pdf",
    format: "PDF",
    pages: "30 pages",
    updated: "June 2026",
    icon: Archive,
    summary:
      "A North Carolina guide for DNPE setup, annual testing, ESA and Opportunity Scholarship notes, disability supports, and practical record planning.",
    bestFor: ["North Carolina families", "Record planning", "Scholarship comparison"],
    inside: ["DNPE requirements", "Annual test notes", "ESA/Opportunity overview", "Portfolio planning"],
  },
  {
    id: "arizona-homeschool-guide",
    title: "Arizona Homeschool + ESA Resource Guide",
    state: "AZ",
    category: "ESA State Guides",
    tier: "free",
    fileHref: "/api/resources/download/arizona-homeschool-guide",
    storageBucket: "seat-private",
    storagePath: "downloads/esa-state-guides/arizona-homeschool-guide.pdf",
    format: "PDF",
    pages: "30 pages",
    updated: "June 2026",
    icon: MapPinned,
    summary:
      "An Arizona guide covering affidavit basics, universal ESA context, special needs considerations, inclusive resources, and practical setup steps.",
    bestFor: ["Arizona families", "Universal ESA planning", "Low-regulation homeschool setup"],
    inside: ["Affidavit overview", "ESA notes", "Inclusive resources", "Planning checklists"],
  },
  {
    id: "tennessee-homeschool-guide",
    title: "Tennessee Homeschool + ESA Resource Guide",
    state: "TN",
    category: "ESA State Guides",
    tier: "free",
    fileHref: "/api/resources/download/tennessee-homeschool-guide",
    storageBucket: "seat-private",
    storagePath: "downloads/esa-state-guides/tennessee-homeschool-guide.pdf",
    format: "PDF",
    pages: "30 pages",
    updated: "June 2026",
    icon: FileText,
    summary:
      "A Tennessee guide for independent homeschool, church-related school, online options, ESA context, disability supports, and family considerations.",
    bestFor: ["Tennessee families", "Option comparison", "Families needing compliance clarity"],
    inside: ["Three homeschool options", "ESA/IEA notes", "LGBTQ+ family considerations", "Templates"],
  },
  {
    id: "weekly-rhythm-planner-pack",
    title: "Weekly Rhythm Planner Pack",
    category: "Planners",
    tier: "member",
    fileHref: "#",
    format: "PDF",
    pages: "Coming soon",
    updated: "Preview",
    icon: FileText,
    summary:
      "A member planner bundle for weekly anchors, attendance notes, portfolio evidence, outings, and reset reflections.",
    bestFor: ["Member planning rhythm", "Portfolio evidence", "Families needing structure without recreating school"],
    inside: ["Weekly anchor planner", "Attendance and outings tracker", "Evidence log", "Reset reflection"],
  },
  {
    id: "ai-literacy-mini-unit",
    title: "AI Literacy Mini-Unit",
    category: "Lesson Packs",
    tier: "pro",
    fileHref: "#",
    format: "PDF",
    pages: "Coming soon",
    updated: "Preview",
    icon: GraduationCap,
    summary:
      "A pro lesson pack for AI use agreements, evidence receipts, prompt reflection, authorship, and family discussion.",
    bestFor: ["AI literacy", "Portfolio assessment", "Middle and high school learners"],
    inside: ["Family AI agreement", "Prompt reflection", "Evidence receipts", "Discussion guide"],
  },
];

export const downloadCategories = Array.from(new Set(digitalDownloads.map((download) => download.category)));

export const tierLabels: Record<DownloadTier, string> = {
  free: "Free for all members",
  member: "Member",
  pro: "Pro",
};
