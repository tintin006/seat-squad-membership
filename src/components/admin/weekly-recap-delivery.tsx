"use client";

import { useState } from "react";
import { Loader2, MailCheck, Send } from "lucide-react";

type WeeklyRecapDeliveryProps = {
  memberCount: number;
  demoMode?: boolean;
};

type SendResult = {
  mode: string;
  requested: number;
  attempted: number;
  sent: number;
  failed: number;
};

export function WeeklyRecapDelivery({ memberCount, demoMode = false }: WeeklyRecapDeliveryProps) {
  const [loadingMode, setLoadingMode] = useState<"test" | "members" | null>(null);
  const [result, setResult] = useState<SendResult | null>(null);
  const [error, setError] = useState("");

  const sendRecap = async (mode: "test" | "members") => {
    setError("");
    setResult(null);
    setLoadingMode(mode);

    if (demoMode) {
      setResult({
        mode,
        requested: mode === "test" ? 1 : memberCount,
        attempted: mode === "test" ? 1 : memberCount,
        sent: mode === "test" ? 1 : memberCount,
        failed: 0,
      });
      setLoadingMode(null);
      return;
    }

    const response = await fetch("/api/weekly-recap/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode }),
    });
    const payload = await response.json();
    setLoadingMode(null);

    if (!response.ok) {
      setError(payload.error || "Could not send weekly recap.");
      return;
    }

    setResult(payload);
  };

  return (
    <section className="rounded-lg border border-border bg-card shadow-soft">
      <div className="border-b border-border p-5">
        <h2 className="flex items-center gap-2 font-display text-xl font-black">
          <MailCheck size={20} className="text-primary" />
          Weekly Recap Delivery
        </h2>
        <p className="mt-1 text-sm font-semibold text-muted-foreground">
          Send the current weekly recap as a test email, then send it to onboarded active members.
        </p>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="rounded-lg border border-border bg-surface-high p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Eligible members</p>
          <p className="mt-2 text-3xl font-black">{memberCount}</p>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">
            Uses onboarded, non-suspended SEAT profiles matched to Supabase auth emails.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:w-[22rem]">
          <button
            type="button"
            onClick={() => sendRecap("test")}
            disabled={Boolean(loadingMode)}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface-high px-4 py-3 text-sm font-black transition hover:border-primary disabled:opacity-50"
          >
            {loadingMode === "test" ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Send test
          </button>
          <button
            type="button"
            onClick={() => sendRecap("members")}
            disabled={Boolean(loadingMode)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-black text-primary-foreground transition hover:translate-y-[-1px] disabled:opacity-50"
          >
            {loadingMode === "members" ? <Loader2 size={16} className="animate-spin" /> : <MailCheck size={16} />}
            Send to members
          </button>
        </div>
      </div>

      {error && (
        <p className="mx-5 mb-5 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-bold text-destructive">
          {error}
        </p>
      )}

      {result && (
        <p className="mx-5 mb-5 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-bold text-primary">
          {result.mode} send complete: {result.sent} sent, {result.failed} failed, {result.attempted} attempted.
        </p>
      )}
    </section>
  );
}
