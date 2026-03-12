"use client";
import { useState } from "react";
import { Appointment } from "./types";
import { apiFetch } from "@/lib/api";
import AppointmentModal from "./AppointmentModal";
import ConfirmDialog from "@/components/ConfirmDialog";

type Props = {
  appointments: Appointment[];
  loading: boolean;
  onDeleted: () => void;
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

export default function AppointmentList({ appointments, loading, onDeleted }: Props) {
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await apiFetch(`/api/appointments/${deletingId}`, { method: "DELETE" });
      onDeleted();
    } catch {
      alert("Failed to delete appointment.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-3 text-gray-400 font-medium w-12">#</th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Patient</th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Dentist</th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Date</th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Time</th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Status</th>
              <th className="text-right px-6 py-3 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-400">Loading...</td>
              </tr>
            ) : appointments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-400">No appointments found.</td>
              </tr>
            ) : (
              appointments.map((appt, idx) => (
                <tr key={appt._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-teal-500 font-medium">{idx + 1}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {appt.patient.firstName} {appt.patient.lastName}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{appt.dentist}</td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(appt.date)}</td>
                  <td className="px-6 py-4 text-gray-500">{appt.time}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full border ${
                      appt.status === "Scheduled"
                        ? "text-teal-600 border-teal-300 bg-teal-50"
                        : appt.status === "Completed"
                        ? "text-blue-600 border-blue-300 bg-blue-50"
                        : "text-red-500 border-red-300 bg-red-50"
                    }`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setEditingAppt(appt)}
                        className="text-teal-500 hover:text-teal-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeletingId(appt._id)}
                        className="text-red-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

      {editingAppt && (
        <AppointmentModal
          appointment={editingAppt}
          onClose={() => setEditingAppt(null)}
          onCreated={() => { setEditingAppt(null); onDeleted(); }}
        />
      )}
      <ConfirmDialog
        isOpen={!!deletingId}
        title="Delete Appointment"
        message="Are you sure you want to delete this appointment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </>
  );
}
