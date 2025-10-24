import React, { useState } from "react";
import { Card, Box, useMediaQuery, useTheme, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import HeaderBar from "./audio/HeaderBar";
import ProgressBar from "./audio/ProgressBar";
import PlaybackControls from "./audio/PlaybackControls";
import VolumeControl from "./audio/VolumeControl";
import Visualizer from "./audio/Visualizer";
import { useAudioPlayer } from "./audio/useAudioPlayer";
import { pulse, rotate, wave, glow } from "./audio/styles";
import TimeDisplay from "./audio/TimeDisplay";
import RepeatToggle from "./audio/RepeatToggle";
import MiniPlayer from "./audio/MiniPlayer";
import PipPlayer from "./audio/PipPlayer";
import { formatTime } from "./utils/time";

interface AudioPlayerProps {
  mediaUrl: string;
  onError: (message: string) => void;
  onBack?: () => void;
  isMinimal?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ mediaUrl, onError, onBack, isMinimal = false }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.down('md'));
  const isMd = useMediaQuery(theme.breakpoints.down('lg'));
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  
  const setPosition = (url: string, time: number) => {
    localStorage.setItem(`audio-${url}`, time.toString());
  };
  
  const {
    audioRef,
    isPlaying,
    togglePlayPause,
    skip,
    currentTime,
    duration,
    onProgressChange: handleProgressChange,
    volume,
    isMuted,
    onVolumeChange: handleVolumeChange,
    toggleMute: handleMuteToggle,
    isRepeat,
    toggleRepeat: toggleRepeatMode,
    isPictureInPicture,
    setIsPictureInPicture,
    audioData,
  } = useAudioPlayer({ mediaUrl, onError });

  const handlePlayPause = togglePlayPause;

  const handleSkip = skip;

  const handleBack = () => {
    if (audioRef.current?.currentTime) {
      setPosition(mediaUrl, audioRef.current.currentTime);
    }
    onBack?.();
  };

  if (isMinimal) {
    return (
      <MiniPlayer
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onPlayPause={handlePlayPause}
        onProgressChange={handleProgressChange}
        onToggleMute={handleMuteToggle}
        isMuted={isMuted}
        audioEl={<audio ref={audioRef} src={mediaUrl}>{t("media.audioNotSupported")}</audio>}
      />
    );
  }

  if (isPictureInPicture) {
    return (
      <PipPlayer
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onPlayPause={handlePlayPause}
        onProgressChange={handleProgressChange}
        onClose={() => setIsPictureInPicture(false)}
        audioEl={<audio ref={audioRef} src={mediaUrl}>{t("media.audioNotSupported")}</audio>}
      />
    );
  }

  return (
    <Card sx={{ 
      width: isXs ? "100vw" : isSm ? "calc(100vw - 100px)" : isMd ? "calc(100vw - 200px)" : "calc(100vw - 500px)", 
      height: isXs ? "100vh" : "calc(100vh - 100px)", 
      display: "flex", 
      flexDirection: "column",
      margin: isXs ? 0 : "auto"
    }}>
      <HeaderBar onBack={handleBack} />

      <Visualizer
        isPlaying={isPlaying}
        audioData={audioData}
        rotateAnim={`${rotate} 3s linear infinite`}
        waveAnim={(i) => `${wave} ${0.5 + (i % 3) * 0.2}s infinite ${i * 0.1}s`}
      />

      {/* Controls */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <ProgressBar value={currentTime} onChange={handleProgressChange} max={duration || 100} playingGlow={isPlaying ? `${glow} 2s infinite` : 'none'} />
        
        {/* Single Row Controls Layout */}
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          gap: { xs: 1, sm: 2 },
          flexWrap: { xs: 'nowrap', sm: 'nowrap' },
          minHeight: { xs: 48, sm: 56 }
        }}>
          {/* Left: Time Display */}
          <TimeDisplay currentTime={currentTime} duration={duration} formatTime={formatTime} />

          {/* Center: Play Controls */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 } }}>
            {/* Large screens - show skip buttons */}
            {!isMd && (
              <Tooltip title="Skip -30s">
                <IconButton 
                  onClick={() => handleSkip(-30)} 
                  size="small"
                  sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}
                >
                  <span style={{ fontSize: '0.6rem', fontWeight: 600 }}>-30</span>
                </IconButton>
              </Tooltip>
            )}
            
            {/* Medium+ screens - show 10s skip */}
            {!isSm && (
              <Tooltip title="Skip -10s">
                <IconButton 
                  onClick={() => handleSkip(-10)} 
                  size="small"
                  sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}
                >
                  <span style={{ fontSize: '0.6rem', fontWeight: 600 }}>-10</span>
                </IconButton>
              </Tooltip>
            )}

            {/* Always show play/pause */}
            <PlaybackControls
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onSkipBack={() => handleSkip(-10)}
              onPrev={undefined}
              onNext={undefined}
              onSkipForward={() => handleSkip(10)}
              pulseAnim={isPlaying ? `${pulse} 2s infinite` : 'none'}
            />

            {/* Medium+ screens - show 10s skip */}
            {!isSm && (
              <Tooltip title="Skip +10s">
                <IconButton 
                  onClick={() => handleSkip(10)} 
                  size="small"
                  sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}
                >
                  <span style={{ fontSize: '0.6rem', fontWeight: 600 }}>+10</span>
                </IconButton>
              </Tooltip>
            )}
            
            {/* Large screens - show skip buttons */}
            {!isMd && (
              <Tooltip title="Skip +30s">
                <IconButton 
                  onClick={() => handleSkip(30)} 
                  size="small"
                  sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}
                >
                  <span style={{ fontSize: '0.6rem', fontWeight: 600 }}>+30</span>
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {/* Right: Additional Controls */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 } }}>
            {/* Always show repeat and volume on MD+ screens */}
            <RepeatToggle isRepeat={isRepeat} onToggle={toggleRepeatMode} rotateAnim={`${rotate} 2s linear infinite`} />
            
            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onChange={handleVolumeChange}
              onToggleMute={handleMuteToggle}
              pulseAnim={!isMuted && isPlaying ? `${pulse} 3s infinite` : 'none'}
            />
            
            {/* Show menu for smaller screens */}
            {(isSm || isXs) && (
              <Tooltip title="More">
                <IconButton 
                  onClick={(e) => setMenuAnchor(e.currentTarget)} 
                  size="small"
                  sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}
                >
                  <MoreVertIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        {/* XS screens - show all menu items */}
        {isXs && (
          <>
            <MenuItem onClick={() => { handleSkip(-30); setMenuAnchor(null); }}>
              Skip -30s
            </MenuItem>
            <MenuItem onClick={() => { handleSkip(-10); setMenuAnchor(null); }}>
              Skip -10s
            </MenuItem>
            <MenuItem onClick={() => { handleSkip(10); setMenuAnchor(null); }}>
              Skip +10s
            </MenuItem>
            <MenuItem onClick={() => { handleSkip(30); setMenuAnchor(null); }}>
              Skip +30s
            </MenuItem>
            <MenuItem onClick={() => { toggleRepeatMode(); setMenuAnchor(null); }}>
              Repeat: {isRepeat ? 'On' : 'Off'}
            </MenuItem>
            <MenuItem onClick={() => { handleMuteToggle(); setMenuAnchor(null); }}>
              {isMuted ? 'Unmute' : 'Mute'}
            </MenuItem>
          </>
        )}
        
        {/* SM screens - show skip controls + repeat */}
        {isSm && !isXs && (
          <>
            <MenuItem onClick={() => { handleSkip(-30); setMenuAnchor(null); }}>
              Skip -30s
            </MenuItem>
            <MenuItem onClick={() => { handleSkip(30); setMenuAnchor(null); }}>
              Skip +30s
            </MenuItem>
            <MenuItem onClick={() => { toggleRepeatMode(); setMenuAnchor(null); }}>
              Repeat: {isRepeat ? 'On' : 'Off'}
            </MenuItem>
          </>
        )}
        

      </Menu>

      <audio ref={audioRef} src={mediaUrl}>
        {t("media.audioNotSupported")}
      </audio>
    </Card>
  );
};

export default AudioPlayer;