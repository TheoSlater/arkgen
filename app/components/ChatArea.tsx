"use client";

import { useState, useRef } from "react";
import { Box, Paper, Typography, Button, useTheme } from "@mui/material";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
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
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { model } = useModel();
  const [input, setInput] = useState("");

  const scrollToBottom = () =>
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);

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

  const handleWebSearchAndSummarize = async (query: string) => {
    console.log("🚀 Sending query for search+summarize:", { query });

    const userMsg: ChatMessage = { role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    scrollToBottom();

    setIsSending(true);

    try {
      const res = await fetch("/api/searchAndSummarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, model }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("❌ Search+Summarize failed:", err);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "⚠️ Failed to summarize search results.",
          },
        ]);
        return;
      }

      const data = await res.json();
      console.log("📝 Search summary:", data.summary);

      const aiMsg: ChatMessage = { role: "assistant", content: data.summary };
      setMessages((prev) => [...prev, aiMsg]);
      scrollToBottom();
    } catch (err) {
      console.error("❗ Search+Summarize error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Error during search and summarization.",
        },
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
          <Box
            key={idx}
            sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
          >
            <ChatBubble role={msg.role} content={msg.content} />

            {msg.role === "user" && (
              <Button
                variant="outlined"
                size="small"
                sx={{ alignSelf: "flex-start", ml: 6 }}
                onClick={() => handleWebSearchAndSummarize(msg.content)}
                disabled={isSending}
              >
                🔎 Search & Summarize
              </Button>
            )}
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

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
