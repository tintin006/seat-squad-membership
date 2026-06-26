"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarCheck, CalendarDays, CheckCircle, Clock, ExternalLink, MessageSquarePlus, PlayCircle, Save, Sparkles, Video } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { LiveSession, LiveSessionResourceLink, LiveSessionRsvp } from "@/lib/live-qa";
import { memberBenefits } from "@/lib/member-benefits";

type LiveQAPageProps = {
  session: LiveSession;
  rsvp: LiveSessionRsvp | null;
  orientationSession?: LiveSession | null;
  orientationRsvp?: LiveSessionRsvp | null;
  userId: string;
  liveQaChannelId: string | null;
  isAdmin?: boolean;
  demoMode?: boolean;
};

function parseResources(raw: string): LiveSessionResourceLink[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, href, type] = line.split("|").map((part) => part.trim());
      return { label, href, type };
    })
    .filter((resource) => resource.label && resource.href);
}

function resourcesToText(resources: LiveSessionResourceLink[]) {
  return resources.map((resource) => [resource.label, resource.href, resource.type || ""].join(" | ")).join("\n");
}

export function LiveQAPage({
  session,
  rsvp,
  orientationSession = null,
  orientationRsvp = null,
  userId,
  liveQaChannelId,
  isAdmin = false,
  demoMode = false,
}: LiveQAPageProps) {
  const supabase = createClient();
  const [rsvpStatus, setRsvpStatus] = useState(rsvp?.status || "canceled");
  const [orientationStatus, setOrientationStatus] = useState(orientationRsvp?.status || "canceled");
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [orientationLoading, setOrientationLoading] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionBody, setQuestionBody] = useState("");
  const [questionState, setQuestionState] = useState<"idle" | "posting" | "posted" | "error">("idle");
  const [adminReplayUrl, setAdminReplayUrl] = useState(session.replay_url || "");
  const [adminRecap, setAdminRecap] = useState(session.recap || "");
  const [adminResources, setAdminResources] = useState(resourcesToText(session.resource_links));
  const [adminState, setAdminState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const isInterested = rsvpStatus === "interested" || rsvpStatus === "going";
  const isOrientationInterested = orientationStatus === "interested" || orientationStatus === "going";
  const hasArchive = Boolean(session.replay_url || session.recap || session.resource_links.length);
  const focusBenefits = useMemo(
    () => memberBenefits.filter((benefit) => ["Live Weekly Q&A", "The Remix Report", "How-to Homeschool Videos", "Downloadable Resource Guides", "Community Forum"].includes(benefit.title)),
    []
  );

  const updateRsvp = async () => {
    if (demoMode) {
      setRsvpStatus(isInterested ? "canceled" : "interested");
      return;
    }

    setRsvpLoading(true);
    const nextStatus = isInterested ? "canceled" : "interested";
    const { error } = await supabase.from("seat_live_session_rsvps").upsert({
      session_id: session.id,
      user_id: userId,
      status: nextStatus,
    });

    if (!error) setRsvpStatus(nextStatus);
    setRsvpLoading(false);
  };

  const updateOrientationRsvp = async () => {
    if (!orientationSession) return;

    if (demoMode) {
      setOrientationStatus(isOrientationInterested ? "canceled" : "interested");
      return;
    }

    setOrientationLoading(true);
    const nextStatus = isOrientationInterested ? "canceled" : "interested";
    const { error } = await supabase.from("seat_live_session_rsvps").upsert({
      session_id: orientationSession.id,
      user_id: userId,
      status: nextStatus,
    });

    if (!error) setOrientationStatus(nextStatus);
    setOrientationLoading(false);
  };

  const submitQuestion = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!questionTitle.trim() || !questionBody.trim()) return;

    if (demoMode) {
      setQuestionState("posted");
      setQuestionTitle("");
      setQuestionBody("");
      return;
    }

    if (!liveQaChannelId) {
      setQuestionState("error");
      return;
    }

    setQuestionState("posting");
    const { data, error } = await supabase
      .from("seat_posts")
      .insert({
        channel_id: liveQaChannelId,
        author_id: userId,
        type: "text",
        title: `Q&A: ${questionTitle.trim()}`,
        content: questionBody.trim(),
        metadata: { source: "live_weekly_q_and_a", live_session_id: session.id },
      })
      .select("id")
      .single();

    if (error) {
      setQuestionState("error");
      return;
    }

    await supabase.from("seat_live_session_rsvps").upsert({
      session_id: session.id,
      user_id: userId,
      status: "interested",
      question_post_id: data.id,
    });

    setRsvpStatus("interested");
    setQuestionTitle("");
    setQuestionBody("");
    setQuestionState("posted");
  };

  const saveArchive = async (event: React.FormEvent) => {
    event.preventDefault();
    if (demoMode) {
      setAdminState("saved");
      return;
    }

    setAdminState("saving");
    const { error } = await supabase
      .from("seat_live_sessions")
      .update({
        replay_url: adminReplayUrl.trim() || null,
        recap: adminRecap.trim() || null,
        resource_links: parseResources(adminResources),
        status: adminReplayUrl.trim() || adminRecap.trim() ? "complete" : session.status,
      })
      .eq("id", session.id);

    setAdminState(error ? "error" : "saved");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <section className="seat-hero-panel rounded-2xl border border-secondary/30 p-6 shadow-warm sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">Live Weekly Q&A</p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-black leading-[0.98] tracking-[-0.05em] sm:text-5xl">
            Bring the question. Leave with a clearer next step.
          </h1>
          <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-white/84 sm:text-lg">
            The weekly Q&A pulls from member forum questions first, then leaves room for live follow-ups and the real-time context that does not fit neatly into a guide.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-white/15 bg-white/10 p-4">
              <CalendarDays size={20} className="text-accent" />
              <p className="mt-2 text-lg font-black">{session.day_label}</p>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/68">{session.cadence}</p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 p-4">
              <Clock size={20} className="text-accent" />
              <p className="mt-2 text-lg font-black">{session.time_label}</p>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/68">live session</p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 p-4">
              <Video size={20} className="text-accent" />
              <p className="mt-2 text-lg font-black">{session.location_url ? "Meeting link set" : "Link coming soon"}</p>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/68">{session.status}</p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[0.62fr_0.38fr]">
          <main className="space-y-4">
            <article className="rounded-xl border border-border bg-card p-6 shadow-soft">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Recurring event</p>
                  <h2 className="mt-2 font-display text-2xl font-black tracking-[-0.04em]">{session.title}</h2>
                  <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-muted-foreground">{session.description}</p>
                </div>
                <button
                  type="button"
                  onClick={updateRsvp}
                  disabled={rsvpLoading}
                  className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-black transition ${
                    isInterested
                      ? "border border-primary bg-primary/10 text-primary"
                      : "bg-primary text-primary-foreground hover:translate-y-[-1px]"
                  } disabled:opacity-50`}
                >
                  <CheckCircle size={16} />
                  {isInterested ? "Interested" : "I am interested"}
                </button>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {["Submit questions in the forum", "Top themes shape the session", "Replay and recap live here"].map((step) => (
                  <div key={step} className="rounded-lg border border-border bg-surface-high p-3">
                    <p className="text-sm font-black">{step}</p>
                  </div>
                ))}
              </div>
            </article>

            <form onSubmit={submitQuestion} className="rounded-xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-start gap-3">
                <span className="rounded-lg bg-primary/10 p-2 text-primary">
                  <MessageSquarePlus size={20} />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Submit a question</p>
                  <h2 className="mt-2 font-display text-2xl font-black tracking-[-0.04em]">Add it to the Live Q&A forum channel.</h2>
                </div>
              </div>
              <input
                value={questionTitle}
                onChange={(event) => setQuestionTitle(event.target.value)}
                placeholder="Short question title"
                className="mt-5 w-full rounded-md border border-border bg-surface-high px-3 py-2.5 text-sm font-black outline-none focus:border-primary"
              />
              <textarea
                value={questionBody}
                onChange={(event) => setQuestionBody(event.target.value)}
                placeholder="Add context: state, ages, deadline, curriculum friction, ESA issue, pod question, or what you have already tried."
                rows={5}
                className="mt-3 w-full resize-none rounded-md border border-border bg-surface-high px-3 py-2.5 text-sm font-semibold leading-6 outline-none focus:border-primary"
              />
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-semibold text-muted-foreground">
                  Questions post as forum threads so members can add context before the live session.
                </p>
                <button
                  type="submit"
                  disabled={questionState === "posting" || !questionTitle.trim() || !questionBody.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-xs font-black text-primary-foreground disabled:opacity-40"
                >
                  <MessageSquarePlus size={14} />
                  {questionState === "posting" ? "Posting..." : "Submit question"}
                </button>
              </div>
              {questionState === "posted" && (
                <p className="mt-3 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-bold text-primary">
                  Question posted to Live Q&A.
                </p>
              )}
              {questionState === "error" && (
                <p className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-bold text-destructive">
                  Could not post the question. Make sure the Live Q&A channel exists.
                </p>
              )}
            </form>

            <section className="rounded-xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-2 text-primary">
                <PlayCircle size={20} />
                <p className="text-xs font-black uppercase tracking-[0.22em]">Replay and recap</p>
              </div>
              {hasArchive ? (
                <div className="mt-4 space-y-4">
                  {session.replay_url && (
                    <a href={session.replay_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-black text-primary-foreground">
                      Watch replay <ExternalLink size={14} />
                    </a>
                  )}
                  {session.recap && <p className="text-sm font-semibold leading-6 text-muted-foreground">{session.recap}</p>}
                  {session.resource_links.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {session.resource_links.map((resource) => (
                        <a key={`${resource.label}-${resource.href}`} href={resource.href} target={resource.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="rounded-lg border border-border bg-surface-high p-4 transition hover:border-primary">
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">{resource.type || "Resource"}</p>
                          <p className="mt-2 text-sm font-black">{resource.label}</p>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-3 text-sm font-semibold leading-6 text-muted-foreground">
                  After each session, this section will hold the replay link, written recap, timestamps, and member resources mentioned live.
                </p>
              )}
            </section>
          </main>

          <aside className="space-y-4">
            {orientationSession && (
              <section className="rounded-xl border border-primary/35 bg-card p-5 shadow-soft">
                <div className="flex items-start gap-3">
                  <span className="rounded-lg bg-primary p-2 text-primary-foreground">
                    <CalendarCheck size={20} />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Founding orientation</p>
                    <h2 className="mt-2 font-display text-xl font-black tracking-[-0.04em]">{orientationSession.title}</h2>
                  </div>
                </div>
                <p className="mt-3 text-sm font-semibold leading-6 text-muted-foreground">
                  {orientationSession.description}
                </p>
                <div className="mt-4 grid gap-2 text-xs font-black sm:grid-cols-2 lg:grid-cols-1">
                  <span className="rounded-md border border-border bg-surface-high px-3 py-2">
                    {orientationSession.day_label}
                  </span>
                  <span className="rounded-md border border-border bg-surface-high px-3 py-2">
                    {orientationSession.time_label}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={updateOrientationRsvp}
                  disabled={orientationLoading}
                  className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-black transition ${
                    isOrientationInterested
                      ? "border border-primary bg-primary/10 text-primary"
                      : "bg-primary text-primary-foreground hover:translate-y-[-1px]"
                  } disabled:opacity-50`}
                >
                  <CheckCircle size={16} />
                  {isOrientationInterested ? "Interested" : "Save my spot"}
                </button>
              </section>
            )}

            <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles size={18} />
                <p className="text-xs font-black uppercase tracking-[0.18em]">What Q&A feeds</p>
              </div>
              <div className="mt-4 space-y-3">
                {focusBenefits.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={benefit.title} className="rounded-lg border border-border bg-surface-high p-3">
                      <div className="flex items-center gap-2">
                        <Icon size={14} className="text-primary" />
                        <p className="text-xs font-black">{benefit.title}</p>
                      </div>
                      <p className="mt-1 text-[11px] font-semibold leading-5 text-muted-foreground">{benefit.description}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Forum bridge</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
                The Live Q&A channel is the question inbox. The live session is the conversation. This page becomes the archive.
              </p>
              <Link href={demoMode ? "/demo/forum" : "/forum"} className="mt-4 inline-flex items-center gap-2 rounded-md border border-border bg-surface-high px-3 py-2 text-xs font-black hover:border-primary">
                Open forum <ExternalLink size={14} />
              </Link>
            </section>

            {isAdmin && (
              <form onSubmit={saveArchive} className="rounded-xl border border-primary/30 bg-card p-5 shadow-soft">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Admin archive fields</p>
                <input
                  value={adminReplayUrl}
                  onChange={(event) => setAdminReplayUrl(event.target.value)}
                  placeholder="Replay URL"
                  className="mt-4 w-full rounded-md border border-border bg-surface-high px-3 py-2 text-xs font-semibold outline-none focus:border-primary"
                />
                <textarea
                  value={adminRecap}
                  onChange={(event) => setAdminRecap(event.target.value)}
                  placeholder="Written recap"
                  rows={4}
                  className="mt-3 w-full resize-none rounded-md border border-border bg-surface-high px-3 py-2 text-xs font-semibold outline-none focus:border-primary"
                />
                <textarea
                  value={adminResources}
                  onChange={(event) => setAdminResources(event.target.value)}
                  placeholder="Resource links: Label | URL | Type"
                  rows={4}
                  className="mt-3 w-full resize-none rounded-md border border-border bg-surface-high px-3 py-2 text-xs font-semibold outline-none focus:border-primary"
                />
                <button type="submit" className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-black text-primary-foreground">
                  <Save size={14} />
                  {adminState === "saving" ? "Saving..." : "Save archive"}
                </button>
                {adminState === "saved" && <p className="mt-2 text-xs font-black text-primary">Saved.</p>}
                {adminState === "error" && <p className="mt-2 text-xs font-black text-destructive">Could not save archive.</p>}
              </form>
            )}
          </aside>
        </section>
      </div>
    </div>
  );
}
