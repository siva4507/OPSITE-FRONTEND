import React, { useState, useCallback, useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { modalFormStyles } from "@/src/styles/modalForm.styles";
import { useTranslation } from "@/src/hooks/useTranslation";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { FileInputProps } from "@/src/types/types";
import { DEFAULT_ALLOWED_TYPES } from "@/src/utils/constant";

const FileInput: React.FC<FileInputProps> = ({
  onChange,
  onValidationError,
  accept = DEFAULT_ALLOWED_TYPES,
  maxFileSizeMB,
  button,
  previewUrl = null,
  initialFileName = "",
  imageResolution,
  value = null,
}) => {
  console.log("file", maxFileSizeMB);
  const { t } = useTranslation();
  const styles = modalFormStyles();
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState(
    value?.name || initialFileName || (previewUrl ? "Current File" : ""),
  );
  // const [filePreview, setFilePreview] = useState<string>("");
  const [filePreview, setFilePreview] = useState<string>(
    value ? URL.createObjectURL(value) : previewUrl || "",
  );
  const [imageLoadError, setImageLoadError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  // console.log(previewUrl)
  // useEffect(() => {
  //   if (previewUrl) {
  //     setFilePreview(previewUrl);
  //     setFileName(initialFileName || "Current File");
  //   }
  // }, [previewUrl, initialFileName]);

  useEffect(() => {
    if (value) {
      setFileName(value.name);
      setFilePreview(URL.createObjectURL(value));
      setImageLoadError(false);
    } else if (previewUrl) {
      setFileName(initialFileName || "Current File");
      setFilePreview(previewUrl);
    } else {
      setFileName("");
      setFilePreview("");
      setImageLoadError(false);
    }
  }, [value, previewUrl, initialFileName]);

  const getDragDropText = useCallback(() => {
    if (!accept) return t("common.dragAndDrop");

    const fileTypes = accept.split(",").map((type) => type.trim());
    const extensions = fileTypes.map((type) => {
      if (type.startsWith(".")) {
        return type.toUpperCase().replace(".", "");
      }
      if (
        type.startsWith("image/") ||
        type.startsWith("audio/") ||
        type.startsWith("video/") ||
        type.startsWith("application/") ||
        type.startsWith("text/")
      ) {
        return type.split("/")[1]?.toUpperCase();
      }
      return type.toUpperCase();
    });

    const chunks: string[] = [];
    for (let index = 0; index < extensions.length; index += 5) {
      chunks.push(extensions.slice(index, index + 5).join("/"));
    }

    return (
      <>
        Drag & drop a{" "}
        {chunks.map((chunk, idx) => (
          <React.Fragment key={idx}>
            {chunk}
            {idx < chunks.length - 1 && <br />}
          </React.Fragment>
        ))}{" "}
        file here, or click to select
        {imageResolution && (
          <Typography
            component="span"
            sx={{
              display: "block",
              mt: 0.5,
              fontSize: "0.75rem",
              color: "#aaa",
            }}
          >
            Recommended resolution: {imageResolution.minWidth}x
            {imageResolution.minHeight} – {imageResolution.maxWidth}x
            {imageResolution.maxHeight} px
          </Typography>
        )}
      </>
    );
  }, [accept, t, imageResolution]);

  const handleFile = useCallback(
    (file: File) => {
      const fileNameLower = file.name.toLowerCase();

      if (fileNameLower.endsWith(".jfif")) {
        setErrorMessage(t("common.unsupportedfile"));
        return;
      }

      // Check file type
      const acceptedTypes = accept
        .split(",")
        .map((type) => type.trim().toLowerCase());

      const isValidType =
        acceptedTypes.includes(file.type.toLowerCase()) ||
        acceptedTypes.some((ext) => fileNameLower.endsWith(ext));

      if (!isValidType) {
        setErrorMessage(t("common.unsupportedfile"));
        return;
      }

      if (maxFileSizeMB && file.size > maxFileSizeMB * 1024 * 1024) {
        setErrorMessage(t("common.maxFileSize", { size: maxFileSizeMB }));
        return;
      }

      const isImageFile =
        file.type.startsWith("image/") ||
        fileNameLower.match(/\.(png|jpe?g|gif|bmp|webp|svg)$/i);

      if (isImageFile && file.size < 1000) {
        setErrorMessage(t("common.fileCorrupted"));
        return;
      }

      if (isImageFile && imageResolution) {
        const img = new Image();
        img.onload = () => {
          const { width, height } = img;
          if (
            width < imageResolution.minWidth ||
            width > imageResolution.maxWidth ||
            height < imageResolution.minHeight ||
            height > imageResolution.maxHeight
          ) {
            setErrorMessage(
              t("common.invalidResolution", {
                minW: imageResolution.minWidth,
                maxW: imageResolution.maxWidth,
                minH: imageResolution.minHeight,
                maxH: imageResolution.maxHeight,
              }),
            );
            return;
          }
          setErrorMessage("");
          setFileName(file.name);
          const previewUrl = URL.createObjectURL(file);
          setFilePreview(previewUrl);
          setImageLoadError(false);
          onChange(file);
        };
        img.src = URL.createObjectURL(file);
        return;
      }
      setErrorMessage("");
      setFileName(file.name);

      const isImageFilePreview =
        file.type.startsWith("image/") ||
        fileNameLower.match(/\.(png|jpe?g|gif|bmp|webp|svg)$/i);

      if (isImageFilePreview) {
        const previewUrl = URL.createObjectURL(file);
        setFilePreview(previewUrl);
        setImageLoadError(false);
      } else {
        setFilePreview("");
        setImageLoadError(false);
      }

      onChange(file);
    },
    [onChange, onValidationError, accept, maxFileSizeMB],
  );

  const handleClearFile = () => {
    setFileName("");
    setFilePreview("");
    setImageLoadError(false);
    if (inputRef.current) inputRef.current.value = "";
    onChange(null);
  };

  useEffect(
    () => () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    },
    [filePreview],
  );

  const handleDragEvents = (e: React.DragEvent, isEntering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(isEntering);
  };

  const handleDrop = (e: React.DragEvent) => {
    handleDragEvents(e, false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
      e.target.value = "";
    }
  };

  return (
    <>
      <Box
        sx={{
          ...styles.fileInputBox(dragging),
          ...styles.fileInputContainer,
        }}
        onDragEnter={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          style={styles.fileInputHidden}
          onChange={handleFileChange}
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          style={{
            ...styles.fileInputLabel,
            ...styles.fileInputLabelExtended,
          }}
          onClick={(e) => e.preventDefault()}
        >
          {fileName ? (
            <Box sx={styles.filePreviewContainer}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleClearFile();
                }}
                sx={styles.fileCloseButton}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
              {filePreview && !imageLoadError ? (
                <img
                  src={filePreview}
                  alt="Preview"
                  style={styles.imagePreview}
                  onLoad={() => setImageLoadError(false)}
                  onError={() => {
                    setImageLoadError(true);
                  }}
                />
              ) : (
                <Box sx={styles.filePreviewBox}>{fileName}</Box>
              )}
            </Box>
          ) : (
            <Typography sx={styles.dragDropText}>
              {getDragDropText()}
            </Typography>
          )}
        </label>
      </Box>
      {errorMessage && (
        <Typography sx={{ color: "red", fontSize: "0.8rem", mt: 1 }}>
          {errorMessage}
        </Typography>
      )}

      {button && <Box sx={styles.buttonContainer}>{button(!!fileName)}</Box>}
    </>
  );
};

export default FileInput;
