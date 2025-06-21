"use client";

import { useState } from "react";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import { useChatMessages } from "../hooks/useChatMessages";
import { useChatCommands } from "../hooks/useChatCommands";
import { ChatMessage } from "../types/types";

interface ChatAreaProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function ChatArea({ messages, setMessages }: ChatAreaProps) {
  const theme = useTheme();
  const [input, setInput] = useState("");

  const {
    isSending,
    sendMessage,
    handleWebSearchAndSummarize,
    messagesEndRef,
  } = useChatMessages(messages, setMessages);

  const { parseCommand } = useChatCommands({
    search: {
      name: "search",
      description: "Search the web and summarize the results",
      run: handleWebSearchAndSummarize,
    },
  });

  const handleSendInput = async (content: string) => {
    const isCommand = await parseCommand(content);
    if (!isCommand) {
      await sendMessage(content);
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
          </Box>
        ))}
        <div ref={messagesEndRef} />
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
