import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ApplicationForm } from "@/components/ApplicationForm";
import {
  CheckCircle,
  Video,
  Search,
  BookOpen,
  Users,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Faceless Accelerator - Osobisty Mentoring",
  description:
    "Cotygodniowe sesje 1:1, audyt konta, gwarancja 1000 obserwujacych w 30 dni. Max 5 miejsc miesiecznie.",
};

const forWhom = [
  "Masz juz podstawy, ale chcesz szybciej rosnac",
  "Potrzebujesz indywidualnego feedbacku",
  "Chcesz kogos, kto bedzie Cie rozliczal",
  "Jestes gotowy zainwestowac w siebie",
];

const features = [
  {
    icon: Video,
    title: "Cotygodniowe sesje 1:1 (45 min)",
    description:
      "Analiza Twojego konta, strategia na kolejny tydzien, odpowiedzi na wszystkie pytania.",
  },
  {
    icon: Search,
    title: "Pelny audyt konta i strategii",
    description:
      "Szczegolowa analiza co dziala, co nie. Spersonalizowany plan dzialania. Identyfikacja quick wins.",
  },
  {
    icon: BookOpen,
    title: "Priorytetowy dostep do materialow",
    description:
      "Wszystko z Faceless Creator Kit. Ekskluzywne materialy. Nowe zasoby jako pierwszy.",
  },
  {
    icon: Users,
    title: "Grupa mastermind",
    description:
      "Dostep do innych uczestnikow. Wzajemna motywacja i accountability. Networking z dzialajacymi tworcami.",
  },
  {
    icon: ShieldCheck,
    title: "Gwarancja wynikow",
    description:
      "1000 obserwujacych w 30 dni lub zwrot pieniedzy. Zero ryzyka po Twojej stronie.",
  },
];

const processSteps = [
  "Wypelnij formularz aplikacyjny",
  "Umow sie na rozmowe kwalifikacyjna (15 min)",
  "Jesli pasujemy - zaczynamy",
];

export default function AcceleratorPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-20 bg-brand-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold uppercase bg-orange-500 text-white mb-6">
              MAX 5 MIEJSC MIESIECZNIE
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase text-white">
              Faceless Accelerator
            </h1>
            <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
              Osobisty mentoring dla tych, ktorzy chca przyspieszyc wyniki.
            </p>
            <div className="mt-8">
              <p className="text-4xl font-black text-white">
                500 PLN<span className="text-lg font-normal text-slate-400">/miesiac</span>
              </p>
              <p className="text-sm text-slate-400 mt-1">
                minimalny okres: 1 miesiac
              </p>
            </div>
            <a
              href="#aplikuj"
              className="mt-8 inline-flex items-center justify-center h-14 px-10 text-lg font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
            >
              Aplikuj o miejsce
            </a>
          </div>
        </section>

        {/* For whom */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 text-center">
              Dla kogo jest Accelerator?
            </h2>
            <ul className="mt-8 space-y-4 max-w-lg mx-auto">
              {forWhom.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700 text-lg">
                  <CheckCircle className="h-6 w-6 text-orange-500 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-brand-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Co dostajesz
            </h2>
            <div className="space-y-6">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-6 p-6 rounded-lg bg-brand-secondary border border-slate-700"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 text-center">
              Proces aplikacji
            </h2>
            <div className="mt-8 flex flex-col md:flex-row gap-6 justify-center">
              {processSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {i + 1}
                    </span>
                  </div>
                  <span className="text-slate-700">{step}</span>
                  {i < processSteps.length - 1 && (
                    <span className="hidden md:block text-slate-300 mx-2">
                      &rarr;
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section id="aplikuj" className="py-20 bg-brand-primary">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-2">
              Aplikuj o miejsce
            </h2>
            <p className="text-slate-400 text-center mb-8">
              Wypelnij formularz. Odezwe sie w ciagu 24h.
            </p>
            <div className="bg-brand-secondary border border-slate-700 rounded-lg p-8">
              <ApplicationForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
