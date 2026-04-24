"use client";

import { useState } from "react";
import { Send, Image, Link2, BarChart3 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { SeatChannel } from "@/types/database";

interface PostComposerProps {
  channels: SeatChannel[];
  defaultChannelId?: string;
  onPostCreated: () => void;
}

export function PostComposer({ channels, defaultChannelId, onPostCreated }: PostComposerProps) {
  const supabase = createClient();
  const [content, setContent] = useState("");
  const [selectedChannel, setSelectedChannel] = useState(defaultChannelId || channels[0]?.id || "");
  const [postType, setPostType] = useState<"text" | "image" | "link" | "poll">("text");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !selectedChannel) return;

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("seat_posts").insert({
      channel_id: selectedChannel,
      author_id: user.id,
      type: postType,
      content: content.trim(),
    });

    setLoading(false);
    if (!error) {
      setContent("");
      onPostCreated();
    }
  };

  const typeButtons: { type: "text" | "image" | "link" | "poll"; icon: typeof Send; label: string }[] = [
    { type: "text", icon: Send, label: "Text" },
    { type: "image", icon: Image, label: "Image" },
    { type: "link", icon: Link2, label: "Link" },
    { type: "poll", icon: BarChart3, label: "Poll" },
  ];

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <select
          value={selectedChannel}
          onChange={(e) => setSelectedChannel(e.target.value)}
          className="rounded-md border border-border bg-surface-high px-2.5 py-1.5 text-xs font-bold outline-none focus:border-primary"
        >
          {channels.map((ch) => (
            <option key={ch.id} value={ch.id}>
              {ch.name}
            </option>
          ))}
        </select>
        <div className="flex gap-1">
          {typeButtons.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => setPostType(type)}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold transition ${
                postType === type
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-surface-high"
              }`}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        rows={3}
        className="w-full resize-none rounded-md border border-border bg-surface-high px-3 py-2.5 text-sm font-semibold outline-none placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary"
      />
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-black text-primary-foreground transition hover:translate-y-[-1px] disabled:opacity-40"
        >
          {loading ? "Posting..." : <><Send size={14} /> Post</>}
        </button>
      </div>
    </form>
  );
}
