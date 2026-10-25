import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useFullscreen } from '../../context';
import { useScene } from '../../context/SceneContext';
import { SCENES } from '../../constants';

/**
 * FullscreenToggle
 * Responsive UI indicator and toggle that listens to fullscreen changes.
 *
 * - When in fullscreen: shows a subtle, unobtrusive control in the top-right corner.
 * - When the user exits fullscreen after the experience has begun: smoothly reveals a
 *   distinct glassmorphic pill button prompting the user to re-enter full immersion.
 * - Hidden on unsupported browsers (e.g., iOS Safari).
 * - Hidden before the initial gift interaction to preserve the opening aesthetic.
 */
export function FullscreenToggle() {
  const { isFullscreen, isSupported, hasAttempted, toggleFullscreen } = useFullscreen();
  const { currentScene } = useScene();

  // If Fullscreen API is unsupported, do not render a non-functional control
  if (!isSupported) {
    return null;
  }

  // Do not clutter the opening gift screen before the user has clicked
  const hasStarted = hasAttempted || currentScene !== SCENES.LOADING;
  if (!hasStarted) {
    return null;
  }

  return (
    <div
      className="fixed top-3 right-3 z-50 pointer-events-auto select-none"
      style={{
        marginTop: 'env(safe-area-inset-top, 0px)',
        marginRight: 'env(safe-area-inset-right, 0px)',
      }}
    >
      <AnimatePresence mode="wait">
        {!isFullscreen ? (
          <motion.button
            key="re-enter-fullscreen"
            initial={{ opacity: 0, scale: 0.9, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            type="button"
            onClick={() => toggleFullscreen()}
            aria-label="Enter Fullscreen"
            title="Enter Fullscreen"
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-xs font-medium text-stone-200 backdrop-blur-xl shadow-xl hover:border-violet-400/50 hover:bg-black/85 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 cursor-pointer transition-all duration-200"
          >
            <Maximize2 className="h-3.5 w-3.5 text-violet-300 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline font-['Outfit',sans-serif] tracking-wide">Fullscreen</span>
          </motion.button>
        ) : (
          <motion.button
            key="exit-fullscreen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            whileHover={{ opacity: 1, scale: 1.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            type="button"
            onClick={() => toggleFullscreen()}
            aria-label="Exit Fullscreen"
            title="Exit Fullscreen (Esc)"
            className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-black/40 text-stone-400 backdrop-blur-md hover:text-white hover:border-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 cursor-pointer transition-all duration-200 shadow-md"
          >
            <Minimize2 className="h-3.5 w-3.5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
