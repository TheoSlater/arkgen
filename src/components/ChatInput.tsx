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

  return (
    <Box sx={{ width: "100%", boxSizing: "border-box" }}>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          borderRadius: "12px",
        }}
      >
        <InputBase
          sx={{ flex: 1 }}
          placeholder="Ask anything..."
          value={input}
          onChange={handleChange}
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
