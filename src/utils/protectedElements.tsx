import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/src/hooks/redux";
import { setSelectedRoles } from "@/src/store/slices/authSlice";

interface RBACProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export function RBAC({ allowedRoles, children }: RBACProps) {
  const dispatch = useAppDispatch();
  const { selectedRole: reduxRole } = useAppSelector((s) => s.auth);
  const [hydratedRole, setHydratedRole] = useState<string | null>(reduxRole);

  const getStoredRole = (): string | null => {
    if (typeof window === "undefined") return null;

    const localRole = localStorage.getItem("selectedRole");
    if (localRole) return localRole;

    const match = document.cookie.match(/(?:^|;\s*)selectedRole=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  };

  useEffect(() => {
    if (!reduxRole) {
      const stored = getStoredRole();
      if (stored) {
        dispatch(setSelectedRoles(stored as any));
        setHydratedRole(stored);
      }
    } else {
      setHydratedRole(reduxRole);
    }
  }, [reduxRole, dispatch]);

  if (!hydratedRole || !allowedRoles.includes(hydratedRole)) return null;

  return <>{children}</>;
}
