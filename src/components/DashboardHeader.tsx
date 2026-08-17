import Link from "next/link";
import NotificationBell from "./NotificationBell";
import UserProfileHeader from "./UserProfileHeader";

interface DashboardHeaderProps {
  profileName?: string;
}

export default function DashboardHeader({ profileName }: DashboardHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-100 px-8 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, {profileName || "User"}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Calendar Icon */}
          <Link href="/appointments" className="p-2 hover:bg-gray-50 rounded-lg">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </Link>
          
          {/* Notification Bell */}
          <NotificationBell />
          
          {/* User Profile */}
          <UserProfileHeader />
        </div>
      </div>
    </div>
  );
}