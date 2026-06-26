import { BillingPanel } from "@/components/billing/billing-panel";

export default function DemoSettingsPage() {
  return (
    <div className="p-5 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-3xl font-black">Settings</h1>
        <p className="mt-2 text-sm font-semibold text-muted-foreground">
          Demo view of Stripe-backed tier controls and member billing management.
        </p>
        <div className="mt-8">
          <BillingPanel
            currentTier="free"
            subscriptionStatus="inactive"
            hasBillingCustomer={false}
          />
        </div>
      </div>
    </div>
  );
}
