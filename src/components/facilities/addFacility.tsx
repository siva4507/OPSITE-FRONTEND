"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch } from "@/src/hooks/redux";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType, FieldConfig } from "@/src/types/types";
import DynamicForm from "@/src/components/common/formModal";
import DynamicModal from "@/src/components/common/modal";
import { createFacilityThunk } from "@/src/store/slices/facilitySlice";
import { MAX_LENGTH } from "@/src/utils/constant";
import {
  fetchFacilityCompanies,
  fetchAorsByCompany,
} from "@/src/services/facilityService";

interface AddFacilityModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FacilityFormData {
  facilityName: string;
  aorId: string;
  companyId?: string;
  [key: string]: unknown;
}

const AddFacilityModal: React.FC<AddFacilityModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [companyOptions, setCompanyOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [aorOptions, setAorOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");

  useEffect(() => {
    if (open) {
      fetchFacilityCompanies()
        .then((res) => {
          if (res?.data) {
            setCompanyOptions(
              res.data.map((company: { _id: string; name: string }) => ({
                label: company.name,
                value: company._id,
              })),
            );
          }
        })
        .catch(() => {
          dispatch(
            showAlert({
              type: AlertType.Error,
              message: t("facility.failedCompany"),
            }),
          );
        });
      setSelectedCompany("");
      setAorOptions([]);
    }
  }, [open, dispatch]);

  const fields: FieldConfig[] = [
    {
      name: "facilityName",
      label: t("facility.facilityName"),
      type: "text",
      required: true,
      placeholder: t("facility.enterName"),
      maxlength: MAX_LENGTH,
    },
    {
      name: "companyId",
      label: t("facility.company"),
      type: "select",
      required: true,
      options: companyOptions,
      placeholder: t("facility.selectCompany"),
    },
    {
      name: "aorId",
      label: t("facility.aor"),
      type: "select",
      required: true,
      options: aorOptions,
      placeholder: t("facility.selectAOR"),
      disabled: !selectedCompany,
    },
  ];

  const initialValues = {
    facilityName: "",
    companyId: "",
    aorId: "",
  };

  const handleFormValueChange = async (name: string, value: unknown) => {
    if (name === "companyId") {
      const companyId = String(value || "");
      setSelectedCompany(companyId);
      setAorOptions([]);

      if (companyId) {
        try {
          const res = await fetchAorsByCompany(companyId);
          if (res?.data) {
            setAorOptions(
              res.data.map((aor: { _id: string; name: string }) => ({
                label: aor.name,
                value: aor._id,
              })),
            );
          }
        } catch {
          dispatch(
            showAlert({
              type: AlertType.Error,
              message: t("facility.faliedAor"),
            }),
          );
        }
      }
    }
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      const formData = values as FacilityFormData;
      await dispatch(
        createFacilityThunk({
          facilityNames: formData.facilityName,
          aorId: formData.aorId,
          companyId: formData.companyId || "",
        }),
      ).unwrap();

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("facility.createSuccess"),
        }),
      );
      onSuccess?.();
      onClose();
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : t("facility.createFailed");
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
      title={t("facility.addNew")}
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

export default AddFacilityModal;
