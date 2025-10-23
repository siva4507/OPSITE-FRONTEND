"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import TextInput from "@/src/components/form/inputs/textInput";
import TextAreaInput from "@/src/components/form/inputs/textAreaInput";
import RadioInput from "@/src/components/form/inputs/radioInput";
import CheckboxInput from "@/src/components/form/inputs/checkboxInput";
import DateInput from "@/src/components/form/inputs/dateInput";
import TimeInput from "@/src/components/form/inputs/timeInput";
import ESignInput from "@/src/components/form/inputs/eSignInput";
import {
  FieldConfig,
  GroupConfig,
  SectionConfig,
} from "../../types/aorFormUi.types";
import { formStyles } from "@/src/styles/form.styles";
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
import IconMapper from "../common/iconMapper";
import { useTranslation } from "@/src/hooks/useTranslation";
import SelectInput from "../form/inputs/selectInput";

interface Props {
  sections: SectionConfig[];
  values?: Record<string, unknown>;
  activeSection?: number;
  onActiveSectionChange?: (index: number) => void;
}

const LivePreview: React.FC<Props> = ({
  sections,
  values = {},
  activeSection,
  onActiveSectionChange,
}) => {
  const { t } = useTranslation();
  const classes = formStyles();
  const [previewValues, setPreviewValues] =
    useState<Record<string, any>>(values);
  const prevValuesRef = useRef<Record<string, unknown>>(null);
  const isEqual = (obj1: unknown, obj2: unknown): boolean =>
    JSON.stringify(obj1) === JSON.stringify(obj2);

  useEffect(() => {
    if (!isEqual(prevValuesRef.current, values)) {
      prevValuesRef.current = values;
      setPreviewValues(values);
    }
  }, [values]);

  const shouldShowExtents = (field: FieldConfig, parentValue?: unknown) => {
    if (!field.extents) return false;
    const parentVal = parentValue ?? previewValues[field.name]?.value ?? "";
    const triggers = field.extentstrigger?.options ?? [];
    const defaultExtent = field.extentsdefault;
    if (defaultExtent && (!parentVal || parentVal === "")) return true;
    if (triggers.length > 0) {
      const lowerTriggers = triggers.map((t) => t.toLowerCase());
      if (Array.isArray(parentVal)) {
        return parentVal.some((v) =>
          lowerTriggers.includes(String(v).toLowerCase()),
        );
      } else {
        return lowerTriggers.includes(String(parentVal).toLowerCase());
      }
    }
    return true;
  };

  const handleFieldChange = (
    fieldName: string,
    newValue: unknown,
    isExtent = false,
    parentName?: string,
  ) => {
    const targetField = parentName || fieldName;

    setPreviewValues((prev) => {
      const updated = { ...prev };
      if (isExtent) {
        if (!updated[targetField]) {
          updated[targetField] = {};
        }
        updated[targetField] = {
          ...updated[targetField],
          [fieldName]: newValue,
        };
      } else {
        updated[targetField] = {
          ...updated[targetField],
          value: newValue,
        };
      }

      return updated;
    });
  };

  const renderField = (
    field: FieldConfig,
    isExtent = false,
    parentName?: string,
  ) => {
    const fieldKey = parentName || field.name;
    const valueObj = previewValues[fieldKey] || {};
    const isRadioField = field.type === RADIO;
    const isExtentOfRadio =
      isExtent && parentName && previewValues[parentName]?.value;
    const shouldBeInteractive = isRadioField || isExtentOfRadio;
    const value = isExtent
      ? (valueObj[field.name] ?? "")
      : (valueObj.value ?? "");

    const commonProps = {
      placeholder: field.placeholder,
      required: field.required,
      name: field.name,
      classes,
      value,
      rows: field.rows || 3,
      onChange: (e: any, val?: any) => {
        const newValue =
          val !== undefined ? val : e?.target ? e.target.value : e;
        handleFieldChange(field.name, newValue, isExtent, parentName);
      },
      onFocus: () => {},
      onClick: () => {},
    };

    let mainField = null;
    let radioLabel = null;

    switch (field.type) {
      case TEXT:
        mainField = (
          <TextInput
            key={field.name}
            {...commonProps}
            disabled={!shouldBeInteractive}
          />
        );
        break;
      case TEXTAREA:
        mainField = (
          <TextAreaInput
            key={field.name}
            {...commonProps}
            disabled={!shouldBeInteractive}
          />
        );
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
            disabled={false}
            onChange={(e: unknown, val: unknown) => {
              handleFieldChange(field.name, val, isExtent, parentName);
            }}
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
            disabled={!shouldBeInteractive}
            onChange={
              shouldBeInteractive
                ? (option: string) => {
                    const current = Array.isArray(value) ? value : [];
                    const newValue = current.includes(option)
                      ? current.filter((v) => v !== option)
                      : [...current, option];
                    handleFieldChange(
                      field.name,
                      newValue,
                      isExtent,
                      parentName,
                    );
                  }
                : () => {}
            }
          />
        );
        break;
      case DATE:
        mainField = (
          <DateInput
            key={field.name}
            {...commonProps}
            disabled={!shouldBeInteractive}
            readOnlyPreview={!shouldBeInteractive}
            onChange={
              shouldBeInteractive
                ? (e: any) => {
                    handleFieldChange(
                      field.name,
                      e?.target?.value || e,
                      isExtent,
                      parentName,
                    );
                  }
                : () => {}
            }
          />
        );
        break;
      case TIME:
        mainField = (
          <TimeInput
            key={field.name}
            {...commonProps}
            disabled={!shouldBeInteractive}
            readOnlyPreview={!shouldBeInteractive}
            onChange={
              shouldBeInteractive
                ? (e: any) => {
                    handleFieldChange(
                      field.name,
                      e?.target?.value || e,
                      isExtent,
                      parentName,
                    );
                  }
                : () => {}
            }
          />
        );
        break;
      case ESIGN:
        mainField = (
          <ESignInput
            key={field.name}
            {...commonProps}
            disabled={!shouldBeInteractive}
          />
        );
        break;
      case SELECT:
        mainField = (
          <SelectInput
            key={field.name}
            {...commonProps}
            options={
              field.options?.map((opt) =>
                typeof opt === "string" ? { label: opt, value: opt } : opt,
              ) || []
            }
            onChange={(e) => {
              const val = e.target.value; // MUI SelectChangeEvent
              handleFieldChange(field.name, val, isExtent, parentName);
            }}
            // disabled={!shouldBeInteractive}
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

          {field.extents && shouldShowExtents(field, value) && (
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
          {field.extents && shouldShowExtents(field, valueObj.value) && (
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

  const renderGroupContent = (groups: GroupConfig[]) => {
    if (
      groups &&
      groups.length === 2 &&
      groups[0].alignment === HALF &&
      groups[1].alignment === HALF
    ) {
      return (
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
      return groups.map((group, idx) => (
        <Box key={idx} sx={classes.groupContainer}>
          {group.title && <Box sx={classes.groupTitle}>{group.title}</Box>}
          {renderFields(group.fields, group.alignment || FULL)}
        </Box>
      ));
    }
    return null;
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          mb: 2,
          overflowX: "hidden",
          background: "#1A1A1A26",
          backdropFilter: "blur(50.25px)",
          borderRadius: 4,
          boxShadow: `8.13px 8.13px 24.38px -5.2px #FFFFFF66 inset, -16.25px -8.13px 8.13px -5.2px #FFFFFF33 inset, 0px 0px 20.8px -5.2px #FFFFFF33 inset`,
        }}
      >
        {sections.map((section, index) => (
          <Box
            key={section.id}
            onClick={() => onActiveSectionChange?.(index)}
            sx={{
              flex: 1,
              px: 3,
              py: 2,
              cursor: "pointer",
              color: activeSection === index ? "#1976d2" : "#FFF",
              fontWeight: activeSection === index ? 600 : 400,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textAlign: "center",
            }}
            title={section.title}
          >
            <Box
              sx={{
                mr: 1,
                mt: 0.01,
                display: "inline-flex",
                verticalAlign: "middle",
              }}
            >
              {section?.icon && (
                <IconMapper
                  icon={section.icon}
                  fontSize="small"
                  color={activeSection === index ? "#1976d2" : "#FFF"}
                />
              )}
            </Box>

            {section.title || `Section ${index + 1}`}
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          ...classes.formContainer,
          height: "calc(100vh - 300px)",
          minHeight: "350px", // fallback
          maxHeight: "600px",
          // p: 3,
          mb: 10,
          overflowY: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {sections[activeSection ?? 0] && (
          <Box>
            <Box sx={classes.header}>
              <Box>
                {sections[activeSection ?? 0].title && (
                  <Box sx={classes.title}>
                    {sections[activeSection ?? 0].title}
                  </Box>
                )}
                {sections[activeSection ?? 0].description && (
                  <Box sx={classes.description}>
                    {sections[activeSection ?? 0].description}
                  </Box>
                )}
              </Box>
            </Box>

            <Box style={classes.formContent}>
              {renderGroupContent(sections[activeSection ?? 0].group)}
            </Box>
          </Box>
        )}

        {sections.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              color: "rgba(255, 255, 255, 0.6)",
            }}
          >
            <Typography variant="body1">
              {t("aorForms.createSection")}
            </Typography>
          </Box>
        )}

        {sections.length > 0 && !sections[activeSection ?? 0] && (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              color: "rgba(255, 255, 255, 0.6)",
            }}
          >
            <Typography variant="body1">
              {t("aordForms.sectionNotFound")}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LivePreview;
