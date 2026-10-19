import React, { useEffect, useState } from 'react';
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
    <div className="absolute inset-0">
      {showBirthday ? (
        <BirthdayJourney />
      ) : (
        <AdvanceJourney />
      )}
    </div>
  );
}
