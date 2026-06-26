import { createClient } from "@/lib/supabase/server";
import { LiveQAPage } from "@/components/events/live-qa-page";
import type { LiveSession, LiveSessionRsvp } from "@/lib/live-qa";

export default async function EventsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("seat_profiles")
    .select("role")
    .eq("id", user!.id)
    .single();

  const { data: session } = await supabase
    .from("seat_live_sessions")
    .select("*")
    .eq("slug", "weekly-live-qa")
    .single();

  const { data: orientationSession } = await supabase
    .from("seat_live_sessions")
    .select("*")
    .eq("slug", "founding-member-orientation")
    .maybeSingle();

  const { data: rsvp } = await supabase
    .from("seat_live_session_rsvps")
    .select("*")
    .eq("session_id", session?.id || "00000000-0000-0000-0000-000000000000")
    .eq("user_id", user!.id)
    .maybeSingle();

  const { data: orientationRsvp } = await supabase
    .from("seat_live_session_rsvps")
    .select("*")
    .eq("session_id", orientationSession?.id || "00000000-0000-0000-0000-000000000000")
    .eq("user_id", user!.id)
    .maybeSingle();

  const { data: liveQaChannel } = await supabase
    .from("seat_channels")
    .select("id")
    .eq("slug", session?.question_channel_slug || "live-qa")
    .maybeSingle();

  if (!session) {
    throw new Error("Weekly Live Q&A session is not configured.");
  }

  return (
    <LiveQAPage
      session={session as LiveSession}
      rsvp={rsvp as LiveSessionRsvp | null}
      orientationSession={orientationSession as LiveSession | null}
      orientationRsvp={orientationRsvp as LiveSessionRsvp | null}
      userId={user!.id}
      liveQaChannelId={liveQaChannel?.id || null}
      isAdmin={profile?.role === "admin"}
    />
  );
}
