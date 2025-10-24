import React, { useState } from 'react';
import { Box, IconButton, Slider, Tooltip, Typography, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { Pause as PauseIcon, PlayArrow as PlayIcon, VolumeOff as VolumeOffIcon, VolumeUp as VolumeUpIcon, Fullscreen as FullscreenIcon, FullscreenExit as FullscreenExitIcon, Repeat as RepeatIcon, RepeatOne as RepeatOneIcon, SkipNext as SkipNextIcon, SkipPrevious as SkipPreviousIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';

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
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.down('md'));
  const isMd = useMediaQuery(theme.breakpoints.down('lg'));
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

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
        {/* Large screens - show all skip buttons */}
        {!isMd && (
          <>
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
          </>
        )}
        
        {/* Medium screens - show only 10s skip buttons */}
        {isMd && !isSm && (
          <Tooltip title="Skip -10s">
            <IconButton onClick={() => onSeek(-10)} sx={{ color: '#fff', width: 32, height: 32, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
              <Typography sx={{ fontSize: '0.6rem', fontWeight: 600 }}>-10</Typography>
            </IconButton>
          </Tooltip>
        )}

        {/* Always show play/pause */}
        <Tooltip title={isPlaying ? t('media.pause') : t('media.play')}>
          <IconButton onClick={onPlayPause} sx={{ color: '#fff', width: 48, height: 48, backgroundColor: 'rgba(255,255,255,0.15)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.25)' } }}>
            {isPlaying ? <PauseIcon sx={{ fontSize: 24 }} /> : <PlayIcon sx={{ fontSize: 24 }} />}
          </IconButton>
        </Tooltip>

        {/* Medium screens - show only 10s skip buttons */}
        {isMd && !isSm && (
          <Tooltip title="Skip +10s">
            <IconButton onClick={() => onSeek(10)} sx={{ color: '#fff', width: 32, height: 32, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
              <Typography sx={{ fontSize: '0.6rem', fontWeight: 600 }}>+10</Typography>
            </IconButton>
          </Tooltip>
        )}
        
        {/* Large screens - show all skip buttons */}
        {!isMd && (
          <>
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
          </>
        )}
      </Box>

      {/* Right: Additional Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Large screens - show all controls */}
        {!isMd && (
          <>
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
          </>
        )}
        
        {/* Always show volume and fullscreen */}
        {!isXs && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: isSm ? 50 : 70 }}>
            <Tooltip title={isMuted ? t('media.unmute') : t('media.mute')}>
              <IconButton onClick={onToggleMute} sx={{ color: '#fff', width: 28, height: 28, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
                {isMuted ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            {!isSm && (
              <Slider value={isMuted ? 0 : volume} onChange={onVolumeChange} min={0} max={1} step={0.05} sx={{ width: 50, color: '#fff', '& .MuiSlider-thumb': { width: 8, height: 8 } }} />
            )}
          </Box>
        )}

        <Tooltip title={isFullscreen ? t('media.exitFullscreen') : t('media.fullscreen')}>
          <IconButton onClick={onToggleFullscreen} sx={{ color: '#fff', width: 28, height: 28, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
            {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
        
        {/* Show menu for smaller screens */}
        {(isMd || isSm || isXs) && (
          <Tooltip title="More">
            <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} sx={{ color: '#fff', width: 28, height: 28, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        PaperProps={{
          sx: { bgcolor: 'rgba(0,0,0,0.8)', color: '#fff' }
        }}
      >
        {/* XS screens - show all menu items */}
        {isXs && (
          <>
            <MenuItem onClick={() => { onSeek(-30); setMenuAnchor(null); }}>
              <SkipPreviousIcon sx={{ mr: 1 }} /> Previous (-30s)
            </MenuItem>
            <MenuItem onClick={() => { onSeek(-10); setMenuAnchor(null); }}>
              <Typography sx={{ mr: 1, fontSize: '0.8rem' }}>-10</Typography> Skip -10s
            </MenuItem>
            <MenuItem onClick={() => { onSeek(10); setMenuAnchor(null); }}>
              <Typography sx={{ mr: 1, fontSize: '0.8rem' }}>+10</Typography> Skip +10s
            </MenuItem>
            <MenuItem onClick={() => { onSeek(30); setMenuAnchor(null); }}>
              <SkipNextIcon sx={{ mr: 1 }} /> Next (+30s)
            </MenuItem>
            <MenuItem onClick={() => { onToggleRepeat(); setMenuAnchor(null); }}>
              {repeatMode === 'one' ? <RepeatOneIcon sx={{ mr: 1 }} /> : <RepeatIcon sx={{ mr: 1 }} />}
              {repeatMode === 'off' ? 'Repeat Off' : repeatMode === 'all' ? 'Repeat All' : 'Repeat One'}
            </MenuItem>
            <MenuItem onClick={() => { onChangePlaybackRate(); setMenuAnchor(null); }}>
              <Typography sx={{ mr: 1, fontSize: '0.8rem' }}>{playbackRate}x</Typography> Speed
            </MenuItem>
            <MenuItem onClick={() => { onToggleMute(); setMenuAnchor(null); }}>
              {isMuted ? <VolumeOffIcon sx={{ mr: 1 }} /> : <VolumeUpIcon sx={{ mr: 1 }} />}
              {isMuted ? 'Unmute' : 'Mute'}
            </MenuItem>
          </>
        )}
        
        {/* SM screens - show skip controls + repeat/speed */}
        {isSm && !isXs && (
          <>
            <MenuItem onClick={() => { onSeek(-30); setMenuAnchor(null); }}>
              <SkipPreviousIcon sx={{ mr: 1 }} /> Previous (-30s)
            </MenuItem>
            <MenuItem onClick={() => { onSeek(30); setMenuAnchor(null); }}>
              <SkipNextIcon sx={{ mr: 1 }} /> Next (+30s)
            </MenuItem>
            <MenuItem onClick={() => { onToggleRepeat(); setMenuAnchor(null); }}>
              {repeatMode === 'one' ? <RepeatOneIcon sx={{ mr: 1 }} /> : <RepeatIcon sx={{ mr: 1 }} />}
              {repeatMode === 'off' ? 'Repeat Off' : repeatMode === 'all' ? 'Repeat All' : 'Repeat One'}
            </MenuItem>
            <MenuItem onClick={() => { onChangePlaybackRate(); setMenuAnchor(null); }}>
              <Typography sx={{ mr: 1, fontSize: '0.8rem' }}>{playbackRate}x</Typography> Speed
            </MenuItem>
          </>
        )}
        
        {/* MD screens - show only repeat/speed */}
        {isMd && !isSm && (
          <>
            <MenuItem onClick={() => { onSeek(-30); setMenuAnchor(null); }}>
              <SkipPreviousIcon sx={{ mr: 1 }} /> Previous (-30s)
            </MenuItem>
            <MenuItem onClick={() => { onSeek(30); setMenuAnchor(null); }}>
              <SkipNextIcon sx={{ mr: 1 }} /> Next (+30s)
            </MenuItem>
            <MenuItem onClick={() => { onToggleRepeat(); setMenuAnchor(null); }}>
              {repeatMode === 'one' ? <RepeatOneIcon sx={{ mr: 1 }} /> : <RepeatIcon sx={{ mr: 1 }} />}
              {repeatMode === 'off' ? 'Repeat Off' : repeatMode === 'all' ? 'Repeat All' : 'Repeat One'}
            </MenuItem>
            <MenuItem onClick={() => { onChangePlaybackRate(); setMenuAnchor(null); }}>
              <Typography sx={{ mr: 1, fontSize: '0.8rem' }}>{playbackRate}x</Typography> Speed
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};
