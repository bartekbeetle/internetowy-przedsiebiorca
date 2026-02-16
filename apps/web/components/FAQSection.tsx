import { FAQ } from "./FAQ";

const faqItems = [
  {
    question: "Czy naprawde da sie zarabiac bez pokazywania twarzy?",
    answer:
      "Tak. Istnieja setki kont na Instagramie, TikToku i YouTube, ktore generuja przychody bez pokazywania twarzy wlasciciela. Uzywaja animacji, stock footage, screencapture, voiceover i innych technik. Pokaze Ci dokladnie jak to robic.",
  },
  {
    question: "Nie mam zadnego doswiadczenia. Czy to dla mnie?",
    answer:
      "Tak, to jest stworzone wlasnie dla poczatkujacych. Zaczynam od zupelnych podstaw - od pierwszej rolki po strategie wzrostu. Nie potrzebujesz zadnego doswiadczenia z wideo ani social media.",
  },
  {
    question: "Ile czasu dziennie musze poswiecic?",
    answer:
      "Na poczatek wystarczy 30-60 minut dziennie. Z gotowymi szablonami i scenariuszami z Kitu, tworzenie tresci jest znacznie szybsze. Kluczem jest konsekwencja, nie ilosc godzin.",
  },
  {
    question: "Czym rozni sie Faceless Kit od Acceleratora?",
    answer:
      "Faceless Kit to jednorazowy zakup (97 PLN) z gotowymi materialami: szablony, pomysly, kalendarz. Accelerator to osobisty mentoring 1:1 (500 PLN/mies) z cotygodniowymi sesjami, audytem konta i gwarancja wynikow. Kit jest dla samodzielnych, Accelerator dla tych, ktorzy chca szybszych wynikow z indywidualnym wsparciem.",
  },
  {
    question: "Co jesli to nie zadziala?",
    answer:
      "Faceless Kit ma 30-dniowa gwarancje satysfakcji - jesli nie pomoze, zwracam pieniadze bez pytan. Accelerator ma gwarancje 1000 obserwujacych w 30 dni lub zwrot pieniedzy. Zero ryzyka po Twojej stronie.",
  },
  {
    question: "Jakie wyniki moge osiagnac?",
    answer:
      "To zalezy od Twojej konsekwencji i niszy. Realistycznie: 1000 obserwujacych w pierwszym miesiacu jest osiagalne. Pierwsze zarobki (affiliate, sprzedaz produktow cyfrowych) sa mozliwe w ciagu 2-3 miesiecy regularnego dzialania.",
  },
];

export function FAQSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center">
          Czesto zadawane pytania
        </h2>

        <div className="mt-12">
          <FAQ items={faqItems} />
        </div>
      </div>
    </section>
  );
}
