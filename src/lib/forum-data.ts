import { createClient } from "@/lib/supabase/server";
import type { FeedComment, FeedPost } from "@/app/(app)/feed-page";

type PostCountRow = {
  seat_channels?: { slug?: string | null } | null;
};

type QueryPost = Omit<FeedPost, "author" | "channel"> & {
  author: FeedPost["author"] | FeedPost["author"][];
  channel: FeedPost["channel"] | NonNullable<FeedPost["channel"]>[];
};

type QueryComment = Omit<FeedComment, "author"> & {
  author: FeedComment["author"] | NonNullable<FeedComment["author"]>[];
};

function firstRelation<T>(relation: T | T[] | null): T | null {
  return Array.isArray(relation) ? relation[0] ?? null : relation;
}

export async function getForumPageData() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { data: profile } = await supabase
    .from("seat_profiles")
    .select("display_name, role, tier")
    .eq("id", user.id)
    .single();

  const displayName = profile?.display_name || user.email?.split("@")[0] || "Member";

  const { data: channels } = await supabase
    .from("seat_channels")
    .select("*")
    .order("is_default", { ascending: false })
    .order("name", { ascending: true });

  const { data: posts } = await supabase
    .from("seat_posts")
    .select(`
      id, channel_id, author_id, type, title, content, is_pinned, is_announcement, is_locked, created_at,
      author:seat_profiles!author_id(display_name, avatar_url, role),
      channel:seat_channels!channel_id(name, slug, color)
    `)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(75);

  const { data: allReactions } = await supabase
    .from("seat_post_reactions")
    .select("post_id, emoji, user_id");

  const { data: allComments } = await supabase
    .from("seat_comments")
    .select("post_id, id, content, is_deleted, created_at, parent_id, author:seat_profiles!author_id(display_name, avatar_url)");

  const { data: userBookmarks } = await supabase
    .from("seat_bookmarks")
    .select("post_id")
    .eq("user_id", user.id);

  const { count: memberCount } = await supabase
    .from("seat_profiles")
    .select("*", { count: "exact", head: true });

  const { data: postCountsRaw } = await supabase
    .from("seat_posts")
    .select("channel_id, seat_channels!inner(slug)");

  const postCounts: Record<string, number> = {};
  (postCountsRaw as PostCountRow[] | null)?.forEach((post) => {
    const slug = post.seat_channels?.slug;
    if (slug) {
      postCounts[slug] = (postCounts[slug] || 0) + 1;
    }
  });

  const normalizedPosts: FeedPost[] = ((posts || []) as unknown as QueryPost[]).map((post) => ({
    ...post,
    author: firstRelation(post.author),
    channel: firstRelation(post.channel),
  }));

  const normalizedComments: FeedComment[] = ((allComments || []) as unknown as QueryComment[]).map((comment) => ({
    ...comment,
    author: firstRelation(comment.author),
  }));

  return {
    displayName,
    channels: channels || [],
    posts: normalizedPosts,
    allReactions: allReactions || [],
    allComments: normalizedComments,
    userBookmarks: userBookmarks || [],
    memberCount: memberCount || 0,
    postCounts,
    userId: user.id,
  };
}
