import { FeedPage, type FeedComment, type FeedPost } from "../(app)/feed-page";
import type { SeatChannel, SeatPostReaction } from "@/types/database";

const now = new Date("2026-06-26T10:00:00-04:00").toISOString();

const channels: SeatChannel[] = [
  {
    id: "channel-general",
    slug: "general",
    name: "General",
    description: "Introductions, wins, questions, and the everyday pulse of the SEAT Squad.",
    color: "#fb8b24",
    is_default: true,
    is_public: true,
    created_by: null,
    created_at: now,
  },
  {
    id: "channel-start",
    slug: "start-here",
    name: "Start Here",
    description: "Orientation, first steps, and the cleanest path when learning life feels loud.",
    color: "#0f4c5c",
    is_default: false,
    is_public: true,
    created_by: null,
    created_at: now,
  },
  {
    id: "channel-crate",
    slug: "crate-requests",
    name: "Crate Requests",
    description: "Ask for guides, planners, calendars, lesson plans, and resource remixes.",
    color: "#5f0f40",
    is_default: false,
    is_public: true,
    created_by: null,
    created_at: now,
  },
  {
    id: "channel-pods",
    slug: "pods-groups",
    name: "Pods & Groups",
    description: "Microschool, pod, co-op, and homeschool group discovery.",
    color: "#edb72c",
    is_default: false,
    is_public: true,
    created_by: null,
    created_at: now,
  },
  {
    id: "channel-live",
    slug: "live-qa",
    name: "Live Q&A",
    description: "Weekly questions, office hours, replays, and member follow-up.",
    color: "#9a031e",
    is_default: false,
    is_public: true,
    created_by: null,
    created_at: now,
  },
];

const posts: FeedPost[] = [
  {
    id: "post-welcome",
    title: "Welcome to the founding SEAT Squad week",
    content:
      "Start with one thing: introduce yourself and name the learning-life friction closest to today. We are using the first few weeks to shape the video library, downloads, weekly Q&A rhythm, and group directory around real member needs.",
    is_pinned: true,
    is_announcement: true,
    is_locked: false,
    created_at: now,
    channel: { name: "General", slug: "general", color: "#fb8b24" },
    author: { display_name: "Chris Linder", avatar_url: null, role: "admin" },
  },
  {
    id: "post-reset",
    title: "Weekly reset: what would make next week lighter?",
    content:
      "Choose one: structure, curriculum, confidence, accountability, community, tutor support, or local group connection. Reply with the one you need most and we will point you to the right guide, planner, or thread.",
    is_pinned: false,
    is_announcement: false,
    is_locked: false,
    created_at: "2026-06-25T14:30:00-04:00",
    channel: { name: "Start Here", slug: "start-here", color: "#0f4c5c" },
    author: { display_name: "Tendi Team", avatar_url: null, role: "admin" },
  },
  {
    id: "post-crate",
    title: "Crate request thread: guides, planners, calendars, lesson plans",
    content:
      "Drop the resource you wish already existed. Examples: a 30-day deschooling calendar, a Georgia ESA spending planner, a media literacy mini-unit, or a one-page tutor interview checklist.",
    is_pinned: false,
    is_announcement: false,
    is_locked: false,
    created_at: "2026-06-24T09:45:00-04:00",
    channel: { name: "Crate Requests", slug: "crate-requests", color: "#5f0f40" },
    author: { display_name: "The Crate", avatar_url: null, role: "admin" },
  },
  {
    id: "post-pods",
    title: "What should the pod and homeschool group directory filter by?",
    content:
      "We are thinking: location, age band, in-person/virtual, cost, faith/secular, neurodivergent support, LGBTQ-inclusive, schedule, and accepting families. What would you need before reaching out?",
    is_pinned: false,
    is_announcement: false,
    is_locked: false,
    created_at: "2026-06-23T13:20:00-04:00",
    channel: { name: "Pods & Groups", slug: "pods-groups", color: "#edb72c" },
    author: { display_name: "Maya R.", avatar_url: null, role: "both" },
  },
];

const allReactions: Pick<SeatPostReaction, "post_id" | "emoji" | "user_id">[] = [
  { post_id: "post-welcome", emoji: "💛", user_id: "demo-user" },
  { post_id: "post-welcome", emoji: "💛", user_id: "member-2" },
  { post_id: "post-reset", emoji: "🙌", user_id: "member-3" },
  { post_id: "post-crate", emoji: "🔥", user_id: "demo-user" },
  { post_id: "post-pods", emoji: "👀", user_id: "member-4" },
];

const allComments: FeedComment[] = [
  {
    id: "comment-1",
    post_id: "post-reset",
    content: "Structure and confidence. We left school fast and I keep trying to rebuild everything at once.",
    is_deleted: false,
    created_at: "2026-06-25T15:00:00-04:00",
    parent_id: null,
    author: { display_name: "Janelle", avatar_url: null },
  },
  {
    id: "comment-2",
    post_id: "post-crate",
    content: "A printable monthly calendar with attendance, outings, and project evidence would help immediately.",
    is_deleted: false,
    created_at: "2026-06-24T10:15:00-04:00",
    parent_id: null,
    author: { display_name: "Roberto", avatar_url: null },
  },
];

const postCounts = channels.reduce<Record<string, number>>((counts, channel) => {
  counts[channel.slug] = posts.filter((post) => post.channel?.slug === channel.slug).length;
  return counts;
}, {});

export default function DemoInteriorPage() {
  return (
    <FeedPage
      displayName="Founding Member"
      channels={channels}
      posts={posts}
      allReactions={allReactions}
      allComments={allComments}
      userBookmarks={[{ post_id: "post-crate" }]}
      memberCount={27}
      postCounts={postCounts}
      userId="demo-user"
    />
  );
}
