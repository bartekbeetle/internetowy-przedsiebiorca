import { Instagram } from "lucide-react";

export function AboutSection() {
  return (
    <section className="py-20 bg-brand-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Kim jestem?
          </h2>

          <div className="mt-8 w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto">
            <span className="text-3xl font-bold text-white">B</span>
          </div>

          <div className="mt-8 space-y-4 text-slate-300 text-lg">
            <p>
              Jestem Bartek. Buduje dochodowe konta bez pokazywania twarzy.
            </p>
            <p>
              Nie jestem guru, ktory obiecuje miliony. Jestem praktykiem, ktory
              testuje, sprawdza i dzieli sie tym, co dziala.
            </p>
            <p>
              Moje podejscie? Mniej gadania, wiecej robienia. Konkretne kroki
              zamiast motywacyjnego belkotu.
            </p>
            <p>
              Jesli szukasz kogos, kto powie Ci prawde - nawet jesli jest
              brutalna - to trafiles dobrze.
            </p>
          </div>

          <a
            href="https://instagram.com/internetowy_przedsiebiorca"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors font-medium"
          >
            <Instagram className="h-5 w-5" />
            Zobacz moje tresci
          </a>
        </div>
      </div>
    </section>
  );
}
