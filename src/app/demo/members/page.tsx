import Image from "next/image";
import { Heart, MapPinned, Search, Users } from "lucide-react";

const members = [
  {
    id: "member-1",
    display_name: "Janelle W.",
    role: "family",
    tier: "member",
    tags: ["Leaving school", "Middle school", "ADHD support", "Portfolio help"],
  },
  {
    id: "member-2",
    display_name: "Maya R.",
    role: "both",
    tier: "member",
    tags: ["Pod curious", "Elementary", "Project-based", "LGBTQ-inclusive"],
  },
  {
    id: "member-3",
    display_name: "Roberto C.",
    role: "educator",
    tier: "pro",
    tags: ["Tutor", "Math confidence", "Bilingual", "Virtual"],
  },
];

export default function DemoMembersPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-warm">
          <div className="grid md:grid-cols-[1.15fr_0.85fr]">
            <div className="p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                Member directory
              </p>
              <h1 className="mt-3 font-display text-3xl font-black leading-[0.98] tracking-[-0.05em] sm:text-5xl">
                Find the people building nearby learning lives.
              </h1>
              <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-muted-foreground sm:text-lg">
                The directory starts with roles, learning contexts, and goals, then grows into the pod, microschool, and homeschool group discovery layer.
              </p>
            </div>
            <div className="seat-image min-h-56">
              <Image
                src="/images/seat-squad-community-diverse.png"
                alt=""
                fill
                sizes="(min-width: 768px) 360px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <Users className="text-primary" size={22} />
            <p className="mt-3 text-2xl font-black">27</p>
            <p className="text-sm font-bold text-muted-foreground">Founding profiles target</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <MapPinned className="text-secondary" size={22} />
            <p className="mt-3 text-lg font-black">Pod and group directory next</p>
            <p className="mt-1 text-sm font-bold text-muted-foreground">
              Location, age band, cost, learning style, and inclusion filters.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <Heart className="text-accent" size={22} />
            <p className="mt-3 text-lg font-black">Privacy first</p>
            <p className="mt-1 text-sm font-bold text-muted-foreground">
              Member visibility stays opt-in and context-aware.
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-start gap-3">
            <Search className="mt-1 text-primary" size={22} />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                Directory promise
              </p>
              <h2 className="mt-2 font-display text-2xl font-black tracking-[-0.04em]">
                Help families find the other humans near them.
              </h2>
              <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-muted-foreground">
                The goal is not a giant social graph. It is a practical way to find safe, aligned learning connections.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => (
            <article key={member.id} className="rounded-xl border border-border bg-card p-5 shadow-soft">
              <h2 className="font-display text-xl font-black tracking-[-0.04em]">
                {member.display_name}
              </h2>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-primary">
                {member.role} - {member.tier}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {member.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border bg-surface-high px-2.5 py-1 text-xs font-bold">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
