import { useRef, useState, useCallback, useEffect } from "react";
import { ChatMessage } from "../types/types";
import { useModel } from "../context/ModelContext";

const STORAGE_KEY = "chat_messages";

export function useChatMessages() {
  const { model } = useModel();

  // Initialize messages from localStorage (if any)
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored) as ChatMessage[];
    } catch (e) {
      console.warn("Failed to parse chat messages from localStorage", e);
      return [];
    }
  });

  const [isSending, setIsSending] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);

  // Keep the messagesRef current
  useEffect(() => {
    messagesRef.current = messages;
    // Persist messages on every change
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error("Failed to save chat messages to localStorage", e);
    }
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const userMsg: ChatMessage = { role: "user", content };
      setMessages((prev) => [...prev, userMsg]);
      scrollToBottom();
      setIsSending(true);

      try {
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        const response = await fetch("/api/ollama", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messagesRef.current, userMsg],
            model,
          }),
          signal: controller.signal,
        });

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let done = false;
        let assistantText = "";

        while (!done) {
          if (controller.signal.aborted) {
            await reader.cancel();
            throw new DOMException("Aborted", "AbortError");
          }

          const { value, done: doneReading } = await reader.read();
          done = doneReading;

          if (value) {
            assistantText += decoder.decode(value, { stream: true });
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                content: assistantText,
              };
              return updated;
            });
            scrollToBottom();
          }
        }
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "name" in error &&
          (error as { name?: string }).name === "AbortError"
        ) {
          console.log("sendMessage aborted");
          setMessages((prev) => {
            const updated = [...prev];
            if (
              updated.length > 0 &&
              updated[updated.length - 1].role === "assistant"
            ) {
              updated.pop();
            }
            return updated;
          });
        } else {
          console.error("Streaming error:", error);
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: "[Error receiving response]",
            };
            return updated;
          });
        }
      } finally {
        setIsSending(false);
        abortControllerRef.current = null;
      }
    },
    [model, scrollToBottom]
  );

  const handleWebSearchAndSummarize = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsSearching(true);

      const userMsg: ChatMessage = { role: "user", content: query };
      setMessages((prev) => [...prev, userMsg]);
      scrollToBottom();

      setIsSending(true);

      try {
        const res = await fetch("/api/searchAndSummarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, model }),
          signal: controller.signal,
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
        const summary =
          typeof data.summary === "string"
            ? data.summary
            : JSON.stringify(data.summary, null, 2);

        const aiMsg: ChatMessage = { role: "assistant", content: summary };
        setMessages((prev) => [...prev, aiMsg]);
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "name" in error &&
          (error as { name?: string }).name === "AbortError"
        ) {
          console.log("handleWebSearchAndSummarize aborted");
          setMessages((prev) => {
            const updated = [...prev];
            if (
              updated.length > 0 &&
              updated[updated.length - 1].role === "assistant"
            ) {
              updated.pop();
            }
            return updated;
          });
        } else {
          console.error("❗ Search+Summarize error:", error);
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "⚠️ Error during search and summarization.",
            },
          ]);
        }
      } finally {
        scrollToBottom();
        setIsSending(false);
        setIsSearching(false);
        abortControllerRef.current = null;
      }
    },
    [model, scrollToBottom]
  );

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsSending(false);
      setIsSearching(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear chat messages from localStorage", e);
    }
  }, []);

  function extractCodeFromMarkdown(text: string): string {
    const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/g;
    let match;
    let code = "";

    while ((match = codeBlockRegex.exec(text)) !== null) {
      code += match[1] + "\n";
    }

    if (code) return code.trim();
    return text.trim();
  }

  const generateCode = useCallback(
    async (prompt: string) => {
      if (!prompt.trim()) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const userMsg: ChatMessage = { role: "user", content: prompt };
      setMessages((prev) => [...prev, userMsg]);
      scrollToBottom();
      setIsSending(true);

      try {
        // Add an empty assistant message to be updated incrementally
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        const systemPrompt = {
          role: "system",
          content: [
            "You are a helpful AI developer assistant.",
            "Respond ONLY with clean, runnable React code in TypeScript using Material UI.",
            "Explicitly import every MUI component used, with one import per component like:",
            'import Button from "@mui/material/Button";',
            'import Container from "@mui/material/Container";',
            'import Typography from "@mui/material/Typography";',
            "Do NOT include explanations, comments, markdown syntax, or triple backticks.",
            "Do NOT wrap the code in markdown or any additional formatting.",
            "Output only the raw source code exactly as it should appear in a .tsx file.",
          ].join(" "),
        };

        // Compose messages including system prompt + history + new prompt
        const payloadMessages = [systemPrompt, ...messagesRef.current, userMsg];

        const response = await fetch("/api/ollama", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: payloadMessages,
            model,
          }),
          signal: controller.signal,
        });

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let done = false;
        let assistantText = "";

        while (!done) {
          if (controller.signal.aborted) {
            await reader.cancel();
            throw new DOMException("Aborted", "AbortError");
          }

          const { value, done: doneReading } = await reader.read();
          done = doneReading;

          if (value) {
            assistantText += decoder.decode(value, { stream: true });

            const codeOnly = extractCodeFromMarkdown(assistantText);

            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                content: codeOnly,
              };
              return updated;
            });
            scrollToBottom();
          }
        }
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "name" in error &&
          (error as { name?: string }).name === "AbortError"
        ) {
          console.log("generateCode aborted");
          setMessages((prev) => {
            const updated = [...prev];
            if (
              updated.length > 0 &&
              updated[updated.length - 1].role === "assistant"
            ) {
              updated.pop();
            }
            return updated;
          });
        } else {
          console.error("generateCode streaming error:", error);
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: "[Error receiving code response]",
            };
            return updated;
          });
        }
      } finally {
        setIsSending(false);
        abortControllerRef.current = null;
      }
    },
    [model, scrollToBottom]
  );

  return {
    messages,
    isSending,
    isSearching,
    sendMessage,
    handleWebSearchAndSummarize,
    clearMessages,
    cancel,
    messagesEndRef,
    generateCode,
  };
}
