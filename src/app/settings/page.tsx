"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/utils/roleGuard";
import ClinicProfileSettings from "@/components/settings/ClinicProfileSettings";
import AccountSettings from "@/components/settings/AccountSettings";
import NotificationsSettings from "@/components/settings/NotificationsSettings";
import PreferencesSettings from "@/components/settings/PreferencesSettings";

const TABS = [
  { id: "clinic", label: "Clinic Profile" },
  { id: "account", label: "Account" },
  { id: "notifications", label: "Notifications" },
  { id: "preferences", label: "Preferences" },
] as const;

export default function SettingsPage() {
  useRoleGuard(["admin", "dentist", "receptionist"]);

  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("clinic");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <div className="flex items-center text-xs text-gray-400 gap-1 mb-1">
                <span>Home</span>
                <span>/</span>
                <span>Settings</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-500">
                Manage your clinic and account preferences
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 border-b border-gray-100">
            <div className="flex gap-4">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                      isActive
                        ? "border-teal-500 text-teal-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {activeTab === "clinic" && <ClinicProfileSettings />}

          {activeTab === "account" && <AccountSettings />}

          {activeTab === "notifications" && <NotificationsSettings />}

          {activeTab === "preferences" && <PreferencesSettings />}
        </div>
      </div>
    </div>
  );
}
