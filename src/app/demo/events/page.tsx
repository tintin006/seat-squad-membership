import { LiveQAPage } from "@/components/events/live-qa-page";
import { demoLiveSession, demoOrientationSession } from "@/lib/live-qa";

export default function DemoEventsPage() {
  return (
    <LiveQAPage
      session={demoLiveSession}
      rsvp={{ session_id: demoLiveSession.id, user_id: "demo-user", status: "interested", question_post_id: null, created_at: demoLiveSession.created_at, updated_at: demoLiveSession.updated_at }}
      orientationSession={demoOrientationSession}
      orientationRsvp={{ session_id: demoOrientationSession.id, user_id: "demo-user", status: "interested", question_post_id: null, created_at: demoOrientationSession.created_at, updated_at: demoOrientationSession.updated_at }}
      userId="demo-user"
      liveQaChannelId="channel-live"
      isAdmin
      demoMode
    />
  );
}
