export type TutorProfile = {
  id: string;
  display_name: string;
  headline: string;
  subjects: string[];
  learner_fit_tags: string[];
  formats: string[];
  states: string[];
  rate_range: string | null;
  bio: string;
  website_url: string | null;
};

export type TutorConnectionRequest = {
  id: string;
  requester_id: string;
  tutor_profile_id: string | null;
  learner_age_band: string;
  subjects: string[];
  support_goal: string;
  schedule_notes: string | null;
  budget_range: string | null;
  preferred_format: string | null;
  status: "pending" | "matched" | "closed" | "archived";
  admin_notes: string | null;
  created_at: string;
  requester?: { display_name: string | null }[] | null;
  tutor?: { display_name: string | null }[] | null;
};

export const sampleTutorProfiles: TutorProfile[] = [
  {
    id: "demo-tutor-amara",
    display_name: "Amara J.",
    headline: "Reading confidence and executive-function friendly tutoring",
    subjects: ["Reading / ELA", "Writing", "Study skills"],
    learner_fit_tags: ["ADHD-aware", "Confidence repair", "Middle grades"],
    formats: ["Virtual", "Hybrid"],
    states: ["GA", "NC"],
    rate_range: "$45-65/hr",
    bio: "A former classroom teacher who helps learners rebuild trust with reading, writing, and task follow-through.",
    website_url: null,
  },
  {
    id: "demo-tutor-marcus",
    display_name: "Marcus R.",
    headline: "Math repair for learners who think they are bad at math",
    subjects: ["Math", "SAT/ACT", "Project support"],
    learner_fit_tags: ["Math anxiety", "High school", "Portfolio evidence"],
    formats: ["Virtual"],
    states: ["FL", "TN"],
    rate_range: "$60-80/hr",
    bio: "A patient math coach focused on visible wins, error-friendly routines, and practical skill recovery.",
    website_url: null,
  },
];
