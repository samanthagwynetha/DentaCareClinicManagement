"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type SystemPreferences = {
  language: string;
  dateFormat: string;
  currency: string;
  theme: string;
};

const DEFAULT_PREFS: SystemPreferences = {
  language: "English",
  dateFormat: "MM/DD/YYYY",
  currency: "PHP",
  theme: "Light",
};

export default function PreferencesSettings() {
  const [prefs, setPrefs] = useState<SystemPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPrefs() {
      try {
        const data = await apiFetch<SystemPreferences>(
          "/api/account/me/preferences"
        );
        setPrefs({ ...DEFAULT_PREFS, ...data });
      } catch (err) {
        console.error("Failed to load system preferences", err);
        setError("Failed to load system preferences.");
        setPrefs(DEFAULT_PREFS);
      } finally {
        setLoading(false);
      }
    }

    loadPrefs();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!prefs) return;
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const updated = await apiFetch<SystemPreferences>(
        "/api/account/me/preferences",
        {
          method: "PUT",
          body: JSON.stringify(prefs),
        }
      );
      setPrefs(updated);
      setMessage("Preferences saved.");
    } catch (err) {
      console.error("Failed to save preferences", err);
      setError("Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  }

  const current = prefs || DEFAULT_PREFS;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900 mb-1">
          System Preferences
        </h2>
        <p className="text-sm text-gray-500">
          Customize the look and feel of your system.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-6">
        {message && (
          <div className="text-sm text-teal-700 bg-teal-50 border border-teal-100 rounded-lg px-3 py-2">
            {message}
          </div>
        )}
        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Language
            </label>
            <div className="relative">
              <select
                className="w-full appearance-none rounded-lg border border-gray-200 px-3 py-2 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={current.language}
                onChange={(e) => setPrefs({ ...current, language: e.target.value })}
                disabled={loading}
              >
                <option value="English">English</option>
                <option value="Filipino">Filipino</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                ▾
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Date Format
            </label>
            <div className="relative">
              <select
                className="w-full appearance-none rounded-lg border border-gray-200 px-3 py-2 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={current.dateFormat}
                onChange={(e) => setPrefs({ ...current, dateFormat: e.target.value })}
                disabled={loading}
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                ▾
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Currency
            </label>
            <div className="relative">
              <select
                className="w-full appearance-none rounded-lg border border-gray-200 px-3 py-2 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={current.currency}
                onChange={(e) => setPrefs({ ...current, currency: e.target.value })}
                disabled={loading}
              >
                <option value="PHP">₱ PHP</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                ▾
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Theme
            </label>
            <div className="relative">
              <select
                className="w-full appearance-none rounded-lg border border-gray-200 px-3 py-2 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={current.theme}
                onChange={(e) => setPrefs({ ...current, theme: e.target.value })}
                disabled={loading}
              >
                <option value="Light">Light</option>
                <option value="Dark">Dark</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                ▾
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
          <button
            type="submit"
            disabled={saving || !prefs}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg
              className="w-4 h-4"
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
            {saving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </form>
    </div>
  );
}
