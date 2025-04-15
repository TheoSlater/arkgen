import { useState } from "react";
import { getOllamaResponse } from "./ollamaService";
import { SelectChangeEvent } from "@mui/material";

export function useChatInput() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [model, setModel] = useState("llama3");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleModelChange = (e: SelectChangeEvent<string>) => {
    setModel(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      setInput("");
      const newUserMessage = { role: "user", content: input.trim() };
      setMessages((prev) => [...prev, newUserMessage]);

      try {
        const botMessage = await getOllamaResponse(
          [...messages, newUserMessage],
          model
        );
        setMessages((prev) => [...prev, { role: "bot", content: botMessage }]);
      } catch (error) {
        console.error("Error getting response from Ollama:", error);
      }

      setInput("");
    }
  };

  return {
    input,
    messages,
    model,
    handleChange,
    handleSubmit,
    handleModelChange,
  };
}
