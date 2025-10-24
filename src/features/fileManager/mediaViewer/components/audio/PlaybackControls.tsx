import React from "react";
import { Box, IconButton } from "@mui/material";
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  SkipPrevious as SkipPreviousIcon,
  SkipNext as SkipNextIcon,
  Replay10 as Replay10Icon,
  Forward10 as Forward10Icon,
} from "@mui/icons-material";

export interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onSkipBack: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onSkipForward: () => void;
  pulseAnim?: string;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  onPlayPause,
  onSkipBack,
  onPrev,
  onNext,
  onSkipForward,
  pulseAnim,
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <IconButton 
        onClick={onSkipBack}
        size="medium"
        sx={{ transition: 'all 0.2s ease', '&:hover': { transform: 'scale(1.1)' } }}
      >
        <Replay10Icon />
      </IconButton>
      <IconButton 
        size="medium"
        sx={{ transition: 'all 0.2s ease', '&:hover': { transform: 'scale(1.1)' } }}
        onClick={onPrev}
      >
        <SkipPreviousIcon />
      </IconButton>
      <IconButton 
        onClick={onPlayPause} 
        size="large" 
        color="primary"
        sx={{ animation: pulseAnim || 'none', transition: 'all 0.3s ease', '&:hover': { transform: 'scale(1.1)', boxShadow: '0 0 20px rgba(25, 118, 210, 0.5)' } }}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </IconButton>
      <IconButton 
        size="medium"
        sx={{ transition: 'all 0.2s ease', '&:hover': { transform: 'scale(1.1)' } }}
        onClick={onNext}
      >
        <SkipNextIcon />
      </IconButton>
      <IconButton 
        onClick={onSkipForward}
        size="medium"
        sx={{ transition: 'all 0.2s ease', '&:hover': { transform: 'scale(1.1)' } }}
      >
        <Forward10Icon />
      </IconButton>
    </Box>
  );
};

export default PlaybackControls;
