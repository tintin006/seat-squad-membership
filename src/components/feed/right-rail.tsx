"use client";

import { Hash, Users, CalendarDays } from "lucide-react";
import type { SeatChannel } from "@/types/database";

interface RightRailProps {
  activeChannel: SeatChannel | null;
  memberCount: number;
}

export function RightRail({ activeChannel, memberCount }: RightRailProps) {
  return (
    <div className="space-y-5">
      {/* Channel Info */}
      {activeChannel && (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: activeChannel.color }}
            />
            <h3 className="font-display text-sm font-black">{activeChannel.name}</h3>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {activeChannel.description || "No description available."}
          </p>
        </div>
      )}

      {/* Member Count */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users size={14} />
          <span className="text-xs font-bold uppercase tracking-wider">Members</span>
        </div>
        <p className="mt-2 text-2xl font-black text-foreground">{memberCount}</p>
      </div>

      {/* Upcoming Events (placeholder) */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-primary">
          <CalendarDays size={14} />
          <span className="text-xs font-black uppercase tracking-wider">Upcoming</span>
        </div>
        <div className="mt-3 space-y-3">
          <div className="rounded-lg border border-border bg-surface-high p-3">
            <p className="text-xs font-bold text-foreground">SEAT Squad Orientation</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Virtual — Coming soon</p>
          </div>
          <div className="rounded-lg border border-border bg-surface-high p-3">
            <p className="text-xs font-bold text-foreground">Educator Lab: OpenMAIC</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Virtual — Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
