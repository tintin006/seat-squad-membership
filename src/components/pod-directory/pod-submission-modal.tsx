"use client";

import { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  ageBandOptions,
  groupFormats,
  groupTypes,
  inclusionOptions,
  usStates,
} from "@/lib/pod-directory";

type PodSubmissionModalProps = {
  demoMode?: boolean;
};

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function optionalText(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function PodSubmissionModal({ demoMode = false }: PodSubmissionModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    group_name: "",
    group_type: groupTypes[0],
    format: groupFormats[0].value,
    city: "",
    state: "GA",
    cost_range: "",
    meeting_rhythm: "",
    website_url: "",
    contact_email: "",
    contact_name: "",
    description: "",
  });
  const [nearbyStates, setNearbyStates] = useState<string[]>([]);
  const [ageBands, setAgeBands] = useState<string[]>(["Mixed ages"]);
  const [inclusionTags, setInclusionTags] = useState<string[]>(["Culturally affirming"]);

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const reset = () => {
    setSubmitted(false);
    setError("");
    setForm({
      group_name: "",
      group_type: groupTypes[0],
      format: groupFormats[0].value,
      city: "",
      state: "GA",
      cost_range: "",
      meeting_rhythm: "",
      website_url: "",
      contact_email: "",
      contact_name: "",
      description: "",
    });
    setNearbyStates([]);
    setAgeBands(["Mixed ages"]);
    setInclusionTags(["Culturally affirming"]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!form.group_name.trim() || !form.city.trim() || !form.description.trim()) {
      setError("Please add the group name, city, and a short description.");
      return;
    }

    if (form.description.trim().length < 20) {
      setError("Please add a little more detail so an admin can review the group.");
      return;
    }

    if (form.website_url.trim() && !/^https?:\/\//i.test(form.website_url.trim())) {
      setError("Please enter a website URL that starts with http:// or https://.");
      return;
    }

    if (demoMode) {
      setSubmitted(true);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      setError("Please sign in before submitting a group.");
      return;
    }

    const { error: insertError } = await supabase.from("seat_group_submissions").insert({
      submitted_by: user.id,
      status: "pending",
      group_name: form.group_name.trim(),
      group_type: form.group_type,
      format: form.format,
      city: form.city.trim(),
      state: form.state,
      cost_range: optionalText(form.cost_range),
      meeting_rhythm: optionalText(form.meeting_rhythm),
      website_url: optionalText(form.website_url),
      contact_email: optionalText(form.contact_email),
      contact_name: optionalText(form.contact_name),
      description: form.description.trim(),
      source_url: optionalText(form.website_url),
      nearby_states: nearbyStates,
      age_bands: ageBands,
      inclusion_tags: inclusionTags,
    });

    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setSubmitted(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          reset();
          setOpen(true);
        }}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-black text-primary-foreground transition hover:translate-y-[-1px]"
      >
        <Plus size={16} />
        Add your group
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/45 px-4 py-6 text-foreground backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-2xl border border-border bg-card text-foreground shadow-warm">
            <div className="flex items-start justify-between gap-4 border-b border-border p-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Submit for review</p>
                <h2 className="mt-1 font-display text-2xl font-black tracking-[-0.04em]">
                  Add a pod, microschool, co-op, or homeschool group
                </h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
                  Submissions stay pending until an admin reviews them for safety, fit, and completeness.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-2 text-muted-foreground hover:bg-surface-high hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            {submitted ? (
              <div className="p-6">
                <div className="rounded-xl border border-primary/30 bg-surface-high p-5">
                  <h3 className="font-display text-2xl font-black">Submitted for admin review.</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
                    Thanks. The group will not appear in the directory until it is reviewed and approved.
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="mt-5 rounded-md bg-primary px-4 py-2 text-sm font-black text-primary-foreground"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 p-5">
                {error && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
                    {error}
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="text-sm font-bold">
                    Group name
                    <input className="mt-1.5 w-full rounded-md border border-border bg-surface-high px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary" value={form.group_name} onChange={(e) => update("group_name", e.target.value)} />
                  </label>
                  <label className="text-sm font-bold">
                    Group type
                    <select className="mt-1.5 w-full rounded-md border border-border bg-surface-high px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary" value={form.group_type} onChange={(e) => update("group_type", e.target.value)}>
                      {groupTypes.map((type) => <option key={type}>{type}</option>)}
                    </select>
                  </label>
                  <label className="text-sm font-bold">
                    City
                    <input className="mt-1.5 w-full rounded-md border border-border bg-surface-high px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary" value={form.city} onChange={(e) => update("city", e.target.value)} />
                  </label>
                  <label className="text-sm font-bold">
                    State
                    <select className="mt-1.5 w-full rounded-md border border-border bg-surface-high px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary" value={form.state} onChange={(e) => update("state", e.target.value)}>
                      {usStates.map((state) => <option key={state.code} value={state.code}>{state.name}</option>)}
                    </select>
                  </label>
                  <label className="text-sm font-bold">
                    Format
                    <select className="mt-1.5 w-full rounded-md border border-border bg-surface-high px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary" value={form.format} onChange={(e) => update("format", e.target.value)}>
                      {groupFormats.map((format) => <option key={format.value} value={format.value}>{format.label}</option>)}
                    </select>
                  </label>
                  <label className="text-sm font-bold">
                    Meeting rhythm
                    <input className="mt-1.5 w-full rounded-md border border-border bg-surface-high px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary" placeholder="Weekly, monthly, field trips only..." value={form.meeting_rhythm} onChange={(e) => update("meeting_rhythm", e.target.value)} />
                  </label>
                  <label className="text-sm font-bold">
                    Cost range
                    <input className="mt-1.5 w-full rounded-md border border-border bg-surface-high px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary" placeholder="Free, $25/month, $500+/month..." value={form.cost_range} onChange={(e) => update("cost_range", e.target.value)} />
                  </label>
                  <label className="text-sm font-bold">
                    Website URL
                    <input className="mt-1.5 w-full rounded-md border border-border bg-surface-high px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary" value={form.website_url} onChange={(e) => update("website_url", e.target.value)} />
                  </label>
                  <label className="text-sm font-bold">
                    Contact name
                    <input className="mt-1.5 w-full rounded-md border border-border bg-surface-high px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary" value={form.contact_name} onChange={(e) => update("contact_name", e.target.value)} />
                  </label>
                  <label className="text-sm font-bold">
                    Contact email
                    <input type="email" className="mt-1.5 w-full rounded-md border border-border bg-surface-high px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary" value={form.contact_email} onChange={(e) => update("contact_email", e.target.value)} />
                  </label>
                </div>

                <div>
                  <p className="text-sm font-bold">Nearby states served</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {usStates.map((state) => (
                      <button key={state.code} type="button" onClick={() => setNearbyStates((values) => toggleValue(values, state.code))} className={`rounded-full border px-3 py-1.5 text-xs font-black ${nearbyStates.includes(state.code) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface-high"}`}>
                        {state.code}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-bold">Age bands</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {ageBandOptions.map((option) => (
                        <button key={option} type="button" onClick={() => setAgeBands((values) => toggleValue(values, option))} className={`rounded-full border px-3 py-1.5 text-xs font-black ${ageBands.includes(option) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface-high"}`}>
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Inclusion and learning tags</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {inclusionOptions.map((option) => (
                        <button key={option} type="button" onClick={() => setInclusionTags((values) => toggleValue(values, option))} className={`rounded-full border px-3 py-1.5 text-xs font-black ${inclusionTags.includes(option) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface-high"}`}>
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <label className="block text-sm font-bold">
                  Description
                  <textarea rows={4} className="mt-1.5 w-full resize-none rounded-md border border-border bg-surface-high px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary" value={form.description} onChange={(e) => update("description", e.target.value)} />
                </label>

                <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-semibold leading-5 text-muted-foreground">
                    Admin review protects families from stale links, unclear costs, and unsafe or misrepresented groups.
                  </p>
                  <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-black text-primary-foreground disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                    Submit for review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
