import React, { useState } from "react";
import { TextField as MUITextField, Typography, Box } from "@mui/material";
import { modalFormStyles } from "@/src/styles/modalForm.styles";
import { BaseFieldProps } from "../../../types/formmodal.types";

interface NumberFieldProps extends BaseFieldProps {
  min?: number;
  max?: number;
  step?: number;
  maxlength?: number;
}

export const NumberField: React.FC<NumberFieldProps> = ({
  name,
  label,
  value,
  error,
  required,
  disabled,
  placeholder,
  onChange,
  inputRef,
  min,
  max,
  maxlength,
  step = 1,
}) => {
  const styles = modalFormStyles();
  const [internalValue, setInternalValue] = useState(value ?? "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    val = val.replace(/[^0-9.-]/g, "");

    const parts = val.split(".");
    if (parts.length > 2) val = `${parts[0]}.${parts[1]}`;

    const minusCount = (val.match(/-/g) || []).length;
    if (minusCount > 1) val = val.replace(/-/g, "");

    if (maxlength && val.length > maxlength) {
      val = val.slice(0, maxlength);
    }

    setInternalValue(val);
    onChange(name, val);
  };

  const handleBlur = () => {
    if (internalValue === "" || internalValue === "-" || internalValue === ".")
      return;

    let num = Number(internalValue);

    if (!isNaN(num)) {
      if (min !== undefined && num < min) num = min;
      if (max !== undefined && num > max) num = max;

      setInternalValue(num.toString());
      onChange(name, num.toString());
    }
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
        type="text"
        name={name}
        value={internalValue}
        onChange={handleChange}
        onBlur={handleBlur}
        fullWidth
        error={!!error}
        placeholder={placeholder}
        disabled={disabled}
        sx={{
          ...styles.inputRounded,
          "& input": { MozAppearance: "textfield" },
        }}
        inputRef={inputRef}
        inputProps={{
          inputMode: "decimal",
          pattern: "-?[0-9]*\\.?[0-9]*",
          maxLength: maxlength,
          step,
        }}
      />
      {error && <Typography sx={styles.inputError}>{error}</Typography>}
    </Box>
  );
};
