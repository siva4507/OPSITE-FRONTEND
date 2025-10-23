"use client";

import React from "react";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch } from "@/src/hooks/redux";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType, FieldConfig } from "@/src/types/types";
import DynamicForm from "@/src/components/common/formModal";
import DynamicModal from "@/src/components/common/modal";
import { updateHitchDay } from "@/src/store/slices/hitchDaySlice";

interface EditHitchDayModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  hitchDay: { _id: string; day: string; credit: number } | null;
}

interface HitchDayFormData {
  day: string;
  credit: number;
  [key: string]: unknown;
}

const EditHitchDayModal: React.FC<EditHitchDayModalProps> = ({
  open,
  onClose,
  onSuccess,
  hitchDay,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const fields: FieldConfig[] = [
    {
      name: "day",
      label: t("hitchDay.day"),
      type: "text",
      required: true,
      placeholder: t("hitchDay.enterDay"),
    },
    {
      name: "credit",
      label: t("hitchDay.credit"),
      type: "number",
      required: true,
      placeholder: t("hitchDay.enterCredit"),
      min: 0,
      max: 1,
    },
  ];

  const initialValues: HitchDayFormData = {
    day: hitchDay?.day ?? "",
    credit: hitchDay?.credit ?? 0,
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!hitchDay) return;

    try {
      const formData = values as HitchDayFormData;
      await dispatch(
        updateHitchDay({
          hitchDayId: hitchDay._id,
          payload: { day: formData.day, credit: Number(formData.credit) },
        }),
      ).unwrap();

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("hitchDay.updateSuccess"),
        }),
      );
      onSuccess?.();
      onClose();
    } catch (error) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message:
            typeof error === "string" ? error : t("hitchDay.updateFailed"),
        }),
      );
    }
  };

  return (
    <DynamicModal
      open={open}
      onClose={onClose}
      title={t("hitchDay.edit")}
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

export default EditHitchDayModal;
