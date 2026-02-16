"use client";

import { useState } from "react";

export function ApplicationForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "accelerator" }),
      });

      if (!res.ok) throw new Error("Blad zapisu");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="p-8 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
        <p className="text-green-400 font-semibold text-xl">
          Aplikacja wyslana!
        </p>
        <p className="mt-2 text-slate-400">
          Odezwe sie do Ciebie w ciagu 24h, zeby umowic rozmowe kwalifikacyjna.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Imie
        </label>
        <input
          type="text"
          name="name"
          required
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
          Link do Twojego konta IG (jesli masz)
        </label>
        <input
          type="url"
          name="instagram"
          placeholder="https://instagram.com/..."
          className="w-full h-10 px-4 rounded-lg border border-slate-600 bg-brand-primary text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Gdzie jestes teraz?
        </label>
        <select
          name="followers"
          required
          className="w-full h-10 px-4 rounded-lg border border-slate-600 bg-brand-primary text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Wybierz...</option>
          <option value="0-1k">0-1k obserwujacych</option>
          <option value="1-5k">1-5k obserwujacych</option>
          <option value="5-10k">5-10k obserwujacych</option>
          <option value="10k+">10k+ obserwujacych</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Jaki jest Twoj cel na najblizsze 3 miesiace?
        </label>
        <textarea
          name="goal"
          required
          rows={3}
          className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-brand-primary text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Dlaczego chcesz dolaczyc do Acceleratora?
        </label>
        <textarea
          name="why"
          required
          rows={3}
          className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-brand-primary text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full h-12 px-6 font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-lg transition-colors"
      >
        {status === "loading" ? "Wysylam..." : "Wyslij aplikacje"}
      </button>
      {status === "error" && (
        <p className="text-red-400 text-sm text-center">
          Cos poszlo nie tak. Sprobuj ponownie.
        </p>
      )}
    </form>
  );
}
