import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, ListMusic, MoreHorizontal, Music2, Play, X } from 'lucide-react';
import { useScene } from '../../context/SceneContext';
import { useAudio } from '../../context';
import { SCENES } from '../../constants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { sonicBloomSongs } from '../../data/sonicBloomSongs';
import { CinematicArtworkCard } from './CinematicArtworkCard';
import { SonicBloomTransition } from './SonicBloomTransition';
import { TrackSelector } from './TrackSelector';
import { AudioPlayerShell } from './AudioPlayerShell';
import { ClosingDedication } from './ClosingDedication';
import { LyricsPanel } from './LyricsPanel';
import { ConcertAtmosphere } from './ConcertAtmosphere';
import { ConcertPyrotechnics } from './ConcertPyrotechnics';
import { triggerDevPyrotechnic, SonicBloomAudioEngine } from './audioAnalyzer';

function useIsMobile() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 1024
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    const update = (event) => setMobile(event.matches);
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return mobile;
}

export function SonicBloomScene() {
  const { transitionTo } = useScene();
  const { stopBgm } = useAudio();
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  // The local playlist owns playback while this scene is mounted.
  useEffect(() => {
    stopBgm(500);
  }, [stopBgm]);

  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isTransitionActive, setIsTransitionActive] = useState(!reducedMotion);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const autoStartedRef = useRef(false);
  const [isClosingState, setIsClosingState] = useState(false);
  const [mobileQueueOpen, setMobileQueueOpen] = useState(false);

  const audioRef = useRef(null);
  const engineRef = useRef(null);
  const isPlayingRef = useRef(false);
  const autoAdvanceRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioReactivity, setAudioReactivity] = useState({
    amplitude: 0,
    lowFreq: 0,
    midFreq: 0,
    highFreq: 0,
    progress: 0,
    isPlaying: false,
    isQuiet: false,
    isSustainedHigh: false,
  });

  const startFirstSong = useCallback(() => {
    if (autoStartedRef.current) return;
    autoStartedRef.current = true;
    const audio = audioRef.current;
    if (!audio) return;

    const initialTrack = sonicBloomSongs[0];
    if (!audio.src && initialTrack?.audio?.src) {
      audio.src = initialTrack.audio.src;
    }
    audio.currentTime = 0;
    engineRef.current?.connectAudioElement(audio);
    engineRef.current?.resume();
    audio
      .play()
      .then(() => {
        isPlayingRef.current = true;
        setIsPlaying(true);
        setAutoplayBlocked(false);
      })
      .catch((err) => {
        console.info('[KuttyRadio] Autoplay policy prevented immediate playback:', err);
        setAutoplayBlocked(true);
      });
  }, []);

  const handleTransitionComplete = useCallback(() => {
    setIsTransitionActive(false);
    startFirstSong();
  }, [startFirstSong]);

  useEffect(() => {
    if (reducedMotion && !autoStartedRef.current) {
      startFirstSong();
    }
  }, [reducedMotion, startFirstSong]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Initialize one HTML audio element and one analyzer for the whole playlist.
  useEffect(() => {
    const engine = new SonicBloomAudioEngine();
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    engineRef.current = engine;
    audioRef.current = audio;
    audio.preload = 'metadata';

    const initialTrack = sonicBloomSongs[0];
    if (initialTrack?.audio?.src) {
      audio.src = initialTrack.audio.src;
      setDuration(initialTrack.audio.duration || 0);
    }

    const onTimeUpdate = () =>
      setCurrentTime(Number.isFinite(audio.currentTime) ? audio.currentTime : 0);
    const onLoadedMetadata = () => {
      if (Number.isFinite(audio.duration)) setDuration(audio.duration);
    };
    const onPlay = () => {
      isPlayingRef.current = true;
      setIsPlaying(true);
    };
    const onPause = () => {
      isPlayingRef.current = false;
      setIsPlaying(false);
    };
    const onEnded = () => {
      isPlayingRef.current = false;
      setIsPlaying(false);
      setActiveTrackIndex((previous) => {
        if (previous < sonicBloomSongs.length - 1) {
          autoAdvanceRef.current = true;
          return previous + 1;
        }
        setIsClosingState(true);
        return previous;
      });
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      engine.destroy();
      audioRef.current = null;
      engineRef.current = null;
    };
  }, []);

  // Resume AudioContext on any user interaction (click, tap, key) to satisfy browser autoplay policies
  useEffect(() => {
    const unlockAudio = () => {
      engineRef.current?.resume();
    };
    window.addEventListener('click', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });
    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Switch tracks
  useEffect(() => {
    const audio = audioRef.current;
    const track = sonicBloomSongs[activeTrackIndex];
    if (!audio || !track?.audio?.src) return;

    const shouldContinue = autoAdvanceRef.current || isPlayingRef.current;
    autoAdvanceRef.current = false;
    audio.pause();
    audio.src = track.audio.src;
    audio.load();
    audio.currentTime = 0;
    setCurrentTime(0);
    setDuration(track.audio.duration || 0);

    if (shouldContinue) {
      engineRef.current?.connectAudioElement(audio);
      engineRef.current?.resume();
      audio.play().catch((error) => {
        console.warn('[KuttyRadio] Playback failed:', error);
      });
    }
  }, [activeTrackIndex]);

  // Audio analysis frame loop (60fps smooth analysis)
  useEffect(() => {
    let animationFrame;
    let lastTime = performance.now();

    const update = (now) => {
      const delta = now - lastTime;
      if (delta >= 16) {
        lastTime = now;
        if (engineRef.current) setAudioReactivity(engineRef.current.update(delta));
      }
      animationFrame = requestAnimationFrame(update);
    };

    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const handleTogglePlay = useCallback(() => {
    setAutoplayBlocked(false);
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      return;
    }

    setIsClosingState(false);
    const track = sonicBloomSongs[activeTrackIndex];
    if (!audio.src && track?.audio?.src) audio.src = track.audio.src;
    if (audio.ended || audio.currentTime >= (audio.duration || Infinity)) audio.currentTime = 0;
    engineRef.current?.connectAudioElement(audio);
    engineRef.current?.resume();
    audio.play().catch((error) => {
      console.warn('[KuttyRadio] Audio playback failed:', error);
    });
  }, [activeTrackIndex]);

  const handleSeek = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio) return;
    const upperBound = Number.isFinite(audio.duration) ? audio.duration : Number(time);
    const nextTime = Math.min(Math.max(0, Number(time) || 0), Math.max(0, upperBound));
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }, []);


  // Shift + P for dev testing of pyrotechnics
  useEffect(() => {
    if (!import.meta.env?.DEV) return;
    const handleKey = (event) => {
      if (event.shiftKey && event.key.toLowerCase() === 'p') {
        event.preventDefault();
        triggerDevPyrotechnic('high_freq_peak', { intensity: 0.95 });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const activeTrack = sonicBloomSongs[activeTrackIndex] || sonicBloomSongs[0];

  const handleSelectTrack = useCallback((index) => {
    if (index < 0 || index >= sonicBloomSongs.length) return;
    setAutoplayBlocked(false);
    setIsClosingState(false);
    autoAdvanceRef.current = true;
    setActiveTrackIndex(index);
    setMobileQueueOpen(false);
  }, []);

  const handlePreviousTrack = useCallback(() => {
    setIsClosingState(false);
    setAutoplayBlocked(false);
    autoAdvanceRef.current = true;
    setActiveTrackIndex((previous) => Math.max(0, previous - 1));
  }, []);

  const handleNextTrack = useCallback(() => {
    setIsClosingState(false);
    setAutoplayBlocked(false);
    autoAdvanceRef.current = true;
    setActiveTrackIndex((previous) => Math.min(sonicBloomSongs.length - 1, previous + 1));
  }, []);

  const handleBackToArtist = useCallback(() => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    transitionTo(SCENES.ARTIST_CHAPTER);
  }, [transitionTo]);

  const handleContinueToUs = useCallback(() => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    transitionTo(SCENES.MEMORY_JOURNEY_TOGETHER);
  }, [transitionTo]);

  // Background gradient: dynamic, cohesive listening room adapting to active track theme
  const primaryAccent = activeTrack.colors.primary;
  const secondaryAccent = activeTrack.colors.secondary || '#fb7185';
  const panelBg = activeTrack.colors.panelBg || '#0d0f15';
  const bgMidnight = activeTrack.colors.bgMidnight || '#07080c';
  const isAlakolava = activeTrack.id === 'alakolava';
  const isVennila = activeTrack.id === 'engey-andha-vennnila';
  const isPazham = activeTrack.id === 'life-of-pazham';
  const bgGradient = isClosingState
    ? 'radial-gradient(ellipse at 42% 32%, rgba(245,158,11,0.12) 0%, rgba(13,15,20,0.96) 62%, #08090d 100%)'
    : isAlakolava
    ? 'radial-gradient(ellipse at 75% 15%, rgba(254, 250, 224, 0.18) 0%, transparent 52%), radial-gradient(ellipse at 20% 25%, rgba(244, 114, 182, 0.14) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(107, 143, 113, 0.12) 0%, transparent 50%), radial-gradient(circle at 50% 50%, #221f1dee 0%, #171513 100%)'
    : isVennila
    ? 'radial-gradient(ellipse at 30% 18%, rgba(129, 140, 248, 0.18) 0%, rgba(96, 165, 250, 0.08) 35%, transparent 65%), radial-gradient(ellipse at 85% 75%, rgba(203, 213, 225, 0.08) 0%, transparent 50%), radial-gradient(circle at 50% 50%, #0e1726ee 0%, #070c18 100%)'
    : isPazham
    ? 'radial-gradient(ellipse at 18% 22%, rgba(254, 250, 224, 0.16) 0%, transparent 50%), radial-gradient(ellipse at 78% 70%, rgba(107, 158, 120, 0.16) 0%, transparent 55%), radial-gradient(ellipse at 50% 15%, rgba(135, 152, 106, 0.10) 0%, transparent 50%), radial-gradient(circle at 50% 50%, #142018ee 0%, #0c1510 100%)'
    : `radial-gradient(ellipse at 25% 20%, ${primaryAccent}18 0%, transparent 60%), radial-gradient(ellipse at 75% 75%, ${secondaryAccent}12 0%, transparent 55%), radial-gradient(circle at 50% 50%, ${panelBg}ee 0%, ${bgMidnight} 100%)`;

  return (
    <div
      className="relative h-[100dvh] max-h-[100dvh] w-full overflow-hidden text-white font-['DM_Sans',sans-serif] select-none flex flex-col transition-colors duration-700 ease-in-out"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        backgroundColor: bgMidnight,
      }}
    >
      {/* ── Transition ── */}
      {isTransitionActive && (
        <SonicBloomTransition
          onComplete={handleTransitionComplete}
          reducedMotion={reducedMotion}
        />
      )}

      {/* ── Background Atmosphere & Pyrotechnics ── */}
      <ConcertAtmosphere
        activeTrackIndex={activeTrackIndex}
        primaryColor={activeTrack.colors.primary}
        secondaryColor={activeTrack.colors.secondary}
        accentColor={activeTrack.colors.accent}
        isClosingState={isClosingState}
        isMobile={isMobile}
        audioReactivity={audioReactivity}
      />
      <ConcertPyrotechnics
        activeTrackIndex={activeTrackIndex}
        reducedMotion={reducedMotion}
        isMobile={isMobile}
      />

      {/* Background radial gradient */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-all duration-[1000ms] ease-in-out"
        style={{ background: bgGradient }}
      />

      {/* Subtle audio-grade noise texture */}
      <div
        className="pointer-events-none fixed inset-0 z-[2] opacity-[0.015]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%221%22/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay',
        }}
      />

      {/* ── TOP HEADER BAR (Exact match to reference mockup) ── */}
      <header className="relative z-20 shrink-0 flex items-center justify-between border-b border-white/[0.06] px-4 py-2 sm:px-6 sm:py-2.5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBackToArtist}
            className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 text-xs font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white focus:outline-none focus-visible:ring-2"
            style={{ '--tw-ring-color': primaryAccent }}
            aria-label="Back to the artist portrait"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <div
              className="grid h-7 w-7 place-items-center rounded-lg shadow-sm transition-colors duration-500"
              style={{
                backgroundColor: activeTrack.colors?.headerIconBg || '#a3e635',
                color: activeTrack.colors?.headerIconColor || '#000000',
              }}
              aria-hidden="true"
            >
              <Music2 className="h-4 w-4" />
            </div>
            <span className="flex items-center gap-1.5 text-base font-bold tracking-tight text-white font-['Outfit',sans-serif]">
              <span>Kutty Radio</span>
              <span className="text-rose-400 font-normal text-sm">♡</span>
            </span>

            {/* Subtle audio-reactive mini equalizer next to identity */}
            <div className="flex items-end gap-0.5 ml-1 h-3.5" aria-hidden="true">
              {[0.4, 0.8, 0.5, 0.9, 0.6].map((mult, i) => {
                const barHeight = isPlaying
                  ? Math.max(3, Math.min(13, (audioReactivity.amplitude * 0.7 + mult * 0.3) * 13))
                  : 3;
                return (
                  <span
                    key={i}
                    className="w-0.5 rounded-full transition-all duration-150"
                    style={{
                      height: `${barHeight}px`,
                      backgroundColor: activeTrack.colors?.accent || primaryAccent,
                      opacity: isPlaying ? 0.85 : 0.35,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Center: Subtle Audio Waveform + Tagline (Desktop) */}
        {!isMobile && (
          <div className="hidden md:flex items-center gap-2.5 opacity-90">
            <div className="flex items-end gap-0.5 h-4" aria-hidden="true">
              {[20, 35, 15, 60, 40, 75, 25, 50, 30].map((baseH, i) => {
                const dynamicH = isPlaying
                  ? Math.max(3, Math.min(15, (baseH * 0.15 + audioReactivity.amplitude * 6)))
                  : 3;
                return (
                  <span
                    key={i}
                    className="w-0.5 rounded-full transition-all duration-150"
                    style={{
                      height: `${dynamicH}px`,
                      backgroundColor: `${primaryAccent}bb`,
                      opacity: isPlaying ? 0.85 : 0.3,
                    }}
                  />
                );
              })}
            </div>
            <p className="font-cursive text-lg lg:text-xl text-[#f5d9bb] tracking-wide select-none drop-shadow">
              Some songs feel like you ... ♡
            </p>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Mobile Queue Toggle button */}
          {isMobile && (
            <button
              type="button"
              onClick={() => setMobileQueueOpen((prev) => !prev)}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 text-[11px] font-medium text-slate-300"
            >
              <ListMusic className="h-3.5 w-3.5" />
              <span>Queue (6)</span>
            </button>
          )}

          <span
            className="inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 text-[11px] font-semibold tabular-nums backdrop-blur-md transition-all duration-500"
            style={{
              borderColor: `${primaryAccent}45`,
              backgroundColor: 'rgba(0,0,0,0.55)',
              color: activeTrack.colors?.accent || primaryAccent,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full transition-all duration-200"
              style={{
                backgroundColor: activeTrack.colors?.accent || primaryAccent,
                transform: isPlaying ? `scale(${1 + audioReactivity.amplitude * 0.4})` : 'scale(1)',
                boxShadow: isPlaying ? `0 0 8px ${activeTrack.colors?.accent || primaryAccent}` : 'none',
              }}
            />
            {String(activeTrackIndex + 1).padStart(2, '0')} / 06
          </span>

          <button
            type="button"
            onClick={() => setIsClosingState(true)}
            aria-label="Playlist options"
            className="hidden sm:grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* ── MAIN WORKSPACE (Locked to 100dvh, No whole-page scroll) ── */}
      <main className="relative z-10 flex-1 min-h-0 w-full max-w-[1520px] mx-auto px-3 py-2 sm:px-6 sm:py-3">
        {/* DESKTOP LAYOUT (2 Columns) */}
        {!isMobile ? (
          <div className="grid h-full min-h-0 grid-cols-12 gap-5 items-stretch">
            {/* Left Column (7 Cols ~ 58-62%): Hero Cinematic Artwork + Queue + Note */}
            <section
              aria-label="Cinematic song artwork and playlist queue"
              className="col-span-7 flex h-full min-h-0 flex-col gap-2.5 sm:gap-3"
            >
              {/* Large Hero Cinematic Artwork Card */}
              <CinematicArtworkCard
                activeTrack={activeTrack}
                isPlaying={isPlaying}
                onTogglePlay={handleTogglePlay}
                reducedMotion={reducedMotion}
                className="shrink-0"
              />

              {/* 6-Song Track Queue (Scrollable internally with auto-scroll) */}
              <div
                data-queue-scrollable="true"
                className="flex-1 min-h-0 overflow-y-auto pr-1"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(255,255,255,0.12) transparent',
                }}
              >
                <div className="mb-1.5 flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-white/90 font-['Outfit',sans-serif]">
                    Playlist · 6 Songs
                  </span>
                  <span className="text-[10px] text-slate-400">Tap to select</span>
                </div>
                <TrackSelector
                  tracks={sonicBloomSongs}
                  activeTrackIndex={activeTrackIndex}
                  onSelectTrack={handleSelectTrack}
                  isPlaying={isPlaying}
                />
              </div>

              {/* Personal Note Card */}
              <div
                className="shrink-0 rounded-2xl border p-3 shadow-sm backdrop-blur-md transition-all duration-500"
                style={{
                  backgroundColor: activeTrack.colors?.panelBg ? `${activeTrack.colors.panelBg}ee` : 'rgba(13, 15, 21, 0.85)',
                  borderColor: activeTrack.colors?.borderLight || `${primaryAccent}20`,
                  boxShadow: `0 8px 24px -6px rgba(0,0,0,0.5), 0 0 20px ${primaryAccent}0a`,
                }}
              >
                <div
                  className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors duration-500"
                  style={{ color: activeTrack.colors?.accent || primaryAccent }}
                >
                  <Heart className="h-3 w-3" style={{ color: secondaryAccent }} />
                  <span>Why this song for Kutty?</span>
                </div>
                <p
                  className="mt-1 text-xs leading-relaxed italic font-['DM_Sans',sans-serif] transition-colors duration-500"
                  style={{ color: activeTrack.colors?.core || '#e2e8f0' }}
                >
                  “{activeTrack.personalNote}”
                </p>
              </div>
            </section>

            {/* Right Column (5 Cols ~ 38-42%): Compact Lyrics Panel Companion */}
            <section
              aria-label="Song Lyrics"
              className="col-span-5 flex h-full min-h-0 flex-col"
            >
              <AnimatePresence mode="wait">
                {isClosingState ? (
                  <motion.div
                    key="closing-state"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="flex h-full min-h-0 items-center justify-center p-4"
                  >
                    <ClosingDedication
                      onBackToArtist={handleBackToArtist}
                      onContinueToUs={handleContinueToUs}
                      onReturnToTracks={() => setIsClosingState(false)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="lyrics-active"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full min-h-0"
                  >
                    <LyricsPanel
                      track={activeTrack}
                      currentTime={currentTime}
                      isPlaying={isPlaying}
                      audioReactivity={audioReactivity}
                      onSeek={handleSeek}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        ) : (
          /* MOBILE LAYOUT (Stacked, Single Screen, No whole-page scroll) */
          <div className="flex h-full min-h-0 flex-col gap-2">
            {/* Top Mini Track Card with Cinematic Thumbnail */}
            <div className="shrink-0 flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#0e1118]/90 p-2.5 shadow-md">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg bg-[#141822] border border-white/10"
                  aria-hidden="true"
                >
                  {activeTrack?.artwork ? (
                    <img
                      src={activeTrack.artwork}
                      alt={activeTrack.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center">
                      <Music2 className="h-5 w-5" style={{ color: primaryAccent }} />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-white font-['Outfit',sans-serif]">
                    {activeTrack.title}
                  </p>
                  <p className="truncate text-[10px] text-slate-400">
                    {[activeTrack.film, activeTrack.theme].filter(Boolean).join(' · ')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileQueueOpen(true)}
                className="shrink-0 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-medium text-slate-200"
              >
                Queue (6)
              </button>
            </div>

            {/* Main Lyrics Area (Takes the vast majority of mobile screen) */}
            <div className="flex-1 min-h-0">
              <AnimatePresence mode="wait">
                {isClosingState ? (
                  <motion.div
                    key="mobile-closing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex h-full min-h-0 items-center justify-center p-2"
                  >
                    <ClosingDedication
                      onBackToArtist={handleBackToArtist}
                      onContinueToUs={handleContinueToUs}
                      onReturnToTracks={() => setIsClosingState(false)}
                    />
                  </motion.div>
                ) : (
                  <LyricsPanel
                    track={activeTrack}
                    currentTime={currentTime}
                    isPlaying={isPlaying}
                    audioReactivity={audioReactivity}
                    onSeek={handleSeek}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Queue Drawer Modal */}
            <AnimatePresence>
              {mobileQueueOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-md"
                  onClick={() => setMobileQueueOpen(false)}
                >
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                    className="max-h-[75vh] flex flex-col rounded-t-3xl border-t border-white/10 bg-[#12151f] p-4 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="mb-3 flex items-center justify-between border-b border-white/[0.08] pb-3">
                      <div>
                        <h4 className="text-sm font-bold text-white font-['Outfit',sans-serif]">
                          Six Songs for Kutty
                        </h4>
                        <p className="text-[10px] text-slate-400">Select any song to listen & sing</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMobileQueueOpen(false)}
                        className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:text-white"
                        aria-label="Close track queue"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div data-queue-scrollable="true" className="flex-1 min-h-0 overflow-y-auto">
                      <TrackSelector
                        tracks={sonicBloomSongs}
                        activeTrackIndex={activeTrackIndex}
                        onSelectTrack={handleSelectTrack}
                        isPlaying={isPlaying}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* ── AUTOPLAY BLOCKED FALLBACK PROMPT ── */}
      {autoplayBlocked && !isPlaying && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40"
        >
          <button
            type="button"
            onClick={handleTogglePlay}
            className="flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-semibold shadow-2xl backdrop-blur-xl transition-all transform hover:scale-105 active:scale-95"
            style={{
              backgroundColor: 'rgba(15, 18, 26, 0.95)',
              borderColor: `${primaryAccent}60`,
              color: activeTrack.colors?.accent || '#ffffff',
              boxShadow: `0 10px 30px rgba(0,0,0,0.6), 0 0 25px ${primaryAccent}33`,
            }}
          >
            <span
              className="grid h-5 w-5 place-items-center rounded-full text-black"
              style={{ backgroundColor: activeTrack.colors?.accent || primaryAccent }}
            >
              <Play className="h-3 w-3 fill-current ml-0.5" />
            </span>
            <span>Tap to Play Kutty Radio ♡</span>
          </button>
        </motion.div>
      )}

      {/* ── PERSISTENT DOCKED AUDIO PLAYER ── */}
      <div className="relative z-20 shrink-0 px-3 pb-2 pt-1 sm:px-6 sm:pb-3">
        <AudioPlayerShell
          activeTrack={activeTrack}
          activeTrackIndex={activeTrackIndex}
          totalTracks={sonicBloomSongs.length}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onTogglePlay={handleTogglePlay}
          onSeek={handleSeek}
          onPreviousTrack={handlePreviousTrack}
          onNextTrack={handleNextTrack}
          onPreviewEnding={() => setIsClosingState(true)}
        />
      </div>
    </div>
  );
}

export default SonicBloomScene;
