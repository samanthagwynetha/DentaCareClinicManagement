"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { useRoleGuard } from "@/utils/roleGuard";

export default function Dashboard() {
  useRoleGuard(["admin", "dentist", "receptionist"]); // All roles can access dashboard
  
  const [user, setUser] = useState<{ role?: string }>({});
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      router.push("/login");
      return;
    }

    setUser({ role: role || "" });
  }, [router]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <p className="text-lg mb-2">You are logged in!</p>
        <p className="text-gray-600">Role: <span className="font-semibold">{user.role}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Patients</h3>
          <p className="text-3xl font-bold text-blue-600">150</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Today's Appointments</h3>
          <p className="text-3xl font-bold text-green-600">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Bills</h3>
          <p className="text-3xl font-bold text-yellow-600">8</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Revenue</h3>
          <p className="text-3xl font-bold text-purple-600">$15,230</p>
        </div>
      </div>

      <LogoutButton />
    </div>
  );
}
