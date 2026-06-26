import { MemberDashboardPage } from "@/components/dashboard/member-dashboard-page";
import { sampleLeaderboardMembers } from "@/lib/leaderboard";
import { demoLiveSession } from "@/lib/live-qa";

const demoPosts = [
  {
    id: "post-welcome",
    title: "Welcome to the founding SEAT Squad week",
    content:
      "Start with one thing: introduce yourself and name the learning-life friction closest to today.",
    created_at: "2026-06-26T10:00:00-04:00",
    channel: { name: "General", slug: "general", color: "#fb8b24" },
    author: { display_name: "Chris Linder" },
  },
  {
    id: "post-reset",
    title: "Weekly reset: what would make next week lighter?",
    content:
      "Choose one: structure, curriculum, confidence, accountability, community, tutor support, or local group connection.",
    created_at: "2026-06-25T14:30:00-04:00",
    channel: { name: "Start Here", slug: "start-here", color: "#0f4c5c" },
    author: { display_name: "Tendi Team" },
  },
  {
    id: "post-pods",
    title: "What should the pod and homeschool group directory filter by?",
    content:
      "We are thinking: location, age band, in-person/virtual, cost, faith/secular, neurodivergent support, and schedule.",
    created_at: "2026-06-23T13:20:00-04:00",
    channel: { name: "Pods & Groups", slug: "pods-groups", color: "#edb72c" },
    author: { display_name: "Maya R." },
  },
];

export default function DemoDashboardPage() {
  const leader = sampleLeaderboardMembers[0];

  return (
    <MemberDashboardPage
      hrefPrefix="/demo"
      profile={{
        display_name: "Founding Member",
        role: "family",
        tier: "member",
        intent_tags: ["Download state and ESA guides", "Find a pod or homeschool group", "Submit a Live Q&A question"],
        methodology_tags: ["Hybrid", "Co-op / pod"],
        grade_levels: ["Elementary (K-5)", "Middle (6-8)"],
        location: "Atlanta, GA",
      }}
      memberCount={27}
      approvedGroupCount={90}
      latestPosts={demoPosts}
      liveSession={demoLiveSession}
      rsvpStatus="going"
      pointTotal={leader}
      badges={leader.badges}
    />
  );
}
