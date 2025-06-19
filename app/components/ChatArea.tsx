// components/ChatArea.tsx

"use client";

import { useState, useRef } from "react";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import { useModel } from "../context/ModelContext";
import ChatTemplates from "./ChatTemplates";

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
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { model } = useModel();
  const [input, setInput] = useState("");

  const scrollToBottom = () =>
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);

  const handleSelectTemplate = (templateText: string) => {
    setInput(templateText);
  };

  const sendMessage = async (content: string) => {
    const userMsg: ChatMessage = { role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
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

      <ChatTemplates onSelectTemplate={handleSelectTemplate} />
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={sendMessage}
        disabled={isSending}
      />
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
