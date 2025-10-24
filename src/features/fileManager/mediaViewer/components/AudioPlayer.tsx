import React from "react";
import { Card, Box} from "@mui/material";
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
      width: "calc(100vw - 500px)", 
      height: "calc(100vh - 100px)", 
      display: "flex", 
      flexDirection: "column"
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
        
        <TimeDisplay currentTime={currentTime} duration={duration} formatTime={formatTime} />

        {/* All Controls in One Row */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <RepeatToggle isRepeat={isRepeat} onToggle={toggleRepeatMode} rotateAnim={`${rotate} 2s linear infinite`} />
          </Box>

          <PlaybackControls
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onSkipBack={() => handleSkip(-10)}
            onPrev={undefined}
            onNext={undefined}
            onSkipForward={() => handleSkip(10)}
            pulseAnim={isPlaying ? `${pulse} 2s infinite` : 'none'}
          />
          
          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onChange={handleVolumeChange}
            onToggleMute={handleMuteToggle}
            pulseAnim={!isMuted && isPlaying ? `${pulse} 3s infinite` : 'none'}
          />
        </Box>
      </Box>

      <audio ref={audioRef} src={mediaUrl}>
        {t("media.audioNotSupported")}
      </audio>
    </Card>
  );
};

export default AudioPlayer;