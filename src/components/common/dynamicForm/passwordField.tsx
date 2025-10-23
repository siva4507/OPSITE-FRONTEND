import React, { useState, useEffect } from "react";
import {
  TextField as MUITextField,
  Typography,
  Box,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { VisibilityOutlined, VisibilityOffOutlined } from "@mui/icons-material";
import { modalFormStyles } from "@/src/styles/modalForm.styles";
import { BaseFieldProps } from "../../../types/formmodal.types";
import { useTranslation } from "@/src/hooks/useTranslation";

interface PasswordFieldProps extends BaseFieldProps {
  maxlength?: number;
  submitted?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  name,
  label,
  value,
  required,
  disabled,
  placeholder,
  onChange,
  inputRef,
  maxlength,
  submitted = false,
}) => {
  const styles = modalFormStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [fieldKey] = useState(() => `pwd-${Date.now()}-${Math.random()}`);
  const { t } = useTranslation();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    if (!(touched || submitted)) {
      setErrorMessage(null);
      return;
    }

    if (
      required &&
      (!value || (typeof value === "string" && value.trim() === ""))
    ) {
      setErrorMessage(t("form.passwordCondition5"));
      return;
    }

    if (typeof value === "string" && value.trim() !== "") {
      if (value.length < 8) {
        setErrorMessage(t("form.passwordCondition1"));
        return;
      }
      if (!/[A-Za-z]/.test(value)) {
        setErrorMessage(t("form.passwordCondition2"));
        return;
      }
      if (!/[0-9]/.test(value)) {
        setErrorMessage(t("form.passwordCondition3"));
        return;
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        setErrorMessage(t("form.passwordCondition4"));
        return;
      }
    }

    setErrorMessage(null);
  }, [value, touched, submitted, required]);

  return (
    <Box sx={styles.formFieldBox}>
      <input
        type="password"
        style={{ display: "none", position: "absolute", left: "-9999px" }}
        autoComplete="new-password"
        name="fake-pwd-field"
        tabIndex={-1}
        aria-hidden="true"
      />
      <input
        type="text"
        style={{ display: "none", position: "absolute", left: "-9999px" }}
        autoComplete="username"
        name="fake-username"
        tabIndex={-1}
        aria-hidden="true"
      />

      {label && (
        <Typography sx={styles.inputLabel}>
          {label}
          {required && (
            <span style={{ color: "#F44336", marginLeft: 2 }}>*</span>
          )}
        </Typography>
      )}

      <MUITextField
        key={fieldKey}
        type={showPassword ? "text" : "password"}
        name={`pwd_${name}_${Date.now()}`}
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(name, e.target.value)}
        onBlur={() => setTouched(true)}
        onFocus={(e) => {
          e.target.setAttribute("autocomplete", "one-time-code");
          e.target.setAttribute("data-form-type", "other");
        }}
        fullWidth
        error={!!errorMessage}
        placeholder={placeholder}
        sx={styles.inputRounded}
        inputRef={inputRef}
        disabled={disabled}
        slotProps={{
          htmlInput: {
            maxLength: maxlength,
            autoComplete: "one-time-code",
            autoCorrect: "off",
            autoCapitalize: "off",
            spellCheck: false,
            "data-form-type": "other",
            "data-lpignore": "true",
            "data-1p-ignore": "true",
            "data-bwignore": "true",
            "data-protonpass-ignore": "true",
            name: `pwd_${name}_${Date.now()}_${Math.random()}`,
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                edge="end"
                size="small"
                tabIndex={-1}
              >
                {showPassword ? (
                  <VisibilityOutlined sx={{ color: "#fff" }} fontSize="small" />
                ) : (
                  <VisibilityOffOutlined
                    sx={{ color: "#fff" }}
                    fontSize="small"
                  />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {errorMessage && (
        <Typography sx={styles.inputError}>{errorMessage}</Typography>
      )}
    </Box>
  );
};

export default PasswordField;
