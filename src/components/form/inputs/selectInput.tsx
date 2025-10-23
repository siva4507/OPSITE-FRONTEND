"use client";

import React from "react";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
} from "@mui/material";
import { formStyles } from "@/src/styles/form.styles";
import { SelectInputProps } from "@/src/types/form.types";

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  value,
  onChange,
  required,
  name,
  error = false,
  helperText = "",
  options = [], // [{ label: "Option 1", value: "1" }]
  disabled,
  onFocus,
  onBlur,
  onClick,
}) => {
  const styles = formStyles();

  const handleChange = (
    e: SelectChangeEvent<string>,
    child: React.ReactNode,
  ) => {
    onChange?.(e, child);
  };

  const dropdownMenuPaperStyle = {
    boxShadow: "0px 4px 4px 0px #00000040, inset 0px 6px 30.6px 0px #FFFFFF40",
    background: "#1A1A1A26",
    backdropFilter: "blur(20.25px)",
    WebkitBackdropFilter: "blur(20.25px)",
    color: "#FFF",
    maxHeight: 200,
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "#888 transparent",
    "&::-webkit-scrollbar": {
      width: "6px",
      borderRadius: "8px",
      background: "#e0e0e0",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#888",
      borderRadius: "8px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#857a7aff",
    },
    scrollBehavior: "smooth",
    "& .MuiMenuItem-root": {
      whiteSpace: "normal",
      flexDirection: "column",
      alignItems: "flex-start",
      py: 1.5,
      fontSize: "0.85rem",
    },
  };

  return (
    <Box sx={styles.inputWrapper}>
      {label && (
        <label style={styles.label} htmlFor={name}>
          {label} {required && <span style={styles.required}>*</span>}
        </label>
      )}
      <FormControl
        fullWidth
        variant="outlined"
        error={error}
        disabled={disabled}
        sx={styles.textField}
      >
        <Select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onClick={onClick}
          displayEmpty
          sx={styles.input}
          MenuProps={{
            PaperProps: {
              sx: dropdownMenuPaperStyle,
            },
          }}
        >
          {options && options.filter(Boolean).length > 0 ? (
            options
              .filter(
                (opt): opt is string | { label: string; value: string } =>
                  opt != null,
              )
              .map((opt, idx) =>
                typeof opt === "string" ? (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ) : (
                  <MenuItem key={opt.value || idx} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ),
              )
          ) : (
            <MenuItem disabled value="">
              No options available
            </MenuItem>
          )}
        </Select>

        {error && (
          <FormHelperText style={{ color: "#FF3F2F" }}>
            {helperText}
          </FormHelperText>
        )}
      </FormControl>
    </Box>
  );
};

export default SelectInput;
