import React, { useRef, useState, useEffect } from "react";
import {
  Card,
  Box,
  Slider,
  IconButton,
  Typography,
  keyframes,
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
  Repeat as RepeatIcon,
  Album as AlbumIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface AudioPlayerProps {
  mediaUrl: string;
  onError: (message: string) => void;
  onBack?: () => void;
  isMinimal?: boolean;
}

const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const wave = keyframes`
  0%, 100% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(25, 118, 210, 0.3); }
  50% { box-shadow: 0 0 20px rgba(25, 118, 210, 0.8); }
`;

const slideIn = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const AudioPlayer: React.FC<AudioPlayerProps> = ({ mediaUrl, onError, onBack, isMinimal = false }) => {
  const { t } = useTranslation();
  
  const setPosition = (url: string, time: number) => {
    localStorage.setItem(`audio-${url}`, time.toString());
  };
  
  const getPosition = (url: string) => {
    return parseFloat(localStorage.getItem(`audio-${url}`) || '0');
  };
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isPictureInPicture, setIsPictureInPicture] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [audioData, setAudioData] = useState<number[]>(Array(32).fill(0));

  // Simulate audio data for visualization
  useEffect(() => {
    let animationId: number;
    
    const updateAudioData = () => {
      if (isPlaying) {
        setAudioData(prev => 
          prev.map((_, i) => 
            Math.random() * 0.7 + 0.3 + Math.sin(Date.now() / 200 + i) * 0.2
          )
        );
      }
      animationId = requestAnimationFrame(updateAudioData);
    };
    
    if (isPlaying) {
      updateAudioData();
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      const savedPosition = getPosition(mediaUrl);
      if (savedPosition > 0) {
        audio.currentTime = savedPosition;
        setCurrentTime(savedPosition);
      }
    };
    const handleTimeUpdate = () => {
      const time = audio.currentTime;
      setCurrentTime(time);
      setPosition(mediaUrl, time);
    };
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        setIsPlaying(false);
      }
    };
    const handleError = () => onError(t("media.failedToLoadAudio"));

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      if (audio.currentTime > 0) {
        setPosition(mediaUrl, audio.currentTime);
      }
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [onError, t, isRepeat, mediaUrl]);

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

  const handleBack = () => {
    if (audioRef.current?.currentTime) {
      setPosition(mediaUrl, audioRef.current.currentTime);
    }
    onBack?.();
  };

  if (isMinimal) {
    return (
      <Card sx={{ 
        position: "fixed", 
        bottom: 20, 
        right: 20, 
        width: 350, 
        height: 60, 
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        p: 1,
        gap: 1,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        backgroundColor: "background.paper",
        animation: `${slideIn} 0.3s ease-out`,
        transition: "all 0.3s ease",
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: "0 6px 16px rgba(0,0,0,0.4)"
        }
      }}>
        <IconButton 
          onClick={handlePlayPause} 
          size="small"
          sx={{
            animation: isPlaying ? `${pulse} 2s infinite` : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Slider
            value={currentTime}
            onChange={handleProgressChange}
            max={duration || 100}
            size="small"
            sx={{
              '& .MuiSlider-thumb': {
                animation: isPlaying ? `${glow} 2s infinite` : 'none'
              }
            }}
          />
        </Box>
        <Typography variant="caption" sx={{ minWidth: 40 }}>
          {formatTime(currentTime)}
        </Typography>
        <IconButton onClick={handleMuteToggle} size="small">
          {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </IconButton>
        <audio ref={audioRef} src={mediaUrl}>
          {t("media.audioNotSupported")}
        </audio>
      </Card>
    );
  }

  if (isPictureInPicture) {
    return (
      <Card sx={{ 
        position: "fixed", 
        bottom: 20, 
        right: 20, 
        width: 300, 
        height: 80, 
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        p: 1,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        backgroundColor: "background.paper",
        animation: `${slideIn} 0.3s ease-out`,
        transition: "all 0.3s ease",
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: "0 6px 16px rgba(0,0,0,0.4)"
        }
      }}>
        <IconButton 
          onClick={handlePlayPause} 
          size="small"
          sx={{
            animation: isPlaying ? `${pulse} 2s infinite` : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </IconButton>
        <Box sx={{ flex: 1, mx: 1 }}>
          <Slider
            value={currentTime}
            onChange={handleProgressChange}
            max={duration || 100}
            size="small"
            sx={{
              '& .MuiSlider-thumb': {
                animation: isPlaying ? `${glow} 2s infinite` : 'none'
              }
            }}
          />
        </Box>
        <IconButton 
          onClick={() => setIsPictureInPicture(false)} 
          size="small"
          sx={{
            transition: 'all 0.2s ease',
            '&:hover': { transform: 'scale(1.1)' }
          }}
        >
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
          overflow: "hidden"
        }}
      >
        {/* Rotating Vinyl Disc */}
        <Box
          sx={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "linear-gradient(45deg, #333 0%, #666 50%, #333 100%)",
            animation: isPlaying ? `${rotate} 3s linear infinite` : 'none',
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.3,
            '&::before': {
              content: '""',
              position: 'absolute',
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: '#000',
              zIndex: 1
            }
          }}
        >
          <AlbumIcon sx={{ fontSize: 60, color: 'primary.main', zIndex: 2 }} />
        </Box>

        {/* Enhanced Waveform Visualizer */}
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 1, 
          height: 120,
          zIndex: 3,
          position: 'relative'
        }}>
          {audioData.map((value, i) => (
            <Box
              key={i}
              sx={{
                width: 3,
                height: isPlaying ? `${value * 80}px` : "4px",
                backgroundColor: `hsl(${200 + i * 5}, 70%, 60%)`,
                borderRadius: 2,
                animation: isPlaying ? `${wave} ${0.5 + (i % 3) * 0.2}s infinite ${i * 0.1}s` : 'none',
                transition: "all 0.2s ease",
                opacity: isPlaying ? 0.8 : 0.3,
                boxShadow: isPlaying ? `0 0 10px hsl(${200 + i * 5}, 70%, 60%)` : 'none'
              }}
            />
          ))}
        </Box>

        {/* Floating Particles */}
        {isPlaying && [...Array(6)].map((_, i) => (
          <Box
            key={`particle-${i}`}
            sx={{
              position: 'absolute',
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              opacity: 0.6,
              animation: `${wave} ${2 + i * 0.5}s infinite ${i * 0.3}s`,
              left: `${20 + i * 12}%`,
              top: `${30 + Math.sin(i) * 20}%`
            }}
          />
        ))}
      </Box>

      {/* Controls */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        {/* Progress */}
        <Slider
          value={currentTime}
          onChange={handleProgressChange}
          max={duration || 100}
          sx={{ 
            mb: 1,
            '& .MuiSlider-thumb': {
              animation: isPlaying ? `${glow} 2s infinite` : 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.2)'
              }
            },
            '& .MuiSlider-track': {
              background: isPlaying ? 'linear-gradient(90deg, #1976d2, #9c27b0)' : undefined,
              transition: 'all 0.3s ease'
            }
          }}
        />
        
        {/* Time Display */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="caption">{formatTime(currentTime)}</Typography>
          <Typography variant="caption">{formatTime(duration)}</Typography>
        </Box>

        {/* All Controls in One Row */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          {/* Left - Repeat Button */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton 
              onClick={() => setIsRepeat(!isRepeat)} 
              size="medium" 
              color={isRepeat ? "primary" : "default"}
              sx={{
                animation: isRepeat ? `${rotate} 2s linear infinite` : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <RepeatIcon />
            </IconButton>
          </Box>

          {/* Center - Playback Controls */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton 
              onClick={() => handleSkip(-10)} 
              size="medium"
              sx={{
                transition: 'all 0.2s ease',
                '&:hover': { transform: 'scale(1.1)' }
              }}
            >
              <Replay10Icon />
            </IconButton>
            <IconButton 
              size="medium"
              sx={{
                transition: 'all 0.2s ease',
                '&:hover': { transform: 'scale(1.1)' }
              }}
            >
              <SkipPreviousIcon />
            </IconButton>
            <IconButton 
              onClick={handlePlayPause} 
              size="large" 
              color="primary"
              sx={{
                animation: isPlaying ? `${pulse} 2s infinite` : 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 0 20px rgba(25, 118, 210, 0.5)'
                }
              }}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </IconButton>
            <IconButton 
              size="medium"
              sx={{
                transition: 'all 0.2s ease',
                '&:hover': { transform: 'scale(1.1)' }
              }}
            >
              <SkipNextIcon />
            </IconButton>
            <IconButton 
              onClick={() => handleSkip(10)} 
              size="medium"
              sx={{
                transition: 'all 0.2s ease',
                '&:hover': { transform: 'scale(1.1)' }
              }}
            >
              <Forward10Icon />
            </IconButton>
          </Box>
          
          {/* Right - Volume Control */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton 
              onClick={handleMuteToggle} 
              size="small"
              sx={{
                animation: !isMuted && isPlaying ? `${pulse} 3s infinite` : 'none',
                transition: 'all 0.2s ease',
                '&:hover': { transform: 'scale(1.1)' }
              }}
            >
              {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </IconButton>
            <Slider
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              min={0}
              max={1}
              step={0.05}
              sx={{ 
                width: 120,
                '& .MuiSlider-thumb': {
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.2)',
                    boxShadow: '0 0 10px rgba(25, 118, 210, 0.5)'
                  }
                }
              }}
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