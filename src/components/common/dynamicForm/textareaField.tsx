import React from "react";
import { TextField as MUITextField, Typography, Box } from "@mui/material";
import { modalFormStyles } from "@/src/styles/modalForm.styles";
import { BaseFieldProps } from "../../../types/formmodal.types";

interface TextAreaFieldProps extends BaseFieldProps {
  maxlength?: number;
  rows?: number;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  name,
  label,
  value,
  error,
  required,
  disabled,
  placeholder,
  onChange,
  inputRef,
  maxlength,
  rows = 4,
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
        multiline
        rows={rows}
        type="text"
        value={value ?? ""}
        onChange={(e) => {
          const rawVal = e.target.value;
          const cleanVal = rawVal.trim() === "" ? "" : rawVal;
          onChange(name, cleanVal);
        }}
        fullWidth
        error={!!error}
        placeholder={placeholder}
        sx={{
          ...styles.inputRounded,
          "& textarea:-webkit-autofill, & textarea:-webkit-autofill:hover, & textarea:-webkit-autofill:focus":
            {
              WebkitBoxShadow: "0 0 0px 1000px transparent inset",
              WebkitTextFillColor: "#FFFFFF",
              transition: "background-color 9999s ease-in-out 0s",
            },
          "& textarea": {
            backgroundColor: "transparent !important",
            color: "#FFFFFF",
            caretColor: "#FFFFFF",
          },
        }}
        inputRef={inputRef}
        disabled={disabled}
        autoComplete="off"
        name={`${name}-noautofill-${Math.random()}`}
        slotProps={{
          htmlInput: {
            maxLength: maxlength,
            autoComplete: "off",
            autoCorrect: "off",
            autoCapitalize: "off",
            spellCheck: false,
          },
        }}
      />

      {error && <Typography sx={styles.inputError}>{error}</Typography>}
    </Box>
  );
};