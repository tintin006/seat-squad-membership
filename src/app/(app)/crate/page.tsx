import Image from "next/image";
import { ResourceCard } from "@/components/resource-card";
import { memberResources, tracks } from "@/lib/member-resources";
import { memberBenefits } from "@/lib/member-benefits";

export default function CratePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-warm">
          <div className="grid md:grid-cols-[0.82fr_1.18fr]">
            <div className="seat-image min-h-56">
              <Image
                src="/images/seat-squad-support-diverse.png"
                alt=""
                fill
                sizes="(min-width: 768px) 360px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                The Crate Lite
              </p>
              <h1 className="mt-3 font-display text-3xl font-black leading-[0.98] tracking-[-0.05em] sm:text-5xl">
                Practical tools for the learning life you actually have.
              </h1>
              <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-muted-foreground sm:text-lg">
                These starter resources are designed for quick relief, better questions, and clearer next steps.
                They are intentionally lightweight until member requests tell us what to build deeper.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6 flex flex-wrap gap-2">
          {tracks.map((track) => (
            <span
              key={track}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground shadow-soft"
            >
              {track}
            </span>
          ))}
        </div>

        <section className="mt-6 grid gap-4 xl:grid-cols-2">
          {memberResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </section>

        <section className="mt-8 rounded-xl border border-border bg-card p-6 shadow-soft">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
            Coming into The Crate
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {memberBenefits
              .filter((benefit) => ["Downloadable Resource Guides", "Planners and Calendars", "Downloadable Lesson Plans"].includes(benefit.title))
              .map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="rounded-lg border border-border bg-surface-high p-4">
                    <Icon className="text-primary" size={20} />
                    <h2 className="mt-3 font-display text-lg font-black">{benefit.title}</h2>
                    <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">{benefit.description}</p>
                  </div>
                );
              })}
          </div>
        </section>
      </div>
    </div>
  );
}
