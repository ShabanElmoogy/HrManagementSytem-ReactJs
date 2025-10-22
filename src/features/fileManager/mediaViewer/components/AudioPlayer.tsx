import React, { useRef, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Slider,
  IconButton,
  Tooltip,
  LinearProgress,
  Stack,
} from "@mui/material";
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Repeat as RepeatIcon,
  RepeatOne as RepeatOneIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";

interface AudioPlayerProps {
  mediaUrl: string;
  onError: (message: string) => void;
}

const AudioCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 600,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
  backdropFilter: "blur(10px)",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[8],
}));

const AudioCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  "&:last-child": {
    paddingBottom: theme.spacing(3),
  },
}));

const VisualizerBar = styled(Box)(({ theme }) => ({
  width: 3,
  backgroundColor: theme.palette.primary.main,
  borderRadius: 2,
  animation: "pulse 0.6s ease-in-out infinite",
  "@keyframes pulse": {
    "0%, 100%": {
      height: "8px",
      opacity: 0.6,
    },
    "50%": {
      height: "24px",
      opacity: 1,
    },
  },
}));

const TimeDisplay = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 500,
  color: theme.palette.text.secondary,
  minWidth: "40px",
  textAlign: "center",
}));

const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ mediaUrl, onError }) => {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play();
      } else if (repeatMode === "all") {
        audio.currentTime = 0;
        audio.play();
      } else {
        setIsPlaying(false);
      }
    };

    const handleError = () => {
      onError(t("media.failedToLoadAudio"));
    };

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
  }, [repeatMode, onError, t]);

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

  const handleRepeatToggle = () => {
    const modes: ("off" | "all" | "one")[] = ["off", "all", "one"];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  return (
    <AudioCard>
      <AudioCardContent>
        {/* Header */}
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            {t("media.audioPlayer")}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("media.nowPlaying")}
          </Typography>
        </Box>

        {/* Visualizer */}
        {isPlaying && (
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: 0.5,
              height: 40,
              mb: 3,
            }}
          >
            {[...Array(12)].map((_, i) => (
              <VisualizerBar
                key={i}
                sx={{
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </Box>
        )}

        {/* Progress Bar */}
        <Box sx={{ mb: 2 }}>
          <Slider
            value={currentTime}
            onChange={handleProgressChange}
            max={duration || 100}
            step={0.1}
            disabled={isLoading}
            sx={{
              "& .MuiSlider-thumb": {
                width: 14,
                height: 14,
                transition: "0.3s cubic-bezier(.47,.1,.89,.6)",
                "&:hover": {
                  boxShadow: "0 0 0 8px rgba(0, 0, 0, 0.1)",
                },
              },
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>
            <TimeDisplay>{formatTime(duration)}</TimeDisplay>
          </Box>
        </Box>

        {/* Loading Progress */}
        {isLoading && <LinearProgress sx={{ mb: 2 }} />}

        {/* Controls - All in one row */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          {/* Left: Repeat */}
          <Tooltip title={repeatMode === "off" ? t("media.repeatOff") : repeatMode === "all" ? t("media.repeatAll") : t("media.repeatOne")}>
            <IconButton
              onClick={handleRepeatToggle}
              color={repeatMode !== "off" ? "primary" : "default"}
              sx={{ width: 40, height: 40 }}
            >
              {repeatMode === "one" ? <RepeatOneIcon /> : <RepeatIcon />}
            </IconButton>
          </Tooltip>

          {/* Center: Play/Pause */}
          <Tooltip title={isPlaying ? t("media.pause") : t("media.play")}>
            <IconButton
              onClick={handlePlayPause}
              color="primary"
              sx={{
                width: 56,
                height: 56,
                backgroundColor: (theme) => `${theme.palette.primary.main}20`,
                "&:hover": {
                  backgroundColor: (theme) => `${theme.palette.primary.main}30`,
                },
              }}
            >
              {isPlaying ? (
                <PauseIcon sx={{ fontSize: 32 }} />
              ) : (
                <PlayIcon sx={{ fontSize: 32 }} />
              )}
            </IconButton>
          </Tooltip>

          {/* Right: Volume Control */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 120 }}>
            <Tooltip title={isMuted ? t("media.unmute") : t("media.mute")}>
              <IconButton onClick={handleMuteToggle} sx={{ width: 40, height: 40 }}>
                {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
              </IconButton>
            </Tooltip>
            <Slider
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              min={0}
              max={1}
              step={0.05}
              sx={{ width: 80 }}
            />
          </Box>
        </Box>
      </AudioCardContent>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={mediaUrl}
        {...({ controlsList: "nodownload" } as any)}
      >
        {t("media.audioNotSupported")}
      </audio>
    </AudioCard>
  );
};

export default AudioPlayer;
