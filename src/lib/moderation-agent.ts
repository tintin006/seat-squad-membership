export const moderationAgent = {
  name: "SEAT Steward Bot",
  identity: "Automated forum moderation assistant",
  shortDescription: "Flags posts and replies for admin review. It is a bot, not Tendi.",
  reviewStandard: "The bot recommends review only. Human admins make moderation decisions.",
};

export type ModerationFlagStatus = "pending" | "resolved" | "dismissed";

export type ModerationFlag = {
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
  status: ModerationFlagStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_notes: string | null;
  created_at: string;
  author?: { display_name: string | null }[] | null;
  post?: { title: string | null; content: string }[] | null;
};
