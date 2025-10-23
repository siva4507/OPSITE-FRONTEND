"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setOnboardingCompleted,
  setRememberMe,
  setSelectedRoles,
} from "@/src/store/slices/authSlice";

export const useAuthHydration = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onboarding = localStorage.getItem("isOnboardingCompleted") === "true";
    const rememberMe = localStorage.getItem("rememberMe") === "true";
    const role = localStorage.getItem("selectedRole") || null;

    dispatch(setOnboardingCompleted(onboarding));
    dispatch(setRememberMe(rememberMe));
    if (role) dispatch(setSelectedRoles(role));
  }, [dispatch]);
};
