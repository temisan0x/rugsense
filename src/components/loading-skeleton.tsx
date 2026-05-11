'use client'

export function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="col-span-2 rounded-2xl border border-white/5 bg-white/[0.02] p-6 h-48" />
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 h-28" />
        ))}
      </div>
    </div>
  )
}