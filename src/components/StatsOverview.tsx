import StatCard from "./StatCard";

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

interface StatsOverviewProps {
  stats: Stats | null;
  loading: boolean;
  isAdmin: boolean;
}

export default function StatsOverview({ stats, loading, isAdmin }: StatsOverviewProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${isAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 mb-8`}>
      <StatCard
        title="Total Patients"
        value={loading ? "..." : stats?.totalPatients || 0}
        change={loading ? "" : `${Math.abs(stats?.patientsTrendPercent || 0).toFixed(1)}% from last month`}
        changeType={(stats?.patientsTrendPercent || 0) >= 0 ? "increase" : "decrease"}
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
        change={loading ? "" : `${stats?.appointmentsRemaining || 0} remaining`}
        changeType="neutral"
        iconBg="bg-green-50"
        icon={
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
      />
      {isAdmin && (
        <StatCard
          title="Monthly Revenue"
          value={loading ? "..." : `₱${stats?.monthlyRevenue?.toLocaleString() || "0.00"}`}
          change={loading ? "" : `${Math.abs(stats?.revenueTrendPercent || 0).toFixed(1)}% from last month`}
          changeType={(stats?.revenueTrendPercent || 0) >= 0 ? "increase" : "decrease"}
          iconBg="bg-yellow-50"
          icon={
            <svg className="w-6 h-6 text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
              <text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="bold" fill="currentColor">₱</text>
            </svg>
          }
        />
      )}
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
  );
}
