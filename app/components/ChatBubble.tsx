import { Box, Typography, useTheme } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
        mb: 2,
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${borderColor}`,
        maxWidth: "70%",
        wordBreak: "break-word",
        boxShadow: 2,
        fontStyle: isStreaming ? "italic" : "normal",
        opacity: isStreaming ? 0.8 : 1,
        "& pre": {
          backgroundColor:
            theme.palette.mode === "dark" ? "#1e1e1e" : "#f4f4f4",
          padding: "8px",
          borderRadius: "4px",
          overflowX: "auto",
        },
        "& code": {
          fontFamily: "monospace",
        },
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <Typography variant="h4" gutterBottom {...props} />,
          h2: (props) => <Typography variant="h5" gutterBottom {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}
