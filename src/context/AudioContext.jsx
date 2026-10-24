import { createContext, useContext } from 'react';
import { useAudioController } from '../hooks/useAudioController';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const audioState = useAudioController();

  return (
    <AudioContext.Provider value={audioState}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
};
