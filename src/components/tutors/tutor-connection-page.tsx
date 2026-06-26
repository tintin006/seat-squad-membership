"use client";

import { useState } from "react";
import { CheckCircle2, GraduationCap, Handshake, Loader2, Send, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { TutorProfile } from "@/lib/tutor-connection";
import { canAccessTier, type SeatTier } from "@/lib/tiers";

type TutorConnectionPageProps = {
  userId: string | null;
  userTier: SeatTier;
  tutors: TutorProfile[];
  demoMode?: boolean;
};

const subjectOptions = ["Math", "Reading / ELA", "Writing", "Science", "Executive function", "Portfolio projects"];

export function TutorConnectionPage({ userId, userTier, tutors, demoMode = false }: TutorConnectionPageProps) {
  const supabase = createClient();
  const [learnerAgeBand, setLearnerAgeBand] = useState("Elementary");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [supportGoal, setSupportGoal] = useState("");
  const [scheduleNotes, setScheduleNotes] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [preferredFormat, setPreferredFormat] = useState("Virtual");
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const canRequest = canAccessTier(userTier, "member");

  const toggleSubject = (subject: string) => {
    setSubjects((existing) => existing.includes(subject) ? existing.filter((item) => item !== subject) : [...existing, subject]);
  };

  const submitRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userId || !canRequest || !supportGoal.trim()) return;

    setState("saving");
    if (!demoMode) {
      const { error } = await supabase.from("seat_tutor_connection_requests").insert({
        requester_id: userId,
        tutor_profile_id: selectedTutorId,
        learner_age_band: learnerAgeBand,
        subjects,
        support_goal: supportGoal.trim(),
        schedule_notes: scheduleNotes.trim() || null,
        budget_range: budgetRange.trim() || null,
        preferred_format: preferredFormat,
      });

      if (error) {
        setState("error");
        return;
      }
    }

    setState("saved");
    setSupportGoal("");
    setScheduleNotes("");
    setBudgetRange("");
    setSubjects([]);
    setSelectedTutorId(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <section className="seat-hero-panel rounded-lg border border-secondary/30 p-6 shadow-warm sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">Tutor Connection</p>
          <h1 className="mt-3 max-w-4xl font-display text-3xl font-black leading-tight sm:text-5xl">
            Find support that fits the learner, not just the subject.
          </h1>
          <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-white/84">
            This MVP starts with vetted profiles, a fit checklist, and admin-reviewed connection requests. No open marketplace yet.
          </p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { icon: GraduationCap, title: "Fit over credentials alone", text: "Look for trust, communication, learner context, and the support job." },
            { icon: Handshake, title: "Admin-reviewed requests", text: "Connection requests go through review before any direct handoff." },
            { icon: ShieldCheck, title: "Clear boundaries", text: "SEAT Squad helps with fit and introductions; providers remain independent." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-lg border border-border bg-card p-5 shadow-soft">
                <Icon className="text-primary" size={22} />
                <h2 className="mt-3 font-display text-xl font-black">{item.title}</h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">{item.text}</p>
              </div>
            );
          })}
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <section className="rounded-lg border border-border bg-card p-5 shadow-soft">
              <p className="seat-kicker">Tutor fit checklist</p>
              <h2 className="mt-1 font-display text-2xl font-black">Ask these before choosing support</h2>
              <div className="mt-4 grid gap-2">
                {["What job are we hiring this person to do?", "What helps this learner feel safe enough to try?", "How will we know the support is working?", "What communication rhythm does the family need?"].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-md border border-border bg-surface-high p-3">
                    <CheckCircle2 size={16} className="text-primary" />
                    <p className="text-sm font-bold">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-5 shadow-soft">
              <p className="seat-kicker">Reviewed profiles</p>
              <div className="mt-4 space-y-3">
                {tutors.map((tutor) => (
                  <button
                    key={tutor.id}
                    type="button"
                    onClick={() => setSelectedTutorId(selectedTutorId === tutor.id ? null : tutor.id)}
                    className={`w-full rounded-lg border p-4 text-left transition ${
                      selectedTutorId === tutor.id ? "border-primary bg-primary/10" : "border-border bg-surface-high hover:border-primary"
                    }`}
                  >
                    <h3 className="font-display text-lg font-black">{tutor.display_name}</h3>
                    <p className="mt-1 text-sm font-bold text-muted-foreground">{tutor.headline}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {[...tutor.subjects, ...tutor.learner_fit_tags].slice(0, 5).map((tag) => (
                        <span key={tag} className="rounded-full border border-border bg-card px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <form onSubmit={submitRequest} className="rounded-lg border border-border bg-card p-5 shadow-soft">
            <p className="seat-kicker">Connect me</p>
            <h2 className="mt-1 font-display text-2xl font-black">Request a fit review</h2>
            {!canRequest && (
              <p className="mt-3 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-bold text-primary">
                Tutor connection requests are a Member+ benefit. You can still use the checklist now.
              </p>
            )}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold">Learner age band</span>
                <select value={learnerAgeBand} onChange={(event) => setLearnerAgeBand(event.target.value)} className="w-full rounded-md border border-border bg-surface-high px-3 py-2 text-sm font-bold outline-none focus:border-primary">
                  {["Pre-K", "Elementary", "Middle", "High school", "Adult learner"].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold">Preferred format</span>
                <select value={preferredFormat} onChange={(event) => setPreferredFormat(event.target.value)} className="w-full rounded-md border border-border bg-surface-high px-3 py-2 text-sm font-bold outline-none focus:border-primary">
                  {["Virtual", "In person", "Hybrid", "Not sure"].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-4">
              <p className="mb-2 text-sm font-bold">Subjects/support areas</p>
              <div className="flex flex-wrap gap-2">
                {subjectOptions.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => toggleSubject(subject)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-black ${
                      subjects.includes(subject) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface-high"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm font-bold">Support goal</span>
              <textarea value={supportGoal} onChange={(event) => setSupportGoal(event.target.value)} rows={5} placeholder="What do you want support to help change?" className="w-full rounded-md border border-border bg-surface-high px-3 py-2 text-sm font-semibold outline-none focus:border-primary" />
            </label>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input value={scheduleNotes} onChange={(event) => setScheduleNotes(event.target.value)} placeholder="Schedule notes" className="rounded-md border border-border bg-surface-high px-3 py-2 text-sm font-semibold outline-none focus:border-primary" />
              <input value={budgetRange} onChange={(event) => setBudgetRange(event.target.value)} placeholder="Budget range" className="rounded-md border border-border bg-surface-high px-3 py-2 text-sm font-semibold outline-none focus:border-primary" />
            </div>
            <button disabled={!canRequest || !supportGoal.trim() || state === "saving"} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-black text-primary-foreground disabled:opacity-45">
              {state === "saving" ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Submit request
            </button>
            {state === "saved" && <p className="mt-3 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-bold text-primary">Request submitted for review.</p>}
            {state === "error" && <p className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-bold text-destructive">Could not submit request.</p>}
          </form>
        </section>
      </div>
    </div>
  );
}
