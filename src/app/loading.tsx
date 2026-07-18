import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col pt-20">
      {/* Hero Skeleton */}
      <Skeleton className="w-full h-[60vh] rounded-none opacity-20" />
      
      {/* Content Skeletons */}
      <div className="container mx-auto px-4 md:px-6 py-16 space-y-8">
        <Skeleton className="w-1/3 h-10 mb-8 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="w-full h-64" />
          <Skeleton className="w-full h-64" />
          <Skeleton className="w-full h-64" />
        </div>
      </div>
    </div>
  );
}
