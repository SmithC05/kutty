import React, { Suspense, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useScene } from './context/SceneContext';
import { SCENES } from './constants';
import { AdvanceJourney } from './scenes/AdvanceJourney';
import { OpeningScene } from './scenes/OpeningScene';
import { HandwritingReveal } from './scenes/HandwritingReveal';
import { Background } from './components/ui/Background';
import { MagicCursor } from './components/ui/MagicCursor';
import { FullscreenToggle } from './components/ui/FullscreenToggle';

// ── Lazy-loaded heavy scenes for fast initial page load and clean chunk boundaries ──
const BirthdayJourney = React.lazy(() =>
  import('./scenes/BirthdayJourney').then((m) => ({ default: m.BirthdayJourney }))
);
const SecretVault = React.lazy(() =>
  import('./scenes/SecretVault').then((m) => ({ default: m.SecretVault }))
);
const LordShivaBlessing = React.lazy(() =>
  import('./scenes/LordShivaBlessing').then((m) => ({ default: m.LordShivaBlessing }))
);
const MemoryJourney = React.lazy(() =>
  import('./scenes/MemoryJourney').then((m) => ({ default: m.MemoryJourney }))
);
const ArtistChapter = React.lazy(() =>
  import('./scenes/ArtistChapter').then((m) => ({ default: m.ArtistChapter }))
);
const SonicBloomScene = React.lazy(() =>
  import('./scenes/sonicBloom/SonicBloomScene').then((m) => ({ default: m.SonicBloomScene }))
);
const WhoIsSheScene = React.lazy(() =>
  import('./scenes/WhoIsSheScene').then((m) => ({ default: m.WhoIsSheScene }))
);
const FinalBirthdayCelebration = React.lazy(() =>
  import('./scenes/FinalBirthdayCelebration').then((m) => ({ default: m.FinalBirthdayCelebration }))
);

// Staged idle prefetcher to ensure all scene chunks are ready before scene transitions
function prefetchSceneChunks() {
  const prefetchers = [
    () => import('./scenes/BirthdayJourney'),
    () => import('./scenes/SecretVault'),
    () => import('./scenes/LordShivaBlessing'),
    () => import('./scenes/MemoryJourney'),
    () => import('./scenes/ArtistChapter'),
    () => import('./scenes/sonicBloom/SonicBloomScene'),
    () => import('./scenes/WhoIsSheScene'),
    () => import('./scenes/FinalBirthdayCelebration'),
  ];

  prefetchers.forEach((loader, index) => {
    setTimeout(() => {
      loader().catch(() => {});
    }, 1200 + index * 400);
  });
}

function App() {
  const { currentScene, isBackgroundPaused } = useScene();

  useEffect(() => {
    // Schedule background chunk prefetching during browser idle time
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(prefetchSceneChunks, { timeout: 4000 });
      } else {
        setTimeout(prefetchSceneChunks, 2000);
      }
    }
  }, []);

  return (
    <>
      <MagicCursor />
      <FullscreenToggle />
      <Background isPaused={isBackgroundPaused} />

      <Suspense fallback={null}>
        <AnimatePresence mode="wait">
          {/* 1. Advance Journey (Pre-birthday countdown scene) */}
          {currentScene === SCENES.ADVANCE_JOURNEY && (
            <AdvanceJourney key="advance-journey" />
          )}

          {/* 2. Opening 3D Gift Box */}
          {currentScene === SCENES.LOADING && (
            <OpeningScene key="opening" />
          )}
          
          {/* 2. Handwriting Reveal ("For..." -> "Kutty") */}
          {currentScene === SCENES.HANDWRITING && (
            <HandwritingReveal key="handwriting" />
          )}
          
          {/* 2. Birthday Reveal ("Happy Birthday," -> Keerthana) */}
          {(currentScene === SCENES.BIRTHDAY_REVEAL || currentScene === SCENES.DATE_AWARE) && (
            <BirthdayJourney key="birthday-reveal" />
          )}

          {/* 3. Secret Vault PIN Unlock */}
          {currentScene === SCENES.SECRET_VAULT && (
            <SecretVault key="secret-vault" />
          )}

          {/* 3. Lord Shiva's Blessings */}
          {currentScene === SCENES.LORD_SHIVA_BLESSING && (
            <LordShivaBlessing key="lord-shiva-blessing" />
          )}

          {/* 4. Just You — Solo Photos (Memory Journey Chapter 1) */}
          {currentScene === SCENES.MEMORY_JOURNEY_SOLO && (
            <MemoryJourney key="memory-solo" chapterIndex={0} />
          )}

          {/* 5. The Artist's Hand — Pencil Portrait Reveal */}
          {currentScene === SCENES.ARTIST_CHAPTER && (
            <ArtistChapter key="artist-chapter" />
          )}

          {/* 6. Sonic Bloom — Six Songs, the Way I See You */}
          {currentScene === SCENES.SONIC_BLOOM && (
            <SonicBloomScene key="sonic-bloom" />
          )}

          {/* 7. Us — Shared Memories (Memory Journey Chapter 2) */}
          {currentScene === SCENES.MEMORY_JOURNEY_TOGETHER && (
            <MemoryJourney key="memory-together" chapterIndex={1} />
          )}

          {/* 8. Who Is She to Me? */}
          {currentScene === SCENES.WHO_IS_SHE_TO_ME && (
            <WhoIsSheScene key="who-is-she-to-me" />
          )}

          {/* 9. Grand Finale — Celebration Climax */}
          {currentScene === SCENES.FINAL_MESSAGE && (
            <FinalBirthdayCelebration key="final-birthday-celebration" />
          )}
        </AnimatePresence>
      </Suspense>
    </>
  );
}

export default App;
