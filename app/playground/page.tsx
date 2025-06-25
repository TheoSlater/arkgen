// !!! CAUTION !!!
// This is the playground page. ALPHA / BETA FEATURES HERE
// Change this to however you want if you have experience !!! CAUTION !!!
// credit - theoslater.xyz
"use client";

import { Box } from "@mui/material";
import Navbar from "../components/Navbar";

import { useChat } from "../context/ChatMessagesContext";

import ChatArea from "../components/test/ChatArea_TEST";

export default function Home() {
  const { clearMessages } = useChat();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        p: 2,
        boxSizing: "border-box",
      }}
    >
      <Navbar onNewChat={clearMessages} />
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          mt: 2,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <ChatArea />
      </Box>
    </Box>
  );
}
