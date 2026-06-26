import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Support | SEAT Squad",
};

export default function SupportPage() {
  return (
    <LegalPage
      eyebrow="Member help"
      title="Support"
      intro="Use support for account questions, billing access issues, privacy requests, safety reports, and broken workflows."
    >
      <LegalSection title="Contact">
        <p>
          Email updates@remixacademics.com with the email address connected to
          your account, a short description of the issue, and any relevant page
          or screenshot details.
        </p>
      </LegalSection>

      <LegalSection title="Safety and moderation">
        <p>
          For urgent community safety concerns, include the post, comment,
          member name, or directory listing involved. The admin team can review
          reports, remove content, and limit account access when needed.
        </p>
      </LegalSection>

      <LegalSection title="Billing and downloads">
        <p>
          If a member-only download, paid tier, or billing setting does not look
          right, include the resource title or plan name so the team can check
          your account and access status.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
