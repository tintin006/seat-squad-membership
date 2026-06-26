import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms of Use | SEAT Squad",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Launch draft"
      title="Terms of Use"
      intro="These terms set expectations for using SEAT Squad as a Remix Academics member community, resource library, and support space."
    >
      <LegalSection title="Use of the community">
        <p>
          SEAT Squad is for families, educators, tutors, and learning builders
          seeking practical homeschool, alternative learning, and learner support
          resources. Members agree to use the site respectfully, provide accurate
          account information, and avoid activity that disrupts the community.
        </p>
      </LegalSection>

      <LegalSection title="Educational information, not legal advice">
        <p>
          Guides, videos, forum posts, live Q&A, and directory listings are for
          educational and planning purposes. Families remain responsible for
          checking current laws, program rules, school withdrawal requirements,
          ESA rules, scholarship rules, and professional advice in their state.
        </p>
      </LegalSection>

      <LegalSection title="Membership and digital resources">
        <p>
          Member resources are licensed for personal family or professional use
          within your own learning work. Do not resell, publicly repost, or
          redistribute paid or member-only files without written permission from
          Remix Academics.
        </p>
      </LegalSection>

      <LegalSection title="Tutors, groups, and third parties">
        <p>
          Tutor profiles, pod listings, microschool listings, and local resource
          links may point to independent people or organizations. SEAT Squad may
          review submissions before publishing, but families should still do
          their own due diligence before joining a group, hiring a provider, or
          sharing personal information.
        </p>
      </LegalSection>

      <LegalSection title="Account actions">
        <p>
          Remix Academics may remove content, limit access, suspend accounts, or
          close accounts when needed to protect members, enforce these terms, or
          respond to misuse of the platform.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these terms can be sent to updates@remixacademics.com.
          This launch draft should be reviewed before a paid public launch.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
