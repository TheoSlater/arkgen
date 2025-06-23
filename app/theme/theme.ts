// theme.ts
import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const shape = {
  borderRadius: "12px",
};

const typography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: 14,
  button: {
    textTransform: "none" as const,
    fontWeight: 500,
  },
};

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#79ffe1", // bright aqua
      light: "#a3fff3",
      dark: "#4ac1bb",
      contrastText: "#000",
    },
    secondary: {
      main: "#ff0080", // neon pink
    },
    background: {
      default: "#0d0d0d",
      paper: "#121212",
    },
    text: {
      primary: "#e0e0e0",
      secondary: "#aaaaaa",
    },
    error: {
      main: red.A200,
    },
    divider: "rgba(255, 255, 255, 0.12)",
  },
  shape,
  typography,
});
