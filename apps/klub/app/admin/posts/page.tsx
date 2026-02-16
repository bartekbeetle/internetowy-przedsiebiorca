import { Pin, Trash2 } from "lucide-react";

const mockPosts = [
  { id: "1", title: "Jak zrobilem 10k wyswietlen", author: "michal_k", type: "WIN", category: "Winy i sukcesy", likesCount: 15, commentsCount: 7, isPinned: false, createdAt: "2025-01-25" },
  { id: "2", title: "Najlepsze darmowe narzedzia", author: "kuba_dev", type: "QUESTION", category: "Edycja i narzedzia", likesCount: 8, commentsCount: 12, isPinned: false, createdAt: "2025-01-24" },
  { id: "3", title: "Witajcie w spolecznosci!", author: "bartek", type: "RESOURCE", category: "Luzne rozmowy", likesCount: 42, commentsCount: 23, isPinned: true, createdAt: "2025-01-20" },
];

export default function AdminPostsPage() {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Posty</h2>

      <div className="bg-brand-secondary border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Tytul</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Autor</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Typ</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Likes</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Data</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {mockPosts.map((post) => (
                <tr key={post.id} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {post.isPinned && <Pin className="h-3 w-3 text-orange-500" />}
                      <span className="text-white">{post.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400">@{post.author}</td>
                  <td className="px-4 py-3 text-slate-400">{post.type}</td>
                  <td className="px-4 py-3 text-slate-400">{post.likesCount}</td>
                  <td className="px-4 py-3 text-slate-400">{post.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="text-slate-500 hover:text-orange-400 transition-colors" title="Przypnij">
                        <Pin className="h-4 w-4" />
                      </button>
                      <button className="text-slate-500 hover:text-red-400 transition-colors" title="Usun">
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
