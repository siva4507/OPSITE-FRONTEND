export const formBuilderStyles = {
  container: {
    height: "calc(100vh - 290px)",
    mb: 20,
    overflowY: "auto",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": { display: "none" },
    color: "#FFF !important",
  },

  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    mb: 3,
    flexWrap: "wrap",
  },

  title: {
    color: "#FFF !important",
    flex: 1,
  },

  headerButtons: {
    display: "flex",
    // mt:4,
    gap: 2,
  },

  borderButton: {
    border: "1px solid rgba(255, 255, 255, 0.5)",
    backgroundColor: "transparent",
    fontSize: "0.8rem",
    color: "#FFF",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  },

  button: {
    color: "#fff",
    borderColor: "#fff",
    borderRadius: "8px",
    "&:hover": {
      borderColor: "#fff",
      backgroundColor: "rgba(255,255,255,0.08)",
    },
  },
  sectionContainer: {

    p: 1,

    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    color: "#FFF !important",
    width: "100%",
  },

  groupContainer: {
    mt: 2,
    p: 2,
    border: "1px dashed rgba(255, 255, 255, 0.4)",
    borderRadius: 2,
    width: "100%",
  },

  fieldContainer: {
    mt: 2,
    p: 2,
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    width: "100%",
  },

  extendContainer: {
    mt: 2,
    p: 2,
    border: "1px solid rgba(255, 255, 255, 0.4)",
    borderRadius: 2,
    width: "100%",
  },

  label: {
    color: "#FFF",
    display: "block",
    marginBottom: "5px",
  },

  input: {
    backgroundColor: "transparent",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "4px",
    color: "#FFF",
    padding: "8px",
    outline: "none",
    "&::placeholder": {
      color: "rgba(255, 255, 255, 0.6)",
    },
  },

  fullWidthInput: {
    width: "100%",
    marginBottom: "10px",
  },

  fieldInput: {
    width: "100%",
  },

  select: {
    color: "#FFF",
    backgroundColor: "transparent",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
    "& .MuiSelect-icon": {
      color: "#FFF",
    },
    "& .MuiSelect-select": {
      padding: "4px 8px",
      minHeight: "unset",
    },
    "&.MuiOutlinedInput-root": {
      height: "32px",
    },
  },

  selectMenu: {
    PaperProps: {
      sx: {
        "& .MuiAutocomplete-paper": {
          background: "#1A1A1A26",
          backdropFilter: "blur(50.25px)",
          borderRadius: "10px",
          boxShadow: `
        8.13px 8.13px 24.38px -5.2px #FFFFFF66 inset,
        -16.25px -8.13px 8.13px -5.2px #FFFFFF33 inset,
        0px 0px 20.8px -5.2px #FFFFFF33 inset
      `,
          color: "#fff",
          overflow: "hidden",
        },
      },
    },
  },

  checkbox: {
    color: "#FFF",
    "&.Mui-checked": {
      color: "#FFF",
    },
  },

  formControlLabel: {
    color: "#FFF",
  },

  typography: {
    color: "#FFF",
  },

  fieldRow: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    flexWrap: "wrap",
    position: "relative",
    width: "100%",
  },

  pageContainer: {
    p: 2,
    pb: 20,
    position: "relative",
    mb: 7,
  },
  leftGrid: {
    overflowY: "auto",
    p: 1,
    borderRight: "1px solid #444",
    position: "relative",
  },
  rightGrid: {
    overflowY: "auto",
    p: 2,
    position: "relative",
  },
  sidebarToggle: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
    color: "#FFF",
    background: "rgba(0,0,0,0.3)",
    "&:hover": { background: "rgba(255,255,255,0.2)" },
  },
  sidebarToggleRight: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 10,
    color: "#FFF",
    background: "rgba(0,0,0,0.3)",
    "&:hover": {
      background: "rgba(255,255,255,0.2)",
    },
  },
  dropdownMenuPaperStyle: {
    boxShadow: "0px 4px 4px 0px #00000040, inset 0px 6px 30.6px 0px #FFFFFF40",
    background: "#1A1A1A26",
    backdropFilter: "blur(20.25px)",
    WebkitBackdropFilter: "blur(20.25px)",
    color: "#FFF",
    maxHeight: 200,
    overflowY: "auto",
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

  dropdownOption: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    color: "#FFF",
    backgroundColor: "transparent",
  },

  selectedTag: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    color: "#FFF",
  },

  inputField: {
    "& .MuiInputBase-root": {
      minHeight: 28,
      padding: "2px 8px",
      color: "#FFFFFF",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#FFFFFF",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#FFFFFF",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#FFFFFF",
    },
    backgroundColor: "transparent",
  },

  autoCompleteRoot: {
    width: 200,
    "& .MuiAutocomplete-popupIndicator": { color: "#FFFFFF" },
    "& .MuiAutocomplete-clearIndicator": { color: "#FFFFFF" },
  },
};
