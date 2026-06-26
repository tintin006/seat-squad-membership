import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MembersTable } from "@/components/admin/members-table";
import { ReportsQueue } from "@/components/admin/reports-queue";
import { GroupSubmissionsQueue } from "@/components/admin/group-submissions-queue";
import { ModerationAgentQueue } from "@/components/admin/moderation-agent-queue";
import { ContentControls } from "@/components/admin/content-controls";
import { WeeklyRecapDelivery } from "@/components/admin/weekly-recap-delivery";
import { TutorConnectionQueue } from "@/components/admin/tutor-connection-queue";

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

  const { data: moderationFlags } = await supabase
    .from("seat_moderation_flags")
    .select(`
      id, source_type, source_id, post_id, comment_id, author_id, bot_name, bot_identity,
      severity, categories, confidence, excerpt, recommendation, status, reviewed_by,
      reviewed_at, admin_notes, created_at,
      author:seat_profiles!author_id(display_name),
      post:seat_posts!post_id(title, content)
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const { data: groupSubmissions } = await supabase
    .from("seat_group_submissions")
    .select("id, group_name, group_type, city, state, contact_email, contact_name, description, status, verification_status, admin_notes, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const { data: contentPosts } = await supabase
    .from("seat_posts")
    .select(`
      id, title, content, is_pinned, is_announcement, is_locked, created_at,
      channel:seat_channels!channel_id(name, slug, color),
      author:seat_profiles!author_id(display_name, role)
    `)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(40);

  const { data: pendingTutorProfiles } = await supabase
    .from("seat_tutor_profiles")
    .select("id, display_name, headline, subjects, learner_fit_tags, bio, status, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const { data: pendingTutorRequests } = await supabase
    .from("seat_tutor_connection_requests")
    .select(`
      id, learner_age_band, subjects, support_goal, schedule_notes, budget_range,
      preferred_format, status, created_at,
      requester:seat_profiles!requester_id(display_name),
      tutor:seat_tutor_profiles!tutor_profile_id(display_name)
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const { count: eligibleRecapMemberCount } = await supabase
    .from("seat_profiles")
    .select("*", { count: "exact", head: true })
    .eq("onboarding_complete", true)
    .eq("is_suspended", false);

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
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Bot Flags</p>
            <p className="mt-3 text-2xl font-black">{moderationFlags?.length || 0}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Group Reviews</p>
            <p className="mt-3 text-2xl font-black">{groupSubmissions?.length || 0}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Pinned Posts</p>
            <p className="mt-3 text-2xl font-black">{contentPosts?.filter((post) => post.is_pinned).length || 0}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Tutor Reviews</p>
            <p className="mt-3 text-2xl font-black">{(pendingTutorProfiles?.length || 0) + (pendingTutorRequests?.length || 0)}</p>
          </div>
        </div>

        <div className="mt-10">
          <WeeklyRecapDelivery memberCount={eligibleRecapMemberCount || 0} />
        </div>

        <div className="mt-10">
          <ContentControls posts={contentPosts || []} />
        </div>

        <div className="mt-10">
          <TutorConnectionQueue
            profiles={pendingTutorProfiles || []}
            requests={pendingTutorRequests || []}
          />
        </div>

        {/* Members Table */}
        <div className="mt-10">
          <MembersTable members={members || []} />
        </div>

        {/* Reports Queue */}
        <div className="mt-10">
          <ReportsQueue reports={reports || []} />
        </div>

        <div className="mt-10">
          <ModerationAgentQueue flags={moderationFlags || []} />
        </div>

        <div className="mt-10">
          <GroupSubmissionsQueue submissions={groupSubmissions || []} />
        </div>
      </div>
    </div>
  );
}
