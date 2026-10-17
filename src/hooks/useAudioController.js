import { useState, useEffect, useRef, useCallback } from 'react';
import { Howl, Howler } from 'howler';
import playlistData from '../data/playlist.json';

/**
 * Audio Engine
 * Manages the global Howler context, handles crossfading, volume control, and playback state.
 */
export function useAudioController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const howls = useRef({}); // Cache for loaded tracks

  // Initialize howler instance globally for volume control
  useEffect(() => {
    Howler.volume(isMuted ? 0 : 1);
  }, [isMuted]);

  // Lazy load and cache a track
  const getOrCreateHowl = useCallback((trackId) => {
    if (howls.current[trackId]) return howls.current[trackId];
    
    const trackInfo = playlistData.tracks.find(t => t.id === trackId);
    if (!trackInfo) return null;

    const howl = new Howl({
      src: [trackInfo.src],
      loop: true,
      volume: 0, // Starts at 0 for fade in
      html5: true, // Force HTML5 audio to allow playing large files before full load
      preload: true,
      onloaderror: (_id, err) => {
        console.warn(`[AudioController] Track "${trackId}" could not be loaded:`, err);
      },
      onplayerror: (_id, err) => {
        console.warn(`[AudioController] Playback error for track "${trackId}":`, err);
      }
    });

    howls.current[trackId] = {
      howl,
      maxVolume: trackInfo.volume ?? 0.5,
      crossfadeDur: trackInfo.crossfade ?? 2000
    };
    return howls.current[trackId];
  }, []);

  const crossfade = useCallback((oldId, newId) => {
    const oldTrack = getOrCreateHowl(oldId);
    const newTrack = getOrCreateHowl(newId);
    
    if (oldTrack?.howl) {
      oldTrack.howl.fade(oldTrack.howl.volume(), 0, newTrack?.crossfadeDur || 2000);
      setTimeout(() => {
        try {
          oldTrack.howl.stop();
        } catch {
          // ignore cleanup errors
        }
      }, newTrack?.crossfadeDur || 2000);
    }
    
    if (newTrack?.howl) {
      try {
        newTrack.howl.play();
        newTrack.howl.fade(0, newTrack.maxVolume, newTrack.crossfadeDur || 2000);
      } catch (err) {
        console.warn(`[AudioController] Error during crossfade to "${newId}":`, err);
      }
    }
    
    setCurrentTrackId(newId);
    setIsPlaying(true);
  }, [getOrCreateHowl]);

  const playTrack = useCallback((trackId) => {
    const trackData = getOrCreateHowl(trackId);
    if (!trackData) {
      console.warn(`[AudioController] Track "${trackId}" not found in playlist.`);
      return;
    }

    if (currentTrackId && currentTrackId !== trackId) {
      crossfade(currentTrackId, trackId);
    } else {
      try {
        trackData.howl.play();
        trackData.howl.fade(0, trackData.maxVolume, 2000);
        setIsPlaying(true);
        setCurrentTrackId(trackId);
      } catch (err) {
        console.warn(`[AudioController] Error playing track "${trackId}":`, err);
      }
    }
  }, [currentTrackId, crossfade, getOrCreateHowl]);

  const pauseTrack = useCallback(() => {
    if (!currentTrackId) return;
    const trackData = howls.current[currentTrackId];
    if (trackData?.howl) {
      try {
        trackData.howl.fade(trackData.howl.volume(), 0, 1000);
        setTimeout(() => {
          try {
            trackData.howl.pause();
          } catch {
            // ignore
          }
        }, 1000);
      } catch {
        // ignore
      }
    }
    setIsPlaying(false);
  }, [currentTrackId]);

  const toggleMute = useCallback(() => setIsMuted(prev => !prev), []);

  const playSfx = useCallback((sfxId) => {
    if (isMuted) return;
    const src = playlistData.sfx?.[sfxId];
    if (src) {
      try {
        const sfx = new Howl({
          src: [src],
          onloaderror: () => {
            // Gracefully ignore missing optional sfx
          },
          onplayerror: () => {}
        });
        sfx.play();
      } catch {
        // Safe fallback
      }
    }
  }, [isMuted]);

  return { isPlaying, isMuted, currentTrackId, playTrack, pauseTrack, toggleMute, playSfx };
}
