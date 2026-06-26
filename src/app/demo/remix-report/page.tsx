import { RemixReportPage } from "@/components/remix-report/remix-report-page";

export default function DemoRemixReportRoute() {
  return (
    <RemixReportPage
      userId="demo-user"
      discussionChannelId="channel-remix-report"
      liveQaChannelId="channel-live"
      demoMode
    />
  );
}
