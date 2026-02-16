import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LeadForm } from "@/components/LeadForm";
import { CheckCircle, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Pierwsza Rolka w 24 Godziny - Darmowy Poradnik",
  description:
    "Darmowy poradnik dla osob, ktore boja sie zaczac. Bez twarzy. Bez sprzetu. Bez doswiadczenia.",
};

const benefits = [
  "Dokladny plan dzialania na 24 godziny",
  "5 gotowych scenariuszy do skopiowania",
  "Lista darmowych narzedzi (CapCut, Pexels, Pixabay)",
  "Checkliste przed publikacja",
  "BONUS: Dostep do biblioteki inspiracji",
];

const forWhom = [
  "Chcesz zaczac, ale nie wiesz jak",
  "Boisz sie pokazywac twarzy",
  "Masz zero doswiadczenia z wideo",
  "Probowaies juz, ale sie poddales",
];

const notForWhom = [
  'Szukasz magicznego przycisku "zarabiaj miliony"',
  "Nie chcesz pracowac",
  "Oczekujesz wynikow bez dzialania",
];

export default function PierwszaRolkaPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-20 bg-brand-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl font-black uppercase text-white">
                  Pierwsza Rolka w{" "}
                  <span className="text-orange-500">24 Godziny</span>
                </h1>
                <p className="mt-4 text-lg text-slate-300">
                  Darmowy poradnik dla osob, ktore boja sie zaczac. Bez twarzy.
                  Bez sprzetu. Bez doswiadczenia.
                </p>

                <ul className="mt-8 space-y-3">
                  {benefits.map((benefit, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-slate-300"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                <p className="mt-6 text-sm text-slate-500">
                  Pobralo juz 500+ osob
                </p>
              </div>

              <div className="bg-brand-secondary border border-slate-700 rounded-lg p-8">
                <h2 className="text-xl font-bold text-white text-center mb-6">
                  Pobierz darmowy poradnik
                </h2>
                <LeadForm />
              </div>
            </div>
          </div>
        </section>

        {/* For whom */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Dla kogo to jest:
                </h3>
                <ul className="mt-4 space-y-3">
                  {forWhom.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-slate-700"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Dla kogo to NIE jest:
                </h3>
                <ul className="mt-4 space-y-3">
                  {notForWhom.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-slate-700"
                    >
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
