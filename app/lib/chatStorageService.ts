// lib/chatStorageService.ts
import { ChatSession, ChatMessage } from '../types/chat';

const STORAGE_KEYS = {
  CHAT_SESSIONS: 'chatSessions',
  ACTIVE_CHAT_ID: 'activeChatId',
  SELECTED_MODEL: 'selectedModel'
};

export const chatStorageService = {
  // Load all chat sessions from localStorage
  loadChatSessions(): ChatSession[] {
    const storedSessions = localStorage.getItem(STORAGE_KEYS.CHAT_SESSIONS);
    return storedSessions ? JSON.parse(storedSessions) : [];
  },

  // Save all chat sessions to localStorage
  saveChatSessions(sessions: ChatSession[]): void {
    localStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(sessions));
  },

  // Load active chat ID from localStorage
  loadActiveChatId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_CHAT_ID);
  },

  // Save active chat ID to localStorage
  saveActiveChatId(chatId: string | null): void {
    if (chatId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CHAT_ID, chatId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_CHAT_ID);
    }
  },

  // Load selected AI model from localStorage
  loadSelectedModel(): string {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL) || 'N/A';
  },

  // Save selected AI model to localStorage
  saveSelectedModel(model: string): void {
    localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL, model);
  },

  // Find a chat session by ID
  findChatById(chatId: string): ChatSession | undefined {
    const sessions = this.loadChatSessions();
    return sessions.find(chat => chat.id === chatId);
  },

  // Create a new chat session
  createChat(title: string, initialMessages: ChatMessage[] = [], selectedModel: string): ChatSession {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title,
      messages: initialMessages,
      createdAt: Date.now(),
      modelId: selectedModel  // changed to use parameter
    };

    const sessions = this.loadChatSessions();
    sessions.unshift(newChat);
    this.saveChatSessions(sessions);
    return newChat;
  },

  // Update an existing chat session
  updateChat(chatId: string, updates: Partial<ChatSession>): ChatSession | null {
    const sessions = this.loadChatSessions();
    const index = sessions.findIndex(chat => chat.id === chatId);
    
    if (index === -1) return null;
    
    const updatedChat = { ...sessions[index], ...updates };
    sessions[index] = updatedChat;
    this.saveChatSessions(sessions);
    return updatedChat;
  },

  // Delete a chat session
  deleteChat(chatId: string): boolean {
    const sessions = this.loadChatSessions();
    const filteredSessions = sessions.filter(chat => chat.id !== chatId);
    
    if (filteredSessions.length === sessions.length) return false;
    
    this.saveChatSessions(filteredSessions);
    return true;
  }
};