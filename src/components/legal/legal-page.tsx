import Link from "next/link";

export function LegalPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm font-black text-primary">
          SEAT Squad
        </Link>
        <div className="mt-8 rounded-lg border border-border bg-card p-6 shadow-soft sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-display text-3xl font-black tracking-[-0.04em] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-base font-semibold leading-7 text-muted-foreground">
            {intro}
          </p>
          <div className="legal-copy mt-8 space-y-7 text-sm font-semibold leading-7 text-muted-foreground">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-xl font-black text-foreground">{title}</h2>
      <div className="mt-2 space-y-3">{children}</div>
    </section>
  );
}
