"use client";

import React, { useState } from "react";
import { Box, Typography, Button, Tabs, Tab, Stack } from "@mui/material";
import { shiftChangeHeaderStyles } from "../../styles/shiftChangeForm.styles";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  endAorThunk,
  fetchShiftFormTemplate,
  setActiveAorThunk,
  setStoppedAor,
} from "@/src/store/slices/shiftChangeSlice";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import IconMapper from "../common/iconMapper";
import { ShiftChangeHeaderProps } from "@/src/types/shiftChange.types";
import { imageUrls, MAX_AOR } from "@/src/utils/constant";
import { useEffect } from "react";
import AddAorModal from "./addAorModal";
import { fetchActiveShifts } from "@/src/store/slices/shiftChangeSlice";
import { RBAC } from "@/src/utils/protectedElements";
import { UserRole } from "@/src/types/auth.types";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import DynamicModal from "@/src/components/common/modal";
import { setSelectedAOR } from "@/src/store/slices/electronicLogSlice";
import LoadingSpinner from "../common/loader";

const ShiftChangeHeader: React.FC<ShiftChangeHeaderProps> = ({
  onShiftChange,
  onAorChange,
  steps,
  step,
  setStep,
  title,
  description,
  currentAorId,
  onSaveForm,
  disabledSaveButton = false,
  sectionStatuses,
  noFormTemplate,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const getStorageKey = (shiftAorId: string) => `visitedSteps_${shiftAorId}`;

  const [visitedSteps, setVisitedSteps] = React.useState<{
    [aorId: string]: Set<number>;
  }>(() => {
    const stored: { [aorId: string]: Set<number> } = {};
    if (typeof window !== "undefined") {
      try {
        Object.keys(window.sessionStorage).forEach((key) => {
          if (key.startsWith("visitedSteps_")) {
            const aorId = key.replace("visitedSteps_", "");
            const storedArray = JSON.parse(
              window.sessionStorage.getItem(key) || "[]",
            );
            stored[aorId] = new Set(storedArray);
          }
        });
      } catch (error) {
        console.warn(
          "Failed to load visited steps from sessionStorage:",
          error,
        );
      }
    }
    return stored;
  });

  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const { activeShifts, formtemplateLoading, shiftLoading } = useAppSelector(
    (state) => state.shiftChange,
  );
  const { selectedRole } = useAppSelector((state) => state.auth);
  const allShiftAors = React.useMemo(
    () =>
      activeShifts.flatMap((shift) =>
        (shift.shiftAors ?? []).filter((shift) => shift.aor?._id),
      ),
    [activeShifts],
  );

  const remainingAorSlots = Math.max(0, MAX_AOR - allShiftAors.length);
  const tabLabels = React.useMemo(
    () =>
      allShiftAors
        .filter((sa) => sa.aor && sa.aor._id)
        .map((sa) => ({
          label: sa.aor?.name,
          color: sa.aor?.color,
          aorId: sa.aor?._id,
          shiftAorId: sa._id,
          shiftId: sa.shiftId,
          isActive: sa.isActive,
        })),
    [allShiftAors],
  );
  const defaultTabIndex = React.useMemo(() => {
    if (tabLabels.length === 0) return 0;
    const activeIndex = tabLabels.findIndex((shift) => shift.isActive);
    return activeIndex !== -1 ? activeIndex : 0;
  }, [tabLabels]);
  const [tab, setTab] = React.useState(0);
  const selectedShiftColor = tabLabels[tab]?.color || "#3D96E1";
  const hasFormTemplate = !formtemplateLoading[tabLabels[tab]?.aorId];
  const styles = shiftChangeHeaderStyles(theme, selectedShiftColor);
  const currentShiftAorId = tabLabels[tab]?.shiftAorId;
  const currentSectionStatuses = sectionStatuses?.[currentShiftAorId] || [];
  const [modalOpen, setModalOpen] = useState(false);
  const [endingShift, setEndingShift] = useState(false);
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModall = () => setModalOpen(false);

  const { stoppedAor } = useAppSelector((state) => state.shiftChange);
  const { onRefetch } = useAppSelector((state) => state.auth);
  useEffect(() => {
    if (tabLabels.length > 0 && !stoppedAor) {
      setTab(defaultTabIndex);
    }
  }, [defaultTabIndex, tabLabels.length, stoppedAor]);

  React.useEffect(() => {
    if (!currentShiftAorId) return;
    setVisitedSteps((prev) => {
      const newObj = { ...prev };
      const setForAor = new Set(newObj[currentShiftAorId] || []);
      setForAor.add(step);
      newObj[currentShiftAorId] = setForAor;
      if (typeof window !== "undefined") {
        try {
          const storageKey = getStorageKey(currentShiftAorId);
          window.sessionStorage.setItem(
            storageKey,
            JSON.stringify(Array.from(setForAor)),
          );
        } catch (error) {
          console.warn(
            "Failed to save visited steps to sessionStorage:",
            error,
          );
        }
      }
      return newObj;
    });
  }, [step, currentShiftAorId]);





  useEffect(() => {
    if (activeShifts.length > 0) {
      const activeShiftAor = allShiftAors.find((aor) => aor.isActive);
      if (activeShiftAor?.aor?._id && selectedRole !== UserRole.Observer) {
        dispatch(setActiveAorThunk(activeShiftAor.aor._id));
        dispatch(setSelectedAOR(activeShiftAor.aor._id));
      }
    }
  }, [activeShifts, allShiftAors, dispatch]);

  const handleTabChange = React.useCallback(
    async (event: React.SyntheticEvent, newValue: number) => {
      if (newValue === tab) return;
      const selectedShift = tabLabels[newValue];
      if (!selectedShift) return;
      setTab(newValue);
      onShiftChange?.(selectedShift.label);
      onAorChange?.(selectedShift.shiftAorId);
      dispatch(setSelectedAOR(selectedShift.aorId));
      dispatch(
        fetchShiftFormTemplate({ shiftAorId: selectedShift.shiftAorId }),
      );
      if (selectedShift.aorId && selectedRole !== UserRole.Observer) {
        try {
          await dispatch(setActiveAorThunk(selectedShift.aorId)).unwrap();
        } catch (error) {
          dispatch(
            showAlert({
              message:
                (error as string) ||
                t("shiftChangeHeader.failedToSetActiveAor"),
              type: AlertType.Error,
            }),
          );
        }
      }
    },
    [tab, tabLabels, onShiftChange, onAorChange, dispatch, t],
  );

  const handleAddClick = React.useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const handleCloseModal = React.useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const handleModalSuccess = React.useCallback(() => {
    dispatch(fetchActiveShifts());
  }, [dispatch, onRefetch]);

  const displayTitle = React.useMemo(
    () =>
      title ||
      (tabLabels[tab]?.label
        ? t("shiftChangeHeader.title", {
            company: tabLabels[tab].label,
          })
        : t("shiftChangeHeader.title", { company: "" })),
    [title, tabLabels, tab, t],
  );

  const isCurrentAorLoading = currentAorId
    ? formtemplateLoading[currentAorId]
    : false;

  const handleConfirm = async () => {
    const selectedAorId = tabLabels[tab]?.aorId;
    if (!selectedAorId) return;
    try {
      setEndingShift(true);
      await dispatch(endAorThunk({ aorId: selectedAorId })).unwrap();
      dispatch(
        showAlert({
          message: t("shiftChangeHeader.aorEndSuccess"),
          type: AlertType.Success,
        }),
      );
      await dispatch(fetchActiveShifts());
      handleCloseModall();
      dispatch(setStoppedAor(true));
    } catch (error) {
      dispatch(
        showAlert({
          message: (error as string) || t("shiftChangeHeader.aorEndFailed"),
          type: AlertType.Error,
        }),
      );
    } finally {
      setEndingShift(false);
    }
  };

  useEffect(() => {
    if (stoppedAor && allShiftAors.length > 0) {
      const activeShiftAor = allShiftAors.find((aor) => aor.isActive);

      if (activeShiftAor?.aor?._id) {
        const newTabIndex = tabLabels.findIndex(
          (shift) => shift.aorId === activeShiftAor.aor._id,
        );

        if (newTabIndex !== -1) {
          setTab(newTabIndex);
          onShiftChange?.(activeShiftAor.aor.name);
          onAorChange?.(activeShiftAor._id);
          dispatch(setSelectedAOR(activeShiftAor.aor._id));

          if (selectedRole !== UserRole.Observer) {
            dispatch(setActiveAorThunk(activeShiftAor.aor._id));
          }
        }
      }
      dispatch(setStoppedAor(false));
    } else if (stoppedAor && allShiftAors.length === 0) {
      setTab(0);
      dispatch(setStoppedAor(false));
    }
  }, [
    stoppedAor,
    allShiftAors,
    tabLabels,
    dispatch,
    onShiftChange,
    onAorChange,
    selectedRole,
  ]);

  return (
    <>
      <Box sx={styles.container}>
        <Box sx={styles.tabsContainer}>
          <Tabs value={tab} onChange={handleTabChange} sx={styles.tabsFlex}>
            {tabLabels.map((shift, index) => (
              <Tab
                key={`${shift.shiftAorId}-${index}`}
                label={
                  <Box sx={styles.tabContentWrapper}>
                    <Box sx={styles.tabLabel}>
                      {tab !== index && (
                        <Box
                          sx={{
                            ...styles.companyDot,
                            backgroundColor: shift.color,
                          }}
                        />
                      )}
                      <span
                        style={{
                          color: tab === index ? shift.color : undefined,
                        }}
                      >
                        {shift.label}
                      </span>
                    </Box>
                  </Box>
                }
                sx={styles.tab}
                disableRipple
              />
            ))}
          </Tabs>
          <RBAC
            allowedRoles={[UserRole.Administrator, UserRole.ActiveController]}
          >
            {allShiftAors.length > 0 && (
              <Box sx={styles.addButtonContainer}>
                <Image
                  src={imageUrls.add}
                  alt={t("shiftChangeHeader.addAOR")}
                  width={20}
                  height={18}
                  onClick={handleAddClick}
                />
              </Box>
            )}
          </RBAC>
        </Box>

        <Box sx={styles.contentContainer}>
          {shiftLoading ? (
            <Box sx={styles.noFormMessage_1}>
              <LoadingSpinner />
            </Box>
          ) : activeShifts.length === 0 ? (
            <Box sx={styles.noFormMessage_1}>
              {t("shiftChangeHeader.shiftInactive")}
            </Box>
          ) : allShiftAors.length === 0 ? (
            <Box sx={styles.noFormMessage_1}>
              {t("shiftChangeHeader.noActiveShiftAorsFound")}
            </Box>
          ) : (
            <>
              <Box sx={styles.headerRow}>
                <Box sx={styles.titleSection}>
                  <Typography sx={styles.title}>{displayTitle}</Typography>
                  {description && (
                    <Typography sx={styles.subtitle}>{description}</Typography>
                  )}
                </Box>
                <RBAC
                  allowedRoles={[
                    UserRole.Administrator,
                    UserRole.ActiveController,
                  ]}
                >
                  <Button
                    sx={{
                      ...styles.saveButton,
                      mr: 2,
                    }}
                    onClick={handleOpenModal}
                  >
                    <StopCircleOutlinedIcon
                      sx={{ color: "red", width: 20, height: 20, mr: 1 }}
                    />
                    {t("shiftChangeHeader.stopAOR")}
                  </Button>
                  {!noFormTemplate && (
                    <Button
                      sx={styles.saveButton}
                      onClick={onSaveForm}
                      disabled={disabledSaveButton}
                    >
                      <Image
                        src={imageUrls.save}
                        alt="Save"
                        width={16}
                        height={16}
                        style={styles.saveButtonImage}
                      />
                      {t("shiftChangeHeader.saveButton")}
                    </Button>
                  )}
                </RBAC>
              </Box>
              {hasFormTemplate ? (
                <Stack direction="row" sx={styles.stepsContainer}>
                  {steps.map((stepObj, index) => (
                    <Button
                      key={`${stepObj.label}-${index}`}
                      onClick={() => setStep(index)}
                      sx={
                        index === step
                          ? styles.stepButtonActive
                          : styles.stepButton
                      }
                      disabled={isCurrentAorLoading}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <IconMapper
                          icon={stepObj.icon}
                          fontSize="small"
                          color={index === step ? "#FFF" : "#3B96E1"}
                        />
                        {stepObj.label}
                        {index !== step &&
                          visitedSteps[currentShiftAorId]?.has(index) &&
                          currentSectionStatuses &&
                          currentSectionStatuses[index] !== null &&
                          currentSectionStatuses[index] !== undefined && (
                            <span
                              style={{
                                display: "inline-block",
                                width: 10,
                                height: 10,
                                minWidth: 10,
                                minHeight: 10,
                                maxWidth: 10,
                                maxHeight: 10,
                                borderRadius: "50%",
                                marginLeft: 6,
                                background: currentSectionStatuses[index]
                                  ? "#4CAF50"
                                  : "#F44336",
                                flexShrink: 0,
                                flexGrow: 0,
                              }}
                            />
                          )}
                      </span>
                    </Button>
                  ))}
                </Stack>
              ) : (
                <Box sx={styles.noFormMessage}>
                  {t("shiftChangeHeader.noFormAssociated")}
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>

      <AddAorModal
        open={isAddModalOpen}
        onClose={handleCloseModal}
        remainingAorSlots={remainingAorSlots}
        onSuccess={handleModalSuccess}
      />

      <DynamicModal
        open={modalOpen}
        onClose={handleCloseModall}
        title={t("shiftChangeHeader.endAorTitle")}
        width={400}
        cancelLabel={t("shiftChangeHeader.cancel")}
        actionLabel={t("shiftChangeHeader.confirm")}
        onAction={handleConfirm}
        showMicIcon={false}
        actionDisabled={endingShift}
      >
        <Box sx={styles.endAor}>
          <Typography variant="body1" sx={{ mb: 1, mt: 1 }}>
            {t("shiftChangeHeader.endShiftNotice")}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {t("shiftChangeHeader.completeTasksNotice")}
          </Typography>
          <Typography variant="body2" sx={{ color: "red" }}>
            {t("shiftChangeHeader.irreversibleNotice")}
          </Typography>

          {endingShift && (
            <Typography variant="body2" sx={{ mt: 2, color: "#ccc" }}>
              {t("shiftChangeHeader.waitEnding")}
            </Typography>
          )}
        </Box>
      </DynamicModal>
    </>
  );
};

export default ShiftChangeHeader;
