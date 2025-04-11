// components/ChatDrawer.tsx
'use client';

import { useState } from 'react';
import { 
  Drawer, Box, Typography, List, ListItemButton, ListItemText, 
  IconButton, Divider, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ChatSession } from '../types/chat';

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
  chatSessions: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string, event: React.MouseEvent) => void;
  onCreateChat: (title: string) => void;
}

export default function ChatDrawer({
  open,
  onClose,
  chatSessions,
  activeChatId,
  onSelectChat,
  onDeleteChat,
  onCreateChat
}: ChatDrawerProps) {
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');

  const handleNewChatClick = () => {
    setNewChatDialogOpen(true);
  };

  const handleNewChatSubmit = () => {
    onCreateChat(newChatTitle || 'New Chat');
    setNewChatDialogOpen(false);
    setNewChatTitle('');
  };

  return (
    <>
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Your Chats</Typography>
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<AddIcon />}
            onClick={handleNewChatClick}
          >
            New Chat
          </Button>
        </Box>
        <Divider />
        <List sx={{ overflowY: 'auto' }}>
          {chatSessions.length === 0 ? (
            <ListItemButton>
              <ListItemText primary="No chats yet" />
            </ListItemButton>
          ) : (
            chatSessions.map((chat) => (
              <ListItemButton 
                key={chat.id} 
                onClick={() => onSelectChat(chat.id)}
                selected={chat.id === activeChatId}
                sx={{ 
                  cursor: 'pointer',
                  '&.Mui-selected': {
                    backgroundColor: 'action.selected',
                  },
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  }
                }}
              >
                <ListItemText 
                  primary={chat.title} 
                  secondary={new Date(chat.createdAt).toLocaleDateString()}
                  primaryTypographyProps={{ 
                    noWrap: true,
                    sx: { maxWidth: '180px' }
                  }}
                />
                <IconButton 
                  edge="end" 
                  aria-label="delete" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id, e);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemButton>
            ))
          )}
        </List>
      </Drawer>

      <Dialog open={newChatDialogOpen} onClose={() => setNewChatDialogOpen(false)}>
        <DialogTitle>Create New Chat</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Chat Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            placeholder="Enter a title for your new chat"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewChatDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleNewChatSubmit} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}