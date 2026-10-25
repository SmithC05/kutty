/**
 * Cross-browser Fullscreen API Utilities
 *
 * Supports modern standard Fullscreen API as well as WebKit, Mozilla, and MS prefixes.
 * All functions fail gracefully without throwing uncaught exceptions.
 */

/**
 * Checks if the Fullscreen API is supported by the current browser environment.
 * @returns {boolean}
 */
export function isFullscreenSupported() {
  if (typeof document === 'undefined') return false;

  return Boolean(
    document.fullscreenEnabled ||
    document.webkitFullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.msFullscreenEnabled ||
    document.documentElement.requestFullscreen ||
    document.documentElement.webkitRequestFullscreen ||
    document.documentElement.webkitRequestFullScreen ||
    document.documentElement.mozRequestFullScreen ||
    document.documentElement.msRequestFullscreen
  );
}

/**
 * Returns the current element in fullscreen mode, or null if not in fullscreen.
 * @returns {Element|null}
 */
export function getFullscreenElement() {
  if (typeof document === 'undefined') return null;

  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement ||
    null
  );
}

/**
 * Requests fullscreen for the specified element (defaults to document.documentElement).
 * Must be invoked directly within a user interaction event handler to satisfy browser security.
 *
 * @param {Element} [element=document.documentElement]
 * @returns {Promise<void>}
 */
export function requestFullscreen(element) {
  if (typeof document === 'undefined') {
    return Promise.resolve();
  }

  const target = element || document.documentElement;
  if (!target) {
    return Promise.resolve();
  }

  try {
    let result;
    if (target.requestFullscreen) {
      result = target.requestFullscreen();
    } else if (target.webkitRequestFullscreen) {
      result = target.webkitRequestFullscreen();
    } else if (target.webkitRequestFullScreen) {
      result = target.webkitRequestFullScreen();
    } else if (target.mozRequestFullScreen) {
      result = target.mozRequestFullScreen();
    } else if (target.msRequestFullscreen) {
      result = target.msRequestFullscreen();
    }

    if (result && typeof result.then === 'function') {
      return result.catch((err) => {
        // Handle rejected fullscreen (e.g. user denied, iframe restrictions, policy check)
        console.info('[Fullscreen] Request declined or blocked by browser policy:', err?.message || err);
      });
    }
    return Promise.resolve();
  } catch (err) {
    console.info('[Fullscreen] Request could not be initiated:', err?.message || err);
    return Promise.resolve();
  }
}

/**
 * Exits fullscreen mode if currently active.
 *
 * @returns {Promise<void>}
 */
export function exitFullscreen() {
  if (typeof document === 'undefined') {
    return Promise.resolve();
  }

  if (!getFullscreenElement()) {
    return Promise.resolve();
  }

  try {
    let result;
    if (document.exitFullscreen) {
      result = document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      result = document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      result = document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      result = document.msExitFullscreen();
    }

    if (result && typeof result.then === 'function') {
      return result.catch((err) => {
        console.info('[Fullscreen] Exit request declined:', err?.message || err);
      });
    }
    return Promise.resolve();
  } catch (err) {
    console.info('[Fullscreen] Exit could not be completed:', err?.message || err);
    return Promise.resolve();
  }
}

/**
 * Adds an event listener for fullscreen changes across all vendor prefixes.
 *
 * @param {Function} callback - Function called when fullscreen status changes.
 * @returns {Function} Cleanup function to remove all registered listeners.
 */
export function addFullscreenChangeListener(callback) {
  if (typeof document === 'undefined' || typeof callback !== 'function') {
    return () => {};
  }

  const events = [
    'fullscreenchange',
    'webkitfullscreenchange',
    'mozfullscreenchange',
    'MSFullscreenChange',
  ];

  const handler = (e) => {
    const isFs = Boolean(getFullscreenElement());
    callback(isFs, e);
  };

  events.forEach((evt) => {
    document.addEventListener(evt, handler, false);
  });

  return () => {
    events.forEach((evt) => {
      document.removeEventListener(evt, handler, false);
    });
  };
}

/**
 * Adds an event listener for fullscreen errors across all vendor prefixes.
 *
 * @param {Function} callback - Function called when a fullscreen error occurs.
 * @returns {Function} Cleanup function to remove all registered listeners.
 */
export function addFullscreenErrorListener(callback) {
  if (typeof document === 'undefined' || typeof callback !== 'function') {
    return () => {};
  }

  const events = [
    'fullscreenerror',
    'webkitfullscreenerror',
    'mozfullscreenerror',
    'MSFullscreenError',
  ];

  const handler = (e) => {
    callback(e);
  };

  events.forEach((evt) => {
    document.addEventListener(evt, handler, false);
  });

  return () => {
    events.forEach((evt) => {
      document.removeEventListener(evt, handler, false);
    });
  };
}
