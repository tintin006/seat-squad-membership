import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("seat_profiles")
    .select("display_name, role, tier")
    .eq("id", user!.id)
    .single();

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Member";

  return (
    <div className="p-5 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-3xl font-black tracking-[-0.04em] sm:text-4xl">
          Welcome back, {displayName}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here&apos;s what&apos;s happening in the SEAT Squad today.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Community</p>
            <p className="mt-3 text-2xl font-black text-foreground">0</p>
            <p className="text-sm text-muted-foreground">New posts today</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Events</p>
            <p className="mt-3 text-2xl font-black text-foreground">0</p>
            <p className="text-sm text-muted-foreground">Upcoming this week</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">The Crate</p>
            <p className="mt-3 text-2xl font-black text-foreground">0</p>
            <p className="text-sm text-muted-foreground">New resources</p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Announcements</p>
          <div className="mt-4 rounded-lg border border-border bg-surface-high p-4">
            <p className="text-sm font-black text-foreground">Welcome to the SEAT Squad!</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The community is just getting started. Check back soon for the first announcements, events, and resources.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-secondary">Your membership</p>
          <div className="mt-4 flex items-center gap-4">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-[0.15em] text-primary">
              {profile?.tier || "free"}
            </span>
            <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-black uppercase tracking-[0.15em] text-secondary">
              {profile?.role || "family"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
