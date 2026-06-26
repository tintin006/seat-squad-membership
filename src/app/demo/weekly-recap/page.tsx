import { WeeklyRecapPage } from "@/components/weekly-recap/weekly-recap-page";

const demoThreads = [
  {
    id: "post-welcome",
    title: "Welcome to the founding SEAT Squad week",
    content:
      "Start with one thing: introduce yourself and name the learning-life friction closest to today.",
    created_at: "2026-06-26T10:00:00-04:00",
    channel: { name: "General", slug: "general", color: "#fb8b24" },
  },
  {
    id: "post-reset",
    title: "Weekly reset: what would make next week lighter?",
    content:
      "Choose one: structure, curriculum, confidence, accountability, community, tutor support, or local group connection.",
    created_at: "2026-06-25T14:30:00-04:00",
    channel: { name: "Start Here", slug: "start-here", color: "#0f4c5c" },
  },
  {
    id: "post-crate",
    title: "Crate request thread: guides, planners, calendars, lesson plans",
    content:
      "Drop the resource you wish already existed, from attendance trackers to AI literacy mini-units.",
    created_at: "2026-06-24T09:45:00-04:00",
    channel: { name: "Crate Requests", slug: "crate-requests", color: "#5f0f40" },
  },
];

export default function DemoWeeklyRecapPage() {
  return (
    <WeeklyRecapPage
      hrefPrefix="/demo"
      latestThreads={demoThreads}
      memberCount={27}
      approvedGroupCount={90}
    />
  );
}
