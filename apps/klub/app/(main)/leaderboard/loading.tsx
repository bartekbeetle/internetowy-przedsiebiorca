export default function LeaderboardLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-7 h-7 bg-slate-800 rounded animate-pulse" />
        <div className="h-7 w-32 bg-slate-800 rounded animate-pulse" />
      </div>
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-10 w-28 bg-slate-800 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="bg-brand-secondary border border-slate-700 rounded-lg overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-slate-700">
            <div className="w-8 h-6 bg-slate-700 rounded animate-pulse" />
            <div className="w-10 h-10 rounded-full bg-slate-700 animate-pulse" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-32 bg-slate-700 rounded animate-pulse" />
              <div className="h-3 w-20 bg-slate-700 rounded animate-pulse" />
            </div>
            <div className="h-6 w-16 bg-slate-700 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
