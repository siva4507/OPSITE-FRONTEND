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
import { useTranslation } from "@/src/hooks/useTranslation";

interface SelectFieldProps extends BaseFieldProps {
  options?: OptionType[];
  disabledOptions?: string[];
}

export const SelectField: React.FC<SelectFieldProps> = ({
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
}) => {
  const styles = modalFormStyles();
  const { t } = useTranslation();
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
        value={value ?? ""}
        onChange={(e) => onChange(name, e.target.value)}
        fullWidth
        error={!!error}
        sx={styles.inputRounded}
        inputRef={inputRef}
        disabled={disabled}
        SelectProps={{
          displayEmpty: true,
          MenuProps: {
            PaperProps: {
              sx: {
                maxHeight: 180,
                ...styles.dropdownPaper,
                zIndex: 1400,
              },
            },
            disablePortal: false,
            keepMounted: false,
          },
        }}
      >
        <MenuItem value="" sx={{ color: "#aaa" }}>
          {placeholder || t("form.selectOption")}
        </MenuItem>
        {options.map((opt: OptionType) => (
          <MenuItem
            key={opt.value}
            value={opt.value}
            sx={styles.menuItem}
            disabled={disabledOptions.includes(opt.value) || opt.disabled}
          >
            {opt.label}
          </MenuItem>
        ))}
      </MUITextField>
      {error && <Typography sx={styles.inputError}>{error}</Typography>}
    </Box>
  );
};