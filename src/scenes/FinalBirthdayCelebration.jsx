import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useScene, useAudio } from '../context';
import { SCENES } from '../constants';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { birthdayFinaleData } from '../data/birthdayMessage';
import { FireworksCanvas } from './celebration/FireworksCanvas';
import { CelebrationStageLighting } from './celebration/CelebrationStageLighting';
import { GoldenSparkIntro } from './celebration/GoldenSparkIntro';
import { BirthdayPortrait } from './celebration/BirthdayPortrait';
import { BirthdayTypography } from './celebration/BirthdayTypography';

/**
 * FinalBirthdayCelebration — Phase 12: Grand Finale 🎂
 * “The Golden Spark → The Awakening Stage → Her Grand Entrance → Continuous Fireworks”
 * 
 * Act Progression:
 *  - Act I:   The blessing becomes light (0.0s – 2.0s)
 *             Continuity veil from Shiva's blessing carries warm golden light into midnight navy.
 *             A single golden spark travels toward the centre of the screen.
 *  - Act II:  One last surprise (2.0s – 4.2s)
 *             The spark blooms into an elegant luminous ring of light.
 *             “And now, one last surprise… just for you, Kutty.” appears and dissolves gently.
 *             The ring disperses into delicate outward embers.
 *  - Act III: The stage awakens (4.2s – 6.2s)
 *             Dual warm golden spotlights sweep across the atmospheric haze and converge.
 *             Floor glow warms up. Keerthana remains hidden in brief anticipation.
 *  - Act IV:  Her grand entrance (6.2s – 9.0s)
 *             As spotlights meet, Keerthana's real portrait rises smoothly from below into centre.
 *             Rim lighting illuminates her silhouette with no cartoonish overshoot.
 *  - Act V:   The celebration erupts (9.0s – 13.5s)
 *             Spectacular initial firework peak erupts behind her.
 *             Coordinated typography reveal: HAPPY BIRTHDAY → Keerthana ❤️ → Quote → Personal Letter.
 *  - Mode B:  Continuous Celebration (13.5s onwards)
 *             Lively celebration loop continues indefinitely with recurring medium/large fireworks
 *             and starlight sparkles while Keerthana reads and enjoys the scene.
 */

