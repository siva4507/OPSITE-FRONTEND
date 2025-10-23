"use client";

import React from "react";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch } from "@/src/hooks/redux";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType, FieldConfig } from "@/src/types/types";
import DynamicForm from "@/src/components/common/formModal";
import DynamicModal from "@/src/components/common/modal";
import { updateQOS } from "@/src/store/slices/qosSlice";

interface EditQOSModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  qos: { _id: string; quality: string; rating: string; credit: number } | null;
}

interface QOSFormData {
  quality: string;
  rating: string;
  credit: number;
  [key: string]: unknown;
}

const EditQOSModal: React.FC<EditQOSModalProps> = ({
  open,
  onClose,
  onSuccess,
  qos,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const fields: FieldConfig[] = [
    {
      name: "quality",
      label: t("qos.quality"),
      type: "text",
      required: true,
      placeholder: t("qos.enterQuality"),
    },
    {
      name: "rating",
      label: t("qos.rating"),
      type: "select",
      required: true,
      options: [
        { label: t("qos.veryPoor"), value: "VERY POOR" },
        { label: t("qos.poor"), value: "POOR" },
        { label: t("qos.fair"), value: "FAIR" },
        { label: t("qos.good"), value: "GOOD" },
        { label: t("qos.excellent"), value: "EXCELLENT" },
      ],
      placeholder: t("qos.selectRating"),
    },
    {
      name: "credit",
      label: t("qos.credit"),
      type: "number",
      required: true,
      placeholder: t("qos.enterCredit"),
      min: 0,
      max: 20,
    },
  ];

  const initialValues: QOSFormData = {
    quality: qos?.quality || "",
    rating: qos?.rating || "",
    credit: qos?.credit || 0,
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!qos) return;

    try {
      const formData = values as QOSFormData;
      await dispatch(
        updateQOS({
          qosId: qos._id,
          payload: {
            quality: formData.quality,
            rating: formData.rating,
            credit: formData.credit,
          },
        }),
      ).unwrap();

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("qos.updateSuccess"),
        }),
      );
      onSuccess?.();
      onClose();
    } catch (error) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: typeof error === "string" ? error : t("qos.updateFailed"),
        }),
      );
    }
  };

  return (
    <DynamicModal
      open={open}
      onClose={onClose}
      title={t("qos.edit")}
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

export default EditQOSModal;
