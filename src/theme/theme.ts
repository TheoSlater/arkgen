import { createTheme } from "@mui/material/styles";

export const getTheme = () =>
  createTheme({
    palette: {
      mode: "light", // TODO: THEME SWITCHING. (dark/light)
      primary: {
        main: "#007bff",
      },
      secondary: {
        main: "#f0f0f0",
      },
      background: {
        default: "#ffffff",
        paper: "#f9f9f9",
      },
      text: {
        primary: "#333",
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
