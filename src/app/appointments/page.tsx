"use client";
import { useRoleGuard } from "@/utils/roleGuard";

export default function Appointments() {
  useRoleGuard(["dentist", "receptionist", "admin"]); // Dentist, Receptionist & Admin can view
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Appointments</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Appointment scheduling will be implemented here.</p>
      </div>
    </div>
  );
}
