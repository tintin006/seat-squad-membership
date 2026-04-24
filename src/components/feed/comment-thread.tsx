"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MessageSquare, Send } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  is_deleted: boolean;
  created_at: string;
  parent_id: string | null;
  author: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface CommentThreadProps {
  postId: string;
  comments: Comment[];
  commentCount: number;
  onCommentAdded: () => void;
}

export function CommentThread({ postId, comments, commentCount, onCommentAdded }: CommentThreadProps) {
  const supabase = createClient();
  const [showComments, setShowComments] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const topLevel = comments.filter((c) => !c.parent_id);
  const replies = comments.filter((c) => c.parent_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("seat_comments").insert({
      post_id: postId,
      parent_id: replyToId,
      author_id: user.id,
      content: replyContent.trim(),
    });

    setLoading(false);
    if (!error) {
      setReplyContent("");
      setReplyToId(null);
      onCommentAdded();
    }
  };

  return (
    <div className="mt-3 border-t border-border pt-3">
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground transition hover:text-primary"
      >
        <MessageSquare size={14} />
        {commentCount} {commentCount === 1 ? "comment" : "comments"}
      </button>

      {showComments && (
        <div className="mt-3 space-y-3">
          {comments.length === 0 && (
            <p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>
          )}

          {topLevel.map((comment) => (
            <div key={comment.id} className="text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">
                  {comment.author?.display_name || "Member"}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-0.5 text-muted-foreground">
                {comment.is_deleted ? "[deleted]" : comment.content}
              </p>
              {!comment.is_deleted && (
                <button
                  onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
                  className="mt-1 text-[11px] font-bold text-primary/70 hover:text-primary"
                >
                  Reply
                </button>
              )}
              {replyToId === comment.id && (
                <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
                  <input
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 rounded-md border border-border bg-surface-high px-2.5 py-1.5 text-xs outline-none focus:border-primary"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-primary px-2.5 py-1.5 text-xs font-black text-primary-foreground"
                  >
                    <Send size={12} />
                  </button>
                </form>
              )}
              {/* Replies to this comment */}
              {replies
                .filter((r) => r.parent_id === comment.id)
                .map((reply) => (
                  <div key={reply.id} className="mt-2 ml-4 border-l-2 border-border pl-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">
                        {reply.author?.display_name || "Member"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(reply.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-0.5 text-muted-foreground">
                      {reply.is_deleted ? "[deleted]" : reply.content}
                    </p>
                  </div>
                ))}
            </div>
          ))}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 rounded-md border border-border bg-surface-high px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={loading || !replyContent.trim()}
              className="rounded-md bg-primary px-3 py-2 text-xs font-black text-primary-foreground disabled:opacity-40"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
