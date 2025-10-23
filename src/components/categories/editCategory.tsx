"use client";

import React from "react";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch } from "@/src/hooks/redux";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType, FieldConfig } from "@/src/types/types";
import DynamicForm from "@/src/components/common/formModal";
import DynamicModal from "@/src/components/common/modal";
import { updateCategory } from "@/src/store/slices/categorySlice";
import { MAX_LENGTH } from "@/src/utils/constant";

interface EditCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  category: { _id: string; name: string } | null;
}

interface CategoryFormData {
  categoryName: string;
  [key: string]: unknown;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  open,
  onClose,
  onSuccess,
  category,
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

  const initialValues: CategoryFormData = {
    categoryName: category?.name || "",
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!category) return;

    try {
      const formData = values as CategoryFormData;
      await dispatch(
        updateCategory({
          categoryId: category._id,
          payload: { name: formData.categoryName },
        }),
      ).unwrap();

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("category.updateSuccess"),
        }),
      );
      onSuccess?.();

      onClose();
    } catch (error) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message:
            typeof error === "string" ? error : t("category.updateFailed"),
        }),
      );
    }
  };

  return (
    <DynamicModal
      open={open}
      onClose={onClose}
      title={t("category.edit")}
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

export default EditCategoryModal;
