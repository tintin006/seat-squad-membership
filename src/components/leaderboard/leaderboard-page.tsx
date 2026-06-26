import { Flame, MapPinned, MessageSquare, MessagesSquare, ShieldCheck, Sparkles, Trophy, Users } from "lucide-react";
import { contributionRules, type ContributionBadge, type LeaderboardMember } from "@/lib/leaderboard";

type LeaderboardPageProps = {
  members: LeaderboardMember[];
  currentUserId?: string;
  demoMode?: boolean;
};

const badgeIcons = {
  Flame,
  MapPinned,
  MessageSquare,
  MessagesSquare,
  Sparkles,
  Trophy,
};

function BadgePill({ badge }: { badge: ContributionBadge }) {
  const Icon = badgeIcons[badge.icon as keyof typeof badgeIcons] || ShieldCheck;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-high px-2.5 py-1 text-[11px] font-black">
      <Icon size={12} />
      {badge.name}
    </span>
  );
}

function formatRole(role: string) {
  return role === "both" ? "Family + educator" : role.charAt(0).toUpperCase() + role.slice(1);
}

export function LeaderboardPage({ members, currentUserId, demoMode = false }: LeaderboardPageProps) {
  const topThree = members.slice(0, 3);
  const totalPoints = members.reduce((sum, member) => sum + member.total_points, 0);
  const totalBadges = members.reduce((sum, member) => sum + member.badges.length, 0);
  const currentMember = members.find((member) => member.user_id === currentUserId);
  const currentRank = currentMember ? members.findIndex((member) => member.user_id === currentUserId) + 1 : null;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <section className="seat-hero-panel overflow-hidden rounded-2xl border border-secondary/30 shadow-warm">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">
                Contribution leaderboard
              </p>
              <h1 className="mt-3 max-w-3xl font-display text-3xl font-black leading-[0.98] tracking-[-0.05em] sm:text-5xl">
                Celebrate the members making the room useful.
              </h1>
              <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-white/84 sm:text-lg">
                Points reward visible contribution: useful posts, helpful replies, encouragement, and approved pod directory submissions. The goal is signal, not pressure.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-white/20 bg-white/10 p-4">
                  <p className="text-2xl font-black">{members.length}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">ranked members</p>
                </div>
                <div className="rounded-lg border border-white/20 bg-white/10 p-4">
                  <p className="text-2xl font-black">{totalPoints}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">total points</p>
                </div>
                <div className="rounded-lg border border-white/20 bg-white/10 p-4">
                  <p className="text-2xl font-black">{totalBadges}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">badges earned</p>
                </div>
              </div>
            </div>

            <div className="bg-white/8 p-6 sm:p-8">
              <div className="rounded-xl border border-white/20 bg-white/10 p-5">
                <div className="flex items-center gap-2 text-accent">
                  <Trophy size={22} />
                  <p className="text-xs font-black uppercase tracking-[0.18em]">Top contributors</p>
                </div>
                <div className="mt-5 space-y-3">
                  {topThree.map((member, index) => (
                    <div key={member.user_id} className="flex items-center justify-between gap-3 rounded-lg border border-white/15 bg-white/10 p-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-accent text-sm font-black text-accent-foreground">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black">{member.display_name}</p>
                          <p className="text-xs font-semibold text-white/70">{formatRole(member.role)}</p>
                        </div>
                      </div>
                      <p className="shrink-0 text-sm font-black">{member.total_points} pts</p>
                    </div>
                  ))}
                  {topThree.length === 0 && (
                    <div className="rounded-lg border border-white/15 bg-white/10 p-5 text-sm font-semibold text-white/78">
                      The board will populate after members post, reply, react, or submit approved groups.
                    </div>
                  )}
                </div>
                {currentRank && currentMember && (
                  <div className="mt-4 rounded-lg border border-accent/50 bg-accent/15 p-3 text-sm font-bold">
                    Your current rank: #{currentRank} with {currentMember.total_points} points.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[0.66fr_0.34fr]">
          <main className="space-y-3">
            {members.map((member, index) => {
              const isCurrentMember = member.user_id === currentUserId;

              return (
                <article
                  key={member.user_id}
                  className={`rounded-xl border bg-card p-5 shadow-soft ${
                    isCurrentMember ? "border-primary" : "border-border"
                  }`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-border bg-surface-high font-display text-xl font-black">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-display text-2xl font-black tracking-[-0.04em]">
                            {member.display_name}
                          </h2>
                          {isCurrentMember && (
                            <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-primary-foreground">
                              You
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-primary">
                          {formatRole(member.role)} - {member.tier}
                        </p>
                        {member.location && (
                          <p className="mt-2 text-sm font-semibold text-muted-foreground">{member.location}</p>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 rounded-lg border border-border bg-surface-high px-4 py-3 text-right">
                      <p className="font-display text-3xl font-black tracking-[-0.04em]">{member.total_points}</p>
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">points</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-5">
                    <div className="rounded-lg border border-border bg-surface-high p-3">
                      <p className="text-lg font-black">{member.posts_count}</p>
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">posts</p>
                    </div>
                    <div className="rounded-lg border border-border bg-surface-high p-3">
                      <p className="text-lg font-black">{member.comments_count}</p>
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">replies</p>
                    </div>
                    <div className="rounded-lg border border-border bg-surface-high p-3">
                      <p className="text-lg font-black">{member.reactions_given_count}</p>
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">cheers</p>
                    </div>
                    <div className="rounded-lg border border-border bg-surface-high p-3">
                      <p className="text-lg font-black">{member.reactions_received_count}</p>
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">signals</p>
                    </div>
                    <div className="rounded-lg border border-border bg-surface-high p-3">
                      <p className="text-lg font-black">{member.pod_submissions_count}</p>
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">groups</p>
                    </div>
                  </div>

                  {member.badges.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {member.badges.map((badge) => <BadgePill key={badge.slug} badge={badge} />)}
                    </div>
                  )}
                </article>
              );
            })}

            {members.length === 0 && (
              <section className="rounded-xl border border-border bg-card p-8 text-center shadow-soft">
                <Users className="mx-auto text-primary" size={28} />
                <h2 className="mt-3 font-display text-2xl font-black">No contribution scores yet.</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-muted-foreground">
                  The leaderboard starts filling in as members post, reply, react, and submit approved pod or homeschool group listings.
                </p>
              </section>
            )}
          </main>

          <aside className="space-y-4">
            <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck size={18} />
                <p className="text-xs font-black uppercase tracking-[0.18em]">How points work</p>
              </div>
              <div className="mt-4 space-y-3">
                {contributionRules.map((rule) => (
                  <div key={rule.action} className="rounded-lg border border-border bg-surface-high p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-black">{rule.action}</p>
                      <p className="text-sm font-black text-primary">+{rule.points}</p>
                    </div>
                    <p className="mt-1 text-xs font-semibold leading-5 text-muted-foreground">{rule.note}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center gap-2 text-secondary">
                <Sparkles size={18} />
                <p className="text-xs font-black uppercase tracking-[0.18em]">Badge ladder</p>
              </div>
              <div className="mt-4 space-y-2 text-sm font-semibold leading-6 text-muted-foreground">
                <p>First Post: first community post</p>
                <p>Conversation Starter: three posts</p>
                <p>Helpful Reply: five comments</p>
                <p>Pod Scout: one approved group submission</p>
                <p>Community Spark: 50 points</p>
                <p>Founding Voice: 100 points</p>
              </div>
            </section>

            {demoMode && (
              <section className="rounded-xl border border-primary/30 bg-card p-5 shadow-soft">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Demo mode</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
                  These sample members preview the finished experience. The signed-in app reads live Supabase contribution totals.
                </p>
              </section>
            )}
          </aside>
        </section>
      </div>
    </div>
  );
}
