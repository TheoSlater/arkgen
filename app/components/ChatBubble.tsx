import { Box, useTheme } from "@mui/material";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export default function ChatBubble({
  role,
  content,
  isStreaming,
}: ChatBubbleProps) {
  const theme = useTheme();
  const isUser = role === "user";

  // Dynamic styles based on theme and role
  const backgroundColor = isUser
    ? theme.palette.mode === "dark"
      ? theme.palette.primary.light + "20"
      : theme.palette.primary.light
    : theme.palette.mode === "dark"
    ? "rgba(255, 255, 255, 0.06)"
    : theme.palette.background.paper;

  const borderColor = isUser
    ? theme.palette.mode === "dark"
      ? theme.palette.primary.light + "33"
      : "transparent"
    : theme.palette.mode === "dark"
    ? "rgba(255, 255, 255, 0.1)"
    : "transparent";

  return (
    <Box
      sx={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        bgcolor: backgroundColor,
        px: 2,
        py: 1,
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${borderColor}`,
        maxWidth: "70%",
        wordBreak: "break-word",
        boxShadow: 2,
        fontStyle: isStreaming ? "italic" : "normal",
        opacity: isStreaming ? 0.8 : 1,
      }}
    >
      {content}
      {isStreaming && <span style={{ opacity: 0.5 }}></span>}
    </Box>
  );
}
