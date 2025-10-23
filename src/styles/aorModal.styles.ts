import { SxProps, Theme } from "@mui/material";

export const styles: Record<string, SxProps<Theme>> = {
  modalContent: {
    padding: "6px",
    height: "280px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  companySelectWrapper: {
    marginBottom: "10px",
  },
  select: {
    fontSize: "0.8rem",
    color: "#FFFFFF",
    position: "relative",
    borderRadius: 2,
    minHeight: "35px",
    background: "#2F5C9914",

    "& .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #fff !important",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #fff !important",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #fff !important",
    },

    "& .MuiSelect-select": {
      fontSize: "0.8rem",
      lineHeight: 1.2,
      padding: "4px 32px 4px 8px",
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
  },

  menuPaper: {
    boxShadow: "0px 4px 4px 0px #00000040, inset 0px 6px 30.6px 0px #FFFFFF40",
    background: "#1A1A1A26",
    backdropFilter: "blur(20.25px)",
    WebkitBackdropFilter: "blur(20.25px)",
    maxHeight: 200,
    overflowY: "auto",
    color: "#FFF",
    scrollbarWidth: "thin",
    scrollbarColor: "#888 transparent",
    "&::-webkit-scrollbar": {
      width: "6px",
      borderRadius: "8px",
      background: "#e0e0e0",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#888",
      borderRadius: "8px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#857a7aff",
    },
    scrollBehavior: "smooth",
    "& .MuiMenuItem-root": {
      whiteSpace: "normal",
      flexDirection: "column",
      alignItems: "flex-start",
      py: 1.5,
      fontSize: "0.85rem",
    },
  },
  aorLabel: {
    color: "#FFFFFF",
    fontSize: "0.9rem",
    fontWeight: 600,
    marginBottom: "10px",
  },
  aorCount: {
    color: "#3D96E1",
    fontSize: "0.9rem",
    fontWeight: 500,
  },
  loadingWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: 120,
    gap: "12px",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: "0.9rem",
  },
  noAorBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 120,
    padding: 20,
    borderRadius: 2,
  },
  noAorText: {
    color: "#FFFFFF",
    fontSize: "0.9rem",
    textAlign: "center",
  },
  aorGridWrapper: {
    maxHeight: 150,
    height: 150,
    overflowY: "auto",
    overflowX: "hidden",
    padding: "4px",
    marginTop: "2px",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },

  aorText: {
    fontSize: "0.95rem",
    fontWeight: 500,
    lineHeight: 1.3,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    flex: 1,
  },
  checkIcon: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    color: "#008EC3",
    background: "#fff",
    borderRadius: "50%",
    fontSize: "1rem",
    padding: "2px",
  },
  lockedAorText: {
    color: "white",
  },
  placeholderAorBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 150,
    borderRadius: 2,
  },
  placeholderAorText: {
    color: "#FFFFFF",
    fontSize: "0.9rem",
    textAlign: "center",
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
    px: 2,
    fontWeight: 500,
    fontSize: "0.8rem",
    textTransform: "none" as const,
    height: 38,
    "&.Mui-disabled": {
      backgroundColor: "rgba(255, 255, 255, 0.12)",
      color: "rgba(255, 255, 255, 0.3)",
    },
  },
};
