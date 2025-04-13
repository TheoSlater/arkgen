'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CancelIcon from '@mui/icons-material/Cancel';

interface ChatInputProps {
  onSend: (message: string, image?: File) => void;
  selectedModel?: string;
}

export default function ChatInput({ onSend, selectedModel }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (imageFile || message.trim()) {
      onSend(message.trim(), imageFile || undefined);
      setImageFile(null);
      setImagePreview(null);
      setMessage('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
    <>
      {imagePreview && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 1,
            p: 1,
            border: '1px solid #ccc',
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <img src={imagePreview} alt="preview" style={{ maxWidth: 50, maxHeight: 50, borderRadius: 4 }} />
          <Typography variant="body2" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {imageFile?.name}
          </Typography>
          <IconButton size="small" onClick={() => { setImageFile(null); setImagePreview(null); }}>
            <CancelIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
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
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleFileChange} 
          />
          <IconButton 
            onClick={() => fileInputRef.current?.click()}
            disabled={selectedModel !== 'llava'}
            sx={{ color: selectedModel === 'llava' ? 'inherit' : 'grey' }}
          >
            <AttachFileIcon />
          </IconButton>
          <IconButton onClick={handleSend} disabled={!message.trim() && !imageFile}>
            <SendIcon color={(message.trim() || imageFile) ? 'primary' : 'disabled'} />
          </IconButton>
        </Paper>
      </Box>
    </>
  );
}
