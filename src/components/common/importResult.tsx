"use client";

import React from "react";
import { Box, Typography, Divider, Button, Alert } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useTranslation } from "@/src/hooks/useTranslation";

interface ImportItem {
  row: number;
  facilityNames?: string;
  email?: string;
  reasons?: string[];
}

export interface ImportResponse {
  successCount: number;
  failedCount: number;
  success: ImportItem[];
  failed: ImportItem[];
}

interface ImportResultRendererProps {
  result: ImportResponse | null;
  onClose: () => void;
}

const ImportResultRenderer: React.FC<ImportResultRendererProps> = ({
  result,
  onClose,
}) => {
  const { t } = useTranslation();
  if (!result) return null;

  return (
    <Box sx={{ p: 2 }}>
      {/* Summary */}
      <Box sx={{ mb: 3 }}>
        <Alert severity="success" sx={{ mb: 1 }}>
          <Typography variant="body2">
            {t("common.successImport")}: {result.successCount}
          </Typography>
        </Alert>
        {result.failedCount > 0 && (
          <Alert severity="error">
            <Typography variant="body2">
              {t("common.failedtoImport")}: {result.failedCount}
            </Typography>
          </Alert>
        )}
      </Box>

      {/* Success Details */}
      {result.success?.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <CheckCircleIcon sx={{ color: "#4caf50", mr: 1 }} />
            <Typography
              variant="subtitle2"
              sx={{ color: "#4caf50", fontWeight: "bold" }}
            >
              {t("common.successImport")} ({result.successCount})
            </Typography>
          </Box>
          <Box
            sx={{
              maxHeight: "150px",
              overflowY: "auto",
              backgroundColor: "rgba(76, 175, 80, 0.1)",
              borderRadius: 1,
              p: 1,
            }}
          >
            {result.success.map((item, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{ color: "#FFF", mb: 0.5 }}
              >
                • {t("common.row")} {item.row}:{" "}
                {item.facilityNames || item.email}
              </Typography>
            ))}
          </Box>
        </Box>
      )}

      {/* Failed Details */}
      {result.failed?.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <ErrorIcon sx={{ color: "#f44336", mr: 1 }} />
            <Typography
              variant="subtitle2"
              sx={{ color: "#f44336", fontWeight: "bold" }}
            >
              {t("common.failedtoImport")} ({result.failedCount})
            </Typography>
          </Box>
          <Box
            sx={{
              maxHeight: "150px",
              overflowY: "auto",
              backgroundColor: "rgba(244, 67, 54, 0.1)",
              borderRadius: 1,
              p: 1,
            }}
          >
            {result.failed.map((item, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#FFF", fontWeight: "bold" }}
                >
                  • Row {item.row}: {item.facilityNames || item.email}
                </Typography>
                {item.reasons?.map((reason, reasonIndex) => (
                  <Typography
                    key={reasonIndex}
                    variant="body2"
                    sx={{
                      color: "#ffcccb",
                      ml: 2,
                      fontSize: "0.8rem",
                    }}
                  >
                    - {reason}
                  </Typography>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <Divider sx={{ my: 2, backgroundColor: "rgba(255,255,255,0.2)" }} />

      <Button
        fullWidth
        variant="contained"
        onClick={onClose}
        sx={{
          backgroundColor: "#3D96E1",
          "&:hover": { backgroundColor: "#2980B9" },
        }}
      >
        {t("common.close")}
      </Button>
    </Box>
  );
};

export default ImportResultRenderer;
