import React from "react";
import { Box, Typography } from "@mui/material";

export interface TimeDisplayProps {
  currentTime: number;
  duration: number;
  formatTime: (s: number) => string;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ currentTime, duration, formatTime }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
      <Typography variant="caption">{formatTime(currentTime)}</Typography>
      <Typography variant="caption">{formatTime(duration)}</Typography>
    </Box>
  );
};

export default TimeDisplay;
