"use client";

import React, { useState, useEffect } from "react";
import DynamicModal from "@/src/components/common/modal";
import DynamicForm from "@/src/components/common/formModal";
import { FieldConfig, AlertType } from "@/src/types/types";
import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import { fetchActiveShifts } from "@/src/store/slices/shiftChangeSlice";
import { startTimerAction } from "@/src/store/slices/fatigueSlice";
import { ActiveShift } from "@/src/dto/shiftChange.dto";
import { showAlert } from "@/src/store/slices/alertSlice";
import { useTranslation } from "@/src/hooks/useTranslation";

interface TimerModalProps {
  open: boolean;
  onClose: () => void;
  onTimerStarted?: () => void;
}

const TimerModal: React.FC<TimerModalProps> = ({
  open,
  onClose,
  onTimerStarted,
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { activeShifts } = useAppSelector((state) => state.shiftChange);
  const { startTimerLoading } = useAppSelector((state) => state.fatigue);

  const initialFormValues = {
    aor: "",
    timerName: "",
    duration: "",
  };

  const [formValues, setFormValues] =
    useState<Record<string, unknown>>(initialFormValues);

  const [aorOptions, setAorOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    if (open) {
      setFormValues(initialFormValues);
      dispatch(fetchActiveShifts());
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (activeShifts && activeShifts.length > 0) {
      const options = activeShifts.flatMap((shift: ActiveShift) =>
        shift.shiftAors.map((sa) => ({
          label: sa.aor.name,
          value: sa.aor._id,
        })),
      );
      setAorOptions(options);
    } else {
      setAorOptions([]);
    }
  }, [activeShifts]);

  const fields: FieldConfig[] = [
    {
      name: "aor",
      label: t("dashboard.aor"),
      type: "select",
      required: true,
      options: aorOptions,
    },
    {
      name: "timerName",
      label: t("dashboard.timerName"),
      type: "text",
      required: true,
      placeholder: t("dashboard.enterTimerName"),
      maxlength: 50,
    },
    {
      name: "duration",
      label: t("dashboard.duration"),
      type: "time",
      required: true,
    },
  ];

  const handleFormChange = (name: string, value: unknown) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!values.aor || !values.timerName || !values.duration) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: t("dashboard.fillAllFields"),
        }),
      );
      return;
    }

    if (values.duration === "00:00:00") {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: t("dashboard.durationCannotBeZero"),
        }),
      );
      return;
    }

    try {
      await dispatch(
        startTimerAction({
          aorId: values.aor as string,
          name: values.timerName as string,
          timer: values.duration as string,
        }),
      ).unwrap();

      setFormValues(initialFormValues);

      onClose();
      onTimerStarted?.();
    } catch (error) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message:
            typeof error === "string" ? error : t("dashboard.startTimerFailed"),
        }),
      );
    }
  };

  return (
    <DynamicModal
      open={open}
      onClose={() => {
        setFormValues(initialFormValues);
        onClose();
      }}
      title={t("dashboard.counterTimer")}
      width={500}
    >
      <Box>
        <DynamicForm
          key={open ? "open" : "closed"}
          fields={fields}
          initialValues={formValues}
          onFormValueChange={handleFormChange}
          onSubmit={handleSubmit}
          onCancel={() => {
            setFormValues(initialFormValues);
            onClose();
          }}
        />
      </Box>
    </DynamicModal>
  );
};

export default TimerModal;
