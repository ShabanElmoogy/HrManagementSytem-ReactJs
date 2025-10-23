import React from 'react';
import { Box, IconButton, Slider, Tooltip, Typography } from '@mui/material';
import { Pause as PauseIcon, PlayArrow as PlayIcon, VolumeOff as VolumeOffIcon, VolumeUp as VolumeUpIcon, Fullscreen as FullscreenIcon, FullscreenExit as FullscreenExitIcon, Repeat as RepeatIcon, RepeatOne as RepeatOneIcon, SkipNext as SkipNextIcon, SkipPrevious as SkipPreviousIcon } from '@mui/icons-material';

interface ControlsBarProps {
  TimeDisplay: React.ComponentType<any>;
  t: (key: string, opts?: any) => string;
  formatTime: (s: number) => string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeek: (delta: number) => void;
  repeatMode: 'off' | 'all' | 'one';
  onToggleRepeat: () => void;
  playbackRate: number;
  onChangePlaybackRate: () => void;
  isMuted: boolean;
  volume: number;
  onToggleMute: () => void;
  onVolumeChange: (_: Event, newValue: number | number[]) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({ TimeDisplay, t, formatTime, currentTime, duration, isPlaying, onPlayPause, onSeek, repeatMode, onToggleRepeat, playbackRate, onChangePlaybackRate, isMuted, volume, onToggleMute, onVolumeChange, isFullscreen, onToggleFullscreen }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
      {/* Left: Time Display */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>
        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>/</Typography>
        <TimeDisplay>{formatTime(duration)}</TimeDisplay>
      </Box>

      {/* Center: Play Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Previous (-30s)">
          <IconButton onClick={() => onSeek(-30)} sx={{ color: '#fff', width: 32, height: 32, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
            <SkipPreviousIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Skip -10s">
          <IconButton onClick={() => onSeek(-10)} sx={{ color: '#fff', width: 32, height: 32, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
            <Typography sx={{ fontSize: '0.6rem', fontWeight: 600 }}>-10</Typography>
          </IconButton>
        </Tooltip>

        <Tooltip title={isPlaying ? t('media.pause') : t('media.play')}>
          <IconButton onClick={onPlayPause} sx={{ color: '#fff', width: 48, height: 48, backgroundColor: 'rgba(255,255,255,0.15)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.25)' } }}>
            {isPlaying ? <PauseIcon sx={{ fontSize: 24 }} /> : <PlayIcon sx={{ fontSize: 24 }} />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Skip +10s">
          <IconButton onClick={() => onSeek(10)} sx={{ color: '#fff', width: 32, height: 32, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
            <Typography sx={{ fontSize: '0.6rem', fontWeight: 600 }}>+10</Typography>
          </IconButton>
        </Tooltip>

        <Tooltip title="Next (+30s)">
          <IconButton onClick={() => onSeek(30)} sx={{ color: '#fff', width: 32, height: 32, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
            <SkipNextIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Right: Additional Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title={repeatMode === 'off' ? 'Repeat Off' : repeatMode === 'all' ? 'Repeat All' : 'Repeat One'}>
          <IconButton onClick={onToggleRepeat} sx={{ color: repeatMode !== 'off' ? '#1976d2' : '#fff', width: 28, height: 28, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
            {repeatMode === 'one' ? <RepeatOneIcon fontSize="small" /> : <RepeatIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        <Tooltip title={`Speed: ${playbackRate}x`}>
          <IconButton onClick={onChangePlaybackRate} sx={{ color: '#fff', width: 28, height: 28, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
            <Typography sx={{ fontSize: '0.6rem', fontWeight: 600 }}>{playbackRate}x</Typography>
          </IconButton>
        </Tooltip>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 70 }}>
          <Tooltip title={isMuted ? t('media.unmute') : t('media.mute')}>
            <IconButton onClick={onToggleMute} sx={{ color: '#fff', width: 28, height: 28, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
              {isMuted ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Slider value={isMuted ? 0 : volume} onChange={onVolumeChange} min={0} max={1} step={0.05} sx={{ width: 50, color: '#fff', '& .MuiSlider-thumb': { width: 8, height: 8 } }} />
        </Box>

        <Tooltip title={isFullscreen ? t('media.exitFullscreen') : t('media.fullscreen')}>
          <IconButton onClick={onToggleFullscreen} sx={{ color: '#fff', width: 28, height: 28, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
            {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};
