import React, { useRef, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { formStyles } from "@/src/styles/form.styles";
import { ESignInputProps } from "@/src/types/form.types";
import { useTranslation } from "@/src/hooks/useTranslation";
import {
  MAX_SIZE,
  ALLOWED_TYPES,
  DEFAULT_ALLOWED_TYPES,
} from "@/src/utils/constant";
import { useAppSelector } from "@/src/hooks/redux";
import { UserRole } from "@/src/types/auth.types";

const ESignInput: React.FC<ESignInputProps> = ({
  value,
  onChange,
  name,
  error,
  helperText,
  disabled,
}) => {
  const { t } = useTranslation();
  const styles = formStyles();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploaded, setUploaded] = useState(!!value);
  const [localError, setLocalError] = useState<string>("");
  const { selectedRole } = useAppSelector((state) => state.auth);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith(".jfif")) {
        setLocalError(t("common.unsupportedfile"));
        return;
      }

      const allowedTypes = ALLOWED_TYPES;
      if (!allowedTypes.includes(file.type)) {
        setLocalError(t("common.onlyPngJpegJpgAllowed"));
        return;
      }
      if (file.size > MAX_SIZE) {
        setLocalError(t("common.fileSizeError"));
        return;
      }
      setLocalError("");
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUploaded(true);
        onChange({ target: { value: base64String } });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextClick = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploaded(false);
    onChange({ target: { value: "" } });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <>
      <Box sx={styles.eSignBox}>
        <input
          type="file"
          accept={DEFAULT_ALLOWED_TYPES}
          hidden
          name={name}
          ref={inputRef}
          onChange={handleFileChange}
          disabled={disabled}
        />
        <Box display="flex" alignItems="center">
          <Typography
            variant="body2"
            color="inherit"
            mb={1}
            sx={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={handleTextClick}
          >
            {uploaded && value ? (
              <Box mt={1} mb={1} display="flex" justifyContent="flex-start">
                <img
                  src={value}
                  alt="E-signature preview"
                  style={styles.esignPreview}
                />
              </Box>
            ) : (
              t("common.clickHereToUpload")
            )}
          </Typography>
          {uploaded && selectedRole !== UserRole.Observer && (
            <IconButton
              size="small"
              onClick={handleClear}
              aria-label={t("common.clearFile")}
              sx={{ ml: 1, mb: 1 }}
            >
              <CloseIcon fontSize="small" sx={{ color: "#FFF" }} />
            </IconButton>
          )}
        </Box>
      </Box>
      {((helperText && !localError) || localError) && (
        <Typography
          variant="caption"
          color={error || localError ? "error" : "textSecondary"}
          sx={{ display: "block", mt: 1, ml: 1 }}
        >
          {localError || helperText}
        </Typography>
      )}
    </>
  );
};

export default ESignInput;
