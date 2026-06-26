"use client";

import { useMemo, useState } from "react";
import { Download, FileArchive, Lock, Search } from "lucide-react";
import {
  digitalDownloads,
  downloadCategories,
  tierLabels,
  type DownloadCategory,
  type DownloadTier,
} from "@/lib/digital-downloads";
import { canAccessTier } from "@/lib/tiers";

type ResourceDownloadsPageProps = {
  userTier?: DownloadTier;
};

const stateFilters = ["All", "AZ", "FL", "GA", "NC", "TN"];

export function ResourceDownloadsPage({ userTier = "free" }: ResourceDownloadsPageProps) {
  const [category, setCategory] = useState<DownloadCategory | "All">("All");
  const [state, setState] = useState("All");
  const [query, setQuery] = useState("");

  const filteredDownloads = useMemo(() => {
    return digitalDownloads.filter((download) => {
      const matchesCategory = category === "All" || download.category === category;
      const matchesState = state === "All" || download.state === state;
      const matchesQuery =
        query.trim().length === 0 ||
        `${download.title} ${download.summary} ${download.inside.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase());
      return matchesCategory && matchesState && matchesQuery;
    });
  }, [category, state, query]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <section className="seat-hero-panel rounded-2xl border border-secondary/30 p-6 shadow-warm sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">
            Member resources
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-3xl font-black leading-[0.98] tracking-[-0.05em] sm:text-5xl">
            Downloadable guides for families making real education decisions.
          </h1>
          <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-white/84 sm:text-lg">
            Start with free ESA and homeschool state guides. Later, this library can expand into tier-locked lesson packs, planning bundles, and deeper member-only resources.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/16 bg-white/10 p-4">
              <p className="text-2xl font-black">{digitalDownloads.length}</p>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/70">Free downloads</p>
            </div>
            <div className="rounded-xl border border-white/16 bg-white/10 p-4">
              <p className="text-2xl font-black">5</p>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/70">ESA states</p>
            </div>
            <div className="rounded-xl border border-white/16 bg-white/10 p-4">
              <p className="text-2xl font-black">Next</p>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/70">Lesson packs by tier</p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-border bg-card p-5 shadow-soft">
          <div className="grid gap-3 lg:grid-cols-[1fr_0.32fr_0.32fr]">
            <label className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by state, ESA, records, special needs..."
                className="w-full rounded-md border border-border bg-surface-high py-3 pl-10 pr-3 text-sm font-semibold outline-none focus:border-primary"
              />
            </label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as DownloadCategory | "All")}
              className="rounded-md border border-border bg-surface-high px-3 py-3 text-sm font-black outline-none focus:border-primary"
            >
              <option value="All">All categories</option>
              {downloadCategories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <select
              value={state}
              onChange={(event) => setState(event.target.value)}
              className="rounded-md border border-border bg-surface-high px-3 py-3 text-sm font-black outline-none focus:border-primary"
            >
              {stateFilters.map((item) => (
                <option key={item} value={item}>{item === "All" ? "All states" : item}</option>
              ))}
            </select>
          </div>
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-2">
          {filteredDownloads.map((download) => {
            const Icon = download.icon;
            const locked = !canAccessTier(userTier, download.tier);
            const comingSoon = download.fileHref === "#";
            return (
              <article key={download.id} className="rounded-xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-start gap-4">
                  <span className="rounded-lg bg-primary p-2 text-primary-foreground">
                    <Icon size={22} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-surface-high px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-foreground">
                        {download.category}
                      </span>
                      <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                        {tierLabels[download.tier]}
                      </span>
                      <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                        {download.pages}
                      </span>
                    </div>
                    <h2 className="mt-3 font-display text-xl font-black tracking-[-0.04em]">
                      {download.title}
                    </h2>
                    <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
                      {download.summary}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 border-t border-border pt-4 md:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                      Best for
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm font-semibold text-muted-foreground">
                      {download.bestFor.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                      Inside
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm font-semibold text-muted-foreground">
                      {download.inside.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 rounded-lg border border-primary/30 bg-surface-high p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-primary">
                    <FileArchive size={16} />
                    <p className="text-xs font-black uppercase tracking-[0.16em]">
                      {download.format} · Updated {download.updated}
                    </p>
                  </div>
                  {locked ? (
                    <a href="/settings" className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-black text-muted-foreground transition hover:border-primary hover:text-primary">
                      <Lock size={14} />
                      Upgrade to unlock
                    </a>
                  ) : comingSoon ? (
                    <button disabled className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-black text-muted-foreground">
                      Preview only
                    </button>
                  ) : (
                    <a
                      href={download.fileHref}
                      download
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-black text-primary-foreground transition hover:translate-y-[-1px]"
                    >
                      <Download size={14} />
                      Download
                    </a>
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
