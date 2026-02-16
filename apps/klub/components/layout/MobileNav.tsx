"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Film, Users, User } from "lucide-react";

const navItems = [
  { href: "/feed", icon: Home, label: "Feed" },
  { href: "/courses", icon: BookOpen, label: "Kursy" },
  { href: "/reels", icon: Film, label: "Rolki" },
  { href: "/members", icon: Users, label: "Ludzie" },
  { href: "/profile", icon: User, label: "Profil" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-brand-secondary border-t border-slate-700">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-2 py-1 text-xs ${
                isActive ? "text-orange-500" : "text-slate-500"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
