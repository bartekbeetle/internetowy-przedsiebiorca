"use client";

import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";

const mockCategories = [
  { id: "1", name: "Pomysly na content", slug: "pomysly-na-content", icon: "💡", color: "#F97316", order: 1, postsCount: 5 },
  { id: "2", name: "Edycja i narzedzia", slug: "edycja-i-narzedzia", icon: "🔧", color: "#3B82F6", order: 2, postsCount: 3 },
  { id: "3", name: "Strategia i wzrost", slug: "strategia-i-wzrost", icon: "📈", color: "#22C55E", order: 3, postsCount: 8 },
  { id: "4", name: "Winy i sukcesy", slug: "winy-i-sukcesy", icon: "🏆", color: "#EAB308", order: 4, postsCount: 12 },
  { id: "5", name: "Pytania i pomoc", slug: "pytania-i-pomoc", icon: "❓", color: "#8B5CF6", order: 5, postsCount: 7 },
  { id: "6", name: "Luzne rozmowy", slug: "luzne-rozmowy", icon: "💬", color: "#EC4899", order: 6, postsCount: 4 },
];

export default function AdminCategoriesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Kategorie</h2>
        <button className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors">
          <Plus className="h-4 w-4" />
          Dodaj kategorie
        </button>
      </div>

      <div className="bg-brand-secondary border border-slate-700 rounded-lg overflow-hidden">
        {mockCategories.map((cat, i) => (
          <div
            key={cat.id}
            className={`flex items-center gap-4 px-4 py-3 ${
              i < mockCategories.length - 1 ? "border-b border-slate-700/50" : ""
            } hover:bg-slate-800/30`}
          >
            <GripVertical className="h-4 w-4 text-slate-600 cursor-grab" />
            <span className="text-xl">{cat.icon}</span>
            <div className="flex-1 min-w-0">
              <span className="font-medium text-white">{cat.name}</span>
              <span className="text-xs text-slate-500 ml-2">/{cat.slug}</span>
            </div>
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: cat.color }}
            />
            <span className="text-xs text-slate-500">{cat.postsCount} postow</span>
            <div className="flex items-center gap-2">
              <button className="text-slate-500 hover:text-white transition-colors">
                <Pencil className="h-4 w-4" />
              </button>
              <button className="text-slate-500 hover:text-red-400 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
