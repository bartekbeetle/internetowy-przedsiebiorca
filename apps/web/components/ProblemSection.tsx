import { EyeOff, ShieldAlert, UserX, Clock } from "lucide-react";

const problems = [
  {
    icon: EyeOff,
    text: "Chcesz zarabiac online, ale nie chcesz pokazywac twarzy",
  },
  {
    icon: ShieldAlert,
    text: "Masz pomysly, ale boisz sie oceny innych",
  },
  {
    icon: UserX,
    text: "Sluchasz guru, ktorzy obiecuja miliony, ale nic nie dziala",
  },
  {
    icon: Clock,
    text: "Odwlekasz start, bo czujesz, ze nie jestes gotowy",
  },
];

export function ProblemSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center">
          Czy to brzmi znajomo?
        </h2>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 rounded-lg bg-white border border-slate-200"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <problem.icon className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-slate-700 font-medium">{problem.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-slate-600 text-lg max-w-2xl mx-auto">
          Bylem dokladnie w tym samym miejscu. Teraz pokaze Ci, jak z tego
          wyjsc.
        </p>
      </div>
    </section>
  );
}
