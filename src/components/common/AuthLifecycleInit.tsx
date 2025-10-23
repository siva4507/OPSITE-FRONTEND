"use client";

import { useEffect } from "react";
import { initAuthSessionLifecycle } from "@/src/utils/authToken";

export default function AuthLifecycleInit() {
  useEffect(() => {
    initAuthSessionLifecycle();
  }, []);
  return null;
}
