import { useState, useEffect, useCallback } from "react";
import { getOllamaResponse } from "./ollamaService";
import { Message, OllamaModel } from "../types/chat";
import { SelectChangeEvent } from "@mui/material";

export function useChatInput() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [model, setModel] = useState<OllamaModel>("llama2");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState("");

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  const handleStreamingContent = useCallback((content: string) => {
    setStreamingContent((prev) => prev + content);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleModelChange = (e: SelectChangeEvent<string>) => {
    setModel(e.target.value as OllamaModel);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setInput("");
    setError(null);
    setIsLoading(true);
    setStreamingContent("");

    const newUserMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const response = await getOllamaResponse(
        [...messages, newUserMessage],
        model,
        true,
        handleStreamingContent
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: response,
          timestamp: Date.now(),
        },
      ]);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setIsLoading(false);
      setStreamingContent("");
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem("chatHistory");
  };

  return {
    input,
    messages,
    model,
    isLoading,
    error,
    streamingContent,
    handleChange,
    handleSubmit,
    handleModelChange,
    clearHistory,
  };
}
