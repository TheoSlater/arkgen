import { Box, Paper, InputBase, IconButton, Tooltip } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { AttachFile, Mic } from "@mui/icons-material";
import React, { useRef } from "react";

interface ChatInputProps {
  input: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ChatInput({
  input,
  handleChange,
  handleSubmit,
  handleFileUpload,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <Box sx={{ width: "100%", boxSizing: "border-box" }}>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={3}
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          borderRadius: "16px",
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 4px 12px rgba(0,0,0,0.3)"
                : "0 4px 12px rgba(0,0,0,0.1)",
          },
        }}
      >
        <InputBase
          sx={{
            flex: 1,
            "& input": {
              typography: "body1",
              p: 0.5,
              transition: "all 0.2s ease",
            },
          }}
          placeholder="Ask anything... (Shift+Enter for new line)"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          multiline
          maxRows={4}
        />
        <Tooltip title="Voice Input">
          <IconButton type="button" disabled>
            <Mic />
          </IconButton>
        </Tooltip>
        {/* doesnt work with Ollama atm */}
        <Tooltip title="Image upload">
          <IconButton type="button" onClick={handleFileButtonClick} disabled>
            <input
              type="file"
              accept=".txt,.pdf,.docx"
              onChange={handleFileUpload}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <AttachFile />
          </IconButton>
        </Tooltip>
        <IconButton type="submit" disabled={!input}>
          <ArrowUpwardIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}
