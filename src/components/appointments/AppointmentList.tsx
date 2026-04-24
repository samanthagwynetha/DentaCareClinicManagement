"use client";
import { useState } from "react";
import { Appointment } from "./types";
import { apiFetch } from "@/lib/api";
import AppointmentModal from "./AppointmentModal";
import ConfirmDialog from "@/components/ConfirmDialog";

type Props = {
  appointments: Appointment[];
  loading: boolean;
  role?: string | null;
  onDeleted: () => void;
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

export default function AppointmentList({ appointments, loading, role, onDeleted }: Props) {
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sendingReminderId, setSendingReminderId] = useState<string | null>(null);
  const [reminderMsg, setReminderMsg] = useState<{ id: string; ok: boolean; text: string } | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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

  const sendReminder = async (appt: Appointment) => {
    if (!appt.patient.email) {
      setReminderMsg({ id: appt._id, ok: false, text: "No email on file for this patient." });
      setTimeout(() => setReminderMsg(null), 3500);
      return;
    }
    setSendingReminderId(appt._id);
    try {
      await apiFetch("/api/reminders/send", {
        method: "POST",
        body: JSON.stringify({
          patientName: `${appt.patient.firstName} ${appt.patient.lastName}`,
          patientEmail: appt.patient.email,
          dentist: appt.dentist,
          date: appt.date,
          time: appt.time,
        }),
      });
      setReminderMsg({ id: appt._id, ok: true, text: "Reminder sent!" });
    } catch {
      setReminderMsg({ id: appt._id, ok: false, text: "Failed to send reminder." });
    } finally {
      setSendingReminderId(null);
      setTimeout(() => setReminderMsg(null), 3500);
    }
  };

  const totalPages = Math.max(1, Math.ceil(appointments.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, appointments.length);
  const visibleAppointments = appointments.slice(startIndex, endIndex);

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
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
                visibleAppointments.map((appt, idx) => (
                  <tr key={appt._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-teal-500 font-medium">{startIndex + idx + 1}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {appt.patient.firstName} {appt.patient.lastName}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{appt.dentist}</td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(appt.date)}</td>
                    <td className="px-6 py-4 text-gray-500">{appt.time}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full border ${appt.status === "Scheduled"
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
                        {/* Send Reminder */}
                        <div className="relative">
                          <button
                            title={appt.patient.email ? "Send Reminder" : "No patient email on file"}
                            disabled={sendingReminderId === appt._id || !appt.patient.email}
                            onClick={() => sendReminder(appt)}
                            className="text-indigo-400 hover:text-indigo-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {sendingReminderId === appt._id ? (
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            )}
                          </button>
                          {reminderMsg?.id === appt._id && (
                            <span className={`absolute right-6 top-0 whitespace-nowrap text-xs px-2 py-1 rounded-md shadow ${
                              reminderMsg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                            }`}>
                              {reminderMsg.text}
                            </span>
                          )}
                        </div>
                        {/* Edit */}
                        <button
                          onClick={() => setEditingAppt(appt)}
                          className="text-teal-500 hover:text-teal-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {/* Delete */}
                        {role !== "receptionist" && (
                          <button
                            onClick={() => setDeletingId(appt._id)}
                            className="text-red-400 hover:text-red-500 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {!loading && appointments.length > 0 && (
          <div className="flex items-center justify-between mt-4 px-1">
            {/* Left: rows per page + count */}
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>Rows per page</span>
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span>
                Showing {startIndex + 1}–{endIndex} of {appointments.length}
              </span>
            </div>

            {/* Right: Previous / Next */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="px-4 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="px-4 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
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
