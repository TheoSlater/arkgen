"use client";

import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import ChatArea from "./components/ChatArea";
import { useChat } from "./context/ChatMessagesContext";

export default function Home() {
  const { clearMessages } = useChat();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      <Navbar onNewChat={clearMessages} />
      <Box sx={{ flex: 1, minHeight: 0, mt: 2 }}>
        <ChatArea />
      </Box>
    </Box>
  );
}
