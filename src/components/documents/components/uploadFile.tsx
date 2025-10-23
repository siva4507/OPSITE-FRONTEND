"use client";

import React from "react";
import { Box, Button } from "@mui/material";
import { useAppDispatch } from "@/src/hooks/redux";
import { uploadFile } from "@/src/store/slices/documentSlice";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import { useTranslation } from "@/src/hooks/useTranslation";
import FileInput from "@/src/components/common/dynamicForm/fileInput";
import { modalFormStyles } from "@/src/styles/modalForm.styles";
import { UploadFileRequest } from "@/src/dto/document.dto";
import { ACCEPTED_FILE_TYPES } from "@/src/utils/config";
import { UploadFileModalProps } from "@/src/types/document.types";
import { TagsInput } from "@/src/components/common/tagInput";

interface UpdatedUploadFileModalProps extends UploadFileModalProps {
  open: boolean;
  onClose: () => void;
}

const UploadFileModal: React.FC<UpdatedUploadFileModalProps> = ({
  parentId,
  onSuccess,
  open,
  onClose,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploadTags, setUploadTags] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const styles = modalFormStyles();

  const handleUpload = async () => {
    if (!selectedFile) {
      dispatch(
        showAlert({
          message: t("documentRepository.uploadFileRequired"),
          type: AlertType.Error,
        }),
      );
      return;
    }
    setLoading(true);
    try {
      await dispatch(
        uploadFile({
          file: selectedFile,
          tags: uploadTags,
          parentId,
        } as UploadFileRequest),
      ).unwrap();
      dispatch(
        showAlert({
          message: t("documentRepository.uploadSuccess"),
          type: AlertType.Success,
        }),
      );
      onClose();
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : t("documentRepository.uploadError");
      dispatch(
        showAlert({
          message: errorMessage,
          type: AlertType.Error,
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <FileInput
        onChange={setSelectedFile}
        onValidationError={(err) =>
          dispatch(showAlert({ message: err, type: AlertType.Error }))
        }
        accept={ACCEPTED_FILE_TYPES}
        maxFileSizeMB={10}
      />

      <Box sx={{ marginTop: 2 }}>
        <TagsInput
          value={uploadTags}
          onChange={setUploadTags}
          maxTags={6}
          maxTagLength={13}
          placeholder={t("documentRepository.enterTag")}
        />
      </Box>

      <Box sx={styles.buttonRow}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          sx={{ ...styles.cancelButton, border: "none" }}
        >
          {t("documentRepository.cancel")}
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={loading}
          sx={styles.submitButton}
        >
          {loading
            ? `${t("documentRepository.upload")}...`
            : t("documentRepository.upload")}
        </Button>
      </Box>
    </>
  );
};

export default UploadFileModal;
