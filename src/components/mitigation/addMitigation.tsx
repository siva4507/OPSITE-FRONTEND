"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch } from "@/src/hooks/redux";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType, FieldConfig } from "@/src/types/types";
import DynamicForm from "@/src/components/common/formModal";
import DynamicModal from "@/src/components/common/modal";
import { createMitigation } from "@/src/store/slices/mitigationSlice";
import { MAX_LENGTH } from "@/src/utils/constant";
import { FatigueMitigationType } from "@/src/types/fatigue.types";

interface AddMitigationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface MitigationFormData {
  name: string;
  credit: number;
  type: string;
  [key: string]: unknown;
}

const AddMitigationModal: React.FC<AddMitigationModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [selectedType, setSelectedType] = useState<string>("");

  const getNameField = (): FieldConfig => {
    if (selectedType === FatigueMitigationType.TIMER) {
      return {
        name: "name",
        label: t("mitigation.name") || "Name",
        type: "select",
        required: true,
        placeholder: t("mitigation.selectTimer") || "Select timer",
        options: [
          { label: "5 mins", value: "5" },
          { label: "10 mins", value: "10" },
          { label: "15 mins", value: "15" },
        ],
      };
    }

    return {
      name: "name",
      label: t("mitigation.name"),
      type: "text",
      required: true,
      placeholder: t("mitigation.enterName"),
      maxlength: MAX_LENGTH,
    };
  };

  const fields: FieldConfig[] = [
    {
      name: "type",
      label: t("mitigation.type") || "Type",
      type: "select",
      required: true,
      placeholder: t("mitigation.selectType") || "Select type",
      options: [
        {
          value: FatigueMitigationType.TIMER,
          label: t("mitigation.typeTimer"),
        },
        {
          value: FatigueMitigationType.COUNTERMEASURE,
          label: t("mitigation.typeCountermeasure"),
        },
      ],
    },
    getNameField(),
    {
      name: "credit",
      label: t("mitigation.credit"),
      type: "number",
      required: true,
      placeholder: t("mitigation.enterCredit"),
      min: 0,
      max: 20,
    },
  ];

  const initialValues = {
    name: "",
    credit: 0,
    type: "",
  };

  const handleFormValueChange = (name: string, value: unknown) => {
    // Detect type change
    if (name === "type") {
      setSelectedType(value as string);
    }
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      const formData = values as MitigationFormData;
      await dispatch(
        createMitigation({
          name: formData.name,
          credit: Number(formData.credit),
          type: formData.type,
        }),
      ).unwrap();

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("mitigation.createSuccess"),
        }),
      );
      onSuccess?.();
      onClose();
    } catch (error) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message:
            typeof error === "string" ? error : t("mitigation.createFailed"),
        }),
      );
    }
  };

  return (
    <DynamicModal
      open={open}
      onClose={onClose}
      title={t("mitigation.addNew")}
      onAction={() => document.getElementById("dynamic-form-submit")?.click()}
      width={500}
    >
      <DynamicForm
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={onClose}
        initialValues={initialValues}
        onFormValueChange={handleFormValueChange}
      />
    </DynamicModal>
  );
};

export default AddMitigationModal;
