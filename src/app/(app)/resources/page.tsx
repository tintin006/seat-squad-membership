import { ResourceDownloadsPage } from "@/components/resources/resource-downloads-page";
import { createClient } from "@/lib/supabase/server";
import type { SeatTier } from "@/lib/tiers";

export default async function ResourcesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("seat_profiles")
        .select("tier")
        .eq("id", user.id)
        .single()
    : { data: null };

  return <ResourceDownloadsPage userTier={(profile?.tier || "free") as SeatTier} />;
}
