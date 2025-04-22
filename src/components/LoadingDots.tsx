import { Box } from "@mui/material";
import { Orbit } from "ldrs/react";
import "ldrs/react/orbit.css";

export default function LoadingDots() {
  return (
    <Box sx={{ display: "flex", p: 1 }}>
      <Orbit size={25} speed={1.3} color="currentColor" />
    </Box>
  );
}
