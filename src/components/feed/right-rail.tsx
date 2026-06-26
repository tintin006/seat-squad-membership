"use client";

import Link from "next/link";
import Image from "next/image";
import { Bot, Users, CalendarDays, BookOpen, Compass } from "lucide-react";
import type { SeatChannel } from "@/types/database";
import { memberBenefits } from "@/lib/member-benefits";
import { moderationAgent } from "@/lib/moderation-agent";

interface RightRailProps {
  activeChannel: SeatChannel | null;
  memberCount: number;
}

export function RightRail({ activeChannel, memberCount }: RightRailProps) {
  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
        <div className="seat-image h-36">
          <Image
            src="/images/seat-squad-support-diverse.png"
            alt=""
            fill
            sizes="288px"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 z-10 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-accent">
              Message board
            </p>
            <p className="mt-1 text-sm font-black leading-5 text-white">
              Threads for questions, care, resources, and practical next steps.
            </p>
          </div>
        </div>
      </div>

      {/* Channel Info */}
      {activeChannel && (
        <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: activeChannel.color }}
            />
            <h3 className="font-display text-sm font-black">{activeChannel.name}</h3>
          </div>
          <p className="mt-2 text-xs font-semibold leading-relaxed text-muted-foreground">
            {activeChannel.description || "No description available."}
          </p>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
        <div className="flex items-center gap-2 text-primary">
          <Bot size={14} />
          <span className="text-xs font-black uppercase tracking-wider">{moderationAgent.name}</span>
        </div>
        <p className="mt-2 text-xs font-semibold leading-5 text-muted-foreground">
          {moderationAgent.shortDescription}
        </p>
      </div>

      {/* Member Count */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
        <div className="flex items-center gap-2 text-primary">
          <Users size={14} />
          <span className="text-xs font-bold uppercase tracking-wider">Members</span>
        </div>
        <p className="mt-2 text-2xl font-black text-foreground">{memberCount}</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
        <div className="flex items-center gap-2 text-accent">
          <CalendarDays size={14} />
          <span className="text-xs font-black uppercase tracking-wider">Board rhythm</span>
        </div>
        <div className="mt-3 space-y-3">
          <div className="rounded-lg border border-border bg-surface-high p-3">
            <p className="text-xs font-bold text-foreground">Weekly Q&A thread</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Pin member questions before live sessions.</p>
          </div>
          <Link href="/events" className="block text-xs font-black text-primary hover:underline">
            Connect forum threads to events
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
        <div className="flex items-center gap-2 text-primary">
          <BookOpen size={14} />
          <span className="text-xs font-black uppercase tracking-wider">Member benefits</span>
        </div>
        <div className="mt-3 space-y-2">
          {memberBenefits
            .filter((benefit) => benefit.status !== "Next build")
            .slice(0, 4)
            .map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="rounded-lg border border-border bg-surface-high p-3">
                  <div className="flex items-center gap-2">
                    <Icon size={14} className="text-primary" />
                    <p className="text-xs font-black">{benefit.title}</p>
                  </div>
                  <p className="mt-1 text-[11px] font-semibold text-muted-foreground">{benefit.status}</p>
                </div>
              );
            })}
        </div>
      </div>

      {/* Member Value */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
        <div className="flex items-center gap-2 text-secondary">
          <Compass size={14} />
          <span className="text-xs font-black uppercase tracking-wider">Start</span>
        </div>
        <div className="mt-3 space-y-2">
          <Link
            href="/start-here"
            className="flex items-center gap-2 rounded-lg border border-border bg-surface-high p-3 text-xs font-bold transition hover:border-primary"
          >
            <Compass size={14} />
            Start Here Guide
          </Link>
          <Link
            href="/resources"
            className="flex items-center gap-2 rounded-lg border border-border bg-surface-high p-3 text-xs font-bold transition hover:border-primary"
          >
            <BookOpen size={14} />
            Member Downloads
          </Link>
        </div>
      </div>
    </div>
  );
}
