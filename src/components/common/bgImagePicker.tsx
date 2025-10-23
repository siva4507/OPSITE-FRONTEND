import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  Typography,
  Slider,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { styles } from "./../../styles/styles";
import { modalFormStyles } from "@/src/styles/modalForm.styles";
import { useAppDispatch, useAppSelector } from "@/src/hooks/redux";
import {
  getSystemThemes,
  updateUserThemeThunk,
  uploadBackgroundImageThunk,
} from "@/src/store/slices/themeSlice";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DynamicModal from "./modal";
import FileInput from "./dynamicForm/fileInput";
import { showAlert } from "@/src/store/slices/alertSlice";
import { AlertType } from "@/src/types/types";
import {
  CUSTOM,
  IMAGE_DIMENSIONS,
  imageUrls,
  SYSTEM,
} from "@/src/utils/constant";
import { useTranslation } from "@/src/hooks/useTranslation";
import { presetColors } from "@/src/utils/config";
import { BACKGROUND_IMAGE, BACKGROUND_COLOR } from "@/src/utils/constant";
import { BackgroundImagePickerProps } from "@/src/types/types";
import {
  getSystemThemes as getSystemThemesUtil,
  getSelectedTheme,
} from "@/src/utils/themeUtils";
import { UpdateThemeApiPayload } from "@/src/services/themeService";

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

