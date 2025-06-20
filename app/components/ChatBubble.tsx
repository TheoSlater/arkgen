"use client";

import { Box, useTheme } from "@mui/material";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBubble({ role, content }: ChatBubbleProps) {
  const theme = useTheme();
  const isUser = role === "user";

  return (
    <Box
      sx={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        bgcolor: isUser
          ? theme.palette.mode === "dark"
            ? "rgba(121, 255, 225, 0.12)"
            : theme.palette.primary.light
          : theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.06)"
          : "#f0f0f0",
        px: 2,
        py: 1,
        borderRadius: theme.shape.borderRadius,
        border: isUser
          ? theme.palette.mode === "dark"
            ? "1px solid rgba(121, 255, 225, 0.2)"
            : "none"
          : theme.palette.mode === "dark"
          ? "1px solid rgba(255, 255, 255, 0.1)"
          : "none",
        maxWidth: "70%",
        wordBreak: "break-word",
        boxShadow: 2,
      }}
    >
      {content}
    </Box>
  );
}
