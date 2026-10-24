import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useScene } from './context/SceneContext';
import { SCENES } from './constants';
import { OpeningScene } from './scenes/OpeningScene';
import { HandwritingReveal } from './scenes/HandwritingReveal';
import { DateAwareScene } from './scenes/DateAwareScene';
import { SecretVault } from './scenes/SecretVault';
import { MemoryJourney } from './scenes/MemoryJourney';
import { ArtistChapter } from './scenes/ArtistChapter';
import { LordShivaBlessing } from './scenes/LordShivaBlessing';
import { FinalBirthdayCelebration } from './scenes/FinalBirthdayCelebration';
import { SonicBloomScene } from './scenes/sonicBloom/SonicBloomScene';
import { WhoIsSheScene } from './scenes/WhoIsSheScene';
import { Loader } from './components/ui/Loader';
import { Background } from './components/ui/Background';
import { useMediaLoading } from './hooks/useMediaLoading';
import { MagicCursor } from './components/ui/MagicCursor';

// Memory data is now managed internally by MemoryJourney

// Critical assets to preload before starting (procedural 3D gift requires no pre-rendered image assets)
const INITIAL_ASSETS = [];

function App() {
  const { currentScene, isBackgroundPaused } = useScene();
  const { progress, isLoaded } = useMediaLoading(INITIAL_ASSETS);

  return (
    <>
      <MagicCursor />
      <Background isPaused={isBackgroundPaused} />
      
      <AnimatePresence mode="wait">
        {!isLoaded && (
          <Loader key="loader" progress={progress} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isLoaded && currentScene === SCENES.LOADING && (
          <OpeningScene key="opening" />
        )}
        
        {isLoaded && currentScene === SCENES.HANDWRITING && (
          <HandwritingReveal key="handwriting" />
        )}
        
        {/* Birthday Reveal */}
        {isLoaded && currentScene === SCENES.DATE_AWARE && (
          <DateAwareScene key="date-aware" />
        )}

        {/* Secret Vault */}
        {isLoaded && currentScene === SCENES.SECRET_VAULT && (
          <SecretVault key="secret-vault" />
        )}

        {/* Memory Journey — Chapter 1: Solo */}
        {isLoaded && currentScene === SCENES.MEMORY_JOURNEY_SOLO && (
          <MemoryJourney key="memory-solo" chapterIndex={0} />
        )}

        {/* Memory Journey — Chapter 2: Together */}
        {isLoaded && currentScene === SCENES.MEMORY_JOURNEY_TOGETHER && (
          <MemoryJourney key="memory-together" chapterIndex={1} />
        )}

        {/* Phase 10: The Artist's Hand — Pencil Portrait Reveal */}
        {isLoaded && currentScene === SCENES.ARTIST_CHAPTER && (
          <ArtistChapter key="artist-chapter" />
        )}

        {/* Phase 11: Lord Shiva's Blessings — Cinematic Devotional Experience */}
        {isLoaded && currentScene === SCENES.LORD_SHIVA_BLESSING && (
          <LordShivaBlessing key="lord-shiva-blessing" />
        )}

        {/* Phase 12: Grand Finale — 12:00 AM The World Celebrates You */}
        {isLoaded && currentScene === SCENES.FINAL_MESSAGE && (
          <FinalBirthdayCelebration key="final-birthday-celebration" />
        )}

        {/* Phase 13: SONIC BLOOM — Six Songs, the Way I See You */}
        {isLoaded && currentScene === SCENES.SONIC_BLOOM && (
          <SonicBloomScene key="sonic-bloom" />
        )}

        {/* Phase 14: Who Is She to Me? — reserved placeholder for the new final scene */}
        {isLoaded && currentScene === SCENES.WHO_IS_SHE_TO_ME && (
          <WhoIsSheScene key="who-is-she-to-me" />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
