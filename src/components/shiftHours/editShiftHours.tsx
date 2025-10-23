"use client";

import React from "react";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch } from "@/src/hooks/redux";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType, FieldConfig } from "@/src/types/types";
import DynamicForm from "@/src/components/common/formModal";
import DynamicModal from "@/src/components/common/modal";
import { updateShiftHours } from "@/src/store/slices/shiftHoursSlice"; // shift hours slice

interface EditShiftHoursModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  shiftHours: { _id: string; hours: number; credit: number } | null;
}

interface ShiftHoursFormData {
  hours: number;
  credit: number;
  [key: string]: unknown;
}

const EditShiftHoursModal: React.FC<EditShiftHoursModalProps> = ({
  open,
  onClose,
  onSuccess,
  shiftHours,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const fields: FieldConfig[] = [
    {
      name: "hours",
      label: t("shiftHours.hours"),
      type: "number",
      required: true,
      placeholder: t("shiftHours.enterHours"),
      min: 0,
      max: 24,
    },
    {
      name: "credit",
      label: t("shiftHours.credit"),
      type: "number",
      required: true,
      placeholder: t("shiftHours.enterCredit"),
      min: 0,
      max: 1,
    },
  ];

  const initialValues: ShiftHoursFormData = {
    hours: shiftHours?.hours ?? 0,
    credit: shiftHours?.credit ?? 0,
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!shiftHours) return;

    try {
      const formData = values as ShiftHoursFormData;
      await dispatch(
        updateShiftHours({
          shiftHoursId: shiftHours._id,
          payload: {
            hours: Number(formData.hours),
            credit: Number(formData.credit),
          },
        }),
      ).unwrap();

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("shiftHours.updateSuccess"),
        }),
      );
      onSuccess?.();
      onClose();
    } catch (error) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message:
            typeof error === "string" ? error : t("shiftHours.updateFailed"),
        }),
      );
    }
  };

  return (
    <DynamicModal
      open={open}
      onClose={onClose}
      title={t("shiftHours.edit")}
      onAction={() => document.getElementById("dynamic-form-submit")?.click()}
      width={500}
    >
      <DynamicForm
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={onClose}
        initialValues={initialValues}
      />
    </DynamicModal>
  );
};

export default EditShiftHoursModal;
