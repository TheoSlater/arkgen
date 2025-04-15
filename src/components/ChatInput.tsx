import { Box, Paper, InputBase, IconButton } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

interface ChatInputProps {
  input: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ChatInput({
  input,
  handleChange,
  handleSubmit,
}: ChatInputProps) {
  return (
    <Box sx={{ width: "100%", boxSizing: "border-box" }}>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          borderRadius: "12px",
        }}
      >
        <InputBase
          sx={{ flex: 1 }}
          placeholder="Ask anything..."
          value={input}
          onChange={handleChange}
        />
        <IconButton type="submit" disabled={!input}>
          <ArrowUpwardIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}
