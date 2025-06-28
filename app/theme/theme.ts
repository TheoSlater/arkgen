// theme.ts
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const shape = {
  borderRadius: "10px",
};

const typography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: 14,
  button: {
    textTransform: "none" as const,
    fontWeight: 500,
    fontSize: "0.875rem",
  },
  h1: { fontWeight: 600, fontSize: "2.25rem" },
  h2: { fontWeight: 600, fontSize: "1.75rem" },
  h3: { fontWeight: 600, fontSize: "1.5rem" },
  h4: { fontWeight: 600, fontSize: "1.25rem" },
  h5: { fontWeight: 600, fontSize: "1.125rem" },
  h6: { fontWeight: 600, fontSize: "1rem" },
};

const commonOverrides = {
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          transition: "background-color 0.25s ease, color 0.25s ease",
          cursor: "default",
        },
        "*": {
          boxSizing: "border-box",
        },
        html: {
          scrollBehavior: "smooth",
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 3,
      },
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius,
          backgroundImage: "none",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius,
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#79ffe1",
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "0.75rem",
          borderRadius: 8,
        },
      },
    },
  },
};

// ---------------------------
// DARK THEME
// ---------------------------
export const darkTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#79ffe1", // neon aqua
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
      divider: "rgba(255, 255, 255, 0.12)",
      error: {
        main: red.A200,
      },
    },
    shape,
    typography,
    ...commonOverrides,
  })
);

// ---------------------------
// LIGHT THEME
// ---------------------------
export const lightTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#00bfae", // muted aqua
        light: "#33d6c9",
        dark: "#008e7e",
        contrastText: "#fff",
      },
      secondary: {
        main: "#e91e63", // bright pink
      },
      background: {
        default: "#f1f1f1",
        paper: "#ffffff",
      },
      text: {
        primary: "#121212",
        secondary: "#555555",
      },
      divider: "rgba(0, 0, 0, 0.12)",
      error: {
        main: red.A400,
      },
    },
    shape,
    typography,
    ...commonOverrides,
  })
);
