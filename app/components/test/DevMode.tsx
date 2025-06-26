"use client";

import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  CircularProgress,
  Tabs,
  Tab,
  useTheme,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Delete } from "@mui/icons-material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { githubLight, atomDark } from "@codesandbox/sandpack-themes";

import { useChatMessages } from "../../hooks/useChatMessages";
import ChatBubble from "../ChatBubble";
import ChatInput from "../ChatInput";
import { Virtuoso } from "react-virtuoso";

type DevModeProps = {
  exitDevMode: () => void;
};

export default function DevMode({ exitDevMode }: DevModeProps) {
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [leftPanelWidth, setLeftPanelWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const theme = useTheme();
  const { messages, isSending, generateCode, cancel, clearMessages } =
    useChatMessages();
  const containerRef = useRef<HTMLDivElement>(null);

  const lastAssistantMessage = [...messages]
    .reverse()
    .find((msg) => msg.role === "assistant");

  const hasGenerated = !!lastAssistantMessage?.content;
  const code =
    lastAssistantMessage?.content ?? "// Awaiting code generation...";

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
  <title>Sandpack Dev</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;

  // Resize handlers for draggable divider
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!isResizing || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      let newWidth = e.clientX - containerRect.left;
      if (newWidth < 300) newWidth = 300; // min width
      if (newWidth > 600) newWidth = 600; // max width
      setLeftPanelWidth(newWidth);
    }

    function onMouseUp() {
      setIsResizing(false);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isResizing]);

  const handleSendInput = async () => {
    if (!prompt.trim()) return;
    await generateCode(prompt.trim());
    setPrompt("");
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        userSelect: isResizing ? "none" : "auto",
        bgcolor: theme.palette.background.default,
      }}
    >
      {/* Left Chat Panel */}
      <Paper
        elevation={4}
        sx={{
          width: leftPanelWidth,
          display: "flex",
          flexDirection: "column",
          borderRight: `1px solid ${theme.palette.divider}`,
          bgcolor: "background.paper",
          p: 2,
          transition: isResizing ? "none" : "width 0.3s ease",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          mb={2}
          sx={{ userSelect: "none" }}
        >
          <IconButton onClick={exitDevMode} size="small" color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ flexGrow: 1, userSelect: "text" }}
          >
            Dev Chat
          </Typography>
          <Tooltip title="Clear Messages">
            <IconButton onClick={clearMessages} size="small" color="error">
              <Delete />
            </IconButton>
          </Tooltip>
          <Tooltip title={isSending ? "Connected: Generating..." : "Idle"}>
            <FiberManualRecordIcon
              sx={{
                fontSize: 14,
                color: isSending
                  ? theme.palette.success.main
                  : theme.palette.text.disabled,
                animation: isSending ? "pulse 2s infinite" : "none",
              }}
            />
          </Tooltip>
        </Box>

        {/* Chat Messages */}
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <Virtuoso
            data={messages}
            style={{ height: "100%" }}
            itemContent={(index, msg) => {
              const isLast = index === messages.length - 1;
              const isStreamingAssistant =
                isLast && msg.role === "assistant" && isSending;

              return (
                <ChatBubble
                  role={msg.role}
                  content={msg.content}
                  isStreaming={isStreamingAssistant}
                />
              );
            }}
            followOutput={isSending}
          />
        </Box>

        {/* Input */}
        <Box mt={1}>
          <ChatInput
            input={prompt}
            setInput={setPrompt}
            onSend={handleSendInput}
            cancel={cancel}
            isProcessing={isSending}
            disabled={isSending}
          />
        </Box>
      </Paper>

      {/* Draggable Divider */}
      <Box
        onMouseDown={() => setIsResizing(true)}
        sx={{
          width: 6,
          cursor: "col-resize",
        }}
      />

      {/* Right Code Panel with Tabs */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          px: 3,
          py: 2,
          boxSizing: "border-box",
        }}
      >
        {/* Tabs with accent underline */}
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: 3,
              bgcolor: theme.palette.primary.main,
              transition: "all 0.3s ease",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: "600",
              fontSize: 16,
              color: theme.palette.text.secondary,
              transition: "color 0.3s ease",
              "&.Mui-selected": {
                color: theme.palette.primary.main,
              },
            },
          }}
          aria-label="Code / Preview tabs"
        >
          <Tab label="Code" value="code" />
          <Tab label="Preview" value="preview" />
        </Tabs>

        {/* Content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            mt: 2,
          }}
        >
          {isSending && !hasGenerated ? (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100%"
              flexDirection="column"
              gap={2}
            >
              <CircularProgress color="primary" />
              <Typography variant="body2" color="text.secondary">
                Generating code...
              </Typography>
            </Box>
          ) : hasGenerated ? (
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
              <SandpackLayout
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  height: "100dvh",
                  borderRadius: 6,
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 8px 24px rgba(0,0,0,0.8)"
                      : "0 8px 24px rgba(0,0,0,0.1)",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    display: activeTab === "code" ? "flex" : "none",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <SandpackCodeEditor
                    style={{
                      flex: 1,
                      fontSize: 14,
                      height: "100%",
                      fontFamily: "Source Code Pro, monospace",
                      borderRadius: 6,
                      boxShadow:
                        theme.palette.mode === "dark"
                          ? "inset 0 0 8px rgba(255,255,255,0.1)"
                          : "inset 0 0 8px rgba(0,0,0,0.05)",
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    display: activeTab === "preview" ? "flex" : "none",
                    borderRadius: 2,
                    overflow: "hidden",
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 0 12px rgba(0, 0, 0, 0.7)"
                        : "0 0 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <SandpackPreview
                    style={{
                      flex: 1,
                      height: "100%",
                      borderRadius: 6,
                    }}
                  />
                </Box>
              </SandpackLayout>
            </SandpackProvider>
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100%"
              flexDirection="column"
              gap={2}
              color="text.secondary"
            >
              <Typography variant="body1">
                Enter a prompt to generate your sandbox.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <style>{`
        @keyframes pulse {
          0% {opacity: 1;}
          50% {opacity: 0.4;}
          100% {opacity: 1;}
        }
      `}</style>
    </Box>
  );
}
