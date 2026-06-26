import { createClient } from "@/lib/supabase/server";
import { PodDirectoryPage } from "@/components/pod-directory/pod-directory-page";
import type { PodGroup } from "@/lib/pod-directory";

type GroupSubmissionRow = PodGroup;

export default async function PodsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("seat_group_submissions")
    .select("id, group_name, group_type, format, city, state, nearby_states, age_bands, inclusion_tags, cost_range, meeting_rhythm, website_url, source_url, contact_email, description, verification_status, last_verified_at, expires_at")
    .eq("status", "approved")
    .order("state", { ascending: true })
    .order("city", { ascending: true });

  return <PodDirectoryPage groups={(data || []) as GroupSubmissionRow[]} />;
}
