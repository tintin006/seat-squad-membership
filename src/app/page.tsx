import Image from "next/image";

const navItems = ["Home", "Classroom", "The Crate", "Events", "Members", "Tutors"];

const buildLayers = [
  {
    label: "01",
    title: "Auth + onboarding",
    copy: "Supabase Auth, SEAT profiles, three-screen intake, and free tier activation.",
  },
  {
    label: "02",
    title: "Community shell",
    copy: "Persistent left nav, centered feed, contextual right rail, and mobile bottom tabs.",
  },
  {
    label: "03",
    title: "Resources + learning",
    copy: "The Crate, classroom modules, events, and warm member-only upgrade paths.",
  },
];

const channels = [
  "Announcements",
  "General",
  "Learning Wins",
  "Ask the Squad",
  "Cultural Learning",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Image src="/brand/asterisk.png" alt="" width={28} height={28} priority />
            <div>
              <p className="font-display text-xl font-black leading-none tracking-[-0.05em]">
                SEAT Squad
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Remix Academics
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary preview navigation">
            {navItems.map((item) => (
              <span
                key={item}
                className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </nav>
          <a
            href="/BUILD_ROADMAP.md"
            className="rounded-md bg-primary px-4 py-2 text-sm font-black text-primary-foreground shadow-soft transition hover:translate-y-[-1px]"
          >
            Roadmap
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20">
        <div className="animate-reveal-up">
          <p className="inline-flex rounded-full border border-primary/35 bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
            Membership app scaffold
          </p>
          <h1 className="font-display mt-7 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
            The SEAT Squad app starts here.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            A Skool-inspired membership home with Remix Academics warmth: support,
            resources, events, classroom content, and a clean Teachers2Tutors bridge.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-md border border-border bg-card px-4 py-3 text-sm font-bold">
              Next.js App Router
            </span>
            <span className="rounded-md border border-border bg-card px-4 py-3 text-sm font-bold">
              Supabase shared DB, seat_* tables
            </span>
            <span className="rounded-md border border-border bg-card px-4 py-3 text-sm font-bold">
              Warm Editorial design system
            </span>
          </div>
        </div>

        <div className="animate-reveal-up rounded-xl border border-border bg-card p-4 shadow-warm [animation-delay:120ms] sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[190px_1fr_180px]">
            <aside className="rounded-lg bg-surface-low p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                Left nav
              </p>
              <div className="mt-4 space-y-2">
                {navItems.slice(0, 5).map((item, index) => (
                  <div
                    key={item}
                    className={`rounded-md px-3 py-2 text-sm font-bold ${
                      index === 0
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-foreground/80"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </aside>

            <section className="rounded-lg bg-background p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                Community feed
              </p>
              <div className="mt-4 rounded-lg border border-border bg-card p-4">
                <p className="text-sm font-black text-foreground">Your feed is quiet right now.</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Be the first to post something good: a win, a question, or a resource another family can use tonight.
                </p>
              </div>
              <div className="mt-4 space-y-3">
                {channels.map((channel) => (
                  <div key={channel} className="rounded-md border border-border bg-surface-low px-3 py-2 text-sm font-semibold">
                    {channel}
                  </div>
                ))}
              </div>
            </section>

            <aside className="rounded-lg bg-surface-high p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-secondary">
                Right rail
              </p>
              <div className="mt-4 space-y-3 text-sm font-semibold text-foreground/80">
                <p className="rounded-md bg-card p-3">Next event: Founding family orientation</p>
                <p className="rounded-md bg-card p-3">Crate tip: remix one routine before adding another.</p>
                <p className="rounded-md bg-primary p-3 text-primary-foreground">Upgrade CTA placeholder</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface-low py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="font-display text-sm font-black uppercase tracking-[0.22em] text-secondary">
            First build layers
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {buildLayers.map((layer) => (
              <article key={layer.label} className="rounded-xl border border-border bg-card p-6 shadow-soft">
                <p className="font-display text-5xl font-black leading-none text-primary">{layer.label}</p>
                <h2 className="font-display mt-5 text-2xl font-black tracking-[-0.04em]">
                  {layer.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{layer.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
