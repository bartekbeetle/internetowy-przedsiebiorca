import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-primary px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-orange-500 mb-4">404</h1>
        <h2 className="text-xl font-bold text-white mb-2">
          Strona nie znaleziona
        </h2>
        <p className="text-slate-400 mb-8 max-w-md">
          Strona, ktorej szukasz nie istnieje lub zostala przeniesiona.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/feed"
            className="h-10 px-6 inline-flex items-center font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
          >
            Przejdz do feedu
          </Link>
          <Link
            href="/"
            className="h-10 px-4 inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors"
          >
            Strona glowna
          </Link>
        </div>
      </div>
    </div>
  );
}
