'use client';

import { Box, Typography, Select, MenuItem, Alert, IconButton, SelectChangeEvent } from '@mui/material';
import ChatInput from './components/ChatInput';
import { useState, useEffect } from 'react';
import ThemeToggleButton from './components/ThemeToggleButton';
import { chatWithModel, chatWithPhoto } from './lib/llmService';
import MenuIcon from '@mui/icons-material/Menu';
import ChatDrawer from './components/ChatDrawer';
import { chatStorageService } from './lib/chatStorageService';
import { ChatSession, ChatMessage } from './types/chat';

// Add MODEL_OPTIONS constant
const MODEL_OPTIONS: string[] = ['N/A', 'mistral', 'llama2', 'llava'];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedModel, setSelectedModel] = useState('N/A');
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    // Load chat sessions
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
        // this seets the model for this specific chat if available
        if (activeChat.modelId) {
          setSelectedModel(activeChat.modelId);
        }
      }
    }
  }, []);

  // Update the current chat session whenever messages change
  useEffect(() => {
    if (activeChatId && messages.length > 0) {
      chatStorageService.updateChat(activeChatId, { messages });
    }
  }, [messages, activeChatId]);

  // Save selected model whenever it changes
  useEffect(() => {
    chatStorageService.saveSelectedModel(selectedModel);
    
    // Also update the current chat's model if there is an active chat
    if (activeChatId) {
      chatStorageService.updateChat(activeChatId, { modelId: selectedModel });
    }
  }, [selectedModel, activeChatId]);

  const handleSend = async (message: string, image?: File) => {
    try {
      if (image) {
        // Add the text message if provided
        if (message.trim()) {
          const userTextMessage: ChatMessage = { role: 'user', content: message };
          setMessages(prev => [...prev, userTextMessage]);
        }
        // Also display an image-indicator message
        const userImageMessage: ChatMessage = { role: 'user', content: `[Image: ${image.name}]` };
        setMessages(prev => [...prev, userImageMessage]);
        
        // Call chatWithPhoto using the text as a prompt (or default if empty)
        const response = await chatWithPhoto(selectedModel, [...messages, { role: 'user', content: message }], image, message);
        const assistantMessage: ChatMessage = { role: 'assistant', content: response };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const userMessage: ChatMessage = { role: 'user', content: message };
        setMessages((prev) => [...prev, userMessage]);

        const response = await chatWithModel(selectedModel, [...messages, userMessage]);
        const assistantMessage: ChatMessage = { role: 'assistant', content: response };
        setMessages((prev) => [...prev, assistantMessage]);
      }
      setError(null); // Clear any previous errors
    } catch (err: any) {
      setError(err.message || "An error occurred while communicating with the AI model.");
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const reply = await chatWithPhoto(selectedModel, messages, file);
      const assistantMsg = { role: 'assistant' as const, content: reply };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setError('Error uploading image');
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleCreateChat = (title: string) => {
    const newChat = chatStorageService.createChat(title, []);
    setChatSessions(chatStorageService.loadChatSessions());
    setActiveChatId(newChat.id);
    chatStorageService.saveActiveChatId(newChat.id);
    setMessages([]);
  };

  const handleSelectChat = (chatId: string) => {
    const selectedChat = chatStorageService.findChatById(chatId);
    if (selectedChat) {
      setActiveChatId(chatId);
      chatStorageService.saveActiveChatId(chatId);
      setMessages(selectedChat.messages);
      
      if (selectedChat.modelId) {
        setSelectedModel(selectedChat.modelId);
      }
      
      setDrawerOpen(false);
    }
  };

  const handleDeleteChat = (chatId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    chatStorageService.deleteChat(chatId);
    setChatSessions(chatStorageService.loadChatSessions());
    
    if (activeChatId === chatId) {
      // If active chat is deleted, select another chat or clear messages
      const remainingSessions = chatStorageService.loadChatSessions();
      if (remainingSessions.length > 0) {
        handleSelectChat(remainingSessions[0].id);
      } else {
        setActiveChatId(null);
        chatStorageService.saveActiveChatId(null);
        setMessages([]);
      }
    }
  };

  const generateChatTitle = (firstMessage: string) => {
    // Generate a title based on the first few words of the first message
    const words = firstMessage.split(' ');
    const shortTitle = words.slice(0, 3).join(' ');
    return shortTitle.length < 20 
      ? shortTitle + (words.length > 3 ? '...' : '') 
      : shortTitle.substring(0, 20) + '...';
  };

  const handleModelChange = (event: SelectChangeEvent<string>) => {
    const newModel = event.target.value;
    setSelectedModel(newModel);
  
    if (activeChatId) {
      chatStorageService.updateChat(activeChatId, { modelId: newModel });
      setChatSessions(chatStorageService.loadChatSessions());
    }
  };

  const activeChat = chatSessions.find(chat => chat.id === activeChatId);

  return (
    <Box
      sx={{
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={toggleDrawer} edge="start">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
            {activeChat ? activeChat.title : 'Chat App'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ThemeToggleButton />
          <Select
            value={selectedModel}
            onChange={handleModelChange}
            size="small"
            sx={{ minWidth: 120 }}
          >
            {MODEL_OPTIONS.map((model: string) => (
              <MenuItem key={model} value={model}>
                {model}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '75%',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                backgroundColor:
                  msg.role === 'user' ? 'primary.main' : 'secondary.main',
                color: 'primary.contrastText',
                padding: 1.5,
                borderRadius: 2,
                wordBreak: 'break-word',
              }}
            >
              {msg.content}
            </Typography>
          </Box>
        ))}
      </Box>

      <ChatInput
        onSend={handleSend}
        selectedModel={selectedModel}
      />

      <ChatDrawer
        open={drawerOpen}
        onClose={toggleDrawer}
        chatSessions={chatSessions}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onCreateChat={handleCreateChat}
      />
    </Box>
  );
}