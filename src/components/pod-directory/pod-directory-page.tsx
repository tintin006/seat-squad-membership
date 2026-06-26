"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Building2, ExternalLink, MapPinned, Navigation, Search, ShieldCheck } from "lucide-react";
import {
  getStateName,
  PodGroup,
  samplePodGroups,
  stateResourceLinks,
  surroundingStates,
  usStates,
  venueIdeas,
} from "@/lib/pod-directory";
import { PodSubmissionModal } from "./pod-submission-modal";

type PodDirectoryPageProps = {
  groups: PodGroup[];
  demoMode?: boolean;
};

function formatLabel(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function PodDirectoryPage({ groups, demoMode = false }: PodDirectoryPageProps) {
  const [selectedState, setSelectedState] = useState("GA");
  const directoryGroups = useMemo(
    () => (groups.length > 0 ? groups : demoMode ? samplePodGroups : []),
    [groups, demoMode]
  );
  const neighborCodes = surroundingStates[selectedState] || [];

  const filteredGroups = useMemo(() => {
    return directoryGroups.filter((group) => group.state === selectedState || group.nearby_states.includes(selectedState));
  }, [directoryGroups, selectedState]);

  const localCount = filteredGroups.filter((group) => group.state === selectedState).length;
  const surroundingCount = filteredGroups.length - localCount;
  const resources = stateResourceLinks[selectedState] || [
    { label: `${getStateName(selectedState)} resource guide request`, href: "https://remixacademics.com/resources", type: "Guide request" },
    { label: "Homeschool pods and microschools guide", href: "https://remixacademics.com/resources/homeschool-pods-microschools", type: "Planning" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <section className="seat-hero-panel overflow-hidden rounded-2xl border border-secondary/30 shadow-warm">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">
                Pod and group directory
              </p>
              <h1 className="mt-3 max-w-3xl font-display text-3xl font-black leading-[0.98] tracking-[-0.05em] sm:text-5xl">
                Find the other families building nearby learning lives.
              </h1>
              <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-white/84 sm:text-lg">
                Search by state, scan nearby options, and submit groups for admin review so families can find pods, co-ops, microschools, and local learning circles without relying on scattered social posts.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <PodSubmissionModal demoMode={demoMode} />
                <Link
                  href="#state-resources"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-black text-white transition hover:bg-white/16"
                >
                  State resources <ExternalLink size={16} />
                </Link>
              </div>
            </div>
            <div className="bg-white/8 p-6 sm:p-8">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">Directory map</p>
                    <h2 className="mt-1 font-display text-2xl font-black">{getStateName(selectedState)}</h2>
                  </div>
                  <MapPinned size={34} className="text-accent" />
                </div>
                <div className="mt-5 rounded-xl border border-white/20 bg-white/10 p-4">
                  <div className="grid grid-cols-5 gap-2">
                    {usStates.map((state) => {
                      const isActive = state.code === selectedState;
                      const isNearby = neighborCodes.includes(state.code);
                      return (
                        <button
                          key={state.code}
                          type="button"
                          onClick={() => setSelectedState(state.code)}
                          className={`rounded-md border px-2 py-3 text-xs font-black transition ${
                            isActive
                              ? "border-accent bg-accent text-accent-foreground"
                              : isNearby
                                ? "border-white/40 bg-white/18 text-white"
                                : "border-white/15 bg-white/8 text-white/70 hover:bg-white/14"
                          }`}
                        >
                          {state.code}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <p className="mt-4 text-sm font-semibold leading-6 text-white/80">
                  Showing {localCount} in-state group{localCount === 1 ? "" : "s"} and {surroundingCount} nearby option{surroundingCount === 1 ? "" : "s"}.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[0.35fr_0.65fr]">
          <aside className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center gap-2 text-primary">
              <Search size={18} />
              <p className="text-xs font-black uppercase tracking-[0.2em]">Select state</p>
            </div>
            <select
              value={selectedState}
              onChange={(event) => setSelectedState(event.target.value)}
              className="mt-4 w-full rounded-md border border-border bg-surface-high px-3 py-2.5 text-sm font-black outline-none focus:border-primary"
            >
              {usStates.map((state) => (
                <option key={state.code} value={state.code}>{state.name}</option>
              ))}
            </select>

            <div className="mt-5 rounded-lg border border-border bg-surface-high p-4">
              <div className="flex items-center gap-2 text-secondary">
                <Navigation size={16} />
                <p className="text-xs font-black uppercase tracking-[0.16em]">Nearby states</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {neighborCodes.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setSelectedState(code)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-black hover:border-primary"
                  >
                    {getStateName(code)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-primary/30 bg-surface-high p-4">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck size={16} />
                <p className="text-xs font-black uppercase tracking-[0.16em]">Review model</p>
              </div>
              <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
                Member submissions go into Supabase as pending records. Admin approval controls what appears in the directory.
              </p>
            </div>
          </aside>

          <main>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Groups near {getStateName(selectedState)}</p>
                <h2 className="mt-1 font-display text-2xl font-black tracking-[-0.04em]">
                  {filteredGroups.length || "No"} reviewed option{filteredGroups.length === 1 ? "" : "s"}
                </h2>
              </div>
              <PodSubmissionModal demoMode={demoMode} />
            </div>

            <div className="grid gap-4">
              {filteredGroups.map((group) => (
                <article key={group.id} className="rounded-xl border border-border bg-card p-5 shadow-soft">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-2xl font-black tracking-[-0.04em]">{group.group_name}</h3>
                        <span className="rounded-full bg-surface-high px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">{group.group_type}</span>
                        <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">{formatLabel(group.format)}</span>
                      </div>
                      <p className="mt-2 text-sm font-black text-primary">{group.city}, {group.state}</p>
                      <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-muted-foreground">{group.description}</p>
                    </div>
                    {group.website_url && (
                      <a href={group.website_url} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-border bg-surface-high px-3 py-2 text-xs font-black hover:border-primary">
                        Visit site <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-border bg-surface-high p-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Ages</p>
                      <p className="mt-1 text-sm font-bold">{group.age_bands.join(", ")}</p>
                    </div>
                    <div className="rounded-lg border border-border bg-surface-high p-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Cost</p>
                      <p className="mt-1 text-sm font-bold">{group.cost_range || "Not listed"}</p>
                    </div>
                    <div className="rounded-lg border border-border bg-surface-high p-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Rhythm</p>
                      <p className="mt-1 text-sm font-bold">{group.meeting_rhythm || "Not listed"}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.inclusion_tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold">{tag}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            {filteredGroups.length === 0 && (
              <div className="rounded-xl border border-border bg-card p-8 text-center shadow-soft">
                <h3 className="font-display text-2xl font-black">No reviewed groups here yet.</h3>
                <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-muted-foreground">
                  This is a perfect founding-member job: add a group you trust, or request a guide for finding local options in {getStateName(selectedState)}.
                </p>
                <div className="mt-5">
                  <PodSubmissionModal demoMode={demoMode} />
                </div>
              </div>
            )}
          </main>
        </section>

        <section id="state-resources" className="mt-8 grid gap-4 lg:grid-cols-[0.58fr_0.42fr]">
          <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">State resource bridge</p>
            <h2 className="mt-2 font-display text-2xl font-black tracking-[-0.04em]">
              Pair local groups with state-specific guidance.
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {resources.map((resource) => (
                <a key={resource.label} href={resource.href} target="_blank" rel="noreferrer" className="rounded-lg border border-border bg-surface-high p-4 transition hover:border-primary">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">{resource.type}</p>
                  <p className="mt-2 text-sm font-black">{resource.label}</p>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-2 text-secondary">
              <Building2 size={20} />
              <p className="text-xs font-black uppercase tracking-[0.22em]">Local learning venues</p>
            </div>
            <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
              Next pass can attach state/city venue lists to the directory so groups can plan outings, meetup days, and low-cost learning.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {venueIdeas.map((venue) => (
                <span key={venue} className="rounded-full border border-border bg-surface-high px-3 py-1.5 text-xs font-bold">{venue}</span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
