import { useRef, useState } from "react";
import { ChatMessage } from "../types/types";
import { useModel } from "../context/ModelContext";

export function useChatMessages(
  initialMessages: ChatMessage[],
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) {
  const [isSending, setIsSending] = useState(false);
  const { model } = useModel();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const sendMessage = async (content: string) => {
    const userMsg: ChatMessage = { role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    scrollToBottom();
    setIsSending(true);

    try {
      const res = await fetch("/api/ollama", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...initialMessages, userMsg],
          model,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const aiMsg: ChatMessage = { role: "assistant", content: data.content };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Error contacting AI backend:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error contacting AI backend." },
      ]);
    } finally {
      scrollToBottom();
      setIsSending(false);
    }
  };

  const handleWebSearchAndSummarize = async (query: string) => {
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
      const aiMsg: ChatMessage = { role: "assistant", content: data.summary };
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
  };

  return {
    isSending,
    sendMessage,
    handleWebSearchAndSummarize,
    messagesEndRef,
  };
}
