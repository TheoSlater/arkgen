"use client";
import { Box, Stack } from "@mui/material";
import Navbar from "./components/Navbar";
import ChatArea from "./components/ChatArea";

export default function Home() {
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
        <Navbar />
        <ChatArea />
      </Stack>
    </Box>
  );
}
