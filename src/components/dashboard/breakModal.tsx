"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import DynamicModal from "@/src/components/common/modal";
import DynamicForm from "@/src/components/common/formModal";
import { FieldConfig, AlertType } from "@/src/types/types";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  getFatigueMitigations,
  applyFatigueMitigationAction,
} from "@/src/store/slices/fatigueSlice";
import { FatigueMitigationType } from "@/src/types/fatigue.types";
import { showAlert } from "@/src/store/slices/alertSlice";
import { useTranslation } from "@/src/hooks/useTranslation";

interface BreakModalProps {
  open: boolean;
  onClose: () => void;
  onApplied?: (data: Record<string, unknown>) => void;
}

const BreakModal: React.FC<BreakModalProps> = ({
  open,
  onClose,
  onApplied,
}) => {
  const dispatch = useAppDispatch();
  const { mitigations, loading, applyLoading } = useAppSelector(
    (state) => state.fatigue,
  );

  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const { t } = useTranslation();
  useEffect(() => {
    if (open) {
      setFormValues({});
      dispatch(getFatigueMitigations());
    }
  }, [open, dispatch]);

  const timerOptions =
    mitigations
      ?.filter((m) => m.type === FatigueMitigationType.TIMER)
      .map((m) => ({
        label: `${m.name} ${t("dashboard.mins")} (${m.credit})`,
        value: m._id,
      })) || [];

  const countermeasureOptions =
    mitigations
      ?.filter((m) => m.type === FatigueMitigationType.COUNTERMEASURE)
      .map((m) => ({
        label: `${m.name} (${m.credit})`,
        value: m._id,
      })) || [];

  const fields: FieldConfig[] = [
    {
      name: "duration",
      label: t("dashboard.breakDuration"),
      type: "select",
      placeholder: t("dashboard.selectTimerOption"),
      options: timerOptions,
    },
    {
      name: "countermeasures",
      label: t("dashboard.shiftCountermeasures"),
      type: "checkbox",
      required: false,
      options: countermeasureOptions,
    },
  ];

  const handleFormChange = (name: string, value: unknown) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    const mitigationIds: string[] = [];

    if (values.duration) mitigationIds.push(values.duration as string);
    if (Array.isArray(values.countermeasures))
      mitigationIds.push(...(values.countermeasures as string[]));

    if (mitigationIds.length === 0) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: t("dashboard.selectAtLeastOneMitigation"),
        }),
      );
      return;
    }

    try {
      const response = await dispatch(
        applyFatigueMitigationAction({ mitigationIds }),
      ).unwrap();

      dispatch(
        showAlert({
          type: AlertType.Success,
          message:
            response?.message || t("dashboard.mitigationAppliedSuccessfully"),
        }),
      );

      if (onApplied) onApplied(values);
      onClose();
    } catch (error: any) {
      const errorMsg =
        typeof error === "string"
          ? error
          : error?.message || t("dashboard.failedToApplyMitigations");
      dispatch(showAlert({ type: AlertType.Error, message: errorMsg }));
    }
  };

  return (
    <DynamicModal
      open={open}
      onClose={onClose}
      title={t("dashboard.breakTimer")}
      width={500}
      showMicIcon={false}
      onAction={() => document.getElementById("dynamic-form-submit")?.click()}
    >
      <Box>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
            }}
          >
            <CircularProgress sx={{ color: "#3D96E1" }} size={40} />
          </Box>
        ) : (
          <DynamicForm
            fields={fields}
            initialValues={formValues}
            onFormValueChange={handleFormChange}
            onSubmit={handleSubmit}
            onCancel={onClose}
            submitLabel={
              applyLoading ? t("dashboard.applying") : t("dashboard.apply")
            }
          />
        )}
      </Box>
    </DynamicModal>
  );
};

export default BreakModal;
