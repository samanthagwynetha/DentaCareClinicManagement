"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useRoleGuard = (allowedRoles: string[]) => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      
      if (!token) {
        router.replace("/login");
        return;
      }

      if (!role || !allowedRoles.includes(role)) {
        router.replace("/login");
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, []); // Empty dependency array - only run once

  return isChecking;
};
