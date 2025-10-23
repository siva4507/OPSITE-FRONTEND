import React from "react";
import { Typography, Box } from "@mui/material";
import { modalFormStyles } from "@/src/styles/modalForm.styles";
import { BaseFieldProps } from "../../../types/formmodal.types";
import { TagsInput } from "../tagInput";

interface TagsFieldProps extends BaseFieldProps {
  maxSelected?: number;
  maxlength?: number;
}

export const TagsField: React.FC<TagsFieldProps> = ({
  name,
  label,
  value,
  error,
  required,
  placeholder,
  onChange,
  maxSelected,
  maxlength,
}) => {
  const styles = modalFormStyles();

  const handleTagsChange = (tags: string[]) => {
    onChange(name, tags.join(","));
  };

  const tagsValue = Array.isArray(value)
    ? (value as string[])
    : value
      ? String(value)
          .split(",")
          .map((s) => s.trim())
      : [];

  return (
    <Box sx={styles.formFieldBox}>
      {label && (
        <Typography sx={styles.inputLabel}>
          {label}
          {required && (
            <span style={{ color: "#F44336", marginLeft: 2 }}>*</span>
          )}
        </Typography>
      )}
      <TagsInput
        value={tagsValue}
        onChange={handleTagsChange}
        maxTags={maxSelected}
        maxTagLength={maxlength}
        placeholder={placeholder}
      />
      {error && <Typography sx={styles.inputError}>{error}</Typography>}
    </Box>
  );
};