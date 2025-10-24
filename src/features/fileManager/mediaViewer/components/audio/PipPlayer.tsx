import React from "react";
import { Card, Box, IconButton, Slider } from "@mui/material";
import { PlayArrow as PlayIcon, Pause as PauseIcon, PictureInPicture as PictureInPictureIcon } from "@mui/icons-material";
import { glow, pulse, slideIn } from "./styles";

export interface PipPlayerProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onProgressChange: (_: Event, newValue: number | number[]) => void;
  onClose: () => void;
  audioEl: React.ReactNode;
}

const PipPlayer: React.FC<PipPlayerProps> = ({ isPlaying, currentTime, duration, onPlayPause, onProgressChange, onClose, audioEl }) => {
  return (
    <Card sx={{ 
      position: "fixed", bottom: 20, right: 20, width: 300, height: 80, zIndex: 99999,
      display: "flex", alignItems: "center", p: 1, boxShadow: "0 4px 12px rgba(0,0,0,0.3)", backgroundColor: "background.paper",
      animation: `${slideIn} 0.3s ease-out`, transition: "all 0.3s ease",
      '&:hover': { transform: 'translateY(-2px)', boxShadow: "0 6px 16px rgba(0,0,0,0.4)" }
    }}>
      <IconButton onClick={onPlayPause} size="small" sx={{ animation: isPlaying ? `${pulse} 2s infinite` : 'none', transition: 'all 0.2s ease' }}>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </IconButton>
      <Box sx={{ flex: 1, mx: 1 }}>
        <Slider value={currentTime} onChange={onProgressChange} max={duration || 100} size="small" sx={{ '& .MuiSlider-thumb': { animation: isPlaying ? `${glow} 2s infinite` : 'none' } }} />
      </Box>
      <IconButton onClick={onClose} size="small" sx={{ transition: 'all 0.2s ease', '&:hover': { transform: 'scale(1.1)' } }}>
        <PictureInPictureIcon />
      </IconButton>
      {audioEl}
    </Card>
  );
};

export default PipPlayer;
