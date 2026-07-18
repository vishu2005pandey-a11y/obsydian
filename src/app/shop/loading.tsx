import { Skeleton } from "@/components/ui/Skeleton";

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-background py-12 pt-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-border pb-6">
          <Skeleton className="w-48 h-10" />
          <Skeleton className="w-64 h-10" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col">
              <Skeleton className="w-full aspect-[3/4] mb-4 rounded-lg" />
              <Skeleton className="w-3/4 h-5 mb-2" />
              <Skeleton className="w-1/2 h-5 mb-3" />
              <Skeleton className="w-1/4 h-6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
