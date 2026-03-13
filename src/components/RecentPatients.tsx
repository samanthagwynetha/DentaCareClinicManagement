"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  lastVisit: string | null;
  nextAppointment?: string | null;
};

type RecentPatientsResponse = {
  patients: Patient[];
};

const AVATAR_BG = ["bg-teal-100", "bg-cyan-100", "bg-blue-100", "bg-purple-100"];

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function formatDate(value: string | null | undefined) {
  if (!value) return "No visit yet";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function RecentPatients() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecentPatients() {
      try {
        const data = await apiFetch<RecentPatientsResponse>("/api/dashboard/recent-patients");
        setPatients(data.patients || []);
      } catch (err) {
        console.error("Failed to load recent patients:", err);
      } finally {
        setLoading(false);
      }
    }

    loadRecentPatients();
  }, []);

  const decoratedPatients = useMemo(
    () => patients.map((patient, index) => ({ ...patient, bgColor: AVATAR_BG[index % AVATAR_BG.length] })),
    [patients]
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Patients</h2>
        <button
          className="text-teal-600 text-sm font-medium hover:text-teal-700"
          onClick={() => router.push("/patients")}
        >
          View All
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-4">Latest patient activity</p>

      <div className="space-y-3">
        {!loading && decoratedPatients.length === 0 && (
          <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-400">
            No recent patients found.
          </div>
        )}

        {decoratedPatients.map((patient) => (
          <div 
            key={patient.id} 
            className="group relative bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all cursor-pointer"
            onClick={() => router.push("/patients")}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full ${patient.bgColor} flex items-center justify-center text-sm font-semibold text-gray-700 flex-shrink-0`}
              >
                {getInitials(patient.firstName, patient.lastName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">
                  {patient.firstName} {patient.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  Last visit: {formatDate(patient.lastVisit)}
                </p>
                {patient.nextAppointment && (
                  <p className="text-xs text-gray-900 mt-1">
                    Next appointment: <span className="font-medium">{formatDate(patient.nextAppointment)}</span>
                  </p>
                )}
              </div>
              
              {/* Hover Icons */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                  className="w-9 h-9 bg-teal-50 hover:bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (patient.phone) window.location.href = `tel:${patient.phone}`;
                  }}
                  disabled={!patient.phone}
                  title={patient.phone ? `Call ${patient.phone}` : "No phone number"}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </button>
                <button
                  className="w-9 h-9 bg-teal-50 hover:bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (patient.email) window.location.href = `mailto:${patient.email}`;
                  }}
                  disabled={!patient.email}
                  title={patient.email ? `Email ${patient.email}` : "No email address"}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
