"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const [error, setError] = useState("");

  // Verify token on mount
  useEffect(() => {
    async function verifyToken() {
      try {
        const res = await fetch(`/api/auth/reset-password/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (res.ok) {
          setValidToken(true);
        } else {
          setValidToken(false);
        }
      } catch {
        setValidToken(false);
      } finally {
        setVerifying(false);
      }
    }

    if (token) {
      verifyToken();
    }
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Hasła się nie zgadzają");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Hasło musi mieć minimum 8 znaków");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Błąd resetowania hasła");
        setLoading(false);
        return;
      }

      // Success - redirect to login
      router.push("/login?reset=success");
    } catch {
      setError("Coś poszło nie tak");
      setLoading(false);
    }
  }

  // Loading state
  if (verifying) {
    return (
      <div className="min-h-screen bg-brand-primary flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400">Weryfikacja linku...</p>
        </div>
      </div>
    );
  }

  // Invalid token
  if (!validToken) {
    return (
      <div className="min-h-screen bg-brand-primary flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-brand-secondary border border-slate-700 rounded-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-white mb-3">
              Link wygasł lub jest nieprawidłowy
            </h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Link do resetowania hasła wygasł lub został już użyty. Wygeneruj nowy link.
            </p>

            <Link
              href="/forgot-password"
              className="inline-block px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
            >
              Wyślij nowy link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Valid token - show reset form
  return (
    <div className="min-h-screen bg-brand-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
            Internetowy Przedsiebiorca
          </h1>
          <p className="mt-2 text-slate-400">Ustaw nowe hasło</p>
        </div>

        <div className="bg-brand-secondary border border-slate-700 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Nowe hasło (min. 8 znaków)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full h-10 px-4 rounded-lg border border-slate-600 bg-brand-primary text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Potwierdź nowe hasło
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full h-10 px-4 rounded-lg border border-slate-600 bg-brand-primary text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="••••••••"
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
              {loading ? "Zapisywanie..." : "Zmień hasło"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
