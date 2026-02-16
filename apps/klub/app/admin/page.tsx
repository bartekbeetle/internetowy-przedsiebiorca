import { Users, FileText, BookOpen, Film } from "lucide-react";
import { db } from "@repo/database";

async function getStats() {
  // Get counts
  const [usersCount, postsCount, coursesCount, reelsCount] = await Promise.all([
    db.user.count(),
    db.post.count(),
    db.course.count(),
    db.reelInspiration.count(),
  ]);

  // Get users from last 7 days
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const [newUsersThisWeek, newPostsThisWeek] = await Promise.all([
    db.user.count({
      where: {
        createdAt: {
          gte: lastWeek,
        },
      },
    }),
    db.post.count({
      where: {
        createdAt: {
          gte: lastWeek,
        },
      },
    }),
  ]);

  // Get published courses count
  const publishedCoursesCount = await db.course.count({
    where: { isPublished: true },
  });

  return {
    usersCount,
    postsCount,
    coursesCount,
    reelsCount,
    newUsersThisWeek,
    newPostsThisWeek,
    publishedCoursesCount,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statsCards = [
    {
      label: "Użytkownicy",
      value: stats.usersCount.toString(),
      icon: Users,
      change: stats.newUsersThisWeek > 0
        ? `+${stats.newUsersThisWeek} w tym tygodniu`
        : "Brak nowych w tym tygodniu",
    },
    {
      label: "Posty",
      value: stats.postsCount.toString(),
      icon: FileText,
      change: stats.newPostsThisWeek > 0
        ? `+${stats.newPostsThisWeek} w tym tygodniu`
        : "Brak nowych w tym tygodniu",
    },
    {
      label: "Kursy",
      value: stats.coursesCount.toString(),
      icon: BookOpen,
      change: `${stats.publishedCoursesCount} ${stats.publishedCoursesCount === 1 ? 'opublikowany' : 'opublikowanych'}`,
    },
    {
      label: "Rolki",
      value: stats.reelsCount.toString(),
      icon: Film,
      change: `${stats.reelsCount} w bibliotece`,
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-brand-secondary border border-slate-700 rounded-lg p-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500">{stat.change}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
