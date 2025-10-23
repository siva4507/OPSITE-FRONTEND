"use client";

import React, { useMemo } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useStepGuard } from "@/src/hooks/useStepGuard";
import AuthSection from "@/src/components/common/authSection";
import { AUTH } from "@/src/utils/constant";
import AuthGuard from "@/src/utils/authGuard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  useStepGuard(AUTH);

  const authWords = useMemo(
    () => [`${t("slide_2")},`, `${t("slide_3")},`, t("slide_4")],
    [t],
  );

  return (
    <>
      <AuthGuard requireAuth={false}>
        <Grid container sx={{ minHeight: "100vh" }}>
          <AuthSection />
          {children}
        </Grid>
      </AuthGuard>
    </>
  );
}
