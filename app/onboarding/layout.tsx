"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import AppBarComponent from "@/src/components/common/appBar";
import {
  onboardingPageWrapperStyles,
  onboardingOverlayStyles,
  styles as onboardingStyles,
} from "@/src/styles/onboarding.styles";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppSelector } from "@/src/hooks/redux";
import { useStepGuard } from "@/src/hooks/useStepGuard";
import { ONBOARDING } from "@/src/utils/constant";
import { resolveUserTheme } from "@/src/utils/themeUtils";
import { ThemeConfig } from "@/src/types/types";
import AuthGuard from "@/src/utils/authGuard";
import { useRoleGuard } from "@/src/hooks/useRoleGuard";
import { imageUrls } from "@/src/utils/constant";

export default function OnboardingLayout({
  children,
  previewTheme,
}: {
  children: React.ReactNode;
  previewTheme?: Partial<ThemeConfig>;
}) {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const { themes } = useAppSelector((state) => state.theme);
  useStepGuard(ONBOARDING);
  useRoleGuard();
  const themeConfig = resolveUserTheme(user, themes, previewTheme);

  return (
    <>
      <AuthGuard requireAuth={true}>
        <Box sx={onboardingPageWrapperStyles(themeConfig.imageUrl)}>
          <Box
            sx={onboardingOverlayStyles(
              themeConfig.colorCode,
              themeConfig.opacity,
            )}
          />
          <AppBarComponent
            userName={user?.username || ""}
            profileUrl={user?.profileUrl || ""}
          />
          {children}
          <Box sx={onboardingStyles.copyright}>
            <img src={imageUrls.prismHoriz} alt="logo" width={60} height={25} />
            <Typography component="span" sx={{ fontSize: "0.875rem" }}>
              {t("copyRight")}
            </Typography>
          </Box>
        </Box>
      </AuthGuard>
    </>
  );
}
