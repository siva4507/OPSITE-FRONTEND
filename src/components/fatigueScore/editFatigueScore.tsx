import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import DynamicForm from "@/src/components/common/formModal";
import DynamicModal from "@/src/components/common/modal";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch } from "@/src/hooks/redux";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType, FieldConfig } from "@/src/types/types";
import { updateFatigueScore } from "@/src/store/slices/fatigueScoreSlice";
import {
  FatigueScore,
  EditFatigueScoreRequestDto,
} from "@/src/types/fatigueScore.types";
import LoadingSpinner from "@/src/components/common/loader";

interface EditFatigueScoreModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  fatigueScore: FatigueScore | null;
}

const EditFatigueScoreModal: React.FC<EditFatigueScoreModalProps> = ({
  open,
  onClose,
  onSuccess,
  fatigueScore,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (open && fatigueScore) {
      setIsDataLoaded(true);
    } else {
      setIsDataLoaded(false);
    }
  }, [open, fatigueScore]);

  const riskLevelOptions = [
    { value: "none", label: t("fatigueScore.riskNone") },
    { value: "partial", label: t("fatigueScore.riskPartial") },
    { value: "high", label: t("fatigueScore.riskHigh") },
  ];

  const fields: FieldConfig[] = [
    {
      name: "minScore",
      label: t("fatigueScore.minScore"),
      type: "number",
      required: true,
      placeholder: t("fatigueScore.enterMinScore"),
    },
    {
      name: "maxScore",
      label: t("fatigueScore.maxScore"),
      type: "number",
      required: true,
      placeholder: t("fatigueScore.enterMaxScore"),
    },
    {
      name: "riskLevel",
      label: t("fatigueScore.riskLevel"),
      type: "text",
      required: true,
      //   placeholder: t("fatigueScore.selectRiskLevel") || "Select risk level",
      //   options: riskLevelOptions,
    },
    {
      name: "action",
      label: t("fatigueScore.action"),
      type: "text",
      required: true,
      placeholder: t("fatigueScore.enterAction"),
    },
    {
      name: "color",
      label: t("fatigueScore.color"),
      type: "color",
      required: true,
    },
  ];

  const initialValues: Record<string, unknown> = {
    minScore: fatigueScore?.minScore || 0,
    maxScore: fatigueScore?.maxScore || 0,
    riskLevel: fatigueScore?.riskLevel || "",
    action: fatigueScore?.action || "",
    color: fatigueScore?.color || "#22c55e",
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!fatigueScore) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: t("fatigueScore.notSelected"),
        }),
      );
      return;
    }

    try {
      const payload: EditFatigueScoreRequestDto = {
        minScore: Number(values.minScore),
        maxScore: Number(values.maxScore),
        riskLevel: values.riskLevel as string,
        action: values.action as string,
        color: values.color as string,
      };

      const result = await dispatch(
        updateFatigueScore({
          scoreId: fatigueScore._id,
          payload,
        }),
      ).unwrap();

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("fatigueScore.updateSuccess"),
        }),
      );

      onSuccess?.();
      onClose();
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : t("fatigueScore.updateFailed");
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
      title={t("fatigueScore.edit")}
      width={600}
    >
      <Box sx={{ mt: 1 }}>
        {isDataLoaded ? (
          <DynamicForm
            fields={fields}
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

export default EditFatigueScoreModal;
