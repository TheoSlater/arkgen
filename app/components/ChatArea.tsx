// components/ChatArea.tsx

"use client";

import { useState, useRef } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatBubble from "./ChatBubble";
import { useModel } from "../context/ModelContext";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatAreaProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function ChatArea({ messages, setMessages }: ChatAreaProps) {
  const theme = useTheme();
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { model } = useModel();

  const scrollToBottom = () =>
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    scrollToBottom();
    setIsSending(true);

    try {
      const res = await fetch("/api/ollama", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          model,
        }),
      });

      const data = await res.json();

      if (data.error) throw new Error(data.error);

      const aiMsg: ChatMessage = { role: "assistant", content: data.content };
      setMessages((prev) => [...prev, aiMsg]);
      scrollToBottom();
    } catch (err) {
      console.error("Error contacting AI backend:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error contacting AI backend." },
      ]);
      scrollToBottom();
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: Number(theme.shape.borderRadius) * 2,
        display: "flex",
        flexDirection: "column",
        flex: 1,
        p: 2,
        height: "100%",
        bgcolor: "background.default",
        overflow: "hidden",
        boxShadow: `0 2px 20px rgba(0,0,0,${
          theme.palette.mode === "dark" ? 0.3 : 0.05
        })`,
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          mb: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          pr: 1,
        }}
      >
        {messages.map((msg, idx) => (
          <ChatBubble key={idx} role={msg.role} content={msg.content} />
        ))}
        <div ref={messagesEndRef} />
      </Box>

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
          placeholder="Ask me anything..."
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          InputProps={{ disableUnderline: true }}
          sx={{ flex: 1, mr: 2, fontSize: "1rem" }}
        />
        <Button
          variant="text"
          disableElevation
          endIcon={<SendIcon />}
          onClick={sendMessage}
          disabled={isSending}
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
      <Typography
        fontSize={12}
        textAlign="center"
        mt="15px"
        color="text.secondary"
      >
        Powered by AI. Generated content may be false or inaccurate.
      </Typography>
    </Paper>
  );
}
