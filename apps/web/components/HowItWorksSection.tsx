import { Download, Users, Package, Rocket } from "lucide-react";

const steps = [
  {
    icon: Download,
    step: "01",
    title: "Pobierz darmowy poradnik",
    description:
      '"Pierwsza Rolka w 24h" - nauczysz sie podstaw tworzenia tresci bez twarzy.',
  },
  {
    icon: Users,
    step: "02",
    title: "Dolacz do spolecznosci",
    description:
      "Bezplatny dostep do grupy, dyskusji i wsparcia od innych tworcow.",
  },
  {
    icon: Package,
    step: "03",
    title: "Wez Faceless Creator Kit",
    description:
      "100+ pomyslow, szablony, kalendarz contentowy. Wszystko za 97 PLN.",
  },
  {
    icon: Rocket,
    step: "04",
    title: "Dolacz do Acceleratora",
    description:
      "Osobisty mentoring i gwarancja wynikow. 500 PLN/mies, max 5 osob.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="jak-to-dziala" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center">
          Twoja droga do pierwszych zarobkow
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-6xl font-black text-orange-500/20">
                {step.step}
              </div>
              <div className="mt-2">
                <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
                  <step.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-slate-600 text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
