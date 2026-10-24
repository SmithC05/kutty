import { createContext, useContext, useMemo } from 'react';
import { useAudioController } from '../hooks/useAudioController';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const audioState = useAudioController();

  const value = useMemo(() => audioState, [
    audioState.isPlaying,
    audioState.isMuted,
    audioState.currentTrackId,
    audioState.playTrack,
    audioState.stopBgm,
    audioState.pauseTrack,
    audioState.toggleMute,
    audioState.playSfx
  ]);

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
};
