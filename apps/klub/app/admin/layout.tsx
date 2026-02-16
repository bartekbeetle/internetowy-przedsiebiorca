import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  BookOpen,
  FileText,
  Film,
  Settings,
  ArrowLeft,
} from "lucide-react";

const adminNav = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users", icon: Users, label: "Uzytkownicy" },
  { href: "/admin/categories", icon: FolderOpen, label: "Kategorie" },
  { href: "/admin/courses", icon: BookOpen, label: "Kursy" },
  { href: "/admin/posts", icon: FileText, label: "Posty" },
  { href: "/admin/reels", icon: Film, label: "Rolki" },
  { href: "/admin/settings", icon: Settings, label: "Ustawienia" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;

  if (role !== "ADMIN") {
    redirect("/feed");
  }

  return (
    <div className="min-h-screen bg-brand-primary">
      {/* Admin topbar */}
      <div className="bg-brand-secondary border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/feed"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-bold text-white">Panel Admina</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Admin sidebar */}
          <nav className="hidden md:block w-48 flex-shrink-0 space-y-1">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Admin content */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
