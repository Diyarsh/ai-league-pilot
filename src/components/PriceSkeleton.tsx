import { Skeleton } from './ui/skeleton';

interface PriceSkeletonProps {
  variant?: 'default' | 'compact' | 'large';
  showChange?: boolean;
}

export const PriceSkeleton: React.FC<PriceSkeletonProps> = ({ 
  variant = 'default', 
  showChange = false 
}) => {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-12" />
        {showChange && <Skeleton className="h-3 w-8" />}
      </div>
    );
  }

  if (variant === 'large') {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-24" />
        {showChange && <Skeleton className="h-4 w-16" />}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <Skeleton className="h-5 w-16" />
      {showChange && <Skeleton className="h-3 w-12" />}
    </div>
  );
};
