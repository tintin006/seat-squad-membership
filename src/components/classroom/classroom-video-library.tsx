"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Clock, Lock, PlayCircle, Route, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { canAccessTier, type SeatTier } from "@/lib/tiers";
import {
  classroomVideoCategories,
  classroomVideos,
  starterCurriculumPath,
  type ClassroomVideoCategory,
} from "@/lib/classroom-videos";

type VideoProgress = {
  video_id: string;
  completed_at: string | null;
};

type ClassroomVideoLibraryProps = {
  userId: string | null;
  userTier: SeatTier;
  progress: VideoProgress[];
  demoMode?: boolean;
};

export function ClassroomVideoLibrary({ userId, userTier, progress, demoMode = false }: ClassroomVideoLibraryProps) {
  const supabase = createClient();
  const [activeCategory, setActiveCategory] = useState<ClassroomVideoCategory | "All">("All");
  const [query, setQuery] = useState("");
  const [completedIds, setCompletedIds] = useState(() => new Set(progress.filter((item) => item.completed_at).map((item) => item.video_id)));
  const [savingId, setSavingId] = useState<string | null>(null);

  const filteredVideos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return classroomVideos.filter((video) => {
      const categoryMatch = activeCategory === "All" || video.category === activeCategory;
      const queryMatch =
        !normalizedQuery ||
        `${video.title} ${video.summary} ${video.outcomes.join(" ")}`.toLowerCase().includes(normalizedQuery);
      return categoryMatch && queryMatch;
    });
  }, [activeCategory, query]);

  const completedCount = completedIds.size;
  const accessibleCount = classroomVideos.filter((video) => canAccessTier(userTier, video.tier)).length;

  const toggleCompleted = async (videoId: string) => {
    if (!userId) return;
    const currentlyCompleted = completedIds.has(videoId);
    setSavingId(videoId);

    if (!demoMode) {
      await supabase.from("seat_video_progress").upsert({
        user_id: userId,
        video_id: videoId,
        completed_at: currentlyCompleted ? null : new Date().toISOString(),
        last_watched_at: new Date().toISOString(),
      });
    }

    setCompletedIds((existing) => {
      const next = new Set(existing);
      if (currentlyCompleted) next.delete(videoId);
      else next.add(videoId);
      return next;
    });
    setSavingId(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <section className="seat-hero-panel rounded-lg border border-secondary/30 p-6 shadow-warm sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">How-to Homeschool Videos</p>
          <h1 className="mt-3 max-w-4xl font-display text-3xl font-black leading-tight sm:text-5xl">
            A starter video library for calmer homeschool decisions.
          </h1>
          <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-white/84">
            Short practical walkthroughs for orientation, records, weekly rhythm, learner support, pods, and AI expectations.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-white/15 bg-white/10 p-4">
              <p className="text-2xl font-black">{classroomVideos.length}</p>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/70">videos planned</p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 p-4">
              <p className="text-2xl font-black">{accessibleCount}</p>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/70">available to you</p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 p-4">
              <p className="text-2xl font-black">{completedCount}</p>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/70">completed</p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card p-5 shadow-soft">
          <div className="flex items-start gap-3">
            <span className="rounded-md bg-primary p-2 text-primary-foreground">
              <Route size={20} />
            </span>
            <div>
              <p className="seat-kicker">Starter curriculum path</p>
              <h2 className="mt-1 font-display text-2xl font-black">First four videos</h2>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {starterCurriculumPath.map((video, index) => (
              <div key={video.id} className="rounded-lg border border-border bg-surface-high p-3">
                <p className="text-xs font-black text-primary">Step {index + 1}</p>
                <p className="mt-1 text-sm font-black leading-5">{video.title}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card p-5 shadow-soft">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search records, rhythm, AI, pods, support..."
                className="w-full rounded-md border border-border bg-surface-high py-3 pl-10 pr-3 text-sm font-semibold outline-none focus:border-primary"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {["All", ...classroomVideoCategories].map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category as ClassroomVideoCategory | "All")}
                  className={`rounded-md border px-3 py-2 text-xs font-black transition ${
                    activeCategory === category ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface-high hover:border-primary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          {filteredVideos.map((video) => {
            const Icon = video.icon;
            const locked = !canAccessTier(userTier, video.tier);
            const completed = completedIds.has(video.id);
            return (
              <article key={video.id} className="rounded-lg border border-border bg-card p-5 shadow-soft">
                <div className="flex items-start gap-4">
                  <span className="rounded-md bg-primary p-2 text-primary-foreground">
                    <Icon size={22} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-surface-high px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em]">{video.category}</span>
                      <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em]">{video.tier}</span>
                      <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em]">{video.duration}</span>
                    </div>
                    <h2 className="mt-3 font-display text-xl font-black">{video.title}</h2>
                    <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">{video.summary}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {video.outcomes.map((outcome) => (
                    <span key={outcome} className="rounded-md border border-border bg-surface-high p-2 text-xs font-bold">
                      {outcome}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex flex-col gap-3 rounded-lg border border-primary/30 bg-surface-high p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-primary">
                    <Clock size={16} />
                    <p className="text-xs font-black uppercase tracking-[0.16em]">Video lesson</p>
                  </div>
                  {locked ? (
                    <a href="/settings" className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-black text-muted-foreground transition hover:border-primary hover:text-primary">
                      <Lock size={14} /> Upgrade to watch
                    </a>
                  ) : (
                    <div className="flex gap-2">
                      <button className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-black text-primary-foreground">
                        <PlayCircle size={14} /> Watch
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleCompleted(video.id)}
                        disabled={savingId === video.id}
                        className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-black transition ${
                          completed ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:border-primary"
                        }`}
                      >
                        <CheckCircle2 size={14} /> {completed ? "Completed" : "Mark done"}
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
