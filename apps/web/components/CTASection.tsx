import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 bg-brand-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
          Przestan scrollowac.{" "}
          <span className="text-orange-500">Zacznij dzialac.</span>
        </h2>
        <p className="mt-4 text-lg text-slate-400">
          Pobierz darmowy poradnik i stworz pierwsza rolke w 24 godziny.
        </p>
        <Link
          href="/pierwsza-rolka"
          className="mt-8 inline-flex items-center justify-center h-14 px-10 text-lg font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors gap-2"
        >
          Pobierz za darmo
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
