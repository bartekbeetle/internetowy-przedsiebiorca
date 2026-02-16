import { Film, Bookmark } from "lucide-react";
import { db } from "@repo/database";

const categoryLabels: Record<string, { label: string; color: string }> = {
  HOOK: { label: "Hook", color: "bg-red-600" },
  EDUCATIONAL: { label: "Edukacyjna", color: "bg-blue-600" },
  STORYTELLING: { label: "Storytelling", color: "bg-purple-600" },
  CONTROVERSIAL: { label: "Kontrowersyjna", color: "bg-yellow-600" },
  VIRAL: { label: "Viral", color: "bg-green-600" },
  TRENDING: { label: "Trending", color: "bg-pink-600" },
};

async function getReels() {
  const reels = await db.reelInspiration.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return reels;
}

export default async function ReelsPage() {
  const reels = await getReels();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Biblioteka Rolek</h1>
          <p className="text-sm text-slate-400 mt-1">
            Inspiracje i gotowe scenariusze do wykorzystania
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button className="px-4 py-2 rounded-lg text-sm font-medium bg-orange-500 text-white">
          Wszystkie
        </button>
        {Object.entries(categoryLabels).map(([key, { label }]) => (
          <button
            key={key}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-brand-secondary text-slate-300 border border-slate-700 hover:border-slate-500 transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {reels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reels.map((reel) => {
            const cat = categoryLabels[reel.category] || categoryLabels.HOOK;
            return (
              <div
                key={reel.id}
                className="bg-brand-secondary border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition-colors"
              >
                {/* Thumbnail */}
                {reel.thumbnailUrl ? (
                  <div className="h-32 relative">
                    <img
                      src={reel.thumbnailUrl}
                      alt={reel.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-32 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                    <Film className="h-8 w-8 text-slate-600" />
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${cat.color}`}>
                      {cat.label}
                    </span>
                    <span className="text-xs text-slate-500">{reel.niche}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white">{reel.title}</h3>
                  {reel.description && (
                    <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                      {reel.description}
                    </p>
                  )}

                  {reel.script && (
                    <div className="mt-3 p-2 rounded bg-slate-800/50 border border-slate-700">
                      <p className="text-xs text-slate-500 mb-1 font-medium">Scenariusz:</p>
                      <p className="text-xs text-slate-400 line-clamp-2">{reel.script}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>❤ {reel.likesCount}</span>
                      <span>🔖 {reel.savesCount}</span>
                    </div>
                    <button className="text-slate-400 hover:text-orange-500 transition-colors">
                      <Bookmark className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
            <Film className="h-8 w-8 text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Brak rolek w bibliotece
          </h3>
          <p className="text-slate-400 text-sm">
            Wkrótce dodamy inspirujące rolki i scenariusze
          </p>
        </div>
      )}
    </div>
  );
}
