"use client";

import React from "react";
import TextField from "@mui/material/TextField";
import { formStyles } from "@/src/styles/form.styles";
import { Box } from "@mui/material";
import { TextInputProps } from "@/src/types/form.types";

const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  required,
  name,
  error = false,
  helperText = "",
  onFocus,
  onBlur,
  onClick,
  disabled,
}) => {
  const styles = formStyles();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const cleanVal = rawVal.trim() === "" ? "" : rawVal;
    const event = {
      ...e,
      target: {
        ...e.target,
        value: cleanVal,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange?.(event);
  };

  return (
    <Box sx={styles.inputWrapper}>
      {label && (
        <label style={styles.label} htmlFor={name}>
          {label} {required && <span style={styles.required}>*</span>}
        </label>
      )}
      <TextField
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
        variant="outlined"
        disabled={disabled}
        fullWidth
        slotProps={{
          input: { sx: styles.input },
        }}
        sx={styles.textField}
        error={error}
        helperText={error ? helperText : ""}
        FormHelperTextProps={{ style: { color: "#FF3F2F" } }}
      />
    </Box>
  );
};

export default TextInput;
