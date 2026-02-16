import Link from "next/link";
import { Users, BookOpen, Film, Trophy, ArrowRight } from "lucide-react";

export default function KlubLandingPage() {
  return (
    <div className="min-h-screen bg-brand-primary flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-lg font-bold text-white">
            KLUB <span className="text-orange-500">IP</span>
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Zaloguj sie
            </Link>
            <Link
              href="/register"
              className="h-9 px-4 inline-flex items-center text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
            >
              Dolacz za darmo
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Spolecznosc tworcow{" "}
            <span className="text-orange-500">faceless content</span>
          </h1>
          <p className="text-lg text-slate-400 mb-8 max-w-lg mx-auto">
            Dolacz do grupy ambitnych tworcow, ktorzy tworza content bez
            pokazywania twarzy. Kursy, dyskusje, biblioteka rolek i wiecej.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="h-11 px-8 inline-flex items-center gap-2 text-base font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
            >
              Dolacz za darmo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="h-11 px-8 inline-flex items-center text-base font-medium text-slate-300 border border-slate-600 hover:border-slate-500 rounded-lg transition-colors"
            >
              Mam juz konto
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-800 px-4 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Spolecznosc</h3>
            <p className="text-xs text-slate-500">
              Dyskusje, pytania, dzielenie sie wynikami z innymi tworcami
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Kursy</h3>
            <p className="text-xs text-slate-500">
              Od podstaw po zaawansowane strategie wzrostu
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mx-auto mb-3">
              <Film className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Biblioteka rolek</h3>
            <p className="text-xs text-slate-500">
              Inspiracje, skrypty i przyklady z roznych nisz
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mx-auto mb-3">
              <Trophy className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Gamifikacja</h3>
            <p className="text-xs text-slate-500">
              Zdobywaj punkty, awansuj i rywalizuj w rankingach
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-4 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-slate-600">
          <span>&copy; {new Date().getFullYear()} Internetowy Przedsiebiorca</span>
          <a
            href="https://internetowyprzedsiebiorca.pl"
            className="hover:text-slate-400 transition-colors"
          >
            internetowyprzedsiebiorca.pl
          </a>
        </div>
      </footer>
    </div>
  );
}
