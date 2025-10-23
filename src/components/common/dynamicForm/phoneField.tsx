import React from "react";
import { TextField as MUITextField, Typography, Box } from "@mui/material";
import { modalFormStyles } from "@/src/styles/modalForm.styles";
import { BaseFieldProps } from "../../../types/formmodal.types";

type PhoneFieldProps = BaseFieldProps;

const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "");

  const match = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (!match) return value;

  let formatted = "";
  if (match[1]) {
    formatted = `(${match[1]}`;
  }
  if (match[1] && match[1].length === 3) {
    formatted += ") ";
  }
  if (match[2]) {
    formatted += match[2];
  }
  if (match[2] && match[2].length === 3) {
    formatted += "-";
  }
  if (match[3]) {
    formatted += match[3];
  }

  return formatted;
};

export const PhoneField: React.FC<PhoneFieldProps> = ({
  name,
  label,
  value,
  error,
  required,
  disabled,
  placeholder,
  onChange,
  inputRef,
}) => {
  const styles = modalFormStyles();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatPhoneNumber(rawValue);
    onChange(name, formatted);
  };

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
        type="tel"
        name={name}
        value={value ?? ""}
        onChange={handleInputChange}
        fullWidth
        error={!!error}
        placeholder={placeholder || "(123) 456-7890"}
        disabled={disabled}
        sx={styles.inputRounded}
        inputRef={inputRef}
        slotProps={{
          htmlInput: {
            maxLength: 14,
            autoComplete: "new-password",
            inputMode: "numeric",
            autoCorrect: "off",
            autoCapitalize: "off",
          },
        }}
      />
      {error && <Typography sx={styles.inputError}>{error}</Typography>}
    </Box>
  );
};

export default PhoneField;
