import { useMemo, useState, ReactNode } from "react";
import { PaletteMode } from "@mui/material";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { getTheme } from "./theme";
import { ThemeContext } from "./themeContextDef";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>("light");

  const contextValue = useMemo(
    () => ({
      mode,
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
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
