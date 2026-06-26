import { PodDirectoryPage } from "@/components/pod-directory/pod-directory-page";
import { samplePodGroups } from "@/lib/pod-directory";

export default function DemoPodsPage() {
  return <PodDirectoryPage groups={samplePodGroups} demoMode />;
}
