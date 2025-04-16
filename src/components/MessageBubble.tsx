import { Box, Typography } from "@mui/material";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageBubbleProps {
  message: { role: string; content: string };
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
        p: 1.5,
        backgroundColor: isUser ? "primary.main" : "secondary.main",
        color: isUser ? "primary.contrastText" : "text.primary",
        borderRadius: "12px",
        boxShadow: 1,
        "& pre": {
          m: 0,
          whiteSpace: "pre-wrap",
          fontFamily: "inherit",
        },
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {message.content}
      </ReactMarkdown>
    </Box>
  );
}
