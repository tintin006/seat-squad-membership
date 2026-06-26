import { LeaderboardPage } from "@/components/leaderboard/leaderboard-page";
import { sampleLeaderboardMembers } from "@/lib/leaderboard";

export default function DemoLeaderboardPage() {
  return <LeaderboardPage members={sampleLeaderboardMembers} currentUserId="demo-maya" demoMode />;
}
