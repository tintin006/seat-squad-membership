import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Download,
  Flame,
  MapPinned,
  MessageSquareText,
  Newspaper,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { digitalDownloads } from "@/lib/digital-downloads";
import { remixReportArticles } from "@/lib/remix-report";

export type DashboardProfile = {
  display_name: string | null;
  role: string;
  tier: string;
  intent_tags: string[];
  methodology_tags: string[];
  grade_levels: string[];
  location: string | null;
};

export type DashboardPost = {
  id: string;
  title: string | null;
  content: string;
  created_at: string;
  channel: { name: string; slug: string; color: string } | null;
  author: { display_name: string | null } | null;
};

export type DashboardLiveSession = {
  title: string;
  day_label: string;
  time_label: string;
  timezone: string;
  status: string;
};

export type DashboardPointTotal = {
  total_points: number;
  posts_count: number;
  comments_count: number;
  pod_submissions_count: number;
};

export type DashboardBadge = {
  name: string;
  description: string;
};

export type MemberDashboardPageProps = {
  profile: DashboardProfile;
  memberCount: number;
  approvedGroupCount: number;
  latestPosts: DashboardPost[];
  liveSession: DashboardLiveSession | null;
  rsvpStatus: string | null;
  pointTotal: DashboardPointTotal | null;
  badges: DashboardBadge[];
  hrefPrefix?: string;
};

const actionMap = [
  {
    match: ["Download state and ESA guides", "Curriculum and resources"],
    title: "Download your first guide",
    description: "Start with the free ESA and homeschool resource guides already waiting in Resources.",
    href: "/resources",
    cta: "Open resources",
    icon: Download,
  },
  {
    match: ["Find a pod or homeschool group", "Co-op / pod"],
    title: "Find a local group",
    description: "Search the pod, microschool, co-op, and homeschool group directory by state.",
    href: "/pods",
    cta: "Browse groups",
    icon: MapPinned,
  },
  {
    match: ["Submit a Live Q&A question"],
    title: "Bring a question to Q&A",
    description: "Use the weekly Live Q&A thread to get practical help from the SEAT Squad team.",
    href: "/events",
    cta: "Open Q&A",
    icon: CalendarDays,
  },
  {
    match: ["Follow The Remix Report"],
    title: "Read the latest signal",
    description: "Turn Remix Report articles into forum discussion, Q&A prompts, and next steps.",
    href: "/remix-report",
    cta: "Read the feed",
    icon: Newspaper,
  },
  {
    match: ["Ask a homeschool question", "Meet other families", "Community and support"],
    title: "Post your first question",
    description: "The forum is the quickest place to name what feels stuck and get pointed to a resource.",
    href: "/forum",
    cta: "Open forum",
    icon: MessageSquareText,
  },
];

const fallbackAction = {
  title: "Start with one useful thread",
  description: "Introduce yourself, name the learning-life friction closest to today, and let the community point you to the right next step.",
  href: "/forum",
  cta: "Go to the forum",
  icon: MessageSquareText,
};

function resolveHref(href: string, prefix?: string) {
  if (!prefix) return href;
  return href === "/" ? prefix : `${prefix}${href}`;
}

function getRecommendedAction(profile: DashboardProfile) {
  const signals = [
    ...(profile.intent_tags || []),
    ...(profile.methodology_tags || []),
  ];
  return actionMap.find((action) => action.match.some((tag) => signals.includes(tag))) || fallbackAction;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(date));
}

