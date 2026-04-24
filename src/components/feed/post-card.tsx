"use client";

import { Pin, Bookmark, BookmarkCheck, MoreHorizontal, Flag } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ReactionBar } from "./reaction-bar";
import { CommentThread } from "./comment-thread";

interface PostCardProps {
  post: {
    id: string;
    content: string;
    title: string | null;
    is_pinned: boolean;
    is_announcement: boolean;
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
  };
  reactions: { emoji: string; count: number; userReacted: boolean }[];
  comments: {
    id: string;
    content: string;
    is_deleted: boolean;
    created_at: string;
    parent_id: string | null;
    author: { display_name: string | null; avatar_url: string | null } | null;
  }[];
  commentCount: number;
  isBookmarked: boolean;
  onUpdate: () => void;
}

export function PostCard({
  post,
  reactions,
  comments,
  commentCount,
  isBookmarked,
  onUpdate,
}: PostCardProps) {
  const supabase = createClient();

  const toggleBookmark = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (isBookmarked) {
      await supabase
        .from("seat_bookmarks")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", user.id);
    } else {
      await supabase.from("seat_bookmarks").insert({
        post_id: post.id,
        user_id: user.id,
      });
    }
    onUpdate();
  };

  const reportPost = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const reason = prompt("Why are you reporting this post?");
    if (!reason) return;

    await supabase.from("seat_post_reports").insert({
      post_id: post.id,
      reporter_id: user.id,
      reason,
    });
    alert("Report submitted. Thank you.");
  };

  return (
    <div className={`rounded-xl border bg-card p-5 transition ${post.is_pinned ? "border-primary/40" : "border-border"}`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-black text-primary">
            {post.author?.display_name?.[0]?.toUpperCase() || "M"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">
                {post.author?.display_name || "Member"}
              </span>
              {post.author?.role === "admin" && (
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary">
                  Admin
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span
                className="rounded-full px-2 py-0.5 font-bold"
                style={{ backgroundColor: post.channel?.color + "20", color: post.channel?.color }}
              >
                {post.channel?.name}
              </span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {post.is_pinned && <Pin size={14} className="text-primary" />}
          {post.is_announcement && (
            <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary-foreground">
              Announcement
            </span>
          )}
          <button
            onClick={toggleBookmark}
            className="rounded-md p-1.5 text-muted-foreground transition hover:bg-surface-high hover:text-primary"
          >
            {isBookmarked ? <BookmarkCheck size={16} className="text-primary" /> : <Bookmark size={16} />}
          </button>
          <button
            onClick={reportPost}
            className="rounded-md p-1.5 text-muted-foreground transition hover:bg-surface-high hover:text-destructive"
          >
            <Flag size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-3">
        {post.title && (
          <h3 className="mb-1 font-display text-lg font-black">{post.title}</h3>
        )}
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {post.content}
        </p>
      </div>

      {/* Reactions + Comments */}
      <div className="mt-4">
        <ReactionBar postId={post.id} reactions={reactions} onReactionChange={onUpdate} />
        <CommentThread
          postId={post.id}
          comments={comments}
          commentCount={commentCount}
          onCommentAdded={onUpdate}
        />
      </div>
    </div>
  );
}
