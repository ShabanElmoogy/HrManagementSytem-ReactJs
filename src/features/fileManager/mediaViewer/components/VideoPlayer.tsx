import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Slider,
  IconButton,
  Tooltip,
  LinearProgress,
  Grid,
  Typography,
} from "@mui/material";
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  FileDownload as DownloadIcon,
  Settings as SettingsIcon,
  PictureInPicture as PipIcon,
  Repeat as RepeatIcon,
  RepeatOne as RepeatOneIcon,
  Speed as SpeedIcon,
  SkipNext as SkipNextIcon,
  SkipPrevious as SkipPreviousIcon,
  Bookmark as BookmarkIcon,
  MenuOpen as SidebarIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import TimeMarks from './TimeMarks';
import VideoSidebar from './VideoSidebar';

interface VideoPlayerProps {
  mediaUrl: string;
  onError: (message: string) => void;
  onBack?: () => void;
}

const VideoContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "100%",
  position: "relative",
  backgroundColor: "#000",
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  border: `1px solid ${theme.palette.divider}`,
  "&:hover .controls-overlay": {
    opacity: 1,
  },
}));

const VideoElement = styled("video")(({ theme }) => ({
  width: "100%",
  height: "auto",
  maxHeight: "80vh",
  display: "block",
  backgroundColor: "#000",
  cursor: "pointer",
}));

const ControlsOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)",
  padding: theme.spacing(2),
  opacity: 0,
  transition: "opacity 0.3s ease",
  zIndex: 10,
  backdropFilter: "blur(4px)",
}));

const TopControlsOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)",
  padding: theme.spacing(2),
  opacity: 0,
  transition: "opacity 0.3s ease",
  zIndex: 10,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const TimeDisplay = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: 500,
  color: "#fff",
  minWidth: "35px",
  textAlign: "center",
  fontVariantNumeric: "tabular-nums",
}));

