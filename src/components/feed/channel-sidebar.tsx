"use client";

import { Hash } from "lucide-react";
import type { SeatChannel } from "@/types/database";

interface ChannelSidebarProps {
  channels: SeatChannel[];
  activeChannel: string | null;
  onSelectChannel: (slug: string | null) => void;
  postCounts: Record<string, number>;
}

export function ChannelSidebar({ channels, activeChannel, onSelectChannel, postCounts }: ChannelSidebarProps) {
  return (
    <div className="space-y-1">
      <button
        onClick={() => onSelectChannel(null)}
        className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-bold transition ${
          activeChannel === null
            ? "bg-primary text-primary-foreground"
            : "text-foreground hover:bg-surface-high"
        }`}
      >
        <Hash size={16} />
        All Threads
      </button>
      {channels.map((ch) => (
        <button
          key={ch.id}
          onClick={() => onSelectChannel(ch.slug)}
          className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-bold transition ${
            activeChannel === ch.slug
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-surface-high"
          }`}
        >
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: ch.color }}
          />
          <span className="flex-1 text-left">{ch.name}</span>
          {postCounts[ch.slug] > 0 && (
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
              activeChannel === ch.slug
                ? "bg-white/18 text-primary-foreground"
                : "bg-surface-high text-muted-foreground"
            }`}>
              {postCounts[ch.slug]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
