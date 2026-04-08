"use client";
import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import TodayAppointments from "@/components/TodayAppointments";
import QuickActions from "@/components/QuickActions";
import RecentPatients from "@/components/RecentPatients";
import RevenueChart from "@/components/RevenueChart";
import Sidebar from "@/components/Sidebar";
import NotificationBell from "@/components/NotificationBell";
import { useRoleGuard } from "@/utils/roleGuard";
import { apiFetch } from "@/lib/api";

type Stats = {
  totalPatients: number;
  todayAppointments: number;
  monthlyRevenue: number;
  treatmentsDone: number;
  treatmentsTrendPercent: number;
};

export default function DashboardPage() {
  useRoleGuard(["admin", "dentist", "receptionist"]);
  
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await apiFetch<Stats>("/api/dashboard/stats");
        setStats(data);
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back, Dr. Anderson</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search patients, appointments..."
                  className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              
              {/* Calendar Icon */}
              <button className="p-2 hover:bg-gray-50 rounded-lg">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              
              {/* Notification Bell */}
              <NotificationBell />
              
              {/* User Profile */}
              <div className="flex items-center gap-3 ml-2">
                <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white text-sm font-semibold">
                  DA
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Dr. Anderson</p>
                  <p className="text-xs text-gray-500">General Dentist</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Patients"
              value={loading ? "..." : stats?.totalPatients || 0}
              change="12.5% from last month"
              changeType="increase"
              iconBg="bg-blue-50"
              icon={
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
            <StatCard
              title="Today's Appointments"
              value={loading ? "..." : stats?.todayAppointments || 0}
              change="5 remaining"
              changeType="increase"
              iconBg="bg-green-50"
              icon={
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
            <StatCard
              title="Monthly Revenue"
              value={loading ? "..." : `₱${stats?.monthlyRevenue?.toLocaleString() || "0.00"}`}
              change="18.2% from last month"
              changeType="increase"
              iconBg="bg-yellow-50"
              icon={
                <svg className="w-6 h-6 text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
                  <text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="bold" fill="currentColor">₱</text>
                </svg>
              }
            />
            <StatCard
              title="Treatments Done"
              value={loading ? "..." : stats?.treatmentsDone || 0}
              change={
                loading
                  ? ""
                  : `${Math.abs(stats?.treatmentsTrendPercent || 0).toFixed(1)}% from last week`
              }
              changeType={(stats?.treatmentsTrendPercent || 0) >= 0 ? "increase" : "decrease"}
              iconBg="bg-purple-50"
              icon={
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 space-y-6">
              <TodayAppointments />
              <RevenueChart />
            </div>
            <div className="space-y-6">
              <QuickActions />
              <RecentPatients />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
