import { Box, Typography, useTheme, Link as MuiLink } from "@mui/material";
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
          h1: ({ ...props }) => (
            <Typography variant="h4" gutterBottom {...props} />
          ),
          h2: ({ ...props }) => (
            <Typography variant="h5" gutterBottom {...props} />
          ),
          h3: ({ ...props }) => (
            <Typography variant="h6" gutterBottom {...props} />
          ),
          p: ({ ...props }) => (
            <Typography variant="body1" paragraph {...props} />
          ),
          a: ({ href, children, ...props }) => (
            <MuiLink
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              color="primary"
              {...props}
            >
              {children}
            </MuiLink>
          ),
          li: ({ ...props }) => (
            <li>
              <Typography variant="body2" component="span" {...props} />
            </li>
          ),
          blockquote: ({ ...props }) => (
            <Box
              component="blockquote"
              sx={{
                borderLeft: `4px solid ${theme.palette.divider}`,
                pl: 2,
                ml: 0,
                color: theme.palette.text.secondary,
                fontStyle: "italic",
              }}
              {...props}
            />
          ),
          code({ style, className, children, ...props }) {
            if (style) {
              return (
                <Box
                  component="code"
                  sx={{
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.05)",
                    px: 0.5,
                    py: 0.2,
                    borderRadius: 1,
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                  }}
                  {...props}
                >
                  {children}
                </Box>
              );
            }
            return (
              <pre>
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}
