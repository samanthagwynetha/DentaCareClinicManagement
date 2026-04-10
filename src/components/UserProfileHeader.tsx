"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

type UserProfile = {
  name: string;
  role: string;
  avatarBase64?: string;
};

export default function UserProfileHeader() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await apiFetch<UserProfile>("/api/account/me");
        setProfile(data);
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    }
    loadProfile();
  }, []);

  if (!profile) {
    return (
      <div className="flex items-center gap-3 ml-2 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
        <div>
          <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Derive initials from the name
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Capitalize the regular role safely
  const formattedRole = profile.role
    ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
    : "Unknown Role";

  return (
    <div className="flex items-center gap-3 ml-2">
      {profile.avatarBase64 ? (
        <img
          src={profile.avatarBase64}
          alt="Profile Avatar"
          className="w-10 h-10 rounded-full object-cover border border-gray-200"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white text-sm font-semibold">
          {getInitials(profile.name)}
        </div>
      )}
      <div>
        <p className="text-sm font-semibold text-gray-900">{profile.name}</p>
        <p className="text-xs text-gray-500">{formattedRole}</p>
      </div>
    </div>
  );
}
