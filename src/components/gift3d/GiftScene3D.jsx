import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { BoxBase } from './BoxBase';
import { BoxLid } from './BoxLid';
import { WrappingPanels } from './WrappingPanels';
import { BoxRibbons, LidRibbons } from './Ribbons';
import { DecorativeBow } from './DecorativeBow';
import { InnerLightAndSparkles } from './InnerLightAndSparkles';
import { GoldenDust } from './GoldenDust';
import { ContactShadow } from './ContactShadow';

/**
 * 3D Procedural Gift Scene
 * Integrates box base, lid, wrapping panels, ribbons, bow, inner light, and choreography.
 */
export function GiftScene3D({
  isOpening = false,
  isIdleAnimating = false,
  onOpenStart,
  onFreezeStart,
  onFreezeEnd,
  onOpenComplete,
  reducedMotion = false
}) {
  const { camera } = useThree();

  const giftGroupRef = useRef(null);
  const baseRef = useRef(null);
  const lidGroupRef = useRef(null);
  const panelsRef = useRef(null);
  const boxRibbonsRef = useRef(null);
  const lidRibbonsRef = useRef(null);
  const bowRef = useRef(null);
  const innerLightRef = useRef(null);

  const isAssembled = useRef(false);
  const isInteracting = useRef(false);
  const baseRot = useMemo(() => ({ x: 0.22, y: 0.42 }), []);

  // 1. Initial Assembly Sequence
  useEffect(() => {
    const gift = giftGroupRef.current;
    const lid = lidGroupRef.current;
    const bow = bowRef.current;
    const panels = panelsRef.current;
    const boxRibbons = boxRibbonsRef.current;

    if (!gift) return;

    if (reducedMotion) {
      gift.scale.set(1, 1, 1);
      gift.position.set(0, 0, 0);
      gift.rotation.set(baseRot.x, baseRot.y, 0);
      isAssembled.current = true;
      return;
    }

    // Assembly choreography timeline
    const tl = gsap.timeline({
      onComplete: () => {
        isAssembled.current = true;
      }
    });

    // Start with components entering from slight offsets
    gift.position.set(0, -0.4, 0);
    gift.scale.set(0.7, 0.7, 0.7);
    gift.rotation.set(0.1, -0.2, 0);

    if (lid) lid.position.set(0, 1.8, 0);
    if (bow) bow.scale.set(0.01, 0.01, 0.01);
    if (boxRibbons) boxRibbons.scale.set(0.85, 0.85, 0.85);

    // Initial fold of panels: start open, then fold closed
    const foldObj = { progress: 0.9 };
    if (panels) panels.setFoldProgress(foldObj.progress);

    // Assembly Sequence:
    // a. Box lifts and scales into resting space
    tl.to(gift.position, { y: 0, duration: 1.6, ease: 'power3.out' }, 0);
    tl.to(gift.scale, { x: 1, y: 1, z: 1, duration: 1.6, ease: 'power3.out' }, 0);
    tl.to(gift.rotation, { x: baseRot.x, y: baseRot.y, duration: 1.8, ease: 'power2.out' }, 0);

    // b. Wrapping paper panels fold UP snug to the box
    tl.to(foldObj, {
      progress: 0,
      duration: 1.4,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (panels) panels.setFoldProgress(foldObj.progress);
      }
    }, 0.3);

    // c. Ribbons wrap into position
    if (boxRibbons) {
      tl.to(boxRibbons.scale, { x: 1, y: 1, z: 1, duration: 1.0, ease: 'back.out(1.2)' }, 0.6);
    }

    // d. Lid lowers onto the box
    if (lid) {
      tl.to(lid.position, { y: 0.96, duration: 1.0, ease: 'bounce.out' }, 0.8);
    }

    // e. Bow unfurls and settles with luxury spring
    if (bow) {
      tl.to(bow.scale, { x: 1, y: 1, z: 1, duration: 1.0, ease: 'back.out(1.6)' }, 1.2);
    }

    return () => {
      tl.kill();
    };
  }, [baseRot, reducedMotion]);

  // 2. Idle Floating Loop
  useFrame((state) => {
    if (!giftGroupRef.current || !isAssembled.current || isInteracting.current || isOpening) return;

    const time = state.clock.getElapsedTime();
    // Gentle breathing float
    giftGroupRef.current.position.y = Math.sin(time * 1.4) * 0.07;
    giftGroupRef.current.rotation.y = baseRot.y + Math.sin(time * 0.7) * 0.04;
    giftGroupRef.current.rotation.x = baseRot.x + Math.cos(time * 1.1) * 0.02;
  });

  // 3. Alive State Gentle Attention Pulse
  useEffect(() => {
    if (!isIdleAnimating || isInteracting.current || isOpening) return;
    const gift = giftGroupRef.current;
    if (!gift) return;

    gsap.to(gift.rotation, {
      z: 0.04,
      duration: 0.12,
      yoyo: true,
      repeat: 3,
      ease: 'power1.inOut',
      onComplete: () => {
        gift.rotation.z = 0;
      }
    });
  }, [isIdleAnimating, isOpening]);

  // 4. Choreographed Unwrapping Sequence
  const triggerUnwrapping = useCallback(() => {
    if (isInteracting.current) return;
    isInteracting.current = true;

    if (onOpenStart) onOpenStart();
    if (onFreezeStart) onFreezeStart();

    const gift = giftGroupRef.current;
    const lid = lidGroupRef.current;
    const bow = bowRef.current;
    const panels = panelsRef.current;
    const boxRibbons = boxRibbonsRef.current;
    const lidRibbons = lidRibbonsRef.current;
    const innerLight = innerLightRef.current;

    // Step 1: Tactile squeeze during the 200ms freeze
    if (gift) {
      gsap.to(gift.scale, {
        x: 0.94,
        y: 0.94,
        z: 0.94,
        duration: 0.18,
        ease: 'power2.out'
      });
    }

    // Step 2: 0.2s pause finishes -> unfreeze background particles, trigger audio & full unwrapping
    setTimeout(() => {
      if (onFreezeEnd) onFreezeEnd();

      const tl = gsap.timeline({
        onComplete: () => {
          if (onOpenComplete) onOpenComplete();
        }
      });

      // Quick rebound from squeeze
      if (gift) {
        tl.to(gift.scale, { x: 1.02, y: 1.02, z: 1.02, duration: 0.25, ease: 'back.out(2)' }, 0);
      }

      // Step 3: Bow loosens, lifts, and dissolves away
      if (bow) {
        tl.to(bow.position, { y: 1.2, duration: 0.9, ease: 'power2.out' }, 0.1);
        tl.to(bow.scale, { x: 1.4, y: 1.4, z: 1.4, duration: 0.9, ease: 'power2.out' }, 0.1);
        // Fade out bow materials
        bow.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.transparent = true;
            tl.to(child.material, { opacity: 0, duration: 0.7 }, 0.3);
          }
        });
      }

      // Step 4: Ribbons unwrap and separate
      if (boxRibbons) {
        tl.to(boxRibbons.scale, { x: 1.18, y: 1.05, z: 1.18, duration: 0.8, ease: 'power2.out' }, 0.2);
        boxRibbons.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.transparent = true;
            tl.to(child.material, { opacity: 0, duration: 0.6 }, 0.4);
          }
        });
      }

      if (lidRibbons) {
        tl.to(lidRibbons.scale, { x: 1.15, z: 1.15, duration: 0.8, ease: 'power2.out' }, 0.2);
        lidRibbons.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.transparent = true;
            tl.to(child.material, { opacity: 0, duration: 0.6 }, 0.4);
          }
        });
      }

      // Step 5: Wrapping paper panels physically fold open away from the box
      const foldObj = { progress: 0 };
      tl.to(foldObj, {
        progress: 1.0,
        duration: 0.95,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (panels) panels.setFoldProgress(foldObj.progress);
        }
      }, 0.35);

      if (panels?.group) {
        tl.to(panels.group.position, { y: -0.5, duration: 0.8, ease: 'power2.in' }, 0.8);
        panels.group.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.transparent = true;
            tl.to(child.material, { opacity: 0, duration: 0.6 }, 0.8);
          }
        });
      }

      // Step 6: Lid lifts and rotates off the box
      if (lid) {
        tl.to(lid.position, {
          y: 2.8,
          duration: 1.4,
          ease: 'power3.inOut'
        }, 0.7);
        tl.to(lid.rotation, {
          x: -0.45,
          z: 0.38,
          duration: 1.4,
          ease: 'power3.inOut'
        }, 0.7);
        lid.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.transparent = true;
            tl.to(child.material, { opacity: 0, duration: 0.7 }, 1.3);
          }
        });
      }

      // Step 7: Inner golden light burst & particles expand
      const lightObj = { intensity: 0.2, burst: 0 };
      tl.to(lightObj, {
        intensity: 22.0,
        burst: 1.0,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => {
          if (innerLight) {
            innerLight.setIntensity(lightObj.intensity);
            innerLight.setBurstProgress(lightObj.burst);
          }
        }
      }, 0.8);

      // Step 8: Camera glides forward towards the radiant glowing box interior
      tl.to(camera.position, {
        z: 2.4,
        y: 1.1,
        duration: 1.6,
        ease: 'power2.inOut'
      }, 1.0);

      // Step 9: Final gentle box scale and fade into the handwriting reveal
      if (gift) {
        tl.to(gift.scale, {
          x: 2.5,
          y: 2.5,
          z: 2.5,
          duration: 1.2,
          ease: 'power2.inOut'
        }, 1.4);
      }
    }, 200);
  }, [onOpenStart, onFreezeStart, onFreezeEnd, onOpenComplete, camera]);

  return (
    <>
      {/* Cinematic Studio Lighting */}
      <ambientLight color="#0d1b33" intensity={0.9} />

      {/* Main Key Light: Warm golden highlight */}
      <directionalLight
        position={[4, 7, 5]}
        intensity={2.4}
        color="#fff6e0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Cool Sapphire Rim Light: Deep theme coherence */}
      <pointLight
        position={[-5, 3, -4]}
        intensity={1.8}
        color="#3b82f6"
        distance={14}
      />

      {/* Front Fill Light: Soft face illumination */}
      <pointLight
        position={[0, -1, 4]}
        intensity={0.6}
        color="#93c5fd"
        distance={10}
      />

      {/* Ambient Floating Dust */}
      <GoldenDust count={60} />

      {/* Main Interactive Gift Container */}
      <group
        ref={giftGroupRef}
        onClick={(e) => {
          e.stopPropagation();
          triggerUnwrapping();
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
      >
        {/* Box Base */}
        <BoxBase ref={baseRef} />

        {/* Wrapping Paper Panels */}
        <WrappingPanels ref={panelsRef} />

        {/* Base Ribbons */}
        <BoxRibbons ref={boxRibbonsRef} />

        {/* Inner Light & Sparkle Burst */}
        <InnerLightAndSparkles ref={innerLightRef} isOpening={isOpening} />

        {/* Box Lid & Mounted Ribbons and Bow */}
        <BoxLid ref={lidGroupRef}>
          <LidRibbons ref={lidRibbonsRef} />
          <DecorativeBow ref={bowRef} />
        </BoxLid>
      </group>

      {/* Soft Contact Shadow beneath */}
      <ContactShadow yOffset={-1.35} />
    </>
  );
}
