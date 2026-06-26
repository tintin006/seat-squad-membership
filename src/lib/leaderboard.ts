export type ContributionBadge = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  sort_order: number;
};

export type LeaderboardMember = {
  user_id: string;
  display_name: string;
  role: string;
  tier: string;
  location: string | null;
  total_points: number;
  posts_count: number;
  comments_count: number;
  reactions_given_count: number;
  reactions_received_count: number;
  pod_submissions_count: number;
  badges: ContributionBadge[];
};

export type ContributionRule = {
  action: string;
  points: number;
  note: string;
};

export const contributionRules: ContributionRule[] = [
  { action: "Create a post", points: 10, note: "Start a useful thread, question, or resource share." },
  { action: "Add a comment", points: 5, note: "Help another member think through the next step." },
  { action: "Give a reaction", points: 1, note: "Encourage a post without turning everything into a contest." },
  { action: "Receive a reaction", points: 2, note: "Light signal that your post helped someone." },
  { action: "Approved pod/group submission", points: 25, note: "Help the directory become useful for families near you." },
];

export const sampleLeaderboardMembers: LeaderboardMember[] = [
  {
    user_id: "demo-maya",
    display_name: "Maya R.",
    role: "both",
    tier: "member",
    location: "Atlanta, GA",
    total_points: 126,
    posts_count: 6,
    comments_count: 9,
    reactions_given_count: 12,
    reactions_received_count: 8,
    pod_submissions_count: 1,
    badges: [
      { slug: "founding_voice", name: "Founding Voice", description: "Earned 100 contribution points.", icon: "Trophy", sort_order: 60 },
      { slug: "pod_scout", name: "Pod Scout", description: "Submitted an approved group.", icon: "MapPinned", sort_order: 40 },
    ],
  },
  {
    user_id: "demo-janelle",
    display_name: "Janelle",
    role: "family",
    tier: "member",
    location: "Charlotte, NC",
    total_points: 82,
    posts_count: 3,
    comments_count: 8,
    reactions_given_count: 9,
    reactions_received_count: 6,
    pod_submissions_count: 0,
    badges: [
      { slug: "community_spark", name: "Community Spark", description: "Earned 50 contribution points.", icon: "Flame", sort_order: 50 },
      { slug: "helpful_reply", name: "Helpful Reply", description: "Added five replies.", icon: "MessagesSquare", sort_order: 30 },
    ],
  },
  {
    user_id: "demo-roberto",
    display_name: "Roberto",
    role: "educator",
    tier: "free",
    location: "Orlando, FL",
    total_points: 47,
    posts_count: 2,
    comments_count: 4,
    reactions_given_count: 7,
    reactions_received_count: 5,
    pod_submissions_count: 0,
    badges: [
      { slug: "first_post", name: "First Post", description: "Shared a first post.", icon: "MessageSquare", sort_order: 10 },
    ],
  },
];
