import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { getTheme } from "./theme/theme.ts"; // Import the getTheme function

const theme = getTheme(); // Generate the theme here

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      {" "}
      {/* Pass the theme directly */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);
