"use client";
import { useRoleGuard } from "@/utils/roleGuard";

export default function Billing() {
  useRoleGuard(["receptionist", "admin"]); // Only Receptionist & Admin can manage billing
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Billing</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Billing and invoicing will be implemented here.</p>
      </div>
    </div>
  );
}
