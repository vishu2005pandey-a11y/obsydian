import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-background py-12 pt-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-8">
          <Skeleton className="w-16 h-4" />
          <span className="text-gray-600">/</span>
          <Skeleton className="w-20 h-4" />
          <span className="text-gray-600">/</span>
          <Skeleton className="w-32 h-4" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Images Skeleton */}
          <div className="w-full lg:w-1/2 flex gap-4 h-[600px]">
            <div className="w-20 flex flex-col gap-4">
              <Skeleton className="w-full aspect-[3/4] rounded-lg border border-border" />
              <Skeleton className="w-full aspect-[3/4] rounded-lg border border-border" />
              <Skeleton className="w-full aspect-[3/4] rounded-lg border border-border" />
            </div>
            <Skeleton className="flex-1 rounded-xl" />
          </div>

          {/* Info Skeleton */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div>
              <Skeleton className="w-3/4 h-10 mb-4" />
              <Skeleton className="w-1/3 h-8" />
            </div>
            
            <Skeleton className="w-full h-[1px] bg-white/10 rounded-none" />

            <div className="space-y-4">
              <Skeleton className="w-24 h-5" />
              <div className="flex gap-3">
                <Skeleton className="w-12 h-12" />
                <Skeleton className="w-12 h-12" />
                <Skeleton className="w-12 h-12" />
                <Skeleton className="w-12 h-12" />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border mt-8">
              <div className="flex gap-4 h-12">
                <Skeleton className="w-32 h-full" />
                <Skeleton className="flex-1 h-full" />
                <Skeleton className="flex-1 h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
