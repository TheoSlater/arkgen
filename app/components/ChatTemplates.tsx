"use client";

import { useRef, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";

const questions = [
  "What's your favorite movie?",
  "Can you summarize last quarter's results?",
  "How do I fix a network connectivity issue?",
  "Write a poem about a rainy day.",
];

interface ChatTemplatesProps {
  onSelectTemplate: (templateText: string) => void;
}

export default function ChatTemplates({
  onSelectTemplate,
}: ChatTemplatesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startX.current = e.pageX - (containerRef.current?.offsetLeft ?? 0);
    scrollLeft.current = containerRef.current?.scrollLeft ?? 0;
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const x = e.pageX - (containerRef.current?.offsetLeft ?? 0);
    const walk = (x - startX.current) * 1; // scroll-fast multiplier
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  // Touch events (for mobile)
  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startX.current =
      e.touches[0].pageX - (containerRef.current?.offsetLeft ?? 0);
    scrollLeft.current = containerRef.current?.scrollLeft ?? 0;
  };

  const onTouchEnd = () => {
    setIsDragging(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const x = e.touches[0].pageX - (containerRef.current?.offsetLeft ?? 0);
    const walk = (x - startX.current) * 1;
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        display: "flex",
        gap: 2,
        p: 2,
        overflowX: "auto",
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: isDragging ? "none" : "auto",
        "&::-webkit-scrollbar": { display: "none" },
      }}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchMove={onTouchMove}
    >
      {questions.map((question, i) => (
        <Paper
          key={i}
          elevation={6}
          sx={{
            flex: "1 0 205px",
            p: 3,
            borderRadius: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)",
            transition: "transform 0.2s ease, boxShadow 0.2s ease",
            cursor: "pointer",
            userSelect: "none",
            "&:hover": {
              boxShadow:
                "0 8px 24px rgba(0,0,0,0.15), 0 3px 8px rgba(0,0,0,0.1)",
              transform: "translateY(-4px)",
            },
          }}
          onClick={() => onSelectTemplate(question)}
        >
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {question}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
