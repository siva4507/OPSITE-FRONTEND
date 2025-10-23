import React, { useEffect, useState, useCallback } from "react";
import { Box } from "@mui/material";
import DynamicForm from "@/src/components/common/formModal";
import DynamicModal from "@/src/components/common/modal";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType, FieldConfig } from "@/src/types/types";
import { updateAorThunk } from "@/src/store/slices/aorSlice";
import { AddAorRequest, Aor } from "@/src/types/aor.types";
import {
  getCitiesByState,
  getStates,
  clearLocationState,
  getTimezones,
} from "@/src/store/slices/locationSlice";
import { MAX_LENGTH } from "@/src/utils/constant";
import LoadingSpinner from "@/src/components/common/loader";

interface EditAorModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  companies: { id: string; name: string }[];
  aor: Aor | null;
}

const EditAorModal: React.FC<EditAorModalProps> = ({
  open,
  onClose,
  onSuccess,
  companies,
  aor,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { states, cities, timezones } = useAppSelector(
    (state) => state.location,
  );

  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      const loadData = async () => {
        setIsDataLoaded(false);
        await dispatch(getStates());
        dispatch(getTimezones());
        if (aor?.Location?.state?._id) {
          await dispatch(getCitiesByState(aor.Location.state._id));
        }
        setIsDataLoaded(true);
      };

      loadData();
    } else {
      dispatch(clearLocationState());
      setIsDataLoaded(false);
    }
  }, [dispatch, open, aor]);

  const fields: FieldConfig[] = [
    {
      name: "name",
      label: t("aor.name"),
      type: "text",
      required: true,
      maxlength: MAX_LENGTH,
    },
    {
      name: "companyId",
      label: t("aor.company"),
      type: "select",
      required: true,
      options: companies.map((c) => ({ value: c.id, label: c.name })),
    },
    {
      name: "dailyHosLimit",
      label: t("aor.dailyHosLimit"),
      type: "number",
      required: false,
      maxlength: 2,
      min: 8,
      max: 24,
    },
    {
      name: "weeklyHosLimit",
      label: t("aor.weeklyHosLimit"),
      type: "number",
      required: false,
      maxlength: 3,
      min: 24,
      max: 168,
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
      required: true,
      placeholder: t("aor.enterZipCode"),
      maxlength: 5,
    },
    { name: "color", label: t("aor.color"), type: "color", required: true },
  ];

  const initialValues: Record<string, unknown> = {
    name: aor?.name || "",
    companyId: aor?.company?._id || "",
    color: aor?.color || "#000000",
    dailyHosLimit: aor?.dailyHosLimit || 0,
    weeklyHosLimit: aor?.weeklyHosLimit || 0,
    isActive: "true",
    state: aor?.Location?.state?._id || "",
    city: aor?.Location?.city?._id || "",
    zipcode: aor?.Location?.zipcode || "",
    timezoneId: aor?.Location?.timezoneId || "",
    emailDistributionList: aor?.emailDistributionList?.join(", ") || "",
  };

  const handleFormValueChange = useCallback(
    (fieldName: string, value: unknown) => {
      if (fieldName === "state" && typeof value === "string") {
        dispatch(getCitiesByState(value));
      }
    },
    [dispatch],
  );

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!aor) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: t("aor.notSelected"),
        }),
      );
      return;
    }

    try {
      const emailList =
        typeof values.emailDistributionList === "string" &&
        values.emailDistributionList.trim() !== ""
          ? values.emailDistributionList
              .split(",")
              .map((email) => email.trim())
              .filter((email) => email.length > 0)
          : [];
      const payload: AddAorRequest = {
        name: values.name as string,
        companyId: values.companyId as string,
        color: values.color as string,
        dailyHosLimit: Number(values.dailyHosLimit),
        weeklyHosLimit: Number(values.weeklyHosLimit),
        isActive: values.isActive === true || values.isActive === "true",
        emailDistributionList: emailList,
        Location: {
          state: values.state as string,
          city: values.city as string,
          zipcode: values.zipcode as string,
          timezoneId: values.timezoneId as string,
        },
      };

      const result = await dispatch(
        updateAorThunk({ id: aor._id, data: payload }),
      ).unwrap();

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
        typeof error === "string" ? error : t("aor.updateFailed");
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
      title={t("aor.edit")}
      width={800}
    >
      <Box sx={{ mt: 1 }}>
        {isDataLoaded ? (
          <DynamicForm
            fields={fields}
            onFormValueChange={handleFormValueChange}
            onSubmit={handleSubmit}
            onCancel={onClose}
            initialValues={initialValues}
          />
        ) : (
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
        )}
      </Box>
    </DynamicModal>
  );
};

export default EditAorModal;
