import { useState, useEffect } from 'react';
import { calculateTimeRemaining } from '../utils/time';

/**
 * useDateLock
 * Manages the countdown state to determine if the cinematic experience is "unlocked".
 */
export function useDateLock() {
  const [timeState, setTimeState] = useState(() => calculateTimeRemaining());

  useEffect(() => {
    const tick = () => {
      setTimeState(calculateTimeRemaining());
    };

    tick();
    const timerId = setInterval(tick, 1000);
    return () => clearInterval(timerId);
  }, []);

  return timeState;
}
