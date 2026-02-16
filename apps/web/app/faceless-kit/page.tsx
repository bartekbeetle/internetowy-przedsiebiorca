import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FAQ } from "@/components/FAQ";
import {
  CheckCircle,
  ShieldCheck,
  Lightbulb,
  Layout,
  Calendar,
  Sparkles,
  Gift,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Faceless Creator Kit - Wszystko czego potrzebujesz",
  description:
    "100+ pomyslow na rolki, szablony Canva, kalendarz contentowy, prompty AI. Jednorazowo 97 PLN.",
};

const painPoints = [
  "Nie masz pomyslow na tresci",
  "Nie wiesz co publikowac",
  "Kazda rolka zajmuje Ci godziny",
  "Nie masz rezultatow mimo wysilku",
];

const valueStack = [
  {
    icon: Lightbulb,
    title: "100+ pomyslow na rolki bez twarzy",
    description:
      "Kategorie: motywacja, edukacja, lifestyle, kontrowersje. Kazdy pomysl z hookiem i struktura.",
    value: "197 PLN",
  },
  {
    icon: Layout,
    title: "Gotowe szablony Canva",
    description:
      "20 szablonow do rolek. Spojny branding. Edytowalne w darmowym Canva.",
    value: "147 PLN",
  },
  {
    icon: Calendar,
    title: "30-dniowy kalendarz contentowy",
    description:
      "Dokladny plan co publikowac kazdego dnia. Optymalne godziny publikacji. Tematyczne tygodnie.",
    value: "97 PLN",
  },
  {
    icon: Sparkles,
    title: "Prompty AI do generowania scenariuszy",
    description:
      "ChatGPT/Claude prompty do tworzenia tresci. Generuj nieskończenie wiele wariantow. Oszczedz godziny pracy.",
    value: "147 PLN",
  },
  {
    icon: Gift,
    title: "BONUS: Pakiet gotowych rolek z prawami do uzytku",
    description:
      "Gotowe rolki do repostowania. Pelne prawa komercyjne. Od razu do publikacji.",
    value: "297 PLN",
  },
];

const faqItems = [
  {
    question: "Czy moge korzystac z Kitu bezterminowo?",
    answer:
      "Tak, to jednorazowy zakup. Masz dostep do wszystkich materialow na zawsze, wlacznie z przyszlymi aktualizacjami.",
  },
  {
    question: "Czy potrzebuje platnego konta Canva?",
    answer:
      "Nie, szablony dzialaja z darmowa wersja Canva. Nie musisz za nic placic.",
  },
  {
    question: "Jak szybko dostane materialy?",
    answer:
      "Natychmiast po oplacie. Otrzymasz email z linkiem do pobrania wszystkich materialow.",
  },
  {
    question: "Co jesli Kit mi nie pomoze?",
    answer:
      "Masz 30-dniowa gwarancje satysfakcji. Jesli nie bedziesz zadowolony, zwracam pieniadze bez pytan.",
  },
];

export default function FacelessKitPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-20 bg-brand-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold uppercase bg-orange-500 text-white mb-6">
              BESTSELLER
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase text-white">
              Faceless Creator Kit
            </h1>
            <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
              Wszystko czego potrzebujesz, zeby budowac dochodowe konto bez
              pokazywania twarzy.
            </p>
            <div className="mt-8">
              <p className="text-slate-500 line-through text-lg">885 PLN</p>
              <p className="text-5xl font-black text-white mt-1">97 PLN</p>
              <p className="text-sm text-slate-400 mt-1">jednorazowo</p>
            </div>
            <a
              href="#kup"
              className="mt-8 inline-flex items-center justify-center h-14 px-10 text-lg font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
            >
              Kup teraz
            </a>
          </div>
        </section>

        {/* Problem */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 text-center">
              Wiesz, ze mozesz zarabiac na social media. Ale...
            </h2>
            <ul className="mt-8 space-y-4 max-w-lg mx-auto">
              {painPoints.map((point, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-slate-700 text-lg"
                >
                  <span className="text-red-500 text-xl">&#10007;</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Solution */}
        <section className="py-16 bg-brand-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white">
              Faceless Creator Kit to Twoj kompletny system
            </h2>
            <p className="mt-4 text-slate-400 text-lg">
              Nigdy wiecej pustego ekranu. Gotowe scenariusze - kopiuj i
              publikuj.
            </p>
          </div>
        </section>

        {/* Value Stack */}
        <section className="py-16 bg-brand-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Co dostajesz w Kicie
            </h2>
            <div className="space-y-6">
              {valueStack.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-6 p-6 rounded-lg bg-brand-secondary border border-slate-700"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-semibold text-white">
                        {item.title}
                      </h3>
                      <span className="text-sm text-slate-500 whitespace-nowrap">
                        wartosc: {item.value}
                      </span>
                    </div>
                    <p className="mt-1 text-slate-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-12 text-center p-8 rounded-lg border-2 border-orange-500 bg-orange-500/5">
              <p className="text-slate-400">Laczna wartosc:</p>
              <p className="text-2xl text-slate-500 line-through">885 PLN</p>
              <p className="text-lg text-slate-300 mt-2">Twoja cena:</p>
              <p className="text-5xl font-black text-white">97 PLN</p>
              <p className="text-orange-500 font-semibold mt-2">
                Oszczedzasz: 788 PLN (89%)
              </p>
            </div>
          </div>
        </section>

        {/* Guarantee */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ShieldCheck className="h-16 w-16 text-green-600 mx-auto" />
            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              30-dniowa gwarancja satysfakcji
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Jesli Kit Ci nie pomoze - zwracam pieniadze bez pytan. Zero
              ryzyka po Twojej stronie.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">
              Czesto zadawane pytania
            </h2>
            <FAQ items={faqItems} />
          </div>
        </section>

        {/* Final CTA */}
        <section id="kup" className="py-20 bg-brand-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Zacznij budowac swoje konto juz dzis
            </h2>
            <p className="mt-4 text-slate-400">
              Dostep natychmiast po oplacie. 30 dni gwarancji.
            </p>
            <div className="mt-8">
              <p className="text-slate-500 line-through">885 PLN</p>
              <p className="text-4xl font-black text-white mt-1">97 PLN</p>
            </div>
            <button className="mt-6 inline-flex items-center justify-center h-14 px-10 text-lg font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors">
              Kup Faceless Creator Kit - 97 PLN
            </button>
            <p className="mt-4 text-xs text-slate-500">
              Bezpieczna platnosc. Natychmiastowy dostep.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
