import React from "react";
import {
  Autocomplete,
  TextField as MUITextField,
  Typography,
  Box,
} from "@mui/material";
import { modalFormStyles } from "@/src/styles/modalForm.styles";
import { CustomPopper } from "@/src/styles/electronicLog.styles";
import { BaseFieldProps } from "../../../types/formmodal.types";
import { OptionType } from "@/src/types/types";

interface AutocompleteFieldProps extends BaseFieldProps {
  options?: OptionType[];
  loading?: boolean;
  onInputChange?: (name: string, value: string) => void;
}

export const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
  name,
  label,
  value,
  error,
  required,
  disabled,
  placeholder,
  onChange,
  options = [],
  loading = false,
  onInputChange,
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
      <Autocomplete<OptionType, false, false, true>
        options={options}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option?.label || ""
        }
        isOptionEqualToValue={(option, selectedValue) => {
          if (typeof option === "string" || typeof selectedValue === "string")
            return false;
          return option.value === selectedValue.value;
        }}
        value={
          options.find((opt) => opt.value === (value as OptionType)?.value) ||
          null
        }
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            onChange(name, { label: newValue, value: newValue });
          } else if (newValue) {
            onChange(name, newValue as OptionType);
          } else {
            onChange(name, null);
          }
        }}
        inputValue={(value as OptionType)?.label || ""}
        onInputChange={(event, newInputValue, reason) => {
          if (reason === "input") {
            onChange(name, {
              label: newInputValue,
              value: newInputValue,
            });

            if (onInputChange) {
              onInputChange(name, newInputValue);
            }
          } else if (reason === "clear") {
            onChange(name, null);
          }
        }}
        freeSolo
        loading={loading}
        disabled={disabled}
        PopperComponent={CustomPopper}
        disablePortal={false}
        ListboxProps={{
          sx: {
            maxHeight: 200,
            "& .MuiAutocomplete-option": {
              minHeight: "auto",
            },
          },
        }}
        renderInput={(params) => (
          <MUITextField
            {...params}
            placeholder={placeholder || ""}
            fullWidth
            error={!!error}
            sx={styles.inputRounded}
          />
        )}
        renderOption={(props, option) => (
          <li {...props}>
            {typeof option === "string" ? option : option.label}
          </li>
        )}
      />
      {error && <Typography sx={styles.inputError}>{error}</Typography>}
    </Box>
  );
};