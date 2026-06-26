import type { SeatGroupFormat, SeatGroupType, SeatGroupVerificationStatus } from "@/types/database";

export type PodGroup = {
  id: string;
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
  source_url?: string | null;
  contact_email: string | null;
  description: string;
  verification_status?: SeatGroupVerificationStatus;
  last_verified_at?: string | null;
  expires_at?: string | null;
};

export const groupTypes: SeatGroupType[] = [
  "Homeschool co-op",
  "Hybrid learning pod",
  "Microschool",
  "Field trip group",
  "Parent meetup",
  "Tutor-supported group",
  "Homeschool support association",
  "Support group",
  "Faith group",
  "Secular group",
  "Inclusive group",
  "Resource group",
  "Special interest group",
  "Special needs group",
  "Military support group",
  "Volunteer support group",
  "Co-school",
];

export const groupFormats: { value: SeatGroupFormat; label: string }[] = [
  { value: "in_person", label: "In person" },
  { value: "hybrid", label: "Hybrid" },
  { value: "virtual", label: "Virtual" },
];

export const ageBandOptions = ["Early learners", "Elementary", "Middle school", "High school", "Mixed ages"];

export const inclusionOptions = [
  "Black-led",
  "Culturally affirming",
  "LGBTQ-inclusive",
  "Neurodivergent-friendly",
  "Disability support",
  "Secular",
  "Faith-friendly",
  "ESA-friendly",
  "Project-based",
  "Outdoor learning",
];

export const usStates = [
  { code: "AL", name: "Alabama" },
  { code: "AZ", name: "Arizona" },
  { code: "CA", name: "California" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "MD", name: "Maryland" },
  { code: "NC", name: "North Carolina" },
  { code: "OH", name: "Ohio" },
  { code: "PA", name: "Pennsylvania" },
  { code: "SC", name: "South Carolina" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "VA", name: "Virginia" },
].sort((a, b) => a.name.localeCompare(b.name));

export const surroundingStates: Record<string, string[]> = {
  AL: ["FL", "GA", "TN"],
  AZ: ["CA", "TX"],
  CA: ["AZ"],
  FL: ["GA", "AL"],
  GA: ["FL", "AL", "NC", "SC", "TN"],
  MD: ["VA", "NC"],
  NC: ["SC", "GA", "TN", "VA"],
  OH: ["PA", "VA"],
  PA: ["OH", "VA"],
  SC: ["NC", "GA"],
  TN: ["GA", "AL", "NC"],
  TX: ["AZ"],
  VA: ["MD", "NC"],
};

export const stateResourceLinks: Record<string, { label: string; href: string; type: string }[]> = {
  FL: [
    { label: "Florida homeschool + ESA resource guide", href: "/downloads/esa-state-guides/florida-homeschool-guide.pdf", type: "Member download" },
    { label: "Family-friendly museum learning ideas", href: "https://remixacademics.com/resources/homeschool-pods-microschools", type: "Venue ideas" },
  ],
  GA: [
    { label: "Georgia homeschool + ESA resource guide", href: "/downloads/esa-state-guides/georgia-homeschool-guide.pdf", type: "Member download" },
    { label: "Pod and microschool planning guide", href: "https://remixacademics.com/resources/homeschool-pods-microschools", type: "Planning" },
  ],
  NC: [
    { label: "North Carolina homeschool + ESA resource guide", href: "/downloads/esa-state-guides/north-carolina-homeschool-guide.pdf", type: "Member download" },
    { label: "Portfolio and record planning", href: "https://remixacademics.com/resources/homeschool-portfolio-records", type: "Records" },
  ],
  AZ: [
    { label: "Arizona homeschool + ESA resource guide", href: "/downloads/esa-state-guides/arizona-homeschool-guide.pdf", type: "Member download" },
    { label: "ESA planning resources", href: "https://remixacademics.com/resources/esa-homeschool-scholarships", type: "ESA" },
  ],
  TN: [
    { label: "Tennessee homeschool + ESA resource guide", href: "/downloads/esa-state-guides/tennessee-homeschool-guide.pdf", type: "Member download" },
    { label: "Leaving traditional school checklist", href: "https://remixacademics.com/resources/start-homeschooling-after-school", type: "Checklist" },
  ],
};

export const venueIdeas = [
  "Children's museums",
  "Black history museums",
  "Public library maker spaces",
  "Nature centers",
  "Community colleges",
  "Local theaters",
  "Science centers",
  "Historical societies",
];

export const samplePodGroups: PodGroup[] = [
  {
    id: "demo-atlanta-coop",
    group_name: "Southside Learning Commons",
    group_type: "Homeschool co-op",
    format: "in_person",
    city: "Atlanta",
    state: "GA",
    nearby_states: ["AL", "SC"],
    age_bands: ["Elementary", "Middle school"],
    inclusion_tags: ["Black-led", "Neurodivergent-friendly", "Secular", "Project-based"],
    cost_range: "$25-$75/month",
    meeting_rhythm: "Weekly",
    website_url: "https://example.com/southside-learning",
    contact_email: "hello@example.com",
    description: "A small family-led co-op focused on project blocks, field trips, and shared resource planning for families south of Atlanta.",
  },
  {
    id: "demo-charlotte-pod",
    group_name: "Queen City Hybrid Pod",
    group_type: "Hybrid learning pod",
    format: "hybrid",
    city: "Charlotte",
    state: "NC",
    nearby_states: ["SC", "GA"],
    age_bands: ["Middle school", "High school"],
    inclusion_tags: ["LGBTQ-inclusive", "ADHD support", "Teen projects", "Tutor-supported"],
    cost_range: "$100-$250/month",
    meeting_rhythm: "Twice monthly",
    website_url: null,
    contact_email: "connect@example.com",
    description: "A teen-centered hybrid pod for families who want social connection, flexible academics, and occasional tutor-supported project sessions.",
  },
  {
    id: "demo-jax-microschool",
    group_name: "River City Microschool Circle",
    group_type: "Microschool",
    format: "in_person",
    city: "Jacksonville",
    state: "FL",
    nearby_states: ["GA"],
    age_bands: ["Elementary", "Middle school"],
    inclusion_tags: ["ESA-friendly", "Culturally affirming", "Outdoor learning"],
    cost_range: "$500+/month",
    meeting_rhythm: "Four days/week",
    website_url: "https://example.com/river-city",
    contact_email: null,
    description: "A small microschool circle built around mixed-age projects, museum days, and family conferences.",
  },
];

export function getStateName(code: string) {
  return usStates.find((state) => state.code === code)?.name || code;
}
