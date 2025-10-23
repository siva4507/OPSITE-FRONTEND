import { Theme } from "@mui/material/styles";

export const shiftChangeHeaderStyles = (
  theme: Theme,
  selectedColor?: string,
) => ({
  container: {
    background: "#1A1A1A26",
    backdropFilter: "blur(50.25px)",
    borderRadius: "20px",
    borderTop: `6px solid ${selectedColor || "#3D96E1"}`,
    boxShadow: `
    8.13px 8.13px 24.38px -5.2px #FFFFFF66 inset,
    -16.25px -8.13px 8.13px -5.2px #FFFFFF33 inset,
    0px 0px 20.8px -5.2px #FFFFFF33 inset
  `,
    overflow: "hidden",
    width: "100%",
  },

  tabsContainer: {
    backgroundColor: "#FFFFFF45",
    minHeight: 0,
    padding: "0 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& .MuiTabs-flexContainer": {
      gap: 0,
    },
    "& .MuiTabs-indicator": {
      display: "none",
    },
  },

  tabsFlex: {
    flex: 1,
  },

  tab: {
    height: 10,
    px: 3,
    textTransform: "none",
    fontSize: "0.8rem",
    fontWeight: 500,
    color: "#fff",
    backgroundColor: "transparent",
    borderRadius: "8px 8px 0 0",
    minWidth: "auto",
    "&.Mui-selected": {
      color: theme.palette.mode === "dark" ? "#008EC3" : "#000",
      fontWeight: 500,
      py: 3,
      backgroundColor: "#69728585",
    },
  },

  tabContentWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  activeTabIndicator: {
    width: "100%",
    height: 2,
    borderRadius: 2,
    // mb: 0.5,
  },

  tabLabel: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },

  companyDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    display: "inline-block",
  },

  addButtonContainer: {
    display: "flex",
    alignItems: "center",
    pr: 2,
    cursor: "pointer",
    gap: 1,
  },

  contentContainer: {
    p: 2,
  },

  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    flexWrap: "wrap",
    rowGap: "10px",
    mb: 1,
  },

  titleSection: {
    flex: 1,
  },

  title: {
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 600,
    mb: 0.5,
  },

  subtitle: {
    fontSize: "0.7rem",
    color: "#fff",
  },

  saveButton: {
    backgroundColor: "#A0A3BD36",
    color: "#fff",
    borderRadius: "20px",
    fontWeight: 500,
    fontSize: "0.8rem",
    px: 2,
    py: 1,
    textTransform: "none",
    boxShadow: "none",
    "&:hover": {
      backgroundColor: "#7A8BB0",
      boxShadow: "none",
    },
    "&.Mui-disabled": {
      color: "#ccc",
    },
  },

  saveButtonImage: {
    marginRight: "8px",
  },

  stepsContainer: {
    display: "flex",
    width: "100%",
    gap: 1,
    flexWrap: "wrap",
    background: "#1A1A1A26",
    backdropFilter: "blur(16.25px)",
    borderRadius: "30px",
    padding: 1,
    boxSizing: "border-box",
    justifyContent: "space-evenlly",
    boxShadow: `
    2px 8.13px 24.38px -5.2px #FFFFFF66 inset,
    -5px -8.13px 8.13px -5.2px #FFFFFF1A inset,
    0px 0px 0px -5.2px #FFFFFF1A inset
  `,
  },

  stepButton: {
    borderRadius: 20,
    textTransform: "none",
    fontSize: "0.8rem",
    fontWeight: 500,
    px: 1,
    py: 1,
    minWidth: 100,
    maxWidth: 220,
    flex: "1 1 120px",
    height: "auto",
    color: theme.palette.mode === "dark" ? "#fff" : "#6AB1ED",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "normal",
    textAlign: "center",
    flexDirection: "column",
    wordBreak: "break-word",
    lineHeight: 1.2,
    overflowWrap: "break-word",
  },

  stepButtonActive: {
    borderRadius: 20,
    textTransform: "none",
    fontSize: "0.8rem",
    fontWeight: 500,
    px: 1,
    py: 1,
    minWidth: 100,
    maxWidth: 220,
    flex: "1 1 120px",
    height: "auto",
    background:
      "linear-gradient(160.41deg, rgba(255, 255, 255, 0.4) -5.15%, rgba(255, 255, 255, 0.4) 87.35%)",
    color: "#fff",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "normal",
    textAlign: "center",
    flexDirection: "column",
    wordBreak: "break-word",
    lineHeight: 1.2,
    overflowWrap: "break-word",
    boxShadow: `
    0px 3px 4px 0px #DFEEFF4D inset,
    0px 1px 1px 0px #FFFFFF59 inset,
    0px -2px 2px 0px #00428926 inset
  `,
    "&:hover": {
      backgroundColor: "#DFEEFF4D",
    },
  },

  noFormMessage: {
    color: "#FFF",
    fontWeight: 600,
    fontSize: "1rem",
    textAlign: "center",
    padding: "16px 0",
  },

  noFormMessage_1: {
    padding: 2,
    textAlign: "center",
    color: "#FFF",
    fontSize: 18,
  },
  endAor: {
    color: "white",
    textAlign: "center",
    mt: 1,
    border: "1px solid #FFF",
    borderRadius: "10px",
    py: 2,
  },
  validationMessage: { paddingLeft: 20, color: "#FFF" },
  message: {
    minHeight: 400,
    background: "transparent",
    borderRadius: 2,
    mt: 2,
    position: "relative",

    transition: "opacity 0.5s cubic-bezier(0.5, 0, 0.2, 1)",
  },
  loader: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    pointerEvents: "none",
  },
});
