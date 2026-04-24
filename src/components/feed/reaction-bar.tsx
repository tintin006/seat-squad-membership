"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SmilePlus } from "lucide-react";

const QUICK_EMOJIS = ["👍", "❤️", "😂", "🎉", "🤔", "👏"];

interface ReactionBarProps {
  postId: string;
  reactions: { emoji: string; count: number; userReacted: boolean }[];
  onReactionChange: () => void;
}

export function ReactionBar({ postId, reactions, onReactionChange }: ReactionBarProps) {
  const supabase = createClient();
  const [showPicker, setShowPicker] = useState(false);

  const toggleReaction = async (emoji: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const existing = reactions.find((r) => r.emoji === emoji && r.userReacted);

    if (existing) {
      await supabase
        .from("seat_post_reactions")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .eq("emoji", emoji);
    } else {
      await supabase.from("seat_post_reactions").insert({
        post_id: postId,
        user_id: user.id,
        emoji,
      });
    }

    onReactionChange();
  };

  return (
    <div className="flex items-center gap-1.5">
      {reactions.map((r) => (
        <button
          key={r.emoji}
          onClick={() => toggleReaction(r.emoji)}
          className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs transition ${
            r.userReacted
              ? "border-primary bg-primary/15 font-bold text-primary"
              : "border-border bg-card text-muted-foreground hover:border-primary/40"
          }`}
        >
          <span>{r.emoji}</span>
          <span className="text-[11px]">{r.count}</span>
        </button>
      ))}

      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="flex items-center rounded-full border border-border bg-card p-1.5 text-muted-foreground transition hover:border-primary/40"
        >
          <SmilePlus size={14} />
        </button>
        {showPicker && (
          <div className="absolute bottom-full left-0 z-10 mb-1 flex gap-1 rounded-lg border border-border bg-card p-2 shadow-lg">
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  toggleReaction(emoji);
                  setShowPicker(false);
                }}
                className="rounded p-1 text-lg transition hover:bg-surface-high"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
