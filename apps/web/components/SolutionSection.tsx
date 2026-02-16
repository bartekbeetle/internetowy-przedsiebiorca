import { Target, FileText, Users } from "lucide-react";

const solutions = [
  {
    icon: Target,
    title: "Konkretny plan dzialania",
    description:
      "Zadnego teoretycznego belkotu. Dostajesz dokladne kroki do wykonania dzis.",
  },
  {
    icon: FileText,
    title: "Gotowe materialy",
    description:
      "Szablony, scenariusze, prompty AI. Kopiujesz, wklejasz, publikujesz.",
  },
  {
    icon: Users,
    title: "Spolecznosc praktykow",
    description:
      "Ludzie, ktorzy dzialaja, nie tylko gadaja. Wsparcie i feedback.",
  },
];

export function SolutionSection() {
  return (
    <section className="py-20 bg-brand-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center">
          Co dostajesz?
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="p-8 rounded-lg bg-brand-secondary border border-slate-700"
            >
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <solution.icon className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">
                {solution.title}
              </h3>
              <p className="mt-2 text-slate-400">{solution.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
