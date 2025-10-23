import React from "react";
import { TextField as MUITextField, Typography, Box } from "@mui/material";
import { modalFormStyles } from "@/src/styles/modalForm.styles";
import { BaseFieldProps } from "../../../types/formmodal.types";

type ColorFieldProps = BaseFieldProps;

export const ColorField: React.FC<ColorFieldProps> = ({
  name,
  label,
  value,
  error,
  required,
  disabled,
  placeholder,
  onChange,
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
      <Box display="flex" alignItems="center" gap={2}>
        <input
          type="color"
          value={String(value ?? "#000000")}
          onChange={(e) => onChange(name, e.target.value)}
          disabled={disabled}
          style={{
            width: 40,
            height: 40,
            border: "none",
            background: "transparent",
            cursor: disabled ? "default" : "pointer",
          }}
        />
        <MUITextField
          type="text"
          value={value ?? ""}
          onChange={(e) => {
            let val = e.target.value;
            if (!val.startsWith("#")) {
              val = `#${val.replace(/^#*/, "")}`;
            }
            val = `#${val
              .slice(1)
              .replace(/[^0-9A-Fa-f]/g, "")
              .slice(0, 6)}`;
            onChange(name, val);
          }}
          fullWidth
          error={!!error}
          placeholder={placeholder || "#FFFFFF"}
          sx={styles.inputRounded}
          disabled={disabled}
        />
      </Box>
      {error && <Typography sx={styles.inputError}>{error}</Typography>}
    </Box>
  );
};
