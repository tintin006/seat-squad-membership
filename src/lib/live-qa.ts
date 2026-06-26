export type LiveSessionStatus = "scheduled" | "live" | "complete" | "canceled";

export type LiveSessionResourceLink = {
  label: string;
  href: string;
  type?: string;
};

export type LiveSession = {
  id: string;
  slug: string;
  title: string;
  description: string;
  cadence: string;
  day_label: string;
  time_label: string;
  timezone: string;
  location_url: string | null;
  status: LiveSessionStatus;
  starts_at: string | null;
  question_channel_slug: string;
  replay_url: string | null;
  recap: string | null;
  resource_links: LiveSessionResourceLink[];
  created_at: string;
  updated_at: string;
};

export type LiveSessionRsvp = {
  session_id: string;
  user_id: string;
  status: "interested" | "going" | "canceled";
  question_post_id: string | null;
  created_at: string;
  updated_at: string;
};

export const demoLiveSession: LiveSession = {
  id: "demo-weekly-live-qa",
  slug: "weekly-live-qa",
  title: "Weekly Live Q&A",
  description:
    "Bring the practical homeschool, ESA, pod, curriculum, tutor, planning, or deschooling question you want help thinking through. We will pull from forum questions first, then take live follow-ups.",
  cadence: "weekly",
  day_label: "Thursdays",
  time_label: "7:00 PM ET",
  timezone: "America/New_York",
  location_url: null,
  status: "scheduled",
  starts_at: null,
  question_channel_slug: "live-qa",
  replay_url: "https://example.com/replay",
  recap:
    "This archive area will hold the replay, timestamped question recap, and links to downloads or forum threads that came up during the live session.",
  resource_links: [
    { label: "ESA State Guides", href: "/resources", type: "Member downloads" },
    { label: "Live Q&A forum channel", href: "/demo/forum", type: "Forum" },
  ],
  created_at: "2026-06-26T10:00:00-04:00",
  updated_at: "2026-06-26T10:00:00-04:00",
};

export const demoOrientationSession: LiveSession = {
  id: "demo-founding-member-orientation",
  slug: "founding-member-orientation",
  title: "Founding Member Orientation",
  description:
    "A practical walkthrough for new SEAT Squad members: where to ask questions, where to download guides, how Live Q&A works, how to suggest pods or groups, and what we are building with founding member feedback.",
  cadence: "one-time",
  day_label: "First founding cohort",
  time_label: "Time announced soon",
  timezone: "America/New_York",
  location_url: null,
  status: "scheduled",
  starts_at: null,
  question_channel_slug: "start-here",
  replay_url: null,
  recap: null,
  resource_links: [
    { label: "Start Here", href: "/start-here", type: "Orientation" },
    { label: "Member resources", href: "/resources", type: "Downloads" },
    { label: "Weekly Live Q&A", href: "/events", type: "Event" },
  ],
  created_at: "2026-06-26T10:00:00-04:00",
  updated_at: "2026-06-26T10:00:00-04:00",
};
