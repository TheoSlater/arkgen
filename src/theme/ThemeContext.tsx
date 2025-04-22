import { useMemo, useState, ReactNode } from "react";
import { PaletteMode } from "@mui/material";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { getTheme } from "./theme";
import { ThemeContext } from "./themeContextDef";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem("themeMode");
    return (savedMode as PaletteMode) || "light";
  });

  const contextValue = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        const newMode = mode === "light" ? "dark" : "light";
        setMode(newMode);
        localStorage.setItem("themeMode", newMode);
      },
    }),
    [mode]
  );

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
