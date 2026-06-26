"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, MapPinned, XCircle } from "lucide-react";
import type { SeatGroupStatus, SeatGroupVerificationStatus } from "@/types/database";

interface GroupSubmission {
  id: string;
  group_name: string;
  group_type: string;
  city: string;
  state: string;
  contact_email: string | null;
  contact_name: string | null;
  description: string;
  status: SeatGroupStatus;
  verification_status: SeatGroupVerificationStatus;
  admin_notes: string | null;
  created_at: string;
}

export function GroupSubmissionsQueue({ submissions }: { submissions: GroupSubmission[] }) {
  const supabase = createClient();
  const [notes, setNotes] = useState<Record<string, string>>(() =>
    Object.fromEntries(submissions.map((submission) => [submission.id, submission.admin_notes || ""]))
  );

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    const { data: { user } } = await supabase.auth.getUser();
    const now = new Date();
    const oneYearFromNow = new Date(now);
    oneYearFromNow.setFullYear(now.getFullYear() + 1);

    await supabase
      .from("seat_group_submissions")
      .update({
        status,
        reviewed_by: user?.id,
        reviewed_at: now.toISOString(),
        verification_status: status === "approved" ? "admin_verified" : "needs_update",
        admin_notes: notes[id] || null,
        last_verified_at: status === "approved" ? now.toISOString() : null,
        expires_at: status === "approved" ? oneYearFromNow.toISOString() : null,
      })
      .eq("id", id);
    window.location.reload();
  };

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-5">
        <h2 className="flex items-center gap-2 font-display text-lg font-black">
          <MapPinned size={18} className="text-primary" />
          Group Submissions
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Review pod, co-op, microschool, and homeschool group submissions before they appear in the directory.
        </p>
      </div>

      <div className="divide-y divide-border">
        {submissions.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No pending group submissions.
          </div>
        )}

        {submissions.map((submission) => (
          <div key={submission.id} className="p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-xl font-black">{submission.group_name}</h3>
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary">
                    {submission.group_type}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground">
                    {submission.city}, {submission.state} · {new Date(submission.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-muted-foreground">
                  {submission.description}
                </p>
                {(submission.contact_name || submission.contact_email) && (
                  <p className="mt-2 text-xs font-bold text-muted-foreground">
                    Contact: {submission.contact_name || "No name"} {submission.contact_email ? `· ${submission.contact_email}` : ""}
                  </p>
                )}
                <label className="mt-4 block max-w-3xl text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                  Admin notes
                  <textarea
                    value={notes[submission.id] || ""}
                    onChange={(event) => setNotes((current) => ({ ...current, [submission.id]: event.target.value }))}
                    rows={2}
                    className="mt-2 w-full resize-none rounded-md border border-border bg-surface-high px-3 py-2 text-sm font-semibold normal-case tracking-normal text-foreground outline-none focus:border-primary"
                    placeholder="Verification notes, follow-up needed, source checked..."
                  />
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(submission.id, "approved")}
                  className="flex items-center gap-1 rounded-md bg-green-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-green-700 transition hover:bg-green-200"
                >
                  <CheckCircle size={12} /> Approve
                </button>
                <button
                  onClick={() => updateStatus(submission.id, "rejected")}
                  className="flex items-center gap-1 rounded-md bg-destructive/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-destructive transition hover:bg-destructive/20"
                >
                  <XCircle size={12} /> Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
