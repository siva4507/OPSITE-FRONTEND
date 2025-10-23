"use client";

type FormValues = { [key: string]: unknown };

let currentSetValue: ((fieldName: string, value: unknown) => void) | null =
  null;
let currentValues: FormValues = {};

export const registerFormHandler = (
  setValue: (fieldName: string, value: unknown) => void,
  values: FormValues = {},
) => {
  currentSetValue = setValue;
  currentValues = values;
};

export const unregisterFormHandler = () => {
  currentSetValue = null;
  currentValues = {};
};

export const updateFormField = (
  fieldName: string,
  value: unknown,
  isExtent: boolean = false,
  parentField?: string,
) => {
  if (!currentSetValue) return;

  if (isExtent && parentField) {
    const parentValue = currentValues[parentField];
    const parentObj =
      typeof parentValue === "object" && parentValue !== null
        ? (parentValue as Record<string, unknown>)
        : {};

    currentSetValue(parentField, { ...parentObj, [fieldName]: value });
  } else {
    currentSetValue(fieldName, { value });
  }
};
