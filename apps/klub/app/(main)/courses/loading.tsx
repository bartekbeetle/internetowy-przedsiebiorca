export default function CoursesLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-slate-800 animate-pulse" />
        <div>
          <div className="h-6 w-24 bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-48 bg-slate-800 rounded animate-pulse mt-1" />
        </div>
      </div>

      <div className="h-10 bg-slate-800 rounded-lg animate-pulse mb-3" />
      <div className="h-8 w-96 bg-slate-800 rounded-lg animate-pulse mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-brand-primary border border-slate-700/50 rounded-xl overflow-hidden"
          >
            <div className="h-40 bg-slate-800 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-20 bg-slate-800 rounded-full animate-pulse" />
              <div className="h-5 w-3/4 bg-slate-800 rounded animate-pulse" />
              <div className="h-4 w-full bg-slate-800 rounded animate-pulse" />
              <div className="flex gap-3">
                <div className="h-3 w-16 bg-slate-800 rounded animate-pulse" />
                <div className="h-3 w-16 bg-slate-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
