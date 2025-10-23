"use client";

import React from "react";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch } from "@/src/hooks/redux";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType, FieldConfig } from "@/src/types/types";
import DynamicForm from "@/src/components/common/formModal";
import DynamicModal from "@/src/components/common/modal";
import { editRoleThunk } from "@/src/store/slices/roleSlice";
import { MAX_LENGTH } from "@/src/utils/constant";

interface EditRoleModalProps {
  open: boolean;
  onClose: () => void;
  role: { _id: string; name: string };
  onSuccess?: () => void;
}

interface RoleFormData {
  roleName: string;
  [key: string]: unknown;
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({
  open,
  onClose,
  role,
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
    roleName: role.name,
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      const formData = values as RoleFormData;

      await dispatch(
        editRoleThunk({ roleId: role._id, name: formData.roleName }),
      ).unwrap();

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("role.updateSuccess"),
        }),
      );

      onSuccess?.();
      onClose();
    } catch (error) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: typeof error === "string" ? error : t("role.updateFailed"),
        }),
      );
    }
  };

  return (
    <DynamicModal
      open={open}
      onClose={onClose}
      title={t("role.edit")}
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

export default EditRoleModal;
