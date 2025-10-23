"use client";

import React from "react";
import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useAppSelector } from "@/src/hooks/redux";

const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#3D96E1",
        light: "#42a5f5",
        dark: "#1565c0",
      },
      background: {
        default: mode === "dark" ? "#181c1f" : "#f8f9fa",
        paper: mode === "dark" ? "#27272A" : "#ffffff",
      },
      text: {
        primary: mode === "dark" ? "#e3e3e3" : "#333333",
        secondary: mode === "dark" ? "#b0b0b0" : "#666666",
      },
      warning: {
        main: "#ff9800",
      },
      error: {
        main: "#ff3d00",
      },
    },
    typography: {
      fontFamily:
        '"__Outfit_7302e9", "__Outfit_Fallback_7302e9", "Outfit", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
            },
          },
        },
      },
    },
  });

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const mode = useAppSelector((state) => state.theme.mode);
  const theme = React.useMemo(() => getTheme(mode), [mode]);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};

export default ThemeProvider;
