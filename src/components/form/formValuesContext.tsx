"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  FormValues,
  FormValuesContextProps,
  FormValuesProviderProps,
} from "@/src/types/form.types";
import { useAppSelector, useAppDispatch } from "@/src/hooks/redux";
import {
  registerFormHandler,
  unregisterFormHandler,
} from "../../utils/formHandler";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useSpeech } from "@/src/providers/speechProvider";

const FormValuesContext = createContext<FormValuesContextProps | undefined>(
  undefined,
);

export const useFormValues = () => {
  const context = useContext(FormValuesContext);
  if (!context) {
    throw new Error("useFormValues must be used within a FormValuesProvider");
  }
  return context;
};

export const FormValuesProvider: React.FC<FormValuesProviderProps> = ({
  children,
  initialValues = {},
  onValueChange,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [values, setValues] = useState<FormValues>(initialValues);
  const lastFocusedField = useAppSelector(
    (state) => state.shiftChange.lastFocusedField,
  );
  const lastFocusedFieldInfo = useAppSelector(
    (state) => state.shiftChange.lastFocusedFieldInfo,
  );
  const valuesRef = useRef(values);
  const lastFocusedFieldRef = useRef(lastFocusedField);
  const lastFocusedFieldInfoRef = useRef(lastFocusedFieldInfo);
  const onValueChangeRef = useRef(onValueChange);
  const initialValuesRef = useRef(initialValues);
  const isUpdatingRef = useRef(false);
  const tRef = useRef(t);
  const dispatchRef = useRef(dispatch);

  // Speech provider integration
  const speechContext = useSpeech();

  // Update refs when values change
  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  useEffect(() => {
    lastFocusedFieldRef.current = lastFocusedField;
  }, [lastFocusedField]);

  useEffect(() => {
    lastFocusedFieldInfoRef.current = lastFocusedFieldInfo;
  }, [lastFocusedFieldInfo]);

  useEffect(() => {
    onValueChangeRef.current = onValueChange;
  }, [onValueChange]);

  useEffect(() => {
    tRef.current = t;
  }, [t]);

  useEffect(() => {
    dispatchRef.current = dispatch;
  }, [dispatch]);

  useEffect(() => {
    if (
      Object.keys(initialValues).length > 0 &&
      Object.keys(values).length === 0
    ) {
      setValues(initialValues);
      initialValuesRef.current = initialValues;
    }
  }, [initialValues, values]);

  const setValue = useCallback((name: string, value: unknown) => {
    if (isUpdatingRef.current) {
      return;
    }

    isUpdatingRef.current = true;

    setValues((prev) => {
      const newValues = { ...prev, [name]: value };
      if (onValueChangeRef.current) {
        setTimeout(() => {
          onValueChangeRef.current?.(name, value);
          isUpdatingRef.current = false;
        }, 0);
      } else {
        isUpdatingRef.current = false;
      }

      return newValues;
    });
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  const applySpeechTranscript = useCallback(
    (transcript: string) => {
      const currentLastFocusedField = lastFocusedFieldRef.current;
      const currentValues = valuesRef.current;
      const currentLastFocusedFieldInfo = lastFocusedFieldInfoRef.current;

      if (currentLastFocusedField) {
        const currentValue = currentValues[currentLastFocusedField];
        let newValue: unknown;

        if (
          currentLastFocusedFieldInfo?.isExtent &&
          currentLastFocusedFieldInfo?.fieldName
        ) {
          const extentFieldName = currentLastFocusedFieldInfo.fieldName;
          const parentFieldName =
            currentLastFocusedFieldInfo.parentField || currentLastFocusedField;

          if (currentValue && typeof currentValue === "object") {
            newValue = { ...currentValue, [extentFieldName]: transcript };
          } else {
            newValue = { value: "", [extentFieldName]: transcript };
          }
          setValue(parentFieldName, newValue);
        } else {
          if (
            currentValue &&
            typeof currentValue === "object" &&
            "value" in currentValue
          ) {
            newValue = { ...currentValue, value: transcript };
          } else {
            newValue = transcript;
          }
          setValue(currentLastFocusedField, newValue);
        }
      } else {
        if (typeof window !== "undefined") {
          dispatchRef.current(
            showAlert({
              message: tRef.current("common.noFocusedField"),
              type: AlertType.Warning,
            }),
          );
        }
      }
    },
    [setValue],
  );

  // Register speech handler with global speech provider
  useEffect(() => {
    if (speechContext?.setTranscriptHandler) {
      speechContext.setTranscriptHandler(applySpeechTranscript);
    }

    return () => {
      if (speechContext?.setTranscriptHandler) {
        speechContext.setTranscriptHandler(() => {});
      }
    };
  }, [speechContext, applySpeechTranscript]);

  // Register this form's setValue function with the global handler
  useEffect(() => {
    registerFormHandler(setValue, valuesRef.current);
    return () => {
      unregisterFormHandler();
    };
  }, [setValue]);

  return (
    <FormValuesContext.Provider
      value={{
        values,
        setValue,
        reset,
        lastFocusedField,
        applySpeechTranscript,
      }}
    >
      {children}
    </FormValuesContext.Provider>
  );
};
