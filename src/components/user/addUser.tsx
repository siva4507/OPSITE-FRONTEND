"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType, FieldConfig } from "@/src/types/types";
import DynamicForm from "@/src/components/common/formModal";
import DynamicModal from "@/src/components/common/modal";
import { addUserThunk } from "@/src/store/slices/userSlice";
import { fetchRolesThunk } from "@/src/store/slices/roleSlice";
import { getAors } from "@/src/store/slices/aorSlice";
import {
  DEFAULT_ALLOWED_TYPES,
  MAX_FILE_SIZE,
  MAX_LENGTH,
} from "@/src/utils/constant";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface UserFormData {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  roles: string[];
  address: string;
  status: "true" | "false";
  profileFile?: File | null;
  assignedAors?: string[];
  [key: string]: unknown;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const roles = useAppSelector((state) => state.roles.roles || []);
  const { items: aorItems } = useAppSelector((state) => state.aor);
  const [submitting, setSubmitting] = useState(false);

  const [roleOptions, setRoleOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [aorOptions, setAorOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    if (open) {
      dispatch(fetchRolesThunk({ page: 1, limit: 100 }));
      dispatch(getAors({ page: 1, limit: 100 }));
    }
  }, [dispatch, open]);

  useEffect(() => {
    setRoleOptions(roles.map((r) => ({ value: r._id, label: r.name })));
  }, [roles]);

  useEffect(() => {
    setAorOptions(aorItems.map((a) => ({ value: a._id, label: a.name })));
  }, [aorItems]);

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
      type: "email",
      required: true,
      placeholder: t("user.enterEmail"),
    },
    {
      name: "password",
      label: t("user.password"),
      type: "password",
      required: true,
      placeholder: t("user.enterPassword"),
    },
    {
      name: "phoneNumber",
      label: t("user.phone"),
      type: "phone",
      required: false,
      maxlength: 11,
      placeholder: t("user.enterPhone"),
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
      name: "assignedAors",
      label: t("user.assignAors"),
      type: "multiselect",
      required: true,
      options: aorOptions,
      placeholder: t("user.selectAor"),
    },
    {
      name: "address",
      label: t("user.address"),
      type: "textarea",
      required: false,
      placeholder: t("user.enterAddress"),
    },

    {
      name: "profileFile",
      label: t("user.profileImage"),
      type: "file",
      required: false,
      accept: DEFAULT_ALLOWED_TYPES,
      maxFileSizeMB: MAX_FILE_SIZE,
    },
  ];

  const initialValues: UserFormData = {
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    roles: [],
    address: "",
    status: "true",
    profileFile: null,
    assignedAors: [],
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    setSubmitting(true);
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      await dispatch(addUserThunk(formData)).unwrap();
      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("user.createSuccess"),
        }),
      );
      onSuccess?.();
      onClose();
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : t("user.createFailed");
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: errorMessage,
        }),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DynamicModal
      open={open}
      onClose={onClose}
      title={t("user.addNew")}
      width={800}
    >
      <DynamicForm
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitLabel={submitting ? "Submitting..." : "Submit"}
        initialValues={initialValues}
        disabled={submitting}
      />
    </DynamicModal>
  );
};

export default AddUserModal;
