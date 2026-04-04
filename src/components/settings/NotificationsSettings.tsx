"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type NotificationPrefs = {
  emailNotifications: boolean;
  smsReminders: boolean;
  appointmentAlerts: boolean;
  billingAlerts: boolean;
  systemUpdates: boolean;
};

const ROWS: {
  key: keyof NotificationPrefs;
  title: string;
  description: string;
}[] = [
  {
    key: "emailNotifications",
    title: "Email Notifications",
    description: "Receive updates and alerts via email",
  },
  {
    key: "smsReminders",
    title: "SMS Reminders",
    description: "Send appointment reminders to patients via SMS",
  },
  {
    key: "appointmentAlerts",
    title: "Appointment Alerts",
    description: "Get notified about new, rescheduled, or cancelled appointments",
  },
  {
    key: "billingAlerts",
    title: "Billing Alerts",
    description: "Receive alerts for pending and overdue invoices",
  },
  {
    key: "systemUpdates",
    title: "System Updates",
    description: "Be notified about system maintenance and updates",
  },
];

export default function NotificationsSettings() {
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPrefs() {
      try {
        const data = await apiFetch<NotificationPrefs>(
          "/api/account/me/notifications"
        );
        setPrefs(data);
      } catch (err) {
        console.error("Failed to load notification preferences", err);
        setError("Failed to load notification preferences.");
      } finally {
        setLoading(false);
      }
    }

    loadPrefs();
  }, []);

  function toggle(key: keyof NotificationPrefs) {
    setPrefs((prev) => (prev ? { ...prev, [key]: !prev[key] } : prev));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!prefs) return;
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const updated = await apiFetch<NotificationPrefs>(
        "/api/account/me/notifications",
        {
          method: "PUT",
          body: JSON.stringify(prefs),
        }
      );
      setPrefs(updated);
      setMessage("Notification preferences saved.");
    } catch (err) {
      console.error("Failed to save notification preferences", err);
      setError("Failed to save notification preferences.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900 mb-1">
          Notification Preferences
        </h2>
        <p className="text-sm text-gray-500">
          Choose which notifications you'd like to receive.
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

        <div className="divide-y divide-gray-100">
          {ROWS.map((row) => (
            <div
              key={row.key}
              className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
            >
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {row.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{row.description}</p>
              </div>

              <button
                type="button"
                onClick={() => toggle(row.key)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                  prefs && prefs[row.key] ? "bg-teal-500" : "bg-gray-200"
                }`}
                disabled={loading}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    prefs && prefs[row.key] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}

          {loading && !prefs && (
            <div className="py-4 text-sm text-gray-400">Loading preferences...</div>
          )}
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
