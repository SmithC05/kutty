import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Disc3, Heart, ListMusic, Music2, X } from 'lucide-react';
import { useScene } from '../../context/SceneContext';
import { useAudio } from '../../context';
import { SCENES } from '../../constants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { sonicBloomSongs } from '../../data/sonicBloomSongs';
import { SonicBloomCanvas } from './SonicBloomCanvas';
import { SonicBloomFallback2D } from './SonicBloomFallback2D';
import { SonicBloomTransition } from './SonicBloomTransition';
import { TrackSelector } from './TrackSelector';
import { AudioPlayerShell } from './AudioPlayerShell';
import { ClosingDedication } from './ClosingDedication';
import { LyricsPanel } from './LyricsPanel';
import { ConcertAtmosphere } from './ConcertAtmosphere';
import { ConcertPyrotechnics } from './ConcertPyrotechnics';
import { TrackBurst } from './TrackBurst';
import { triggerDevPyrotechnic, SonicBloomAudioEngine } from './audioAnalyzer';

function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

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

  const [hasWebGL, setHasWebGL] = useState(true);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isTransitionActive, setIsTransitionActive] = useState(!reducedMotion);
  const handleTransitionComplete = useCallback(() => setIsTransitionActive(false), []);
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

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Initialize one HTML audio element and one analyzer for the whole playlist.
  useEffect(() => {
    const engine = new SonicBloomAudioEngine();
    const audio = new Audio();
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
      audio.play().catch((error) => {
        console.warn('[KuttyRadio] Playback failed:', error);
      });
    }
  }, [activeTrackIndex]);

  // Audio analysis frame loop
  useEffect(() => {
    let animationFrame;
    let lastTime = performance.now();

    const update = (now) => {
      const delta = now - lastTime;
      if (delta >= 32) {
        lastTime = now;
        if (engineRef.current) setAudioReactivity(engineRef.current.update(delta));
      }
      animationFrame = requestAnimationFrame(update);
    };

    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const handleTogglePlay = useCallback(() => {
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

  useEffect(() => {
    setHasWebGL(checkWebGLSupport());
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
    setIsClosingState(false);
    setActiveTrackIndex(index);
    setMobileQueueOpen(false);
  }, []);

  const handlePreviousTrack = useCallback(() => {
    setIsClosingState(false);
    setActiveTrackIndex((previous) => Math.max(0, previous - 1));
  }, []);

  const handleNextTrack = useCallback(() => {
    setIsClosingState(false);
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

  // Background gradient: subtle, cohesive dark listening room
  const primaryAccent = activeTrack.colors.primary;
  const bgGradient = isClosingState
    ? 'radial-gradient(ellipse at 42% 32%, rgba(163,230,53,0.12) 0%, rgba(14,16,22,0.96) 62%, #090b10 100%)'
    : `radial-gradient(ellipse at 40% 28%, ${primaryAccent}15 0%, rgba(14,16,22,0.96) 60%, #090b10 100%)`;

  return (
    <div
      className="relative h-[100dvh] max-h-[100dvh] w-full overflow-hidden text-white font-['Inter'] select-none flex flex-col bg-[#090b10]"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
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

      {/* ── TOP HEADER BAR (Compact) ── */}
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
              className="grid h-7 w-7 place-items-center rounded-lg text-[#0a0d08]"
              style={{
                background: `linear-gradient(135deg, ${primaryAccent}, #84cc16)`,
              }}
              aria-hidden="true"
            >
              <Music2 className="h-4 w-4" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white font-['Manrope']">
                Kutty Radio
              </span>
              <span className="ml-2 hidden text-[11px] text-slate-400 sm:inline">
                After-Hours Listening Room
              </span>
            </div>
          </div>
        </div>

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
            className="inline-flex min-h-8 items-center gap-1.5 rounded-full border px-2.5 text-[10px] font-semibold tabular-nums tracking-wide"
            style={{
              color: primaryAccent,
              borderColor: `${primaryAccent}30`,
              background: `${primaryAccent}0e`,
            }}
          >
            <span
              className={
                isPlaying
                  ? 'h-1.5 w-1.5 animate-pulse rounded-full'
                  : 'h-1.5 w-1.5 rounded-full'
              }
              style={{ background: primaryAccent }}
            />
            {String(activeTrackIndex + 1).padStart(2, '0')} / 06
          </span>
        </div>
      </header>

      {/* ── MAIN WORKSPACE (Locked to 100dvh, No whole-page scroll) ── */}
      <main className="relative z-10 flex-1 min-h-0 w-full max-w-[1520px] mx-auto px-3 py-2 sm:px-6 sm:py-3">
        {/* DESKTOP LAYOUT (2 Columns) */}
        {!isMobile ? (
          <div className="grid h-full min-h-0 grid-cols-12 gap-5 items-stretch">
            {/* Left Column (5 Cols): Visualizer + Queue + Note */}
            <section
              aria-label="Vinyl visualizer and playlist"
              className="col-span-5 flex h-full min-h-0 flex-col gap-3"
            >
              {/* Compact Visualizer Card */}
              <div className="relative shrink-0 h-[210px] w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11141c]/90 shadow-lg">
                <div className="absolute inset-0">
                  {hasWebGL ? (
                    <SonicBloomCanvas
                      activeTrackIndex={activeTrackIndex}
                      audioReactivity={audioReactivity}
                      reducedMotion={reducedMotion}
                      isClosingState={isClosingState}
                    />
                  ) : (
                    <SonicBloomFallback2D
                      activeTrackIndex={activeTrackIndex}
                      reducedMotion={reducedMotion}
                    />
                  )}
                </div>

                {!isTransitionActive && (
                  <TrackBurst
                    activeTrackIndex={activeTrackIndex}
                    reducedMotion={reducedMotion}
                  />
                )}

                {/* Overlaid Badge */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-base font-bold text-white font-['Manrope']">
                        {activeTrack.title}
                      </p>
                      <p className="truncate text-[11px] text-slate-300">
                        {[activeTrack.film, activeTrack.theme].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <span
                      className="shrink-0 text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                      style={{
                        color: primaryAccent,
                        borderColor: `${primaryAccent}40`,
                        background: `${primaryAccent}15`,
                      }}
                    >
                      {isPlaying ? 'Playing' : 'Paused'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 6-Song Track Queue (Scrollable internally if needed) */}
              <div
                className="flex-1 min-h-0 overflow-y-auto pr-1"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(255,255,255,0.12) transparent',
                }}
              >
                <div className="mb-1.5 flex items-center justify-between px-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Your Queue · 6 Songs
                  </span>
                  <span className="text-[10px] text-slate-500">Tap to select</span>
                </div>
                <TrackSelector
                  tracks={sonicBloomSongs}
                  activeTrackIndex={activeTrackIndex}
                  onSelectTrack={handleSelectTrack}
                  isPlaying={isPlaying}
                />
              </div>

              {/* Personal Note Card */}
              <div className="shrink-0 rounded-xl border border-white/[0.07] bg-[#12151f]/80 p-2.5">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  <Heart className="h-3 w-3 text-rose-300" />
                  <span>Why this song?</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-200 italic">
                  “{activeTrack.personalNote}”
                </p>
              </div>
            </section>

            {/* Right Column (7 Cols): Lyrics Panel (Continuously Visible!) */}
            <section
              aria-label="Song Lyrics"
              className="col-span-7 flex h-full min-h-0 flex-col"
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
            {/* Top Mini Track Card with Rotating Vinyl Disc */}
            <div className="shrink-0 flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#12151f]/90 p-2.5 shadow-md">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#0a0c10] border border-white/10"
                  aria-hidden="true"
                >
                  <Disc3
                    className={`h-6 w-6 ${isPlaying ? 'animate-spin' : ''}`}
                    style={{ color: primaryAccent, animationDuration: '4s' }}
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-white font-['Manrope']">
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
                className="shrink-0 rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] font-medium text-slate-300"
              >
                Change song
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
                        <h4 className="text-sm font-bold text-white font-['Manrope']">
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

                    <div className="flex-1 min-h-0 overflow-y-auto">
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
