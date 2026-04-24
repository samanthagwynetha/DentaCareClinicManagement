"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getRole } from "./auth";

export const useRoleGuard = (allowedRoles: string[]) => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = getToken();
      const role = getRole();
      
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
