"use client";

import { useState } from "react";
import { CreditCard, ExternalLink, Loader2, Sparkles } from "lucide-react";
import { tierPlans, type SeatTier } from "@/lib/tiers";

type BillingPanelProps = {
  currentTier: SeatTier;
  subscriptionStatus?: string | null;
  currentPeriodEnd?: string | null;
  hasBillingCustomer?: boolean;
};

async function redirectFromBillingEndpoint(endpoint: string, body?: Record<string, unknown>) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Billing request failed.");
  window.location.href = payload.url;
}

export function BillingPanel({
  currentTier,
  subscriptionStatus,
  currentPeriodEnd,
  hasBillingCustomer = false,
}: BillingPanelProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [error, setError] = useState("");

  const startCheckout = async (tier: SeatTier) => {
    setError("");
    setLoadingAction(`checkout-${tier}`);
    try {
      await redirectFromBillingEndpoint("/api/stripe/checkout", { tier });
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Could not start checkout.");
      setLoadingAction(null);
    }
  };

  const openPortal = async () => {
    setError("");
    setLoadingAction("portal");
    try {
      await redirectFromBillingEndpoint("/api/stripe/portal");
    } catch (portalError) {
      setError(portalError instanceof Error ? portalError.message : "Could not open billing portal.");
      setLoadingAction(null);
    }
  };

  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="seat-kicker">Billing</p>
          <h2 className="mt-1 font-display text-2xl font-black">Membership tier</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
            Current plan: <span className="font-black capitalize text-foreground">{currentTier}</span>
            {subscriptionStatus ? ` · ${subscriptionStatus}` : ""}
            {currentPeriodEnd ? ` · renews ${new Date(currentPeriodEnd).toLocaleDateString()}` : ""}
          </p>
        </div>
        {hasBillingCustomer && (
          <button
            type="button"
            onClick={openPortal}
            disabled={loadingAction === "portal"}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface-high px-4 py-2.5 text-sm font-black transition hover:border-primary disabled:opacity-50"
          >
            {loadingAction === "portal" ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
            Manage billing
          </button>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-bold text-destructive">
          {error}
        </p>
      )}

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {tierPlans.map((plan) => {
          const isCurrent = plan.tier === currentTier;
          const isPaid = plan.tier !== "free";
          const loading = loadingAction === `checkout-${plan.tier}`;
          return (
            <article
              key={plan.tier}
              className={`rounded-lg border p-4 ${
                isCurrent ? "border-primary bg-primary/10" : "border-border bg-surface-high"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl font-black">{plan.name}</h3>
                  <p className="mt-1 text-2xl font-black">{plan.price}</p>
                </div>
                {isCurrent && (
                  <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-primary-foreground">
                    Current
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm font-semibold leading-5 text-muted-foreground">{plan.description}</p>
              <ul className="mt-4 space-y-2 text-sm font-bold text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <Sparkles size={14} className="mt-0.5 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              {isPaid && !isCurrent && (
                <button
                  type="button"
                  onClick={() => startCheckout(plan.tier)}
                  disabled={Boolean(loadingAction)}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-black text-primary-foreground transition hover:translate-y-[-1px] disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <ExternalLink size={16} />}
                  Upgrade to {plan.name}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
