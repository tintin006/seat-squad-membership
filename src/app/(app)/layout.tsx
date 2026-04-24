import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if seat profile exists and onboarding is complete
  const { data: seatProfile } = await supabase
    .from("seat_profiles")
    .select("onboarding_complete, role, tier, display_name")
    .eq("id", user.id)
    .single();

  // If no seat profile or onboarding not complete, redirect to onboarding
  if (!seatProfile || !seatProfile.onboarding_complete) {
    redirect("/onboarding");
  }

  return (
    <AppShell user={user} profile={seatProfile}>
      {children}
    </AppShell>
  );
}
