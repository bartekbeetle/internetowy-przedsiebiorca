import Link from "next/link";
import { Instagram } from "lucide-react";

const footerLinks = {
  Produkty: [
    { href: "/pierwsza-rolka", label: "Darmowy Poradnik" },
    { href: "/faceless-kit", label: "Faceless Creator Kit" },
    { href: "/accelerator", label: "Faceless Accelerator" },
  ],
  Zasoby: [
    { href: "/blog", label: "Blog" },
    { href: "https://klub.internetowyprzedsiebiorca.pl", label: "Spolecznosc" },
  ],
  Prawne: [
    { href: "/polityka-prywatnosci", label: "Polityka prywatnosci" },
    { href: "/regulamin", label: "Regulamin" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-brand-primary border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="text-lg font-bold uppercase tracking-tight text-white">
              Internetowy Przedsiebiorca
            </span>
            <p className="mt-3 text-sm text-slate-400">
              Zarabiaj online. Bez pokazywania twarzy. Konkretna wiedza zamiast
              pustych obietnic.
            </p>
            <a
              href="https://instagram.com/internetowy_przedsiebiorca"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm text-slate-400 hover:text-orange-500 transition-colors"
            >
              <Instagram className="h-5 w-5" />
              @internetowy_przedsiebiorca
            </a>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                {category}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-sm text-slate-500 text-center">
            &copy; {new Date().getFullYear()} Internetowy Przedsiebiorca.
            Wszelkie prawa zastrzezone.
          </p>
        </div>
      </div>
    </footer>
  );
}
