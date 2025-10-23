"use client";

import React from "react";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch } from "@/src/hooks/redux";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType, FieldConfig } from "@/src/types/types";
import DynamicForm from "@/src/components/common/formModal";
import DynamicModal from "@/src/components/common/modal";
import { updateSleepHours } from "@/src/store/slices/sleepHoursSlice";

interface EditSleepHoursModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  sleepHours: { _id: string; hours: number; credit: number } | null;
}

interface SleepHoursFormData {
  hours: number;
  credit: number;
  [key: string]: unknown;
}

const EditSleepHoursModal: React.FC<EditSleepHoursModalProps> = ({
  open,
  onClose,
  onSuccess,
  sleepHours,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const fields: FieldConfig[] = [
    {
      name: "hours",
      label: t("sleepHours.hours"),
      type: "number",
      required: true,
      placeholder: t("sleepHours.enterHours"),
      min: 0,
      max: 24,
    },
    {
      name: "credit",
      label: t("sleepHours.credit"),
      type: "number",
      required: true,
      placeholder: t("sleepHours.enterCredit"),
      min: -100,
      max: 100,
    },
  ];

  const initialValues: SleepHoursFormData = {
    hours: sleepHours?.hours ?? 0,
    credit: sleepHours?.credit ?? 0,
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!sleepHours) return;

    try {
      const formData = values as SleepHoursFormData;
      await dispatch(
        updateSleepHours({
          sleepHoursId: sleepHours._id,
          payload: {
            hours: Number(formData.hours),
            credit: Number(formData.credit),
          },
        }),
      ).unwrap();

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("sleepHours.updateSuccess"),
        }),
      );
      onSuccess?.();
      onClose();
    } catch (error) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message:
            typeof error === "string" ? error : t("sleepHours.updateFailed"),
        }),
      );
    }
  };

  return (
    <DynamicModal
      open={open}
      onClose={onClose}
      title={t("sleepHours.edit")}
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

export default EditSleepHoursModal;
