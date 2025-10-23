import React from "react";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch } from "@/src/hooks/redux";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType, FieldConfig } from "@/src/types/types";
import DynamicForm from "@/src/components/common/formModal";
import DynamicModal from "@/src/components/common/modal";
import { editCompanyThunk } from "@/src/store/slices/companySlice";
import { MAX_LENGTH } from "@/src/utils/constant";

interface EditCompanyModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  company: {
    _id: string;
    name: string;
    isActive: boolean;
  };
}

interface CompanyFormData {
  companyName: string;
  status: "true" | "false";
  [key: string]: unknown;
}

const EditCompanyModal: React.FC<EditCompanyModalProps> = ({
  open,
  onClose,
  onSuccess,
  company,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const fields: FieldConfig[] = [
    {
      name: "companyName",
      label: t("company.name"),
      type: "text",
      required: true,
      placeholder: t("company.enterName"),
      maxlength: MAX_LENGTH,
    },
  ];

  const initialValues = {
    companyName: company.name,
    status: "true",
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      const formData = values as CompanyFormData;
      const payload = {
        name: formData.companyName,
        isActive: formData.status === "true",
      };
      await dispatch(
        editCompanyThunk({ companyId: company._id, payload }),
      ).unwrap();

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("company.updateSuccess"),
        }),
      );

      onSuccess?.();
      onClose();
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : t("company.updateFailed");
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: errorMessage,
        }),
      );
    }
  };

  return (
    <DynamicModal
      open={open}
      onClose={onClose}
      title={t("company.editCompany")}
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

export default EditCompanyModal;
