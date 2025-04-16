export interface Message {
  role: "user" | "bot" | "system";
  content: string;
  timestamp?: number;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export type OllamaModel =
  | "llama2"
  | "llama3"
  | "llama3.1"
  | "llama3.2"
  | "mistral";
