"use client";

import { useState } from "react";
import { Bot, CheckCircle, ShieldAlert, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { moderationAgent, type ModerationFlag, type ModerationFlagStatus } from "@/lib/moderation-agent";

export function ModerationAgentQueue({ flags }: { flags: ModerationFlag[] }) {
  const supabase = createClient();
  const [notes, setNotes] = useState<Record<string, string>>(
    Object.fromEntries(flags.map((flag) => [flag.id, flag.admin_notes || ""]))
  );

  const updateStatus = async (id: string, status: Exclude<ModerationFlagStatus, "pending">) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase
      .from("seat_moderation_flags")
      .update({
        status,
        admin_notes: notes[id] || null,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);

    window.location.reload();
  };

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 font-display text-lg font-black">
              <Bot size={18} className="text-primary" />
              {moderationAgent.name}
            </h2>
            <p className="mt-1 text-xs font-semibold leading-5 text-muted-foreground">
              {moderationAgent.shortDescription} {moderationAgent.reviewStandard}
            </p>
          </div>
          <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-primary">
            Bot
          </span>
        </div>
      </div>

      <div className="divide-y divide-border">
        {flags.length === 0 && (
          <div className="p-8 text-center text-sm font-semibold text-muted-foreground">
            No bot-flagged content is waiting for review.
          </div>
        )}

        {flags.map((flag) => (
          <div key={flag.id} className="p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                    flag.severity === "high"
                      ? "bg-destructive/10 text-destructive"
                      : flag.severity === "medium"
                        ? "bg-accent/20 text-foreground"
                        : "bg-surface-high text-muted-foreground"
                  }`}>
                    {flag.severity} severity
                  </span>
                  <span className="rounded bg-surface-high px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    {flag.source_type}
                  </span>
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    Flagged {new Date(flag.created_at).toLocaleDateString()} by {flag.bot_name}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {flag.categories.map((category) => (
                    <span key={category} className="rounded-full border border-border bg-surface-high px-2.5 py-1 text-[11px] font-black">
                      {category}
                    </span>
                  ))}
                  <span className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-black text-muted-foreground">
                    {Math.round(flag.confidence * 100)}% confidence
                  </span>
                </div>

                <div className="mt-3 rounded-lg border border-border bg-surface-high p-3">
                  <p className="flex items-center gap-2 text-xs font-black text-foreground">
                    <ShieldAlert size={14} className="text-primary" />
                    Bot recommendation
                  </p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-muted-foreground">
                    {flag.recommendation}
                  </p>
                </div>

                <div className="mt-3 rounded-lg border border-border bg-card p-3">
                  <p className="text-xs font-black text-foreground">
                    {flag.author?.[0]?.display_name || "Unknown member"}
                  </p>
                  <p className="mt-1 line-clamp-4 text-xs font-semibold leading-5 text-muted-foreground">
                    {flag.excerpt}
                  </p>
                </div>

                <textarea
                  value={notes[flag.id] || ""}
                  onChange={(event) => setNotes((current) => ({ ...current, [flag.id]: event.target.value }))}
                  placeholder="Admin review note"
                  rows={2}
                  className="mt-3 w-full resize-none rounded-md border border-border bg-surface-high px-3 py-2 text-xs font-semibold outline-none focus:border-primary"
                />
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => updateStatus(flag.id, "resolved")}
                  className="flex items-center gap-1 rounded-md bg-green-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-green-700 transition hover:bg-green-200"
                >
                  <CheckCircle size={12} /> Resolve
                </button>
                <button
                  onClick={() => updateStatus(flag.id, "dismissed")}
                  className="flex items-center gap-1 rounded-md bg-muted px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground transition hover:bg-surface-high"
                >
                  <XCircle size={12} /> Dismiss
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
