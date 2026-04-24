"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChannelSidebar } from "@/components/feed/channel-sidebar";
import { PostComposer } from "@/components/feed/post-composer";
import { PostCard } from "@/components/feed/post-card";
import { RightRail } from "@/components/feed/right-rail";
import type { SeatChannel } from "@/types/database";

interface FeedPageProps {
  displayName: string;
  channels: SeatChannel[];
  posts: any[];
  allReactions: any[];
  allComments: any[];
  userBookmarks: { post_id: string }[];
  memberCount: number;
  postCounts: Record<string, number>;
  userId: string;
}

export function FeedPage({
  displayName,
  channels,
  posts,
  allReactions,
  allComments,
  userBookmarks,
  memberCount,
  postCounts,
  userId,
}: FeedPageProps) {
  const router = useRouter();
  const [activeChannel, setActiveChannel] = useState<string | null>(null);

  const filteredPosts = activeChannel
    ? posts.filter((p) => p.channel?.slug === activeChannel)
    : posts;

  const bookmarkSet = new Set(userBookmarks.map((b) => b.post_id));

  const getReactionsForPost = (postId: string) => {
    const postReactions = allReactions.filter((r) => r.post_id === postId);
    const grouped: Record<string, { emoji: string; count: number; userReacted: boolean }> = {};
    postReactions.forEach((r) => {
      if (!grouped[r.emoji]) {
        grouped[r.emoji] = { emoji: r.emoji, count: 0, userReacted: false };
      }
      grouped[r.emoji].count++;
      if (r.user_id === userId) {
        grouped[r.emoji].userReacted = true;
      }
    });
    return Object.values(grouped);
  };

  const getCommentsForPost = (postId: string) => {
    return allComments
      .filter((c) => c.post_id === postId)
      .map((c) => ({
        id: c.id,
        content: c.content,
        is_deleted: c.is_deleted,
        created_at: c.created_at,
        parent_id: c.parent_id,
        author: c.author,
      }));
  };

  const getCommentCount = (postId: string) => {
    return allComments.filter((c) => c.post_id === postId).length;
  };

  const handleRefresh = useCallback(() => {
    router.refresh();
  }, [router]);

  const activeChannelObj = activeChannel
    ? channels.find((c) => c.slug === activeChannel) || null
    : null;

  return (
    <div className="flex min-h-screen">
      {/* Left sidebar - Channel filter */}
      <aside className="hidden w-56 border-r border-border bg-card p-4 xl:block">
        <p className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          Channels
        </p>
        <ChannelSidebar
          channels={channels}
          activeChannel={activeChannel}
          onSelectChannel={setActiveChannel}
          postCounts={postCounts}
        />
      </aside>

      {/* Main feed */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-2xl font-black tracking-[-0.04em] sm:text-3xl">
            Welcome back, {displayName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening in the SEAT Squad.
          </p>

          <div className="mt-6">
            <PostComposer
              channels={channels}
              onPostCreated={handleRefresh}
            />
          </div>

          <div className="mt-6 space-y-4">
            {filteredPosts.length === 0 && (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <p className="text-sm font-bold text-muted-foreground">
                  No posts yet in this channel.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Be the first to share something!
                </p>
              </div>
            )}

            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={{
                  id: post.id,
                  content: post.content,
                  title: post.title,
                  is_pinned: post.is_pinned,
                  is_announcement: post.is_announcement,
                  created_at: post.created_at,
                  channel: post.channel,
                  author: post.author,
                }}
                reactions={getReactionsForPost(post.id)}
                comments={getCommentsForPost(post.id)}
                commentCount={getCommentCount(post.id)}
                isBookmarked={bookmarkSet.has(post.id)}
                onUpdate={handleRefresh}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Right rail */}
      <aside className="hidden w-64 border-l border-border bg-card p-4 lg:block">
        <RightRail
          activeChannel={activeChannelObj}
          memberCount={memberCount}
        />
      </aside>
    </div>
  );
}
