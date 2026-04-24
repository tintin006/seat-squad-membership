import { createClient } from "@/lib/supabase/server";
import { FeedPage } from "./feed-page";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("seat_profiles")
    .select("display_name, role, tier")
    .eq("id", user!.id)
    .single();

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Member";

  // Fetch channels
  const { data: channels } = await supabase
    .from("seat_channels")
    .select("*")
    .order("is_default", { ascending: false });

  // Fetch posts with author and channel
  const { data: posts } = await supabase
    .from("seat_posts")
    .select(`
      id, channel_id, author_id, type, title, content, is_pinned, is_announcement, created_at,
      author:seat_profiles!author_id(display_name, avatar_url, role),
      channel:seat_channels!channel_id(name, slug, color)
    `)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);

  // Fetch reactions
  const { data: allReactions } = await supabase
    .from("seat_post_reactions")
    .select("post_id, emoji, user_id");

  // Fetch comment counts
  const { data: allComments } = await supabase
    .from("seat_comments")
    .select("post_id, id, content, is_deleted, created_at, parent_id, author:seat_profiles!author_id(display_name, avatar_url)");

  // Fetch bookmarks for current user
  const { data: userBookmarks } = await supabase
    .from("seat_bookmarks")
    .select("post_id")
    .eq("user_id", user!.id);

  // Fetch total member count
  const { count: memberCount } = await supabase
    .from("seat_profiles")
    .select("*", { count: "exact", head: true });

  // Post counts per channel
  const { data: postCountsRaw } = await supabase
    .from("seat_posts")
    .select("channel_id, seat_channels!inner(slug)");

  const postCounts: Record<string, number> = {};
  postCountsRaw?.forEach((p: any) => {
    const slug = p.seat_channels?.slug;
    if (slug) {
      postCounts[slug] = (postCounts[slug] || 0) + 1;
    }
  });

  return (
    <FeedPage
      displayName={displayName}
      channels={channels || []}
      posts={posts || []}
      allReactions={allReactions || []}
      allComments={allComments || []}
      userBookmarks={userBookmarks || []}
      memberCount={memberCount || 0}
      postCounts={postCounts}
      userId={user!.id}
    />
  );
}
