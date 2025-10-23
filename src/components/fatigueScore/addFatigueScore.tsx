import React from "react";
import { Box } from "@mui/material";
import DynamicForm from "@/src/components/common/formModal";
import DynamicModal from "@/src/components/common/modal";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch } from "@/src/hooks/redux";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType, FieldConfig } from "@/src/types/types";
import { createFatigueScore } from "@/src/store/slices/fatigueScoreSlice";
import { AddFatigueScoreRequestDto } from "@/src/types/fatigueScore.types";

interface AddFatigueScoreModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddFatigueScoreModal: React.FC<AddFatigueScoreModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

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
      //   placeholder: t("fatigueScore.selectRiskLevel")",
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

  const initialValues: Partial<AddFatigueScoreRequestDto> = {
    minScore: undefined,
    maxScore: undefined,
    riskLevel: "",
    action: "",
    color: "#22c55e",
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      const payload: AddFatigueScoreRequestDto = {
        minScore: Number(values.minScore),
        maxScore: Number(values.maxScore),
        riskLevel: values.riskLevel as string,
        action: values.action as string,
        color: values.color as string,
      };

      const result = await dispatch(createFatigueScore(payload)).unwrap();

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("fatigueScore.createSuccess"),
        }),
      );

      onSuccess?.();
      onClose();
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : t("fatigueScore.createFailed");
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
      title={t("fatigueScore.addNew")}
      width={600}
    >
      <Box sx={{ mt: 1 }}>
        <DynamicForm
          fields={fields}
          onSubmit={handleSubmit}
          onCancel={onClose}
          initialValues={initialValues}
        />
      </Box>
    </DynamicModal>
  );
};

export default AddFatigueScoreModal;
