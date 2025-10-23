"use client";

import React from "react";
import TextField from "@mui/material/TextField";
import { formStyles } from "@/src/styles/form.styles";
import { Box } from "@mui/material";
import { TextAreaInputProps } from "@/src/types/form.types";

const TextAreaInput: React.FC<TextAreaInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  required,
  name,
  rows = 3,
  error = false,
  helperText = "",
  onBlur,
  onFocus,
  onClick,
  disabled,
}) => {
  const styles = formStyles();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const rawVal = e.target.value;
    const cleanVal = rawVal.trim() === "" ? "" : rawVal;
    const event = {
      ...e,
      target: {
        ...e.target,
        value: cleanVal,
      },
    } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

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
        onBlur={onBlur}
        onFocus={onFocus}
        onClick={onClick}
        disabled={disabled}
        variant="outlined"
        fullWidth
        multiline
        rows={rows}
        sx={{
          ...styles.textAreaField,
          ...(error && {
            borderColor: "#FF3F2F",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#FF3F2F",
              },
            },
          }),
        }}
        error={error}
        helperText={error ? helperText : ""}
        FormHelperTextProps={{ style: { color: "#FF3F2F" } }}
      />
    </Box>
  );
};

export default TextAreaInput;
