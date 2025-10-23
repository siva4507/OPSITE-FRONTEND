import { SxProps, Theme } from "@mui/material";

export const modalFormStyles = () => ({
  modalBox: {
    position: "fixed",
    top: "30%",
    left: "40%",
    transform: "translate(-50%, -50%)",
    background: "transparent",
    backdropFilter: "blur(50.25px)",
    boxSizing: "border-box",
    boxShadow: `
      8.13px 8.13px 24.38px -5.2px #FFFFFF66 inset,
      -16.25px -8.13px 8.13px -5.2px #FFFFFF33 inset,
      0px 0px 20.8px -5.2px #FFFFFF33 inset
    `,
    borderRadius: 8,
    padding: "6px",
    minWidth: 340,
    maxWidth: "90vw",
    maxHeight: "60vh",
    outline: "none",
    display: "flex",
    flexDirection: "column",
    overflow: "visible",
    zIndex: 1400,
    isolation: "isolate",
  },
  backdrop: {
    zIndex: 1300,
    pointerEvents: "auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    px: 3,
    pt: 2,
  },
  title: {
    fontWeight: 700,
    fontSize: "1rem",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  closeButton: {
    color: "#FFFFFF",
    ml: 2,
    p: 0.5,
    cursor: "pointer",
    border: "#FFFFFF",
    borderRadius: "50%",
  },
  closeIcon: {
    width: 15,
    height: 15,
    color: "#FFFFFF",
  },
  content: {
    px: 3,
    py: 2,
    maxHeight: "70vh",
    overflowY: "auto",
    overflowX: "visible",
    scrollbarWidth: "thin",
    scrollbarColor: "#888 #222",
    "&::-webkit-scrollbar": {
      width: "8px",
      background: "#222",
      borderRadius: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#888",
      borderRadius: "8px",
      transition: "background 0.3s",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#aaa",
    },
    scrollBehavior: "smooth",
  },
  formFields: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 1,
    mb: 0.2,
    maxHeight: "310px",
    overflowY: "auto",
    scrollBehavior: "smooth",

   
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#b0b0b0",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },

    "&::-webkit-scrollbar": {
      display: "none",
    },
    scrollbarWidth: "none",
  
    scrollbarColor: "#b0b0b0 transparent",
  },
  formFieldBox: {
    mb: 0.5,
    position: "relative",
  },
  voiceBox: {
    display: "flex",
    alignItems: "center",
    color: "#F66104",
    borderRadius: 8,
    padding: "6px",
    background: "#3D96E1",
  },
  inputLabel: {
    fontSize: "0.9rem",
    color: "#FFFFFF",
    mb: 1,
    ml: 0.5,
    letterSpacing: 0.1,
    textAlign: "left" as const,
    border: "none",
  },
  inputRounded: {
    fontSize: "0.8rem",
    color: "#FFFFFF",
    position: "relative",
    background: "transparent",
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      minHeight: "28px",
      fontSize: "0.8rem",
      color: "#FFFFFF",
      outline: "none",
      position: "relative",
      padding: "4px 8px",
      boxSizing: "border-box",
      // remove blue border on hover/active/focus
      "& fieldset": {
        borderColor: "#fff",
      },
      "&:hover fieldset": {
        borderColor: "#fff !important",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#fff !important",
      },
    },

    "& .MuiInputBase-input": {
      fontSize: "0.8rem",
      lineHeight: 1.2,
      padding: "4px 8px",
      color: "#FFFFFF",
      display: "flex",
      alignItems: "center",
      outline: "none",
      minHeight: "20px",
    },

    "& .MuiSelect-select": {
      fontSize: "0.8rem",
      lineHeight: 1.5,
      padding: "4px 40px 4px 8px",
      display: "flex",
      alignItems: "center",
      whiteSpace: "normal",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },

    "& .MuiSelect-icon": {
      color: "#fff",
      right: "8px",
    },

    "& textarea": {
      fontSize: "0.8rem",
      lineHeight: 1,
      minHeight: "1px",
    },

    "& .MuiAutocomplete-root": {
      color: "#FFFFFF",
    },
    "& .MuiAutocomplete-inputRoot": {
      padding: "0 !important",
      "& .MuiInputBase-input": {
        padding: "9px 32px 9px 8px !important",
        fontSize: "0.8rem",
        lineHeight: 1.2,
        color: "#FFFFFF",
        outline: "none",
        minHeight: "20px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "block",
      },
    },
    "& .MuiAutocomplete-clearIndicator": {
      color: "#fff",
      padding: "0 2px",
      "& svg": {
        fontSize: "16px",
      },
      minWidth: "20px",
      height: "20px",
    },
    "& .MuiAutocomplete-popupIndicator": {
      color: "#fff",
      padding: "0 4px",
    },
    "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus":
      {
        WebkitBoxShadow: "transparent", // or theme.palette.background.paper
        WebkitTextFillColor: "#fff",
        transition: "background-color 9999s ease-in-out 0s",
      },
    "& input[type=number]": {
      MozAppearance: "textfield",
      lineHeight: 1.2,
      padding: "4px 8px",
      height: "28px",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
    },
    "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
      {
        WebkitAppearance: "none",
        margin: 0,
      },
  },

  menuItem: {
    fontSize: "0.8rem",
    p: 1,
    borderRadius: 1,
  },
  dropdownPaper: {
    background: "#1A1A1A26",
    backdropFilter: "blur(16.25px)",
    boxSizing: "border-box",
    boxShadow: `
    8.13px 8.13px 24.38px -5.2px #FFFFFF66 inset,
    -16.25px -8.13px 8.13px -5.2px #FFFFFF33 inset,
    0px 0px 20.8px -5.2px #FFFFFF33 inset
  `,
    color: "#FFFFFF",
    borderRadius: 3,
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "#FFF transparent",
    p: 1,
    pr: 2.5,
    zIndex: 1600,
    marginTop: "4px", // spacing below input
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#FFF3",
      borderRadius: 8,
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
  },
  buttonRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    mb: 1,
    mt: 2,
  },
  submitButton: {
    background:
      "linear-gradient(160.41deg, rgba(111, 185, 248, 0.5) -5.15%, rgba(61, 150, 225, 0.5) 87.35%)",
    boxShadow: `
      0px 3px 4px 0px #DFEEFF4D inset,
      0px 1px 1px 0px #FFFFFF59 inset,
      0px -2px 2px 0px #00428926 inset,
      0px 2px 3px 0px #347CD14D
    `,
    backdropFilter: "blur(5.25px)",
    WebkitBackdropFilter: "blur(5.25px)",
    color: "#FFFFFF",
    borderRadius: 24,
    px: 4,
    fontWeight: 500,
    fontSize: "0.8rem",
    textTransform: "none" as const,
    height: 48,
  },
  cancelButton: {
    background: "#A0A3BD47",
    backdropFilter: "blur(5.25px)",
    WebkitBackdropFilter: "blur(5.25px)",
    color: "#fff",
    borderRadius: 24,
    px: 4,
    fontWeight: 500,
    fontSize: "0.8rem",
    textTransform: "none" as const,
    height: 48,
  },
  inputError: {
    color: "#F44336",
    fontSize: "0.75rem",
    marginTop: 0.5,
    marginLeft: 1,
  },
  fileInputBox: (isDragging: boolean) => ({
    border: `2px dashed ${isDragging ? "#3D96E1" : "#BDBEC1"}`,
    borderRadius: 2,
    p: 2,
    textAlign: "center",
    cursor: "pointer",
    color: "#FFF",
    transition: "all 0.2s ease-in-out",
    backgroundColor: isDragging ? "rgba(61, 150, 225, 0.1)" : "transparent",
    "&:hover": {
      borderColor: "#3D96E1",
      backgroundColor: "rgba(61, 150, 225, 0.05)",
    },
  }),
  fileInputLabel: {
    cursor: "pointer",
    width: "100%",
    display: "block",
  },
  fileInputContainer: {
    cursor: "pointer",
  },
  fileInputHidden: {
    display: "none",
  },
  fileInputLabelExtended: {
    whiteSpace: "normal" as const,
    wordBreak: "break-word" as const,
    textAlign: "center" as const,
  },
  filePreviewContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column" as const,
 
    position: "relative" as const,
  },
  fileCloseButton: {
    position: "absolute" as const,
    top: 0,
    right: 0,
    zIndex: 2,
    color: "#fff",
  },
  imagePreview: {
    maxWidth: 140,
    maxHeight: 45,
    objectFit: "contain" as const,
    borderRadius: 6,
  },
  filePreviewBox: {
    width: 180,
    height: 80,
    border: "1px dashed #aaa",
    borderRadius: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFF",
    fontSize: 14,
    textAlign: "center",
    px: 1,
  },
  dragDropText: {
    wordBreak: "break-word",
    textAlign: "center",
    maxWidth: "100%",
    fontSize: "0.9rem",
  },
  buttonContainer: {
    mt: 2,
    display: "flex",
    justifyContent: "center",
  },
});