export function MemberDashboardPage({
  profile,
  memberCount,
  approvedGroupCount,
  latestPosts,
  liveSession,
  rsvpStatus,
  pointTotal,
  badges,
  hrefPrefix,
}: MemberDashboardPageProps) {
  const displayName = profile.display_name || "Member";
  const recommendedAction = getRecommendedAction(profile);
  const RecommendedIcon = recommendedAction.icon;
  const featuredDownload = digitalDownloads[0];
  const latestSignal = remixReportArticles[0];
  const stats = [
    { label: "Members", value: memberCount || 0 },
    { label: "Groups", value: approvedGroupCount || 0 },
    { label: "Points", value: pointTotal?.total_points || 0 },
  ];
  const quickLinks = [
    { label: "Forum", href: "/forum", icon: MessageSquareText, note: "Ask, answer, and trade notes." },
    { label: "Resources", href: "/resources", icon: Download, note: "Guides, planners, and downloads." },
    { label: "Pods", href: "/pods", icon: MapPinned, note: "Find groups near your state." },
    { label: "Live Q&A", href: "/events", icon: CalendarDays, note: "RSVP or submit a question." },
  ];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="seat-hero-panel overflow-hidden rounded-lg border border-secondary/20 shadow-warm">
        <div className="grid gap-6 p-5 md:grid-cols-[1fr_19rem] md:p-7">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-accent">
              Member dashboard
            </p>
            <h1 className="mt-3 font-display text-3xl font-black leading-tight sm:text-4xl">
              Welcome back, {displayName}.
            </h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-white/82">
              Your SEAT Squad home now pulls the forum, downloads, groups, weekly Q&A, and Remix Report into one working surface.
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-white/15 bg-white/10 p-3">
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-xs font-bold text-white/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-white/15 bg-white/10 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <RecommendedIcon size={20} />
            </div>
            <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-white/60">
              Best next step
            </p>
            <h2 className="mt-2 font-display text-xl font-black">{recommendedAction.title}</h2>
            <p className="mt-2 text-sm font-semibold leading-5 text-white/78">{recommendedAction.description}</p>
            <Link
              href={resolveHref(recommendedAction.href, hrefPrefix)}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-black text-accent-foreground transition hover:translate-y-[-1px]"
            >
              {recommendedAction.cta} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={resolveHref(item.href, hrefPrefix)}
              className="seat-card rounded-lg p-4 shadow-soft transition hover:translate-y-[-1px] hover:border-primary/70"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface-high text-primary">
                  <Icon size={20} />
                </span>
                <span>
                  <span className="block font-display text-lg font-black">{item.label}</span>
                  <span className="mt-1 block text-sm font-semibold leading-5 text-muted-foreground">{item.note}</span>
                </span>
              </div>
            </Link>
          );
        })}
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="seat-card rounded-lg p-5 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="seat-kicker">Forum pulse</p>
              <h2 className="mt-1 font-display text-2xl font-black">Latest member threads</h2>
            </div>
            <Link href={resolveHref("/forum", hrefPrefix)} className="text-sm font-black text-primary">
              View all
            </Link>
          </div>
          <div className="mt-4 divide-y divide-border">
            {latestPosts.length > 0 ? latestPosts.map((post) => (
              <Link key={post.id} href={resolveHref("/forum", hrefPrefix)} className="block py-4">
                <div className="flex flex-wrap items-center gap-2">
                  {post.channel && (
                    <span className="rounded-full px-2 py-1 text-[11px] font-black text-white" style={{ backgroundColor: post.channel.color }}>
                      {post.channel.name}
                    </span>
                  )}
                  <span className="text-xs font-bold text-muted-foreground">{formatDate(post.created_at)}</span>
                </div>
                <h3 className="mt-2 font-display text-lg font-black">{post.title || "Member thread"}</h3>
                <p className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-muted-foreground">{post.content}</p>
              </Link>
            )) : (
              <div className="rounded-lg border border-dashed border-border bg-card p-5 text-sm font-semibold text-muted-foreground">
                No threads yet. The forum is ready for the first founding member question.
              </div>
            )}
          </div>
        </section>

        <aside className="grid gap-5">
          <section className="seat-card rounded-lg p-5 shadow-soft">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <CalendarDays size={20} />
              </span>
              <div>
                <p className="seat-kicker">This week</p>
                <h2 className="mt-1 font-display text-xl font-black">{liveSession?.title || "Weekly Live Q&A"}</h2>
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold text-muted-foreground">
              {liveSession ? `${liveSession.day_label} at ${liveSession.time_label}` : "Thursdays at 7:00 PM ET"}
            </p>
            <p className="mt-2 text-xs font-black uppercase tracking-[0.12em] text-primary">
              {rsvpStatus ? `RSVP: ${rsvpStatus}` : "RSVP open"}
            </p>
            <Link href={resolveHref("/events", hrefPrefix)} className="mt-4 inline-flex items-center gap-2 text-sm font-black text-primary">
              Submit a question <ArrowRight size={15} />
            </Link>
          </section>

          <section className="seat-card rounded-lg p-5 shadow-soft">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-surface-high text-secondary">
                <Newspaper size={20} />
              </span>
              <div>
                <p className="seat-kicker">Remix Report</p>
                <h2 className="mt-1 font-display text-xl font-black">{latestSignal.title}</h2>
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold leading-5 text-muted-foreground">{latestSignal.memberTakeaway}</p>
            <Link href={resolveHref("/remix-report", hrefPrefix)} className="mt-4 inline-flex items-center gap-2 text-sm font-black text-primary">
              Open signal feed <ArrowRight size={15} />
            </Link>
          </section>

          <section className="seat-card rounded-lg p-5 shadow-soft">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <Trophy size={20} />
              </span>
              <div>
                <p className="seat-kicker">Contribution</p>
                <h2 className="mt-1 font-display text-xl font-black">{pointTotal?.total_points || 0} points</h2>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-bold">
              <span className="rounded-md bg-muted p-2">{pointTotal?.posts_count || 0} posts</span>
              <span className="rounded-md bg-muted p-2">{pointTotal?.comments_count || 0} replies</span>
              <span className="rounded-md bg-muted p-2">{badges.length} badges</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(badges.length ? badges : [{ name: "First Post", description: "Share a first post to begin." }]).slice(0, 3).map((badge) => (
                <span key={badge.name} className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-1 text-xs font-black">
                  <Flame size={12} /> {badge.name}
                </span>
              ))}
            </div>
            <Link href={resolveHref("/leaderboard", hrefPrefix)} className="mt-4 inline-flex items-center gap-2 text-sm font-black text-primary">
              View leaderboard <ArrowRight size={15} />
            </Link>
          </section>
        </aside>
      </div>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="seat-card rounded-lg p-5 shadow-soft">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Download size={20} />
            </span>
            <div>
              <p className="seat-kicker">Featured download</p>
              <h2 className="mt-1 font-display text-xl font-black">{featuredDownload.title}</h2>
            </div>
          </div>
          <p className="mt-3 text-sm font-semibold leading-5 text-muted-foreground">{featuredDownload.summary}</p>
          <Link href={resolveHref("/resources", hrefPrefix)} className="mt-4 inline-flex items-center gap-2 text-sm font-black text-primary">
            See all downloads <ArrowRight size={15} />
          </Link>
        </div>

        <div className="seat-card rounded-lg p-5 shadow-soft">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-surface-high text-primary">
              <Users size={20} />
            </span>
            <div>
              <p className="seat-kicker">Your profile signals</p>
              <h2 className="mt-1 font-display text-xl font-black">What SEAT Squad knows to prioritize</h2>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[profile.location, ...profile.grade_levels, ...profile.methodology_tags, ...profile.intent_tags].filter(Boolean).slice(0, 10).map((tag) => (
              <span key={tag} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-black">
                {tag}
              </span>
            ))}
          </div>
          <Link href={resolveHref("/settings", hrefPrefix)} className="mt-4 inline-flex items-center gap-2 text-sm font-black text-primary">
            Update settings <Sparkles size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
