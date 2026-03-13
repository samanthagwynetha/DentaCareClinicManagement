"use client";
import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

type Appointment = {
  id: string;
  patientName: string;
  procedure: string;
  time: string;
  duration: string;
  status: "Completed" | "In Progress" | "Pending" | "Cancelled";
};

type TodayAppointmentsResponse = {
  dateLabel: string;
  appointments: Appointment[];
};

function getInitials(name: string) {
  const [first = "", last = ""] = name.split(" ");
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "NA";
}

export default function TodayAppointments() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dateLabel, setDateLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadTodayAppointments = useCallback(async () => {
    try {
      const data = await apiFetch<TodayAppointmentsResponse>(
        "/api/dashboard/today-appointments"
      );
      setAppointments(data.appointments || []);
      setDateLabel(data.dateLabel || "");
    } catch (err) {
      console.error("Failed to load today's appointments:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodayAppointments();
  }, [loadTodayAppointments]);

  async function markAsCompleted(id: string) {
    try {
      setUpdatingId(id);
      await apiFetch(`/api/appointments/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "Completed" }),
      });
      await loadTodayAppointments();
    } catch (err) {
      console.error("Failed to update appointment status:", err);
    } finally {
      setUpdatingId(null);
      setActiveMenuId(null);
    }
  }

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-teal-50 text-teal-600";
      case "In Progress":
        return "bg-blue-50 text-blue-600";
      case "Cancelled":
        return "bg-red-50 text-red-600";
      case "Pending":
      default:
        return "bg-orange-50 text-orange-600";
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Today's Appointments
          </h2>
          <p className="text-sm text-gray-400">{loading ? "Loading..." : dateLabel || "Today"}</p>
        </div>
        <button
          className="text-teal-600 text-sm font-medium hover:text-teal-700"
          onClick={() => router.push("/appointments")}
        >
          View All
        </button>
      </div>

      <div className="space-y-0 mt-4">
        {!loading && appointments.length === 0 && (
          <div className="py-8 text-center text-sm text-gray-400">
            No appointments for today.
          </div>
        )}

        {appointments.map((appointment, index) => (
          <div
            key={appointment.id}
            className={`flex items-center justify-between py-4 hover:bg-gray-50 rounded-lg px-2 transition-colors group ${
              index !== appointments.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600">
                {getInitials(appointment.patientName)}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {appointment.patientName}
                </p>
                <p className="text-sm text-gray-400">{appointment.procedure}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-right">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {appointment.time}
                  </p>
                  <p className="text-xs text-gray-400">{appointment.duration}</p>
                </div>
              </div>
              <span
                className={`px-3 py-1.5 rounded-lg text-xs font-medium min-w-[90px] text-center ${getStatusColor(
                  appointment.status
                )}`}
              >
                {appointment.status}
              </span>
              <div className="relative">
                <button
                  className="p-1.5 hover:bg-gray-200 rounded"
                  title="More actions"
                  onClick={() =>
                    setActiveMenuId((prev) =>
                      prev === appointment.id ? null : appointment.id
                    )
                  }
                >
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>

                {activeMenuId === appointment.id && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setActiveMenuId(null);
                        router.push("/appointments");
                      }}
                    >
                      View Details
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:text-gray-400"
                      onClick={() => markAsCompleted(appointment.id)}
                      disabled={updatingId === appointment.id || appointment.status === "Completed"}
                    >
                      {appointment.status === "Completed"
                        ? "Already Completed"
                        : updatingId === appointment.id
                          ? "Updating..."
                          : "Mark as Completed"}
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-teal-700 hover:bg-teal-50"
                      onClick={() => {
                        setActiveMenuId(null);
                        router.push("/appointments");
                      }}
                    >
                      Go to Appointments
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
