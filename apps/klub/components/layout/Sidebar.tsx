"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Film,
  Users,
  User,
  Trophy,
  Award,
  Zap,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/feed", icon: Home, label: "Spolecznosc" },
  { href: "/courses", icon: BookOpen, label: "Kursy" },
  { href: "/reels", icon: Film, label: "Biblioteka Rolek" },
  { href: "/members", icon: Users, label: "Czlonkowie" },
  { href: "/leaderboard", icon: Trophy, label: "Ranking" },
  { href: "/challenges", icon: Zap, label: "Wyzwania" },
  { href: "/badges", icon: Award, label: "Odznaki" },
  { href: "/profile", icon: User, label: "Moj Profil" },
];

interface SidebarProps {
  userRole?: string;
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-brand-secondary border-r border-slate-700">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-slate-700">
        <Link href="/feed" className="text-sm font-bold uppercase tracking-tight text-white">
          IP Klub
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-orange-500/10 text-orange-500"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}

        {userRole === "ADMIN" && (
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              pathname.startsWith("/admin")
                ? "bg-orange-500/10 text-orange-500"
                : "text-slate-400 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            Panel Admina
          </Link>
        )}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-700">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700/50 w-full transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Wyloguj sie
        </button>
      </div>
    </aside>
  );
}
