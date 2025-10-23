import React from "react";
import {
  TextField as MUITextField,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import { modalFormStyles } from "@/src/styles/modalForm.styles";
import { BaseFieldProps } from "../../../types/formmodal.types";
import { OptionType } from "@/src/types/types";

interface MultiSelectFieldProps extends BaseFieldProps {
  options?: OptionType[];
  disabledOptions?: string[];
  maxSelected?: number;
}

export const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  name,
  label,
  value,
  error,
  required,
  disabled,
  placeholder,
  onChange,
  inputRef,
  options = [],
  disabledOptions = [],
  maxSelected,
}) => {
  const styles = modalFormStyles();

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
      <MUITextField
        select
        value={Array.isArray(value) ? value : []}
        onChange={(e) => {
          const selectedValue = e.target.value as unknown as string[];
          onChange(name, selectedValue);
        }}
        fullWidth
        error={!!error}
        placeholder={placeholder}
        sx={{
          ...styles.inputRounded,
          "& .MuiSelect-select": {
            pr: 4,
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        }}
        inputRef={inputRef}
        disabled={disabled}
        SelectProps={{
          multiple: true,
          displayEmpty: true,
          renderValue: (selected) => {
            if (
              !selected ||
              (Array.isArray(selected) && selected.length === 0)
            ) {
              return <span style={{ color: "#aaa" }}>{placeholder}</span>;
            }

            const selectedValues = selected as string[];
            const labels = options
              .filter((opt: OptionType) => selectedValues.includes(opt.value))
              .map((opt: OptionType) => opt.label);

            return (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  pr: 4,
                }}
              >
                {labels.join(", ")}
              </Box>
            );
          },
          MenuProps: {
            PaperProps: {
              sx: {
                maxHeight: 180,
                ...styles.dropdownPaper,
              },
            },
            disablePortal: false,
            keepMounted: false,
          },
        }}
      >
        {options.map((opt: OptionType) => {
          const selectedValues = Array.isArray(value)
            ? (value as string[])
            : [];
          const isSelected = selectedValues.includes(opt.value);
          const atLimit =
            Boolean(maxSelected) &&
            selectedValues.length >= (maxSelected ?? 0) &&
            !isSelected;

          return (
            <MenuItem
              key={opt.value}
              value={opt.value}
              sx={{
                ...styles.menuItem,
                ...(isSelected ? { color: "#3D96E1" } : {}),
              }}
              disabled={
                disabledOptions.includes(opt.value) || opt.disabled || atLimit
              }
            >
              {opt.label}
            </MenuItem>
          );
        })}
      </MUITextField>
      {error && <Typography sx={styles.inputError}>{error}</Typography>}
    </Box>
  );
};