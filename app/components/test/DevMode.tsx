"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { githubLight, atomDark } from "@codesandbox/sandpack-themes";
import { useTheme } from "@mui/material/styles";

import { useChatMessages } from "../../hooks/useChatMessages"; // adjust path

type DevModeProps = {
  exitDevMode: () => void;
};

export default function DevMode({ exitDevMode }: DevModeProps) {
  const [prompt, setPrompt] = useState("");
  const theme = useTheme();

  const { messages, isSending, generateCode } = useChatMessages();

  const lastAssistantMessage = [...messages]
    .reverse()
    .find((msg) => msg.role === "assistant");

  // The TS React + MUI example or fallback from AI
  const code =
    lastAssistantMessage?.content ||
    `import * as React from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ padding: 2, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Hello Material UI in Sandpack!
        </Typography>
        <Button variant="contained" color="primary">
          Click Me
        </Button>
      </Container>
    </ThemeProvider>
  );
}
`;

  const indexTsx = `
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
`;

  const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Sandpack Material UI</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    await generateCode(prompt.trim());
  };

  return (
    <Paper
      sx={{
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        overflow: "hidden",
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton onClick={exitDevMode}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          Arkgen Dev Mode
        </Typography>
      </Box>

      <Box
        display="flex"
        gap={1}
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems="stretch"
      >
        <TextField
          variant="outlined"
          label="Prompt"
          fullWidth
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AutoAwesomeIcon />}
          onClick={handleGenerate}
          disabled={isSending}
          sx={{ whiteSpace: "nowrap", minWidth: 120 }}
        >
          {isSending ? "Generating..." : "Generate"}
        </Button>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0 }}>
        <SandpackProvider
          template="react-ts"
          files={{
            "/App.tsx": code,
            "/index.tsx": indexTsx,
            "/index.html": indexHtml,
          }}
          customSetup={{
            dependencies: {
              react: "^18.2.0",
              "react-dom": "^18.2.0",
              "@mui/material": "^5.13.0",
              "@emotion/react": "^11.11.0",
              "@emotion/styled": "^11.11.0",
            },
          }}
          options={{ activeFile: "/App.tsx" }}
          theme={theme.palette.mode === "dark" ? atomDark : githubLight}
        >
          <SandpackLayout style={{ height: 500 }}>
            <SandpackCodeEditor
              showTabs
              style={{ height: "100%", fontSize: 14 }}
            />
            <SandpackPreview style={{ height: "100%" }} />
          </SandpackLayout>
        </SandpackProvider>
      </Box>
    </Paper>
  );
}
