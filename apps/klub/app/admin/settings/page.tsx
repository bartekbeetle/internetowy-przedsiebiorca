"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    // TODO: Save to database
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Ustawienia</h2>

      <div className="bg-brand-secondary border border-slate-700 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Nazwa spolecznosci
            </label>
            <input
              type="text"
              defaultValue="Klub Internetowy Przedsiebiorca"
              className="w-full h-10 px-4 rounded-lg border border-slate-600 bg-brand-primary text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Opis
            </label>
            <textarea
              rows={3}
              defaultValue="Spolecznosc tworcow faceless content w Polsce"
              className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-brand-primary text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Max darmowych uzytkownikow
              </label>
              <input
                type="number"
                defaultValue={100}
                className="w-full h-10 px-4 rounded-lg border border-slate-600 bg-brand-primary text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Cena po przekroczeniu limitu (PLN/mies)
              </label>
              <input
                type="number"
                defaultValue={28}
                className="w-full h-10 px-4 rounded-lg border border-slate-600 bg-brand-primary text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="registrationOpen"
              defaultChecked
              className="h-4 w-4 rounded border-slate-600 bg-brand-primary text-orange-500 focus:ring-orange-500"
            />
            <label htmlFor="registrationOpen" className="text-sm text-slate-300">
              Rejestracja otwarta
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="h-10 px-6 font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-lg transition-colors"
          >
            {saving ? "Zapisywanie..." : "Zapisz ustawienia"}
          </button>
        </form>
      </div>
    </div>
  );
}
