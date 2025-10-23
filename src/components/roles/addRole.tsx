"use client";

import React from "react";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch } from "@/src/hooks/redux";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType, FieldConfig } from "@/src/types/types";
import DynamicForm from "@/src/components/common/formModal";
import DynamicModal from "@/src/components/common/modal";
import { addRoleThunk } from "@/src/store/slices/roleSlice";
import { MAX_LENGTH } from "@/src/utils/constant";

interface AddRoleModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface RoleFormData {
  roleName: string;
  [key: string]: unknown;
}

const AddRoleModal: React.FC<AddRoleModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const fields: FieldConfig[] = [
    {
      name: "roleName",
      label: t("role.name"),
      type: "text",
      required: true,
      placeholder: t("role.enterName"),
      maxlength: MAX_LENGTH,
    },
  ];

  const initialValues = {
    roleName: "",
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      const formData = values as RoleFormData;
      await dispatch(addRoleThunk({ name: formData.roleName })).unwrap();
      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("role.createSuccess"),
        }),
      );
      onSuccess?.();
      onClose();
    } catch (error) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: typeof error === "string" ? error : t("role.createFailed"),
        }),
      );
    }
  };

  return (
    <DynamicModal
      open={open}
      onClose={onClose}
      title={t("role.addNew")}
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

export default AddRoleModal;
