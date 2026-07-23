import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '../components/core/Typography';
import { Screen } from '../components/core/Screen';
import { Countdown } from '../components/ui/Countdown';
import { useDateLock } from '../hooks/useDateLock';
import { fadeIn, easeCinematic } from '../animations/presets';

/**
 * Advance Birthday Journey
 * Sequence: Messages -> Live Countdown -> Advance Wish
 */
export function AdvanceJourney() {
  const timeState = useDateLock();
  const [step, setStep] = useState(0);

  const messages = [
    "Good things take time...",
    "Anticipation is a gift in itself.",
    "Advance Happy Birthday, Kutty."
  ];

  useEffect(() => {
    // Sequence the text messages
    if (step < messages.length) {
      const timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, 4000); // 4 seconds per message
      return () => clearTimeout(timer);
    }
  }, [step, messages.length]);

  return (
    <Screen className="bg-transparent overflow-hidden">
      
      {/* Blurry Background Reveal for the Countdown Page */}
      <motion.img 
        src="/images/solo-photos/kutty1.jpeg" 
        alt="Background"
        initial={false}
        animate={
          step >= messages.length 
            ? { opacity: 0.7, scale: 1, filter: 'blur(10px)' } 
            : { opacity: 0, scale: 1.1, filter: 'blur(20px)' }
        }
        transition={{ duration: 3, ease: 'easeOut' }}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
        <AnimatePresence mode="wait">
          {step < messages.length ? (
            <motion.div
              key={`msg-${step}`}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={fadeIn}
              className="max-w-xl"
            >
              <Typography 
                variant={step === 2 ? "h1" : "h3"} 
                className={step === 2 ? "text-glow leading-tight" : "text-white/90"}
                style={{ fontFamily: '"Alex Brush", "Dancing Script", cursive' }}
              >
                {messages[step]}
              </Typography>
            </motion.div>
          ) : (
            <motion.div
              key="countdown-view"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: easeCinematic }}
              className="flex flex-col items-center space-y-16 mt-8"
            >
              <Countdown timeState={timeState} />
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 2 }}
              >
                <Typography variant="body" className="text-white/70 max-w-md mx-auto italic">
                  See you on August 3rd, Keerthana.
                </Typography>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Screen>
  );
}
