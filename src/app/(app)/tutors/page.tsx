import { TutorConnectionPage } from "@/components/tutors/tutor-connection-page";
import { createClient } from "@/lib/supabase/server";
import type { SeatTier } from "@/lib/tiers";
import type { TutorProfile } from "@/lib/tutor-connection";

export default async function TutorsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: tutors }] = user
    ? await Promise.all([
        supabase.from("seat_profiles").select("tier").eq("id", user.id).single(),
        supabase
          .from("seat_tutor_profiles")
          .select("id, display_name, headline, subjects, learner_fit_tags, formats, states, rate_range, bio, website_url")
          .eq("status", "approved")
          .order("created_at", { ascending: false }),
      ])
    : [{ data: null }, { data: [] }];

  return (
    <TutorConnectionPage
      userId={user?.id || null}
      userTier={(profile?.tier || "free") as SeatTier}
      tutors={(tutors || []) as TutorProfile[]}
    />
  );
}