export const modalStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    p: 2,
  } as SxProps<Theme>,

  input: {
    "& .MuiInputBase-input": { color: "#fff", height: "3px" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#fff" },
      "&:hover fieldset": { borderColor: "#fff" },
      "&.Mui-focused fieldset": { borderColor: "#fff" },
    },
  } as SxProps<Theme>,

  imageBox: {
    flex: 1,
    position: "relative",
    border: "2px dashed #ccc",
    borderRadius: 2,
    overflow: "hidden",
    minHeight: 200,
    cursor: "pointer",
    transition: "border-color 0.2s ease",
    "&:hover": { borderColor: "#999" },
  } as SxProps<Theme>,

  previewOverlay: (color: string, opacity: number, imageUrl?: string) =>
    ({
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
      backgroundSize: "cover",
      backgroundPosition: "center",
      "&::after": {
        content: '""',
        position: "absolute",
        inset: 0,
        backgroundColor: color,
        opacity: opacity,
      },
    }) as SxProps<Theme>,

  clearButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    zIndex: 2,
    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
  } as SxProps<Theme>,

  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    textAlign: "center",
    py: 1,
    zIndex: 2,
    opacity: 0,
    transition: "opacity 0.2s ease",
    ".MuiBox-root:hover &": { opacity: 1 },
  } as SxProps<Theme>,

  emptyImageBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    flexDirection: "column",
    gap: 2,
    color: "#666",
  } as SxProps<Theme>,
};
