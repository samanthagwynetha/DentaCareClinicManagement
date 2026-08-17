"use client";
import { useEffect, useState } from "react";
import { getRole } from "@/utils/auth";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import StatsOverview from "@/components/StatsOverview";
import TodayAppointments from "@/components/TodayAppointments";
import QuickActions from "@/components/QuickActions";
import RecentPatients from "@/components/RecentPatients";
import RevenueChart from "@/components/RevenueChart";
import { useRoleGuard } from "@/utils/roleGuard";
import { apiFetch } from "@/lib/api";

type Stats = {
  totalPatients: number;
  todayAppointments: number;
  monthlyRevenue: number;
  treatmentsDone: number;
  treatmentsTrendPercent: number;
  patientsTrendPercent: number;
  appointmentsRemaining: number;
  revenueTrendPercent: number;
};

export default function DashboardPage() {
  const isChecking = useRoleGuard(["admin", "dentist", "receptionist"]);
  
  const [stats, setStats] = useState<Stats | null>(null);
  const [profile, setProfile] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isChecking) return;

    const role = getRole();
    if (role) {
      setIsAdmin(role === "admin");
    }

    async function loadData() {
      try {
        const [statsData, profileData] = await Promise.all([
          apiFetch<Stats>("/api/dashboard/stats"),
          apiFetch<{ name: string }>("/api/account/me")
        ]);
        setStats(statsData);
        setProfile(profileData);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isChecking]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader profileName={profile?.name} />

        <main className="p-8 overflow-y-auto">
          <StatsOverview stats={stats} loading={loading} isAdmin={isAdmin} />

          <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6 mb-8`}>
            <div className={`${isAdmin ? 'lg:col-span-2 space-y-6' : 'lg:col-span-1 flex flex-col'}`}>
              <div className={isAdmin ? "" : "flex-1"}>
                <TodayAppointments />
              </div>
              {isAdmin && <RevenueChart />}
            </div>
            <div className="space-y-6">
              <QuickActions />
              <RecentPatients />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

