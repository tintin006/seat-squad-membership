"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BookmarkCheck, MessageSquare, Pin, Search, SlidersHorizontal } from "lucide-react";
import { ChannelSidebar } from "@/components/feed/channel-sidebar";
import { PostComposer } from "@/components/feed/post-composer";
import { PostCard } from "@/components/feed/post-card";
import { RightRail } from "@/components/feed/right-rail";
import type { SeatChannel, SeatPostReaction } from "@/types/database";

export interface FeedPost {
  id: string;
  content: string;
  title: string | null;
  is_pinned: boolean;
  is_announcement: boolean;
  is_locked: boolean;
  created_at: string;
  channel: {
    name: string;
    slug: string;
    color: string;
  } | null;
  author: {
    display_name: string | null;
    avatar_url: string | null;
    role: string;
  } | null;
}

export interface FeedComment {
  id: string;
  post_id: string;
  content: string;
  is_deleted: boolean;
  created_at: string;
  parent_id: string | null;
  author: { display_name: string | null; avatar_url: string | null } | null;
}

interface FeedPageProps {
  displayName: string;
  channels: SeatChannel[];
  posts: FeedPost[];
  allReactions: Pick<SeatPostReaction, "post_id" | "emoji" | "user_id">[];
  allComments: FeedComment[];
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
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<"latest" | "active" | "commented">("latest");
  const [threadFilter, setThreadFilter] = useState<"all" | "unanswered" | "bookmarked" | "pinned">("all");

  const bookmarkSet = useMemo(() => new Set(userBookmarks.map((b) => b.post_id)), [userBookmarks]);

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

  const getCommentCount = useCallback((postId: string) => {
    return allComments.filter((c) => c.post_id === postId).length;
  }, [allComments]);

  const getLastActivityTime = useCallback((postId: string, fallback: string) => {
    const latestComment = allComments
      .filter((comment) => comment.post_id === postId)
      .reduce<string | null>((latest, comment) => {
        if (!latest || new Date(comment.created_at) > new Date(latest)) {
          return comment.created_at;
        }
        return latest;
      }, null);

    return new Date(latestComment || fallback).getTime();
  }, [allComments]);

  const handleRefresh = useCallback(() => {
    router.refresh();
  }, [router]);

