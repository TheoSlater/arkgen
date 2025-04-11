// types/chat.ts
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
  }
  
  export interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: number;
    modelId: string; // Store which AI model is used for this chat
  }