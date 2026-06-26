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

export type SeatModerationFlag = {
  id: string;
  source_type: "post" | "comment";
  source_id: string;
  post_id: string | null;
  comment_id: string | null;
  author_id: string | null;
  bot_name: string;
  bot_identity: string;
  severity: "low" | "medium" | "high";
  categories: string[];
  confidence: number;
  excerpt: string;
  recommendation: string;
  status: "pending" | "resolved" | "dismissed";
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
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

export type SeatGroupStatus = "pending" | "approved" | "rejected" | "archived";

export type SeatGroupVerificationStatus = "self_reported" | "admin_verified" | "needs_update";

export type SeatGroupFormat = "in_person" | "hybrid" | "virtual";

export type SeatGroupType =
  | "Homeschool co-op"
  | "Hybrid learning pod"
  | "Microschool"
  | "Field trip group"
  | "Parent meetup"
  | "Tutor-supported group"
  | "Homeschool support association"
  | "Support group"
  | "Faith group"
  | "Secular group"
  | "Inclusive group"
  | "Resource group"
  | "Special interest group"
  | "Special needs group"
  | "Military support group"
  | "Volunteer support group"
  | "Co-school";

export type SeatGroupSubmission = {
  id: string;
  submitted_by: string | null;
  status: SeatGroupStatus;
  verification_status: SeatGroupVerificationStatus;
  group_name: string;
  group_type: SeatGroupType;
  format: SeatGroupFormat;
  city: string;
  state: string;
  nearby_states: string[];
  age_bands: string[];
  inclusion_tags: string[];
  cost_range: string | null;
  meeting_rhythm: string | null;
  website_url: string | null;
  source_url: string | null;
  contact_email: string | null;
  contact_name: string | null;
  description: string;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  last_verified_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SeatPointEventType =
  | "post_created"
  | "comment_created"
  | "reaction_given"
  | "reaction_received"
  | "pod_submission_approved"
  | "manual_adjustment";

export type SeatPointEvent = {
  id: string;
  user_id: string;
  event_type: SeatPointEventType;
  points: number;
  source_type: string;
  source_id: string | null;
  reason: string;
  created_at: string;
};

export type SeatPointTotal = {
  user_id: string;
  total_points: number;
  posts_count: number;
  comments_count: number;
  reactions_given_count: number;
  reactions_received_count: number;
  pod_submissions_count: number;
  updated_at: string;
};

export type SeatBadge = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  sort_order: number;
  created_at: string;
};

export type SeatMemberBadge = {
  user_id: string;
  badge_slug: string;
  awarded_at: string;
};

export type SeatLiveSession = {
  id: string;
  slug: string;
  title: string;
  description: string;
  cadence: string;
  day_label: string;
  time_label: string;
  timezone: string;
  location_url: string | null;
  status: "scheduled" | "live" | "complete" | "canceled";
  starts_at: string | null;
  question_channel_slug: string;
  replay_url: string | null;
  recap: string | null;
  resource_links: Record<string, unknown>[];
  created_at: string;
  updated_at: string;
};

export type SeatLiveSessionRsvp = {
  session_id: string;
  user_id: string;
  status: "interested" | "going" | "canceled";
  question_post_id: string | null;
  created_at: string;
  updated_at: string;
};

export type SeatSubscription = {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  tier: "free" | "member" | "pro";
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
};
