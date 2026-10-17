import { useRef } from 'react';

/**
 * Interaction Engine
 * Protects against accidental double-taps between cinematic scene transitions
 * and registers long presses.
 */
export function useInteraction(cooldownMs = 1500) {
  const isBlocked = useRef(false);

  const safeTap = (callback) => {
    return (e) => {
      if (isBlocked.current) return;
      isBlocked.current = true;
      
      callback(e);
      
      setTimeout(() => {
        isBlocked.current = false;
      }, cooldownMs);
    };
  };

  return { safeTap };
}
