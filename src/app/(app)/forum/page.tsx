import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app-shell";
import { getForumPageData } from "@/lib/forum-data";
import { FeedPage } from "../feed-page";

export default async function ForumPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Redirect unauthenticated users to login instead of throwing
  if (!user) {
    redirect("/login");
  }

  // If no seat profile or onboarding not complete, redirect to onboarding
  const { data: seatProfile } = await supabase
    .from("seat_profiles")
    .select("onboarding_complete, role, tier, display_name")
    .eq("id", user.id)
    .single();

  if (!seatProfile || !seatProfile.onboarding_complete) {
    redirect("/onboarding");
  }

  const forumData = await getForumPageData();

  return <FeedPage {...forumData} />;
}