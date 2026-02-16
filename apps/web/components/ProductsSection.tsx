import { ProductCard } from "./ProductCard";

export function ProductsSection() {
  return (
    <section className="py-20 bg-brand-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center">
          Wybierz swoj poziom
        </h2>
        <p className="mt-4 text-slate-400 text-center max-w-2xl mx-auto">
          Niezaleznie od tego, gdzie jestes - mamy cos dla Ciebie.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <ProductCard
            title="Darmowy Poradnik"
            features={[
              "Stworz pierwsza rolke bez pokazywania twarzy",
              "5 gotowych scenariuszy do skopiowania",
              "Bez doswiadczenia, bez drogiego sprzetu",
            ]}
            price="DARMOWE"
            ctaText="Pobierz za darmo"
            ctaHref="/pierwsza-rolka"
          />

          <ProductCard
            badge="BESTSELLER"
            highlighted
            title="Faceless Creator Kit"
            features={[
              "100+ pomyslow na rolki bez twarzy",
              "Gotowe szablony Canva",
              "30-dniowy kalendarz contentowy",
              "Prompty AI do generowania scenariuszy",
              "BONUS: Pakiet gotowych rolek z prawami do uzytku",
            ]}
            originalPrice="885 PLN"
            price="97 PLN"
            ctaText="Kup teraz za 97 PLN"
            ctaHref="/faceless-kit"
          />

          <ProductCard
            badge="MAX 5 MIEJSC"
            title="Faceless Accelerator"
            features={[
              "Cotygodniowe sesje 1:1",
              "Audyt konta i strategii",
              "Grupa mastermind",
              "Gwarancja: 1000 obserwujacych w 30 dni lub zwrot",
            ]}
            price="500 PLN/miesiac"
            ctaText="Aplikuj o miejsce"
            ctaHref="/accelerator"
          />
        </div>
      </div>
    </section>
  );
}
