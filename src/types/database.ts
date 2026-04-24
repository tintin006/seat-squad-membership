export type SeatChannel = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  color: string;
  is_default: boolean;
  is_public: boolean;
  created_by: string | null;
  created_at: string;
};

export type SeatPost = {
  id: string;
  channel_id: string;
  author_id: string;
  type: "text" | "image" | "link" | "poll" | "announcement";
  title: string | null;
  content: string;
  metadata: Record<string, unknown>;
  is_pinned: boolean;
  is_announcement: boolean;
  is_locked: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export type SeatComment = {
  id: string;
  post_id: string;
  parent_id: string | null;
  author_id: string;
  content: string;
  is_deleted: boolean;
  created_at: string;
};

export type SeatPostReaction = {
  id: string;
  post_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
};

export type SeatBookmark = {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
};

export type SeatPostReport = {
  id: string;
  post_id: string;
  reporter_id: string;
  reason: string;
  details: string | null;
  status: "pending" | "resolved" | "dismissed";
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
};

export type SeatProfile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: "family" | "educator" | "both" | "admin";
  tier: "free" | "member" | "pro";
  onboarding_complete: boolean;
  methodology_tags: string[];
  grade_levels: string[];
  subject_tags: string[];
  intent_tags: string[];
  location: string | null;
  bio: string | null;
  profile_visibility: string;
  is_suspended: boolean;
  created_at: string;
};
