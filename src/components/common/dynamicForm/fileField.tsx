import React from "react";
import { Typography, Box } from "@mui/material";
import { modalFormStyles } from "@/src/styles/modalForm.styles";
import { BaseFieldProps } from "../../../types/formmodal.types";
import FileInput from "./fileInput";

interface FileFieldProps extends BaseFieldProps {
  accept?: string;
  maxFileSizeMB?: number;
  fileButton?: boolean;
  previewUrl?: string | null;
  onValidationError: (name: string, error: string) => void;
}

export const FileField: React.FC<FileFieldProps> = ({
  name,
  label,
  error,
  required,
  onChange,
  accept,
  maxFileSizeMB,
  previewUrl,
  onValidationError,
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
      <FileInput
        onChange={(file: File | null) => onChange(name, file)}
        onValidationError={(error: string) => onValidationError(name, error)}
        accept={accept}
        maxFileSizeMB={maxFileSizeMB}
        previewUrl={previewUrl || null}
      />
      {error && <Typography sx={styles.inputError}>{error}</Typography>}
    </Box>
  );
};
