export default function CourseDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="h-4 w-32 bg-slate-800 rounded animate-pulse mb-6" />

      <div className="rounded-xl border border-slate-700/50 overflow-hidden bg-slate-800/50">
        <div className="p-6 md:p-8 space-y-4">
          <div className="flex gap-2">
            <div className="h-6 w-24 bg-slate-700 rounded-full animate-pulse" />
          </div>
          <div className="h-8 w-2/3 bg-slate-700 rounded animate-pulse" />
          <div className="h-4 w-full bg-slate-700 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-slate-700 rounded animate-pulse" />
          <div className="flex gap-4 mt-4">
            <div className="h-4 w-20 bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-20 bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
      </div>

      <div className="h-11 w-40 bg-slate-800 rounded-lg animate-pulse mt-6 mb-8" />

      <div className="h-6 w-32 bg-slate-800 rounded animate-pulse mb-4" />

      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="border border-slate-700/50 rounded-lg p-4 bg-brand-primary"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-slate-700 animate-pulse" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-48 bg-slate-700 rounded animate-pulse" />
                <div className="h-3 w-20 bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
