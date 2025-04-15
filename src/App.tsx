import { Box, Select, MenuItem } from "@mui/material";
import ChatInput from "./components/ChatInput";
import MessageBubble from "./components/MessageBubble";
import { useChatInput } from "./hooks/useChatInput";

function App() {
  const {
    input,
    messages,
    model,
    handleChange,
    handleSubmit,
    handleModelChange,
  } = useChatInput();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Select value={model} onChange={handleModelChange} sx={{ width: 200 }}>
          <MenuItem value="llama3">Llama 3</MenuItem>
          <MenuItem value="mistral">Mistral</MenuItem>
        </Select>
      </Box>

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
        />
      </Box>
    </Box>
  );
}

export default App;
