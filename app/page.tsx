"use client";
import { Box, Stack } from "@mui/material";
import Navbar from "./components/Navbar";
import ChatArea from "./components/ChatArea";
import { useState } from "react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      <Stack
        direction="column"
        spacing={2}
        sx={{ flex: 1, display: "flex", minHeight: 0 }}
      >
        <Navbar onNewChat={() => setMessages([])} />
        <ChatArea messages={messages} setMessages={setMessages} />
      </Stack>
    </Box>
  );
}
