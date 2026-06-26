import { createClient } from "@/lib/supabase/server";
import { LeaderboardPage } from "@/components/leaderboard/leaderboard-page";
import type { ContributionBadge, LeaderboardMember } from "@/lib/leaderboard";

type PointTotalRow = {
  user_id: string;
  total_points: number;
  posts_count: number;
  comments_count: number;
  reactions_given_count: number;
  reactions_received_count: number;
  pod_submissions_count: number;
};

type ProfileRow = {
  id: string;
  display_name: string | null;
  role: string;
  tier: string;
  location: string | null;
};

type MemberBadgeRow = {
  user_id: string;
  badge: ContributionBadge | ContributionBadge[] | null;
};

export default async function LeaderboardRoute() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: totals } = await supabase
    .from("seat_point_totals")
    .select("user_id, total_points, posts_count, comments_count, reactions_given_count, reactions_received_count, pod_submissions_count")
    .gt("total_points", 0)
    .order("total_points", { ascending: false })
    .limit(25);

  const pointTotals = (totals || []) as PointTotalRow[];
  const userIds = pointTotals.map((row) => row.user_id);

  const [{ data: profiles }, { data: memberBadges }] = userIds.length > 0
    ? await Promise.all([
        supabase
          .from("seat_profiles")
          .select("id, display_name, role, tier, location")
          .in("id", userIds),
        supabase
          .from("seat_member_badges")
          .select("user_id, badge:seat_badges(slug, name, description, icon, sort_order)")
          .in("user_id", userIds),
      ])
    : [{ data: [] }, { data: [] }];

  const profilesById = new Map((profiles || []).map((profile) => [(profile as ProfileRow).id, profile as ProfileRow]));
  const badgesByUserId = new Map<string, ContributionBadge[]>();

  ((memberBadges || []) as MemberBadgeRow[]).forEach((row) => {
    const rawBadge = Array.isArray(row.badge) ? row.badge[0] : row.badge;
    if (!rawBadge) return;

    const badges = badgesByUserId.get(row.user_id) || [];
    badges.push(rawBadge);
    badgesByUserId.set(row.user_id, badges);
  });

  const members: LeaderboardMember[] = pointTotals
    .map((total) => {
      const profile = profilesById.get(total.user_id);
      if (!profile) return null;

      return {
        ...total,
        display_name: profile.display_name || "SEAT Squad Member",
        role: profile.role,
        tier: profile.tier,
        location: profile.location,
        badges: (badgesByUserId.get(total.user_id) || []).sort((a, b) => a.sort_order - b.sort_order),
      };
    })
    .filter((member): member is LeaderboardMember => Boolean(member));

  return <LeaderboardPage members={members} currentUserId={user?.id} />;
}
