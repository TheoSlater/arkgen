"use client";

import { useTheme } from "@mui/material";
import { Box, TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  input: string;
  setInput: (value: string) => void;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  input,
  setInput,
  disabled,
}: ChatInputProps) {
  const theme = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isProcessing) return;

    setIsProcessing(true);
    try {
      await onSend(trimmed);
      setInput("");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        borderRadius: Number(theme.shape.borderRadius) * 2,
        bgcolor:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 0, 0, 0.03)",
        border:
          theme.palette.mode === "dark"
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(0,0,0,0.08)",
        px: 2,
        py: 1.5,
      }}
    >
      <TextField
        multiline
        minRows={1}
        maxRows={4}
        variant="standard"
        placeholder='Ask me anything... or try /search "..."'
        fullWidth
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        InputProps={{ disableUnderline: true }}
        sx={{ flex: 1, mr: 2, fontSize: "1rem" }}
        disabled={disabled || isProcessing}
      />
      <Button
        variant="text"
        disableElevation
        endIcon={<SendIcon />}
        onClick={handleSend}
        disabled={disabled || isProcessing}
        sx={{
          borderRadius: "18px",
          textTransform: "none",
          px: 3,
          py: 1,
          color: "primary.main",
        }}
      >
        Send
      </Button>
    </Box>
  );
}
