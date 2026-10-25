import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music2 } from 'lucide-react';
import { LyricsBeatVisualizer } from './LyricsBeatVisualizer';

/**
 * LyricsPanel — Compact Two-Line Karaoke Stage & Dynamic Beat Visualizer
 *
 * Implements:
 * 1. Strictly TWO lyric lines visible at a time:
 *    - Active line: prominent, warm off-white, individual word-by-word highlight in sync with audio
 *    - Next line: visible beneath with 40% opacity as a smooth preview
 *    - Smooth crossfade transitions when advancing to the next line
 * 2. Handwritten Tamil typography using Kavivanar with Noto Sans Tamil fallback and Unicode-safe word rendering
 * 3. Dynamic concert stage lighting in the negative space (pointer-events-none behind text)
 * 4. Animated, audio-reactive beat visualizer along the bottom:
 *    - 28 real-time frequency spectrum bars driven directly by Web Audio FFT analysis
 *    - Dances to the music's rhythm, bass, and peaks
 *    - Settles into a calm resting state when playback is paused
 *    - Inherits the active song's theme colors
 * 5. Minimal, clean header without the karaoke badge
 */
function LyricsPanelComponent({
  track,
  currentTime = 0,
  isPlaying = false,
  audioReactivity = null,
  audioEngine = null,
  className = '',
}) {
  const rawLyrics = track?.lyrics;
  const lyrics = useMemo(
    () =>
      Array.isArray(rawLyrics)
        ? rawLyrics.filter((line) => line && (line.text || line.words))
        : [],
    [rawLyrics]
  );

  // Active line index calculation driven by actual audio currentTime
  const currentLineIndex = useMemo(() => {
    if (!lyrics.length) return -1;
    for (let i = 0; i < lyrics.length; i++) {
      const line = lyrics[i];
      const start = Number(line.start ?? line.time ?? 0);
      const end = Number(line.end ?? (lyrics[i + 1]?.start ?? (start + 5)));
      if (currentTime >= start && currentTime < end) {
        return i;
      }
    }
    if (currentTime < Number(lyrics[0].start ?? lyrics[0].time ?? 0)) {
      return 0;
    }
    return lyrics.length - 1;
  }, [lyrics, currentTime]);

  const currentLine = lyrics[currentLineIndex] || null;
  const nextLine = lyrics[currentLineIndex + 1] || null;

  // Song theme color mapping
  const primary = track?.colors?.primary || '#f59e0b';
  const secondary = track?.colors?.secondary || '#fb7185';
  const accent = track?.colors?.accent || primary;
  const panelBg = track?.colors?.panelBg || '#0c0e14';
  const coreText = '#fdfbf7'; // Warm off-white

  // Audio reactivity metrics
  const amp = isPlaying ? (audioReactivity?.amplitude || 0.25) : 0.05;
  const lowFreq = isPlaying ? (audioReactivity?.lowFreq || 0.2) : 0.05;
  const midFreq = isPlaying ? (audioReactivity?.midFreq || 0.2) : 0.05;
  const highFreq = isPlaying ? (audioReactivity?.highFreq || 0.15) : 0.02;

  return (
    <section
      aria-label={
        currentLine
          ? `Lyrics for ${track?.title || 'current song'}`
          : 'Song lyrics'
      }
      className={`relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border backdrop-blur-2xl transition-all duration-700 sm:rounded-3xl select-none ${className}`}
      style={{
        backgroundColor: `${panelBg}f2`,
        borderColor: track?.colors?.borderLight || 'rgba(255,255,255,0.1)',
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 14px 40px rgba(0,0,0,0.55), 0 0 35px ${primary}14`,
      }}
    >
      {/* ══════════════════════════════════════════════════════════════════════════
          1. LIVE CONCERT ENVIRONMENT (Background layer — strictly pointer-events-none)
          ══════════════════════════════════════════════════════════════════════════ */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Overhead Stage Spotlight 1 (Left beam) */}
        <div
          className="absolute -top-10 left-1/4 h-[85%] w-44 origin-top -rotate-12 blur-2xl transition-all duration-300"
          style={{
            background: `linear-gradient(180deg, ${primary}35 0%, ${primary}12 45%, transparent 85%)`,
            opacity: isPlaying ? 0.32 + amp * 0.40 : 0.10,
            transform: `rotate(${-14 + Math.sin(currentTime * 0.8) * 4}deg) scaleY(${1 + amp * 0.15})`,
          }}
        />

        {/* Overhead Stage Spotlight 2 (Right beam) */}
        <div
          className="absolute -top-10 right-1/4 h-[85%] w-44 origin-top rotate-12 blur-2xl transition-all duration-300"
          style={{
            background: `linear-gradient(180deg, ${secondary}30 0%, ${secondary}10 45%, transparent 85%)`,
            opacity: isPlaying ? 0.28 + midFreq * 0.38 : 0.08,
            transform: `rotate(${14 - Math.cos(currentTime * 0.8) * 4}deg) scaleY(${1 + midFreq * 0.15})`,
          }}
        />

        {/* Central Stage Floor Glow Wash */}
        <div
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 h-52 w-3/4 rounded-full blur-[75px] transition-all duration-500"
          style={{
            background: `radial-gradient(ellipse at 50% 60%, ${primary}30 0%, ${secondary}15 50%, transparent 80%)`,
            opacity: isPlaying ? 0.50 + lowFreq * 0.40 : 0.15,
            transform: `translateX(-50%) scale(${1 + lowFreq * 0.18})`,
          }}
        />

        {/* Floating Concert Sparks / Micro Particles in negative space */}
        <div className="absolute inset-0 opacity-35">
          {[
            { top: '18%', left: '10%', size: 3.5 },
            { top: '24%', right: '12%', size: 3 },
            { top: '70%', left: '14%', size: 3 },
            { top: '75%', right: '12%', size: 4 },
            { top: '45%', left: '8%', size: 2.5 },
            { top: '40%', right: '8%', size: 3 },
          ].map((spark, i) => (
            <span
              key={i}
              className="absolute rounded-full transition-transform duration-700"
              style={{
                top: spark.top,
                left: spark.left,
                right: spark.right,
                width: `${spark.size}px`,
                height: `${spark.size}px`,
                backgroundColor: i % 2 === 0 ? accent : secondary,
                boxShadow: `0 0 10px ${accent}`,
                opacity: isPlaying ? 0.55 + highFreq * 0.45 : 0.18,
                transform: `scale(${isPlaying ? 1 + highFreq * 0.5 : 0.8})`,
              }}
            />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. MINIMAL HEADER BAR (Song title & metadata — badge removed!)
          ══════════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-2.5 sm:px-5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border shadow-sm transition-colors duration-500"
            style={{
              backgroundColor: `${primary}18`,
              borderColor: `${primary}35`,
              color: accent,
            }}
          >
            <Music2 className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-xs sm:text-sm font-bold text-white font-['Outfit',sans-serif]">
              {track?.title}
            </h3>
            <p className="truncate text-[10px] sm:text-[11px] text-slate-400 font-['DM_Sans',sans-serif]">
              {[track?.film, track?.theme].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. TWO-LINE CINEMATIC KARAOKE STAGE (Centrally positioned)
          ══════════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-1 min-h-0 flex-col items-center justify-center px-4 py-5 sm:px-6 sm:py-6 text-center">
        {currentLine ? (
          <div className="w-full max-w-xl flex flex-col items-center justify-center space-y-4 sm:space-y-5">
            {/* ── Line 1: Active Line with Word-by-Word Synchronization (Kavivanar Handwritten Tamil) ── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLine.id || `line-${currentLineIndex}`}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-full font-['Kavivanar','Noto_Sans_Tamil',sans-serif] font-normal text-xl sm:text-2xl md:text-3xl lg:text-[1.85rem] leading-relaxed tracking-normal select-none drop-shadow-sm"
              >
                {Array.isArray(currentLine.words) && currentLine.words.length > 0 ? (
                  <div className="inline-flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3.5 gap-y-2">
                    {currentLine.words.map((wObj, wIdx) => {
                      const isWordActive =
                        currentTime >= wObj.start && currentTime < wObj.end;
                      const isWordPast = currentTime >= wObj.end;

                      return (
                        <span
                          key={`${wObj.word}-${wIdx}`}
                          className="relative inline-block transition-all duration-200"
                          style={{
                            color: isWordActive
                              ? '#fffdf5'
                              : coreText,
                            opacity: isWordActive
                              ? 1
                              : isWordPast
                              ? 0.85
                              : 0.48,
                            textShadow: isWordActive
                              ? `0 0 12px ${accent}bb, 0 0 24px ${accent}55, 0 1px 3px rgba(0,0,0,0.85)`
                              : isWordPast
                              ? '0 1px 2px rgba(0,0,0,0.5)'
                              : 'none',
                            transform: isWordActive ? 'scale(1.04)' : 'scale(1)',
                            fontWeight: '400',
                          }}
                        >
                          {wObj.word}

                          {/* Active word luminous accent underline bar */}
                          {isWordActive && (
                            <motion.span
                              layoutId="karaoke-active-underline"
                              className="absolute -bottom-1 sm:-bottom-1.5 left-0 right-0 h-[2.5px] rounded-full"
                              style={{
                                backgroundColor: accent,
                                boxShadow: `0 0 8px ${accent}, 0 0 14px ${accent}88`,
                              }}
                              transition={{ duration: 0.2 }}
                            />
                          )}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <span style={{ color: coreText }}>{currentLine.text}</span>
                )}
              </motion.div>
            </AnimatePresence>

            {/* ── Line 2: Next Upcoming Line (Gentle preview, reduced opacity, Kavivanar font) ── */}
            <div className="min-h-[2.2rem] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {nextLine ? (
                  <motion.div
                    key={nextLine.id || `next-${currentLineIndex + 1}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 0.42, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="font-['Kavivanar','Noto_Sans_Tamil',sans-serif] font-normal text-sm sm:text-base md:text-lg leading-relaxed tracking-normal select-none"
                    style={{ color: coreText }}
                  >
                    {nextLine.text}
                  </motion.div>
                ) : (
                  <motion.div
                    key="outro-hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.35 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-['DM_Sans',sans-serif] italic"
                    style={{ color: coreText }}
                  >
                    ✦ Melody continues into the next moment ✦
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
            <Music2 className="h-7 w-7 text-slate-500 animate-pulse" />
            <p className="text-sm font-medium font-['Outfit',sans-serif] text-slate-300">
              Listen & Enjoy the Melody
            </p>
            <p className="text-xs text-slate-500 font-['DM_Sans',sans-serif]">
              Sing along with Kutty ❤️
            </p>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          4. AUDIO-REACTIVE DYNAMIC BEAT VISUALIZER (Real-time spectrum waveform)
          ══════════════════════════════════════════════════════════════════════════ */}
      <LyricsBeatVisualizer
        audioEngine={audioEngine}
        audioReactivity={audioReactivity}
        isPlaying={isPlaying}
        primaryColor={primary}
        accentColor={accent}
      />
    </section>
  );
}

export const LyricsPanel = React.memo(LyricsPanelComponent);
export default LyricsPanel;
