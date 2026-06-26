import Link from "next/link";
import { ArrowRight, CalendarDays, Download, Mail, MessageSquareText, Newspaper, Send } from "lucide-react";
import { weeklyRecapIssue, weeklyRecapSections } from "@/lib/weekly-recap";

export type RecapThread = {
  id: string;
  title: string | null;
  content: string;
  created_at: string;
  channel: { name: string; slug: string; color: string } | null;
};

export type WeeklyRecapPageProps = {
  latestThreads: RecapThread[];
  memberCount: number;
  approvedGroupCount: number;
  hrefPrefix?: string;
};

function resolveHref(href: string, prefix?: string) {
  if (!prefix) return href;
  return href === "/" ? prefix : `${prefix}${href}`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(date));
}

export function WeeklyRecapPage({ latestThreads, memberCount, approvedGroupCount, hrefPrefix }: WeeklyRecapPageProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <section className="seat-hero-panel rounded-lg border border-secondary/30 p-6 shadow-warm sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">Weekly recap</p>
              <h1 className="mt-3 max-w-4xl font-display text-3xl font-black leading-tight sm:text-5xl">
                {weeklyRecapIssue.subject}
              </h1>
              <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-white/84">
                {weeklyRecapIssue.intro}
              </p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 p-4">
              <Mail size={24} className="text-accent" />
              <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-white/64">
                {weeklyRecapIssue.issue}
              </p>
              <p className="mt-1 text-2xl font-black">{weeklyRecapIssue.dateLabel}</p>
              <p className="mt-3 text-sm font-semibold leading-5 text-white/78">
                Ready as an in-app digest now. Later this becomes the email body.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-white/15 bg-white/10 p-4">
              <p className="text-2xl font-black">{memberCount}</p>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/70">members</p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 p-4">
              <p className="text-2xl font-black">{approvedGroupCount}</p>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/70">approved groups</p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 p-4">
              <p className="text-2xl font-black">{latestThreads.length}</p>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/70">threads featured</p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-4">
          {weeklyRecapSections.map((item) => (
            <Link
              key={item.title}
              href={resolveHref(item.href, hrefPrefix)}
              className="seat-card rounded-lg p-4 shadow-soft transition hover:translate-y-[-1px] hover:border-primary/70"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">{item.eyebrow}</p>
              <h2 className="mt-2 font-display text-lg font-black">{item.title}</h2>
              <p className="mt-2 text-sm font-semibold leading-5 text-muted-foreground">{item.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-primary">
                Open <ArrowRight size={15} />
              </span>
            </Link>
          ))}
        </section>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="seat-card rounded-lg p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <span className="rounded-md bg-primary p-2 text-primary-foreground">
                <MessageSquareText size={20} />
              </span>
              <div>
                <p className="seat-kicker">Community pulse</p>
                <h2 className="font-display text-2xl font-black">Threads to bring forward</h2>
              </div>
            </div>
            <div className="mt-4 divide-y divide-border">
              {latestThreads.length > 0 ? latestThreads.map((thread) => (
                <Link key={thread.id} href={resolveHref("/forum", hrefPrefix)} className="block py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {thread.channel && (
                      <span className="rounded-full px-2 py-1 text-[11px] font-black text-white" style={{ backgroundColor: thread.channel.color }}>
                        {thread.channel.name}
                      </span>
                    )}
                    <span className="text-xs font-bold text-muted-foreground">{formatDate(thread.created_at)}</span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-black">{thread.title || "Member thread"}</h3>
                  <p className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-muted-foreground">{thread.content}</p>
                </Link>
              )) : (
                <p className="mt-4 rounded-lg border border-dashed border-border bg-card p-4 text-sm font-semibold text-muted-foreground">
                  No threads yet. The first recap can feature founder prompts until member posts arrive.
                </p>
              )}
            </div>
          </section>

          <aside className="grid gap-5">
            <section className="seat-card rounded-lg p-5 shadow-soft">
              <div className="flex items-start gap-3">
                <span className="rounded-md bg-primary p-2 text-primary-foreground">
                  <Download size={20} />
                </span>
                <div>
                  <p className="seat-kicker">Download to feature</p>
                  <h2 className="mt-1 font-display text-xl font-black">{weeklyRecapIssue.featuredDownload.title}</h2>
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold leading-5 text-muted-foreground">
                {weeklyRecapIssue.featuredDownload.summary}
              </p>
              <Link href={resolveHref("/resources", hrefPrefix)} className="mt-4 inline-flex items-center gap-2 text-sm font-black text-primary">
                Open resources <ArrowRight size={15} />
              </Link>
            </section>

            <section className="seat-card rounded-lg p-5 shadow-soft">
              <div className="flex items-start gap-3">
                <span className="rounded-md bg-surface-high p-2 text-secondary">
                  <Newspaper size={20} />
                </span>
                <div>
                  <p className="seat-kicker">Signal to discuss</p>
                  <h2 className="mt-1 font-display text-xl font-black">{weeklyRecapIssue.featuredSignal.title}</h2>
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold leading-5 text-muted-foreground">
                {weeklyRecapIssue.featuredSignal.discussionPrompt}
              </p>
              <Link href={resolveHref("/remix-report", hrefPrefix)} className="mt-4 inline-flex items-center gap-2 text-sm font-black text-primary">
                Open Remix Report <ArrowRight size={15} />
              </Link>
            </section>

            <section className="rounded-lg border border-primary/30 bg-primary p-5 text-primary-foreground shadow-soft">
              <Send size={22} />
              <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-white/70">One clear next step</p>
              <h2 className="mt-2 font-display text-xl font-black">{weeklyRecapIssue.nextStep}</h2>
              <Link href={resolveHref("/events", hrefPrefix)} className="mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-black text-accent-foreground">
                RSVP or ask live <CalendarDays size={15} />
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
