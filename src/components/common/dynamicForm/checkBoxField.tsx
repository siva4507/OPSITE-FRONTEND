import React, { useState } from "react";
import { Box, Typography, FormControlLabel, Checkbox } from "@mui/material";
import { modalFormStyles } from "@/src/styles/modalForm.styles";
import { BaseFieldProps } from "../../../types/formmodal.types";
import { useTranslation } from "@/src/hooks/useTranslation";

interface CheckboxFieldProps extends BaseFieldProps {
  options: { label: string; value: string | boolean }[];
  selectedValues?: (string | boolean)[];
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  name,
  label,
  options,
  selectedValues = [],
  error,
  required,
  disabled,
  onChange,
}) => {
  const styles = modalFormStyles();
  const { t } = useTranslation();
  const [localError, setLocalError] = useState("");

  const handleChange = (value: string | boolean, checked: boolean) => {
    let updatedValues: (string | boolean)[];

    if (checked) {
      updatedValues = [...selectedValues, value];
    } else {
      updatedValues = selectedValues.filter((v) => v !== value);
    }

    if (required && updatedValues.length === 0) {
      setLocalError(t("form.required"));
    } else {
      setLocalError("");
    }

    onChange(name, updatedValues);
  };

  const columns = options.length > 5 ? 2 : 1;

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

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 1,
          color: "#FFF",
        }}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value.toString()}
            control={
              <Checkbox
                checked={selectedValues.includes(option.value)}
                onChange={(e) => handleChange(option.value, e.target.checked)}
                disabled={disabled}
                sx={{
                  color: "#FFF",
                  "&.Mui-checked": {
                    color: "#FFF",
                  },
                }}
              />
            }
            label={option.label}
          />
        ))}
      </Box>

      {(error || localError) && (
        <Typography sx={{ ...styles.inputError, color: "#F44336", mt: 0.5 }}>
          {error || localError}
        </Typography>
      )}
    </Box>
  );
};
