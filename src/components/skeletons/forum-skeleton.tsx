import { Skeleton } from "@/components/ui/skeleton";

export function ForumSkeleton() {
  return (
    <div className="flex min-h-screen">
      {/* Left sidebar skeleton */}
      <aside className="hidden w-60 border-r border-border bg-card/80 p-4 xl:block">
        <Skeleton className="mb-3 h-4 w-24" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="mb-2 h-8 w-full" />
        ))}
      </aside>

      {/* Main content skeleton */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl">
          {/* Hero skeleton */}
          <div className="mb-6 rounded-2xl bg-secondary p-6 sm:p-8">
            <Skeleton className="mb-3 h-4 w-32" />
            <Skeleton className="mb-4 h-8 w-3/4" />
            <Skeleton className="mb-5 h-4 w-full" />
            <div className="grid gap-2 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          </div>

          {/* Composer skeleton */}
          <Skeleton className="mb-6 h-24 w-full" />

          {/* Filters skeleton */}
          <div className="mb-6 rounded-xl border border-border bg-card p-4">
            <div className="flex flex-col gap-3 lg:flex-row">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="mt-4 flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-28" />
              ))}
            </div>
          </div>

          {/* Post skeletons */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="mb-4 rounded-xl border border-border bg-card p-5">
              <div className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Right rail skeleton */}
      <aside className="hidden w-72 border-l border-border bg-card/80 p-4 lg:block">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="mb-3 h-20 w-full" />
        ))}
      </aside>
    </div>
  );
}