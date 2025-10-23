import React from "react";
import { ToggleButtonGroup, ToggleButton, Box } from "@mui/material";
import { formStyles } from "@/src/styles/form.styles";
import { RadioInputProps } from "@/src/types/form.types";

const RadioInput: React.FC<RadioInputProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  required,
  error = false,
  helperText = "",
  disabled,
}) => {
  const styles = formStyles();

  return (
    <Box sx={styles.radioInputWrapper}>
      {label && (
        <label style={styles.radioLabel} htmlFor={name}>
          {label} {required && <span style={styles.required}>*</span>}
        </label>
      )}
      <Box sx={{ flex: 1 }} />
      <Box sx={styles.radioToggleContainer}>
        <ToggleButtonGroup
          exclusive
          value={value}
          disabled={disabled}
          onChange={(_e, val) => {
            if (val !== null && val !== undefined) {
              onChange(_e, val);
            }
          }}
        >
          {options.map((option) => (
            <ToggleButton
              key={option}
              value={option}
              sx={styles.radioButton(value === option)}
            >
              {option.toUpperCase()}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
      {error && (
        <Box sx={{ color: "#FF3F2F", fontSize: "0.75rem", mt: 0.5 }}>
          {helperText}
        </Box>
      )}
    </Box>
  );
};

export default RadioInput;
