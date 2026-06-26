import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Founding Member Expectations | SEAT Squad",
};

export default function FoundingMemberExpectationsPage() {
  return (
    <LegalPage
      eyebrow="Launch note"
      title="Founding Member Expectations"
      intro="The first version of SEAT Squad is intentionally practical and member-shaped. Founding members help us see what families actually need before we scale the offer."
    >
      <LegalSection title="What founding members can expect">
        <p>
          You can expect working access to the community, resource downloads,
          Q&A rhythms, directory experiments, starter videos, tutor connection
          requests, and visible product iteration as Remix Academics learns from
          real member needs.
        </p>
      </LegalSection>

      <LegalSection title="What is still being shaped">
        <p>
          Some areas will keep improving during launch, including the depth of
          the video library, state guide coverage, tutor profile volume, local
          directory density, paid tier boundaries, and admin review workflows.
        </p>
      </LegalSection>

      <LegalSection title="How to participate well">
        <p>
          Introduce yourself, ask practical questions, tell us what resource you
          wish existed, report broken links or unclear flows, and share what
          feels genuinely useful. Early feedback matters more than polished
          applause.
        </p>
      </LegalSection>

      <LegalSection title="What SEAT Squad is not">
        <p>
          SEAT Squad is not a school, legal service, therapy service, emergency
          service, or guarantee that a tutor, pod, curriculum, or state option
          will fit your family. We help members think clearly, compare options,
          and find better next steps.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
