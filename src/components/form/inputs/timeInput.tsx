import React, { useRef } from "react";
import TextField from "@mui/material/TextField";
import { formStyles } from "@/src/styles/form.styles";
import { Box } from "@mui/material";
import { TimeInputProps } from "@/src/types/form.types";

const TimeInput: React.FC<TimeInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  required,
  name,
  error = false,
  helperText = "",
  disabled,
  readOnlyPreview = false,
}) => {
  const styles = formStyles();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleOpenTimePicker = () => {
    if (readOnlyPreview || disabled) return;
    if (inputRef.current) {
      inputRef.current.showPicker?.();
      inputRef.current.focus();
    }
  };

  return (
    <Box sx={styles.inputWrapper} onClick={handleOpenTimePicker}>
      {label && (
        <label style={styles.label} htmlFor={name}>
          {label} {required && <span style={styles.required}>*</span>}
        </label>
      )}
      <TextField
        inputRef={inputRef}
        id={name}
        name={name}
        type="time"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        variant="outlined"
        fullWidth
        slotProps={{
          inputLabel: { shrink: true },
          input: { sx: styles.dateTimeInput },
        }}
        sx={styles.dateTimeTextField}
        error={error}
        helperText={error ? helperText : ""}
        FormHelperTextProps={{ style: { color: "#FF3F2F" } }}
      />
    </Box>
  );
};

export default TimeInput;
