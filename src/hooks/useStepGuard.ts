import { useAppSelector } from "@/src/hooks/redux";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  DASHBOARD,
  AUTH,
  ONBOARDING,
  navigationUrls,
} from "@/src/utils/constant";
import { getPrimaryRole } from "@/src/utils/config";
import { isAuthenticated } from "@/src/utils/authToken";
import { getTargetRouteByRole } from "@/src/utils/authGuard";
import { UserRole } from "../types/auth.types";

/**
 * Simplified step guard for auth, onboarding, and dashboard flows.
 * @param currentStep - "auth" | "onboarding" | "dashboard"
 */
export function useStepGuard(
  currentStep: typeof AUTH | typeof ONBOARDING | typeof DASHBOARD,
) {
  const { user, isOnboardingCompleted, selectedRole, hasUploadedSignature } =
    useAppSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const hasValidToken = isAuthenticated();
    const hasUser = !!user;

    if (!hasValidToken) {
      if (currentStep !== AUTH) {
        router.replace(navigationUrls.login);
      }
      return;
    }

    if (!hasUser) {
      return;
    }

    const roles = user.roles?.map((role) => role.name) ?? [];
    const primaryRole = getPrimaryRole(roles);
    const activeShiftCount = user.activeShiftCount ?? 0;
    const signatureUrl = user.signatureUrl;


    const isInsideDashboard = pathname?.startsWith("/dashboard");
    const isInsideOnboarding = pathname?.startsWith("/onboarding");
    const isInsideAuth = pathname?.startsWith("/auth");

    if (
      (currentStep === DASHBOARD && isInsideDashboard) ||
      (currentStep === ONBOARDING && isInsideOnboarding) ||
      (currentStep === AUTH && isInsideAuth)
    ) {
      return;
    }

    if (
      selectedRole === UserRole.Administrator &&
      isOnboardingCompleted &&
      currentStep === ONBOARDING
    ) {
      router.replace(navigationUrls.companies);
      return;
    }

    if (
      selectedRole === UserRole.ActiveController &&
      isOnboardingCompleted &&
      currentStep === ONBOARDING
    ) {
      router.replace(navigationUrls.shiftChange);
      return;
    }


    if (!isOnboardingCompleted && currentStep === ONBOARDING) {
      if (isInsideOnboarding) {
        return;
      }
      if (!signatureUrl && !hasUploadedSignature) {
        router.replace(navigationUrls.esign);
      } else {
        router.replace(
          getTargetRouteByRole(
            primaryRole,
            activeShiftCount,
          ),
        );
      }
      return;
    }

    if (
      !isOnboardingCompleted &&
      (currentStep === DASHBOARD || currentStep === AUTH)
    ) {
      if (isInsideOnboarding) {
        return; 
      }
      router.replace(
        getTargetRouteByRole(
          primaryRole,
          activeShiftCount,
        ),
      );
      return;
    }

    if (isOnboardingCompleted && currentStep !== DASHBOARD) {
      if (isInsideDashboard) {
        return;
      }

      if (selectedRole === UserRole.Administrator) {
        router.replace(navigationUrls.companies);
      } else if (selectedRole === UserRole.ActiveController) {
        if (activeShiftCount && activeShiftCount > 0) {
          router.replace(navigationUrls.shiftChange);
        } else {
          router.replace(navigationUrls.onboardingHoursRest);
        }
      } else if (selectedRole === UserRole.Observer) {
        router.replace(navigationUrls.onboardingObserver);
      }
      return;
    }
  }, [
    user,
    isOnboardingCompleted,
    currentStep,
    router,
    selectedRole,
    pathname,
  ]);
}
