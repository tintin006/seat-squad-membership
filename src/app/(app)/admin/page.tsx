import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MembersTable } from "@/components/admin/members-table";
import { ReportsQueue } from "@/components/admin/reports-queue";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from("seat_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  // Fetch all members
  const { data: members } = await supabase
    .from("seat_profiles")
    .select("id, display_name, role, tier, is_suspended, onboarding_complete, created_at, location")
    .order("created_at", { ascending: false });

  // Fetch pending reports with post info
  const { data: reports } = await supabase
    .from("seat_post_reports")
    .select(`
      id, post_id, reporter_id, reason, details, status, created_at,
      post:seat_posts!post_id(content, author_id),
      reporter:seat_profiles!reporter_id(display_name)
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return (
    <div className="p-5 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-3xl font-black tracking-[-0.04em]">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage members, review reports, and moderate content.
        </p>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Total Members</p>
            <p className="mt-3 text-2xl font-black">{members?.length || 0}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Admins</p>
            <p className="mt-3 text-2xl font-black">{members?.filter((m) => m.role === "admin").length || 0}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Suspended</p>
            <p className="mt-3 text-2xl font-black">{members?.filter((m) => m.is_suspended).length || 0}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Pending Reports</p>
            <p className="mt-3 text-2xl font-black">{reports?.length || 0}</p>
          </div>
        </div>

        {/* Members Table */}
        <div className="mt-10">
          <MembersTable members={members || []} />
        </div>

        {/* Reports Queue */}
        <div className="mt-10">
          <ReportsQueue reports={reports || []} />
        </div>
      </div>
    </div>
  );
}
