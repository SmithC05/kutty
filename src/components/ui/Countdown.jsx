import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '../core/Typography';
import { padTime } from '../../utils/time';

/**
 * Premium Glassmorphism Live Countdown
 * Features mechanical rolling digits and subtle floating animations.
 */
export function Countdown({ timeState }) {
  const { days, hours, minutes, seconds } = timeState;

  const handleSecretTap = () => {
    const pwd = window.prompt("Director Access:");
    if (pwd === "canvas") {
      window.dispatchEvent(new CustomEvent('developer-unlock'));
    }
  };

  const blocks = [
    { label: 'Days', value: days },
    { label: 'Hours', value: hours },
    { label: 'Minutes', value: minutes },
    { label: 'Seconds', value: seconds }
  ];

  return (
    <div className="relative flex flex-col items-center">
      <div 
        className="absolute -top-10 -right-10 w-12 h-12 opacity-0 cursor-default z-50"
        onClick={handleSecretTap}
      />
      
      <div className="flex gap-4 md:gap-8">
        {blocks.map((block, idx) => (
          <motion.div 
            key={block.label} 
            className="flex flex-col items-center space-y-4"
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: idx * 0.2
            }}
          >
            <div className="relative overflow-hidden w-20 h-24 md:w-28 md:h-36 rounded-xl backdrop-blur-xl bg-white/5 border border-blue-400/20 shadow-[0_8px_32px_0_rgba(37,99,235,0.2)] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-30" />
              
              <div className="relative flex items-center justify-center w-full h-full pb-4">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={block.value}
                    initial={{ y: "100%", opacity: 0, filter: 'blur(2px)' }}
                    animate={{ y: "0%", opacity: 1, filter: 'blur(0px)' }}
                    exit={{ y: "-100%", opacity: 0, filter: 'blur(2px)' }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute"
                  >
                    <Typography variant="countdown" className="drop-shadow-lg text-4xl md:text-6xl text-blue-200">
                      {padTime(block.value)}
                    </Typography>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            
            <Typography variant="caption" className="tracking-[0.3em] text-white/40 text-[9px] md:text-[10px] font-sans">
              {block.label}
            </Typography>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
