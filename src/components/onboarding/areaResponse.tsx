"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Select,
  MenuItem,
  ListItemText,
  Grid,
} from "@mui/material";
import LoadingSpinner from "@/src/components/common/loader";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  fetchAreasOfResponsibility,
  setSelectedAORs,
  assignShiftAction,
  fetchCompanies,
  setSelectedCompanies,
  setLastFetchedCompanies,
} from "@/src/store/slices/onboardingSlice";
import { setOnboardingCompleted } from "@/src/store/slices/authSlice";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import {
  aorSelectionStyles,
  styles,
  hoursRestStyles,
} from "@/src/styles/onboarding.styles";
import { imageUrls, MAX_AOR, navigationUrls } from "@/src/utils/constant";
import { SxProps, Theme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import DynamicModal from "../common/modal";
import {
  endAorThunk,
  setStoppedAor,
} from "@/src/store/slices/shiftChangeSlice";

export default function AreaOfResponsibilityPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { stoppedAor } = useAppSelector((state) => state.shiftChange);
  const {
    areasOfResponsibility,
    loading,
    shiftAssignment,
    companies,
    selectedCompanies,
  } = useAppSelector((state) => state.onboarding);

  const [selectedAORs, setSelectedAORsLocal] = useState<string[]>([]);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [pendingCompanies, setPendingCompanies] = useState<string[]>([]);
  const [showAorGrid, setShowAorGrid] = useState(false);
  const [lockedAorModal, setLockedAorModal] = useState<{
    open: boolean;
    aorId?: string;
    aorName?: string;
    lockedByName?: string;
  }>({ open: false });

  useEffect(() => {
    dispatch(fetchCompanies());
    dispatch(setSelectedCompanies([]));
    dispatch(setLastFetchedCompanies([]));
  }, [dispatch]);

  useEffect(() => {
    if (stoppedAor) {
      dispatch(
        showAlert({
          message: t("areaSelection.aorEndedSuccess"),
          type: AlertType.Success,
        }),
      );
      if (selectedCompanies.length > 0) {
        dispatch(fetchAreasOfResponsibility(selectedCompanies));
      }
      dispatch(setStoppedAor(false));
    }
  }, [stoppedAor, selectedCompanies, dispatch, t]);

  useEffect(() => {
    if (showAorGrid && areasOfResponsibility?.recentAor) {
      const recent = areasOfResponsibility.recentAor ?? [];
      if (recent.length) {
        const availableRecent = recent.filter((aorId) => {
          const aor = areasOfResponsibility?.aors?.find(
            (aor) => aor._id === aorId,
          );
          return aor && !aor.isLocked;
        });

        if (availableRecent.length) {
          setSelectedAORsLocal(availableRecent);
          dispatch(setSelectedAORs(availableRecent));
        }
      }
    }
  }, [
    showAorGrid,
    areasOfResponsibility?.recentAor,
    areasOfResponsibility?.aors,
    dispatch,
  ]);

  const handleAORToggle = useCallback(
    (id: string) => {
      const aor = areasOfResponsibility?.aors?.find((a) => a._id === id);
      if (aor?.isLocked) {
        setLockedAorModal({
          open: true,
          aorId: aor._id,
          aorName: aor.name,
          lockedByName: aor.lockedByName,
        });
        return;
      }

      const isAlreadySelected = selectedAORs.includes(id);
      if (!isAlreadySelected && selectedAORs.length >= MAX_AOR) {
        dispatch(
          showAlert({
            message: t("areaSelection.maxAor", { max: MAX_AOR }),
            type: AlertType.Error,
          }),
        );
        return;
      }
      const updated = isAlreadySelected
        ? selectedAORs.filter((aor) => aor !== id)
        : [...selectedAORs, id];
      setSelectedAORsLocal(updated);
      dispatch(setSelectedAORs(updated));
    },
    [selectedAORs, dispatch, t, areasOfResponsibility?.aors],
  );

  const showError = useCallback(
    (msgKey: string) => {
      dispatch(showAlert({ message: t(msgKey), type: AlertType.Error }));
    },
    [dispatch, t],
  );

  const handleStartShift = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!selectedAORs.length) return showError("areaSelection.error");
    if (!shiftAssignment?.ratingId || !shiftAssignment?.continuousRestHours) {
      return showError("areaSelection.missingDataError");
    }

    setIsRedirecting(true);
    try {
      await dispatch(
        assignShiftAction({
          aorId: selectedAORs,
          ratingId: shiftAssignment.ratingId,
          continuousRestHours: shiftAssignment.continuousRestHours,
          loginTime: shiftAssignment.loginTime,
        }),
      ).unwrap();

      await dispatch(setOnboardingCompleted(true));

      dispatch(
        showAlert({
          message: t("areaSelection.success"),
          type: AlertType.Success,
        }),
      );
      router.push(navigationUrls.shiftChange);
    } catch (err: unknown) {
      setIsRedirecting(false);
      const error = err as { statusCode?: number; message?: string };
      if (error?.statusCode === 400) {
        dispatch(
          showAlert({
            message: t("areaSelection.indicator"),
            type: AlertType.Info,
          }),
        );
      } else {
        showError(error?.message || "areaSelection.assignError");
      }
    }
  };

  const handleCompanyDropdownClose = () => {
    setIsCompanyDropdownOpen(false);
  };

  const handleSelectButtonClick = () => {
    if (pendingCompanies.length === 0) return;

    const changed =
      pendingCompanies.length !== selectedCompanies.length ||
      !pendingCompanies.every((id, idx) => id === selectedCompanies[idx]);

    if (changed) {
      dispatch(setSelectedCompanies([...pendingCompanies]));
      dispatch(fetchAreasOfResponsibility(pendingCompanies));
      dispatch(setLastFetchedCompanies([...pendingCompanies]));
    }
    setShowAorGrid(true);
  };

  const renderCompanySelect = () => (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center", width: "100%" }}>
      <Box sx={{ ...aorSelectionStyles.selectWrapper, flex: 1 }}>
        <Select
          multiple
          value={pendingCompanies}
          onChange={(e) => {
            setPendingCompanies(e.target.value as string[]);
            setShowAorGrid(false);
            setSelectedAORsLocal([]);
            dispatch(setSelectedAORs([]));
          }}
          displayEmpty
          variant="standard"
          sx={{
            ...hoursRestStyles.select,
            width: "100%",
            textAlign: "left",
            ...(isRedirecting ? { pointerEvents: "none", opacity: 0.2 } : {}),
          }}
          MenuProps={{
            PaperProps: { sx: hoursRestStyles.dropdownMenuPaper },
            disableRestoreFocus: true,
            keepMounted: true,
          }}
          open={isCompanyDropdownOpen}
          onOpen={() => {
            if (!isRedirecting) setIsCompanyDropdownOpen(true);
          }}
          onClose={handleCompanyDropdownClose}
          disabled={isRedirecting}
          renderValue={(selected) =>
            selected.length === 0 ? (
              <Typography
                sx={{
                  ...hoursRestStyles.hoursDescription,
                  color: "#FFF",
                  textAlign: "left",
                }}
              >
                {t("areaSelection.select")}
              </Typography>
            ) : (
              <Typography sx={{ textAlign: "left" }}>
                {companies
                  .filter((c) => selected.includes(c._id))
                  .map((c) => c.name)
                  .join(", ")}
              </Typography>
            )
          }
        >
          <MenuItem value="" disabled>
            <Typography sx={hoursRestStyles.hoursDescription}>
              {t("areaSelection.select")}
            </Typography>
          </MenuItem>
          {companies.map((company) => (
            <MenuItem key={company._id} value={company._id}>
              <ListItemText
                primary={company.name}
                sx={{
                  ...hoursRestStyles.hoursDescription,
                  textAlign: "left",
                  color: pendingCompanies.includes(company._id)
                    ? "#3D96E1"
                    : "#FFF",
                }}
              />
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Button
        variant="contained"
        onClick={handleSelectButtonClick}
        disabled={pendingCompanies.length === 0 || isRedirecting}
        sx={{
          ...hoursRestStyles.quickSelectBtnActive,
          "&.Mui-disabled": {
            backgroundColor: "rgba(255, 255, 255, 0.12)",
            color: "rgba(255, 255, 255, 0.3)",
          },
        }}
      >
        {t("common.select")}
      </Button>
    </Box>
  );

  const renderAORGrid = () => (
    <Box
      sx={{
        ...aorSelectionStyles.aorGridScrollContainer,
        display: "flex",
        alignItems:
          showAorGrid &&
          selectedCompanies.length > 0 &&
          areasOfResponsibility?.aors?.length > 0
            ? "flex-start"
            : "center",
        justifyContent:
          showAorGrid &&
          selectedCompanies.length > 0 &&
          areasOfResponsibility?.aors?.length > 0
            ? "flex-start"
            : "center",
      }}
    >
      {loading ? (
        <Box
          sx={{
            width: "100%",
            height: "200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LoadingSpinner size={40} sx={{ color: "#FFFFFF" }} />
        </Box>
      ) : showAorGrid &&
        selectedCompanies.length > 0 &&
        areasOfResponsibility?.aors?.length > 0 ? (
        <Box sx={aorSelectionStyles.gridContainer}>
          {areasOfResponsibility.aors.map((aor) => {
            const isSelected = selectedAORs.includes(aor._id);
            const isLocked = aor.isLocked;
            const isDisabled = isRedirecting;

            return (
              <Box
                key={aor._id}
                onClick={
                  !isDisabled ? () => handleAORToggle(aor._id) : undefined
                }
                sx={
                  {
                    ...aorSelectionStyles.aorBox,
                    ...(isSelected
                      ? aorSelectionStyles.selectedBox
                      : aorSelectionStyles.unselectedBox),
                    ...(isRedirecting ? { pointerEvents: "none" } : {}),
                  } as SxProps<Theme>
                }
              >
                <Box
                  sx={
                    isSelected
                      ? aorSelectionStyles.iconContainerSelected
                      : aorSelectionStyles.iconContainerUnselected
                  }
                >
                  <Image
                    src={imageUrls.vector}
                    alt="icon"
                    width={18}
                    height={18}
                  />
                </Box>

                <Tooltip
                  title={isLocked ? t("areaSelection.alreadyInUse") : ""}
                >
                  <Typography sx={aorSelectionStyles.aorLabel}>
                    {aor.name}
                  </Typography>
                </Tooltip>

                {isSelected && (
                  <CheckCircleIcon sx={aorSelectionStyles.aorIcon} />
                )}
              </Box>
            );
          })}
        </Box>
      ) : (
        <Typography
          sx={{
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: "16px",
            fontWeight: 400,
            textAlign: "center",
          }}
        >
          {t("areaSelection.aorPlaceholder") ||
            "The assigned AOR will appear here."}
        </Typography>
      )}
    </Box>
  );

  return (
    <Container maxWidth="sm" sx={styles.cardContainer}>
      <Typography variant="h5" sx={styles.title}>
        {t("areaSelection.title")}
      </Typography>
      <Typography variant="body2" sx={styles.subtitle}>
        {t("areaSelection.subtitle")}
      </Typography>

      {renderCompanySelect()}
      {renderAORGrid()}

      <Box sx={styles.buttonContainer}>
        <Button
          variant="contained"
          sx={styles.backButton}
          onClick={router.back}
          disabled={isRedirecting}
        >
          <Typography sx={styles.submitButtonText}>
            {t("common.back")}
          </Typography>
        </Button>
        <Button
          variant="contained"
          size="large"
          sx={styles.submitButton}
          onClick={handleStartShift}
          disabled={
            isRedirecting ||
            selectedAORs.length === 0 ||
            selectedCompanies.length === 0
          }
        >
          {isRedirecting ? (
            <LoadingSpinner size={24} sx={{ color: "white" }} />
          ) : (
            <Typography sx={styles.submitButtonText}>
              {t("areaSelection.startShift")}
            </Typography>
          )}
        </Button>
      </Box>

      <DynamicModal
        open={lockedAorModal.open}
        onClose={() => setLockedAorModal({ open: false })}
        title={t("areaSelection.UnlockedTitle", {
          aor: lockedAorModal.aorName,
        })}
        cancelLabel={t("common.cancel")}
        actionLabel={t("common.end")}
        onAction={() => {
          if (lockedAorModal.aorId) {
            dispatch(endAorThunk({ aorId: lockedAorModal.aorId }));
            dispatch(setStoppedAor(true));
          }
          setLockedAorModal({ open: false });
        }}
        showMicIcon={false}
      >
        <Typography sx={{ color: "white" }}>
          {t("areaSelection.lockedMessage", {
            aor: lockedAorModal.aorName,
            lockedByName: lockedAorModal.lockedByName,
          })}
        </Typography>
      </DynamicModal>
    </Container>
  );
}
