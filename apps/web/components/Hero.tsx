import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-brand-primary pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-primary via-brand-primary to-slate-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black uppercase leading-tight text-white">
            Zarabiaj online.{" "}
            <span className="text-orange-500">Bez pokazywania twarzy.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl">
            Naucze Cie budowac dochodowe konto w social media bez nagrywania
            sie, bez drogiego sprzetu i bez bycia ekspertem od wszystkiego.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/pierwsza-rolka"
              className="inline-flex items-center justify-center h-14 px-8 text-lg font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors gap-2"
            >
              Pobierz darmowy poradnik
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#jak-to-dziala"
              className="inline-flex items-center justify-center h-14 px-8 text-lg font-semibold text-slate-300 border border-slate-600 hover:bg-slate-800 hover:text-white rounded-lg transition-colors gap-2"
            >
              <Play className="h-5 w-5" />
              Zobacz jak to dziala
            </a>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Dolaczylo juz 500+ osob
          </p>
        </div>
      </div>
    </section>
  );
}
