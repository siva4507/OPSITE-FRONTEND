import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Button, Grid } from "@mui/material";
import { modalFormStyles } from "@/src/styles/modalForm.styles";
import { DynamicFormProps, FieldConfig } from "@/src/types/types";
import { useTranslation } from "@/src/hooks/useTranslation";

import {
  TextField,
  NumberField,
  TextAreaField,
  SelectField,
  MultiSelectField,
  PasswordField,
  ColorField,
  TagsField,
  FileField,
  AutocompleteField,
  PhoneField,
  CheckboxField,
  TimeField,
} from "./dynamicForm/index";

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  onCancel,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  onFormValueChange,
  initialValues = {},
  onAutocompleteInputChange,
  disabled = false,
}) => {
  const styles = modalFormStyles();
  const { t } = useTranslation();
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<Record<string, unknown>>(() => ({
    ...initialValues,
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shouldUseTwoColumns = fields.length > 4;
  const memoizedFields = React.useMemo(
    () => fields,
    [
      JSON.stringify(
        fields.map((f) => ({
          name: f.name,
          type: f.type,
          required: f.required,
          disabled: f.disabled,
          optionsLength: f.options?.length || 0,
          maxSelected: f.maxSelected,
        })),
      ),
    ],
  );

  useEffect(() => {
    setValues((prev) => ({ ...prev, ...initialValues }));
  }, [JSON.stringify(initialValues)]);

  useEffect(() => {
    if (memoizedFields.length > 0 && firstFieldRef.current) {
      const timer = setTimeout(() => {
        firstFieldRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [memoizedFields.length > 0]);

  const cleanupValues = useCallback(() => {
    setValues((prev) => {
      const newValues = { ...prev };
      let hasChanges = false;

      memoizedFields.forEach((field) => {
        if (field.type === "select" || field.type === "multiselect") {
          const currentValue = prev[field.name];

          if (field.options && Array.isArray(currentValue)) {
            const validOptions = field.options.map((opt) => opt.value);
            const filteredValue = currentValue.filter(
              (val) => validOptions.includes(val) && val !== "loading",
            );
            if (filteredValue.length !== currentValue.length) {
              newValues[field.name] = filteredValue;
              hasChanges = true;
            }
          } else if (
            field.options &&
            currentValue &&
            typeof currentValue === "string" &&
            currentValue !== "loading"
          ) {
            const validOptions = field.options.map((opt) => opt.value);
            if (!validOptions.includes(currentValue)) {
              newValues[field.name] = "";
              hasChanges = true;
            }
          }
        }
      });

      return hasChanges ? newValues : prev;
    });
  }, [memoizedFields]);

  const fieldsSignature = React.useMemo(
    () =>
      JSON.stringify(
        memoizedFields.map((f) => ({
          name: f.name,
          options: f.options?.map((opt) => opt.value),
        })),
      ),
    [memoizedFields],
  );

  useEffect(() => {
    cleanupValues();
  }, [fieldsSignature]);

  const handleChange = useCallback(
    (name: string, value: unknown) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
      if (onFormValueChange) onFormValueChange(name, value);
    },
    [onFormValueChange],
  );

  const handleFileValidationError = useCallback(
    (name: string, error: string) => {
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      let valid = true;
      const newErrors: Record<string, string> = {};

      memoizedFields.forEach((field) => {
        if (field.required) {
          const value = values[field.name];
          if (!value || (Array.isArray(value) && value.length === 0)) {
            newErrors[field.name] = `${field.label} ${t("common.required")}`;
            valid = false;
          }
        }
      });

      setErrors(newErrors);
      if (valid) onSubmit(values);
    },
    [memoizedFields, values, t, onSubmit],
  );

  const handleAutocompleteInputChange = useCallback(
    (name: string, value: string) => {
      if (onAutocompleteInputChange) {
        onAutocompleteInputChange(name, value);
      }
    },
    [onAutocompleteInputChange],
  );

  const renderField = (field: FieldConfig, index: number) => {
    const commonProps = {
      name: field.name,
      label: field.label,
      value: values[field.name],
      error: errors[field.name],
      required: field.required,
      disabled: field.disabled,
      placeholder: field.placeholder,
      onChange: handleChange,
      inputRef: index === 0 ? firstFieldRef : undefined,
      autoComplete: "new-password",
      autoCorrect: "off",
      autoCapitalize: "off",
      spellCheck: false,
    };

    const fieldComponents = {
      text: () => (
        <TextField {...commonProps} type="text" maxlength={field.maxlength} />
      ),
      email: () => (
        <TextField {...commonProps} type="email" maxlength={field.maxlength} />
      ),
      url: () => (
        <TextField {...commonProps} type="url" maxlength={field.maxlength} />
      ),
      number: () => (
        <NumberField
          {...commonProps}
          maxlength={field.maxlength}
          min={field.min}
          max={field.max}
          step={field.step}
        />
      ),
      textarea: () => (
        <TextAreaField {...commonProps} maxlength={field.maxlength} rows={4} />
      ),
      select: () => (
        <SelectField
          {...commonProps}
          options={field.options}
          disabledOptions={field.disabledOptions}
        />
      ),
      multiselect: () => (
        <MultiSelectField
          {...commonProps}
          options={field.options}
          disabledOptions={field.disabledOptions}
          maxSelected={field.maxSelected}
        />
      ),
      // checkbox: () => <CheckboxField {...commonProps} />,
      password: () => (
        <PasswordField {...commonProps} maxlength={field.maxlength} />
      ),
      color: () => <ColorField {...commonProps} />,
      tags: () => (
        <TagsField
          {...commonProps}
          maxSelected={field.maxSelected}
          maxlength={field.maxlength}
        />
      ),
      file: () => (
        <FileField
          {...commonProps}
          accept={field.accept}
          maxFileSizeMB={field.maxFileSizeMB}
          previewUrl={field.previewUrl}
          onValidationError={handleFileValidationError}
        />
      ),
      autocomplete: () => (
        <AutocompleteField
          {...commonProps}
          options={field.options}
          loading={field.loading}
          onInputChange={handleAutocompleteInputChange}
        />
      ),
      phone: () => <PhoneField {...commonProps} />,
      checkbox: () => (
        <CheckboxField
          {...commonProps}
          options={field.options || []}
          selectedValues={values[field.name] as (string | boolean)[]}
        />
      ),
      time: () => (
        <TimeField {...commonProps} value={values[field.name] as string} />
      ),
    };

    const FieldComponent =
      fieldComponents[field.type as keyof typeof fieldComponents];
    return FieldComponent ? FieldComponent() : fieldComponents.text();
  };

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="new-password"
      noValidate
      spellCheck={false}
    >
      <Box sx={styles.formFields}>
        {shouldUseTwoColumns ? (
          <Grid container spacing={3}>
            {memoizedFields.map((field, index) => (
              <Grid size={{ xs: 12, sm: 6 }} key={field.name}>
                {renderField(field, index)}
              </Grid>
            ))}
          </Grid>
        ) : (
          memoizedFields.map((field, index) => renderField(field, index))
        )}
      </Box>
      <Box sx={styles.buttonRow}>
        <Button onClick={onCancel} sx={styles.cancelButton}>
          {cancelLabel}
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={styles.submitButton}
          disabled={disabled}
        >
          {submitLabel}
        </Button>
      </Box>
    </form>
  );
};

export default DynamicForm;
