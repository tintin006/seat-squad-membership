"use client";

import { useState } from "react";
import { CheckCircle, GraduationCap, Handshake, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export type PendingTutorProfile = {
  id: string;
  display_name: string;
  headline: string;
  subjects: string[];
  learner_fit_tags: string[];
  bio: string;
  status: string;
  created_at: string;
};

export type PendingTutorRequest = {
  id: string;
  learner_age_band: string;
  subjects: string[];
  support_goal: string;
  schedule_notes: string | null;
  budget_range: string | null;
  preferred_format: string | null;
  status: string;
  created_at: string;
  requester: { display_name: string | null }[] | null;
  tutor: { display_name: string | null }[] | null;
};

export function TutorConnectionQueue({
  profiles,
  requests,
  demoMode = false,
}: {
  profiles: PendingTutorProfile[];
  requests: PendingTutorRequest[];
  demoMode?: boolean;
}) {
  const supabase = createClient();
  const [busyId, setBusyId] = useState<string | null>(null);

  const updateProfile = async (id: string, status: "approved" | "rejected") => {
    if (demoMode) {
      setBusyId(id);
      window.setTimeout(() => setBusyId(null), 600);
      return;
    }
    setBusyId(id);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("seat_tutor_profiles").update({
      status,
      reviewed_by: user?.id,
      reviewed_at: new Date().toISOString(),
    }).eq("id", id);
    window.location.reload();
  };

  const updateRequest = async (id: string, status: "matched" | "closed") => {
    if (demoMode) {
      setBusyId(id);
      window.setTimeout(() => setBusyId(null), 600);
      return;
    }
    setBusyId(id);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("seat_tutor_connection_requests").update({
      status,
      reviewed_by: user?.id,
      reviewed_at: new Date().toISOString(),
    }).eq("id", id);
    window.location.reload();
  };

  return (
    <section className="rounded-lg border border-border bg-card shadow-soft">
      <div className="border-b border-border p-5">
        <h2 className="flex items-center gap-2 font-display text-xl font-black">
          <Handshake size={20} className="text-primary" />
          Tutor Connection Queue
        </h2>
        <p className="mt-1 text-sm font-semibold text-muted-foreground">
          Review tutor profiles and member connection requests before any handoff.
        </p>
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        <div className="border-b border-border p-5 lg:border-b-0 lg:border-r">
          <h3 className="flex items-center gap-2 font-display text-lg font-black">
            <GraduationCap size={18} /> Pending tutor profiles
          </h3>
          <div className="mt-4 space-y-3">
            {profiles.length === 0 && <p className="text-sm font-semibold text-muted-foreground">No pending tutor profiles.</p>}
            {profiles.map((profile) => (
              <article key={profile.id} className="rounded-lg border border-border bg-surface-high p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">{new Date(profile.created_at).toLocaleDateString()}</p>
                <h4 className="mt-2 font-display text-lg font-black">{profile.display_name}</h4>
                <p className="mt-1 text-sm font-bold text-muted-foreground">{profile.headline}</p>
                <p className="mt-2 line-clamp-3 text-sm font-semibold text-muted-foreground">{profile.bio}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[...profile.subjects, ...profile.learner_fit_tags].slice(0, 5).map((tag) => (
                    <span key={tag} className="rounded-full border border-border bg-card px-2 py-1 text-[10px] font-black uppercase">{tag}</span>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <button disabled={busyId === profile.id} onClick={() => updateProfile(profile.id, "approved")} className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-xs font-black text-primary-foreground">
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button disabled={busyId === profile.id} onClick={() => updateProfile(profile.id, "rejected")} className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-2 text-xs font-black">
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="p-5">
          <h3 className="flex items-center gap-2 font-display text-lg font-black">
            <Handshake size={18} /> Pending connection requests
          </h3>
          <div className="mt-4 space-y-3">
            {requests.length === 0 && <p className="text-sm font-semibold text-muted-foreground">No pending connection requests.</p>}
            {requests.map((request) => (
              <article key={request.id} className="rounded-lg border border-border bg-surface-high p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">
                  {new Date(request.created_at).toLocaleDateString()} by {request.requester?.[0]?.display_name || "Member"}
                </p>
                <h4 className="mt-2 font-display text-lg font-black">{request.learner_age_band} · {request.preferred_format || "Format open"}</h4>
                <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">{request.support_goal}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {request.subjects.map((tag) => (
                    <span key={tag} className="rounded-full border border-border bg-card px-2 py-1 text-[10px] font-black uppercase">{tag}</span>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <button disabled={busyId === request.id} onClick={() => updateRequest(request.id, "matched")} className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-xs font-black text-primary-foreground">
                    <CheckCircle size={14} /> Mark matched
                  </button>
                  <button disabled={busyId === request.id} onClick={() => updateRequest(request.id, "closed")} className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-2 text-xs font-black">
                    <XCircle size={14} /> Close
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
