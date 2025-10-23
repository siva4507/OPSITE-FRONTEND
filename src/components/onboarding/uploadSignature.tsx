import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import Image from "next/image";
import { signatureUploadStyles, styles } from "@/src/styles/onboarding.styles";
import { imageUrls } from "@/src/utils/constant";
import { useAppSelector, useAppDispatch } from "@/src/hooks/redux";
import { getTargetRouteByRole } from "@/src/utils/authGuard";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/src/hooks/useTranslation";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import {
  uploadSignatureThunk,
  setSignatureBase64,
} from "@/src/store/slices/onboardingSlice";
import { MAX_SIZE, ALLOWED_TYPES } from "@/src/utils/constant";
import { UserRole } from "@/src/types/auth.types";
import { setUploadSignature } from "@/src/store/slices/authSlice";

const UploadSignature: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const signatureBase64 = useAppSelector(
    (state) => state.onboarding.signatureBase64,
  );
  const { user, selectedRole } = useAppSelector((state) => state.auth);
 


  useEffect(() => {
    const storedSignature = localStorage.getItem("userSignatureBase64");
    if (storedSignature && !signatureBase64) {
      dispatch(setSignatureBase64(storedSignature));
    }
  }, [dispatch, signatureBase64]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const validateAndSetFile = (file?: File) => {
    if (!file) return;
    const fileName = file.name.toLowerCase();
    if (fileName.endsWith(".jfif")) {
      setError(`${t("uploadSignature.jfifNotAllowed")}`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(`${t("uploadSignature.onlyJpgPngAllowed")}`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (file.size > MAX_SIZE) {
      setError(`${t("uploadSignature.fileSizeError")}`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setSelectedFile(file);
    setError("");
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleContinue = async () => {
    if (!selectedFile && !signatureBase64) {
      dispatch(
        showAlert({
          message: `${t("uploadSignature.uploadSignatureError")}`,
          type: AlertType.Error,
        }),
      );
      return;
    }

    if (!selectedFile && signatureBase64) {
      setIsRedirecting(true);
      dispatch(setUploadSignature(true));
      const activeShiftCount = user?.activeShiftCount;
      const targetRoute = getTargetRouteByRole(
        selectedRole ?? UserRole.ActiveController,
        activeShiftCount ?? 0,
      );
      router.push(targetRoute);
      return;
    }

    if (!selectedFile) return;

    const result = await dispatch(uploadSignatureThunk(selectedFile));
    if (uploadSignatureThunk.fulfilled.match(result)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        localStorage.setItem("userSignatureBase64", base64String);
        dispatch(setSignatureBase64(base64String));
        dispatch(
          showAlert({
            message: result.payload.message,
            type: AlertType.Success,
          }),
        );
        setIsRedirecting(true);
        const activeShiftCount = user?.activeShiftCount;
        const targetRoute = getTargetRouteByRole(
          selectedRole ?? UserRole.ActiveController,
          activeShiftCount ?? 0,
        );
        router.push(targetRoute);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      dispatch(
        showAlert({
          message: result.payload || `${t("uploadSignature.uploadFailed")}`,
          type: AlertType.Error,
        }),
      );
      setIsRedirecting(false);
    }
  };

  return (
    <Box sx={{ ...styles.cardContainer, maxWidth: 640, width: "100%", px: 0 }}>
      <Box sx={signatureUploadStyles.headerrow}>
        <Box sx={signatureUploadStyles.titleicon}>
          <Image src={imageUrls.esign} alt="e-sign" width={32} height={32} />
        </Box>
        <Box>
          <Typography sx={signatureUploadStyles.title}>
            {t("uploadSignature.title")}
          </Typography>
          <Typography sx={signatureUploadStyles.subtitle}>
            {t("uploadSignature.subtitle")}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={signatureUploadStyles.dashedBox}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={!selectedFile ? handleBrowseClick : undefined}
      >
        {selectedFile || signatureBase64 ? (
          <Box sx={signatureUploadStyles.preview}>
            <img
              src={
                selectedFile
                  ? URL.createObjectURL(selectedFile)
                  : signatureBase64!
              }
              alt={t("uploadSignature.previewImageText")}
              style={{
                maxWidth: 180,
                maxHeight: 80,
                objectFit: "contain",
                borderRadius: 6,
                margin: "12px 0",
              }}
            />
            <Button
              variant="contained"
              component="span"
              sx={signatureUploadStyles.browseButton}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
                dispatch(setSignatureBase64(""));
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              disabled={isRedirecting}
            >
              {t("uploadSignature.clear")}
            </Button>
          </Box>
        ) : (
          <>
            <Image src={imageUrls.esign} alt="e-sign" width={42} height={42} />
            <Typography sx={signatureUploadStyles.fileText}>
              {t("uploadSignature.fileText")}
              <br />
              {t("uploadSignature.fileSizeText")}
            </Typography>
            <Button
              variant="contained"
              component="span"
              sx={signatureUploadStyles.browseButton}
            >
              {t("uploadSignature.browseFile")}
            </Button>
          </>
        )}
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg, .png, .jpg, .jpeg"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {selectedFile && (
          <Typography sx={signatureUploadStyles.fileName}>
            {selectedFile.name}
          </Typography>
        )}
        {error && (
          <Typography color="error" sx={{ mt: 1, textAlign: "center" }}>
            {error}
          </Typography>
        )}
      </Box>
      <Box sx={styles.buttonContainer}>
        <Button
          variant="contained"
          sx={styles.submitButton}
          // disabled={!selectedFile}
          onClick={handleContinue}
        >
          {isRedirecting ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            <Typography sx={styles.submitButtonText} component="span">
              {t("uploadSignature.continue")}
            </Typography>
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default UploadSignature;
