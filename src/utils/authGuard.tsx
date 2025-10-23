"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/src/hooks/redux";
import { isAuthenticated } from "@/src/utils/authToken";
import { CircularProgress, Box } from "@mui/material";
import { navigationUrls } from "@/src/utils/constant";
import { UserRole } from "../types/auth.types";

export const getTargetRouteByRole = (
  role: string,
  activeShiftCount?: number,
) => {
  switch (role) {
    case UserRole.Administrator:
      return navigationUrls.onboardingRoleSelection;

    case UserRole.ActiveController:
      if (activeShiftCount && activeShiftCount > 0) {
        return navigationUrls.shiftChange;
      }
      else {
        return navigationUrls.onboardingHoursRest;
      }

    case UserRole.Observer:
      return navigationUrls.onboardingObserver;

    default:
      return navigationUrls.login;
  }
};

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
}) => {
  const router = useRouter();
  const { user, isOnboardingCompleted, selectedRole, hasUploadedSignature } =
    useAppSelector((state) => state.auth);
  const [checking, setChecking] = useState(true);

  const targetRoute = useMemo(() => {
    if (!user) return null;

    return getTargetRouteByRole(
      selectedRole ?? UserRole.ActiveController,
      user.activeShiftCount,
    );
  }, [user, selectedRole]);

  useEffect(() => {
    const timer = setTimeout(() => setChecking(false), 3000);

    const hasValidToken = isAuthenticated();

    if (!hasValidToken) {
      if (requireAuth) router.replace(navigationUrls.login);
      setChecking(false);
      clearTimeout(timer);
      return;
    }

    if (!user) {
      return;
    }

    if (!isOnboardingCompleted) {
      const currentPath = window.location.pathname;
      const isOnOnboardingPage = currentPath.startsWith("/onboarding");

      if (isOnOnboardingPage) {
        setChecking(false);
        clearTimeout(timer);
        return;
      }

      if (!user.signatureUrl && !hasUploadedSignature) {
        router.replace(navigationUrls.esign);
      } else {
        router.replace(targetRoute!);
      }
    }

    setChecking(false);
    clearTimeout(timer);
  }, [user, isOnboardingCompleted, requireAuth, router, targetRoute]);

  if (checking) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
