import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music2, Pause, Play, Sparkles } from 'lucide-react';

/**
 * CinematicArtworkCard — Dedicated Song Artwork Canvas
 *
 * Matches the reference cinematic music player design with floating heart,
 * subtle waveform, and signature calligraphy typography in the bottom right.
 */
function CinematicArtworkCardComponent({
  activeTrack,
  isPlaying = false,
  onTogglePlay,
  reducedMotion = false,
  className = '',
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const primary = activeTrack?.colors?.primary || '#f59e0b';
  const secondary = activeTrack?.colors?.secondary || '#fb7185';

  // Reset image state when active track changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [activeTrack?.id]);

  const imageSrc = !imageError && activeTrack?.artwork
    ? activeTrack.artwork
    : activeTrack?.thumbnail || null;

  return (
    <div
      className={`group relative w-full overflow-hidden rounded-2xl border shadow-2xl transition-all duration-700 sm:rounded-3xl ${className}`}
      style={{
        borderColor: activeTrack?.colors?.borderLight || 'rgba(255,255,255,0.12)',
        backgroundColor: activeTrack?.colors?.panelBg || '#0c0e14',
        boxShadow: `0 20px 50px -10px rgba(0,0,0,0.7), 0 0 35px ${primary}20`,
      }}
    >
      {/* 16:9 Aspect Ratio Container */}
      <div className="relative aspect-[16/9] w-full min-h-[220px] max-h-[360px] lg:max-h-[390px] xl:max-h-[420px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTrack?.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: reducedMotion ? 0.2 : 0.45, ease: 'easeOut' }}
            className="absolute inset-0 h-full w-full"
          >
            {/* Real Artwork Image */}
            {imageSrc && (
              <img
                src={imageSrc}
                alt={activeTrack.artworkAlt || activeTrack.title}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                className={`h-full w-full object-cover object-center transition-all duration-700 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                } ${isPlaying && !reducedMotion ? 'scale-[1.02]' : 'scale-100'}`}
              />
            )}

            {/* Cinematic Procedural Fallback (active while image loads or if file isn't uploaded yet) */}
            {(!imageLoaded || (!imageSrc && imageError)) && (
              <div
                className="absolute inset-0 flex h-full w-full flex-col items-center justify-center overflow-hidden"
                style={{
                  background: `radial-gradient(ellipse at 50% 35%, ${primary}25 0%, #0d1017 65%, #07080c 100%)`,
                }}
              >
                {/* Subtle Cinematic Ambient Lighting */}
                <div
                  className="pointer-events-none absolute -top-1/4 -right-1/4 h-72 w-72 rounded-full blur-[80px]"
                  style={{ background: `${secondary}20` }}
                />
                <div
                  className="pointer-events-none absolute -bottom-1/4 -left-1/4 h-72 w-72 rounded-full blur-[90px]"
                  style={{ background: `${primary}25` }}
                />

                <div className="relative z-10 flex flex-col items-center px-4 text-center">
                  <div
                    className="mb-3 grid h-14 w-14 place-items-center rounded-2xl border border-white/10 shadow-lg backdrop-blur-md"
                    style={{
                      background: `linear-gradient(135deg, ${primary}20, rgba(255,255,255,0.03))`,
                    }}
                  >
                    <Music2 className="h-6 w-6" style={{ color: primary }} />
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium tracking-wide text-slate-300 backdrop-blur-sm">
                    <Sparkles className="h-3 w-3" style={{ color: primary }} />
                    <span>{activeTrack?.visualMood || 'Cinematic Song Artwork'}</span>
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Cinematic Film Vignette Overlay (Darker lower edge for title readability) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

        {/* Magale Song-Specific Motion: Emotional Healing & Calming Twilight Atmosphere */}
        {activeTrack?.id === 'magale' && (
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${
              isPlaying ? 'opacity-100' : 'opacity-35'
            }`}
          >
            {/* Soft, slow-moving lavender haze behind upper-left sky */}
            <div
              className={`absolute -top-10 -left-10 h-52 w-52 rounded-full blur-[70px] transition-all duration-1000 ${
                isPlaying && !reducedMotion ? 'animate-pulse' : ''
              }`}
              style={{
                background: 'radial-gradient(circle, rgba(184, 165, 232, 0.30) 0%, rgba(244, 114, 182, 0.12) 50%, transparent 70%)',
                animationDuration: '6s',
              }}
            />

            {/* Restrained concentric sound wave ripples expanding and fading in the peaceful sky */}
            {isPlaying && !reducedMotion && (
              <div className="absolute top-1/3 right-1/4 pointer-events-none">
                <span
                  className="absolute -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-full border border-purple-300/30 animate-ping opacity-20"
                  style={{ animationDuration: '4.5s' }}
                />
                <span
                  className="absolute -translate-x-1/2 -translate-y-1/2 h-36 w-36 rounded-full border border-purple-200/20 animate-ping opacity-15"
                  style={{ animationDuration: '6.5s', animationDelay: '1.8s' }}
                />
              </div>
            )}

            {/* Fine twilight ambient particles drifting like evening light */}
            {isPlaying && !reducedMotion && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[
                  { left: '20%', top: '30%', delay: '0s', dur: '7s' },
                  { left: '45%', top: '25%', delay: '1.5s', dur: '9s' },
                  { left: '70%', top: '35%', delay: '3s', dur: '8s' },
                  { left: '85%', top: '20%', delay: '0.8s', dur: '6.5s' },
                ].map((p, i) => (
                  <span
                    key={i}
                    className="absolute h-1 w-1 rounded-full bg-[#fde68a] opacity-60 blur-[0.5px] animate-pulse"
                    style={{
                      left: p.left,
                      top: p.top,
                      animationDuration: p.dur,
                      animationDelay: p.delay,
                      boxShadow: '0 0 6px rgba(253, 230, 138, 0.8)',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Alakolava Song-Specific Motion: Sunlit Courtyard, Rose Blossom Motes & Gentle Daylight */}
        {activeTrack?.id === 'alakolava' && (
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${
              isPlaying ? 'opacity-100' : 'opacity-35'
            }`}
          >
            {/* Subtle natural sunlight warmth filtering from upper right sky */}
            <div
              className={`absolute -top-12 -right-8 h-60 w-60 rounded-full blur-[75px] transition-all duration-1000 ${
                isPlaying && !reducedMotion ? 'animate-pulse' : ''
              }`}
              style={{
                background: 'radial-gradient(circle, rgba(254, 250, 224, 0.28) 0%, rgba(244, 114, 182, 0.12) 50%, transparent 75%)',
                animationDuration: '7s',
              }}
            />

            {/* Understated sage & cream ambient highlight in lower courtyard corner */}
            <div
              className="absolute -bottom-10 -left-10 h-44 w-44 rounded-full blur-[65px]"
              style={{
                background: 'radial-gradient(circle, rgba(107, 143, 113, 0.18) 0%, transparent 70%)',
              }}
            />

            {/* Extremely restrained floating blossom petal light particles */}
            {isPlaying && !reducedMotion && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[
                  { left: '28%', top: '22%', delay: '0s', dur: '8s' },
                  { left: '52%', top: '18%', delay: '2s', dur: '9.5s' },
                  { left: '76%', top: '32%', delay: '3.5s', dur: '7.5s' },
                  { left: '88%', top: '24%', delay: '1s', dur: '8.5s' },
                ].map((p, i) => (
                  <span
                    key={i}
                    className="absolute h-1.5 w-1.5 rounded-full bg-[#fda4af] opacity-50 blur-[0.4px] animate-pulse"
                    style={{
                      left: p.left,
                      top: p.top,
                      animationDuration: p.dur,
                      animationDelay: p.delay,
                      boxShadow: '0 0 6px rgba(244, 114, 182, 0.7)',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Engey Andha Vennnila Song-Specific Motion: Quiet Rooftop Moonlit Shimmer & Distant Stars */}
        {activeTrack?.id === 'engey-andha-vennnila' && (
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${
              isPlaying ? 'opacity-100' : 'opacity-40'
            }`}
          >
            {/* Soft moonlight glow halo around the moon in upper-left sky */}
            <div
              className={`absolute -top-10 left-[18%] h-52 w-52 rounded-full blur-[65px] transition-all duration-1000 ${
                isPlaying && !reducedMotion ? 'animate-pulse' : ''
              }`}
              style={{
                background: 'radial-gradient(circle, rgba(203, 213, 225, 0.28) 0%, rgba(129, 140, 248, 0.14) 45%, transparent 70%)',
                animationDuration: '8s',
              }}
            />

            {/* Subtle cool blue mist along left and bottom edges */}
            <div
              className="absolute -bottom-8 -left-8 h-40 w-60 rounded-full blur-[60px]"
              style={{
                background: 'radial-gradient(ellipse, rgba(96, 165, 250, 0.15) 0%, transparent 70%)',
              }}
            />

            {/* Small, distant stars with occasional gentle twinkles (strictly non-obstructive) */}
            {isPlaying && !reducedMotion && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[
                  { left: '12%', top: '24%', delay: '0s', dur: '5s', size: '1.5px' },
                  { left: '46%', top: '16%', delay: '2s', dur: '7s', size: '1px' },
                  { left: '60%', top: '28%', delay: '3.5s', dur: '6s', size: '1.5px' },
                  { left: '80%', top: '18%', delay: '1s', dur: '8s', size: '1px' },
                  { left: '22%', top: '38%', delay: '4s', dur: '6.5s', size: '1px' },
                ].map((s, i) => (
                  <span
                    key={i}
                    className="absolute rounded-full bg-slate-100 opacity-60 animate-pulse"
                    style={{
                      left: s.left,
                      top: s.top,
                      width: s.size,
                      height: s.size,
                      animationDuration: s.dur,
                      animationDelay: s.delay,
                      boxShadow: '0 0 4px rgba(226, 232, 240, 0.9)',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Life of Pazham Song-Specific Motion: Plant-Filled Study Room, Window Sunlight & Dust Motes */}
        {activeTrack?.id === 'life-of-pazham' && (
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${
              isPlaying ? 'opacity-100' : 'opacity-35'
            }`}
          >
            {/* Soft natural sunlight drifting through the window on the left */}
            <div
              className={`absolute -top-12 -left-8 h-64 w-64 rounded-full blur-[70px] transition-all duration-1000 ${
                isPlaying && !reducedMotion ? 'animate-pulse' : ''
              }`}
              style={{
                background: 'radial-gradient(circle, rgba(254, 250, 224, 0.26) 0%, rgba(134, 239, 172, 0.12) 45%, transparent 70%)',
                animationDuration: '7s',
              }}
            />

            {/* Subtle sage-green plant corner ambient depth on the right */}
            <div
              className="absolute -bottom-8 -right-8 h-48 w-48 rounded-full blur-[65px]"
              style={{
                background: 'radial-gradient(circle, rgba(107, 158, 120, 0.20) 0%, transparent 70%)',
              }}
            />

            {/* Fine sunlit golden dust motes drifting peacefully in the study room air */}
            {isPlaying && !reducedMotion && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[
                  { left: '22%', top: '35%', delay: '0s', dur: '8s' },
                  { left: '38%', top: '28%', delay: '2.5s', dur: '9.5s' },
                  { left: '55%', top: '42%', delay: '1s', dur: '7.5s' },
                  { left: '72%', top: '25%', delay: '3s', dur: '8.5s' },
                  { left: '84%', top: '38%', delay: '4.5s', dur: '9s' },
                ].map((m, i) => (
                  <span
                    key={i}
                    className="absolute h-1 w-1 rounded-full bg-[#fefae0] opacity-55 blur-[0.3px] animate-pulse"
                    style={{
                      left: m.left,
                      top: m.top,
                      animationDuration: m.dur,
                      animationDelay: m.delay,
                      boxShadow: '0 0 5px rgba(254, 250, 224, 0.8)',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Floating Glowing Heart Outline in Sky (as in reference mockup) */}
        <div className="pointer-events-none absolute top-4 right-8 sm:top-6 sm:right-12">
          <svg
            className="h-8 w-8 text-white/75 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.65)] sm:h-10 sm:w-10 animate-pulse"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </div>

        {/* Subtle Waveform graphic in bottom-left */}
        <div className="pointer-events-none absolute bottom-4 left-4 hidden sm:flex items-center gap-0.5 opacity-60">
          {[25, 45, 20, 70, 35, 85, 30, 65, 40, 75, 30, 55, 20].map((h, i) => (
            <span
              key={i}
              className="w-0.5 rounded-full transition-colors duration-500"
              style={{
                height: `${h * 0.28}px`,
                backgroundColor: activeTrack?.colors?.accent || 'rgba(255,255,255,0.7)',
                opacity: 0.4 + (h / 100) * 0.6,
              }}
            />
          ))}
        </div>

        {/* Center Hover Play Overlay Button */}
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="absolute inset-0 z-10 grid place-items-center bg-black/20 opacity-0 transition-opacity duration-300 hover:opacity-100 focus:opacity-100 focus:outline-none"
        >
          <div
            className="grid h-14 w-14 place-items-center rounded-full text-black shadow-2xl transition-transform duration-200 hover:scale-110 active:scale-95"
            style={{
              background: `linear-gradient(135deg, #ffffff, ${activeTrack?.colors?.playButtonBg || '#fef3c7'})`,
              boxShadow: `0 0 30px ${activeTrack?.colors?.playButtonGlow || 'rgba(255,255,255,0.6)'}`,
            }}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 fill-current" />
            ) : (
              <Play className="ml-1 h-6 w-6 fill-current" />
            )}
          </div>
        </button>

        {/* Bottom-Right Signature Calligraphy Overlay (Exact match to reference mockup) */}
        <div className="pointer-events-none absolute bottom-3.5 right-4 sm:bottom-5 sm:right-6 text-right">
          <h2
            className="font-cursive text-3xl sm:text-5xl md:text-6xl leading-none drop-shadow-md transition-colors duration-500"
            style={{ color: activeTrack?.colors?.core || '#fbeee0' }}
          >
            {activeTrack?.title}
          </h2>
          {activeTrack?.film && (
            <p className="font-['Outfit',sans-serif] tracking-[0.25em] text-[10px] sm:text-xs font-semibold text-white/85 uppercase mt-1">
              {activeTrack.film}
            </p>
          )}
          <p
            className="font-cursive text-xs sm:text-sm mt-0.5 drop-shadow transition-colors duration-500"
            style={{ color: activeTrack?.colors?.accent || 'rgba(254, 205, 211, 0.9)' }}
          >
            {activeTrack?.theme} ❤️
          </p>
        </div>
      </div>
    </div>
  );
}

export const CinematicArtworkCard = React.memo(CinematicArtworkCardComponent);
export default CinematicArtworkCard;
