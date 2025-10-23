import React from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Box,
} from "@mui/material";
import { formStyles } from "@/src/styles/form.styles";
import { CheckboxInputProps } from "@/src/types/form.types";

const CheckboxInput: React.FC<CheckboxInputProps> = ({
  label,
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
    <Box sx={styles.inputWrapper}>
      {label && (
        <FormLabel
          sx={{
            ...styles.label,
            marginBottom: options.length > 5 ? 2 : styles.label.marginBottom,
          }}
          component="legend"
        >
          {label} {required && <span style={styles.required}>*</span>}
        </FormLabel>
      )}
      {options.length > 5 ? (
        <FormGroup sx={styles.checkboxTwoColumn}>
          {options.map((option) => (
            <FormControlLabel
              key={option}
              control={
                <Checkbox
                  checked={value.includes(option)}
                  disabled={disabled}
                  onChange={() => onChange(option)}
                  sx={{
                    color: "#FFF",
                    "&.Mui-checked": { color: "#00B2E3" },
                  }}
                />
              }
              label={<span style={{ color: "#FFF" }}>{option}</span>}
            />
          ))}
        </FormGroup>
      ) : (
        <FormGroup>
          {options.map((option) => (
            <FormControlLabel
              key={option}
              disabled={disabled}
              control={
                <Checkbox
                  checked={value.includes(option)}
                  onChange={() => onChange(option)}
                  sx={{
                    color: "#FFF",
                    "&.Mui-checked": { color: "#00B2E3" },
                  }}
                />
              }
              label={<span style={{ color: "#FFF" }}>{option}</span>}
            />
          ))}
        </FormGroup>
      )}
      {error && (
        <Box sx={{ color: "#FF3F2F", fontSize: "0.75rem", mt: 0.5 }}>
          {helperText}
        </Box>
      )}
    </Box>
  );
};

export default CheckboxInput;