const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ mediaUrl, onError, onBack }) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");
  const [showTimeMarks, setShowTimeMarks] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleEnded = () => {
      if (repeatMode === "one") {
        video.currentTime = 0;
        video.play();
      } else if (repeatMode === "all") {
        video.currentTime = 0;
        video.play();
      } else {
        setIsPlaying(false);
      }
    };

    const handleError = () => {
      onError(t("media.failedToLoadVideo", { code: "unknown" }));
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
    };
  }, [onError, t]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressChange = (_: Event, newValue: number | number[]) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    if (videoRef.current) {
      videoRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const handleVolumeChange = (_: Event, newValue: number | number[]) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
    }
    if (value > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = mediaUrl;
    link.download = "video.mp4";
    link.click();
  };

  const handlePlaybackRateChange = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextRate;
    }
  };

  const handlePictureInPicture = async () => {
    if (videoRef.current) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      } catch (error) {
        console.error("PiP error:", error);
      }
    }
  };

  const handleRepeatToggle = () => {
    const modes: ("off" | "all" | "one")[] = ["off", "all", "one"];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  return (
    <VideoContainer
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      sx={{
        maxHeight: isFullscreen ? "100vh" : "80vh",
        marginRight: showSidebar ? "350px" : 0,
        transition: "margin-right 0.3s ease",
      }}
    >
      <VideoElement
        ref={videoRef}
        src={mediaUrl}
        {...({ controlsList: "nodownload" } as any)}
        preload="metadata"
        onClick={handlePlayPause}
        onLoadStart={() => console.log("Video load started")}
        onLoadedMetadata={() => {
          console.log("Video metadata loaded");
          onError("");
        }}
        onCanPlay={() => console.log("Video can play")}
      >
        {t("media.videoNotSupported")}
      </VideoElement>

      {/* Center Play Button Overlay */}
      {!isPlaying && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 5,
            opacity: showControls ? 1 : 0.7,
            transition: "opacity 0.3s ease",
          }}
        >
          <IconButton
            onClick={handlePlayPause}
            sx={{
              width: 80,
              height: 80,
              backgroundColor: "rgba(0,0,0,0.7)",
              color: "#fff",
              backdropFilter: "blur(10px)",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.8)",
                transform: "scale(1.1)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <PlayIcon sx={{ fontSize: 40 }} />
          </IconButton>
        </Box>
      )}

      {/* Loading Progress */}
      {isLoading && <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0 }} />}

      {/* Top Controls */}
      <TopControlsOverlay
        className="controls-overlay"
        sx={{
          opacity: showControls ? 1 : 0,
        }}
      >
        <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: "1rem" }}>
          {t("media.videoPlayer")}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title={t("media.download")}>
            <IconButton
              onClick={handleDownload}
              sx={{
                color: "#fff",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Picture in Picture">
            <IconButton
              onClick={handlePictureInPicture}
              sx={{
                color: "#fff",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              <PipIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Time Marks">
            <IconButton
              onClick={() => setShowTimeMarks(true)}
              sx={{
                color: "#fff",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              <BookmarkIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notes & Bookmarks">
            <IconButton
              onClick={() => setShowSidebar(!showSidebar)}
              sx={{
                color: showSidebar ? "#1976d2" : "#fff",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              <SidebarIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </TopControlsOverlay>

      {/* Bottom Controls */}
      <ControlsOverlay
        className="controls-overlay"
        sx={{
          opacity: showControls ? 1 : 0,
        }}
      >
        {/* Progress Bar */}
        <Box sx={{ mb: 1.5 }}>
          <Slider
            value={currentTime}
            onChange={handleProgressChange}
            max={duration || 100}
            step={0.1}
            disabled={isLoading}
            sx={{
              color: "#fff",
              "& .MuiSlider-thumb": {
                width: 12,
                height: 12,
                backgroundColor: "#fff",
                transition: "0.3s cubic-bezier(.47,.1,.89,.6)",
                "&:hover": {
                  boxShadow: "0 0 0 8px rgba(255, 255, 255, 0.2)",
                },
              },
              "& .MuiSlider-track": {
                backgroundColor: "#fff",
              },
              "& .MuiSlider-rail": {
                backgroundColor: "rgba(255, 255, 255, 0.3)",
              },
            }}
          />
        </Box>

        {/* Main Controls Row */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          {/* Left: Time Display */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>
            <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.75rem" }}>/</Typography>
            <TimeDisplay>{formatTime(duration)}</TimeDisplay>
          </Box>

          {/* Center: Play Controls */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Previous (-30s)">
              <IconButton
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = Math.max(0, currentTime - 30);
                  }
                }}
                sx={{
                  color: "#fff",
                  width: 32,
                  height: 32,
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                <SkipPreviousIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Skip -10s">
              <IconButton
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = Math.max(0, currentTime - 10);
                  }
                }}
                sx={{
                  color: "#fff",
                  width: 32,
                  height: 32,
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                <Typography sx={{ fontSize: "0.6rem", fontWeight: 600 }}>-10</Typography>
              </IconButton>
            </Tooltip>

            <Tooltip title={isPlaying ? t("media.pause") : t("media.play")}>
              <IconButton
                onClick={handlePlayPause}
                sx={{
                  color: "#fff",
                  width: 48,
                  height: 48,
                  backgroundColor: "rgba(255,255,255,0.15)",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.25)",
                  },
                }}
              >
                {isPlaying ? (
                  <PauseIcon sx={{ fontSize: 24 }} />
                ) : (
                  <PlayIcon sx={{ fontSize: 24 }} />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Skip +10s">
              <IconButton
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = Math.min(duration, currentTime + 10);
                  }
                }}
                sx={{
                  color: "#fff",
                  width: 32,
                  height: 32,
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                <Typography sx={{ fontSize: "0.6rem", fontWeight: 600 }}>+10</Typography>
              </IconButton>
            </Tooltip>

            <Tooltip title="Next (+30s)">
              <IconButton
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = Math.min(duration, currentTime + 30);
                  }
                }}
                sx={{
                  color: "#fff",
                  width: 32,
                  height: 32,
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                <SkipNextIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Right: Additional Controls */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title={repeatMode === "off" ? "Repeat Off" : repeatMode === "all" ? "Repeat All" : "Repeat One"}>
              <IconButton
                onClick={handleRepeatToggle}
                sx={{
                  color: repeatMode !== "off" ? "#1976d2" : "#fff",
                  width: 28,
                  height: 28,
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                {repeatMode === "one" ? <RepeatOneIcon fontSize="small" /> : <RepeatIcon fontSize="small" />}
              </IconButton>
            </Tooltip>

            <Tooltip title={`Speed: ${playbackRate}x`}>
              <IconButton
                onClick={handlePlaybackRateChange}
                sx={{
                  color: "#fff",
                  width: 28,
                  height: 28,
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                <Typography sx={{ fontSize: "0.6rem", fontWeight: 600 }}>{playbackRate}x</Typography>
              </IconButton>
            </Tooltip>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 70 }}>
              <Tooltip title={isMuted ? t("media.unmute") : t("media.mute")}>
                <IconButton
                  onClick={handleMuteToggle}
                  sx={{
                    color: "#fff",
                    width: 28,
                    height: 28,
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  {isMuted ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
              <Slider
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                min={0}
                max={1}
                step={0.05}
                sx={{
                  width: 50,
                  color: "#fff",
                  "& .MuiSlider-thumb": {
                    width: 8,
                    height: 8,
                  },
                }}
              />
            </Box>

            <Tooltip title={isFullscreen ? t("media.exitFullscreen") : t("media.fullscreen")}>
              <IconButton
                onClick={handleFullscreen}
                sx={{
                  color: "#fff",
                  width: 28,
                  height: 28,
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </ControlsOverlay>
      
      <TimeMarks
        currentTime={currentTime}
        onSeek={(time) => {
          if (videoRef.current) {
            videoRef.current.currentTime = time;
          }
        }}
        isOpen={showTimeMarks}
        onClose={() => setShowTimeMarks(false)}
      />
      
      <VideoSidebar
        open={showSidebar}
        onClose={() => setShowSidebar(false)}
        currentTime={currentTime}
        onSeek={(time) => {
          if (videoRef.current) {
            videoRef.current.currentTime = time;
          }
        }}
      />
    </VideoContainer>
  );
};

export default VideoPlayer;
