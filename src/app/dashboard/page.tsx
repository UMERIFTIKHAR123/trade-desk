import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardOverview } from "./components/dashboard-overview";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[88px] rounded-xl sm:h-[96px]" />

      <div className="overflow-x-auto pb-1 lg:overflow-visible">
        <div className="grid min-w-[750px] grid-cols-5 gap-3 lg:min-w-0 lg:w-full">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Skeleton className="h-[420px] rounded-xl xl:col-span-2" />
        <Skeleton className="h-[420px] rounded-xl xl:col-span-1" />
      </div>
      <Skeleton className="h-[380px] rounded-xl" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardOverview />
    </Suspense>
  );
}
