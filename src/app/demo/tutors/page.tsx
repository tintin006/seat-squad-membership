import { TutorConnectionPage } from "@/components/tutors/tutor-connection-page";
import { sampleTutorProfiles } from "@/lib/tutor-connection";

export default function DemoTutorsPage() {
  return (
    <TutorConnectionPage
      userId="demo-user"
      userTier="member"
      tutors={sampleTutorProfiles}
      demoMode
    />
  );
}
