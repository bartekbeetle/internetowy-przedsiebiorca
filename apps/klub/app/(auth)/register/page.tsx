"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!acceptedTerms) {
      setError("Musisz zaakceptowac Regulamin i Polityke Prywatnosci");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Hasla sie nie zgadzaja");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password,
          username: formData.get("username"),
          name: formData.get("name"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Blad rejestracji");
        setLoading(false);
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("Cos poszlo nie tak");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
            Internetowy Przedsiebiorca
          </h1>
          <p className="mt-2 text-slate-400">Dolacz do spolecznosci</p>
        </div>

        <div className="bg-brand-secondary border border-slate-700 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                required
                minLength={3}
                maxLength={20}
                pattern="^[a-zA-Z0-9_]+$"
                className="w-full h-10 px-4 rounded-lg border border-slate-600 bg-brand-primary text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="np. jan_kowalski"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Imie (opcjonalne)
              </label>
              <input
                type="text"
                name="name"
                className="w-full h-10 px-4 rounded-lg border border-slate-600 bg-brand-primary text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full h-10 px-4 rounded-lg border border-slate-600 bg-brand-primary text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Haslo (min. 8 znakow)
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={8}
                className="w-full h-10 px-4 rounded-lg border border-slate-600 bg-brand-primary text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Powtorz haslo
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                minLength={8}
                className="w-full h-10 px-4 rounded-lg border border-slate-600 bg-brand-primary text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-600 bg-brand-primary text-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="acceptTerms" className="text-sm text-slate-400 leading-relaxed cursor-pointer">
                Akceptuję{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  Regulamin
                </Link>{" "}
                oraz{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  Politykę Prywatności
                </Link>
              </label>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !acceptedTerms}
              className="w-full h-10 px-6 font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {loading ? "Rejestracja..." : "Zarejestruj sie"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Masz juz konto?{" "}
            <Link
              href="/login"
              className="text-orange-500 hover:text-orange-400"
            >
              Zaloguj sie
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
