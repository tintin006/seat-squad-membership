import { MemberDashboardPage, type DashboardBadge, type DashboardPost } from "@/components/dashboard/member-dashboard-page";
import { createClient } from "@/lib/supabase/server";
import type { SeatLiveSession, SeatPointTotal, SeatProfile } from "@/types/database";

type QueryPost = Omit<DashboardPost, "author" | "channel"> & {
  author: DashboardPost["author"] | DashboardPost["author"][];
  channel: DashboardPost["channel"] | NonNullable<DashboardPost["channel"]>[];
};

type QueryBadge = {
  badge: DashboardBadge | DashboardBadge[] | null;
};

function firstRelation<T>(relation: T | T[] | null): T | null {
  return Array.isArray(relation) ? relation[0] ?? null : relation;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Dashboard requires an authenticated user.");
  }

  const [
    profileResult,
    postsResult,
    liveSessionResult,
    pointTotalResult,
    badgesResult,
    memberCountResult,
    groupCountResult,
  ] = await Promise.all([
    supabase
      .from("seat_profiles")
      .select("display_name, role, tier, intent_tags, methodology_tags, grade_levels, location")
      .eq("id", user.id)
      .single(),
    supabase
      .from("seat_posts")
      .select(`
        id, title, content, created_at,
        author:seat_profiles!author_id(display_name),
        channel:seat_channels!channel_id(name, slug, color)
      `)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("seat_live_sessions")
      .select("title, day_label, time_label, timezone, status, id")
      .eq("slug", "weekly-live-qa")
      .maybeSingle(),
    supabase
      .from("seat_point_totals")
      .select("total_points, posts_count, comments_count, reactions_given_count, reactions_received_count, pod_submissions_count")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("seat_member_badges")
      .select("badge:seat_badges(name, description)")
      .eq("user_id", user.id),
    supabase
      .from("seat_profiles")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("seat_group_submissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved"),
  ]);

  const rsvpResult = liveSessionResult.data?.id
    ? await supabase
        .from("seat_live_session_rsvps")
        .select("status")
        .eq("session_id", liveSessionResult.data.id)
        .eq("user_id", user.id)
        .maybeSingle()
    : { data: null };

  const normalizedPosts: DashboardPost[] = ((postsResult.data || []) as unknown as QueryPost[]).map((post) => ({
    ...post,
    author: firstRelation(post.author),
    channel: firstRelation(post.channel),
  }));

  const badges: DashboardBadge[] = ((badgesResult.data || []) as unknown as QueryBadge[])
    .map((row) => firstRelation(row.badge))
    .filter((badge): badge is DashboardBadge => Boolean(badge));

  const profile = (profileResult.data || {
    display_name: user.email?.split("@")[0] || "Member",
    role: "family",
    tier: "free",
    intent_tags: [],
    methodology_tags: [],
    grade_levels: [],
    location: null,
  }) as Pick<SeatProfile, "display_name" | "role" | "tier" | "intent_tags" | "methodology_tags" | "grade_levels" | "location">;

  return (
    <MemberDashboardPage
      profile={profile}
      memberCount={memberCountResult.count || 0}
      approvedGroupCount={groupCountResult.count || 0}
      latestPosts={normalizedPosts}
      liveSession={liveSessionResult.data as SeatLiveSession | null}
      rsvpStatus={rsvpResult.data?.status || null}
      pointTotal={pointTotalResult.data as SeatPointTotal | null}
      badges={badges}
    />
  );
}
