"use client";

import { createClient } from "@/lib/supabase/client";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface Report {
  id: string;
  post_id: string;
  reporter_id: string;
  reason: string;
  details: string | null;
  status: string;
  created_at: string;
  post: { content: string; author_id: string }[] | null;
  reporter: { display_name: string | null }[] | null;
}

interface ReportsQueueProps {
  reports: Report[];
}

export function ReportsQueue({ reports }: ReportsQueueProps) {
  const supabase = createClient();

  const updateStatus = async (id: string, status: "resolved" | "dismissed") => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase
      .from("seat_post_reports")
      .update({ status, resolved_by: user?.id, resolved_at: new Date().toISOString() })
      .eq("id", id);
    window.location.reload();
  };

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-5">
        <h2 className="flex items-center gap-2 font-display text-lg font-black">
          <AlertTriangle size={18} className="text-destructive" />
          Moderation Queue
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Review and resolve reported content.
        </p>
      </div>

      <div className="divide-y divide-border">
        {reports.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No pending reports. The community is behaving!
          </div>
        )}

        {reports.map((r) => (
          <div key={r.id} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-destructive">
                    {r.reason}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Reported {new Date(r.created_at).toLocaleDateString()} by {r.reporter?.[0]?.display_name || "Anonymous"}
                  </span>
                </div>
                {r.details && (
                  <p className="mt-2 text-xs text-muted-foreground">{r.details}</p>
                )}
                <div className="mt-3 rounded-lg border border-border bg-surface-high p-3">
                  <p className="text-xs font-bold text-foreground">Reported Post:</p>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-3">
                    {r.post?.[0]?.content || "[Post unavailable]"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(r.id, "resolved")}
                  className="flex items-center gap-1 rounded-md bg-green-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-green-700 transition hover:bg-green-200"
                >
                  <CheckCircle size={12} /> Resolve
                </button>
                <button
                  onClick={() => updateStatus(r.id, "dismissed")}
                  className="flex items-center gap-1 rounded-md bg-muted px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground transition hover:bg-surface-high"
                >
                  <XCircle size={12} /> Dismiss
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
