export default function BadgesLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-7 h-7 bg-slate-800 rounded animate-pulse" />
        <div className="h-7 w-28 bg-slate-800 rounded animate-pulse" />
      </div>
      <div className="h-4 w-40 bg-slate-800 rounded animate-pulse mb-6" />
      <div className="h-2 bg-slate-700 rounded-full mb-6 animate-pulse" />
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-28 bg-slate-800 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-700/30 bg-slate-800/20 p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-700 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-slate-700 rounded animate-pulse" />
                <div className="h-3 w-full bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
