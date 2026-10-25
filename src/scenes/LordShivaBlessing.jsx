import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useScene, useAudio } from '../context';
import { SCENES } from '../constants';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { ShivaScene3D } from './shiva/ShivaScene3D';
import { DevotionalUIOverlay } from './shiva/DevotionalUIOverlay';
import { ShivaFallback2D } from './shiva/ShivaFallback2D';
import { SHIVA_DEPICTION_CONFIG } from './shiva/shivaAssets';

/**
 * LordShivaBlessing — Phase 11: Lord Shiva's Blessings 🔱
 * Cinematic 3D Darshan — React Three Fiber + GSAP
 * 
 * Replaces any geometric primitive depiction with a dignified, authentic devotional darshan
 * integrated into a real 3D Himalayan Mount Kailash environment.
 * 
 * Act Progression:
 *   I   — Arrival at Kailash (warm ivory paper transition -> midnight 3D world)
 *   II  — Sacred Stillness (moonlight, mountains, and mist settle)
 *   III — Lord Shiva's Reveal (divine halo illuminates, contemplation pause)
 *   IV  — Receive Blessings (golden light blooms across mist and sanctuary)
 *   V   — Next Journey ("Continue to Just You →")
 */

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

export function LordShivaBlessing() {
  const { transitionTo } = useScene();
  const { playTrack } = useAudio();
  const reducedMotion = useReducedMotion();

  const [hasWebGL, setHasWebGL] = useState(true);
  const [act, setAct] = useState('transition'); // 'transition' | 'environment' | 'reveal' | 'blessing' | 'complete'
  const [revealProgress, setRevealProgress] = useState(reducedMotion ? 1 : 0);
  const [blessingProgress, setBlessingProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Duplicate-tap guard
  const actionFiredRef = useRef(false);

  // Fade out Dheema and start Deva Deva on entering Lord Shiva's Blessings
  useEffect(() => {
    playTrack('deva_deva');
  }, [playTrack]);

  // Check WebGL availability on mount
  useEffect(() => {
    setHasWebGL(checkWebGLSupport());
  }, []);

  // Coordinated GSAP Timeline for Acts I -> II -> III
  useEffect(() => {
    if (reducedMotion) {
      setAct('reveal');
      setRevealProgress(1);
      return;
    }

    const stateObj = { reveal: 0 };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // ACT I: Arrival at Kailash (0s -> 2.0s)
      // Warm ivory overlay fades out, 3D night world settles
      tl.to({}, { duration: 1.2 })
        .call(() => setAct('environment'))

      // ACT II: Sacred Stillness (1.5s -> 3.5s)
      // Moonlight and drifting mist settle
        .to({}, { duration: 1.8 })
        .call(() => setAct('reveal'))

      // ACT III: Lord Shiva's Reveal (3.5s -> 6.0s)
      // Mist parts, celestial aura & cool rim light ramp up smoothly
        .to(stateObj, {
          reveal: 1,
          duration: 2.5,
          ease: 'power2.out',
          onUpdate: () => {
            setRevealProgress(stateObj.reveal);
          },
        });
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  // ACT IV: Receive Blessings (Golden Illumination Bloom)
  const blessingTweenRef = useRef(null);
  const transitionTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (blessingTweenRef.current) {
        blessingTweenRef.current.kill();
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const handleReceiveBlessings = useCallback(() => {
    if (act === 'blessing' || act === 'complete') return;
    setAct('blessing');

    if (reducedMotion) {
      setBlessingProgress(1);
      return;
    }

    const stateObj = { blessing: 0 };
    if (blessingTweenRef.current) blessingTweenRef.current.kill();
    blessingTweenRef.current = gsap.to(stateObj, {
      blessing: 1,
      duration: 2.8,
      ease: 'power2.out',
      onUpdate: () => {
        setBlessingProgress(stateObj.blessing);
      },
      onComplete: () => {
        setAct('complete');
      },
    });
  }, [act, reducedMotion]);

  // ACT V: Continue to Just You
  const handleContinue = useCallback(() => {
    if (actionFiredRef.current) return;
    actionFiredRef.current = true;
    setIsTransitioning(true);

    // Give a subtle golden wash before next scene
    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    transitionTimeoutRef.current = setTimeout(() => {
      transitionTo(SCENES.MEMORY_JOURNEY_SOLO);
    }, 600);
  }, [transitionTo]);

  // Fallback if device has no WebGL support
  if (!hasWebGL) {
    return (
      <ShivaFallback2D
        act={act}
        onReceiveBlessings={handleReceiveBlessings}
        onContinue={handleContinue}
        isTransitioning={isTransitioning}
      />
    );
  }

  const { palette } = SHIVA_DEPICTION_CONFIG;

  return (
    <div
      className="fixed inset-0 w-screen h-screen min-h-[100dvh] overflow-hidden select-none"
      style={{ background: palette.midnight }}
    >
      {/* ── 3D Canvas (React Three Fiber) ──────────────────────────────────── */}
      <Canvas
        camera={{ position: [0, 0.4, 6.2], fov: 42 }}
        dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        className="w-full h-full block"
      >
        <ShivaScene3D
          act={act}
          revealProgress={revealProgress}
          blessingProgress={blessingProgress}
          reducedMotion={reducedMotion}
        />
      </Canvas>

      {/* ── Devotional UI & Typography Overlay ──────────────────────────────── */}
      <DevotionalUIOverlay
        act={act}
        onReceiveBlessings={handleReceiveBlessings}
        onContinue={handleContinue}
        isTransitioning={isTransitioning}
      />

      {/* ── Act I Entrance Transition Veil (Warm Ivory -> Midnight Blue) ──── */}
      <AnimatePresence>
        {act === 'transition' && !reducedMotion && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-30"
            style={{
              background: 'linear-gradient(to bottom, #FAF5EA 0%, #D8C398 45%, #081426 100%)',
            }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>

      {/* ── Scene Exit Golden Veil ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700 z-40"
        style={{
          opacity: isTransitioning ? 0.85 : 0,
          background: 'radial-gradient(circle at center, rgba(230,199,122,0.65) 0%, rgba(8,20,38,0.95) 75%)',
        }}
      />
    </div>
  );
}

export default LordShivaBlessing;
