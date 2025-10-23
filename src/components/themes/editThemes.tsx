import React, { useState, useCallback, useEffect, useRef } from "react";
import { Box, TextField, Typography, Slider } from "@mui/material";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAppDispatch } from "@/src/hooks/redux";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import DynamicModal from "@/src/components/common/modal";
import { editThemeThunk } from "@/src/store/slices/themeadminSlice";
import { styles } from "./../../styles/styles";
import { presetColors } from "@/src/utils/config";
import { modalStyles } from "@/src/styles/modalForm.styles";
import { IMAGE_DIMENSIONS, MAX_LENGTH } from "@/src/utils/constant";
import { Theme } from "@/src/types/theme.types";
import { adminStyles } from "@/src/styles/admin.styles";

interface EditThemeModalProps {
  open: boolean;
  onClose: () => void;
  theme: Theme;
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

const EditThemeModal: React.FC<EditThemeModalProps> = ({
  open,
  onClose,
  theme,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>(presetColors[0]);
  const [opacity, setOpacity] = useState<number>(0.45);
  const [background, setBackground] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState<string>("");

  const flatColors = colorGrid.flat();
  const gridLength = colorGrid[0]?.length || 18;

  useEffect(() => {
    if (theme && open) {
      setName(theme.name || "");
      setSelectedColor(theme.colorCode || presetColors[0]);
      setOpacity(
        typeof theme.opacity === "number"
          ? theme.opacity
          : parseFloat(theme.opacity) || 0.45,
      );
      setCurrentImageUrl(theme.bgImageUrl || "");

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl("");
      setBackground(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [theme, open]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setImageError(t("theme.validImg"));
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setImageError(t("theme.maxSize"));
      return;
    }

    const img = new Image();
    img.onload = () => {
      const { width, height } = img;

      if (
        width < IMAGE_DIMENSIONS.BACKGROUND_WIDTH_MIN ||
        width > IMAGE_DIMENSIONS.BACKGROUND_WIDTH_MAX ||
        height < IMAGE_DIMENSIONS.BACKGROUND_HEIGHT_MIN ||
        height > IMAGE_DIMENSIONS.BACKGROUND_HEIGHT_MAX
      ) {
        setImageError(
          t("theme.invalidResolution", {
            minW: IMAGE_DIMENSIONS.BACKGROUND_WIDTH_MIN,
            maxW: IMAGE_DIMENSIONS.BACKGROUND_WIDTH_MAX,
            minH: IMAGE_DIMENSIONS.BACKGROUND_HEIGHT_MIN,
            maxH: IMAGE_DIMENSIONS.BACKGROUND_HEIGHT_MAX,
          }),
        );
        return;
      }

      setImageError("");
      handleFileUpload(file);
    };
    img.src = URL.createObjectURL(file);
  };

  const handlePreviewClick = () => {
    fileInputRef.current?.click();
  };


  const handleSubmit = async () => {
    if (!name || !selectedColor || opacity === undefined) {
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
    formData.append("name", name);
    formData.append("colorCode", selectedColor);
    formData.append("opacity", opacity.toString());

    if (background) {
      formData.append("background", background);
    }

    try {
      await dispatch(
        editThemeThunk({ themeId: theme._id, payload: formData }),
      ).unwrap();

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: t("theme.editSuccess"),
        }),
      );

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : t("theme.editFailed");
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: errorMessage,
        }),
      );
    } finally {
      setUploading(false);
      setImageError("");
    }
  };

  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (theme) {
      setName(theme.name || "");
      setSelectedColor(theme.colorCode || presetColors[0]);
      setOpacity(
        typeof theme.opacity === "number"
          ? theme.opacity
          : parseFloat(theme.opacity) || 0.45,
      );
      setCurrentImageUrl(theme.bgImageUrl || "");
    }
    setBackground(null);
    setPreviewUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setUploading(false);
    setImageError("");
    onClose();
  };

  const displayImageUrl = previewUrl || currentImageUrl;

  return (
    <DynamicModal
      open={open}
      onClose={handleCancel}
      title={t("theme.editTheme")}
      width={800}
      onAction={handleSubmit}
      actionLabel={t("theme.updateTheme")}
      cancelLabel={t("theme.cancel")}
      actionDisabled={uploading}
    >
      <Box sx={modalStyles.container}>
        <Typography variant="body2" sx={adminStyles.Text}>
          {t("theme.themeName")}
        </Typography>
        <TextField
          value={name}
          onChange={(e) => {
            const value = e.target.value;
            if (value.trim() === "" && value.length > 0) return;
            setName(value);
          }}
          fullWidth
          variant="outlined"
          placeholder={t("theme.themePlaceholder")}
          InputLabelProps={{ shrink: false }}
          sx={modalStyles.input}
          inputProps={{ maxLength: MAX_LENGTH }}
        />

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

              {displayImageUrl ? (
                <>
                  <Box
                    sx={modalStyles.previewOverlay(
                      selectedColor,
                      opacity,
                      displayImageUrl,
                    )}
                  />

                  

                  <Box sx={modalStyles.bottomOverlay}>
                    <Typography variant="body2">
                      {previewUrl
                        ? t("theme.changeImg")
                        : t("theme.replaceImg")}
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
            {imageError && (
              <Typography sx={adminStyles.imageError}>{imageError}</Typography>
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

export default EditThemeModal;
