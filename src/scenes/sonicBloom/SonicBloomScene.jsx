import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useScene } from '../../context/SceneContext';
import { SCENES } from '../../constants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { sonicBloomSongs, sonicBloomConfig } from '../../data/sonicBloomSongs';
import { SonicBloomCanvas } from './SonicBloomCanvas';
import { SonicBloomFallback2D } from './SonicBloomFallback2D';
import { SonicBloomTransition } from './SonicBloomTransition';
import { TrackSelector } from './TrackSelector';
import { AudioPlayerShell } from './AudioPlayerShell';
import { ClosingDedication } from './ClosingDedication';
import { ConcertAtmosphere } from './ConcertAtmosphere';
import { ConcertPyrotechnics } from './ConcertPyrotechnics';
import { TrackBurst } from './TrackBurst';
import { triggerDevPyrotechnic } from './audioAnalyzer';

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

/** Detect a narrow or short viewport (mobile/tablet) */
function useIsMobile() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 1024
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const handler = (e) => setMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return mobile;
}

export function SonicBloomScene() {
  const { transitionTo } = useScene();
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const [hasWebGL, setHasWebGL] = useState(true);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isTransitionActive, setIsTransitionActive] = useState(!reducedMotion);
  const [isClosingState, setIsClosingState] = useState(false);

  // Future Audio Reactivity State Interface
  // (Deterministic ambient values until audio source setup in final stage)
  const audioReactivity = useMemo(
    () => ({
      amplitude: 0,
      lowFreq: 0,
      midFreq: 0,
      highFreq: 0,
      progress: 0,
      isPlaying: false,
      isQuiet: false,
      isSustainedHigh: false,
    }),
    []
  );

  useEffect(() => {
    setHasWebGL(checkWebGLSupport());
  }, []);

  // Development-only trigger for testing and previewing bursts (Shift+P)
  useEffect(() => {
    if (!import.meta.env?.DEV) return;
    const handleKey = (e) => {
      if (e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        triggerDevPyrotechnic('high_freq_peak', { intensity: 0.95 });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const activeTrack = sonicBloomSongs[activeTrackIndex] || sonicBloomSongs[0];

  const handleSelectTrack = useCallback((index) => {
    setActiveTrackIndex(index);
  }, []);

  const handlePreviousTrack = useCallback(() => {
    setActiveTrackIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNextTrack = useCallback(() => {
    setActiveTrackIndex((prev) => Math.min(sonicBloomSongs.length - 1, prev + 1));
  }, []);

  const handleBackToBirthday = useCallback(() => {
    transitionTo(SCENES.FINAL_MESSAGE);
  }, [transitionTo]);

  // Background base gradient — shifts per song
  const bgGradient = isClosingState
    ? 'radial-gradient(ellipse at 40% 35%, rgba(99,60,180,0.32) 0%, rgba(3,4,12,0.92) 55%, #02030d 100%)'
    : `radial-gradient(ellipse at 38% 28%, ${activeTrack.colors.glow} 0%, rgba(3,4,12,0.88) 52%, #02030d 100%)`;

  // Secondary accent pool — opposite corner
  const accentGradient = isClosingState
    ? 'radial-gradient(circle at 80% 75%, rgba(255,96,64,0.09) 0%, transparent 55%)'
    : `radial-gradient(circle at 78% 72%, ${activeTrack.colors.glow.replace(/[\d.]+\)$/, '0.07)')} 0%, transparent 50%)`;

  return (
    <div
      className="relative w-full min-h-[100dvh] lg:h-[100dvh] lg:max-h-[100dvh] text-white overflow-x-hidden lg:overflow-hidden flex flex-col selection:bg-teal-500/30 selection:text-white"
      style={{ backgroundColor: '#02030d' }}
    >
      {/* ── Cinematic Opening Transition ────────────────────────────── */}
      {isTransitionActive && (
        <SonicBloomTransition
          onComplete={() => setIsTransitionActive(false)}
          reducedMotion={reducedMotion}
        />
      )}

      {/* ── Concert Atmosphere: Stage Beams + Haze (z-1) ────────────── */}
      <ConcertAtmosphere
        activeTrackIndex={activeTrackIndex}
        primaryColor={activeTrack.colors.primary}
        secondaryColor={activeTrack.colors.secondary}
        accentColor={activeTrack.colors.accent}
        isClosingState={isClosingState}
        isMobile={isMobile}
        audioReactivity={audioReactivity}
      />

      {/* ── Audio-Reactive Concert Pyrotechnics (z-2, behind content) ── */}
      <ConcertPyrotechnics
        activeTrackIndex={activeTrackIndex}
        reducedMotion={reducedMotion}
        isMobile={isMobile}
      />

      {/* ── Background Colour Pools (z-0, behind beams) ─────────────── */}
      {/* Primary ambient pool — song-specific */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-[1200ms] ease-in-out"
        style={{ background: bgGradient }}
      />
      {/* Secondary accent pool */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-[1400ms] ease-in-out"
        style={{ background: accentGradient }}
      />
      {/* Film grain texture */}
      <div
        className="fixed inset-0 pointer-events-none z-[2] opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '180px 180px',
          mixBlendMode: 'overlay',
        }}
      />

      {/* ── Main Responsive Content Container (z-10) ────────────────── */}
      <div
        className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 lg:py-4 flex flex-col flex-1 min-h-0"
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)',
        }}
      >
        {/* ── Top Header Navigation Bar ────────────────────────────── */}
        <header className="flex items-center justify-between mb-2 sm:mb-3 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleBackToBirthday}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.11] border border-white/[0.08] font-sonic-body text-xs text-slate-300 hover:text-white transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 min-h-[44px]"
              aria-label="Back to Birthday celebration"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {/* SONIC BLOOM wordmark — colour-reactive */}
            <span
              className="text-[11px] sm:text-[12px] font-sonic-mono font-bold tracking-[0.26em] uppercase"
              style={{ color: activeTrack.colors.primary, transition: 'color 0.8s ease' }}
            >
              {sonicBloomConfig.header.wordmark}
            </span>
          </div>

          {/* Song counter — warm, no petal terminology */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-sonic-mono text-slate-400">
              {isClosingState ? 'ALL SIX' : `SONG ${activeTrack.trackNumber} OF 06`}
            </span>
            <span
              className="w-1.5 h-1.5 rounded-full transition-colors duration-700"
              style={{ backgroundColor: isClosingState ? '#a78bfa' : activeTrack.colors.primary }}
            />
          </div>
        </header>

        {/* ── Main Two-Column Composition Grid ─────────────────────── */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 xl:gap-8 items-center flex-1 min-h-0 my-auto">

          {/* ── Left: 3D Sound Sculpture ──────────────────────────── */}
          <section
            aria-label="Sound Sculpture"
            className="lg:col-span-5 xl:col-span-6 flex flex-col items-center justify-center order-1 lg:order-none my-auto min-h-0"
          >
            {/* Mobile heading */}
            <div className="lg:hidden text-center w-full mb-2 sm:mb-3">
              <h1 className="font-sonic-heading text-[clamp(1.45rem,5vw,1.85rem)] leading-tight text-white mb-1">
                <span className="font-bold tracking-tight">Six Songs, </span>
                <span
                  className="font-normal italic"
                  style={{ color: activeTrack.colors.primary, transition: 'color 0.9s ease' }}
                >
                  the Way I See You.
                </span>
              </h1>
              <p className="font-sonic-body text-[11px] text-slate-400">
                {sonicBloomConfig.header.supportingLine}
              </p>
            </div>

            {/* Sculpture container — particle bursts positioned relative to this */}
            <div
              className="relative w-full aspect-square max-w-[280px] sm:max-w-[340px] lg:max-w-[min(100%,clamp(300px,48vh,430px))] rounded-2xl sm:rounded-3xl overflow-visible flex items-center justify-center mx-auto"
            >
              {/* Inner bounded container for WebGL canvas */}
              <div
                className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden"
                style={{
                  background: 'rgba(2,3,13,0.55)',
                  boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 12px 48px rgba(0,0,0,0.65), 0 0 80px -20px ${activeTrack.colors.glow}`,
                  transition: 'box-shadow 1.0s ease',
                }}
              >
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

                {/* Inset vignette */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-2xl sm:rounded-3xl"
                  style={{ boxShadow: 'inset 0 0 55px rgba(2,3,13,0.88)' }}
                />
              </div>

              {/* ── Particle Bursts — positioned relative to sculpture ── */}
              {!isTransitionActive && (
                <TrackBurst
                  activeTrackIndex={activeTrackIndex}
                  isClosingState={isClosingState}
                  reducedMotion={reducedMotion}
                />
              )}
            </div>

            {/* Sculpture caption */}
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-sonic-body text-center mt-2.5 tracking-wide italic">
              {sonicBloomConfig.sculptureCaption}
            </p>
          </section>

          {/* ── Right: Title, Track List, Player ─────────────────── */}
          <section
            aria-label="Track Selection and Personal Notes"
            className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center space-y-2 sm:space-y-2.5 order-2 lg:order-none min-h-0 max-h-full my-auto"
          >
            {/* Desktop heading */}
            <div className="hidden lg:block space-y-0.5 text-left mb-0.5">
              <h1 className="font-sonic-heading text-[clamp(1.65rem,2.3vw,2.2rem)] leading-[1.1] text-white">
                <span className="font-bold tracking-tight">Six Songs, </span>
                <br className="hidden xl:block" />
                <span
                  className="font-normal italic"
                  style={{ color: activeTrack.colors.primary, transition: 'color 0.9s ease' }}
                >
                  the Way I See You.
                </span>
              </h1>
              <p className="font-sonic-body text-[12px] text-slate-400 leading-snug mt-0.5">
                {sonicBloomConfig.header.supportingLine}
              </p>
            </div>

            {/* Track list or closing dedication */}
            <AnimatePresence mode="wait">
              {isClosingState ? (
                <motion.div
                  key="closing-dedication"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="w-full my-auto flex flex-col items-center justify-center py-2"
                >
                  <ClosingDedication
                    onBackToBirthday={handleBackToBirthday}
                    onReturnToTracks={() => setIsClosingState(false)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="track-selection"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full flex flex-col justify-start space-y-2 sm:space-y-2.5"
                >
                  {/* Scrollable track list */}
                  <div className="w-full max-h-[calc(100dvh-19rem)] lg:max-h-[min(380px,52vh)] overflow-y-auto pr-0.5">
                    <TrackSelector
                      tracks={sonicBloomSongs}
                      activeTrackIndex={activeTrackIndex}
                      onSelectTrack={handleSelectTrack}
                    />
                  </div>

                  {/* Audio Player Shell */}
                  <div className="w-full flex-shrink-0">
                    <AudioPlayerShell
                      activeTrack={activeTrack}
                      activeTrackIndex={activeTrackIndex}
                      totalTracks={sonicBloomSongs.length}
                      onPreviousTrack={handlePreviousTrack}
                      onNextTrack={handleNextTrack}
                      onPreviewEnding={() => setIsClosingState(true)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </main>
      </div>
    </div>
  );
}

export default SonicBloomScene;
