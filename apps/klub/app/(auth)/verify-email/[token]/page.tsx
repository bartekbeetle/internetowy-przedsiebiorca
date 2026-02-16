"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function verifyEmail() {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setSuccess(true);
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push("/login?verified=true");
          }, 3000);
        } else {
          setError(data.error || "Weryfikacja nie powiodła się");
        }
      } catch {
        setError("Coś poszło nie tak");
      } finally {
        setVerifying(false);
      }
    }

    if (token) {
      verifyEmail();
    }
  }, [token, router]);

  // Verifying state
  if (verifying) {
    return (
      <div className="min-h-screen bg-brand-primary flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <Loader2 className="w-16 h-16 text-orange-500 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Weryfikacja emaila...
          </h2>
          <p className="text-slate-400 text-sm">
            Proszę czekać, trwa weryfikacja Twojego konta.
          </p>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-brand-primary flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-brand-secondary border border-slate-700 rounded-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">
              Email zweryfikowany! 🎉
            </h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Twój email został pomyślnie zweryfikowany. Za chwilę zostaniesz przekierowany do logowania.
            </p>

            <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 animate-progress"></div>
            </div>

            <Link
              href="/login"
              className="inline-block mt-6 text-sm text-orange-500 hover:text-orange-400"
            >
              Przejdź do logowania teraz →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen bg-brand-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-brand-secondary border border-slate-700 rounded-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>

          <h2 className="text-xl font-bold text-white mb-3">
            Weryfikacja nie powiodła się
          </h2>
          <p className="text-slate-400 mb-6 leading-relaxed">
            {error || "Link weryfikacyjny wygasł lub jest nieprawidłowy."}
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="inline-block px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
            >
              Przejdź do logowania
            </Link>
            <p className="text-xs text-slate-500">
              Nie otrzymałeś emaila? Skontaktuj się z supportem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
