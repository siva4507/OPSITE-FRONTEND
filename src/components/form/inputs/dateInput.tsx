import React, { useRef } from "react";
import TextField from "@mui/material/TextField";
import { formStyles } from "@/src/styles/form.styles";
import { Box } from "@mui/material";
import { DateInputProps } from "@/src/types/form.types";

const formatDateToUS = (date: string) => {
  if (!date) return "";
  const d = new Date(date);
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
};

const formatDateToISO = (date: string) => {
  // Converts MM/DD/YYYY to YYYY-MM-DD for input value
  if (!date) return "";
  const [month, day, year] = date.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const DateInput: React.FC<DateInputProps> = ({
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

  const handleOpenCalendar = () => {
    if (readOnlyPreview || disabled) return;
    inputRef.current?.showPicker?.();
    inputRef.current?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isoValue = e.target.value;
    const date = isoValue ? formatDateToUS(isoValue) : "";
    onChange?.({
      target: { name, value: date },
    } as any);
  };

  return (
    <Box sx={styles.inputWrapper} onClick={handleOpenCalendar}>
      {label && (
        <label style={styles.label} htmlFor={name}>
          {label} {required && <span style={styles.required}>*</span>}
        </label>
      )}
      <TextField
        inputRef={inputRef}
        id={name}
        name={name}
        type="date"
        placeholder={placeholder}
        value={formatDateToISO(value || "")}
        disabled={disabled}
        onChange={handleChange}
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

export default DateInput;
