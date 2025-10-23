"use client";

import React from "react";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch } from "@/src/hooks/redux";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType, FieldConfig } from "@/src/types/types";
import DynamicForm from "@/src/components/common/formModal";
import DynamicModal from "@/src/components/common/modal";
import { createShiftHours } from "@/src/store/slices/shiftHoursSlice"; // shift hours slice

interface AddShiftHoursModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ShiftHoursFormData {
  hours: number;
  credit: number;
  [key: string]: unknown;
}

const AddShiftHoursModal: React.FC<AddShiftHoursModalProps> = ({
  open,
  onClose,
  onSuccess,
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

  const initialValues = {
    hours: 0,
    credit: 0,
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      const formData = values as ShiftHoursFormData;
      await dispatch(
        createShiftHours({
          hours: Number(formData.hours),
          credit: Number(formData.credit),
        }),
      ).unwrap();

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("shiftHours.createSuccess"),
        }),
      );
      onSuccess?.();
      onClose();
    } catch (error) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message:
            typeof error === "string" ? error : t("shiftHours.createFailed"),
        }),
      );
    }
  };

  return (
    <DynamicModal
      open={open}
      onClose={onClose}
      title={t("shiftHours.addNew")}
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

export default AddShiftHoursModal;
