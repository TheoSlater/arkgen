"use client";
import { Box } from "@mui/material";
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
        height: "100vh", // full screen height
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      <Navbar onNewChat={() => setMessages([])} />

      <Box sx={{ flex: 1, minHeight: 0, mt: 2 }}>
        <ChatArea messages={messages} setMessages={setMessages} />
      </Box>
    </Box>
  );
}
