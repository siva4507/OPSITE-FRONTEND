import React, { useState, useCallback, useRef } from "react";
import { Box, TextField, Typography, Slider, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch } from "@/src/hooks/redux";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import DynamicModal from "@/src/components/common/modal";
import { addThemeThunk } from "@/src/store/slices/themeadminSlice";
import { styles } from "./../../styles/styles";
import { presetColors } from "@/src/utils/config";
import { modalStyles } from "@/src/styles/modalForm.styles";
import { IMAGE_DIMENSIONS, MAX_LENGTH } from "@/src/utils/constant";
import { adminStyles } from "@/src/styles/admin.styles";

interface AddThemeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const grayRow = Array.from(
  { length: 18 },
  (_, j) => `hsl(0, 0%, ${(100 - (j * 100) / 17).toFixed(0)}%)`,
);

const colorGrid = [
  grayRow,
  ...Array.from({ length: 9 }, (_, i) =>
    Array.from(
      { length: 18 },
      (_, j) => `hsl(${j * 20}, 100%, ${(95 - i * 5).toFixed(0)}%)`,
    ),
  ),
];

const AddThemeModal: React.FC<AddThemeModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string>("");
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>(presetColors[0]);
  const [opacity, setOpacity] = useState<number>(0.45);
  const [background, setBackground] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const flatColors = colorGrid.flat();
  const gridLength = colorGrid[0]?.length || 18;

  const handleFileUpload = (file: File) => {
    setBackground(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };



  const handleColorSelect = useCallback((color: string) => {
    setSelectedColor(color);
  }, []);

  const handleOpacityChange = useCallback((value: number) => {
    const newOpacity = value / 100;
    setOpacity(newOpacity);
  }, []);

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        setFileError(t("theme.validImg"));
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setFileError(t("theme.maxSize"));
        return;
      }
      const img = new Image();
      img.onload = () => {
        if (
          img.width < IMAGE_DIMENSIONS.BACKGROUND_WIDTH_MIN ||
          img.width > IMAGE_DIMENSIONS.BACKGROUND_WIDTH_MAX ||
          img.height < IMAGE_DIMENSIONS.BACKGROUND_HEIGHT_MIN ||
          img.height > IMAGE_DIMENSIONS.BACKGROUND_HEIGHT_MAX
        ) {
          setFileError(
            t("theme.invalidResolution", {
              minW: IMAGE_DIMENSIONS.BACKGROUND_WIDTH_MIN,
              maxW: IMAGE_DIMENSIONS.BACKGROUND_WIDTH_MAX,
              minH: IMAGE_DIMENSIONS.BACKGROUND_HEIGHT_MIN,
              maxH: IMAGE_DIMENSIONS.BACKGROUND_HEIGHT_MAX,
            }),
          );
          return;
        }
        setFileError("");
        handleFileUpload(file);
      };
      img.src = URL.createObjectURL(file);
      return;
    }
  };

  const handlePreviewClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setBackground(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!name || !selectedColor || opacity === undefined || !background) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: t("theme.fillFields"),
        }),
      );
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.set("name", name);
    formData.set("colorCode", selectedColor);
    formData.set("opacity", opacity.toString());
    formData.set("background", background);

    try {
      await dispatch(addThemeThunk(formData)).unwrap();

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("theme.createSuccess"),
        }),
      );

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setName("");
      setSelectedColor(presetColors[0]);
      setOpacity(0.45);
      setBackground(null);
      setPreviewUrl("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : t("theme.createFailed");
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: errorMessage,
        }),
      );
    } finally {
      setUploading(false);
      setFileError("");
    }
  };

  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setName("");
    setSelectedColor(presetColors[0]);
    setOpacity(0.45);
    setBackground(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setUploading(false);
    setFileError("");
    onClose();
  };

  return (
    <DynamicModal
      open={open}
      onClose={handleCancel}
      title={t("theme.addTheme")}
      width={800}
      onAction={handleSubmit}
      actionLabel={t("theme.upload")}
      cancelLabel={t("theme.cancel")}
      actionDisabled={uploading}
    >
      <Box sx={modalStyles.container}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="body2" sx={adminStyles.Text}>
            {t("theme.themeName")}
          </Typography>
          <TextField
            value={name}
            onChange={(e) => {
              const value = e.target.value;
              if (value.trimStart() === "" && value.length > 0) return;
              setName(value);
            }}
            fullWidth
            placeholder={t("theme.themePlaceholder")}
            variant="outlined"
            InputLabelProps={{ shrink: false }}
            sx={modalStyles.input}
            inputProps={{ maxLength: MAX_LENGTH }}
          />
        </Box>

        <Box sx={adminStyles.themesGrid}>
          <Box sx={adminStyles.previewBox}>
            <Box onClick={handlePreviewClick} sx={modalStyles.imageBox}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileInputChange}
                style={{ display: "none" }}
              />

              {previewUrl ? (
                <>
                  <Box
                    sx={modalStyles.previewOverlay(
                      selectedColor,
                      opacity,
                      previewUrl,
                    )}
                  />

                  <IconButton
                    onClick={handleClearImage}
                    sx={modalStyles.clearButton}
                    size="small"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>

                  <Box sx={modalStyles.bottomOverlay}>
                    <Typography variant="body2">
                      {t("theme.changeImg")}
                    </Typography>
                  </Box>
                </>
              ) : (
                <Box sx={modalStyles.emptyImageBox}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {t("theme.uploadImage")}
                  </Typography>
                  <Typography variant="body2">
                    {t("theme.dragandDrop")}
                  </Typography>
                  <Typography variant="caption" sx={adminStyles.TextTwo}>
                    {t("theme.supportExt")}
                  </Typography>
                </Box>
              )}
            </Box>
            {fileError && (
              <Typography variant="body2" sx={adminStyles.imageError}>
                {fileError}
              </Typography>
            )}
          </Box>

          <Box sx={adminStyles.colorBox}>
            <Box sx={styles.colorGrid(gridLength)}>
              {flatColors.map((color, idx) => (
                <Box
                  key={`color-${idx}`}
                  onClick={() => handleColorSelect(color)}
                  sx={styles.colorCell(color, selectedColor === color)}
                />
              ))}
            </Box>
            <Box sx={styles.opacityContainer}>
              <Box sx={styles.opacitySliderContainer}>
                <Box sx={styles.sliderTrack}>
                  <Box sx={styles.sliderBackground(selectedColor)} />
                  <Box sx={styles.sliderFill(opacity, selectedColor)} />
                  <Slider
                    value={opacity * 100}
                    onChange={(_, v) => handleOpacityChange(v as number)}
                    min={0}
                    max={100}
                    sx={styles.slider(selectedColor)}
                  />
                </Box>
                <Box sx={styles.opacityValue}>{Math.round(opacity * 100)}%</Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </DynamicModal>
  );
};

export default AddThemeModal;
