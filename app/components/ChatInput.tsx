'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Paper,
  TextField,
  useTheme,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default function ChatInput({ onSend }: { onSend: (message: string) => void }) {
  const [message, setMessage] = useState('');
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const theme = useTheme();

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    
    // Replace newlines with a space before sending
    const normalizedMessage = trimmed.replace(/\n/g, ' ').trim();
    
    onSend(normalizedMessage);
    setMessage('');
  };
  

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.height = '0px';
      textRef.current.style.height = `${textRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <Box
      sx={{
        width: '100%',
        position: 'sticky',
        bottom: 0,
        backgroundColor: theme.palette.background.default,
        padding: 2,
        borderTop: `1px solid ${theme.palette.divider}`,
        zIndex: 10,
        transition: 'background-color 0.3s ease',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          padding: 1,
          borderRadius: '16px',
          backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fafafa',
          boxShadow: 3,
        }}
      >
        <TextField
          fullWidth
          multiline
          placeholder="Send a message"
          variant="standard"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          inputRef={textRef}
          InputProps={{
            disableUnderline: true,
            sx: {
              fontSize: '1rem',
              paddingLeft: 1,
              paddingTop: 1,
              paddingBottom: 1,
            },
          }}
          sx={{ flex: 1 }}
        />
        <IconButton onClick={handleSend} disabled={!message.trim()}>
          <SendIcon color={message.trim() ? 'primary' : 'disabled'} />
        </IconButton>
      </Paper>
    </Box>
  );
}
