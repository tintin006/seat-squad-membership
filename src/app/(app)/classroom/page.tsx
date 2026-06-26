import { ClassroomVideoLibrary } from "@/components/classroom/classroom-video-library";
import { createClient } from "@/lib/supabase/server";
import type { SeatTier } from "@/lib/tiers";

export default async function ClassroomPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: progress }] = user
    ? await Promise.all([
        supabase.from("seat_profiles").select("tier").eq("id", user.id).single(),
        supabase.from("seat_video_progress").select("video_id, completed_at").eq("user_id", user.id),
      ])
    : [{ data: null }, { data: [] }];

  return (
    <ClassroomVideoLibrary
      userId={user?.id || null}
      userTier={(profile?.tier || "free") as SeatTier}
      progress={progress || []}
    />
  );
}
