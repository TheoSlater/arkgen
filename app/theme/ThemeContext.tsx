// ThemeProvider.tsx
"use client";

import React, { ReactNode } from "react";
import { ThemeProvider as MUIThemeProvider, CssBaseline } from "@mui/material";
import { darkTheme, lightTheme } from "./theme";

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <MUIThemeProvider theme={lightTheme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};