const BackgroundImagePicker: React.FC<BackgroundImagePickerProps> = ({
  open,
  onClose,
  onLivePreview,
  onApply,
  userTheme = {},
}) => {
  const dispatch = useAppDispatch();
  const { themes } = useAppSelector((state) => state.theme);
  const { user } = useAppSelector((state) => state.auth);
  const style = modalFormStyles();
  // Get system themes
  const systemThemes = getSystemThemesUtil(themes);
  const selectedTheme = getSelectedTheme(themes);

  // Initialize state from user theme
  const [tab, setTab] = useState<
    typeof BACKGROUND_IMAGE | typeof BACKGROUND_COLOR
  >(BACKGROUND_IMAGE);
  const [selectedColor, setSelectedColor] = useState<string>(
    userTheme.colorCode ?? presetColors[0],
  );
  const [opacity, setOpacity] = useState<number>(userTheme.opacity ?? 0.45);
  const [selectedImage, setSelectedImage] = useState<string>(
    userTheme.imageUrl ?? imageUrls.bgPic,
  );
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { t } = useTranslation();

  const currentColor = selectedColor;
  const flatColors = colorGrid.flat();
  const gridLength = colorGrid[0]?.length || 18;

  // Effects
  useEffect(() => {
    if (open) {
      dispatch(getSystemThemes());
    }
  }, [open, dispatch]);

  // Initialize selected image when themes load or user theme changes
  useEffect(() => {
    if (userTheme.isSelected === SYSTEM && userTheme.theme?._id) {
      const matchedTheme = themes.find((t) => t._id === userTheme.theme!._id);
      if (matchedTheme) {
        setSelectedImage(matchedTheme.imageUrl || imageUrls.bgPic);
      }
    } else if (userTheme.isSelected === CUSTOM) {
      setSelectedImage(userTheme.imageUrl || imageUrls.bgPic);
    } else if (userTheme.imageUrl) {
      setSelectedImage(userTheme.imageUrl || imageUrls.bgPic);
    }

    if (userTheme.colorCode) {
      setSelectedColor(userTheme.colorCode);
    }
    if (userTheme.opacity !== undefined) {
      setOpacity(userTheme.opacity);
    }
  }, [userTheme, themes]);

  useEffect(() => {
    if (user?.theme) {
      const currentUserTheme = user.theme;
      if (
        currentUserTheme.isSelected === SYSTEM &&
        currentUserTheme.theme?._id
      ) {
        const matchedTheme = themes.find(
          (theme) => theme._id === currentUserTheme.theme!._id,
        );
        if (matchedTheme) {
          setSelectedImage(matchedTheme.imageUrl || imageUrls.bgPic);
        }
      } else if (currentUserTheme.isSelected === CUSTOM) {
        setSelectedImage(currentUserTheme.imageUrl || imageUrls.bgPic);
      }

      if (currentUserTheme.colorCode) {
        setSelectedColor(currentUserTheme.colorCode);
      }
      if (currentUserTheme.opacity !== undefined) {
        setOpacity(currentUserTheme.opacity);
      }
    }
  }, [user?.theme, themes]);

  const handleUpload = (file: File | null) => setUploadedFile(file);

  const handleValidationError = (error: string) => {
    dispatch(showAlert({ message: error, type: AlertType.Error }));
  };

  const handleColorSelect = useCallback(
    (color: string) => {
      setSelectedColor(color);
      onLivePreview({
        imageUrl: selectedImage,
        colorCode: color,
        opacity,
      });
    },
    [onLivePreview, opacity, selectedImage],
  );

  const handleOpacityChange = useCallback(
    (value: number) => {
      const newOpacity = value / 100;
      setOpacity(newOpacity);
      onLivePreview({
        imageUrl: selectedImage,
        colorCode: selectedColor,
        opacity: newOpacity,
      });
    },
    [onLivePreview, selectedImage, selectedColor],
  );

  const handleImageSelect = useCallback(
    (image: string) => {
      setSelectedImage(image);
      onLivePreview({
        imageUrl: image,
        colorCode: selectedColor,
        opacity,
      });
    },
    [onLivePreview, selectedColor, opacity],
  );

  const handleTabChange = useCallback(
    (newTab: typeof BACKGROUND_IMAGE | typeof BACKGROUND_COLOR) => {
      if (newTab !== tab) setTab(newTab);
    },
    [tab],
  );

  const handleApply = useCallback(async () => {
    if (selectedImage) {
      try {
        await dispatch(getSystemThemes()).unwrap();
        const selectedThemeObj = themes.find(
          (theme) => theme.imageUrl === selectedImage,
        );
        let payload: UpdateThemeApiPayload;
        if (selectedThemeObj && !selectedThemeObj.isSelected) {
          payload = {
            themeId: selectedThemeObj._id,
            colorCode: selectedColor,
            opacity,
          };
        } else {
          payload = {
            bgImage: selectedImage,
            colorCode: selectedColor,
            opacity,
          };
        }

        await dispatch(updateUserThemeThunk(payload)).unwrap();
        onApply({
          imageUrl: selectedImage,
          colorCode: selectedColor,
          opacity,
        });

        onClose();
      } catch {
        dispatch(
          showAlert({
            message: t("backgroundImage.FailedtoUpload"),
            type: AlertType.Error,
          }),
        );
      }
    }
  }, [
    dispatch,
    selectedImage,
    selectedColor,
    opacity,
    onApply,
    onClose,
    themes,
  ]);

  const handleCancel = () => {
    if (isUploadModalOpen) {
      return;
    }

    if (!user?.theme?.isSelected) {
      setSelectedImage(userTheme.imageUrl ?? imageUrls.bgPic);
      setSelectedColor(userTheme.colorCode ?? presetColors[0]);
      setOpacity(userTheme.opacity ?? 0.45);
    }

    setTab(BACKGROUND_IMAGE);
    setUploadedFile(null);
    setUploading(false);

    onLivePreview({
      imageUrl: selectedImage,
      colorCode: selectedColor,
      opacity,
    });
    onClose();
  };

  // Upload logic
  const handleUploadImage = async () => {
    if (uploadedFile) {
      setUploading(true);
      try {
        const result = await dispatch(
          uploadBackgroundImageThunk({
            file: uploadedFile,
            colorCode: selectedColor,
            opacity,
          }),
        ).unwrap();

        await dispatch(getSystemThemes()).unwrap();
        if (result) {
          const uploadResponse = result;
          const payload = {
            bgImage: uploadResponse.imageUrl,
            colorCode: selectedColor,
            opacity,
          };
          await dispatch(updateUserThemeThunk(payload)).unwrap();
          setSelectedImage(uploadResponse.imageUrl);
          onApply({
            imageUrl: uploadResponse.imageUrl,
            colorCode: selectedColor,
            opacity,
          });
        }

        setUploadModalOpen(false);
        setUploadedFile(null);
      } catch (error) {
        const errorMessage =
          typeof error === "string" ? error : t("backgroundImage.uploadFail");
        dispatch(
          showAlert({
            message: errorMessage,
            type: AlertType.Error,
          }),
        );
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={isUploadModalOpen ? undefined : handleCancel}
        maxWidth="xs"
        slotProps={{ paper: { sx: styles.dialog } }}
        hideBackdrop
        slots={{ transition: Fade }}
        transitionDuration={300}
        disableEscapeKeyDown={isUploadModalOpen}
      >
        <DialogTitle sx={styles.dialogTitle}>
          {t("backgroundImage.title")}
          <IconButton onClick={handleCancel} sx={styles.closeButton}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={styles.dialogContent}>
          <Box sx={styles.tabContainer}>
            <Button
              onClick={() => handleTabChange(BACKGROUND_IMAGE)}
              sx={styles.tabButton(tab === BACKGROUND_IMAGE)}
            >
              {t("backgroundImage.subTitle_1")}
            </Button>
            <Button
              onClick={() => handleTabChange(BACKGROUND_COLOR)}
              sx={styles.tabButton(tab === BACKGROUND_COLOR)}
            >
              {t("backgroundImage.subTitle_2")}
            </Button>
          </Box>
          <Box sx={styles.tabContent}>
            <Box sx={styles.tabPanel(tab === BACKGROUND_IMAGE)}>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={styles.imagePreview(selectedImage || imageUrls.bgPic)}
                />
                <Box sx={styles.imageGrid}>
                  {/* System themes */}
                  {systemThemes.map((theme) => (
                    <Box key={theme._id} sx={styles.imagebox}>
                      <Box
                        onClick={() => handleImageSelect(theme.imageUrl)}
                        sx={styles.imageOption(
                          selectedImage === theme.imageUrl,
                        )}
                      >
                        <Image
                          src={theme.imageUrl || imageUrls.bgPic}
                          alt={theme.name || "Theme"}
                          width={56}
                          height={56}
                          style={{ objectFit: "cover", borderRadius: 2 }}
                        />
                      </Box>
                    </Box>
                  ))}

                  {/* Selected theme with edit icon or plus button */}
                  {selectedTheme && selectedTheme.imageUrl ? (
                    <Box sx={styles.imagebox}>
                      <Box
                        onClick={() =>
                          handleImageSelect(selectedTheme.imageUrl)
                        }
                        sx={styles.imageOption(
                          selectedImage === selectedTheme.imageUrl,
                        )}
                      >
                        <Image
                          src={selectedTheme.imageUrl || imageUrls.bgPic}
                          alt={selectedTheme.name || "Theme"}
                          width={56}
                          height={56}
                          style={{ objectFit: "cover", borderRadius: 2 }}
                        />
                      </Box>
                      <IconButton
                        size="small"
                        sx={styles.images}
                        onClick={() => setUploadModalOpen(true)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <IconButton
                      key="plus-button"
                      size="large"
                      sx={styles.plusIcon}
                      onClick={() => setUploadModalOpen(true)}
                    >
                      <AddIcon fontSize="large" />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Color Overlay Tab */}
            <Box sx={styles.tabPanel(tab === BACKGROUND_COLOR)}>
              <Box sx={{ mb: 2 }}>
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
                  <Typography sx={styles.opacityLabel}>
                    {t("backgroundImage.opacity")}
                  </Typography>
                  <Box sx={styles.opacitySliderContainer}>
                    <Box sx={styles.sliderTrack}>
                      <Box sx={styles.sliderBackground(currentColor)} />
                      <Box sx={styles.sliderFill(opacity, currentColor)} />
                      <Slider
                        value={opacity * 100}
                        onChange={(_, v) => handleOpacityChange(v as number)}
                        min={0}
                        max={100}
                        sx={styles.slider(currentColor)}
                      />
                    </Box>
                    <Box sx={styles.opacityValue}>
                      {Math.round(opacity * 100)}%
                    </Box>
                  </Box>
                </Box>
                <Box sx={styles.colorPreviewContainer}>
                  <Box sx={styles.colorPreview(currentColor)} />
                  <Box sx={styles.presetColorsContainer}>
                    {presetColors.map((color) => (
                      <Box
                        key={`preset-${color}`}
                        onClick={() => handleColorSelect(color)}
                        sx={styles.presetColorButton(
                          color,
                          selectedColor === color,
                        )}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box sx={styles.buttonContainer}>
            <Button onClick={handleCancel} fullWidth sx={styles.cancelButton}>
              {t("backgroundImage.Cancel")}
            </Button>
            <Button onClick={handleApply} fullWidth sx={styles.applyButton}>
              {t("backgroundImage.Apply")}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <DynamicModal
        open={isUploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title={t("backgroundImage.UploadNewBackgroundImage")}
        showMicIcon = {false}
      >
        <FileInput
          onChange={handleUpload}
          onValidationError={handleValidationError}
          button={(fileSelected) => (
            <Box sx={{ ...style.buttonRow, mt: 3 }}>
              <Button
                onClick={() => setUploadModalOpen(false)}
                sx={style.cancelButton}
              >
                {t("backgroundImage.Cancel")}
              </Button>
              <Button
                variant="contained"
                onClick={handleUploadImage}
                sx={style.submitButton}
                disabled={!fileSelected || uploading}
              >
                {uploading
                  ? t("backgroundImage.Uploading")
                  : t("backgroundImage.Upload")}
              </Button>
            </Box>
          )}
          imageResolution={{
            minWidth: IMAGE_DIMENSIONS.BACKGROUND_WIDTH_MIN,
            maxWidth: IMAGE_DIMENSIONS.BACKGROUND_WIDTH_MAX,
            minHeight: IMAGE_DIMENSIONS.BACKGROUND_HEIGHT_MIN,
            maxHeight: IMAGE_DIMENSIONS.BACKGROUND_HEIGHT_MAX,
          }}
        />
      </DynamicModal>
    </>
  );
};

export default BackgroundImagePicker;
