export const formStyles = () => ({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
    padding: 3,
    borderRadius: "20px",
    background: "#1A1A1A26",
    backdropFilter: "blur(16.25px)",
    boxSizing: "border-box",
    marginTop: 2,
    boxShadow: `
    8.13px 8.13px 24.38px -5.2px #FFFFFF66 inset,
    -16.25px -8.13px 8.13px -5.2px #FFFFFF33 inset,
    0px 0px 20.8px -5.2px #FFFFFF33 inset
  `,
  },
  header: {
    marginBottom: 1,
    paddingBottom: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoBox: {
    textAlign: "right",
    minWidth: 180,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 1,
    marginBottom: 4,
  },
  shiftType: {
    color: "#FFF",
    fontWeight: 500,
    marginRight: 2,
  },
  shiftTime: {
    color: "#FFF",
    fontWeight: 500,
  },
  title: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#fff",
    marginBottom: 1,
    letterSpacing: 0.2,
  },
  description: {
    fontSize: "0.8rem",
    color: "#fff",
    fontWeight: 400,
  },
  twoColumnGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 2,
  },
  groupTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#fff",
    marginBottom: 1,
  },
  fieldWrapper: {
    borderRadius: 4,
    background: "#F2F4F81A",
    boxShadow: `
    8.13px 8.13px 24.38px -5.12px #FFFFFF66 inset,
    -16.25px -8.13px 8.13px -5.2px #FFFFFF33 inset,
    0px 0px 20.5px -5.2px #FFFFFF33 inset
  `,
    padding: 2,
    marginBottom: 2,
    width: "100%",
    transition: "all 0.3s ease-in-out",
  },
  inputWrapper: {
    marginBottom: 1,
    width: "100%",
    borderRadius: 4,
  },
  label: {
    display: "block",
    marginBottom: 8,
    color: "#fff",
    fontWeight: 600,
    fontSize: "1rem",
    letterSpacing: 0.5,
  },
  required: {
    color: "#F44336",
    marginLeft: 2,
  },
  input: {
    background: "transparent",
    border: "1px solid #D0D5DD",
    fontSize: "0.8rem",
    width: "100%",
    padding: 2,
    color: "#A0A3BD",
    "&::placeholder": {
      color: "#8A94A6",
      opacity: 1,
    },
  },
  textAreaField: {
    transition: "all 0.3s ease-in-out",
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "#888 transparent",
    "& .MuiOutlinedInput-root": {
      borderRadius: 4,
      background: "#5D627580",
      border: "1.5px solid  #FFF",
      fontSize: "0.9rem",
      color: "#FFF",
      "& fieldset": {
        border: "none",
      },
      "&.Mui-focused fieldset": {
        border: "2px solid #848282",
      },
      "&.Mui-disabled": {
        color: "#FFFFFF",
        opacity: 1,
      },
    },
    "& .MuiInputBase-input": {
      padding: "4px 8px",
      lineHeight: "1.2rem",
      minHeight: "40px",
      "&::-webkit-scrollbar": {
        width: "8px",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#888",
        borderRadius: "4px",
      },
      "&::-webkit-scrollbar-track": {
        background: "transparent",
      },
      "&.Mui-disabled": {
        color: "#FFFFFF",
        WebkitTextFillColor: "#FFFFFF",
        opacity: 1,
      },

      "&::placeholder": { color: "#FFFFFF", opacity: 1 },
    },
  },

  textField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 4,
      background: "transparent",
      fontSize: 16,
      color: "#FFFFFF",
      "& fieldset": {
        border: "none",
      },
      "&:hover fieldset": {
        border: "1px solid #D0D5DD",
      },
      "&.Mui-focused fieldset": {
        border: "1px solid #D0D5DD",
      },
      "&.Mui-disabled": {
        color: "#FFFFFF",
        WebkitTextFillColor: "#FFFFFF",
        opacity: 1,
      },
    },
    "& .MuiInputBase-input": {
      padding: "1px",
      color: "#FFFFFF",
      "&.Mui-disabled": {
        color: "#FFFFFF",
        WebkitTextFillColor: "#FFFFFF",
        opacity: 1,
      },
      "&::placeholder": {
        color: "#FFFFFF",
        opacity: 1,
      },
    },
  },
  noBorderFieldWrapper: {
    border: "none",
    boxShadow: "none",
    borderRadius: 2,
    background: "transparent",
    marginBottom: 2,
    width: "100%",
    transition: "all 0.3s ease-in-out",
  },
  dateTimeInput: {
    borderRadius: 4,
    background: "transparent",
    border: "1px solid #C7D3DF",
    fontSize: 16,
    padding: 2,
    color: "#FFFFFF",
    "&::placeholder": {
      color: "#8A94A6",
      opacity: 1,
    },
    "&::-webkit-calendar-picker-indicator": {
      filter: "invert(1)",
      cursor: "pointer",
    },
  },
  dateTimeTextField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 4,
      background: "transparent",
      border: "1px solid #C7D3DF",
      fontSize: 16,
      color: "#A0A3BD",
      "& fieldset": {
        border: "none",
      },
      "&:hover fieldset": {
        border: "1px solid #C7D3DF",
      },
      "&.Mui-focused fieldset": {
        border: "1.5px solid #C7D3DF",
      },
      "&.Mui-disabled": {
        color: "#FFFFFF",
        opacity: 1,
      },
    },
    "& .MuiInputBase-input": {
      padding: "1px",
      color: "#FFFFFF",
      "&::-webkit-calendar-picker-indicator": {
        filter: "invert(1)",
        opacity: 1,
        cursor: "pointer",
      },
      "&.Mui-disabled": {
        color: "#FFFFFF",
        WebkitTextFillColor: "#FFFFFF",
        opacity: 1,
      },

      "&::placeholder": {
        color: "#FFFFFF",
        opacity: 1,
      },
    },
  },
  checkboxTwoColumn: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  },

  eSignBox: {
    border: "1.2px dashed #FFF",
    borderRadius: 2,
    width: "100%",
    minHeight: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#8A94A6",
    background: "#F2F4F81A",
    boxShadow: `
    8.13px 8.13px 24.38px -5.12px #FFFFFF66 inset,
    -16.25px -8.13px 8.13px -5.2px #FFFFFF33 inset,
    0px 0px 20.5px -5.2px #FFFFFF33 inset
  `,
    fontSize: "1rem",
    cursor: "default",
  },
  fieldWrapperError: {
    borderRadius: 4,
    background: "#F2F4F81A",
    boxShadow: `
    8.13px 8.13px 24.38px -5.12px #FFFFFF66 inset,
    -16.25px -8.13px 8.13px -5.2px #FFFFFF33 inset,
    0px 0px 20.5px -5.2px #FFFFFF33 inset
  `,
    padding: 2,
    marginBottom: 2,
    width: "100%",
    border: "1.5px solid #F66104",
    transition: "all 0.3s ease-in-out",
  },

  labelWithMargin: {
    display: "block",
    marginBottom: 8,
    color: "#fff",
    fontWeight: 400,
    fontSize: "1rem",
    letterSpacing: 0.5,
    mb: 1,
  },
  fieldDescription: {
    color: "#FFF",
    fontSize: "0.85rem",
    mb: 1,
  },
  requiredAsterisk: {
    color: "#F44336",
    marginLeft: 2,
  },
  fieldWrapperWithPosition: {
    position: "relative",
    transition: "all 0.3s ease-in-out",
  },
  formContent: {
    width: "100%",
  },
  groupContainer: {
    mb: 3,
    width: "100%",
  },
  twoColumnGroupContainer: {
    display: "flex",
    gap: 2,
  },
  halfWidthGroup: {
    flex: "0 0 50%",
    maxWidth: "50%",
  },
  fieldsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: 2,
    width: "100%",
  },
  fieldContainer: (width: string) => ({
    flex: `0 0 ${width}`,
    maxWidth: width,
    minWidth: width === "50%" ? "250px" : "100%",
    boxSizing: "border-box",
  }),
  rowContainer: {
    display: "flex",
    gap: 2,
    width: "100%",
  },
  halfWidthField: {
    flex: "0 0 50%",
    maxWidth: "50%",
    minWidth: 0,
    boxSizing: "border-box",
  },
  fullWidthField: {
    width: "100%",
  },
  radioInputWrapper: {
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  radioToggleContainer: {
    borderRadius: 2,
    background: "#767680B2",
    padding: "2px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  radioLabel: {
    color: "#fff",
    fontWeight: 600,
    fontSize: "1rem",
  },
  radioButton: (selected: boolean) => ({
    borderRadius: 4,
    color: selected ? "#3D96E1" : "#fff",
    background: selected ? "#FFF" : "transparent",
    fontWeight: 600,
    fontSize: "0.6rem",
    minWidth: 80,
    border: "none",
    boxShadow: selected ? "0 2px 8px 0 rgba(0,178,227,0.10)" : "none",
    "&.MuiToggleButtonGroup-grouped": {
      borderRadius: 2,
      border: "none",
      margin: "0",
      padding: "5px",
      background: selected ? "#FFF" : "transparent",
      color: selected ? "#3D96E1" : "#fff",
    },
  }),
  esignPreview: {
    maxWidth: 180,
    maxHeight: 80,
    border: "1px solid #ccc",
    borderRadius: 4,
  },
  extentTransition: {
    transition: "all 0.3s ease-in-out",
  },
});
