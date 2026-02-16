export default function FeedLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="h-7 w-40 bg-slate-700 rounded animate-pulse" />
              <div className="h-4 w-28 bg-slate-800 rounded animate-pulse mt-2" />
            </div>
            <div className="h-10 w-28 bg-slate-700 rounded-lg animate-pulse" />
          </div>

          {/* Category filter skeleton */}
          <div className="flex gap-2 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-8 rounded-full bg-slate-700 animate-pulse"
                style={{ width: `${60 + i * 20}px` }}
              />
            ))}
          </div>

          {/* Sort tabs skeleton */}
          <div className="flex gap-2 mb-6">
            <div className="h-8 w-24 bg-slate-700 rounded-lg animate-pulse" />
            <div className="h-8 w-24 bg-slate-800 rounded-lg animate-pulse" />
          </div>

          {/* Post cards skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-brand-secondary border border-slate-700 rounded-lg p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-slate-700 animate-pulse" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-24 bg-slate-700 rounded animate-pulse" />
                    <div className="h-3 w-16 bg-slate-800 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-5 w-3/4 bg-slate-700 rounded animate-pulse mb-2" />
                <div className="space-y-1.5 mb-4">
                  <div className="h-3.5 w-full bg-slate-800 rounded animate-pulse" />
                  <div className="h-3.5 w-5/6 bg-slate-800 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-4 w-12 bg-slate-800 rounded animate-pulse" />
                  <div className="h-4 w-12 bg-slate-800 rounded animate-pulse" />
                  <div className="h-4 w-12 bg-slate-800 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar skeleton - desktop only */}
        <aside className="hidden lg:block w-72 flex-shrink-0 space-y-6">
          <div className="bg-brand-secondary border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 animate-pulse" />
              <div className="space-y-1.5">
                <div className="h-4 w-20 bg-slate-700 rounded animate-pulse" />
                <div className="h-3 w-10 bg-slate-800 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-12 bg-slate-800 rounded-lg animate-pulse" />
          </div>
          <div className="bg-brand-secondary border border-slate-700 rounded-lg p-4">
            <div className="h-4 w-16 bg-slate-700 rounded animate-pulse mb-3" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-700 animate-pulse" />
                  <div className="h-3.5 flex-1 bg-slate-800 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
