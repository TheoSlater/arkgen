'use client';

import { Box, Typography } from '@mui/material';
import { ChatMessage } from '../types/chat';

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <Box
      sx={{
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '75%',
        padding: 1.5,
        backgroundColor: isUser ? 'primary.main' : 'secondary.main',
        color: isUser ? 'primary.contrastText' : 'text.primary',
        borderRadius: '12px',
        boxShadow: 1,
        '& pre': {
          margin: 0,
          whiteSpace: 'pre-wrap',
          fontFamily: 'inherit',
        },
      }}
    >
      <Typography
        component="pre"
        variant="body1"
        sx={{
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {message.content}
      </Typography>
    </Box>
  );
}
