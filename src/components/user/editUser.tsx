"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType, FieldConfig } from "@/src/types/types";
import DynamicForm from "@/src/components/common/formModal";
import DynamicModal from "@/src/components/common/modal";
import { editUserThunk } from "@/src/store/slices/userSlice";
import { fetchRolesThunk } from "@/src/store/slices/roleSlice";
import { getAors } from "@/src/store/slices/aorSlice";
import {
  DEFAULT_ALLOWED_TYPES,
  MAX_FILE_SIZE,
  MAX_LENGTH,
} from "@/src/utils/constant";
import { Role } from "@/src/types/role.types";
import { Aor } from "@/src/types/aor.types";
import { User } from "@/src/types/user.types";

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
  onSuccess?: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  open,
  onClose,
  user,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const roles = useAppSelector((state) => state.roles.roles || []);
  const { items: aorItems } = useAppSelector((state) => state.aor);
  const [submitting, setSubmitting] = useState(false);
  const [roleOptions, setRoleOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [aorOptions, setAorOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (open) {
      dispatch(fetchRolesThunk({ page: 1, limit: 100 }));
      dispatch(getAors({ page: 1, limit: 100 }));
    }
  }, [dispatch, open]);

  useEffect(
    () => setRoleOptions(roles.map((r) => ({ value: r._id, label: r.name }))),
    [roles],
  );
  useEffect(
    () => setAorOptions(aorItems.map((a) => ({ value: a._id, label: a.name }))),
    [aorItems],
  );

  const fields: FieldConfig[] = [
    {
      name: "username",
      label: t("user.name"),
      type: "text",
      required: true,
      placeholder: t("user.enterName"),
      maxlength: MAX_LENGTH,
    },
    {
      name: "email",
      label: t("user.email"),
      type: "text",
      required: true,
      placeholder: t("user.enterEmail"),
    },
    {
      name: "phoneNumber",
      label: t("user.phone"),
      type: "phone",
      required: false,
      placeholder: t("user.enterPhone"),
      maxlength: 14,
    },
    {
      name: "roles",
      label: t("user.role"),
      type: "multiselect",
      required: true,
      options: roleOptions,
      placeholder: t("user.selectRole"),
    },
   
    {
      name: "address",
      label: t("user.address"),
      type: "textarea",
      required: false,
      placeholder: t("user.enterAddress"),
    },
    {
      name: "assignedAors",
      label: t("user.assignAors"),
      type: "multiselect",
      required: true,
      options: aorOptions,
      placeholder: t("user.selectAor"),
    },
    {
      name: "profileFile",
      label: t("user.profileImage"),
      type: "file",
      required: false,
      accept: DEFAULT_ALLOWED_TYPES,
      previewUrl: user.profileFileUrl,
      maxFileSizeMB: MAX_FILE_SIZE,
    },
  ];

  const initialValues = React.useMemo(
    () => ({
      username: user.username || "",
      email: user.email || "",
      password: "",
      phoneNumber: user.phoneNumber || "",

      roles: user.roles
        ? user.roles
            .map(
              (role: Role) =>
                roleOptions.find((opt) => opt.value === role._id)?.value,
            )
            .filter(Boolean)
        : [],

      assignedAors: user.assignedAors
        ? user.assignedAors
            .map(
              (aor: Aor) =>
                aorOptions.find((opt) => opt.value === aor._id)?.value,
            )
            .filter(Boolean)
        : [],

      address: user.address || "",
      status: "true",
      profileFile: user.profileFileUrl || null,
    }),
    [user, roleOptions, aorOptions],
  );

  const handleSubmit = async (values: Record<string, unknown>) => {
    setSubmitting(true);
    try {
      const formData = new FormData();

      for (const [key, value] of Object.entries(values)) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else if (
          value !== undefined &&
          value !== null &&
          key !== "profileFile"
        ) {
          formData.append(key, String(value));
        }
      }

      if (!values.profileFile) {
        formData.append("removeProfileFile", "true");
      } else if (values.profileFile instanceof File) {
        formData.append("removeProfileFile", "false");
      } else if (
        typeof values.profileFile === "string" &&
        values.profileFile === user.profileFileUrl
      ) {
        const response = await fetch(user.profileFileUrl);
        const blob = await response.blob();
        const filename = user.profileFileUrl.split("/").pop() || "profile.jpg";
        const file = new File([blob], filename, { type: blob.type });
        formData.append("profileFile", file);
        formData.append("removeProfileFile", "false");
      }

      await dispatch(
        editUserThunk({ userId: user._id, payload: formData }),
      ).unwrap();

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("user.updateSuccess"),
        }),
      );
      onSuccess?.();
      onClose();
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : t("user.updateFailed");
      dispatch(showAlert({ type: AlertType.Error, message: errorMessage }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DynamicModal
      open={open}
      onClose={onClose}
      title={t("user.edit")}
      width={800}
    >
      <DynamicForm
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitLabel={submitting ? t("user.submitting") : t("user.submit")}
        initialValues={initialValues}
        disabled={submitting}
      />
    </DynamicModal>
  );
};

export default EditUserModal;
