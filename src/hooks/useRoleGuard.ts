
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { UserRole } from "../types/auth.types";
import { navigationUrls } from "@/src/utils/constant";
import { setOnboardingCompleted } from "../store/slices/authSlice";

const ROLE_PERMISSIONS = {
  [UserRole.Administrator]: {
    onboarding: [
      navigationUrls.onboardingRoleSelection,
      navigationUrls.esign,
    ],
    dashboard: [
      navigationUrls.dashboard,
      navigationUrls.companies,
      navigationUrls.user,
      navigationUrls.roles,
      navigationUrls.categories,
      navigationUrls.aor,
      navigationUrls.themes,
      navigationUrls.facility,
      navigationUrls.onboardingHoursRest,
      navigationUrls.aorforms,
      navigationUrls.qos,
      navigationUrls.mitigation,
      navigationUrls.sleepHours,
      navigationUrls.shiftHours,
      navigationUrls.hitchDay,
      navigationUrls.fatigueScore,
    ],
  },
  [UserRole.ActiveController]: {
    onboarding: [
      navigationUrls.esign,
      navigationUrls.onboardingInvite,
      navigationUrls.onboardingHoursRest,
      navigationUrls.onboardingAreaResponse,
    ],
    dashboard: [
      navigationUrls.dashboard,
      navigationUrls.shiftChange,
      navigationUrls.logbook,
      navigationUrls.documents,
      navigationUrls.help,
    ],
  },
  [UserRole.Observer]: {
    onboarding: [
      navigationUrls.esign,
      navigationUrls.onboardingObserver,
    ],
    dashboard: [
      navigationUrls.dashboard,
      navigationUrls.shiftChange,
      navigationUrls.logbook,
      navigationUrls.documents,
      navigationUrls.help,
    ],
  },
};

const ROLE_DEFAULT_ROUTES = {
  onboarding: {
    [UserRole.Administrator]: navigationUrls.onboardingRoleSelection,
    [UserRole.ActiveController]: navigationUrls.onboardingHoursRest,
    [UserRole.Observer]: navigationUrls.onboardingObserver,
  },
  dashboard: {
    [UserRole.Administrator]: navigationUrls.companies,
    [UserRole.ActiveController]: navigationUrls.shiftChange,
    [UserRole.Observer]: navigationUrls.shiftChange,
  },
};


export function useRoleGuard() {
  const { selectedRole, isOnboardingCompleted, user } = useAppSelector(
    (state) => state.auth,
  );
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user || !selectedRole || !pathname) return;

    const rolePermissions = ROLE_PERMISSIONS[selectedRole as UserRole];
    if (!rolePermissions) return;

    const isOnboardingRoute = pathname.startsWith("/onboarding");
    const isDashboardRoute = pathname.startsWith("/dashboard");

    const activeShiftCount = user?.activeShiftCount ?? 0;

    let defaultOnboardingRoute =
      ROLE_DEFAULT_ROUTES.onboarding[selectedRole as UserRole];

    if (selectedRole === UserRole.ActiveController) {
      if (activeShiftCount > 0) {
        dispatch(setOnboardingCompleted(true));
        defaultOnboardingRoute = navigationUrls.shiftChange;
      } else {
        defaultOnboardingRoute = navigationUrls.onboardingHoursRest;
      }
    }

    const defaultDashboardRoute =
      ROLE_DEFAULT_ROUTES.dashboard[selectedRole as UserRole];

    if (isOnboardingRoute && !isOnboardingCompleted) {
      const allowedOnboardingRoutes = rolePermissions.onboarding || [];
      const hasAccess = allowedOnboardingRoutes.includes(pathname);

      if (!hasAccess) {
        router.replace(defaultOnboardingRoute);
      }
      return;
    }

    if (isDashboardRoute && isOnboardingCompleted) {
      const allowedDashboardRoutes = rolePermissions.dashboard || [];
      const hasAccess = allowedDashboardRoutes.includes(pathname);

      if (!hasAccess) {
        router.replace(defaultDashboardRoute);
      }
      return;
    }

    if (isDashboardRoute && !isOnboardingCompleted) {
      router.replace(defaultOnboardingRoute);
      return;
    }

    if (isOnboardingRoute && isOnboardingCompleted) {
      router.replace(defaultDashboardRoute);
      return;
    }
  }, [selectedRole, pathname, isOnboardingCompleted, router, user]);
}
