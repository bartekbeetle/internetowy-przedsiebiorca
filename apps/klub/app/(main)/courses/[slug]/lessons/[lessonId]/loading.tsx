export default function LessonLoading() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar skeleton (desktop only) */}
      <div className="hidden lg:block w-72 flex-shrink-0 bg-brand-primary border-r border-slate-700/50">
        <div className="p-4 border-b border-slate-700/50 space-y-2">
          <div className="h-3 w-24 bg-slate-700 rounded animate-pulse" />
          <div className="h-5 w-48 bg-slate-700 rounded animate-pulse" />
          <div className="h-3 w-20 bg-slate-700 rounded animate-pulse" />
        </div>
        <div className="p-2 space-y-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 bg-slate-800 rounded animate-pulse" />
          ))}
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex-1 min-w-0">
        <div className="max-w-4xl mx-auto px-4 py-6 lg:px-8">
          <div className="h-3 w-40 bg-slate-800 rounded animate-pulse mb-4" />
          <div className="h-7 w-2/3 bg-slate-800 rounded animate-pulse mb-6" />

          {/* Video skeleton */}
          <div className="w-full aspect-video bg-slate-800 rounded-lg animate-pulse mb-8" />

          {/* Content skeleton */}
          <div className="space-y-3 mb-8">
            <div className="h-4 w-full bg-slate-800 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-slate-800 rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-slate-800 rounded animate-pulse" />
            <div className="h-4 w-full bg-slate-800 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-slate-800 rounded animate-pulse" />
          </div>

          {/* Button skeleton */}
          <div className="flex justify-center mb-8">
            <div className="h-11 w-52 bg-slate-800 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
