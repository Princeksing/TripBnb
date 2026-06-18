import React from 'react'

function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-brand-border/60 rounded-xl ${className}`} />
  )
}

export function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="w-full aspect-[4/3] rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-5 w-1/3" />
    </div>
  )
}

export function PropertyGridSkeleton({ count = 8 }) {
  return (
    <div className="property-grid">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default Skeleton
