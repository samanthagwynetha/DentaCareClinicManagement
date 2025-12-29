"use client";
import { useRoleGuard } from "@/utils/roleGuard";

export default function Patients() {
  useRoleGuard(["dentist", "receptionist", "admin"]); // All roles can view patients
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Patients</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Patient management will be implemented here.</p>
      </div>
    </div>
  );
}
