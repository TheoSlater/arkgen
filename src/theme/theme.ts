import { PaletteMode, Theme } from "@mui/material";
import { createTheme } from "@mui/material/styles";

export const getTheme = (mode: PaletteMode): Theme =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "light" ? "#007bff" : "#90caf9",
      },
      secondary: {
        main: mode === "light" ? "#f0f0f0" : "#424242",
      },
      background: {
        default: mode === "light" ? "#ffffff" : "#121212",
        paper: mode === "light" ? "#f9f9f9" : "#1e1e1e",
      },
      text: {
        primary: mode === "light" ? "#333" : "#fff",
        secondary: mode === "light" ? "#8e8e8e" : "#aaa",
      },
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: "Inter, sans-serif",
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            transition: "background-color 0.3s ease, color 0.3s ease",
          },
          body: {
            transition: "background-color 0.3s ease, color 0.3s ease",
          },
          "#__next": {
            transition: "background-color 0.3s ease, color 0.3s ease",
          },
        },
      },
    },
  });
