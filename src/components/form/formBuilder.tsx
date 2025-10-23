"use client";

import React, { useCallback } from "react";
import TextInput from "./inputs/textInput";
import TextAreaInput from "./inputs/textAreaInput";
import RadioInput from "./inputs/radioInput";
import CheckboxInput from "./inputs/checkboxInput";
import DateInput from "./inputs/dateInput";
import TimeInput from "./inputs/timeInput";
import ESignInput from "./inputs/eSignInput";
import SelectInput from "./inputs/selectInput";
import { useFormValues } from "./formValuesContext";
import { formStyles } from "@/src/styles/form.styles";
import { Box } from "@mui/material";
import {
  FieldConfig,
  FormBuilderProps,
  NestedFieldErrors,
} from "@/src/types/form.types";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  setLastFocusedField,
  setLastFocusedFieldInfo,
} from "@/src/store/slices/shiftChangeSlice";
import {
  TEXT,
  TEXTAREA,
  RADIO,
  CHECKBOX,
  DATE,
  TIME,
  ESIGN,
  SELECT,
  FULL,
  HALF,
} from "@/src/utils/constant";
import { UserRole } from "@/src/types/auth.types";

const FormBuilder: React.FC<
  Omit<FormBuilderProps, "fieldErrors"> & {
    fieldErrors?: NestedFieldErrors;
    shiftStartTime?: string;
    shiftType?: string;
  }
