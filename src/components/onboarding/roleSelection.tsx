"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Container,
} from "@mui/material";
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { fetchRoles } from "@/src/store/slices/onboardingSlice";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import { imageUrls, navigationUrls } from "@/src/utils/constant";
import { roleSelectionStyles, styles } from "@/src/styles/onboarding.styles";
import { SxProps, Theme } from "@mui/material/styles";
import { UserRole } from "@/src/types/auth.types";
import {
  setSelectedRoles,
  setOnboardingCompleted,
  setUploadSignature,
} from "@/src/store/slices/authSlice";

export default function RoleSelectionPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const { roles, loading, error } = useAppSelector((state) => state.onboarding);

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const activeShiftCount =
    useAppSelector((state) => state.auth.user?.activeShiftCount) ?? 0;
  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const selected = useMemo(
    () => roles.find((role) => role._id === selectedRole),
    [roles, selectedRole],
  );

  const handleContinueClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!selectedRole) {
      dispatch(
        showAlert({
          message: t("roleSelection.warning"),
          type: AlertType.Warning,
        }),
      );
      return;
    }

    if (!selected) return;

    setIsRedirecting(true);

    let onboardingCompleted = false;
    let targetUrl = "";
    dispatch(setUploadSignature(true));
    dispatch(setSelectedRoles(selected.name));
    switch (selected.name) {
      case UserRole.Administrator:
        onboardingCompleted = true;
        targetUrl = navigationUrls.companies;
        break;

      case UserRole.ActiveController:
        if (activeShiftCount && activeShiftCount > 0) {
          onboardingCompleted = true;
          targetUrl = navigationUrls.shiftChange;
        } else {
          onboardingCompleted = false;
          targetUrl = navigationUrls.onboardingHoursRest;
        }
        break;

      case UserRole.Observer:
        onboardingCompleted = false;
        targetUrl = navigationUrls.onboardingObserver;
        break;
    }

    dispatch(setOnboardingCompleted(onboardingCompleted));
    router.push(targetUrl);


  };

  const isDisabled = loading || isRedirecting;

  return (
    <Container maxWidth="sm" sx={styles.cardContainerA}>
      <Typography variant="h5" sx={styles.headerTitle}>
        {t("roleSelection.title")}
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 4,
          mt: 2,
          flexWrap: "nowrap",
        }}
      >
        {loading && (
          <Box>
            <CircularProgress size={60} sx={{ color: "#fff" }} />
          </Box>
        )}
        {roles.map((role) => {
          const isSelected = selectedRole === role._id;
          const imageSrc =
            role.name === UserRole.Observer
              ? imageUrls.observer
              : role.name === UserRole.Administrator
                ? imageUrls.administrator
                : imageUrls.activeController;

          return (
            <Box key={role._id} sx={roleSelectionStyles.roleContainer}>
              <Box
                onClick={
                  !isRedirecting ? () => setSelectedRole(role._id) : undefined
                }
                sx={
                  {
                    ...roleSelectionStyles.roleBox,
                    ...(isSelected ? roleSelectionStyles.selectedBox : {}),
                    ...(isRedirecting
                      ? { pointerEvents: "none", opacity: 0.2 }
                      : {}),
                  } as SxProps<Theme>
                }
              >
                <Image src={imageSrc} alt={role.name} width={74} height={74} />
                {isSelected && (
                  <CheckCircleIcon sx={roleSelectionStyles.iconButton} />
                )}
              </Box>
              <Typography
                sx={
                  {
                    ...roleSelectionStyles.roleLabel,
                    ...(isSelected ? roleSelectionStyles.selectedLabel : {}),
                  } as SxProps<Theme>
                }
              >
                {role.name}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Box sx={styles.buttonContainer}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={styles.submitButton}
          onClick={handleContinueClick}
          disabled={isDisabled}
        >
          {isDisabled ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            <Typography sx={styles.submitButtonText} component="span">
              {t("roleSelection.continueButton")}
            </Typography>
          )}
        </Button>
      </Box>
    </Container>
  );
}
