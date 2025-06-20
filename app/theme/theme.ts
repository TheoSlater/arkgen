// theme.ts
import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Shared shape and typography
const shape = {
  borderRadius: 3,
};

const typography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: 14,
  button: {
    textTransform: "none" as const,
    fontWeight: 500,
  },
};

// Dark Theme
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#79ffe1", // Bright aqua
    },
    secondary: {
      main: "#ff0080", // Neon pink
    },
    background: {
      default: "#0d0d0d",
      paper: "#121212",
    },
    error: {
      main: red.A200,
    },
  },
  shape,
  typography,
});
