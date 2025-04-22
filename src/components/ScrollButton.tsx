import { Fab, Zoom } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";

interface ScrollButtonProps {
  show: boolean;
  onClick: () => void;
}

export default function ScrollButton({ show, onClick }: ScrollButtonProps) {
  return (
    <Zoom in={show}>
      <Fab
        size="small"
        onClick={onClick}
        sx={{
          position: "fixed",
          bottom: 100,
          right: 20,
          opacity: 0.8,
        }}
      >
        <KeyboardArrowDown />
      </Fab>
    </Zoom>
  );
}
