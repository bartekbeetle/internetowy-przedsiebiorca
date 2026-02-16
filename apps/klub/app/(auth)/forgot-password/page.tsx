"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Błąd wysyłania emaila");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Coś poszło nie tak");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-brand-primary flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-brand-secondary border border-slate-700 rounded-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-white mb-3">
              Email wysłany!
            </h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Jeśli konto z podanym adresem email istnieje, wysłaliśmy link do resetowania hasła.
              Sprawdź swoją skrzynkę pocztową.
            </p>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Wróć do logowania
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
            Internetowy Przedsiebiorca
          </h1>
          <p className="mt-2 text-slate-400">Resetuj hasło</p>
        </div>

        <div className="bg-brand-secondary border border-slate-700 rounded-lg p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-2">
              Zapomniałeś hasła?
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Podaj adres email powiązany z Twoim kontem, a wyślemy Ci link do resetowania hasła.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-10 px-4 rounded-lg border border-slate-600 bg-brand-primary text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="twoj@email.pl"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 px-6 font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {loading ? "Wysyłanie..." : "Wyślij link resetujący"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Wróć do logowania
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
