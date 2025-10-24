import React from "react";
import { Box, IconButton, Slider } from "@mui/material";
import { VolumeUp as VolumeUpIcon, VolumeOff as VolumeOffIcon } from "@mui/icons-material";

export interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onChange: (_: Event, newValue: number | number[]) => void;
  onToggleMute: () => void;
  pulseAnim?: string;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ volume, isMuted, onChange, onToggleMute, pulseAnim }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <IconButton 
        onClick={onToggleMute} 
        size="small"
        sx={{ animation: pulseAnim || 'none', transition: 'all 0.2s ease', '&:hover': { transform: 'scale(1.1)' } }}
      >
        {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
      </IconButton>
      <Slider
        value={isMuted ? 0 : volume}
        onChange={onChange}
        min={0}
        max={1}
        step={0.05}
        sx={{ 
          width: 120,
          '& .MuiSlider-thumb': {
            transition: 'all 0.3s ease',
            '&:hover': { transform: 'scale(1.2)', boxShadow: '0 0 10px rgba(25, 118, 210, 0.5)' }
          }
        }}
      />
    </Box>
  );
};

export default VolumeControl;
