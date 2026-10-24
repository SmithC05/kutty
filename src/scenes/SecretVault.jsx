import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScene, useAudio } from '../context';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { vaultConfig, birthdayConfig } from '../config';
import { SCENES } from '../constants';

const KEYPAD = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['♡', '0', '⌫'],
];

/* ─────────────────────────────────────────────────────────────
   Stable background particle definitions (generated once)
   Eliminates inline Math.random() re-evaluation on keypresses
   ───────────────────────────────────────────────────────────── */
const STABLE_FLOATING_PARTICLES = [
  { id: 0,  emoji: '💕', left: 8,  size: 14, yDistance: 440, xDrift: 15,  rot: 14,  duration: 9.5, delay: 0.2, peakOpacity: 0.70 },
  { id: 1,  emoji: '✨', left: 18, size: 12, yDistance: 380, xDrift: -12, rot: -16, duration: 8.0, delay: 2.4, peakOpacity: 0.80 },
  { id: 2,  emoji: '🌸', left: 27, size: 16, yDistance: 500, xDrift: 20,  rot: 24,  duration: 11.0, delay: 1.0, peakOpacity: 0.65 },
  { id: 3,  emoji: '💗', left: 41, size: 13, yDistance: 420, xDrift: -16, rot: -10, duration: 9.0, delay: 3.8, peakOpacity: 0.75 },
  { id: 4,  emoji: '⭐', left: 53, size: 11, yDistance: 360, xDrift: 12,  rot: 18,  duration: 7.6, delay: 1.6, peakOpacity: 0.70 },
  { id: 5,  emoji: '🩷', left: 65, size: 15, yDistance: 470, xDrift: -14, rot: -22, duration: 10.4, delay: 3.0, peakOpacity: 0.70 },
  { id: 6,  emoji: '✨', left: 77, size: 13, yDistance: 410, xDrift: 16,  rot: 15,  duration: 8.4, delay: 0.6, peakOpacity: 0.85 },
  { id: 7,  emoji: '🌸', left: 88, size: 15, yDistance: 490, xDrift: -20, rot: -12, duration: 11.2, delay: 4.8, peakOpacity: 0.60 },
  { id: 8,  emoji: '💕', left: 13, size: 13, yDistance: 430, xDrift: -10, rot: -15, duration: 9.2, delay: 5.8, peakOpacity: 0.75 },
  { id: 9,  emoji: '✨', left: 23, size: 14, yDistance: 390, xDrift: 18,  rot: 20,  duration: 8.2, delay: 4.4, peakOpacity: 0.80 },
  { id: 10, emoji: '🌷', left: 35, size: 14, yDistance: 460, xDrift: -14, rot: 12,  duration: 10.0, delay: 2.0, peakOpacity: 0.65 },
  { id: 11, emoji: '💗', left: 47, size: 15, yDistance: 440, xDrift: 16,  rot: -14, duration: 9.6, delay: 6.8, peakOpacity: 0.70 },
  { id: 12, emoji: '⭐', left: 61, size: 12, yDistance: 370, xDrift: -12, rot: 16,  duration: 7.8, delay: 5.2, peakOpacity: 0.75 },
  { id: 13, emoji: '🩷', left: 73, size: 13, yDistance: 450, xDrift: 14,  rot: -18, duration: 10.1, delay: 3.6, peakOpacity: 0.70 },
  { id: 14, emoji: '✨', left: 83, size: 12, yDistance: 400, xDrift: -16, rot: 14,  duration: 8.6, delay: 1.4, peakOpacity: 0.80 },
  { id: 15, emoji: '🌸', left: 93, size: 14, yDistance: 480, xDrift: 12,  rot: -10, duration: 11.0, delay: 6.4, peakOpacity: 0.65 },
];

/* ─────────────────────────────────────────────────────────────
   Stable bokeh blobs in background
   ───────────────────────────────────────────────────────────── */
const STABLE_BOKEH_BLOBS = [
  { w: 320, h: 320, left: '10%', top: '5%',  color: 'rgba(255,182,193,0.25)', duration: 6.0, delay: 0 },
  { w: 250, h: 250, left: '60%', top: '20%', color: 'rgba(255,160,220,0.20)', duration: 7.5, delay: 0.8 },
  { w: 200, h: 200, left: '5%',  top: '55%', color: 'rgba(255,200,230,0.18)', duration: 9.0, delay: 1.6 },
  { w: 280, h: 280, left: '65%', top: '60%', color: 'rgba(255,182,193,0.22)', duration: 8.5, delay: 2.4 },
  { w: 180, h: 180, left: '40%', top: '75%', color: 'rgba(220,150,200,0.15)', duration: 7.0, delay: 1.2 },
];

