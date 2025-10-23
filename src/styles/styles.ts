import { SxProps, Theme } from "@mui/material";
import { imageUrls } from "../utils/constant";

export const authSectionStyles: Record<string, SxProps<Theme>> = {
  root: {
    backgroundImage: `url(${imageUrls.workers})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    overflow: "hidden",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "#00091B99",
    boxShadow: "9px 0px 17px 0px #4DA0FF21",
  },
  contentWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    color: "white",
    textAlign: "left",
    p: 4,
    m: 2,
    width: "auto",
    maxWidth: "50%",
    borderRadius: 4,
    background: "#04347F33",
    boxShadow: "0px 4px 4px 0px #00000040, inset 0px 6px 30.6px 0px #FFFFFF40",
  },

  caption: {
    mb: 2,
    opacity: 0.9,
    fontSize: "0.875rem",
  },
  word: {
    fontWeight: "bold",
    fontSize: "2rem",
  },
  underline: {
    width: 60,
    height: 4,
    bgcolor: "white",
    mt: 3,
  },
};

export const appBarStyles: Record<string, SxProps<Theme>> = {
  appBar: {
    background: "#1A1A1A26",
    backdropFilter: "blur(16.25px)",
    WebkitBackdropFilter: "blur(16.25px)",
    borderRadius: "40px",
    boxShadow: `
    0px 4px 4px 0px #00000040,
    inset 0px 6px 30.6px 0px #FFFFFF40,
    inset 8.13px 8.13px 24.38px -5.2px #FFFFFF33,
    inset -16.25px -8.13px 13.4px -5.2px #FFFFFF1A,
    inset 0px 0px 8px -5.2px #FFFFFF33
  `,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    maxWidth: "98vw",
    width: "calc(100% - 48px)",
    margin: "24px auto",
    zIndex: 1000,
    padding: "0 10px",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "64px",
    padding: 0,
  },
  profileBox: {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
  },
  profileButton: {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    padding: "8px 12px",
    borderRadius: "20px",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
      transform: "translateY(-1px)",
    },
    "&:active": {
      transform: "translateY(0)",
    },
  },
  userName: {
    color: "#FFFFFF",
    fontWeight: 500,
    fontSize: "14px",
  },
  avatar: {
    width: 32,
    height: 32,
    color: "#fff",
    border: "none",
  },
  menuPaper: {
    overflow: "visible",
    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
    mt: 1.5,
    background: "#1A1A1A26",
    backdropFilter: "blur(10.25px)",
    WebkitBackdropFilter: "blur(10.25px)",
    boxShadow: `
      8.13px 8.13px 24.38px -5.2px #FFFFFF66 inset,
      -16.25px -8.13px 8.13px -5.2px #FFFFFF33 inset,
      0px 0px 20.8px -5.2px #FFFFFF33 inset
    `,
    color: "#FFFFFFF",
    borderRadius: "12px",
    minWidth: "160px",
    "& .MuiMenuItem-root": {
      fontSize: "14px",
    },
  },
  menuItem: {
    padding: "4px 8px",
    borderRadius: "8px",
    margin: "2px 4px",
    color: "#FFFFFF",
    transition: "all 0.2s ease-in-out",
  },
  menuIcon: {
    minWidth: "36px",
    color: "#FFFFFFF",
  },
};

export const styles = {
  container: {
    background: "#1A1A1A26",
    backdropFilter: "blur(50.25px)",
    borderRadius: "20px",
    // borderTop: "4px solid #3D96E1",
    boxShadow: `
    8.13px 8.13px 24.38px -5.2px #FFFFFF66 inset,
    -16.25px -8.13px 8.13px -5.2px #FFFFFF33 inset,
    0px 0px 20.8px -5.2px #FFFFFF33 inset
  `,
    overflow: "hidden",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  dialog: {
    borderRadius: 4,
    background: "#1A1A1A26",
    color: "#fff",
    p: 0,
    overflow: "visible",
    position: "fixed",
    top: 24,
    right: 24,
    zIndex: 2000,
    backdropFilter: "blur(30px)",
    WebkitBackdropFilter: "blur(30px)",
    boxShadow: `
    8.13px 8.13px 24.38px -5.2px #FFFFFF66 inset,
    -16.25px -8.13px 8.13px -5.2px #FFFFFF33 inset,
    0px 0px 20.8px -5.2px #FFFFFF33 inset,
    0px 10px 60px 0px #0000001A
  `,
    minWidth: 340,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  } as SxProps<Theme>,

  dialogTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    p: 2,
    pb: 1,
    fontWeight: 600,
    fontSize: 18,
    color: "#fff",
  } as SxProps<Theme>,

  closeButton: {
    backgroundColor: "#fff",
    color: "#000",
    p: 0.5,
    borderRadius: "50px",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: "#f0f0f0",
      transform: "scale(1.05)",
    },
  } as SxProps<Theme>,

  dialogContent: {
    p: 2,
    pt: 0,
  } as SxProps<Theme>,

  tabContainer: {
    display: "flex",
    alignItems: "center",
    mb: 2,
    width: "100%",
  } as SxProps<Theme>,

  tabButton: (isActive: boolean) =>
    ({
      borderRadius: 2,
      mr: 1,
      fontWeight: 500,
      fontSize: 14,
      textTransform: "none",
      background: isActive ? "#fff" : "#BDBEC14D",
      color: isActive ? "#000" : "#FFF",
      boxShadow: isActive ? "0 2px 8px #0001" : "none",
      flex: 1,
      width: "100%",
      transition: "all 0.2s ease-in-out",
    }) as SxProps<Theme>,

  colorGrid: (gridLength: number) =>
    ({
      display: "grid",
      gridTemplateColumns: `repeat(${gridLength}, 1fr)`,
      gap: 0,
      mb: 2,
      width: "100%",
    }) as SxProps<Theme>,

  colorCell: (color: string, isSelected: boolean) =>
    ({
      width: "100%",
      aspectRatio: "1 / 1",
      background: color,
      borderRadius: 0,
      border: isSelected ? "2px solid #3D96E1" : "none",
      cursor: "pointer",
      transition: "all 0.15s ease-in-out",
      "&:hover": {
        transform: "scale(1.1)",
        zIndex: 1,
      },
    }) as SxProps<Theme>,

  opacityContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
    mb: 1,
  } as SxProps<Theme>,

  opacityLabel: {
    fontSize: 14,
    color: "#B0B8C1",
    mb: 0.5,
    fontWeight: 600,
    letterSpacing: 1,
  } as SxProps<Theme>,

  opacitySliderContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    width: "100%",
  } as SxProps<Theme>,

  sliderTrack: {
    position: "relative",
    flex: 1,
    height: 24,
    display: "flex",
    alignItems: "center",
    borderRadius: 12,
    overflow: "hidden",
    padding: "2px 0",
  } as SxProps<Theme>,

  sliderBackground: (selectedColor: string) =>
    ({
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      borderRadius: 12,
      background: `
      repeating-linear-gradient(45deg, #e0e0e0 0 8px, #fff 0 16px),
      repeating-linear-gradient(-45deg, #e0e0e0 0 8px, #fff 0 16px),
      linear-gradient(90deg, transparent 0%, ${selectedColor} 100%)
    `,
    }) as SxProps<Theme>,

  sliderFill: (opacity: number, selectedColor: string) =>
    ({
      position: "absolute",
      left: 0,
      top: 0,
      width: `${opacity * 100}%`,
      height: "100%",
      background: `linear-gradient(90deg, transparent 0%, ${selectedColor} 100%)`,
      opacity: 1,
      pointerEvents: "none",
    }) as SxProps<Theme>,

  slider: (selectedColor: string) =>
    ({
      width: "100%",
      color: "transparent",
      zIndex: 1,
      height: 24,
      p: 0,
      "& .MuiSlider-thumb": {
        width: 25,
        height: 25,
        background: "#fff",
        border: `3px solid ${selectedColor}`,
        boxShadow: "0 2px 8px #0002",
        marginTop: 0,
        marginBottom: 0,
      },
      "& .MuiSlider-rail": {
        opacity: 0,
      },
      "& .MuiSlider-track": {
        opacity: 0,
      },
      "& .MuiSlider-root": {
        padding: "0 12px",
      },
    }) as SxProps<Theme>,

  opacityValue: {
    width: 48,
    height: 24,
    background: "#fff",
    color: "#000",
    borderRadius: 2,
    px: 0,
    py: 0,
    fontWeight: 500,
    fontSize: "1rem ",
    textAlign: "center",
    boxShadow: "0 1px 4px #0001",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as SxProps<Theme>,

  colorPreviewContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    borderTop: "2px solid #E0E4EA",
    pt: 2,
    mt: 1,
    gap: 2,
  } as SxProps<Theme>,

  colorPreview: (color: string) =>
    ({
      width: 44,
      height: 44,
      borderRadius: 2,
      background: color,
      border: "2.5px solid #fff",
      boxShadow: "0 2px 8px #0002",
      mr: 2,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease-in-out",
    }) as SxProps<Theme>,

  presetColorsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: 1.5,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  } as SxProps<Theme>,

  presetColorButton: (color: string, isSelected: boolean) =>
    ({
      width: 18,
      height: 18,
      borderRadius: "50%",
      background: color,
      border: isSelected ? "2px solid #3D96E1" : "1.5px solid #fff",
      boxShadow: "0 1px 4px #0001",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        transform: "scale(1.2)",
      },
    }) as SxProps<Theme>,

  addColorButton: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: "#E0E4EA",
    color: "#3D96E1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    border: "2px dashed #3D96E1",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      transform: "scale(1.2)",
      background: "#3D96E1",
      color: "#fff",
    },
  } as SxProps<Theme>,

  imagePreview: (imgUrl: string) =>
    ({
      border: "1px solid rgb(234, 236, 241)",
      borderRadius: 2,
      overflow: "hidden",
      width: "100%",
      height: 150,
      mb: 2,
      background: `url(${imgUrl}) center/cover no-repeat`,
      transition: "all 0.3s ease-in-out",
    }) as SxProps<Theme>,

  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 1,
    mb: 1,
    p: 1,
  } as SxProps<Theme>,

  imagebox: {
    position: "relative",
    display: "inline-block",
  } as SxProps<Theme>,

  images: {
    position: "absolute",
    top: -6,
    right: 2,
    background: "#fff",
    color: "#3D96E1",
    zIndex: 2,
    boxShadow: 1,
    p: 0.5,
    "&:hover": { background: "#e0e0e0" },
  } as SxProps<Theme>,

  inputRounded: {
    fontSize: "0.8rem",
    color: "#FFFFFF",
    position: "relative",

    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      minHeight: "28px",
      fontSize: "0.8rem",
      color: "#FFFFFF",
      outline: "none",
      border: "1px solid #fff",
      position: "relative",
      padding: "4px 8px",
      boxSizing: "border-box",

      "&.Mui-focused": {
        borderColor: "#fff",
      },
    },

    "& .MuiInputBase-input": {
      fontSize: "0.8rem",
      lineHeight: 1.2,
      padding: "4px 8px",
      color: "#FFFFFF",
      background: "#2F5C9914",
      display: "flex",
      alignItems: "center",
      outline: "none",
      minHeight: "6px",
    },

    "& .MuiSelect-select": {
      fontSize: "0.8rem",
      lineHeight: 1.2,
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
      // padding: "4px 8px",
      minHeight: "6px",
    },
  },
  plusIcon: {
    width: 56,
    height: 56,
    border: "2px dashed #3D96E1",
    borderRadius: 2,
    color: "#3D96E1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
    m: 0.5,
  } as SxProps<Theme>,

  imageOption: (isSelected: boolean) =>
    ({
      border: isSelected ? "2px solid #3D96E1" : "2px solid transparent",
      borderRadius: 2,
      overflow: "hidden",
      cursor: "pointer",
      width: 60,
      height: 60,
      background: "#232A3A",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        transform: "scale(1.05)",
        borderColor: isSelected ? "#3D96E1" : "#fff",
      },
    }) as SxProps<Theme>,

  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 1,
    mt: 1,
  } as SxProps<Theme>,

  cancelButton: {
    color: "#fff",
    background: "#BDBEC14D",
    borderRadius: 2,
    px: 3,
    fontWeight: 500,
    mb: 1,
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      background: "#9A9CA04D",
      transform: "translateY(-1px)",
    },
  } as SxProps<Theme>,

  applyButton: {
    color: "#fff",
    background: "#3D96E1",
    borderRadius: 2,
    px: 3,
    fontWeight: 500,
    mb: 1,
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      background: "#2D86D1",
      transform: "translateY(-1px)",
    },
  } as SxProps<Theme>,

  fadeContainer: (isVisible: boolean) =>
    ({
      opacity: isVisible ? 1 : 0,
      transition: "opacity 0.3s ease-in-out",
      minHeight: "200px",
    }) as SxProps<Theme>,

  tabContent: {
    position: "relative",
    minHeight: "300px",
    overflow: "hidden",
  } as SxProps<Theme>,

  tabPanel: (isActive: boolean) =>
    ({
      position: isActive ? "relative" : "absolute",
      top: 0,
      left: 0,
      width: "100%",
      opacity: isActive ? 1 : 0,
      visibility: isActive ? "visible" : "hidden",
      transition: "all 0.3s ease-in-out",
      transform: isActive ? "translateY(0)" : "translateY(10px)",
    }) as SxProps<Theme>,
};

export const adminTableStyles: Record<string, SxProps<Theme>> = {
  container: {
    background: "#1A1A1A26",
    backdropFilter: "blur(50.25px)",
    borderRadius: "20px",
    // borderTop: "4px solid #3D96E1",
    boxShadow: `
    8.13px 8.13px 24.38px -5.2px #FFFFFF66 inset,
    -16.25px -8.13px 8.13px -5.2px #FFFFFF33 inset,
    0px 0px 20.8px -5.2px #FFFFFF33 inset
  `,
    overflow: "hidden",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },

  header: {
    mt: 4,
    px: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    color: "#fff",
  },

  addButton: {
    color: "#fff",
    borderColor: "#fff",
    backgroundColor: "transparent",
    borderRadius: 2,
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderColor: "#fff",
    },
    "&.Mui-disabled": {
      color: "rgba(255, 255, 255, 0.5)",
      borderColor: "rgba(255, 255, 255, 0.5)",
      backgroundColor: "transparent",
    },
  },

  tableWrapper: {
    px: 5,
    py: 3,
    flex: 1,
    overflow: "hidden",
  },

  footer: {
    px: 2,
    pb: 1,
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },
  searchInput: {
    backgroundColor: "transparent",
    borderRadius: 1,
    minWidth: 200,
    "& .MuiOutlinedInput-root": {
      color: "#fff",
      "& fieldset": { borderColor: "#fff" },
      "&:hover fieldset": { borderColor: "#fff" },
      "&.Mui-focused fieldset": { borderColor: "#fff" },
    },
    "& .MuiInputBase-input": {
      color: "#fff",
    },
    "& .MuiInputAdornment-root svg": {
      color: "#fff",
    },
  },
  whiteOutlineStyle: {
    minWidth: 10,
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      color: "#fff",
      backgroundColor: "transparent",
      "& fieldset": {
        borderColor: "#fff",
      },
      "&:hover fieldset": {
        borderColor: "#fff",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#fff",
      },
    },
  },
};
