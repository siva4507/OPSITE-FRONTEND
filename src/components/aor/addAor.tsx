import React, { useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import DynamicForm from "@/src/components/common/formModal";
import DynamicModal from "@/src/components/common/modal";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType, FieldConfig } from "@/src/types/types";
import { addAorThunk } from "@/src/store/slices/aorSlice";
import { AddAorRequest } from "@/src/types/aor.types";
import {
  getCitiesByState,
  getStates,
  clearLocationState,
  getTimezones,
} from "@/src/store/slices/locationSlice";
import { MAX_LENGTH } from "@/src/utils/constant";

interface AddAorModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  companies: { id: string; name: string }[];
}

const AddAorModal: React.FC<AddAorModalProps> = ({
  open,
  onClose,
  onSuccess,
  companies,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { states, cities, timezones } = useAppSelector(
    (state) => state.location,
  );

  useEffect(() => {
    if (open) {
      dispatch(getStates());
      dispatch(getTimezones());
    } else {
      dispatch(clearLocationState());
    }
  }, [dispatch, open]);

  const fields: FieldConfig[] = [
    {
      name: "name",
      label: t("aor.name"),
      type: "text",
      required: true,
      placeholder: t("aor.enterAor"),
      maxlength: MAX_LENGTH,
    },
    {
      name: "companyId",
      label: t("aor.company"),
      type: "select",
      required: true,
      placeholder: t("aor.selectCompany"),
      options: companies.map((c) => ({ value: c.id, label: c.name })),
    },
    {
      name: "emailDistributionList",
      label: t("aor.subEmail"),
      type: "text",
      placeholder: t("aor.enterEmail"),
    },
    {
      name: "state",
      label: t("aor.state"),
      type: "select",
      required: true,
      options: states.map((s) => ({ value: s._id, label: s.name })),
    },
    {
      name: "city",
      label: t("aor.city"),
      type: "select",
      required: true,
      options: cities.map((c) => ({ value: c._id, label: c.name })),
    },
    {
      name: "timezoneId",
      label: t("aor.timezone"),
      type: "select",
      required: true,
      placeholder: t("aor.selectTimezone"),
      options: timezones.map((tz) => ({ value: tz._id, label: tz.label })),
    },
    {
      name: "zipcode",
      label: t("aor.zipCode"),
      type: "number",
      placeholder: t("aor.enterZipCode"),
      required: true,
      maxlength: 5,
    },
    { name: "color", label: t("aor.color"), type: "color", required: true },
  ];

  const initialValues: Partial<AddAorRequest> = {
    name: "",
    description: "",
    companyId: "",
    color: "#000000",
    emailDistributionList: [],
    isActive: true,
    Location: {
      state: "",
      city: "",
      zipcode: "",
      timezoneId: "",
    },
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    const emailList =
      typeof values.emailDistributionList === "string" &&
      values.emailDistributionList.trim() !== ""
        ? values.emailDistributionList
            .split(",")
            .map((email) => email.trim())
            .filter((email) => email.length > 0)
        : [];

    try {
      const payload: AddAorRequest = {
        name: values.name as string,
        companyId: values.companyId as string,
        color: values.color as string,
        isActive: values.isActive === true || values.isActive === "true",
        emailDistributionList: emailList,
        Location: {
          state: values.state as string,
          city: values.city as string,
          zipcode: values.zipcode as string,
          timezoneId: values.timezoneId as string,
        },
      };

      const result = await dispatch(addAorThunk(payload)).unwrap();

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: result.message,
        }),
      );

      onSuccess?.();
      onClose();
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : t("aor.createFailed");
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: errorMessage,
        }),
      );
    }
  };

  const handleFormValueChange = useCallback(
    (fieldName: string, value: unknown) => {
      if (fieldName === "state" && typeof value === "string") {
        dispatch(getCitiesByState(value));
      }
    },
    [dispatch],
  );

  return (
    <DynamicModal
      open={open}
      onClose={onClose}
      title={t("aor.addNew")}
      width={800}
    >
      <Box sx={{ mt: 1 }}>
        <DynamicForm
          fields={fields}
          onSubmit={handleSubmit}
          onCancel={onClose}
          initialValues={initialValues}
          onFormValueChange={handleFormValueChange}
        />
      </Box>
    </DynamicModal>
  );
};

export default AddAorModal;
