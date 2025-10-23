import { SxProps, Theme } from "@mui/material/styles";

export const styles = {
  formContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    minHeight: "100vh",
    width: { xs: "100%", md: "50%" },
    color: "#FFFFFF",
    transition: "all 0.3s ease-in-out",
  } as SxProps<Theme>,

  backgroundOverlay: (backgroundImageUrl: string) =>
    ({
      backgroundImage: `url(${backgroundImageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 0,
    }) as SxProps<Theme>,

  logo: {
    width: 180,
    height: "auto",
    maxHeight: 60,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    zIndex: 1,
    mb: 3,
  } as SxProps<Theme>,

  card: {
    maxWidth: 430,
    width: "90%",
    borderRadius: 10,
    boxShadow: "0px 4px 4px 0px #00000040, inset 0px 6px 30.6px 0px #FFFFFF40",
    background: "#1A1A1A26",
    backdropFilter: "blur(5.25px)",
    WebkitBackdropFilter: "blur(5.25px)",
    position: "relative",
    zIndex: 1,
  } as SxProps<Theme>,

  cardContent: {
    p: 4,
    px: 5,
  } as SxProps<Theme>,

  headerContainer: {
    textAlign: "center",
  } as SxProps<Theme>,

  title: {
    color: "#FFFFFF",
    mb: 1,
    fontSize: "1.8rem",
    fontWeight: 700,
  } as SxProps<Theme>,

  subtitle: {
    fontSize: "0.9rem",
    color: "#FFFFFF",
    fontWeight: 200,
  } as SxProps<Theme>,

  inputField: {
    fontSize: "8px",
    "& .MuiInputBase-input": {
      color: "#FFFFFF !important",
      backgroundColor: "transparent !important",
      WebkitTextFillColor: "#FFFFFF !important",
      caretColor: "#FFFFFF !important",
      transition: "background-color 9999s ease-in-out 0s",
      "&:-webkit-autofill": {
        WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
        WebkitTextFillColor: "#FFFFFF !important",
        color: "#FFFFFF !important",
        backgroundColor: "transparent !important",
        caretColor: "#FFFFFF !important",
      },
      "&:-webkit-autofill:focus": {
        WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
        WebkitTextFillColor: "#FFFFFF !important",
        color: "#FFFFFF !important",
        backgroundColor: "transparent !important",
        caretColor: "#FFFFFF !important",
      },
      "&:-webkit-autofill:hover": {
        WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
        WebkitTextFillColor: "#FFFFFF !important",
        color: "#FFFFFF !important",
        backgroundColor: "transparent !important",
        caretColor: "#FFFFFF !important",
      },
      "&:-webkit-autofill:active": {
        WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
        WebkitTextFillColor: "#FFFFFF !important",
        color: "#FFFFFF !important",
        backgroundColor: "transparent !important",
        caretColor: "#FFFFFF !important",
      },
      // For Firefox
      "&:-moz-autofill": {
        boxShadow: "0 0 0 1000px transparent inset !important",
        color: "#FFFFFF !important",
        backgroundColor: "transparent !important",
        caretColor: "#FFFFFF !important",
      },
      "&:-moz-autofill:focus": {
        boxShadow: "0 0 0 1000px transparent inset !important",
        color: "#FFFFFF !important",
        backgroundColor: "transparent !important",
        caretColor: "#FFFFFF !important",
      },
    },
    "& .MuiInputBase-root": {
      borderBottom: "0px solid #e0e0e0",
      color: "#fff",
      backgroundColor: "transparent",
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: "#fff",
    },
    "& .MuiInput-underline:hover:before": {
      borderBottomColor: "#4295CF !important",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#4295CF",
    },
    "& .MuiInputLabel-root": {
      fontSize: "0.85rem",
      color: "#FFFFFF",
    },
    "& .MuiInputLabel-root .MuiInputLabel-asterisk": {
      color: "red",
    },
    "& .MuiInputBase-label": {
      color: "#FFFFFF",
    },
    "& .MuiInputLabel-root.Mui-error": { color: "#fff" },
    "& .MuiInput-underline.Mui-error:after": { borderBottomColor: "#fff" },
  } as SxProps<Theme>,

  rememberForgotContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#FFFFFF",
    my: 2,
  } as SxProps<Theme>,

  forgotPasswordLink: {
    textDecoration: "none",
    my: 2,
    "&:hover": {
      textDecoration: "underline",
    },
  } as SxProps<Theme>,

  iconButtonSmall: {
    color: "#FFFFFF",
    "&.MuiIconButton-root": {
      padding: "4px",
      fontSize: "1rem",
    },
    "& svg": {
      fontSize: "1.1rem",
    },
  },
  loginButtonStyle: {
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    color: "#fff",
    borderRadius: "25px",
    fontSize: "1rem",
    fontWeight: 600,
    textTransform: "none" as const,
    padding: "12px 0",
    margin: "15px 0",
    marginTop: "0.5rem",
    marginBottom: "3px",
    boxShadow: `
      inset 0 0 10px rgba(255, 255, 255, 0.3),
      inset 0 0 5px rgba(255, 255, 255, 0.2),
      0 4px 10px rgba(0, 0, 0, 0.4)
    `,
    transition: "all 0.3s ease",
    "&:hover, &:focus": {
      background: "rgba(255, 255, 255, 0.3)",
      transform: "translateY(-2px)",
      boxShadow: `
        inset 0 0 12px rgba(255, 255, 255, 0.4),
        inset 0 0 6px rgba(255, 255, 255, 0.3),
        0 6px 14px rgba(0, 0, 0, 0.5)
      `,
    },
    "&:focus": {
      outline: "2px solid rgba(255, 255, 255, 0.6)",
      outlineOffset: "3px",
    },
  },
  buttonText: {
    fontSize: "1.2rem",
    fontWeight: 600,
    color: "transparent",
    background: "rgba(255, 255, 255, 0.5)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    textShadow: `
      0px 4px 4px rgba(0, 0, 0, 0.15),
      1px 1px 2px rgba(255, 255, 255, 0.15),
    -1px -1px 2px rgba(255, 255, 255, 0.15)
    `,
    transition: "all 0.3s ease",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.8)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
    },
    "&:focus": {
      textShadow: `
        0px 4px 6px rgba(0, 0, 0, 0.25),
        1px 1px 3px rgba(255, 255, 255, 0.3)
      `,
    },
  },
  loginfooter: {
    fontSize: "0.875rem",
    mb: 1,
    textAlign: "center",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "2px",
    cursor: "pointer",
  } as SxProps<Theme>,

  checkboxWhite: {
    color: "#FFFFFF",
    "&.Mui-checked": {
      color: "#FFFFFF",
    },
  } as SxProps<Theme>,
  icon: {
    color: "#4295CF",
    fontSize: "1.5rem",
    mr: -0.5,
    cursor: "pointer",
  },
};

export const passwordCriteriaStyles = {
  wrapper: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    overflow: "hidden",
    transition: "all 0.3s ease-in-out",
    opacity: 1,
    maxHeight: "120px",
    transform: "translateY(0)",
  } as SxProps<Theme>,

  wrapperHidden: {
    opacity: 0,
    maxHeight: 0,
    transform: "translateY(-10px)",
    margin: 0,
    padding: 0,
  } as SxProps<Theme>,

  item: {
    display: "flex",
    alignItems: "center",
    mr: 1,
    mb: 0.5,
    transition: "all 0.2s ease-in-out",
    transform: "translateX(0)",
    opacity: 1,
  } as SxProps<Theme>,

  itemHidden: {
    transform: "translateX(-10px)",
    opacity: 0,
  } as SxProps<Theme>,

  icon: (isValid: boolean): SxProps<Theme> => ({
    fontSize: "8px",
    color: isValid ? "#4CAF50" : "#9e9e9e",
    mr: 1,
    transition: "color 0.3s ease-in-out, transform 0.2s ease-in-out",
    transform: isValid ? "scale(1.1)" : "scale(1)",
  }),

  text: (isValid: boolean): SxProps<Theme> => ({
    color: isValid ? "#4CAF50" : "#9e9e9e",
    fontSize: "0.705rem",
    whiteSpace: "nowrap",
    transition: "color 0.3s ease-in-out",
  }),
};
