export default function PostLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back link skeleton */}
      <div className="h-4 w-28 bg-slate-800 rounded animate-pulse mb-6" />

      {/* Post skeleton */}
      <div className="bg-brand-secondary border border-slate-700 rounded-lg p-6">
        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-700 animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-4 w-28 bg-slate-700 rounded animate-pulse" />
            <div className="h-3 w-20 bg-slate-800 rounded animate-pulse" />
          </div>
        </div>

        {/* Type badge + category */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-5 w-16 bg-slate-700 rounded-full animate-pulse" />
          <div className="h-5 w-24 bg-slate-800 rounded-full animate-pulse" />
        </div>

        {/* Title */}
        <div className="h-7 w-4/5 bg-slate-700 rounded animate-pulse mb-4" />

        {/* Content */}
        <div className="space-y-2 mb-6">
          <div className="h-4 w-full bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-full bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-full bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-slate-800 rounded animate-pulse" />
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 mb-4">
          <div className="h-5 w-14 bg-slate-800 rounded-full animate-pulse" />
          <div className="h-5 w-18 bg-slate-800 rounded-full animate-pulse" />
          <div className="h-5 w-12 bg-slate-800 rounded-full animate-pulse" />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 pt-4 border-t border-slate-700">
          <div className="h-4 w-16 bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-20 bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-16 bg-slate-800 rounded animate-pulse" />
        </div>
      </div>

      {/* Comments section skeleton */}
      <div className="mt-8">
        <div className="h-6 w-32 bg-slate-700 rounded animate-pulse mb-4" />

        {/* Comment form skeleton */}
        <div className="h-20 bg-brand-secondary border border-slate-700 rounded-lg animate-pulse mb-6" />

        {/* Comments skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-brand-secondary border border-slate-700 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-slate-700 animate-pulse" />
                <div className="h-3.5 w-20 bg-slate-700 rounded animate-pulse" />
                <div className="h-3 w-16 bg-slate-800 rounded animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3.5 w-full bg-slate-800 rounded animate-pulse" />
                <div className="h-3.5 w-2/3 bg-slate-800 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
