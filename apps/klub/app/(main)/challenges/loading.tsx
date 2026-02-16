export default function ChallengesLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-7 h-7 bg-slate-800 rounded animate-pulse" />
        <div className="h-7 w-32 bg-slate-800 rounded animate-pulse" />
      </div>
      <div className="h-4 w-64 bg-slate-800 rounded animate-pulse mb-6" />
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-24 bg-slate-800 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 bg-slate-700 rounded animate-pulse" />
              <div className="h-5 w-20 bg-slate-700 rounded-full animate-pulse" />
            </div>
            <div className="h-5 w-3/4 bg-slate-700 rounded animate-pulse mb-2" />
            <div className="h-4 w-full bg-slate-700 rounded animate-pulse mb-4" />
            <div className="h-2 w-full bg-slate-700 rounded-full animate-pulse mb-4" />
            <div className="flex justify-between">
              <div className="h-3 w-24 bg-slate-700 rounded animate-pulse" />
              <div className="h-8 w-20 bg-slate-700 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
