import React, { useEffect, useRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import { modalFormStyles } from "@/src/styles/modalForm.styles";
import { createPortal } from "react-dom";
import Image from "next/image";
import { imageUrls } from "@/src/utils/constant";
import { useSpeechRecognition } from "@/src/hooks/useSpeech";
import RecordingWaves from "@/src/components/common/recordingWaves";

export interface DynamicModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: number;
  cancelLabel?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionLoading?: boolean;
  actionDisabled?: boolean;
  showCloseIcon?: boolean;
  showMicIcon?: boolean;
}

const DynamicModal: React.FC<DynamicModalProps> = ({
  open,
  onClose,
  title,
  children,
  width = 400,
  cancelLabel,
  actionLabel,
  onAction,
  actionLoading = false,
  actionDisabled = false,
  showCloseIcon = false,
  showMicIcon = true,
}) => {
  const styles = modalFormStyles();
  const modalContentRef = useRef<HTMLDivElement | null>(null);
  const activeInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(
    null,
  );
  const { recording, showWaveBox, handleMicHoldStart, handleMicHoldEnd } =
    useSpeechRecognition();

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (modalContentRef.current?.contains(target)) {
        activeInputRef.current = target;
      }
    };
    document.addEventListener("focusin", handleFocus);
    return () => document.removeEventListener("focusin", handleFocus);
  }, []);

  if (!open) return null;

  const modalContent = (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 1300,
        }}
        onClick={onClose}
      />

      <Box
        ref={modalContentRef}
        sx={{
          ...styles.modalBox,
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1300,
          width,
          maxHeight: "90vh",
          overflowY: "auto",
          overflow: "visible",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Box sx={styles.header}>
          <Typography sx={styles.title}>{title}</Typography>
          {showCloseIcon && (
            <Button
              onClick={onClose}
              sx={{
                minWidth: 0,
                padding: "4px",
                color: "#FFF",
                fontSize: "24px",
                fontWeight: "bold",
                lineHeight: 1,
              }}
            >
              ×
            </Button>
          )}
        </Box>

        <Box sx={{ ...styles.content, overflow: "visible" }}>{children}</Box>

        {(cancelLabel || actionLabel) && (
          <Box sx={styles.buttonRow}>
            {cancelLabel && (
              <Button sx={styles.cancelButton} onClick={onClose}>
                {cancelLabel}
              </Button>
            )}
            {actionLabel && (
              <Button
                sx={styles.submitButton}
                onClick={onAction}
                disabled={actionLoading || actionDisabled}
              >
                {actionLoading ? `${actionLabel}...` : actionLabel}
              </Button>
            )}
          </Box>
        )}
      </Box>
      {showMicIcon && (
        <Box
          sx={{
            position: "fixed",
            top: 62,
            right: 25,
            zIndex: 1400,
            display: "flex",
            alignItems: "center",
          }}
        >
          {showWaveBox && <RecordingWaves />}
          <Box sx={styles.voiceBox}>
            <Image
              src={imageUrls.microphone}
              alt="microphone"
              width={24}
              height={24}
              style={{ cursor: "pointer" }}
              onMouseDown={handleMicHoldStart}
              onMouseUp={handleMicHoldEnd}
              onMouseLeave={recording ? handleMicHoldEnd : undefined}
              onTouchStart={handleMicHoldStart}
              onTouchEnd={handleMicHoldEnd}
            />
          </Box>
        </Box>
      )}
    </>
  );

  return createPortal(modalContent, document.body);
};

export default DynamicModal;
