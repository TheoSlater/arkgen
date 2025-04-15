import { Box, Select, MenuItem, Typography } from "@mui/material";
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    console.log(e, "doesnt work");
  };

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
          <MenuItem value="llama2">Llama 2 {"(7b)"}</MenuItem>
          <MenuItem value="llama3">Llama 3 {"(8b)"}</MenuItem>
          <MenuItem value="llama3.1">Llama 3.1 {"(8b)"}</MenuItem>
          <MenuItem value="llama3.2">Llama 3.2 {"(3b)"}</MenuItem>
          <MenuItem value="llama3.3" disabled>
            Llama 3.3 {"(70b)"}
          </MenuItem>
          <MenuItem value="mistral">Mistral {"(7b)"} </MenuItem>
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
