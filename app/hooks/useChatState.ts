import { useState, useEffect } from 'react';
import { chatStorageService } from '../lib/chatStorageService';
import { ChatSession, ChatMessage } from '../types/chat';

export function useChatState() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedModel, setSelectedModel] = useState('N/A');
  const [error, setError] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    const sessions = chatStorageService.loadChatSessions();
    setChatSessions(sessions);
    const storedModel = chatStorageService.loadSelectedModel();
    setSelectedModel(storedModel);

    const lastActiveChat = chatStorageService.loadActiveChatId();
    if (lastActiveChat) {
      setActiveChatId(lastActiveChat);
      const activeChat = chatStorageService.findChatById(lastActiveChat);
      if (activeChat) {
        setMessages(activeChat.messages);
        if (activeChat.modelId) {
          setSelectedModel(activeChat.modelId);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (activeChatId && messages.length > 0) {
      chatStorageService.updateChat(activeChatId, { messages });
    }
  }, [messages, activeChatId]);

  useEffect(() => {
    chatStorageService.saveSelectedModel(selectedModel);
    if (activeChatId) {
      chatStorageService.updateChat(activeChatId, { modelId: selectedModel });
    }
  }, [selectedModel, activeChatId]);

  const generateChatTitle = (firstMessage: string) => {
    const words = firstMessage.split(' ');
    const shortTitle = words.slice(0, 3).join(' ');
    return shortTitle.length < 20 
      ? shortTitle + (words.length > 3 ? '...' : '') 
      : shortTitle.substring(0, 20) + '...';
  };

  return {
    messages,
    setMessages,
    selectedModel,
    setSelectedModel,
    error,
    setError,
    chatSessions,
    setChatSessions,
    activeChatId,
    setActiveChatId,
    generateChatTitle,
  };
}
