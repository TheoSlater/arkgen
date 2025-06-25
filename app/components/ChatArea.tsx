// This is the main container where all the messages and inputs go.
// Modify this to your liking if you have experience. !!! CAUTION !!!
// credit - theoslater.xyz

"use client";

import { useState } from "react";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { useChatCommands } from "../hooks/useChatCommands";
import { useChat } from "../context/ChatMessagesContext";

import { Virtuoso } from "react-virtuoso";

import { TextShimmer } from "@/components/ui/text-shimmer";
import { GlowEffect } from "@/components/ui/glow-effect";

export default function ChatArea() {
  const theme = useTheme();

  const {
    messages,
    isSending,
    isSearching,
    sendMessage,
    cancel,
    handleWebSearchAndSummarize,
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
        bgcolor: "background.paper",
        overflow: "hidden",
        boxShadow: `0 2px 20px rgba(0,0,0,${
          theme.palette.mode === "dark" ? 0.3 : 0.05
        })`,
      }}
    >
      {/* This box fills all vertical space between input and top */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0, // important to allow flex children to shrink properly
          display: "flex",
          flexDirection: "column",
          justifyContent: messages.length === 0 ? "center" : "flex-start",
          overflow: "hidden",
          mb: 2,
          pr: 1,
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              maxWidth: 450,
              mx: "auto",
              textAlign: "center",
              px: 2,
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            {/* Icon + Glow wrapper */}
            <Box
              sx={{
                position: "relative",
                width: 64,
                height: 64,
                mx: "auto",
                mb: 1,
              }}
            >
              <GlowEffect
                colors={["#0062FF", "#5A3DD1", "#9B6CFB", "#D75CF6"]}
                mode="rotate"
                blur="strong"
                style={{
                  position: "absolute",
                  top: -1,
                  left: 0,
                  right: 2,
                  width: 68,
                  height: 68,
                  borderRadius: "12px",
                  zIndex: 0,
                }}
              />
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  background:
                    "linear-gradient(135deg,rgb(0, 98, 255) 0%,rgb(215, 92, 246) 100%)",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 1,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <AutoAwesomeIcon
                  sx={{ color: "white", fontSize: { xs: 28, sm: 32 } }}
                />
              </Box>
            </Box>

            <Typography
              variant="h4"
              sx={{
                mt: 0.5,
                fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
              }}
            >
              Welcome to Arkgen
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mt: 0.5,
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                maxWidth: 380,
                mx: "auto",
                px: { xs: 1, sm: 0 },
              }}
            >
              Start a conversation and experience intelligent responses with a
              beautiful, modern interface.
            </Typography>
          </Box>
        ) : (
          <Virtuoso
            style={{ height: "100%", width: "100%" }}
            data={messages}
            itemContent={(index, msg) => {
              const isLast = index === messages.length - 1;
              const isStreamingAssistant =
                isLast &&
                msg.role === "assistant" &&
                (isSending || isSearching);

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
            followOutput={isSending || isSearching}
          />
        )}
      </Box>

      {isSearching && (
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <TextShimmer duration={1.5}>Searching the web...</TextShimmer>
        </Box>
      )}

      <ChatInput
        input={input}
        setInput={setInput}
        onSend={handleSendInput}
        cancel={cancel}
        isProcessing={isSending || isSearching}
        disabled={isSending || isSearching}
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
