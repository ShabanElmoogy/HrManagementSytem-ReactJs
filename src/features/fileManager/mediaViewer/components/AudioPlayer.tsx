import React, { useRef, useState, useEffect } from "react";
import {
  Card,
  Box,
  Slider,
  IconButton,
  Typography,
} from "@mui/material";
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  SkipPrevious as SkipPreviousIcon,
  SkipNext as SkipNextIcon,
  Replay10 as Replay10Icon,
  Forward10 as Forward10Icon,
  ArrowBack as ArrowBackIcon,
  PictureInPicture as PictureInPictureIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface AudioPlayerProps {
  mediaUrl: string;
  onError: (message: string) => void;
  onBack?: () => void;
}

const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ mediaUrl, onError, onBack }) => {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isPictureInPicture, setIsPictureInPicture] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => onError(t("media.failedToLoadAudio"));

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [onError, t]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressChange = (_: Event, newValue: number | number[]) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const handleVolumeChange = (_: Event, newValue: number | number[]) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
    if (value > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleSkip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
    }
  };

  const handlePictureInPicture = () => {
    setIsPictureInPicture(!isPictureInPicture);
  };

  const handleBack = () => {
    onBack?.();
  };

  if (isPictureInPicture) {
    return (
      <Card sx={{ 
        position: "fixed", 
        bottom: 20, 
        right: 20, 
        width: 300, 
        height: 80, 
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        p: 1
      }}>
        <IconButton onClick={handlePlayPause} size="small">
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </IconButton>
        <Box sx={{ flex: 1, mx: 1 }}>
          <Slider
            value={currentTime}
            onChange={handleProgressChange}
            max={duration || 100}
            size="small"
          />
        </Box>
        <IconButton onClick={() => setIsPictureInPicture(false)} size="small">
          <PictureInPictureIcon />
        </IconButton>
        <audio ref={audioRef} src={mediaUrl}>
          {t("media.audioNotSupported")}
        </audio>
      </Card>
    );
  }

  return (
    <Card sx={{ 
      width: "calc(100vw - 500px)", 
      height: "calc(100vh - 100px)", 
      display: "flex", 
      flexDirection: "column"
    }}>
      {/* Header Controls */}
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 1, borderBottom: 1, borderColor: "divider" }}>
        <IconButton onClick={handleBack} size="small">
          <ArrowBackIcon />
        </IconButton>
        <IconButton onClick={handlePictureInPicture} size="small">
          <PictureInPictureIcon />
        </IconButton>
      </Box>

      {/* Animation Area */}
      <Box
        sx={{
          flex: 1,
          background: "linear-gradient(135deg, #1976d220 0%, #9c27b020 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Simple Equalizer */}
        <Box sx={{ display: "flex", alignItems: "flex-end", gap: 0.5, height: 100 }}>
          {[...Array(12)].map((_, i) => (
            <Box
              key={i}
              sx={{
                width: 4,
                height: isPlaying ? `${20 + Math.sin(Date.now() / 200 + i) * 30}px` : "8px",
                backgroundColor: "primary.main",
                borderRadius: 2,
                transition: "height 0.1s ease",
                opacity: isPlaying ? 1 : 0.3,
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Controls */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        {/* Progress */}
        <Slider
          value={currentTime}
          onChange={handleProgressChange}
          max={duration || 100}
          sx={{ mb: 1 }}
        />
        
        {/* Time Display */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="caption">{formatTime(currentTime)}</Typography>
          <Typography variant="caption">{formatTime(duration)}</Typography>
        </Box>

        {/* All Controls in One Row */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          {/* Playback Controls */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => handleSkip(-10)} size="medium">
              <Replay10Icon />
            </IconButton>
            <IconButton size="medium">
              <SkipPreviousIcon />
            </IconButton>
            <IconButton onClick={handlePlayPause} size="large" color="primary">
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </IconButton>
            <IconButton size="medium">
              <SkipNextIcon />
            </IconButton>
            <IconButton onClick={() => handleSkip(10)} size="medium">
              <Forward10Icon />
            </IconButton>
          </Box>
          
          {/* Volume Control */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={handleMuteToggle} size="small">
              {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </IconButton>
            <Slider
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              min={0}
              max={1}
              step={0.05}
              sx={{ width: 120 }}
            />
          </Box>
        </Box>
      </Box>

      <audio ref={audioRef} src={mediaUrl}>
        {t("media.audioNotSupported")}
      </audio>
    </Card>
  );
};

export default AudioPlayer;