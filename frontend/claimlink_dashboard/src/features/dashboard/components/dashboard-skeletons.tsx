import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Dashboard Skeletons
 *
 * Loading and error states for dashboard sections
 */

export const StatusSectionSkeleton = () => (
  <Card className="bg-white border border-[#f2f2f2] rounded-2xl shadow-[0_2px_4px_0_rgba(0,0,0,0.05)] p-4 w-full">
    <Skeleton className="h-4 w-48 mb-4" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex flex-col gap-2 p-3 border border-[#f2f2f2] rounded-lg"
        >
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  </Card>
);

export const CertificatesSectionSkeleton = () => (
  <Card className="bg-white border border-[#f2f2f2] rounded-2xl shadow-[0_2px_4px_0_rgba(0,0,0,0.05)] p-4 w-full lg:flex-1 min-w-0">
    <div className="flex flex-row items-center justify-between mb-4">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-8 w-24" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <div key={i} className="flex flex-col gap-3">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  </Card>
);

export const StatusSectionError = ({ error }: { error: Error }) => (
  <Card className="bg-white border border-[#f2f2f2] rounded-2xl shadow-[0_2px_4px_0_rgba(0,0,0,0.05)] p-4 w-full">
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-[#222526]">
        Failed to load dashboard statistics
      </p>
      <p className="text-xs text-[#69737c]">{error.message}</p>
    </div>
  </Card>
);

export const CertificatesSectionError = ({ error }: { error: Error }) => (
  <Card className="bg-white border border-[#f2f2f2] rounded-2xl shadow-[0_2px_4px_0_rgba(0,0,0,0.05)] p-4 w-full lg:flex-1 min-w-0">
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-[#222526]">
        Failed to load certificates
      </p>
      <p className="text-xs text-[#69737c]">{error.message}</p>
    </div>
  </Card>
);
