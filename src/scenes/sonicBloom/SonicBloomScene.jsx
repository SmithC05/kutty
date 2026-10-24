import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, AudioLines, Heart, ListMusic, Mic2, Music2, Sparkles } from 'lucide-react';
import { useScene } from '../../context/SceneContext';
import { useAudio } from '../../context';
import { SCENES } from '../../constants';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { sonicBloomSongs, sonicBloomConfig } from '../../data/sonicBloomSongs';
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

/** Detect a narrow viewport so the artwork and playlist can stack naturally. */
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

const PANELS = [
  { id: 'songs', label: 'Songs', icon: ListMusic },
  { id: 'lyrics', label: 'Lyrics', icon: Mic2 },
  { id: 'note', label: 'A little note', icon: Heart },
];

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
  const [activePanel, setActivePanel] = useState('songs');
  const [isTransitionActive, setIsTransitionActive] = useState(!reducedMotion);
  const handleTransitionComplete = useCallback(() => setIsTransitionActive(false), []);
  const [isClosingState, setIsClosingState] = useState(false);

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

    const onTimeUpdate = () => setCurrentTime(Number.isFinite(audio.currentTime) ? audio.currentTime : 0);
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
          // Let the next track's source load before starting it automatically.
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

  // Switch tracks and keep playing only when the user was already listening or
  // the previous song ended naturally. Manual selection while paused stays paused.
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
        console.warn('[KuttyRadio] Playback could not continue automatically:', error);
      });
    }
  }, [activeTrackIndex]);

  // Keep the audio-reactive lighting and fireworks responsive to the actual song.
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

  // Development-only key to test concert bursts before releasing the experience.
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

  // Background follows the chosen track while concert lighting stays behind the UI.
  const bgGradient = isClosingState
    ? 'radial-gradient(ellipse at 40% 35%, rgba(99,60,180,0.28) 0%, rgba(7,8,16,0.96) 56%, #06070c 100%)'
    : `radial-gradient(ellipse at 38% 28%, ${activeTrack.colors.glow} 0%, rgba(7,8,16,0.92) 54%, #06070c 100%)`;
  const accentGradient = isClosingState
    ? 'radial-gradient(circle at 80% 75%, rgba(255,96,64,0.08) 0%, transparent 55%)'
    : `radial-gradient(circle at 78% 72%, ${activeTrack.colors.glow.replace(/[\d.]+\)$/, '0.07)')} 0%, transparent 50%)`;

  return (
    <div
      className="relative min-h-[100dvh] overflow-x-hidden text-white"
      style={{ backgroundColor: '#070810' }}
    >
      {isTransitionActive && (
        <SonicBloomTransition
          onComplete={handleTransitionComplete}
          reducedMotion={reducedMotion}
        />
      )}

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

      <div className="pointer-events-none fixed inset-0 z-0 transition-all duration-[1200ms] ease-in-out" style={{ background: bgGradient }} />
      <div className="pointer-events-none fixed inset-0 z-0 transition-all duration-[1400ms] ease-in-out" style={{ background: accentGradient }} />
      <div
        className="pointer-events-none fixed inset-0 z-[2] opacity-[0.018]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%221%22/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          backgroundSize: '180px 180px',
          mixBlendMode: 'overlay',
        }}
      />

      <div
        className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1480px] flex-col px-4 pb-[max(1.1rem,env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:pt-5 lg:px-10"
      >
        {/* Top bar: this should feel like a music app, not a separate cinematic title page. */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] pb-4">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handleBackToArtist}
              className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-3.5 text-xs font-medium text-slate-300 transition hover:bg-white/[0.09] hover:text-white focus:outline-none focus-visible:ring-2"
              style={{ '--tw-ring-color': activeTrack.colors.primary }}
              aria-label="Back to the artist portrait"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

            <div
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[#0b0d10]"
              style={{ background: `linear-gradient(145deg, ${activeTrack.colors.primary}, ${activeTrack.colors.secondary})`, boxShadow: `0 0 24px ${activeTrack.colors.primary}20` }}
              aria-hidden="true"
            >
              <Music2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold tracking-tight text-white sm:text-base">Kutty Radio</p>
              <p className="truncate text-[10px] text-slate-500 sm:text-[11px]">A tiny playlist, made with love ♡</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-white/[0.09] bg-white/[0.035] px-3 py-2 text-[10px] text-slate-400 sm:inline-flex sm:items-center sm:gap-2">
              <Heart className="h-3 w-3 text-rose-300" /> Curated for Kutty
            </span>
            <span className="inline-flex min-h-9 items-center gap-2 rounded-full border px-3 text-[10px] font-semibold tracking-wide"
              style={{ color: activeTrack.colors.primary, borderColor: `${activeTrack.colors.primary}25`, background: `${activeTrack.colors.primary}0c` }}>
              <span className={isPlaying ? 'h-1.5 w-1.5 animate-pulse rounded-full' : 'h-1.5 w-1.5 rounded-full'} style={{ background: activeTrack.colors.primary }} />
              {String(activeTrackIndex + 1).padStart(2, '0')} / 06
            </span>
          </div>
        </header>

        <main className="grid flex-1 grid-cols-1 items-start gap-5 py-5 sm:py-7 lg:grid-cols-[minmax(300px,0.85fr)_minmax(0,1.15fr)] lg:items-stretch lg:gap-8 lg:py-8">
          {/* Left: dynamic cover art / concert visualizer */}
          <section aria-label="Playlist artwork" className="flex min-w-0 flex-col">
            <div className="mb-4 space-y-2 sm:mb-5">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.23em]" style={{ color: activeTrack.colors.primary }}>
                <Sparkles className="h-3.5 w-3.5" /> A playlist for one favourite person
              </p>
              <h1 className="max-w-xl text-3xl font-bold leading-[1.06] tracking-[-0.045em] text-white sm:text-4xl xl:text-5xl">
                Six songs.
                <span className="mt-1 block font-medium" style={{ color: activeTrack.colors.primary, transition: 'color 0.7s ease' }}>All the things I can’t say.</span>
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-slate-400">
                {sonicBloomConfig.header.supportingLine}
              </p>
            </div>

            <div
              className="group relative mx-auto aspect-square w-full max-w-[440px] overflow-visible rounded-[28px] sm:rounded-[32px] lg:mx-0"
              style={{ boxShadow: `0 24px 80px rgba(0,0,0,0.42), 0 0 60px -25px ${activeTrack.colors.primary}55`, transition: 'box-shadow 0.8s ease' }}
            >
              <div
                className="absolute inset-0 overflow-hidden rounded-[28px] border border-white/[0.13] sm:rounded-[32px]"
                style={{ background: `linear-gradient(145deg, ${activeTrack.colors.primary}28, rgba(17,19,33,0.94) 50%, ${activeTrack.colors.secondary}22)` }}
              >
                <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.07), transparent 42%), linear-gradient(180deg, transparent 55%, rgba(3,4,11,0.88) 100%)' }} />
                <div className="absolute inset-0 opacity-90">
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
                    isClosingState={isClosingState}
                    reducedMotion={reducedMotion}
                  />
                )}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-5 sm:p-7">
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
                    <AudioLines className="h-3.5 w-3.5" style={{ color: activeTrack.colors.primary }} />
                    Kutty Radio · Side A
                  </div>
                  <h2 className="text-2xl font-bold leading-tight tracking-tight text-white drop-shadow-lg sm:text-3xl">{activeTrack.title}</h2>
                  <p className="mt-1 text-xs text-white/75 sm:text-sm">
                    {activeTrack.film || 'A song chosen for you'}{activeTrack.theme ? ` · ${activeTrack.theme}` : ''}
                  </p>
                </div>
                <div className="pointer-events-none absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[9px] font-semibold tracking-[0.14em] text-white/65 backdrop-blur">
                  {isPlaying ? 'NOW PLAYING' : 'YOUR PLAYLIST'}
                </div>
              </div>
            </div>

            <div className="mx-auto mt-4 flex w-full max-w-[440px] items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 lg:mx-0">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ background: `${activeTrack.colors.primary}16`, color: activeTrack.colors.primary }}>
                <Heart className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Why this song?</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-200">{activeTrack.personalNote}</p>
              </div>
            </div>
          </section>

          {/* Right: familiar song / lyrics / note tabs */}
          <section aria-label="Playlist and lyrics" className="flex min-w-0 flex-col overflow-hidden rounded-[26px] border border-white/[0.09] bg-[#0b0d17]/85 shadow-2xl shadow-black/20 backdrop-blur-xl sm:rounded-[30px]">
            <div className="border-b border-white/[0.07] px-4 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Your little collection</p>
                  <h2 className="mt-1.5 text-xl font-bold tracking-tight text-white sm:text-2xl">Made for Kutty</h2>
                  <p className="mt-1.5 text-xs text-slate-400">Six songs · picked one by one, just for you</p>
                </div>
                <div className="hidden h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.035] sm:grid" aria-hidden="true">
                  <Music2 className="h-5 w-5" style={{ color: activeTrack.colors.primary }} />
                </div>
              </div>

              <div className="mt-5 flex gap-1 rounded-xl border border-white/[0.06] bg-black/20 p-1" role="tablist" aria-label="Playlist panels">
                {PANELS.map(({ id, label, icon: Icon }) => {
                  const active = activePanel === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      id={`kutty-panel-tab-${id}`}
                      aria-selected={active}
                      aria-controls={`kutty-panel-content-${id}`}
                      onClick={() => setActivePanel(id)}
                      className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 text-[11px] font-semibold transition-all focus:outline-none focus-visible:ring-2 sm:gap-2 sm:text-xs"
                      style={{
                        background: active ? 'rgba(255,255,255,0.09)' : 'transparent',
                        color: active ? '#ffffff' : '#858998',
                        boxShadow: active ? 'inset 0 0 0 1px rgba(255,255,255,0.055)' : 'none',
                        '--tw-ring-color': activeTrack.colors.primary,
                      }}
                    >
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 px-3 py-3 sm:px-5 sm:py-4" role="tabpanel" id={`kutty-panel-content-${activePanel}`} aria-labelledby={`kutty-panel-tab-${activePanel}`}>
              <AnimatePresence mode="wait" initial={false}>
                {isClosingState ? (
                  <motion.div
                    key="playlist-finished"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="flex min-h-[380px] items-center justify-center px-2 py-5 sm:min-h-[440px]"
                  >
                    <ClosingDedication
                      onBackToArtist={handleBackToArtist}
                      onContinueToUs={handleContinueToUs}
                      onReturnToTracks={() => setIsClosingState(false)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={activePanel}
                    initial={{ opacity: 0, y: 7 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -7 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activePanel === 'songs' && (
                      <div className="py-1">
                        <div className="mb-3 flex items-center justify-between px-1">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Tracklist</span>
                          <span className="text-[10px] text-slate-500">Select any song</span>
                        </div>
                        <TrackSelector
                          tracks={sonicBloomSongs}
                          activeTrackIndex={activeTrackIndex}
                          onSelectTrack={handleSelectTrack}
                          isPlaying={isPlaying}
                        />
                      </div>
                    )}

                    {activePanel === 'lyrics' && (
                      <LyricsPanel
                        track={activeTrack}
                        currentTime={currentTime}
                        isPlaying={isPlaying}
                        onSeek={handleSeek}
                      />
                    )}

                    {activePanel === 'note' && (
                      <div className="relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.07] bg-[#080a13]/75 p-5 sm:min-h-[420px] sm:p-7">
                        <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full blur-3xl" style={{ background: `${activeTrack.colors.primary}17` }} />
                        <div className="relative">
                          <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl border" style={{ color: activeTrack.colors.primary, background: `${activeTrack.colors.primary}12`, borderColor: `${activeTrack.colors.primary}30` }}>
                            <Heart className="h-5 w-5" />
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: activeTrack.colors.primary }}>A note from me to you</p>
                          <h3 className="mt-2 text-xl font-bold leading-snug text-white sm:text-2xl">{activeTrack.theme}</h3>
                          <p className="mt-5 text-base leading-relaxed text-slate-200 sm:text-lg">“{activeTrack.personalNote}”</p>
                        </div>
                        <div className="relative mt-8 flex items-center justify-between border-t border-white/[0.08] pt-4">
                          <p className="text-xs text-slate-500">A tiny reminder, whenever you need it.</p>
                          <span className="text-xl" aria-hidden="true">♡</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </main>

        {/* Docked player: familiar controls stay together while she explores the songs and lyrics. */}
        <div className="relative z-30 mt-auto pb-1 pt-2">
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
          <p className="mt-3 flex items-center justify-center gap-2 text-center text-[9px] text-slate-600 sm:text-[10px]">
            <Sparkles className="h-3 w-3" />
            Made with love, for your ears and your heart.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SonicBloomScene;
