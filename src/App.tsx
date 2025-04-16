import {
  Box,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Alert,
} from "@mui/material";
import { Brightness4, Brightness7, Delete } from "@mui/icons-material";
import ChatInput from "./components/ChatInput";
import MessageBubble from "./components/MessageBubble";
import { useChatInput } from "./hooks/useChatInput";
import { useThemeContext } from "./hooks/useTheme";

function App() {
  const {
    input,
    messages,
    model,
    isLoading,
    error,
    streamingContent,
    handleChange,
    handleSubmit,
    handleModelChange,
    clearHistory,
  } = useChatInput();

  const { mode, toggleColorMode } = useThemeContext();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e, "doesnt work");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Select value={model} onChange={handleModelChange} sx={{ width: 200 }}>
          <MenuItem value="llama2">Llama 2 {"(7b)"}</MenuItem>
          <MenuItem value="llama3">Llama 3 {"(8b)"}</MenuItem>
          <MenuItem value="llama3.1">Llama 3.1 {"(8b)"}</MenuItem>
          <MenuItem value="llama3.2">Llama 3.2 {"(3b)"}</MenuItem>
          <MenuItem value="llama3.3" disabled>
            Llama 3.3 {"(70b)"}
          </MenuItem>
          <MenuItem value="mistral">Mistral {"(7b)"} </MenuItem>
        </Select>
        <Box>
          <IconButton onClick={clearHistory} title="Clear chat history">
            <Delete />
          </IconButton>
          <IconButton onClick={toggleColorMode} color="inherit">
            {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mx: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        {streamingContent && (
          <MessageBubble message={{ role: "bot", content: streamingContent }} />
        )}
        {isLoading && !streamingContent && (
          <Box sx={{ alignSelf: "flex-start" }}>
            <Typography variant="body2" color="text.secondary">
              Thinking...
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          borderTop: "1px solid #ccc",
          p: 3,
        }}
      >
        <ChatInput
          input={input}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleFileUpload={handleFileUpload}
        />
        <Typography
          fontSize={12}
          textAlign={"center"}
          mt="5px"
          color="text.secondary"
        >
          Powered by Ollama. Generated content may be false or innacurate.
        </Typography>
      </Box>
    </Box>
  );
}

export default App;
