import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { BoxBase } from './BoxBase';
import { BoxLid } from './BoxLid';
import { WrappingPanels } from './WrappingPanels';
import { BoxRibbons, LidRibbons } from './Ribbons';
import { DecorativeBow } from './DecorativeBow';
import { InnerLightAndSparkles } from './InnerLightAndSparkles';
import { EnvironmentAtmosphere } from './EnvironmentAtmosphere';
import { ContactShadow } from './ContactShadow';

/**
 * 3D Procedural Gift Scene
 * Luxury motion-design presentation with full-screen responsive framing,
 * continuous 21s idle rotation, rich atmospheric depth, and full-screen cinematic unwrapping.
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
  const { camera, size, pointer } = useThree();

  const giftGroupRef = useRef(null);
  const baseRef = useRef(null);
  const lidGroupRef = useRef(null);
  const panelsRef = useRef(null);
  const boxRibbonsRef = useRef(null);
  const lidRibbonsRef = useRef(null);
  const bowRef = useRef(null);
  const innerLightRef = useRef(null);
  const atmosphereRef = useRef(null);

  const isAssembled = useRef(false);
  const isInteracting = useRef(false);

  // Viewport-aware responsive camera framing
  const baseCameraZ = useMemo(() => {
    const aspect = size.width / Math.max(1, size.height);
    // On narrow / mobile portrait screens, adapt camera distance so the present occupies ~48-52% viewport height
    if (aspect < 1) {
      return (6.6 / Math.max(0.55, aspect)) * 0.72;
    }
    return 5.6;
  }, [size.width, size.height]);

  // Set initial camera composition
  useEffect(() => {
    camera.position.set(0, 1.25, baseCameraZ);
    camera.lookAt(0, 0.1, 0);
  }, [camera, baseCameraZ]);

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
      gift.rotation.set(0.2, 0.35, 0);
      isAssembled.current = true;
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        isAssembled.current = true;
      }
    });

    // Start slightly offset for a refined, deliberate assembly sequence
    gift.position.set(0, -0.6, 0);
    gift.scale.set(0.65, 0.65, 0.65);
    gift.rotation.set(0.1, -0.3, 0);

    if (lid) lid.position.set(0, 2.0, 0);
    if (bow?.group) bow.group.scale.set(0.01, 0.01, 0.01);
    if (boxRibbons?.group) boxRibbons.group.scale.set(0.85, 0.85, 0.85);

    // Initial state: panels fold open
    const foldObj = { progress: 0.95 };
    if (panels) panels.setFoldProgress(foldObj.progress);

    // Sequence:
    // a. Box base lifts and scales into resting position
    tl.to(gift.position, { y: 0, duration: 1.8, ease: 'power3.out' }, 0);
    tl.to(gift.scale, { x: 1, y: 1, z: 1, duration: 1.8, ease: 'power3.out' }, 0);
    tl.to(gift.rotation, { x: 0.22, y: 0.38, duration: 2.0, ease: 'power2.out' }, 0);

    // b. Wrapping paper panels fold UP around the box
    tl.to(foldObj, {
      progress: 0,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (panels) panels.setFoldProgress(foldObj.progress);
      }
    }, 0.35);

    // c. Satin ribbons wrap cleanly around box
    if (boxRibbons?.group) {
      tl.to(boxRibbons.group.scale, { x: 1, y: 1, z: 1, duration: 1.1, ease: 'back.out(1.2)' }, 0.7);
    }

    // d. Lid settles onto box with soft bounce
    if (lid) {
      tl.to(lid.position, { y: 0.96, duration: 1.1, ease: 'bounce.out' }, 0.95);
    }

    // e. Satin bow loops unfurl with luxury spring
    if (bow?.group) {
      tl.to(bow.group.scale, { x: 1, y: 1, z: 1, duration: 1.1, ease: 'back.out(1.5)' }, 1.35);
    }

    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  // 2. Idle State: Smooth Continuous Rotation & Parallax
  useFrame((state, delta) => {
    if (!giftGroupRef.current) return;

    const time = state.clock.getElapsedTime();

    // Idle continuous rotation & subtle floating
    if (isAssembled.current && !isInteracting.current && !isOpening) {
      // 1 full revolution every ~21 seconds
      giftGroupRef.current.rotation.y += delta * ((Math.PI * 2) / 21);
      giftGroupRef.current.position.y = Math.sin(time * 1.4) * 0.1;
      giftGroupRef.current.rotation.x = 0.22 + Math.sin(time * 0.8) * 0.03;
      giftGroupRef.current.rotation.z = Math.cos(time * 0.6) * 0.02;

      // Subtle mouse/pointer parallax on camera
      const targetCamX = pointer.x * 0.35;
      const targetCamY = 1.25 + pointer.y * 0.22;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.05);
      camera.lookAt(0, 0.1, 0);
    }
  });

  // 3. Alive Attention Glow Pulse (every 25s)
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

  // 4. Full-Screen Cinematic Unwrapping Sequence
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
    const atmosphere = atmosphereRef.current;

    // Stage 1: Tactile squeeze & subtle anticipation shake during the 200ms freeze
    if (gift) {
      gsap.to(gift.scale, {
        x: 0.93,
        y: 0.91,
        z: 0.93,
        duration: 0.18,
        ease: 'power2.out'
      });
    }

    // Stage 2: Freeze finishes -> unfreeze background, trigger audio, begin full-screen reveal
    setTimeout(() => {
      if (onFreezeEnd) onFreezeEnd();

      const tl = gsap.timeline({
        onComplete: () => {
          if (onOpenComplete) onOpenComplete();
        }
      });

      // Quick elastic rebound from squeeze
      if (gift) {
        tl.to(gift.scale, { x: 1.03, y: 1.03, z: 1.03, duration: 0.25, ease: 'back.out(2)' }, 0);
      }

      // Stage 2: Bow Release - knot loosens, loops unfurl and separate, tails release
      if (bow) {
        // Knot loosens
        if (bow.knot) {
          tl.to(bow.knot.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.7, ease: 'power2.out' }, 0.05);
        }
        // Left loop unfurls and glides out to the left
        if (bow.leftLoop) {
          tl.to(bow.leftLoop.position, { x: -1.6, y: 0.6, z: -0.4, duration: 1.1, ease: 'power2.out' }, 0.1);
          tl.to(bow.leftLoop.rotation, { z: -0.9, y: -0.6, duration: 1.1, ease: 'power2.out' }, 0.1);
        }
        // Right loop unfurls and glides out to the right
        if (bow.rightLoop) {
          tl.to(bow.rightLoop.position, { x: 1.6, y: 0.6, z: 0.4, duration: 1.1, ease: 'power2.out' }, 0.1);
          tl.to(bow.rightLoop.rotation, { z: 0.9, y: 0.6, duration: 1.1, ease: 'power2.out' }, 0.1);
        }
        // Tails uncurl and float downward
        if (bow.tail1) {
          tl.to(bow.tail1.position, { x: 0.8, y: -1.2, z: 0.8, duration: 1.0, ease: 'power2.inOut' }, 0.15);
        }
        if (bow.tail2) {
          tl.to(bow.tail2.position, { x: -0.8, y: -1.2, z: 0.8, duration: 1.0, ease: 'power2.inOut' }, 0.15);
        }
        // Fade out bow materials
        if (bow.group) {
          bow.group.traverse((child) => {
            if (child.isMesh && child.material) {
              child.material.transparent = true;
              tl.to(child.material, { opacity: 0, duration: 0.7 }, 0.6);
            }
          });
        }
      }

      // Stage 3: Ribbon Unwrapping - cross ribbons separate and travel toward screen edges
      if (boxRibbons) {
        // Front ribbon peels forward/down towards bottom-left screen edge
        if (boxRibbons.front) {
          tl.to(boxRibbons.front.position, { z: 2.6, y: -1.2, x: -0.8, duration: 1.2, ease: 'power2.out' }, 0.2);
          tl.to(boxRibbons.front.rotation, { x: 0.8, z: -0.4, duration: 1.2, ease: 'power2.out' }, 0.2);
        }
        // Right ribbon peels towards right screen edge
        if (boxRibbons.right) {
          tl.to(boxRibbons.right.position, { x: 3.2, y: 0.4, z: 0.8, duration: 1.2, ease: 'power2.out' }, 0.25);
          tl.to(boxRibbons.right.rotation, { z: 0.7, y: 0.5, duration: 1.2, ease: 'power2.out' }, 0.25);
        }
        // Left & back ribbons curve into depth
        if (boxRibbons.left) {
          tl.to(boxRibbons.left.position, { x: -3.0, y: 0.3, z: -0.6, duration: 1.2, ease: 'power2.out' }, 0.28);
        }
        if (boxRibbons.back) {
          tl.to(boxRibbons.back.position, { z: -3.2, y: -0.8, duration: 1.2, ease: 'power2.out' }, 0.3);
        }
        boxRibbons.group?.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.transparent = true;
            tl.to(child.material, { opacity: 0, duration: 0.8 }, 0.7);
          }
        });
      }

      if (lidRibbons) {
        tl.to(lidRibbons.scale, { x: 1.2, z: 1.2, duration: 0.8, ease: 'power2.out' }, 0.25);
        lidRibbons.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.transparent = true;
            tl.to(child.material, { opacity: 0, duration: 0.6 }, 0.6);
          }
        });
      }

      // Stage 4: Paper Opening - folding outward and floating past camera
      const foldObj = { progress: 0 };
      tl.to(foldObj, {
        progress: 1.0,
        duration: 1.1,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (panels) panels.setFoldProgress(foldObj.progress);
        }
      }, 0.35);

      if (panels?.group) {
        // Panels spread into surrounding 3D space, revealing the underlying box
        tl.to(panels.group.position, { y: -0.8, z: 0.5, duration: 1.1, ease: 'power2.in' }, 0.85);
        tl.to(panels.group.scale, { x: 1.35, z: 1.35, duration: 1.1, ease: 'power2.out' }, 0.85);
        panels.group.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.transparent = true;
            tl.to(child.material, { opacity: 0, duration: 0.7 }, 1.0);
          }
        });
      }

      // Stage 5: Lid Release - lifts high, rotates, and travels past camera
      if (lid) {
        tl.to(lid.position, {
          y: 4.6,
          z: 0.8,
          duration: 1.6,
          ease: 'power3.inOut'
        }, 0.7);
        tl.to(lid.rotation, {
          x: -0.65,
          z: 0.45,
          y: 0.25,
          duration: 1.6,
          ease: 'power3.inOut'
        }, 0.7);
        lid.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.transparent = true;
            tl.to(child.material, { opacity: 0, duration: 0.8 }, 1.5);
          }
        });
      }

      // Stage 6: Screen-Wide Magical Burst & Light Rays
      const burstObj = { intensity: 0.2, burst: 0, shockwaveScale: 0.1, shockwaveOpacity: 0.9 };
      tl.to(burstObj, {
        intensity: 35.0,
        burst: 1.0,
        shockwaveScale: 18.0,
        shockwaveOpacity: 0,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => {
          if (innerLight) {
            innerLight.setIntensity(burstObj.intensity);
            innerLight.setBurstProgress(burstObj.burst);
          }
          if (atmosphere) {
            atmosphere.setShockwaveScale(burstObj.shockwaveScale);
            atmosphere.setShockwaveOpacity(burstObj.shockwaveOpacity);
            atmosphere.setRaysIntensity(1.0 + burstObj.burst * 2.0);
          }
        }
      }, 0.8);

      // Stage 7: Full-Screen Transition - Camera pushes forward into the radiant light
      tl.to(camera.position, {
        z: 1.3,
        y: 0.75,
        duration: 1.8,
        ease: 'power2.inOut'
      }, 1.1);

      // Box scale expands into the radiant handwriting sequence
      if (gift) {
        tl.to(gift.scale, {
          x: 2.8,
          y: 2.8,
          z: 2.8,
          duration: 1.4,
          ease: 'power2.inOut'
        }, 1.4);
      }
    }, 200);
  }, [onOpenStart, onFreezeStart, onFreezeEnd, onOpenComplete, camera]);

  return (
    <>
      {/* Cinematic Studio Lighting */}
      <ambientLight color="#102244" intensity={1.1} />

      {/* Main Key Light: Warm golden highlight with crisp speculars */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={2.8}
        color="#fffbeb"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Front Fill Light: Soft face illumination */}
      <directionalLight
        position={[-3, 2, 4]}
        intensity={1.2}
        color="#bfdbfe"
      />

      {/* Cool Sapphire Rim Light: Coherent blue theme accent */}
      <pointLight
        position={[-5, 4, -4]}
        intensity={2.2}
        color="#38bdf8"
        distance={16}
      />

      {/* Warm Champagne Rim Light */}
      <pointLight
        position={[4, -2, -3]}
        intensity={1.8}
        color="#fde047"
        distance={14}
      />

      {/* Multi-layer Cinematic Atmosphere (Starfield, dust, aura, shockwave, light shafts) */}
      <EnvironmentAtmosphere ref={atmosphereRef} isOpening={isOpening} />

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
        {/* Rigid Lacquered Midnight-Navy Box Base */}
        <BoxBase ref={baseRef} />

        {/* Distinct Sapphire Wrapping Paper Panels */}
        <WrappingPanels ref={panelsRef} />

        {/* Broad Satin Base Ribbons */}
        <BoxRibbons ref={boxRibbonsRef} />

        {/* Radiant Inner Light & Screen-Wide Sparkle Burst */}
        <InnerLightAndSparkles ref={innerLightRef} isOpening={isOpening} />

        {/* Box Lid, Lid Ribbons & Redesigned Sculptural Satin Bow */}
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
