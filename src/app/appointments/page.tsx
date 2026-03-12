"use client";
import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/utils/roleGuard";
import AppointmentCalendar from "@/components/appointments/AppointmentCalendar";
import AppointmentList from "@/components/appointments/AppointmentList";
import AppointmentModal from "@/components/appointments/AppointmentModal";
import { Appointment, DentistUser } from "@/components/appointments/types";
import { apiFetch } from "@/lib/api";

export default function AppointmentsPage() {
  useRoleGuard(["dentist", "receptionist", "admin"]);
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dentists, setDentists] = useState<DentistUser[]>([]);
  const [selectedDentist, setSelectedDentist] = useState("");
  const [search, setSearch] = useState("");

  const loadAppointments = useCallback(async () => {
    try {
      const data = await apiFetch<Appointment[]>("/api/appointments");
      setAppointments(data);
    } catch (err) {
      console.error("Failed to load appointments:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
    apiFetch<DentistUser[]>("/api/users/dentists").then(setDentists).catch(() => {});
  }, [loadAppointments]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1">
        {/* ── Header ── */}
        <div className="bg-white border-b border-gray-100 px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400 mb-1">
                <span className="hover:text-teal-500 cursor-pointer">Home</span>
                <span className="mx-1">›</span>
                Appointments
              </p>
              <h1 className="text-2xl font-bold text-gray-900">Appointment Calendar</h1>
              <p className="text-sm text-gray-500">Schedule and manage appointments</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search patients, appointments..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 w-72 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <button className="p-2 hover:bg-gray-50 rounded-lg">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>

              <button className="relative p-2 hover:bg-gray-50 rounded-lg">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <div className="flex items-center gap-2 ml-1">
                <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center text-white text-sm font-semibold">
                  DA
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">Dr. Anderson</p>
                  <p className="text-xs text-gray-500">General Dentist</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="p-8">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Appointment
              </button>

              <div className="relative">
                <select
                  value={selectedDentist}
                  onChange={(e) => setSelectedDentist(e.target.value)}
                  className="appearance-none border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                >
                  <option value="">All Dentists</option>
                  {dentists.map((d) => (
                    <option key={d._id} value={d.name}>{d.name}</option>
                  ))}
                </select>
                <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* View toggle */}
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setView("calendar")}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${
                  view === "calendar" ? "bg-teal-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Calendar
              </button>
              <button
                onClick={() => setView("list")}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${
                  view === "list" ? "bg-teal-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                List
              </button>
            </div>
          </div>

          {(() => {
            const q = search.toLowerCase();
            const filtered = appointments.filter((a) => {
              const name = `${a.patient.firstName} ${a.patient.lastName}`.toLowerCase();
              const matchesSearch = !q || name.includes(q) || a.dentist.toLowerCase().includes(q);
              const matchesDentist = !selectedDentist || a.dentist === selectedDentist;
              return matchesSearch && matchesDentist;
            });
            return (
              <>
                {view === "calendar" && <AppointmentCalendar appointments={filtered} loading={loading} />}
                {view === "list" && <AppointmentList appointments={filtered} loading={loading} onDeleted={loadAppointments} />}
              </>
            );
          })()}
        </div>
      </div>

      {showModal && <AppointmentModal onClose={() => setShowModal(false)} onCreated={loadAppointments} />}
    </div>
  );
}

