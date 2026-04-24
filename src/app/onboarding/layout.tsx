import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // If onboarding is already complete, redirect to dashboard
  const { data: seatProfile } = await supabase
    .from("seat_profiles")
    .select("onboarding_complete")
    .eq("id", user.id)
    .single();

  if (seatProfile?.onboarding_complete) {
    redirect("/");
  }

  return <>{children}</>;
}