/* ─────────────────────────────────────────────────────────────
   Stable center burst particles on correct PIN
   ───────────────────────────────────────────────────────────── */
const STABLE_BURST_PARTICLES = Array.from({ length: 22 }, (_, i) => {
  const angle = (i / 22) * Math.PI * 2 + (i % 2 === 0 ? 0.15 : -0.15);
  const dist = 110 + (i % 5) * 32;
  const x = Math.cos(angle) * dist;
  const y = Math.sin(angle) * dist - 75; // upward fountain bias
  const emoji = ['💖', '💕', '✨', '🌸', '💗', '⭐', '🩷', '✨'][i % 8];
  return {
    id: i,
    emoji,
    x,
    y,
    rot: (i % 2 === 0 ? 1 : -1) * (14 + (i % 4) * 10),
    delay: (i % 6) * 0.035,
  };
});

/* ─────────────────────────────────────────────────────────────
   Floating sparkles / hearts in background
   ───────────────────────────────────────────────────────────── */
function FloatingHearts({ reducedMotion }) {
  if (reducedMotion) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {STABLE_FLOATING_PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-sm select-none"
          style={{
            left: `${p.left}%`,
            bottom: '-8%',
            fontSize: `${p.size}px`,
          }}
          initial={{ y: 0, opacity: 0, x: 0, rotate: 0 }}
          animate={{
            y: [0, -p.yDistance],
            opacity: [0, p.peakOpacity, p.peakOpacity * 0.9, 0],
            x: [0, p.xDrift, 0],
            rotate: [0, p.rot],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeOut',
          }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Bokeh blobs in background
   ───────────────────────────────────────────────────────────── */
function BokehBackground({ reducedMotion }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {STABLE_BOKEH_BLOBS.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: blob.w,
            height: blob.h,
            left: blob.left,
            top: blob.top,
            background: blob.color,
          }}
          animate={
            reducedMotion
              ? { opacity: 0.8 }
              : {
                  scale: [1, 1.08, 1],
                  opacity: [0.7, 0.95, 0.7],
                }
          }
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: blob.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Keypad button with tactile spring compression
   ───────────────────────────────────────────────────────────── */
function KeyButton({ label, onPress, disabled, reducedMotion }) {
  const isAction = label === '⌫' || label === '♡';

  return (
    <motion.button
      type="button"
      className={`relative flex items-center justify-center rounded-2xl select-none touch-none focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-pink-100 transition-colors
        ${isAction
          ? 'bg-white/20 text-pink-300/80 active:bg-white/35'
          : 'bg-white/32 text-rose-900/85 shadow-[0_4px_16px_rgba(255,150,180,0.18)]'
        }`}
      style={{
        height: 60,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.55)',
        fontSize: isAction ? 20 : 25,
        fontFamily: isAction ? 'inherit' : "'Playfair Display', serif",
        fontWeight: 400,
      }}
      whileTap={
        !disabled
          ? {
              scale: reducedMotion ? 0.98 : 0.92,
              y: reducedMotion ? 0 : 1,
              boxShadow: '0 2px 8px rgba(255,130,170,0.28)',
            }
          : {}
      }
      whileHover={
        !disabled && !reducedMotion
          ? {
              scale: 1.035,
              y: -1,
              backgroundColor: 'rgba(255,255,255,0.52)',
              boxShadow: '0 6px 20px rgba(255,140,175,0.28)',
            }
          : {}
      }
      transition={{
        type: 'spring',
        stiffness: 450,
        damping: 24,
      }}
      onClick={() => !disabled && onPress(label)}
      disabled={disabled}
      aria-label={label === '⌫' ? 'Backspace' : label === '♡' ? 'Heart' : `Number ${label}`}
    >
      {label}
    </motion.button>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Secret Vault Component
   ───────────────────────────────────────────────────────────── */
export function SecretVault() {
  const { transitionTo } = useScene();
  const { playSfx, playTrack } = useAudio();
  const reducedMotion = useReducedMotion();

  const [pin, setPin] = useState('');
  const [status, setStatus] = useState('idle'); // idle | wrong | correct | dissolving
  const [shaking, setShaking] = useState(false);
  const [burstHearts, setBurstHearts] = useState(false);
  const [isUnlockedIcon, setIsUnlockedIcon] = useState(false);

  const navigatingRef = useRef(false);
  const timeoutsRef = useRef([]);

  // Ensure remo continues playing while entering PIN
  useEffect(() => {
    playTrack('remo');
  }, [playTrack]);

  /* Safe timer registration that cleans up on unmount */
  const registerTimeout = useCallback((fn, delay) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  /* Cleanup pending timers on unmount */
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  const handleKey = useCallback(
    (label) => {
      if (status === 'correct' || status === 'dissolving' || navigatingRef.current) return;

      if (label === '⌫') {
        setPin((p) => p.slice(0, -1));
        if (status === 'wrong') setStatus('idle');
        return;
      }

      if (label === '♡') return; // decorative key

      const digit = label;
      const newPin = (pin + digit).slice(0, 4);
      setPin(newPin);

      if (newPin.length === 4) {
        if (newPin === vaultConfig.secretPin) {
          // ✅ CORRECT PIN
          setStatus('correct');
          setBurstHearts(true);
          setIsUnlockedIcon(true);
          playSfx('sparkle');
          playSfx('heartbeat');

          // Transition to Deva Deva Instrumental on successful PIN entry
          playTrack('deva_deva');

          /* Short delightful celebration before dissolve */
          registerTimeout(() => {
            setStatus('dissolving');

            registerTimeout(() => {
              if (!navigatingRef.current) {
                navigatingRef.current = true;
                transitionTo(SCENES.LORD_SHIVA_BLESSING);
              }
            }, 1600);
          }, 1500);
        } else {
          // ❌ WRONG PIN — gentle horizontal shake & soft pink feedback pulse
          setStatus('wrong');
          setShaking(true);

          registerTimeout(() => {
            setShaking(false);
            setPin('');
            setStatus('idle');
          }, 1200);
        }
      }
    },
    [pin, status, transitionTo, playSfx, playTrack, registerTimeout]
  );

  /* Keyboard entry support (0-9, Backspace) */
  useEffect(() => {
    const onKeyDown = (e) => {
      if (status === 'correct' || status === 'dissolving') return;
      if (e.key >= '0' && e.key <= '9') {
        handleKey(e.key);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleKey('⌫');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey, status]);

  const progress = pin.length;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 30%, #ffeaf2 60%, #fce4ec 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.4 }}
    >
      <BokehBackground reducedMotion={reducedMotion} />
      <FloatingHearts reducedMotion={reducedMotion} />

      {/* Burst hearts & sparkles rising from card center on correct PIN */}
      <AnimatePresence>
        {burstHearts && (
          <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden flex items-center justify-center">
            {STABLE_BURST_PARTICLES.map((p) => (
              <motion.div
                key={p.id}
                className="absolute text-2xl select-none"
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  x: p.x,
                  y: p.y,
                  scale: [0.3, 1.3, 0.85],
                  rotate: [0, p.rot],
                }}
                transition={{
                  duration: 1.4,
                  delay: p.delay,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {p.emoji}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Soft radial dissolve overlay on scene exit */}
      <AnimatePresence>
        {status === 'dissolving' && (
          <motion.div
            className="absolute inset-0 z-50 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(255,182,193,0.95) 0%, rgba(255,255,255,0.85) 60%, transparent 100%)',
            }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1.4 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>

      {/* ── Frosted-Glass Lock Card ── */}
      <motion.div
        className="relative z-10 w-full max-w-xs mx-4"
        animate={
          shaking && !reducedMotion
            ? {
                x: [-6, 6, -4, 4, -2, 2, 0],
              }
            : { x: 0 }
        }
        transition={{ duration: 0.45, ease: 'easeInOut' }}
      >
        <motion.div
          className="rounded-3xl p-7 sm:p-8 flex flex-col items-center gap-5 sm:gap-6 relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.48)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.72)',
          }}
          animate={
            status === 'correct' || status === 'dissolving'
              ? {
                  scale: [1, 1.035, 1],
                  boxShadow: [
                    '0 20px 60px rgba(255,100,150,0.22)',
                    '0 20px 80px rgba(255,110,165,0.55), 0 0 45px rgba(255,160,200,0.6)',
                    '0 20px 70px rgba(255,110,165,0.42)',
                  ],
                }
              : status === 'wrong'
              ? {
                  boxShadow: '0 20px 60px rgba(251,113,133,0.35), 0 0 25px rgba(251,113,133,0.22)',
                }
              : {
                  boxShadow: [
                    '0 20px 60px rgba(255,120,160,0.18), 0 4px 20px rgba(255,180,210,0.12), inset 0 1px 1px rgba(255,255,255,0.85)',
                    '0 20px 65px rgba(255,130,170,0.24), 0 4px 24px rgba(255,190,215,0.18), inset 0 1px 2px rgba(255,255,255,0.95)',
                    '0 20px 60px rgba(255,120,160,0.18), 0 4px 20px rgba(255,180,210,0.12), inset 0 1px 1px rgba(255,255,255,0.85)',
                  ],
                }
          }
          transition={
            status === 'correct' || status === 'dissolving'
              ? { duration: 0.8 }
              : status === 'wrong'
              ? { duration: 0.4 }
              : { duration: 5.0, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          {/* Lock icon with idle breathing & unlock blossom */}
          <motion.div
            className="text-5xl select-none"
            animate={
              status === 'correct' || status === 'dissolving'
                ? {
                    scale: [1, 1.35, 1.08],
                    rotate: [0, -10, 8, 0],
                    filter: [
                      'drop-shadow(0 0 0px rgba(255,100,150,0))',
                      'drop-shadow(0 0 16px rgba(255,105,180,0.85))',
                      'drop-shadow(0 0 10px rgba(255,105,180,0.5))',
                    ],
                  }
                : status === 'wrong'
                ? {
                    x: [-4, 4, -3, 3, 0],
                    rotate: [-6, 6, -3, 3, 0],
                    scale: [1, 0.95, 1],
                  }
                : reducedMotion
                ? { y: 0, scale: 1 }
                : {
                    y: [0, -3.5, 0],
                    scale: [1, 1.035, 1, 1.018, 1],
                  }
            }
            transition={
              status === 'correct' || status === 'dissolving'
                ? { duration: 0.75, ease: 'backOut' }
                : status === 'wrong'
                ? { duration: 0.45, ease: 'easeInOut' }
                : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            {status === 'correct' || status === 'dissolving'
              ? '💖'
              : isUnlockedIcon
              ? '🔓'
              : '🔒'}
          </motion.div>

          {/* Heading & friendly feedback message */}
          <div className="text-center">
            <h2
              className="text-rose-700/90 text-xl font-light italic mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              For {birthdayConfig.nickname} 💕
            </h2>
            <AnimatePresence mode="wait">
              {status === 'wrong' ? (
                <motion.p
                  key="wrong"
                  className="text-rose-400/90 text-sm tracking-wide font-medium"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  Hmm... try again 💕
                </motion.p>
              ) : status === 'correct' || status === 'dissolving' ? (
                <motion.p
                  key="correct"
                  className="text-rose-500/95 text-sm tracking-wide font-medium"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  You found it ✨
                </motion.p>
              ) : (
                <motion.p
                  key="idle"
                  className="text-rose-400/70 text-sm tracking-wide"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  Unlock your memories ✨
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Tactile Glowing PIN Indicators */}
          <div className="flex gap-4 items-center justify-center my-0.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                className="rounded-full relative"
                style={{
                  width: 14,
                  height: 14,
                  border: '1.5px solid rgba(255, 180, 205, 0.55)',
                }}
                animate={{
                  scale:
                    i < progress
                      ? status === 'correct'
                        ? 1.18
                        : reducedMotion
                        ? 1.05
                        : [1, 1.25, 1.08]
                      : 1,
                  backgroundColor:
                    i < progress
                      ? status === 'correct'
                        ? 'rgba(236, 72, 153, 0.95)'
                        : status === 'wrong'
                        ? 'rgba(251, 113, 133, 0.85)'
                        : 'rgba(244, 63, 94, 0.90)'
                      : 'rgba(255, 255, 255, 0.30)',
                  boxShadow:
                    i < progress
                      ? status === 'correct'
                        ? '0 0 16px rgba(236,72,153,0.85), 0 0 30px rgba(255,182,193,0.6)'
                        : status === 'wrong'
                        ? '0 0 12px rgba(251,113,133,0.6)'
                        : '0 2px 12px rgba(244,63,94,0.45), 0 0 6px rgba(255,182,193,0.5)'
                      : 'inset 0 1px 2px rgba(0,0,0,0.05)',
                }}
                transition={{
                  type: 'spring',
                  stiffness: 420,
                  damping: 22,
                }}
              >
                {/* Luminous bead highlight for filled dots */}
                {i < progress && (
                  <span
                    className="absolute top-[1.5px] left-[2px] w-[3px] h-[3px] rounded-full bg-white/80 pointer-events-none"
                    aria-hidden="true"
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Keypad */}
          <div className="w-full grid grid-cols-3 gap-2.5 sm:gap-3">
            {KEYPAD.map((row, ri) =>
              row.map((key, ci) => (
                <KeyButton
                  key={`${ri}-${ci}`}
                  label={key}
                  onPress={handleKey}
                  disabled={status === 'correct' || status === 'dissolving'}
                  reducedMotion={reducedMotion}
                />
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
