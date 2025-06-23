"use client";
import React, { useState } from "react";
import {
  AppBar,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useTheme,
  Popover,
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { Settings } from "@mui/icons-material";
import { useModel } from "../context/ModelContext";

export default function Navbar({ onNewChat }: { onNewChat: () => void }) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { model, setModel } = useModel();

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "settings-popover" : undefined;

  return (
    <>
      <AppBar
        position="relative"
        elevation={1}
        sx={{
          borderRadius: "10px",
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Toolbar>
          <Typography variant="body1" sx={{ flexGrow: 1 }}>
            AI Chat
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="text"
              sx={{ borderRadius: "12px" }}
              onClick={onNewChat}
            >
              New Chat
            </Button>
            <Button variant="text" sx={{ borderRadius: "12px" }} disabled>
              History
            </Button>
            <IconButton
              aria-describedby={id}
              sx={{ borderRadius: "12px" }}
              onClick={handleSettingsClick}
            >
              <Settings />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: "10px",
            bgcolor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: 3,
            minWidth: 200,
          },
        }}
      >
        <Box sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="subtitle1" gutterBottom>
            Settings
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="ai-model-select-label">Choose AI</InputLabel>
            <Select
              labelId="ai-model-select-label"
              value={model}
              label="Choose AI"
              onChange={(e) => setModel(e.target.value)} // we set the model here, dynamically updates. Doesnt affect current message.
            >
              <MenuItem value="llama3">Llama 3</MenuItem>
              <MenuItem value="llama3.2">Llama 3.2</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Popover>
    </>
  );
}
