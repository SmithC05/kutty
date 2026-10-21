import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
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

export function SonicBloomScene() {
  const { transitionTo } = useScene();
  const reducedMotion = useReducedMotion();

  const [hasWebGL, setHasWebGL] = useState(true);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isTransitionActive, setIsTransitionActive] = useState(!reducedMotion);
  const [isClosingState, setIsClosingState] = useState(false);

  // Future Audio Reactivity State Interface
  // (Deterministic ambient values until audio source setup in final stage)
  const audioReactivity = useMemo(() => ({
    amplitude: 0,
    lowFreq: 0,
    midFreq: 0,
    highFreq: 0,
    progress: 0,
    isPlaying: false,
  }), []);

  useEffect(() => {
    setHasWebGL(checkWebGLSupport());
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

  return (
    <div className="relative w-full min-h-[100dvh] lg:h-[100dvh] lg:max-h-[100dvh] bg-[#03050c] text-white overflow-x-hidden lg:overflow-hidden flex flex-col justify-between selection:bg-cyan-500/30 selection:text-white">
      {/* ── Optional Cinematic Opening Transition ──────────────────── */}
      {isTransitionActive && (
        <SonicBloomTransition
          onComplete={() => setIsTransitionActive(false)}
          reducedMotion={reducedMotion}
        />
      )}

      {/* ── Atmospheric Ambient Chromatic Lighting ─────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none transition-colors duration-1000 z-0"
        style={{
          background: `radial-gradient(circle at 35% 30%, ${activeTrack.colors.glow} 0%, rgba(3, 5, 12, 0.85) 60%, #03050c 100%)`,
        }}
      />
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950/20 to-transparent z-0" />

      {/* ── Main Responsive Content Container ──────────────────────── */}
      <div
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 lg:py-4 flex flex-col flex-1 min-h-0 justify-between"
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
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 font-sonic-body text-xs text-slate-200 hover:text-white transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 min-h-[44px]"
              aria-label="Back to Birthday celebration"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <span className="text-[10px] sm:text-xs font-sonic-mono font-bold tracking-[0.22em] text-cyan-300/90 uppercase">
              {sonicBloomConfig.header.wordmark}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: isClosingState ? '#38bdf8' : activeTrack.colors.primary }}
            />
            <span className="text-[11px] font-sonic-mono text-slate-300">
              {isClosingState ? 'FULL BLOOM' : `PETAL ${activeTrack.trackNumber} / 06`}
            </span>
          </div>
        </header>

        {/* ── Main Composition Grid (2 Columns on Desktop, 1 on Mobile) */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center flex-1 min-h-0 my-auto">
          {/* ── Left Area: 3D Sound Sculpture Installation ───────────── */}
          <section
            aria-label="3D Sound Sculpture"
            className="lg:col-span-5 xl:col-span-6 flex flex-col items-center justify-center order-1 lg:order-none my-auto min-h-0"
          >
            {/* Introductory Titles (Mobile only, positioned above artwork) */}
            <div className="lg:hidden text-center w-full mb-2 sm:mb-3">
              <h1 className="font-sonic-heading text-[clamp(1.5rem,5.2vw,1.9rem)] leading-tight tracking-normal text-white mb-1">
                <span className="font-bold tracking-tight text-white">Six Songs, </span>
                <span className="font-normal italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-indigo-200 to-slate-200">
                  the Way I See You.
                </span>
              </h1>
              <p className="font-sonic-body text-xs text-slate-300">
                {sonicBloomConfig.header.supportingLine}
              </p>
            </div>

            {/* The Interactive Sculpture Container — Viewport-aware clamped sizing */}
            <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[340px] lg:max-w-[min(100%,clamp(300px,50vh,440px))] rounded-2xl sm:rounded-3xl bg-slate-950/40 border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center mx-auto">
              {/* Petal Annotation Badge */}
              <div className="absolute top-2.5 left-3.5 z-20 flex items-center space-x-2 pointer-events-none">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-ping"
                  style={{ backgroundColor: isClosingState ? '#38bdf8' : activeTrack.colors.primary }}
                />
                <span className="text-[9.5px] font-sonic-mono text-slate-200 uppercase tracking-wider">
                  {isClosingState ? 'Harmonic Bloom: All Petals Active' : `Active Petal: ${activeTrack.title}`}
                </span>
              </div>

              {/* Rendering Canvas or 2D Fallback */}
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

              {/* Ambient radial vignette */}
              <div className="absolute inset-0 pointer-events-none rounded-2xl sm:rounded-3xl shadow-[inset_0_0_60px_rgba(3,5,12,0.9)]" />
            </div>

            {/* Annotation caption beneath sculpture */}
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-sonic-body text-center mt-2 tracking-wide">
              {isClosingState
                ? 'Six petals unified in one harmonious botanical composition'
                : 'Six interconnected petals forming a living sound sculpture'}
            </p>
          </section>

          {/* ── Right Area: Track Selector & Personal Context ────────── */}
          <section
            aria-label="Track Selection and Personal Notes"
            className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center space-y-2 sm:space-y-2.5 order-2 lg:order-none min-h-0 max-h-full my-auto"
          >
            {/* Desktop Introductory Title Block */}
            <div className="hidden lg:block space-y-0.5 text-left mb-0.5">
              <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-400/25 text-[9.5px] text-cyan-300 font-sonic-mono tracking-wider uppercase mb-0.5">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>An Interactive Sonic Installation</span>
              </div>
              <h1 className="font-sonic-heading text-[clamp(1.7rem,2.4vw,2.3rem)] leading-[1.12] text-white">
                <span className="font-bold tracking-tight text-white">Six Songs, </span>
                <span className="font-normal italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-indigo-200 to-slate-200">
                  the Way I See You.
                </span>
              </h1>
              <p className="font-sonic-body text-xs sm:text-[13px] text-slate-300 leading-snug">
                {sonicBloomConfig.header.supportingLine}
              </p>
            </div>

            {/* Tracks State or Distinct Closing Resolution State */}
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
                  {/* Vertical Track Selector List with controlled scroll fallback for short viewports */}
                  <div className="w-full max-h-[calc(100dvh-19rem)] lg:max-h-[min(380px,52vh)] overflow-y-auto pr-0.5">
                    <TrackSelector
                      tracks={sonicBloomSongs}
                      activeTrackIndex={activeTrackIndex}
                      onSelectTrack={handleSelectTrack}
                    />
                  </div>

                  {/* Sleek Audio Player Interface Shell */}
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
