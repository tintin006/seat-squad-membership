import {
  BookOpen,
  CalendarDays,
  Download,
  FileText,
  GraduationCap,
  Mail,
  MapPinned,
  MessagesSquare,
  Mic,
  Newspaper,
  PlayCircle,
  Users,
  type LucideIcon,
} from "lucide-react";

export type MemberBenefit = {
  title: string;
  description: string;
  category: "Guidance" | "Tools" | "People" | "Rhythm";
  icon: LucideIcon;
  status: "Built now" | "Launch focus" | "Next build";
};

export const memberBenefits: MemberBenefit[] = [
  {
    title: "How-to Homeschool Videos",
    description: "Short practical walkthroughs for filing, deschooling, planning, documentation, pods, AI safety, and learning routines.",
    category: "Guidance",
    icon: PlayCircle,
    status: "Launch focus",
  },
  {
    title: "Downloadable Resource Guides",
    description: "State guides, ESA guides, inclusive curriculum lists, neurodivergent supports, and leaving-school checklists.",
    category: "Tools",
    icon: Download,
    status: "Launch focus",
  },
  {
    title: "Planners and Calendars",
    description: "Weekly rhythm planners, attendance trackers, portfolio logs, project calendars, and pod planning templates.",
    category: "Tools",
    icon: CalendarDays,
    status: "Built now",
  },
  {
    title: "Downloadable Lesson Plans",
    description: "Low-prep mini-units and learning remixes for critical thinking, life skills, media literacy, financial literacy, and AI literacy.",
    category: "Tools",
    icon: FileText,
    status: "Next build",
  },
  {
    title: "Community Forum",
    description: "Ask questions, share wins, request resources, troubleshoot friction, and get feedback from families and educators.",
    category: "People",
    icon: MessagesSquare,
    status: "Built now",
  },
  {
    title: "Microschool, Pod, and Homeschool Group Directory",
    description: "A searchable way to find nearby groups by location, age band, learning style, inclusion stance, cost, and availability.",
    category: "People",
    icon: MapPinned,
    status: "Next build",
  },
  {
    title: "Live Weekly Q&A",
    description: "A predictable weekly room for real questions, resource walkthroughs, family strategy, and community listening.",
    category: "Guidance",
    icon: Users,
    status: "Launch focus",
  },
  {
    title: "Tutor Connection",
    description: "A practical path to find tutor/educator fit, starting with checklists and evolving into vetted connection requests.",
    category: "People",
    icon: GraduationCap,
    status: "Next build",
  },
  {
    title: "The Remix Report",
    description: "A context feed that turns education trends, AI shifts, policy, tutoring, pods, and culture into member discussion prompts.",
    category: "Guidance",
    icon: Newspaper,
    status: "Built now",
  },
  {
    title: "The Remix Report Podcast",
    description: "A member-friendly audio layer that turns education trends into practical family decisions and community prompts.",
    category: "Guidance",
    icon: Mic,
    status: "Next build",
  },
  {
    title: "Newsletter",
    description: "A weekly digest with new downloads, top questions, upcoming Q&A, podcast notes, and one clear next step.",
    category: "Rhythm",
    icon: Mail,
    status: "Built now",
  },
];

export const benefitCategories = [
  {
    title: "Guidance",
    description: "Videos, live Q&A, and Remix Report audio that help families make the next decision.",
    icon: BookOpen,
  },
  {
    title: "Tools",
    description: "Downloadable guides, planners, calendars, and lesson plans that reduce weekly friction.",
    icon: Download,
  },
  {
    title: "People",
    description: "Forum support, group discovery, and tutor connection so families are not building alone.",
    icon: Users,
  },
  {
    title: "Rhythm",
    description: "Newsletter, weekly prompts, and recurring live touchpoints that keep the space useful.",
    icon: CalendarDays,
  },
];
