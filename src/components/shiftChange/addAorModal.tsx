"use client";

import React from "react";
import {
  Box,
  Grid,
  CircularProgress,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
  Button,
} from "@mui/material";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  fetchAreasOfResponsibility,
  assignShiftAction,
  fetchCompanies,
} from "@/src/store/slices/onboardingSlice";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import DynamicModal from "@/src/components/common/modal";
import { ADDAOR } from "@/src/types/shiftChange.types";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  endAorThunk,
  setStoppedAor,
} from "@/src/store/slices/shiftChangeSlice";
import { styles } from "@/src/styles/aorModal.styles";
import {
  getShiftTimeByAor,
  getWorkStats,
} from "@/src/store/slices/dashboardSlice";

interface AddAorModalProps {
  open: boolean;
  onClose: () => void;
  remainingAorSlots: number;
  onSuccess?: () => void;
}

const AddAorModal: React.FC<AddAorModalProps> = ({
  open,
  onClose,
  remainingAorSlots,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedCompany, setSelectedCompany] = React.useState<string[]>([]);
  const [tempCompany, setTempCompany] = React.useState<string[]>([]);
  // const [companyOpen, setCompanyOpen] = React.useState(false);
  const [showAorGrid, setShowAorGrid] = React.useState(false);

  const [selectedAors, setSelectedAors] = React.useState<string[]>([]);
  const [modalAorData, setModalAorData] = React.useState<{
    aors: ADDAOR[];
  } | null>(null);
  const [isLoadingAors, setIsLoadingAors] = React.useState(false);
  const [hasInitialized, setHasInitialized] = React.useState(false);
  const selectedAorsBeforeUnlockRef = React.useRef<string[]>([]);
  const [lockedAorModal, setLockedAorModal] = React.useState<{
    open: boolean;
    aorId?: string;
    aorName?: string;
    lockedByName?: string;
  }>({ open: false });

  const { companies, areasOfResponsibility } = useAppSelector(
    (state) => state.onboarding,
  );
  const { stoppedAor } = useAppSelector((state) => state.shiftChange);
  const recentAorIds: string[] = React.useMemo(
    () => areasOfResponsibility?.activeAors ?? [],
    [areasOfResponsibility],
  );

  React.useEffect(() => {
    if (open && !hasInitialized) {
      dispatch(fetchCompanies());
      setHasInitialized(true);
    }
  }, [open, hasInitialized, dispatch]);

  React.useEffect(() => {
    if (!open) {
      setSelectedCompany([]);
      setTempCompany([]);
      setSelectedAors([]);
      setModalAorData(null);
      setIsLoadingAors(false);
      setIsSubmitting(false);
      setHasInitialized(false);
      setShowAorGrid(false);
    }
  }, [open]);

  const companyOptions = React.useMemo(
    () => (companies || []).map((c) => ({ label: c.name, value: c._id })),
    [companies],
  );

  React.useEffect(() => {
    if (stoppedAor && showAorGrid && selectedCompany.length > 0) {
      setIsLoadingAors(true);
      setModalAorData(null);

      const fetchAors = async () => {
        try {
          const result = await dispatch(
            fetchAreasOfResponsibility(selectedCompany),
          );
          if (fetchAreasOfResponsibility.fulfilled.match(result)) {
            setModalAorData(result.payload);

            if (selectedAorsBeforeUnlockRef.current.length > 0) {
              const stillValid = selectedAorsBeforeUnlockRef.current.filter(
                (aorId) =>
                  result.payload.aors.some(
                    (aor: any) => aor._id === aorId && !aor.isLocked,
                  ),
              );
              setSelectedAors(stillValid);
              selectedAorsBeforeUnlockRef.current = [];
            }
          }
        } catch {
          dispatch(
            showAlert({
              message: t("common.errorAor"),
              type: AlertType.Error,
            }),
          );
          setModalAorData(null);
        } finally {
          setIsLoadingAors(false);
        }
      };

      fetchAors();
    }
  }, [stoppedAor, showAorGrid, selectedCompany, dispatch, t]);

  const handleAorClick = React.useCallback(
    (aorId: string) => {
      const aor = modalAorData?.aors.find((a) => a._id === aorId);
      if (!aor) return;

      if (aor.isLocked || recentAorIds.includes(aorId)) {
        setLockedAorModal({
          open: true,
          aorId: aor._id,
          aorName: aor.name,
          lockedByName: aor.lockedByName,
        });
        return;
      }

      setSelectedAors((prev) => {
        const isSelected = prev.includes(aorId);
        if (isSelected) return prev.filter((id) => id !== aorId);
        if (prev.length < remainingAorSlots) return [...prev, aorId];
        return prev;
      });
    },
    [modalAorData?.aors, recentAorIds, remainingAorSlots],
  );

  const handleCloseModal = React.useCallback(() => onClose(), [onClose]);

  const handleFormSubmit = React.useCallback(async () => {
    if (!selectedAors.length || !selectedCompany.length) return;

    setIsSubmitting(true);
    try {
      await dispatch(assignShiftAction({ aorId: selectedAors })).unwrap();
      dispatch(getShiftTimeByAor());
      dispatch(getWorkStats());
      dispatch(
        showAlert({
          message: t("shiftChangeHeader.successfullyAssigned"),
          type: AlertType.Success,
        }),
      );
      onSuccess?.();
      handleCloseModal();
    } catch {
      dispatch(
        showAlert({
          message: t("shiftChangeHeader.failedToSaveShiftFormValues"),
          type: AlertType.Error,
        }),
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedAors, selectedCompany, dispatch, handleCloseModal, onSuccess, t]);

  // const handleCompanyDropdownClose = () => {
  //   setCompanyOpen(false);
  // };

  const handleSelectButtonClick = async () => {
    if (tempCompany.length === 0) return;

    const changed =
      tempCompany.length !== selectedCompany.length ||
      !tempCompany.every((id, idx) => id === selectedCompany[idx]);

    if (changed) {
      setSelectedCompany([...tempCompany]);
      setIsLoadingAors(true);
      setModalAorData(null);
      setSelectedAors([]);

      try {
        const result = await dispatch(fetchAreasOfResponsibility(tempCompany));
        if (fetchAreasOfResponsibility.fulfilled.match(result)) {
          setModalAorData(result.payload);
        }
      } catch {
        dispatch(
          showAlert({
            message: t("common.errorAor"),
            type: AlertType.Error,
          }),
        );
        setModalAorData(null);
      } finally {
        setIsLoadingAors(false);
      }
    }
    setShowAorGrid(true);
  };

  const isFormValid = selectedCompany.length > 0 && selectedAors.length > 0;

  const aorItem = (isSelected: boolean, isDisabled: boolean) => ({
    borderRadius: "12px",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    cursor: isDisabled ? "not-allowed" : "pointer",
    position: "relative",
    height: "40px",
    width: "100%",
    minWidth: 0,
    backgroundColor: isSelected
      ? "#3D96E133"
      : isDisabled
        ? "#1A1A1A15"
        : "#1A1A1A26",
    color: isSelected ? "#FFFFFF" : isDisabled ? "#666" : "#FFFFFF",
    border: isSelected ? "2px solid #3D96E1" : "1px solid #A0A3BD",
    "&:hover": isDisabled
      ? {}
      : {
          boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          borderColor: "#3D96E1",
          backgroundColor: "rgba(61, 150, 225, 0.1)",
        },
  });

  if (!open) return null;

  return (
    <>
      <DynamicModal
        open={open}
        onClose={handleCloseModal}
        title={t("shiftChangeHeader.modalTitle")}
        width={500}
        showMicIcon={false}
        actionLabel={
          isSubmitting
            ? t("shiftChangeHeader.modalSaveButtonLoading")
            : t("shiftChangeHeader.modalSaveButton")
        }
        cancelLabel={t("shiftChangeHeader.modalCancelButton")}
        onAction={handleFormSubmit}
        actionDisabled={!isFormValid || isSubmitting}
      >
        <Box sx={styles.modalContent}>
          <Box sx={styles.companySelectWrapper}>
            <Typography sx={styles.aorLabel}>Select Companies</Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <FormControl fullWidth sx={{ flex: 1 }}>
                <Select
                  multiple
                  displayEmpty
                  value={tempCompany}
                  onChange={(e) => {
                    setTempCompany(e.target.value as string[]);
                    setShowAorGrid(false);
                    setSelectedAors([]);
                  }}
                  // onOpen={() => setCompanyOpen(true)}
                  // onClose={handleCompanyDropdownClose}
                  sx={styles.select}
                  renderValue={(selected) =>
                    selected.length === 0
                      ? t("shiftChangeHeader.selectCompany")
                      : selected
                          .map((id) => {
                            const company = companyOptions.find(
                              (c) => c.value === id,
                            );
                            return company?.label;
                          })
                          .join(", ")
                  }
                  MenuProps={{ PaperProps: { sx: styles.menuPaper } }}
                >
                  {companyOptions.map((c) => (
                    <MenuItem key={c.value} value={c.value}>
                      {c.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onMouseDown={handleSelectButtonClick}
                disabled={tempCompany.length === 0 || isSubmitting}
                sx={styles.submitButton}
              >
                {t("shiftChangeHeader.select")}
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              marginTop: "6px",
              minHeight: "200px",
              display: "flex",
              alignItems:
                showAorGrid &&
                selectedCompany.length > 0 &&
                modalAorData?.aors?.length
                  ? "flex-start"
                  : "center",
              justifyContent:
                showAorGrid &&
                selectedCompany.length > 0 &&
                modalAorData?.aors?.length
                  ? "flex-start"
                  : "center",
            }}
          >
            {!showAorGrid || selectedCompany.length === 0 ? (
              <Box sx={styles.placeholderAorBox}>
                <Typography sx={styles.placeholderAorText}>
                  {t("shiftChangeHeader.displayAor")}
                </Typography>
              </Box>
            ) : isLoadingAors ? (
              <Box sx={styles.loadingWrapper}>
                <CircularProgress size={40} />
              </Box>
            ) : !modalAorData?.aors?.length ? (
              <Box sx={styles.noAorBox}>
                <Typography sx={styles.noAorText}>
                  {t("shiftChangeHeader.noAorsAvailable")}
                </Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ width: "100%" }}>
                  <Typography sx={styles.aorLabel}>
                    {t("shiftChangeHeader.inputLabelAor")}
                    {selectedAors.length > 0 && (
                      <Box component="span" sx={styles.aorCount}>
                        ({selectedAors.length}/{remainingAorSlots})
                      </Box>
                    )}
                  </Typography>

                  <Box sx={styles.aorGridWrapper}>
                    <Grid container spacing={2} sx={{ flexWrap: "wrap" }}>
                      {modalAorData.aors.map((aor) => {
                        const isSelected = selectedAors.includes(aor._id);
                        const isLocked = aor.isLocked;
                        const isActive = recentAorIds.includes(aor._id);
                        const isDisabled = isActive;

                        return (
                          <Grid
                            size={{ xs: 12, sm: 6 }}
                            key={aor._id}
                            sx={{ marginTop: 1 }}
                          >
                            <Tooltip
                              title={
                                isLocked
                                  ? t("shiftChangeHeader.aorAlreadyInUse")
                                  : ""
                              }
                              arrow
                            >
                              <Box
                                sx={aorItem(isSelected, isDisabled)}
                                onClick={() =>
                                  !isDisabled && handleAorClick(aor._id)
                                }
                              >
                                <Typography sx={styles.aorText}>
                                  {aor.name}
                                  {isActive && " (Active)"}
                                </Typography>

                                {isSelected && (
                                  <CheckCircleIcon sx={styles.checkIcon} />
                                )}
                              </Box>
                            </Tooltip>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </DynamicModal>

      <DynamicModal
        open={lockedAorModal.open}
        onClose={() => setLockedAorModal({ open: false })}
        title={t("shiftChangeHeader.lockedAorTitle", {
          aor: lockedAorModal.aorName,
        })}
        cancelLabel={t("common.cancel")}
        actionLabel={t("common.end")}
        showMicIcon={false}
        onAction={() => {
          if (lockedAorModal.aorId) {
            selectedAorsBeforeUnlockRef.current = [...selectedAors];

            dispatch(endAorThunk({ aorId: lockedAorModal.aorId }));
            dispatch(setStoppedAor(true));
          }
          setLockedAorModal({ open: false });
        }}
      >
        <Typography sx={styles.lockedAorText}>
          {t("shiftChangeHeader.lockedAorMessage", {
            aor: lockedAorModal.aorName,
            lockedByName: lockedAorModal.lockedByName || "another user",
          })}
        </Typography>
      </DynamicModal>
    </>
  );
};

export default AddAorModal;
