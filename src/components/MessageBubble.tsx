import { Box, Typography } from "@mui/material";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageBubbleProps {
  message: {
    role: string;
    content: string;
    timestamp?: number;
  };
}

const components: Components = {
  a: ({ href, children, ...props }) => (
    <a href={href} {...props} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  h1: ({ children, ...props }) => (
    <Typography variant="h4" gutterBottom {...props}>
      {children}
    </Typography>
  ),
  h2: ({ children, ...props }) => (
    <Typography variant="h5" gutterBottom {...props}>
      {children}
    </Typography>
  ),
  h3: ({ children, ...props }) => (
    <Typography variant="h6" gutterBottom {...props}>
      {children}
    </Typography>
  ),
  h4: ({ children, ...props }) => (
    <Typography variant="subtitle1" gutterBottom {...props}>
      {children}
    </Typography>
  ),
  h5: ({ children, ...props }) => (
    <Typography variant="subtitle2" gutterBottom {...props}>
      {children}
    </Typography>
  ),
  h6: ({ children, ...props }) => (
    <Typography variant="body1" gutterBottom {...props}>
      {children}
    </Typography>
  ),
  p: ({ children, ...props }) => (
    <Typography variant="body1" paragraph {...props}>
      {children}
    </Typography>
  ),
  code: ({
    inline,
    className,
    children,
    ...props
  }: {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
  }) =>
    inline ? (
      <code
        style={{
          backgroundColor: "#eee",
          padding: "2px 4px",
          borderRadius: "4px",
        }}
        {...props}
      >
        {children}
      </code>
    ) : (
      <pre
        style={{
          backgroundColor: "#eee",
          padding: "8px",
          borderRadius: "4px",
          overflow: "auto",
        }}
        {...props}
      >
        <code className={className}>{children}</code>
      </pre>
    ),
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <Box
      sx={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        maxWidth: "75%",
        width: "fit-content",
        p: 1.5,
        backgroundColor: (theme) =>
          isUser
            ? theme.palette.primary.main
            : theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.04)",
        color: isUser ? "primary.contrastText" : "text.primary",
        borderRadius: () =>
          isUser ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 2px 8px rgba(0,0,0,0.3)"
            : "0 2px 8px rgba(0,0,0,0.1)",
        position: "relative",
        transition: "all 0.2s ease",
        "& pre": {
          m: 0,
          p: 1.5,
          borderRadius: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(0,0,0,0.3)"
              : "rgba(0,0,0,0.04)",
          whiteSpace: "pre-wrap",
          fontFamily: "monospace",
        },
        "& p": {
          lineHeight: 1.4,
          m: 0,
          "&:not(:last-child)": {
            mb: 0.5,
          },
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.25 }}>
        <Box
          sx={{
            typography: "caption",
            color: isUser ? "primary.contrastText" : "text.secondary",
            opacity: 0.8,
          }}
        >
          {isUser ? "You" : "Assistant"}
        </Box>
        {message.timestamp && (
          <Box
            sx={{
              typography: "caption",
              color: isUser ? "primary.contrastText" : "text.secondary",
              opacity: 0.6,
            }}
          >
            {new Date(message.timestamp).toLocaleTimeString()}
          </Box>
        )}
      </Box>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {message.content}
      </ReactMarkdown>
    </Box>
  );
}
