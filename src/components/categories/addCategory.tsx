"use client";

import React from "react";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch } from "@/src/hooks/redux";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType, FieldConfig } from "@/src/types/types";
import DynamicForm from "@/src/components/common/formModal";
import DynamicModal from "@/src/components/common/modal";
import { createCategory } from "@/src/store/slices/categorySlice";
import { MAX_LENGTH } from "@/src/utils/constant";

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface CategoryFormData {
  categoryName: string;
  [key: string]: unknown;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const fields: FieldConfig[] = [
    {
      name: "categoryName",
      label: t("category.name"),
      type: "text",
      required: true,
      placeholder: t("category.enterName"),
      maxlength: MAX_LENGTH,
    },
  ];

  const initialValues = {
    categoryName: "",
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      const formData = values as CategoryFormData;
      await dispatch(createCategory({ name: formData.categoryName })).unwrap();
      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("category.createSuccess"),
        }),
      );
      onSuccess?.();
      onClose();
    } catch (error) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message:
            typeof error === "string" ? error : t("category.createFailed"),
        }),
      );
    }
  };

  return (
    <DynamicModal
      open={open}
      onClose={onClose}
      title={t("category.addNew")}
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

export default AddCategoryModal;
