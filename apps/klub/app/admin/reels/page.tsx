import { Plus, Pencil, Trash2, Film } from "lucide-react";

const mockReels = [
  { id: "1", title: "Hook: 'Nie rob tego na IG'", category: "HOOK", niche: "Social Media", savesCount: 12 },
  { id: "2", title: "Edukacyjna: 5 narzedzi AI", category: "EDUCATIONAL", niche: "Technologia", savesCount: 28 },
  { id: "3", title: "Storytelling: Od 0 do 10k", category: "STORYTELLING", niche: "Motywacja", savesCount: 45 },
  { id: "4", title: "Viral: Kontrowersyjna opinia", category: "CONTROVERSIAL", niche: "Biznes", savesCount: 67 },
  { id: "5", title: "Trending: Dzien z zycia", category: "TRENDING", niche: "Lifestyle", savesCount: 19 },
];

export default function AdminReelsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Biblioteka Rolek</h2>
        <button className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors">
          <Plus className="h-4 w-4" />
          Dodaj rolke
        </button>
      </div>

      <div className="bg-brand-secondary border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Tytul</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Kategoria</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Nisza</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Zapisane</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {mockReels.map((reel) => (
                <tr key={reel.id} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Film className="h-4 w-4 text-slate-600" />
                      <span className="text-white">{reel.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{reel.category}</td>
                  <td className="px-4 py-3 text-slate-400">{reel.niche}</td>
                  <td className="px-4 py-3 text-slate-400">{reel.savesCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="text-slate-500 hover:text-white transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button className="text-slate-500 hover:text-red-400 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
