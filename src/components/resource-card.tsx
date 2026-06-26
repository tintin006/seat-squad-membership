import type { MemberResource } from "@/lib/member-resources";

export function ResourceCard({ resource }: { resource: MemberResource }) {
  const Icon = resource.icon;

  return (
    <article className="rounded-xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-start gap-4">
        <span className="rounded-lg bg-primary p-2 text-primary-foreground">
          <Icon size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-surface-high px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-foreground">
              {resource.track}
            </span>
            <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
              {resource.format}
            </span>
            <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
              {resource.time}
            </span>
          </div>
          <h3 className="mt-3 font-display text-xl font-black tracking-[-0.04em]">
            {resource.title}
          </h3>
          <p className="mt-1 text-sm font-bold text-muted-foreground">{resource.subtitle}</p>
          <p className="mt-3 text-sm font-semibold leading-6 text-muted-foreground">{resource.summary}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
            Best for
          </p>
          <ul className="mt-2 space-y-1.5 text-sm font-semibold text-muted-foreground">
            {resource.bestFor.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
            Inside
          </p>
          <ul className="mt-2 space-y-1.5 text-sm font-semibold text-muted-foreground">
            {resource.inside.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-primary/30 bg-surface-high p-3">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Next step</p>
        <p className="mt-1 text-sm font-semibold leading-6">{resource.nextStep}</p>
      </div>
    </article>
  );
}
