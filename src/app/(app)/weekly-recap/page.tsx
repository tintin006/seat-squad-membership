import { WeeklyRecapPage, type RecapThread } from "@/components/weekly-recap/weekly-recap-page";
import { createClient } from "@/lib/supabase/server";

type QueryThread = Omit<RecapThread, "channel"> & {
  channel: RecapThread["channel"] | NonNullable<RecapThread["channel"]>[];
};

function firstRelation<T>(relation: T | T[] | null): T | null {
  return Array.isArray(relation) ? relation[0] ?? null : relation;
}

export default async function WeeklyRecapRoute() {
  const supabase = await createClient();

  const [threadsResult, memberCountResult, groupCountResult] = await Promise.all([
    supabase
      .from("seat_posts")
      .select(`
        id, title, content, created_at,
        channel:seat_channels!channel_id(name, slug, color)
      `)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("seat_profiles")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("seat_group_submissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved"),
  ]);

  const latestThreads: RecapThread[] = ((threadsResult.data || []) as unknown as QueryThread[]).map((thread) => ({
    ...thread,
    channel: firstRelation(thread.channel),
  }));

  return (
    <WeeklyRecapPage
      latestThreads={latestThreads}
      memberCount={memberCountResult.count || 0}
      approvedGroupCount={groupCountResult.count || 0}
    />
  );
}