export function FinalBirthdayCelebration() {
  const { transitionTo, hasCompletedCelebrationIntro, setHasCompletedCelebrationIntro } = useScene();
  const { playTrack, stopBgm } = useAudio();
  const reducedMotion = useReducedMotion();
  const isTransitioningToSonicRef = useRef(false);
  const [showSonicButton, setShowSonicButton] = useState(false);
  const sonicTimerRef = useRef(null);

  // Fade out Deva Deva and start Happy Birthday Thatsa for the grand finale
  useEffect(() => {
    playTrack('happy_birthday');
  }, [playTrack]);

  const startSonicButtonTimer = useCallback(() => {
    if (sonicTimerRef.current) {
      clearTimeout(sonicTimerRef.current);
    }
    setShowSonicButton(false);
    sonicTimerRef.current = setTimeout(() => {
      setShowSonicButton(true);
    }, 1000);
  }, []);

  // Root container & subcomponent refs for GSAP context
  const containerRef = useRef(null);
  const fireworksRef = useRef(null);
  const portraitRef = useRef(null);
  const titleRef = useRef(null);
  const nameRef = useRef(null);
  const quoteRef = useRef(null);
  const messageCardRef = useRef(null);
  const actionsRef = useRef(null);

  // Golden Spark Intro sub-refs
  const introContainerRef = useRef(null);
  const introVeilRef = useRef(null);
  const sparkRef = useRef(null);
  const ringRef = useRef(null);
  const surpriseTextRef = useRef(null);
  const dispersalRef = useRef(null);

  // Animation timeline ref
  const timelineRef = useRef(null);
  const isReplayingRef = useRef(false);

  // Lighting & visual state management
  const [spotlightProgress, setSpotlightProgress] = useState(0);
  const [auraIntensity, setAuraIntensity] = useState(0);
  const [floorGlowIntensity, setFloorGlowIntensity] = useState(0);
  const [isPortraitFloating, setIsPortraitFloating] = useState(false);
  const [canvasMode, setCanvasMode] = useState('continuous');

  // Main Coordinated GSAP Cinematic Timeline
  useEffect(() => {
    if (reducedMotion || hasCompletedCelebrationIntro) {
      // Reduced motion or returning from Sonic Bloom: Instant, fully composed peaceful celebration stage
      setSpotlightProgress(1);
      setAuraIntensity(1);
      setFloorGlowIntensity(1);
      setIsPortraitFloating(true);
      setCanvasMode(reducedMotion ? 'reduced' : 'continuous');

      if (introContainerRef.current) {
        gsap.set(introContainerRef.current, { display: 'none' });
      }
      if (portraitRef.current) {
        gsap.set(portraitRef.current, { y: 0, opacity: 1, scale: 1 });
      }
      [titleRef, nameRef, quoteRef, messageCardRef, actionsRef].forEach((r) => {
        if (r.current) gsap.set(r.current, { opacity: 1, y: 0 });
      });
      startSonicButtonTimer();
      return () => {
        if (sonicTimerRef.current) {
          clearTimeout(sonicTimerRef.current);
          sonicTimerRef.current = null;
        }
      };
    }

    const ctx = gsap.context(() => {
      // ── Initial Element States ───────────────────────────────
      if (introContainerRef.current) gsap.set(introContainerRef.current, { display: 'flex', opacity: 1 });
      if (introVeilRef.current) gsap.set(introVeilRef.current, { opacity: 1 });
      if (sparkRef.current) gsap.set(sparkRef.current, { opacity: 0, y: 160, scale: 0.5 });
      if (ringRef.current) gsap.set(ringRef.current, { opacity: 0, scale: 0 });
      if (surpriseTextRef.current) gsap.set(surpriseTextRef.current, { opacity: 0, y: 12 });
      if (dispersalRef.current) gsap.set(dispersalRef.current, { opacity: 0 });

      if (portraitRef.current) {
        gsap.set(portraitRef.current, { y: '110%', opacity: 0, scale: 0.92 });
      }
      if (titleRef.current) gsap.set(titleRef.current, { opacity: 0, y: 15 });
      if (nameRef.current) gsap.set(nameRef.current, { opacity: 0, scale: 0.88, y: 20 });
      if (quoteRef.current) gsap.set(quoteRef.current, { opacity: 0, y: 15 });
      if (messageCardRef.current) gsap.set(messageCardRef.current, { opacity: 0, y: 25 });
      if (actionsRef.current) gsap.set(actionsRef.current, { opacity: 0, y: 15 });

      const tl = gsap.timeline({
        onComplete: () => {
          setIsPortraitFloating(true);
          setCanvasMode('continuous');
          isReplayingRef.current = false;
          setHasCompletedCelebrationIntro?.(true);
        },
      });

      timelineRef.current = tl;

      // ── ACT I: The Blessing Becomes Light (0.0s – 2.0s) ──────
      // Transition veil carries warm golden blessing glow, then fades smoothly into deep midnight
      tl.to(introVeilRef.current, {
        opacity: 0.25,
        duration: 1.8,
        ease: 'power2.inOut',
      }, 0.0)

      // The single golden spark emerges from lower screen and glides to center
      .to(sparkRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 2.0,
        ease: 'power2.out',
      }, 0.0)

      // ── ACT II: One Last Surprise (2.0s – 4.2s) ──────────────
      // Spark expands into luminous ring of light
      .to(sparkRef.current, {
        scale: 1.8,
        opacity: 0.8,
        duration: 0.5,
        ease: 'power1.out',
      }, 2.0)
      .to(ringRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.9,
        ease: 'back.out(1.4)',
      }, 2.1)

      // Surprise text appears gently
      .to(surpriseTextRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      }, 2.4)

      // Pause for recipient to read “And now, one last surprise… just for you, Kutty.”
      .to({}, { duration: 1.2 })

      // Surprise text gently dissolves
      .to(surpriseTextRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.6,
        ease: 'power2.in',
      }, 3.8)

      // Golden ring pulses and disperses outward into delicate embers
      .to(ringRef.current, {
        scale: 1.7,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
      }, 3.9)
      .to(sparkRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
      }, 3.9)
      .to(dispersalRef.current, {
        opacity: 1,
        duration: 0.2,
      }, 4.0)
      .to(dispersalRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      }, 4.2)
      .set(introContainerRef.current, { display: 'none' }, 4.4)

      // ── ACT III: The Stage Awakens (4.2s – 6.2s) ────────────
      // Two warm golden spotlights sweep across the scene from opposite sides
      .to({}, {
        duration: 2.0,
        onUpdate: function () {
          const p = this.progress();
          setSpotlightProgress(p);
          setFloorGlowIntensity(p * 0.75);
        },
      }, 4.2)

      // ── ACT IV: Her Grand Entrance (6.2s – 9.0s) ─────────────
      // Spotlights meet at centre and Keerthana's real portrait rises smoothly
      .to(portraitRef.current, {
        y: '0%',
        opacity: 1,
        scale: 1,
        duration: 2.6,
        ease: 'power3.out',
      }, 6.2)
      .to({}, {
        duration: 1.2,
        onUpdate: function () {
          const p = this.progress();
          setAuraIntensity(p);
          setFloorGlowIntensity(0.75 + p * 0.25);
        },
      }, 7.4)

      // ── ACT V: The Celebration Erupts (9.0s – 13.5s) ─────────
      // Grand entrance firework volley peaks as portrait settles
      .call(() => {
        setCanvasMode('peak');
        fireworksRef.current?.triggerPeakVolley();
      }, null, 9.0)

      // Typography reveals gracefully with golden highlights
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      }, 9.4)
      .to(nameRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.0,
        ease: 'back.out(1.2)',
      }, 9.9)
      .to(quoteRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
      }, 10.4)

      // Personal message card slides up smoothly
      .to(messageCardRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      }, 11.0)

      // Action controls fade in
      .to(actionsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, 11.7)
      .call(() => {
        startSonicButtonTimer();
      }, null, 11.7)

      // Seamlessly transition into Mode B (Continuous Celebration Loop)
      .call(() => {
        setCanvasMode('continuous');
      }, null, 12.8);

    }, containerRef);

    return () => {
      ctx.revert();
      if (sonicTimerRef.current) {
        clearTimeout(sonicTimerRef.current);
        sonicTimerRef.current = null;
      }
    };
  }, [reducedMotion, hasCompletedCelebrationIntro, setHasCompletedCelebrationIntro, startSonicButtonTimer]);

  // Replay celebration without reloading or resetting memory journey
  const handleReplay = useCallback(() => {
    if (isReplayingRef.current) return;
    isReplayingRef.current = true;

    if (sonicTimerRef.current) {
      clearTimeout(sonicTimerRef.current);
      sonicTimerRef.current = null;
    }
    setShowSonicButton(false);

    setIsPortraitFloating(false);
    setSpotlightProgress(0);
    setAuraIntensity(0);
    setFloorGlowIntensity(0);
    fireworksRef.current?.clear();

    if (timelineRef.current) {
      timelineRef.current.restart();
    }
  }, []);

  // Revisit memories back into Memory Journey
  const handleRevisitMemories = useCallback(() => {
    transitionTo(SCENES.MEMORY_JOURNEY_SOLO);
  }, [transitionTo]);

  // Transition to Sonic Bloom — Six Songs, the Way I See You
  const handleOpenSonicBloom = useCallback(() => {
    if (isTransitioningToSonicRef.current) return;
    isTransitioningToSonicRef.current = true;
    setHasCompletedCelebrationIntro?.(true);

    // Fade out and stop finale BGM so it never competes with Sonic Bloom
    stopBgm(800);

    if (reducedMotion) {
      transitionTo(SCENES.SONIC_BLOOM);
      return;
    }

    // Step B — Create the sonic transition:
    // Gradually soften the fireworks and ambient particles without abruptly cutting the scene.
    setCanvasMode('reduced');

    const tl = gsap.timeline({
      onComplete: () => {
        transitionTo(SCENES.SONIC_BLOOM);
      },
    });

    // Fade typography and actions softly
    [titleRef, nameRef, quoteRef, messageCardRef, actionsRef].forEach((r) => {
      if (r.current) {
        tl.to(r.current, { opacity: 0, y: -10, duration: 0.6, ease: 'power2.in' }, 0);
      }
    });

    // Soften portrait
    if (portraitRef.current) {
      tl.to(portraitRef.current, { opacity: 0, scale: 0.96, duration: 0.75, ease: 'power2.inOut' }, 0.1);
    }
  }, [reducedMotion, transitionTo, setHasCompletedCelebrationIntro, stopBgm]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full min-h-[100dvh] overflow-x-hidden overflow-y-auto lg:overflow-hidden select-none bg-[#03060d] text-white"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* ── Layer 1: Stage Lighting & Ambient Midnight Sky ────────── */}
      <CelebrationStageLighting
        spotlightProgress={spotlightProgress}
        auraIntensity={auraIntensity}
        floorGlowIntensity={floorGlowIntensity}
      />

      {/* ── Layer 2: Fireworks & Sparkle Particles (Canvas 2D) ────── */}
      <FireworksCanvas
        ref={fireworksRef}
        mode={canvasMode}
        reducedMotion={reducedMotion}
      />

      {/* ── Layer 3: Golden Spark Intro (Acts I & II) ─────────────── */}
      {!reducedMotion && (
        <GoldenSparkIntro
          ref={introContainerRef}
          text={birthdayFinaleData.surpriseIntroText}
          veilRef={introVeilRef}
          sparkRef={sparkRef}
          ringRef={ringRef}
          textRef={surpriseTextRef}
          dispersalRef={dispersalRef}
        />
      )}

      {/* ── Layer 4: Stage World & Responsive Layout ──────────────── */}
      <div className="relative z-20 w-full min-h-full lg:h-full flex flex-col justify-center pointer-events-none">
        <BirthdayTypography
          data={birthdayFinaleData}
          titleRef={titleRef}
          nameRef={nameRef}
          quoteRef={quoteRef}
          messageCardRef={messageCardRef}
          actionsRef={actionsRef}
          onReplay={handleReplay}
          onRevisitMemories={handleRevisitMemories}
          onOpenSonicBloom={handleOpenSonicBloom}
          showSonicBloomButton={showSonicButton}
          reducedMotion={reducedMotion}
          portraitSlot={
            <BirthdayPortrait
              ref={portraitRef}
              isFloating={isPortraitFloating}
              className="w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[560px]"
            />
          }
        />
      </div>
    </div>
  );
}

export default FinalBirthdayCelebration;
