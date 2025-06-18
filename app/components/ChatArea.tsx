import { Box, Paper, TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function ChatArea() {
  return (
    <Paper
      sx={{
        borderRadius: "24px",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        p: 2,
        overflow: "hidden",
        boxShadow: 3,
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          mb: 2,
        }}
      ></Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          borderRadius: "20px",
          bgcolor: "background.paper",
          px: 2,
          py: 1.5,
          boxShadow: 1,
        }}
      >
        <TextField
          variant="standard"
          placeholder="Ask me anything..."
          fullWidth
          InputProps={{
            disableUnderline: true,
          }}
          sx={{
            flex: 1,
            mr: 2,
            fontSize: "1rem",
          }}
        />
        <Button
          variant="contained"
          disableElevation
          endIcon={<SendIcon />}
          sx={{
            borderRadius: "18px",
            textTransform: "none",
            px: 3,
            py: 1,
          }}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
}
