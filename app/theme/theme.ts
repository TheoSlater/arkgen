// theme.ts
import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0070f3",
    },
    secondary: {
      main: "#7928ca",
    },
    error: {
      main: red.A400,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#79ffe1",
    },
    secondary: {
      main: "#ff0080",
    },
    error: {
      main: red.A200,
    },
  },
  shape: {
    borderRadius: 12,
  },
});
