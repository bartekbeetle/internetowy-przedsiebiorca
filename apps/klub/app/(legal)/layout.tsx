import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-primary">
      {/* Header */}
      <header className="border-b border-slate-800 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-white">
            KLUB <span className="text-orange-500">IP</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Powrót
          </Link>
        </div>
      </header>

      {/* Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-4 py-8 mt-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <span>
              © {new Date().getFullYear()} Internetowy Przedsiębiorca
            </span>

            <div className="flex items-center gap-6">
              <Link
                href="/terms"
                className="hover:text-slate-300 transition-colors"
              >
                Regulamin
              </Link>
              <Link
                href="/privacy"
                className="hover:text-slate-300 transition-colors"
              >
                Polityka Prywatności
              </Link>
              <a
                href="mailto:kontakt@internetowyprzedsiebiorca.pl"
                className="hover:text-slate-300 transition-colors"
              >
                Kontakt
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
