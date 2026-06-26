"use client";

import { AppShell } from "@/components/app-shell";

function normalizeDemoHref(href: string) {
  return href === "/" ? "/demo/dashboard" : `/demo${href}`;
}

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      user={{ email: "founder-demo@seatsquad.local" }}
      profile={{ display_name: "Founding Member", role: "admin", tier: "member" }}
      hrefResolver={normalizeDemoHref}
    >
      {children}
    </AppShell>
  );
}
