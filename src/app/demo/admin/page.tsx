import { ContentControls, type AdminContentPost } from "@/components/admin/content-controls";
import {
  TutorConnectionQueue,
  type PendingTutorProfile,
  type PendingTutorRequest,
} from "@/components/admin/tutor-connection-queue";
import { WeeklyRecapDelivery } from "@/components/admin/weekly-recap-delivery";

const now = new Date("2026-06-26T10:00:00-04:00").toISOString();

const demoPosts: AdminContentPost[] = [
  {
    id: "post-welcome",
    title: "Welcome to the founding SEAT Squad week",
    content:
      "Start with one thing: introduce yourself and name the learning-life friction closest to today.",
    is_pinned: true,
    is_announcement: true,
    is_locked: false,
    created_at: now,
    channel: { name: "General", slug: "general", color: "#fb8b24" },
    author: { display_name: "Chris Linder", role: "admin" },
  },
  {
    id: "post-reset",
    title: "Weekly reset: what would make next week lighter?",
    content:
      "Choose one: structure, curriculum, confidence, accountability, community, tutor support, or local group connection.",
    is_pinned: false,
    is_announcement: false,
    is_locked: false,
    created_at: "2026-06-25T14:30:00-04:00",
    channel: { name: "Start Here", slug: "start-here", color: "#0f4c5c" },
    author: { display_name: "Tendi Team", role: "admin" },
  },
  {
    id: "post-crate",
    title: "Crate request thread: guides, planners, calendars, lesson plans",
    content:
      "Drop the resource you wish already existed, from attendance trackers to AI literacy mini-units.",
    is_pinned: false,
    is_announcement: false,
    is_locked: true,
    created_at: "2026-06-24T09:45:00-04:00",
    channel: { name: "Crate Requests", slug: "crate-requests", color: "#5f0f40" },
    author: { display_name: "The Crate", role: "admin" },
  },
];

const demoTutorProfiles: PendingTutorProfile[] = [
  {
    id: "pending-tutor-sasha",
    display_name: "Sasha M.",
    headline: "Upper elementary writing coach with portfolio-building experience",
    subjects: ["Writing", "ELA", "Project support"],
    learner_fit_tags: ["Reluctant writers", "Portfolio evidence", "Gentle accountability"],
    bio: "Former classroom teacher and homeschool co-op instructor. Best fit for learners who need structure, confidence repair, and concrete writing wins.",
    status: "pending",
    created_at: "2026-06-26T08:15:00-04:00",
  },
];

const demoTutorRequests: PendingTutorRequest[] = [
  {
    id: "request-reading-support",
    learner_age_band: "Ages 9-11",
    subjects: ["Reading / ELA", "Executive function"],
    support_goal:
      "We need a tutor who can help with reading confidence without turning every session into a worksheet fight.",
    schedule_notes: "Afternoons after 2pm Eastern are best.",
    budget_range: "$40-60/hr",
    preferred_format: "Virtual",
    status: "pending",
    created_at: "2026-06-26T09:20:00-04:00",
    requester: [{ display_name: "Founding Member" }],
    tutor: [{ display_name: "Amara J." }],
  },
];

export default function DemoAdminPage() {
  return (
    <div className="p-5 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-3xl font-black">Admin Dashboard</h1>
        <p className="mt-2 text-sm font-semibold text-muted-foreground">
          Demo view of launch-ready content controls for pinned, announced, and locked posts.
        </p>
        <div className="mt-8">
          <WeeklyRecapDelivery memberCount={27} demoMode />
        </div>
        <div className="mt-8">
          <ContentControls posts={demoPosts} demoMode />
        </div>
        <div className="mt-8">
          <TutorConnectionQueue profiles={demoTutorProfiles} requests={demoTutorRequests} demoMode />
        </div>
      </div>
    </div>
  );
}
