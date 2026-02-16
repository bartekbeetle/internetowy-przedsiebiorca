import { TestimonialCard } from "./TestimonialCard";

const testimonials = [
  {
    name: "Michal",
    quote:
      "Dzieki Bartkowi w 2 tygodnie zrobilem 10k wyswietlen bez pokazywania twarzy.",
    result: "10k wyswietlen w 2 tygodnie",
  },
  {
    name: "Kuba",
    quote:
      "Konkretna wiedza bez bullshitu. Nareszcie ktos mowi jak jest.",
    result: "Pierwszy zarobek w 3 tygodnie",
  },
  {
    name: "Tomek",
    quote:
      "Scenariusze z Kitu sa zlotem. Kopiuje, publikuje, dziala.",
    result: "5k obserwujacych w miesiac",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center">
          Co mowia czlonkowie spolecznosci
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
