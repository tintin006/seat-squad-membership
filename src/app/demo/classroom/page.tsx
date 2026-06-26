import { ClassroomVideoLibrary } from "@/components/classroom/classroom-video-library";

export default function DemoClassroomPage() {
  return (
    <ClassroomVideoLibrary
      userId="demo-user"
      userTier="member"
      progress={[
        { video_id: "orientation-how-to-use-seat-squad", completed_at: "2026-06-26T10:00:00-04:00" },
        { video_id: "first-30-days-homeschool", completed_at: null },
      ]}
      demoMode
    />
  );
}
