import { cn } from "../lib/utils";

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-zinc-800", className)}
      {...props}
    />
  );
};

export const ExpertCardSkeleton = () => {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 shadow-xl rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Avatar Skeleton */}
          <Skeleton className="w-12 h-12 rounded-xl" />
          
          <div className="space-y-1.5">
             {/* Name Skeleton */}
            <Skeleton className="h-5 w-28" />
             {/* Specialization Skeleton */}
            <Skeleton className="h-2.5 w-20" />
          </div>
        </div>
        
        <div className="flex flex-col items-end pl-2 space-y-1">
             {/* Price Skeleton */}
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-2.5 w-8" />
        </div>
      </div>

      {/* Bio Skeleton */}
      <div className="space-y-2 mb-6 flex-grow">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between mt-auto">
        {/* Rating Skeleton */}
        <Skeleton className="h-7 w-16 rounded-lg" />
        
        {/* View Profile Link Skeleton */}
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
};

export const DashboardSkeleton = () => {
    return (
        <div className="space-y-8">
            {/* Header Skeleton */}
            <div className="flex items-center space-x-4 mb-8">
                 <Skeleton className="w-14 h-14 rounded-2xl" />
                 <div className="space-y-2">
                     <Skeleton className="h-8 w-48" />
                     <Skeleton className="h-4 w-64" />
                 </div>
            </div>

            {/* Table/Card Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="p-6 space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex justify-between items-center">
                            <div className="flex space-x-4 w-1/3">
                                <div className="space-y-2 w-full">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 w-1/3">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div className="space-y-2 w-full">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                             <div className="w-1/6">
                                <Skeleton className="h-6 w-20 rounded-full" />
                             </div>
                             <div className="w-1/6 flex justify-end">
                                <Skeleton className="h-8 w-24 rounded-xl" />
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