> = ({
  fields,
  title,
  description,
  groups,
  showErrors: showErrorsProp,
  fieldErrors = {},
  shiftStartTime,
  shiftType,
}) => {
  const formValuesContext = useFormValues();
  const values = formValuesContext?.values ?? {};
  const setValue = formValuesContext?.setValue ?? (() => {});
  const dispatch = useAppDispatch();
  const classes = formStyles();
  const { selectedRole } = useAppSelector((state) => state.auth);
  const isObserver = selectedRole === UserRole.Observer;

  const createFieldHandlers = useCallback(
    (
      fieldKey: string,
      fieldType: string,
      isExtent: boolean,
      parentName?: string,
      extentFieldName?: string,
    ) => {
      const handleFocus = () => {
        if (fieldType === TEXT || fieldType === TEXTAREA) {
          dispatch(setLastFocusedField(fieldKey));
          dispatch(
            setLastFocusedFieldInfo({
              fieldName: isExtent ? extentFieldName || fieldType : fieldKey,
              isExtent,
              parentField: parentName,
            }),
          );
        }
      };

      const handleClick = () => {
        if (fieldType === TEXT || fieldType === TEXTAREA) {
          dispatch(setLastFocusedField(fieldKey));
          dispatch(
            setLastFocusedFieldInfo({
              fieldName: isExtent ? extentFieldName || fieldType : fieldKey,
              isExtent,
              parentField: parentName,
            }),
          );
        }
      };
      return { handleFocus, handleClick };
    },
    [dispatch],
  );

  const shouldShowExtents = (
    field: FieldConfig,
    valueObj?: Record<string, unknown>,
  ) => {
    if (!field.extents) return false;
    const value = valueObj
      ? valueObj.value
      : (values[field.name] as Record<string, unknown>)?.value;
    const trigger = field.extentstrigger?.options;
    if (trigger && trigger.length > 0) {
      const triggerLower = trigger.map((t) => t.toLowerCase());
      const isTriggered = Array.isArray(value)
        ? value.some((val: unknown) =>
            triggerLower.includes(String(val).toLowerCase()),
          )
        : triggerLower.includes(String(value).toLowerCase());
      return isTriggered;
    }
    return true;
  };

  // Memoized change handler
  const createChangeHandler = useCallback(
    (
      fieldKey: string,
      fieldName: string,
      isExtent: boolean,
      valueObj: Record<string, unknown>,
    ) =>
      (val: string | string[]) => {
        if (isExtent) {
          const newValueObj = { ...valueObj, [fieldName]: val };
          setValue(fieldKey, newValueObj);
        } else {
          const newValueObj = { ...valueObj, value: val };
          setValue(fieldKey, newValueObj);
        }
      },
    [setValue],
  );

  const renderField = (
    field: FieldConfig,
    isExtent = false,
    parentName?: string,
  ) => {
    const fieldKey = parentName || field.name;
    const valueObj = (values[fieldKey] as Record<string, any>) || {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    const value = isExtent
      ? (valueObj[field.name] ?? "")
      : (valueObj.value ?? "");

    const handleChange = createChangeHandler(
      fieldKey,
      field.name,
      isExtent,
      valueObj,
    );

    const { handleFocus, handleClick } = createFieldHandlers(
      fieldKey,
      field.type,
      isExtent,
      parentName,
      isExtent ? field.name : undefined,
    );



    let shouldShowError = false;
    if (isExtent && parentName) {
      shouldShowError = !!(
        showErrorsProp && fieldErrors[parentName]?.extents?.[field.name]
      );
    } else {
      const mainError = !!(showErrorsProp && fieldErrors[field.name]?.main);
      const extentErrors = !!(
        showErrorsProp &&
        fieldErrors[field.name]?.extents &&
        Object.values(fieldErrors[field.name].extents || {}).some(Boolean)
      );
      shouldShowError = mainError || extentErrors;
    }

    const commonProps = {
      placeholder: field.placeholder,
      required: field.required,
      name: field.name,
      classes,
      value,
      onChange: (e: any) => handleChange(e.target ? e.target.value : e), // eslint-disable-line @typescript-eslint/no-explicit-any
      rows: field.rows || 3,
      onFocus: handleFocus,
      onClick: handleClick,
      disabled: isObserver,
    };

    let mainField = null;
    let radioLabel = null;
    switch (field.type) {
      case TEXT:
        mainField = <TextInput key={field.name} {...commonProps} />;
        break;
      case TEXTAREA:
        mainField = <TextAreaInput key={field.name} {...commonProps} />;
        break;
      case RADIO:
        radioLabel = field.label && (
          <Box
            sx={{
              ...classes.labelWithMargin,
              display: "inline",
              alignItems: "center",
              marginBottom: 0,
              mr: 2,
              mb: 0,
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
            component="label"
            htmlFor={field.name}
          >
            <span>
              {field.label}
              {field.required && (
                <span style={classes.requiredAsterisk}>&nbsp;*</span>
              )}
            </span>
          </Box>
        );
        mainField = (
          <RadioInput
            key={field.name}
            {...commonProps}
            options={field.options || []}
            value={value}
            onChange={(_e, val) => handleChange(val)}
          />
        );
        break;
      case CHECKBOX:
        mainField = (
          <CheckboxInput
            key={field.name}
            {...commonProps}
            options={field.options || []}
            value={Array.isArray(value) ? value : []}
            onChange={(option) => {
              const current = Array.isArray(value) ? value : [];
              const newValue = current.includes(option as string)
                ? current.filter((v: string) => v !== option)
                : [...current, option];
              handleChange(newValue);
            }}
          />
        );
        break;
      case DATE:
        mainField = <DateInput key={field.name} {...commonProps} />;
        break;
      case TIME:
        mainField = <TimeInput key={field.name} {...commonProps} />;
        break;
      case ESIGN:
        mainField = <ESignInput key={field.name} {...commonProps} />;
        break;
      case SELECT:
        const selectOptions = valueObj.options
          ? valueObj.options.map((opt: string) => ({ label: opt, value: opt }))
          : field.options?.map((opt) =>
              typeof opt === "string" ? { label: opt, value: opt } : opt,
            ) || [];

        mainField = (
          <SelectInput
            key={field.name}
            {...commonProps}
            options={selectOptions}
            onChange={(e) => handleChange(e.target.value)}
          />
        );
        break;
      default:
        mainField = null;
    }

    const labelAndDescription = (
      <>
        {field.type !== RADIO && field.label && (
          <Box
            sx={{
              ...classes.labelWithMargin,
              display: "inline",
              alignItems: "center",
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
            component="label"
            htmlFor={field.name}
          >
            <span>
              {field.label}
              {field.required && (
                <span style={classes.requiredAsterisk}>&nbsp;*</span>
              )}
            </span>
          </Box>
        )}
        {field.description && (
          <Box sx={classes.fieldDescription}>{field.description}</Box>
        )}
      </>
    );

    const fieldWrapperStyle = {
      ...(field.type === TEXT || field.type === ESIGN
        ? classes.noBorderFieldWrapper
        : shouldShowError
          ? classes.fieldWrapperError
          : classes.fieldWrapper),
      ...classes.fieldWrapperWithPosition,
    };

    if (isExtent) {
      return (
        <Box sx={classes.inputWrapper} key={field.name}>
          {field.type === RADIO ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                fontWeight: 400,
              }}
            >
              {radioLabel}
              <Box sx={{ flex: 1 }}>{mainField}</Box>
            </Box>
          ) : (
            <>
              {labelAndDescription}
              {mainField}
            </>
          )}
          {field.extents && shouldShowExtents(field, valueObj) && (
            <Box>
              {field.extents.map((ex) => renderField(ex, true, fieldKey))}
            </Box>
          )}
        </Box>
      );
    } else {
      return (
        <Box sx={fieldWrapperStyle} key={field.name}>
          <Box sx={classes.inputWrapper}>
            {field.type === RADIO ? (
              <Box
                sx={{ display: "flex", alignItems: "center", width: "100%" }}
              >
                {radioLabel}
                <Box sx={{ flex: 1 }}>{mainField}</Box>
              </Box>
            ) : (
              <>
                {labelAndDescription}
                {mainField}
              </>
            )}
          </Box>
          {field.extents && shouldShowExtents(field, valueObj) && (
            <Box>
              {field.extents.map((ex) => renderField(ex, true, fieldKey))}
            </Box>
          )}
        </Box>
      );
    }
  };

  const getFieldWidth = (groupAlign: string, fieldAlign: string) => {
    if (groupAlign === HALF && fieldAlign === HALF) return "50%";
    if (groupAlign === HALF && fieldAlign === FULL) return "100%";
    if (groupAlign === FULL && fieldAlign === HALF) return "50%";
    return "100%";
  };

  const renderFields = (fields: FieldConfig[], groupAlign: string) => {
    if (groupAlign === FULL) {
      const rows: React.ReactNode[] = [];
      let i = 0;
      while (i < fields.length) {
        if (fields[i].alignment === HALF && fields[i + 1]?.alignment === HALF) {
          rows.push(
            <Box key={`row-${i}`} sx={classes.rowContainer}>
              <Box sx={classes.halfWidthField}>{renderField(fields[i])}</Box>
              <Box sx={classes.halfWidthField}>
                {renderField(fields[i + 1])}
              </Box>
            </Box>,
          );
          i += 2;
        } else if (fields[i].alignment === HALF) {
          rows.push(
            <Box key={`row-${i}`} sx={classes.rowContainer}>
              <Box sx={classes.halfWidthField}>{renderField(fields[i])}</Box>
              <Box sx={classes.halfWidthField} />
            </Box>,
          );
          i += 1;
        } else {
          rows.push(
            <Box key={`row-${i}`} sx={classes.fullWidthField}>
              {renderField(fields[i])}
            </Box>,
          );
          i += 1;
        }
      }
      return <>{rows}</>;
    }
    return (
      <Box sx={classes.fieldsContainer}>
        {fields.map((field) => {
          const width = getFieldWidth(groupAlign, field.alignment || FULL);
          return (
            <Box key={field.name} sx={classes.fieldContainer(width)}>
              {renderField(field)}
            </Box>
          );
        })}
      </Box>
    );
  };

  let content: React.ReactNode = null;
  if (
    groups &&
    groups.length === 2 &&
    groups[0].alignment === HALF &&
    groups[1].alignment === HALF
  ) {
    content = (
      <Box sx={classes.twoColumnGroupContainer}>
        {groups.map((group, idx) => (
          <Box key={idx} sx={classes.halfWidthGroup}>
            {group.title && <Box sx={classes.groupTitle}>{group.title}</Box>}
            {renderFields(group.fields, HALF)}
          </Box>
        ))}
      </Box>
    );
  } else if (groups && groups.length > 0) {
    content = groups.map((group, idx) => (
      <Box key={idx} sx={classes.groupContainer}>
        {group.title && <Box sx={classes.groupTitle}>{group.title}</Box>}
        {renderFields(group.fields, group.alignment || FULL)}
      </Box>
    ));
  } else {
    content = renderFields(fields, FULL);
  }

  return (
    <Box sx={classes.formContainer}>
      <Box sx={classes.header}>
        <Box>
          {title && <Box sx={classes.title}>{title}</Box>}
          {description && <Box sx={classes.description}>{description}</Box>}
        </Box>
        {(shiftStartTime || shiftType) && (
          <Box sx={classes.infoBox}>
            {shiftType && <span style={classes.shiftType}>{shiftType}</span>}
            {shiftStartTime && (
              <span style={classes.shiftTime}>| {shiftStartTime}</span>
            )}
          </Box>
        )}
      </Box>
      <form style={classes.formContent}>{content}</form>
    </Box>
  );
};

export default FormBuilder;
