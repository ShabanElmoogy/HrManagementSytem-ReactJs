import React from 'react';
import { useMediaPlayer } from '../contexts/MediaPlayerContext';
import AudioPlayer from '../mediaViewer/components/AudioPlayer';

const PersistentMediaPlayer: React.FC = () => {
  const { mediaState, setMinimal, closePlayer } = useMediaPlayer();

  if (!mediaState.mediaUrl || mediaState.type !== 'audio') {
    return null;
  }

  return (
    <AudioPlayer
      mediaUrl={mediaState.mediaUrl}
      isMinimal={mediaState.isMinimal}
      onError={(message) => console.error(message)}
      onBack={() => {
        if (mediaState.isMinimal) {
          closePlayer();
        } else {
          setMinimal(true);
        }
      }}
    />
  );
};

export default PersistentMediaPlayer;