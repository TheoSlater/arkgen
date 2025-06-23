import { useRef, useState, useCallback } from "react";
import { ChatMessage } from "../types/types";
import { useModel } from "../context/ModelContext";

export function useChatMessages() {
  const { model } = useModel();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

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
            messages: [...messages, userMsg], // note: messages may be stale
            model,
          }),
        });

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let assistantText = "";

        while (!done) {
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
      } catch (error) {
        console.error("Streaming error:", error);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "[Error receiving response]",
          };
          return updated;
        });
      } finally {
        setIsSending(false);
      }
    },
    [model, messages, scrollToBottom]
  );

  const handleWebSearchAndSummarize = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      const userMsg: ChatMessage = { role: "user", content: query };
      setMessages((prev) => [...prev, userMsg]);
      scrollToBottom();
      setIsSending(true);

      try {
        const res = await fetch("/api/searchAndSummarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, model }),
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
            : JSON.stringify(data.summary, null, 2); // fallback for object or array

        const aiMsg: ChatMessage = { role: "assistant", content: summary };
        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        console.error("❗ Search+Summarize error:", err);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "⚠️ Error during search and summarization.",
          },
        ]);
      } finally {
        scrollToBottom();
        setIsSending(false);
      }
    },
    [model, scrollToBottom]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isSending,
    sendMessage,
    handleWebSearchAndSummarize,
    clearMessages,
    messagesEndRef,
  };
}
