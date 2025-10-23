"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch } from "@/src/hooks/redux";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType, FieldConfig } from "@/src/types/types";
import DynamicForm from "@/src/components/common/formModal";
import DynamicModal from "@/src/components/common/modal";
import { updateFacilityThunk } from "@/src/store/slices/facilitySlice";
import { MAX_LENGTH } from "@/src/utils/constant";
import {
  fetchFacilityCompanies,
  fetchAorsByCompany,
} from "@/src/services/facilityService";
import LoadingSpinner from "../common/loader";

interface EditFacilityModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  facility: {
    _id: string;
    name: string;
    aorId: string;
    companyId?: string;
  } | null;
}

interface FacilityFormData {
  facilityNames: string;
  aorId: string;
  companyId?: string;
  [key: string]: unknown;
}

const EditFacilityModal: React.FC<EditFacilityModalProps> = ({
  open,
  onClose,
  onSuccess,
  facility,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [companyOptions, setCompanyOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [aorOptions, setAorOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState<FacilityFormData>({
    facilityNames: facility?.name || "",
    companyId: facility?.companyId || "",
    aorId: facility?.aorId || "",
  });

  useEffect(() => {
    if (facility) {
      setFormValues({
        facilityNames: facility.name || "",
        companyId: facility.companyId || "",
        aorId: facility.aorId || "",
      });
    }
  }, [facility]);

  useEffect(() => {
    if (!open) return;

    const loadData = async () => {
      setIsLoading(true);

      try {
        const companiesRes = await fetchFacilityCompanies();
        if (companiesRes?.data) {
          setCompanyOptions(
            companiesRes.data.map((c: { _id: string; name: string }) => ({
              label: c.name,
              value: c._id,
            })),
          );
        }

        if (facility?.companyId) {
          const aorsRes = await fetchAorsByCompany(facility.companyId);
          if (aorsRes?.data) {
            setAorOptions(
              aorsRes.data.map((aor: { _id: string; name: string }) => ({
                label: aor.name,
                value: aor._id,
              })),
            );
          }
        }
      } catch {
        dispatch(
          showAlert({
            type: AlertType.Error,
            message: t("facility.failedCompany"),
          }),
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [open, dispatch, facility?.companyId]);

  const handleFormValueChange = async (name: string, value: unknown) => {
    const val = String(value || "");

    setFormValues((prev) => ({
      ...prev,
      [name]: val,
      ...(name === "companyId" ? { aorId: "" } : {}),
    }));

    if (name === "companyId" && val) {
      try {
        const res = await fetchAorsByCompany(val);
        if (res?.data) {
          setAorOptions(
            res.data.map((aor: { _id: string; name: string }) => ({
              label: aor.name,
              value: aor._id,
            })),
          );
        } else {
          setAorOptions([]);
        }
      } catch {
        dispatch(
          showAlert({
            type: AlertType.Error,
            message: t("facility.faliedAor"),
          }),
        );
        setAorOptions([]);
      }
    } else if (name === "companyId") {
      setAorOptions([]);
    }
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!facility) return;
    try {
      const formData = values as FacilityFormData;
      await dispatch(
        updateFacilityThunk({
          facilityId: facility._id,
          payload: {
            facilityNames: formData.facilityNames,
            companyId: formData.companyId || "",
            aorId: formData.aorId || "",
          },
        }),
      ).unwrap();
      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("facility.updateSuccess"),
        }),
      );
      onSuccess?.();
      onClose();
    } catch (error) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message:
            typeof error === "string" ? error : t("facility.updateFailed"),
        }),
      );
    }
  };

  const fields: FieldConfig[] = [
    {
      name: "facilityNames",
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
      disabled: !formValues.companyId,
    },
  ];

  if (!open) return null;

  return (
    <DynamicModal
      open={open}
      onClose={onClose}
      title={t("facility.editFacility")}
      onAction={() => document.getElementById("dynamic-form-submit")?.click()}
      width={500}
    >
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px 20px",
            minHeight: "200px",
          }}
        >
          <LoadingSpinner />
        </div>
      ) : (
        <DynamicForm
          fields={fields}
          onSubmit={handleSubmit}
          onCancel={onClose}
          initialValues={formValues}
          onFormValueChange={handleFormValueChange}
        />
      )}
    </DynamicModal>
  );
};

export default EditFacilityModal;
