import { createClient } from "@/lib/supabase/server";
import { RemixReportPage } from "@/components/remix-report/remix-report-page";

export default async function RemixReportRoute() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: discussionChannel }, { data: liveQaChannel }] = await Promise.all([
    supabase.from("seat_channels").select("id").eq("slug", "remix-report").maybeSingle(),
    supabase.from("seat_channels").select("id").eq("slug", "live-qa").maybeSingle(),
  ]);

  return (
    <RemixReportPage
      userId={user!.id}
      discussionChannelId={discussionChannel?.id || null}
      liveQaChannelId={liveQaChannel?.id || null}
    />
  );
}
