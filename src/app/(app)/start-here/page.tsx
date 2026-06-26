import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, MessageCircle, ShieldCheck } from "lucide-react";
import { memberResources } from "@/lib/member-resources";
import { benefitCategories, memberBenefits } from "@/lib/member-benefits";
import { ResourceCard } from "@/components/resource-card";

const firstResources = memberResources.filter((resource) =>
  ["seat-start-here", "first-30-days", "weekly-reset", "strengths-friction-map"].includes(resource.id)
);

const norms = [
  "Be specific enough to be useful.",
  "Respect the family behind the question.",
  "Do not flatten identity or assume one right path.",
  "Share what worked for you without prescribing it for everyone.",
  "Protect kids' privacy. No identifying details without consent.",
];

export default function StartHerePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <section className="seat-hero-panel overflow-hidden rounded-2xl border border-secondary/30 shadow-warm">
          <div className="grid md:grid-cols-[1.2fr_0.8fr]">
            <div className="p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">
                Member orientation
              </p>
              <h1 className="mt-3 font-display text-3xl font-black leading-[0.98] tracking-[-0.05em] sm:text-5xl">
                Start here when learning life feels loud.
              </h1>
              <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-white/84 sm:text-lg">
                The SEAT Squad is a practical community for families and educators building flexible,
                culturally affirming learning lives. Bring the real question. Leave with a clearer next step.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-black text-accent-foreground transition hover:translate-y-[-1px]"
                >
                  Go to the feed <ArrowRight size={16} />
                </Link>
                <Link
                  href="/resources"
                  className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-black text-white transition hover:bg-white/16"
                >
                  Browse resources <BookOpen size={16} />
                </Link>
              </div>
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
            <MessageCircle className="text-primary" size={22} />
            <h2 className="mt-3 font-display text-xl font-black">First post</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
              Introduce yourself with your role, learner age band, and one thing that would make this month easier.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <BookOpen className="text-secondary" size={22} />
            <h2 className="mt-3 font-display text-xl font-black">First resource</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
              Pick one template below. Do not download everything. Start with the friction closest to today.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <ShieldCheck className="text-accent" size={22} />
            <h2 className="mt-3 font-display text-xl font-black">First norm</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
              We protect kids, context, and dignity. Specific help beats generic advice every time.
            </p>
          </div>
        </section>

        <section className="mt-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
            What membership gives you
          </p>
          <h2 className="mt-1 font-display text-2xl font-black tracking-[-0.04em]">
            Guidance, tools, people, and rhythm
          </h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-4">
            {benefitCategories.map((category) => {
              const Icon = category.icon;
              return (
                <article key={category.title} className="rounded-xl border border-border bg-card p-5 shadow-soft">
                  <Icon className="text-primary" size={22} />
                  <h3 className="mt-3 font-display text-xl font-black">{category.title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
                    {category.description}
                  </p>
                </article>
              );
            })}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {memberBenefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article key={benefit.title} className="rounded-xl border border-border bg-card p-4 shadow-soft">
                  <div className="flex items-start gap-3">
                    <span className="rounded-lg bg-primary p-2 text-primary-foreground">
                      <Icon size={18} />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-lg font-black">{benefit.title}</h3>
                        <span className="rounded-full border border-border bg-surface-high px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                          {benefit.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-semibold leading-6 text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                Starter resources
              </p>
              <h2 className="mt-1 font-display text-2xl font-black tracking-[-0.04em]">
                Four good places to begin
              </h2>
            </div>
            <Link href="/crate" className="text-sm font-black text-primary hover:underline">
              See starter tools
            </Link>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {firstResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-border bg-card p-6">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Community norms</p>
          <div className="mt-4 grid gap-3 md:grid-cols-5">
            {norms.map((norm, index) => (
              <div key={norm} className="rounded-lg border border-border bg-surface-high p-4">
                <p className="text-xs font-black text-primary">0{index + 1}</p>
                <p className="mt-2 text-sm font-bold leading-6">{norm}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
