import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useScene } from './context/SceneContext';
import { SCENES } from './constants';
import { AdvanceJourney } from './scenes/AdvanceJourney';
import { OpeningScene } from './scenes/OpeningScene';
import { HandwritingReveal } from './scenes/HandwritingReveal';
import { BirthdayJourney } from './scenes/BirthdayJourney';
import { SecretVault } from './scenes/SecretVault';
import { LordShivaBlessing } from './scenes/LordShivaBlessing';
import { MemoryJourney } from './scenes/MemoryJourney';
import { ArtistChapter } from './scenes/ArtistChapter';
import { SonicBloomScene } from './scenes/sonicBloom/SonicBloomScene';
import { WhoIsSheScene } from './scenes/WhoIsSheScene';
import { FinalBirthdayCelebration } from './scenes/FinalBirthdayCelebration';
import { Background } from './components/ui/Background';
import { MagicCursor } from './components/ui/MagicCursor';
import { FullscreenToggle } from './components/ui/FullscreenToggle';

function App() {
  const { currentScene, isBackgroundPaused } = useScene();

  return (
    <>
      <MagicCursor />
      <FullscreenToggle />
      <Background isPaused={isBackgroundPaused} />

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
    </>
  );
}

export default App;