  const activeChannelObj = activeChannel
    ? channels.find((c) => c.slug === activeChannel) || null
    : null;

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return posts
      .filter((post) => {
        if (activeChannel && post.channel?.slug !== activeChannel) return false;
        if (threadFilter === "unanswered" && getCommentCount(post.id) > 0) return false;
        if (threadFilter === "bookmarked" && !bookmarkSet.has(post.id)) return false;
        if (threadFilter === "pinned" && !post.is_pinned) return false;
        if (!normalizedQuery) return true;

        return [
          post.title,
          post.content,
          post.author?.display_name,
          post.channel?.name,
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalizedQuery));
      })
      .sort((a, b) => {
        if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
        if (sortMode === "commented") return getCommentCount(b.id) - getCommentCount(a.id);
        if (sortMode === "active") return getLastActivityTime(b.id, b.created_at) - getLastActivityTime(a.id, a.created_at);
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [activeChannel, bookmarkSet, getCommentCount, getLastActivityTime, posts, query, sortMode, threadFilter]);

  const totalComments = allComments.length;
  const totalReactions = allReactions.length;
  const unansweredCount = posts.filter((post) => getCommentCount(post.id) === 0).length;

  return (
    <div className="flex min-h-screen">
      {/* Left sidebar - Channel filter */}
      <aside className="hidden w-60 border-r border-border bg-card/80 p-4 xl:block">
        <p className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
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
        <div className="mx-auto max-w-3xl">
          <section className="seat-hero-panel overflow-hidden rounded-2xl border border-secondary/30 shadow-warm">
            <div className="grid gap-0 md:grid-cols-[1.25fr_0.75fr]">
              <div className="p-6 sm:p-8">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
                  SEAT Squad Forum
                </p>
                <h1 className="mt-3 font-display text-3xl font-black leading-[0.98] tracking-[-0.04em] sm:text-5xl">
                  Welcome back, {displayName}
                </h1>
                <p className="mt-4 max-w-xl text-sm font-semibold leading-6 text-white/84 sm:text-base">
                  A practical message board for questions, wins, resource requests, pod discovery, and the messy middle of building a learning life.
                </p>
                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-lg border border-white/15 bg-white/10 p-3">
                    <p className="text-xl font-black">{posts.length}</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/68">threads</p>
                  </div>
                  <div className="rounded-lg border border-white/15 bg-white/10 p-3">
                    <p className="text-xl font-black">{totalComments}</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/68">replies</p>
                  </div>
                  <div className="rounded-lg border border-white/15 bg-white/10 p-3">
                    <p className="text-xl font-black">{totalReactions}</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/68">reactions</p>
                  </div>
                </div>
              </div>
              <div className="seat-image min-h-56 md:min-h-full">
                <Image
                  src="/images/seat-squad-community-diverse.png"
                  alt=""
                  fill
                  sizes="(min-width: 768px) 300px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          <div className="mt-6">
            <PostComposer
              key={activeChannelObj?.id || "all-channels-composer"}
              channels={channels}
              defaultChannelId={activeChannelObj?.id}
              onPostCreated={handleRefresh}
            />
          </div>

          <section className="mt-6 rounded-xl border border-border bg-card p-4 shadow-soft">
            <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search threads, questions, resources, or members"
                  className="w-full rounded-md border border-border bg-surface-high py-2.5 pl-9 pr-3 text-sm font-semibold outline-none focus:border-primary"
                />
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  value={activeChannel || "all"}
                  onChange={(event) => setActiveChannel(event.target.value === "all" ? null : event.target.value)}
                  className="rounded-md border border-border bg-surface-high px-3 py-2.5 text-sm font-black outline-none focus:border-primary xl:hidden"
                >
                  <option value="all">All channels</option>
                  {channels.map((channel) => (
                    <option key={channel.id} value={channel.slug}>{channel.name}</option>
                  ))}
                </select>
                <select
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value as typeof sortMode)}
                  className="rounded-md border border-border bg-surface-high px-3 py-2.5 text-sm font-black outline-none focus:border-primary"
                >
                  <option value="latest">Latest threads</option>
                  <option value="active">Recently active</option>
                  <option value="commented">Most replies</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { value: "all", label: "All threads", icon: MessageSquare },
                { value: "unanswered", label: `Unanswered (${unansweredCount})`, icon: SlidersHorizontal },
                { value: "bookmarked", label: "Bookmarked", icon: BookmarkCheck },
                { value: "pinned", label: "Pinned", icon: Pin },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setThreadFilter(value as typeof threadFilter)}
                  className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-black transition ${
                    threadFilter === value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface-high hover:border-primary"
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </section>

          <div className="mt-6 space-y-4">
            {filteredPosts.length === 0 && (
              <div className="rounded-xl border border-border bg-card p-8 text-center shadow-soft">
                <p className="font-display text-2xl font-black tracking-[-0.04em]">
                  This channel is ready for its first real conversation.
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-muted-foreground">
                  Start with a practical question, a weekly reset, or a resource request. If you are new, the Start Here guide will help you choose where to begin.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/start-here"
                    className="rounded-md bg-primary px-4 py-2 text-xs font-black text-primary-foreground"
                  >
                    Start Here
                  </Link>
                  <Link
                    href="/crate"
                    className="rounded-md border border-border bg-surface-high px-4 py-2 text-xs font-black"
                  >
                    Browse The Crate
                  </Link>
                </div>
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
                  is_locked: post.is_locked,
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
      <aside className="hidden w-72 border-l border-border bg-card/80 p-4 lg:block">
        <RightRail
          activeChannel={activeChannelObj}
          memberCount={memberCount}
        />
      </aside>
    </div>
  );
}
