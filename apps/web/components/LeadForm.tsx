"use client";

import { useState } from "react";

export function LeadForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Blad zapisu");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="p-6 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
        <p className="text-green-400 font-semibold text-lg">
          Sprawdz swoją skrzynke!
        </p>
        <p className="mt-2 text-slate-400 text-sm">
          Poradnik zostal wyslany na Twoj adres email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Twoj adres email"
          required
          className="w-full h-12 px-4 rounded-lg border border-slate-600 bg-brand-primary text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full h-12 px-6 font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-lg transition-colors"
      >
        {status === "loading" ? "Wysylam..." : "Wyslij mi poradnik"}
      </button>
      {status === "error" && (
        <p className="text-red-400 text-sm text-center">
          Cos poszlo nie tak. Sprobuj ponownie.
        </p>
      )}
      <p className="text-xs text-slate-500 text-center">
        Zero spamu. Mozesz wypisac sie w kazdej chwili.
      </p>
    </form>
  );
}
