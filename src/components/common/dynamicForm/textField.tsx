import React, { useState } from "react";
import { TextField as MUITextField, Typography, Box } from "@mui/material";
import { modalFormStyles } from "@/src/styles/modalForm.styles";
import { BaseFieldProps } from "../../../types/formmodal.types";
import { useTranslation } from "@/src/hooks/useTranslation";

interface TextFieldProps extends BaseFieldProps {
  type?: "text" | "email" | "url";
  maxlength?: number;
}

export const TextField: React.FC<TextFieldProps> = ({
  name,
  label,
  value,
  error,
  required,
  disabled,
  placeholder,
  onChange,
  inputRef,
  type = "text",
  maxlength,
}) => {
  const styles = modalFormStyles();
  const [localError, setLocalError] = useState("");
  const { t } = useTranslation();
  const handleChange = (val: string) => {
    let cleanVal = val.trimStart();
    let errorMsg = "";

    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (cleanVal && val && !emailRegex.test(cleanVal)) {
        errorMsg = t("form.passwordCondition6");
      }
    } else if (name === "username") {

      if (!cleanVal) {
        errorMsg = t("form.usernameRequired");
      } else if (cleanVal.length < 6) {
        errorMsg = t("form.usernameMin6");
      } else if (cleanVal.length > 15) {
        errorMsg = t("form.usernameMax15");
      }
    }

    setLocalError(errorMsg);
    onChange(name, cleanVal.trim() === "" ? "" : cleanVal);
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
        type={type}
        name={name}
        value={value ?? ""}
        onChange={(e) => handleChange(e.target.value)}
        fullWidth
        error={!!error || !!localError}
        placeholder={placeholder}
        sx={styles.inputRounded}
        inputRef={inputRef || undefined}
        disabled={disabled}
        slotProps={{
          htmlInput: {
            maxLength: maxlength,
            autoComplete: "new-password",
            autoCorrect: "off",
            autoCapitalize: "off",
            spellCheck: false,
            name: `${name}-${Math.random()}`,
          },
        }}
      />

      {(error || localError) && (
        <Typography sx={{ ...styles.inputError, color: "#F44336", mt: 0.5 }}>
          {error || localError}
        </Typography>
      )}
    </Box>
  );
};
