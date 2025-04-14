'use client';

import { Box, Typography, Select, MenuItem, Alert, IconButton, SelectChangeEvent } from '@mui/material';
import ChatInput from './components/ChatInput';
import { useState } from 'react';
import ThemeToggleButton from './components/ThemeToggleButton';
import { chatWithModel, chatWithPhoto } from './lib/llmService';
import MenuIcon from '@mui/icons-material/Menu';
import ChatDrawer from './components/ChatDrawer';
import { chatStorageService } from './lib/chatStorageService';
import { ChatMessage } from './types/chat';
import { useChatState } from './hooks/useChatState';
import MessageBubble from './components/MessageBubble';

// Add MODEL_OPTIONS constant
const MODEL_OPTIONS: string[] = ['N/A', 'mistral', 'llama2', 'llava'];

export default function ChatPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {
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
  } = useChatState();

  const handleSend = async (message: string, image?: File) => {
    try {
      if (image) {
        // Add the text message if provided
        if (message.trim()) {
          const userTextMessage: ChatMessage = { role: 'user', content: message };
          setMessages(prev => [...prev, userTextMessage]);
          if (!activeChatId) {
            const newChat = chatStorageService.createChat(generateChatTitle(message), [userTextMessage], selectedModel);
            setChatSessions(chatStorageService.loadChatSessions());
            setActiveChatId(newChat.id);
            chatStorageService.saveActiveChatId(newChat.id);
          }
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

        if (!activeChatId) {
          const newChat = chatStorageService.createChat(generateChatTitle(message), [userMessage], selectedModel);
          setChatSessions(chatStorageService.loadChatSessions());
          setActiveChatId(newChat.id);
          chatStorageService.saveActiveChatId(newChat.id);
        }

        const response = await chatWithModel(selectedModel, [...messages, userMessage]);
        const assistantMessage: ChatMessage = { role: 'assistant', content: response };
        setMessages((prev) => [...prev, assistantMessage]);
      }
      setError(null); // Clear any previous errors
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred while communicating with the AI model.");
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleCreateChat = (title: string) => {
    const newChat = chatStorageService.createChat(title, [], selectedModel);
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
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          minWidth: 0,
          flex: 1, // Added flex grow
        }}>
          <IconButton
            onClick={toggleDrawer}
            edge="start"
            sx={{ mr: 2 }} // Increased margin
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            sx={{
              flexGrow: 1,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {activeChat ? activeChat.title : 'Chat App'}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            ml: 2, // Added margin left
          }}
        >
          <ThemeToggleButton />
          <Select
            value={selectedModel}
            onChange={handleModelChange}
            size="small"
            sx={{ minWidth: 120 }}
          >
            {MODEL_OPTIONS.map((model) => (
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
          gap: 1.5,
        }}
      >
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
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