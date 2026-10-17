import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTime } from '../context';
import { AdvanceJourney } from './AdvanceJourney';
import { BirthdayJourney } from './BirthdayJourney';

import { devMode } from '../config';

/**
 * The Branching Director
 * Decides whether to show the Advance countdown or the true Birthday Reveal.
 * Listens for the secret 'developer-unlock' event to bypass time restrictions.
 */
export function DateAwareScene() {
  const timeState = useTime();
  const [isDevUnlocked, setIsDevUnlocked] = useState(false);

  useEffect(() => {
    const handleUnlock = () => setIsDevUnlocked(true);
    window.addEventListener('developer-unlock', handleUnlock);
    return () => window.removeEventListener('developer-unlock', handleUnlock);
  }, []);

  const showBirthday = timeState.isUnlocked || isDevUnlocked || (devMode.enabled && devMode.bypassDate);

  return (
    <AnimatePresence mode="wait">
      {showBirthday ? (
        <motion.div
          key="birthday-journey"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <BirthdayJourney />
        </motion.div>
      ) : (
        <motion.div
          key="advance-journey"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <AdvanceJourney />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
