import React from "react";
import { Card, Box, IconButton, Slider, Typography } from "@mui/material";
import { PlayArrow as PlayIcon, Pause as PauseIcon, VolumeUp as VolumeUpIcon, VolumeOff as VolumeOffIcon } from "@mui/icons-material";
import { glow, pulse, slideIn } from "./styles";

export interface MiniPlayerProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onProgressChange: (_: Event, newValue: number | number[]) => void;
  onToggleMute: () => void;
  isMuted: boolean;
  audioEl: React.ReactNode;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ isPlaying, currentTime, duration, onPlayPause, onProgressChange, onToggleMute, isMuted, audioEl }) => {
  return (
    <Card sx={{ 
      position: "fixed", bottom: 20, right: 20, width: 350, height: 60, zIndex: 99999,
      display: "flex", alignItems: "center", p: 1, gap: 1, boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      backgroundColor: "background.paper", animation: `${slideIn} 0.3s ease-out`, transition: "all 0.3s ease",
      '&:hover': { transform: 'translateY(-2px)', boxShadow: "0 6px 16px rgba(0,0,0,0.4)" }
    }}>
      <IconButton onClick={onPlayPause} size="small" sx={{ animation: isPlaying ? `${pulse} 2s infinite` : 'none', transition: 'all 0.2s ease' }}>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </IconButton>
      <Box sx={{ flex: 1 }}>
        <Slider value={currentTime} onChange={onProgressChange} max={duration || 100} size="small" sx={{ '& .MuiSlider-thumb': { animation: isPlaying ? `${glow} 2s infinite` : 'none' } }} />
      </Box>
      <Typography variant="caption" sx={{ minWidth: 40 }}>
        {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}
      </Typography>
      <IconButton onClick={onToggleMute} size="small">
        {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
      </IconButton>
      {audioEl}
    </Card>
  );
};

export default MiniPlayer;
