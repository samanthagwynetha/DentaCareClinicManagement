"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { getRole } from "@/utils/auth";

export type ClinicSettings = {
  clinicName: string;
  logoBase64?: string;
  phone: string;
  email: string;
  address: string;
  openingTime: string;
  closingTime: string;
};

const DEFAULT_SETTINGS: ClinicSettings = {
  clinicName: "DentaCare Dental Clinic",
  logoBase64: "",
  phone: "+63 912 345 6789",
  email: "info@dentacare.com",
  address: "123 Smile Ave, Manila",
  openingTime: "08:00 AM",
  closingTime: "05:00 PM",
};

export default function ClinicProfileSettings() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [form, setForm] = useState<ClinicSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const role = getRole();
    if (role) {
      setIsAdmin(role === "admin");
    }

    async function loadSettings() {
      try {
        const data: ClinicSettings = await apiFetch("/api/settings/clinic");
        if (data && Object.keys(data).length > 0) {

          setForm({
            clinicName: data.clinicName || DEFAULT_SETTINGS.clinicName,
            logoBase64: data.logoBase64 || DEFAULT_SETTINGS.logoBase64,
            phone: data.phone || DEFAULT_SETTINGS.phone,
            email: data.email || DEFAULT_SETTINGS.email,
            address: data.address || DEFAULT_SETTINGS.address,
            openingTime: data.openingTime || DEFAULT_SETTINGS.openingTime,
            closingTime: data.closingTime || DEFAULT_SETTINGS.closingTime,
          });
        }
      } catch (err) {
        console.error("Failed to load clinic settings", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  function handleChange<K extends keyof ClinicSettings>(field: K, value: ClinicSettings[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === "string") {
        setForm((prev) => ({ ...prev, logoBase64: event.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch("/api/settings/clinic", {
        method: "PUT",
        body: JSON.stringify(form)
      });
      console.log("Saving clinic settings", form);
    } catch (err) {
      console.error("Failed to save clinic settings", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Clinic Information</h2>
        <p className="text-sm text-gray-500">
          Update your clinic's basic details and contact information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Logo upload placeholder */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">Clinic Logo</label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden">
              {form.logoBase64 ? (
                <img src={form.logoBase64} alt="Clinic Logo" className="w-full h-full object-cover" />
              ) : (
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 15l3-3 2 2 3-3 2 2"
                  />
                </svg>
              )}
            </div>
            <div>
              <input
                type="file"
                id="logoUpload"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                className="hidden"
                onChange={handleLogoUpload}
                disabled={!isAdmin}
              />
              <label
                htmlFor={isAdmin ? "logoUpload" : undefined}
                className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium ${isAdmin
                  ? "text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                  : "text-gray-400 bg-gray-50 cursor-not-allowed"
                  }`}
              >
                Upload Logo
              </label>
              <p className="mt-1 text-xs text-gray-400">PNG, JPG up to 2MB</p>
            </div>
          </div>
        </div>

        {/* Clinic name / email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              value={form.clinicName}
              onChange={(e) => handleChange("clinicName", e.target.value)}
              disabled={!isAdmin}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={!isAdmin}
            />
          </div>
        </div>

        {/* Phone / address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              disabled={!isAdmin}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              disabled={!isAdmin}
            />
          </div>
        </div>

        {/* Operating hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Operating Hours</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Opening Time</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                value={form.openingTime}
                onChange={(e) => handleChange("openingTime", e.target.value)}
                disabled={!isAdmin}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Closing Time</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                value={form.closingTime}
                onChange={(e) => handleChange("closingTime", e.target.value)}
                disabled={!isAdmin}
              />
            </div>
          </div>
        </div>

        {isAdmin ? (
          <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        ) : (
          <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
            <p className="text-sm text-gray-500 italic">Only administrators can edit the clinic profile.</p>
          </div>
        )}
      </form>
    </div>
  );
}
