"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpenText, ExternalLink, MessageSquarePlus, Podcast, Search, Send, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  remixReportArticles,
  remixReportPillars,
  type RemixReportArticle,
  type RemixReportPillar,
} from "@/lib/remix-report";

type RemixReportPageProps = {
  userId: string;
  discussionChannelId: string | null;
  liveQaChannelId: string | null;
  demoMode?: boolean;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}

export function RemixReportPage({ userId, discussionChannelId, liveQaChannelId, demoMode = false }: RemixReportPageProps) {
  const supabase = createClient();
  const [pillar, setPillar] = useState<RemixReportPillar | "All">("All");
  const [query, setQuery] = useState("");
  const [actionState, setActionState] = useState<Record<string, "idle" | "posting" | "posted" | "error">>({});

  const featuredArticle = remixReportArticles[0];

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return remixReportArticles.filter((article) => {
      const matchesPillar = pillar === "All" || article.pillar === pillar;
      const matchesQuery =
        !normalizedQuery ||
        `${article.title} ${article.dek} ${article.tags.join(" ")} ${article.memberTakeaway}`
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesPillar && matchesQuery;
    });
  }, [pillar, query]);

  const setArticleState = (key: string, state: "idle" | "posting" | "posted" | "error") => {
    setActionState((current) => ({ ...current, [key]: state }));
  };

  const createForumPost = async (article: RemixReportArticle, mode: "discussion" | "qa") => {
    const key = `${mode}-${article.id}`;
    const channelId = mode === "discussion" ? discussionChannelId : liveQaChannelId;

    if (demoMode) {
      setArticleState(key, "posted");
      return;
    }

    if (!channelId) {
      setArticleState(key, "error");
      return;
    }

    setArticleState(key, "posting");
    const prompt = mode === "discussion" ? article.discussionPrompt : article.qAndAPrompt;
    const title = mode === "discussion" ? `Discuss: ${article.title}` : `Q&A: ${article.title}`;
    const content = [
      prompt,
      "",
      `Remix Report signal: ${article.title}`,
      article.memberTakeaway,
      "",
      `Read: ${article.publicHref}`,
    ].join("\n");

    const { error } = await supabase.from("seat_posts").insert({
      channel_id: channelId,
      author_id: userId,
      type: "link",
      title,
      content,
      metadata: {
        source: "remix_report_context_feed",
        article_id: article.id,
        public_href: article.publicHref,
        mode,
      },
    });

    setArticleState(key, error ? "error" : "posted");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <section className="seat-hero-panel overflow-hidden rounded-2xl border border-secondary/30 shadow-warm">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">The Remix Report</p>
              <h1 className="mt-3 max-w-4xl font-display text-3xl font-black leading-[0.98] tracking-[-0.05em] sm:text-5xl">
                Signals, strategy, and field notes for better learning lives.
              </h1>
              <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-white/84 sm:text-lg">
                A member context feed for education shifts families should not have to decode alone: AI, policy, tutoring, homeschool, identity, pods, and the weekly reality of making decisions.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href={demoMode ? "/demo/forum" : "/forum"} className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-black text-accent-foreground">
                  Discuss in SEAT Squad <MessageSquarePlus size={16} />
                </Link>
                <Link href={demoMode ? "/demo/events" : "/events"} className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-black text-white">
                  Bring to Q&A <Send size={16} />
                </Link>
              </div>
            </div>
            <div className="bg-white/8 p-6 sm:p-8">
              <div className="rounded-xl border border-white/20 bg-white/10 p-5">
                <div className="flex items-center gap-2 text-accent">
                  <Sparkles size={22} />
                  <p className="text-xs font-black uppercase tracking-[0.18em]">This week&apos;s signal</p>
                </div>
                <h2 className="mt-3 font-display text-2xl font-black leading-tight">{featuredArticle.title}</h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-white/78">{featuredArticle.memberTakeaway}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {featuredArticle.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-black">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-border bg-card p-5 shadow-soft">
          <div className="grid gap-3 lg:grid-cols-[1fr_0.4fr]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search AI, pods, tutors, planning, belonging..."
                className="w-full rounded-md border border-border bg-surface-high py-3 pl-10 pr-3 text-sm font-semibold outline-none focus:border-primary"
              />
            </label>
            <select
              value={pillar}
              onChange={(event) => setPillar(event.target.value as RemixReportPillar | "All")}
              className="rounded-md border border-border bg-surface-high px-3 py-3 text-sm font-black outline-none focus:border-primary"
            >
              <option value="All">All pillars</option>
              {remixReportPillars.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[0.68fr_0.32fr]">
          <main className="grid gap-4">
            {filteredArticles.map((article) => (
              <article key={article.id} className="rounded-xl border border-border bg-card p-5 shadow-soft">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-surface-high px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-primary">
                        {article.pillar}
                      </span>
                      <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                        {article.status}
                      </span>
                      <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                        {formatDate(article.date)} · {article.readTime}
                      </span>
                    </div>
                    <h2 className="mt-3 font-display text-2xl font-black leading-tight tracking-[-0.04em]">{article.title}</h2>
                    <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">{article.dek}</p>
                  </div>
                  <a href={article.publicHref} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-border bg-surface-high px-3 py-2 text-xs font-black hover:border-primary">
                    Read <ExternalLink size={14} />
                  </a>
                </div>

                <div className="mt-5 rounded-lg border border-primary/25 bg-surface-high p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Member takeaway</p>
                  <p className="mt-2 text-sm font-black leading-6">{article.memberTakeaway}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-bold">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => createForumPost(article, "discussion")}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2.5 text-xs font-black text-primary-foreground disabled:opacity-50"
                    disabled={actionState[`discussion-${article.id}`] === "posting"}
                  >
                    <MessageSquarePlus size={14} />
                    {actionState[`discussion-${article.id}`] === "posted" ? "Discussion started" : "Discuss"}
                  </button>
                  <button
                    type="button"
                    onClick={() => createForumPost(article, "qa")}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface-high px-3 py-2.5 text-xs font-black hover:border-primary disabled:opacity-50"
                    disabled={actionState[`qa-${article.id}`] === "posting"}
                  >
                    <Send size={14} />
                    {actionState[`qa-${article.id}`] === "posted" ? "Q&A queued" : "Ask in Q&A"}
                  </button>
                  {article.relatedResourceHref && (
                    <Link href={demoMode ? article.relatedResourceHref.replace("/", "/demo/") : article.relatedResourceHref} className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2.5 text-xs font-black hover:border-primary">
                      Related resource <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
                {(actionState[`discussion-${article.id}`] === "error" || actionState[`qa-${article.id}`] === "error") && (
                  <p className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-black text-destructive">
                    Could not create the forum thread. Make sure the Remix Report and Live Q&A channels exist.
                  </p>
                )}
              </article>
            ))}
          </main>

          <aside className="space-y-4">
            <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center gap-2 text-primary">
                <BookOpenText size={18} />
                <p className="text-xs font-black uppercase tracking-[0.18em]">Context feed</p>
              </div>
              <p className="mt-3 text-sm font-semibold leading-6 text-muted-foreground">
                The Remix Report tracks signals. SEAT Squad turns them into conversation, support, referrals, and next steps.
              </p>
            </section>

            <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center gap-2 text-secondary">
                <Podcast size={18} />
                <p className="text-xs font-black uppercase tracking-[0.18em]">Next version</p>
              </div>
              <div className="mt-3 space-y-3 text-sm font-semibold leading-6 text-muted-foreground">
                <p>Wire to the public Remix Report CMS or RSS feed.</p>
                <p>Attach podcast/video episodes to matching articles.</p>
                <p>Auto-create weekly forum discussion prompts.</p>
              </div>
            </section>
          </aside>
        </section>
      </div>
    </div>
  );
}
