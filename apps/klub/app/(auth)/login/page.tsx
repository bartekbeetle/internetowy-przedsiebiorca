"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for success messages from URL params
    if (searchParams.get("reset") === "success") {
      setSuccess("Hasło zostało zmienione! Możesz się teraz zalogować.");
    } else if (searchParams.get("registered") === "true") {
      setSuccess("Konto zostało utworzone! Sprawdź email i zweryfikuj konto.");
    } else if (searchParams.get("verified") === "true") {
      setSuccess("Email zweryfikowany! Możesz się teraz zalogować.");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    if (result?.error) {
      setError("Nieprawidlowy email lub haslo");
      setLoading(false);
    } else {
      router.push("/feed");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-brand-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
            Internetowy Przedsiebiorca
          </h1>
          <p className="mt-2 text-slate-400">Zaloguj sie do spolecznosci</p>
        </div>

        <div className="bg-brand-secondary border border-slate-700 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-300">
                  Haslo
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-orange-500 hover:text-orange-400"
                >
                  Zapomniałeś hasła?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                required
                className="w-full h-10 px-4 rounded-lg border border-slate-600 bg-brand-primary text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {success && (
              <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg">
                <p className="text-green-400 text-sm text-center">{success}</p>
              </div>
            )}

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 px-6 font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-lg transition-colors"
            >
              {loading ? "Logowanie..." : "Zaloguj sie"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Nie masz konta?{" "}
            <Link
              href="/register"
              className="text-orange-500 hover:text-orange-400"
            >
              Zarejestruj sie
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400">Ładowanie...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
