import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy | SEAT Squad",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Launch draft"
      title="Privacy Policy"
      intro="This policy explains what SEAT Squad collects, why we collect it, and the care we take with member information."
    >
      <LegalSection title="Information we collect">
        <p>
          We collect account information such as name, email address, membership
          tier, profile details, onboarding answers, posts, comments, resource
          activity, group submissions, tutor connection requests, event activity,
          and support messages you choose to submit.
        </p>
      </LegalSection>

      <LegalSection title="How we use information">
        <p>
          We use member information to operate the community, provide downloads,
          personalize resource recommendations, review submissions, support tutor
          connection workflows, send member updates, maintain safety, and improve
          SEAT Squad offerings.
        </p>
      </LegalSection>

      <LegalSection title="Children and family information">
        <p>
          SEAT Squad is intended for adults, parents, guardians, educators, and
          learning builders. Members should avoid posting a child&apos;s sensitive
          personal information in public community areas. If we learn that we
          collected personal information directly from a child under 13 without
          appropriate consent, we will work to delete it.
        </p>
      </LegalSection>

      <LegalSection title="Sharing and service providers">
        <p>
          We may use service providers for hosting, authentication, storage,
          payments, email delivery, analytics, and moderation support. We do not
          sell member personal information. We may share information when needed
          to operate requested workflows, comply with law, protect the community,
          or complete a member-directed tutor or group connection.
        </p>
      </LegalSection>

      <LegalSection title="Security and retention">
        <p>
          We use access controls, private storage for protected downloads, and
          admin review workflows to reduce unnecessary exposure. No online system
          can be guaranteed perfectly secure. We keep information as long as
          needed for the community, legal, safety, and operational purposes.
        </p>
      </LegalSection>

      <LegalSection title="Choices and contact">
        <p>
          Members may update profile information in account settings and may
          contact updates@remixacademics.com with privacy, access, correction,
          or deletion requests. This launch draft should be reviewed against the
          final production stack, analytics choices, and paid membership flows.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
