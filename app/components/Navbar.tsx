import { Settings } from "@mui/icons-material";
import {
  AppBar,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

export default function Navbar() {
  return (
    <AppBar
      position="relative"
      elevation={1}
      sx={{
        borderRadius: "18px",
        bgcolor: "background.paper",
      }}
    >
      <Toolbar>
        <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
          AI Chat
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="text" sx={{ borderRadius: "14px" }}>
            New Chat
          </Button>
          <Button variant="text" sx={{ borderRadius: "14px" }}>
            History
          </Button>
          <IconButton sx={{ borderRadius: "14px" }}>
            <Settings />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
