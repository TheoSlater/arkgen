"use client";

import { useState } from "react";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";

import { useChatCommands } from "../hooks/useChatCommands";
import { useChat } from "../context/ChatMessagesContext";

import { Virtuoso } from "react-virtuoso";

export default function ChatArea() {
  const theme = useTheme();
  const {
    messages,
    isSending,
    sendMessage,
    handleWebSearchAndSummarize,
    // messagesEndRef, // might not be needed anymore, see below
  } = useChat();

  const [input, setInput] = useState("");

  const { parseCommand } = useChatCommands({
    search: {
      name: "search",
      description: "Search the web and summarize the results",
      run: handleWebSearchAndSummarize,
    },
  });

  const handleSendInput = async (content: string) => {
    if (!content.trim()) return;

    const isCommand = await parseCommand(content);
    if (isCommand) {
      setInput("");
      return;
    }

    await sendMessage(content);
    setInput("");
  };

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        p: 2,
        height: "100%",
        bgcolor: "background.default",
        overflow: "hidden",
        scrollBehavior: "smooth",
        boxShadow: `0 2px 20px rgba(0,0,0,${
          theme.palette.mode === "dark" ? 0.3 : 0.05
        })`,
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflow: "hidden", // Virtuoso handles scroll internally
          mb: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          pr: 1,
        }}
      >
        <Virtuoso
          style={{ height: "100%", width: "100%" }}
          data={messages}
          itemContent={(index, msg) => {
            const isLast = index === messages.length - 1;
            const isStreamingAssistant =
              isLast && msg.role === "assistant" && isSending;

            return (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                key={index}
              >
                <ChatBubble
                  role={msg.role}
                  content={msg.content}
                  isStreaming={isStreamingAssistant}
                />
              </Box>
            );
          }}
          followOutput={true} // auto scroll only if already at bottom
        />
      </Box>

      <ChatInput
        input={input}
        setInput={setInput}
        onSend={handleSendInput}
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
