import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Howl, Howler } from 'howler';
import playlistData from '../data/playlist.json';

/**
 * Shared Background Audio Controller
 *
 * Central audio engine managing background music across all scenes:
 *   - Only ONE active BGM at a time with smooth 700-800ms crossfading
 *   - Configurable per-track volume balancing & looping
 *   - Deduplication: requesting the already-playing track is a smooth no-op
 *   - Autoplay handling: catches restrictions gracefully and retries on first gesture
 *   - Stale prevention: delayed retries never play obsolete tracks after scene change
 *   - Graceful error handling: missing assets never break navigation
 */
export function useAudioController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState(null);

  const howlsRef = useRef({}); // Cache for loaded Howl instances
  const currentTrackIdRef = useRef(null);
  const pendingTrackIdRef = useRef(null);
  const fadeTimersRef = useRef({});

  // Sync mute state with Howler
  useEffect(() => {
    Howler.volume(isMuted ? 0 : 1);
  }, [isMuted]);

  // Lazy-load and cache Howl instance for a track
  const getOrCreateHowl = useCallback((trackId) => {
    if (howlsRef.current[trackId]) return howlsRef.current[trackId];

    const trackInfo = playlistData.tracks.find((t) => t.id === trackId);
    if (!trackInfo) return null;

    const howl = new Howl({
      src: [trackInfo.src],
      loop: trackInfo.loop !== false,
      volume: 0,
      html5: true, // Use HTML5 audio elements to stream without waiting for full decode
      preload: true,
      onloaderror: (_id, err) => {
        console.warn(`[AudioController] Track "${trackId}" (${trackInfo.src}) load warning:`, err);
      },
      onplayerror: (_id, err) => {
        console.warn(`[AudioController] Autoplay restricted for "${trackId}":`, err);
        // Save pending track for retry on user gesture if still requested
        pendingTrackIdRef.current = trackId;
      },
    });

    // Ensure reliable continuous looping for background tracks even with HTML5 streaming
    if (trackInfo.loop !== false) {
      howl.on('end', () => {
        if (currentTrackIdRef.current === trackId) {
          try {
            howl.seek(0);
            howl.play();
          } catch {
            // ignore
          }
        }
      });
    }

    howlsRef.current[trackId] = {
      howl,
      maxVolume: trackInfo.volume ?? 0.45,
      crossfadeDur: trackInfo.crossfade ?? 800,
    };
    return howlsRef.current[trackId];
  }, []);

  // Request a background soundtrack
  const playTrack = useCallback(
    (trackId, options = {}) => {
      if (!trackId) return;

      // 1. If this exact track is ALREADY the active requested track, do not restart or mute
      if (currentTrackIdRef.current === trackId) {
        const currentData = howlsRef.current[trackId];
        if (currentData?.howl) {
          if (currentData.howl.playing()) {
            return;
          }
          clearTimeout(fadeTimersRef.current[trackId]);
          currentData.howl.play();
          setIsPlaying(true);
          return;
        }
      }

      const prevTrackId = currentTrackIdRef.current;
      currentTrackIdRef.current = trackId;
      pendingTrackIdRef.current = null;
      setCurrentTrackId(trackId);

      const newTrackData = getOrCreateHowl(trackId);
      if (!newTrackData) {
        console.warn(`[AudioController] Track "${trackId}" not found in playlist.`);
        return;
      }

      const crossfadeDur = options.crossfadeDur ?? newTrackData.crossfadeDur ?? 800;

      // 2. Fade out and stop previous track
      if (prevTrackId && prevTrackId !== trackId) {
        const oldTrackData = howlsRef.current[prevTrackId];
        if (oldTrackData?.howl) {
          clearTimeout(fadeTimersRef.current[prevTrackId]);
          try {
            const currentVol = oldTrackData.howl.volume();
            oldTrackData.howl.fade(currentVol, 0, crossfadeDur);
            fadeTimersRef.current[prevTrackId] = setTimeout(() => {
              try {
                oldTrackData.howl.stop();
              } catch {
                // ignore
              }
            }, crossfadeDur + 50);
          } catch (e) {
            console.warn('[AudioController] Error fading out previous track:', e);
          }
        }
      }

      // 3. Start incoming track
      try {
        clearTimeout(fadeTimersRef.current[trackId]);
        newTrackData.howl.volume(0);
        const playId = newTrackData.howl.play();

        // If options specify restart from beginning
        if (options.restart) {
          newTrackData.howl.seek(0, playId);
        }

        newTrackData.howl.fade(0, newTrackData.maxVolume, crossfadeDur, playId);
        setIsPlaying(true);
      } catch (err) {
        console.warn(`[AudioController] Playback attempt error for "${trackId}":`, err);
        pendingTrackIdRef.current = trackId;
      }
    },
    [getOrCreateHowl]
  );

  // Stop / fade out all BGM (used when entering Sonic Bloom or on unmount)
  const stopBgm = useCallback((fadeDuration = 600) => {
    const activeId = currentTrackIdRef.current;
    currentTrackIdRef.current = null;
    pendingTrackIdRef.current = null;
    setCurrentTrackId(null);
    setIsPlaying(false);

    if (activeId && howlsRef.current[activeId]) {
      const trackData = howlsRef.current[activeId];
      clearTimeout(fadeTimersRef.current[activeId]);
      try {
        const vol = trackData.howl.volume();
        trackData.howl.fade(vol, 0, fadeDuration);
        fadeTimersRef.current[activeId] = setTimeout(() => {
          try {
            trackData.howl.stop();
          } catch {
            // ignore
          }
        }, fadeDuration + 50);
      } catch {
        // ignore
      }
    }
  }, []);

  const pauseTrack = useCallback(() => {
    const activeId = currentTrackIdRef.current;
    if (!activeId) return;
    const trackData = howlsRef.current[activeId];
    if (trackData?.howl) {
      try {
        trackData.howl.fade(trackData.howl.volume(), 0, 600);
        setTimeout(() => {
          try {
            trackData.howl.pause();
          } catch {
            // ignore
          }
        }, 600);
      } catch {
        // ignore
      }
    }
    setIsPlaying(false);
  }, []);

  const toggleMute = useCallback(() => setIsMuted((prev) => !prev), []);

  const playSfx = useCallback(
    (sfxId) => {
      if (isMuted) return;
      const src = playlistData.sfx?.[sfxId];
      if (src) {
        try {
          const sfx = new Howl({
            src: [src],
            volume: 0.6,
            onloaderror: () => {},
            onplayerror: () => {},
          });
          sfx.play();
        } catch {
          // Safe fallback
        }
      }
    },
    [isMuted]
  );

  // Autoplay recovery listener: unlocks pending audio on first legitimate user interaction
  useEffect(() => {
    const unlockAudio = () => {
      // Resume Howler AudioContext if suspended
      if (Howler.ctx && Howler.ctx.state === 'suspended') {
        Howler.ctx.resume().catch(() => {});
      }

      // If there is a pending track that is STILL the active scene track, retry it now
      const pending = pendingTrackIdRef.current;
      if (pending && pending === currentTrackIdRef.current) {
        pendingTrackIdRef.current = null;
        playTrack(pending);
      }
    };

    const timers = fadeTimersRef.current;
    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      // Clean up timers
      Object.values(timers).forEach(clearTimeout);
    };
  }, [playTrack]);

  return useMemo(
    () => ({
      isPlaying,
      isMuted,
      currentTrackId,
      playTrack,
      stopBgm,
      pauseTrack,
      toggleMute,
      playSfx,
    }),
    [isPlaying, isMuted, currentTrackId, playTrack, stopBgm, pauseTrack, toggleMute, playSfx]
  );
}
