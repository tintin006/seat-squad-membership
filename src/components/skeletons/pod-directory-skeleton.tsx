import { Skeleton } from "@/components/ui/skeleton";

export function PodDirectorySkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Hero skeleton */}
        <div className="mb-6 overflow-hidden rounded-2xl bg-secondary p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <Skeleton className="mb-3 h-4 w-40" />
              <Skeleton className="mb-4 h-10 w-3/4" />
              <Skeleton className="mb-6 h-4 w-full" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
            <div>
              <Skeleton className="mb-5 h-8 w-32" />
              <div className="mb-4 grid grid-cols-5 gap-2">
                {Array.from({ length: 14 }).map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>

        {/* Main content skeleton */}
        <div className="grid gap-4 lg:grid-cols-[0.35fr_0.65fr]">
          {/* Sidebar skeleton */}
          <aside className="rounded-xl border border-border bg-card p-5">
            <Skeleton className="mb-4 h-4 w-24" />
            <Skeleton className="mb-5 h-10 w-full" />
            <Skeleton className="mb-4 h-8 w-32" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="mb-2 h-6 w-20" />
            ))}
            <Skeleton className="mb-4 h-8 w-24" />
            <Skeleton className="mb-3 h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </aside>

          {/* Group cards skeleton */}
          <div className="space-y-4">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Skeleton className="mb-1 h-4 w-48" />
                <Skeleton className="h-8 w-32" />
              </div>
              <Skeleton className="h-10 w-36" />
            </div>

            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="mb-3 h-4 w-32" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-8 w-24 shrink-0" />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}