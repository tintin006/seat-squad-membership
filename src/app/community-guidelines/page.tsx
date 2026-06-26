import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Community Guidelines | SEAT Squad",
};

export default function CommunityGuidelinesPage() {
  return (
    <LegalPage
      eyebrow="Member norms"
      title="Community Guidelines"
      intro="SEAT Squad should feel useful, candid, and safe enough for real family context without becoming a place where people are flattened into labels."
    >
      <LegalSection title="Assume context, not sameness">
        <p>
          Families bring different cultures, faith backgrounds, budgets, state
          rules, disability experiences, school histories, and learning goals.
          Offer what worked for you without treating it as the only responsible
          choice.
        </p>
      </LegalSection>

      <LegalSection title="Protect privacy">
        <p>
          Do not post private contact information, screenshots, school records,
          medical details, disability documentation, or identifying information
          about children unless you have clear permission and a real need to
          share it. Use private support channels for sensitive situations.
        </p>
      </LegalSection>

      <LegalSection title="No harassment or hate">
        <p>
          Harassment, threats, discriminatory attacks, sexual content involving
          minors, doxxing, scams, and targeted humiliation are not allowed. Posts
          may be removed and accounts may be limited or suspended.
        </p>
      </LegalSection>

      <LegalSection title="Keep recommendations transparent">
        <p>
          If you recommend a paid service, tutor, curriculum, group, or product
          you are connected to, say so. Practical recommendations are welcome;
          hidden promotion and pressure tactics are not.
        </p>
      </LegalSection>

      <LegalSection title="Use the right lane">
        <p>
          Use the forum for peer discussion, Live Q&A for team questions, the
          directory for pods and groups, tutor connection forms for referrals,
          and support contact for account or safety issues. This helps members
          get useful answers faster.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
