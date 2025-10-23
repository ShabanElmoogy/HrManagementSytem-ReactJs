import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MediaPlayerState {
  type: 'audio' | 'video' | null;
  mediaUrl: string | null;
  isMinimal: boolean;
  fileName?: string;
}

interface MediaPlayerContextType {
  mediaState: MediaPlayerState;
  setAudioPlayer: (url: string, fileName?: string) => void;
  setVideoPlayer: (url: string, fileName?: string) => void;
  setMinimal: (minimal: boolean) => void;
  closePlayer: () => void;
}

const MediaPlayerContext = createContext<MediaPlayerContextType | undefined>(undefined);

export const MediaPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mediaState, setMediaState] = useState<MediaPlayerState>({
    type: null,
    mediaUrl: null,
    isMinimal: false,
  });

  const setAudioPlayer = (url: string, fileName?: string) => {
    setMediaState({
      type: 'audio',
      mediaUrl: url,
      isMinimal: false,
      fileName,
    });
  };

  const setVideoPlayer = (url: string, fileName?: string) => {
    setMediaState({
      type: 'video',
      mediaUrl: url,
      isMinimal: false,
      fileName,
    });
  };

  const setMinimal = (minimal: boolean) => {
    setMediaState(prev => ({ ...prev, isMinimal: minimal }));
  };

  const closePlayer = () => {
    setMediaState({
      type: null,
      mediaUrl: null,
      isMinimal: false,
    });
  };

  return (
    <MediaPlayerContext.Provider value={{
      mediaState,
      setAudioPlayer,
      setVideoPlayer,
      setMinimal,
      closePlayer,
    }}>
      {children}
    </MediaPlayerContext.Provider>
  );
};

export const useMediaPlayer = () => {
  const context = useContext(MediaPlayerContext);
  if (!context) {
    throw new Error('useMediaPlayer must be used within MediaPlayerProvider');
  }
  return context;
};