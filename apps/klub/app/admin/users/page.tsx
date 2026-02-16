import { Shield, Trash2 } from "lucide-react";
import { db } from "@repo/database";

const roleColors: Record<string, string> = {
  ADMIN: "bg-red-600",
  MODERATOR: "bg-blue-600",
  MEMBER: "bg-slate-600",
};

async function getUsers() {
  const users = await db.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      points: true,
      createdAt: true,
      avatar: true,
      name: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return users;
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Użytkownicy</h2>
        <span className="text-sm text-slate-400">
          Łącznie: {users.length} {users.length === 1 ? "użytkownik" : "użytkowników"}
        </span>
      </div>

      <div className="bg-brand-secondary border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Użytkownik</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Email</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Rola</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Punkty</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Data rejestracji</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="text-white font-medium">@{user.username}</div>
                          {user.name && (
                            <div className="text-xs text-slate-500">{user.name}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${roleColors[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{user.points}</td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString("pl-PL")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="text-slate-500 hover:text-blue-400 transition-colors" title="Zmień rolę">
                          <Shield className="h-4 w-4" />
                        </button>
                        {user.role !== "ADMIN" && (
                          <button className="text-slate-500 hover:text-red-400 transition-colors" title="Usuń">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    Brak użytkowników
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
