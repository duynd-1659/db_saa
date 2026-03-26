function Shimmer({ className }: { className?: string }): React.ReactElement {
  return <div className={`animate-pulse rounded bg-white/10 ${className ?? ''}`} />;
}

export function FeedCardSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col gap-4 rounded-lg p-5">
      <div className="flex items-center gap-3">
        <Shimmer className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-1">
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-3 w-16" />
        </div>
        <Shimmer className="mx-2 h-4 w-4" />
        <Shimmer className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-1">
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-3 w-16" />
        </div>
      </div>
      <Shimmer className="h-3 w-16" />
      <Shimmer className="h-16 w-full" />
      <div className="flex gap-2">
        <Shimmer className="h-6 w-20 rounded-full" />
        <Shimmer className="h-6 w-16 rounded-full" />
      </div>
      <Shimmer className="h-8 w-20" />
    </div>
  );
}

export function FeedSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col gap-6">
      {[1, 2, 3].map((i) => (
        <FeedCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HighlightSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col gap-4 rounded-lg p-5">
      <div className="flex items-center gap-3">
        <Shimmer className="h-10 w-10 rounded-full" />
        <Shimmer className="h-4 w-32" />
      </div>
      <Shimmer className="h-20 w-full" />
      <Shimmer className="h-6 w-24" />
    </div>
  );
}

export function SidebarStatsSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between">
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-6 w-12" />
        </div>
      ))}
    </div>
  );
}

export function SpotlightSkeleton(): React.ReactElement {
  return <Shimmer className="h-[688px] w-full rounded-lg" />;
}
