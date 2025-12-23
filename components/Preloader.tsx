import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

const LOADING_STEPS = [
  "INITIALIZING_CORE",
  "LOADING_ASSETS",
  "CALIBRATING_SENSORS",
  "SYNCING_PROTOCOLS",
  "FINALIZING_RENDER"
];

const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const progress = useMotionValue(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  // Ghost progress for a "liquid" lag effect on the bar
  const ghostProgress = useMotionValue(0);

  useEffect(() => {
    // Primary progress animation
    const controls = animate(progress, 100, {
      duration: 3.2,
      ease: [0.65, 0, 0.35, 1], // Very smooth easeInOutCubic
      onUpdate: (latest) => {
        const roundedValue = Math.round(latest);
        setDisplayProgress(roundedValue);
        
        const nextStep = Math.min(
          Math.floor((latest / 100) * LOADING_STEPS.length),
          LOADING_STEPS.length - 1
        );
        setStepIndex(nextStep);
      },
      onComplete: () => {
        setTimeout(onComplete, 300);
      }
    });

    // Lagging ghost progress for fluidity
    const ghostControls = animate(ghostProgress, 100, {
      duration: 3.8,
      ease: [0.65, 0, 0.35, 1],
    });

    return () => {
      controls.stop();
      ghostControls.stop();
    };
  }, [onComplete, progress, ghostProgress]);

  // Dynamic transforms based on progress for "immersion"
  const widthPercent = useTransform(progress, [0, 100], ["0%", "100%"]);
  const ghostWidthPercent = useTransform(ghostProgress, [0, 100], ["0%", "100%"]);
  const bgScale = useTransform(progress, [0, 100], [1, 1.2]);
  const bgOpacity = useTransform(progress, [0, 100], [0.05, 0.2]);
  // Removed textBlur transform
  const textScale = useTransform(progress, [0, 100], [0.95, 1.05]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        y: -50,
        scale: 1.05, 
        // Removed blur filter
      }}
      transition={{ 
        duration: 0.8, 
        ease: [0.76, 0, 0.24, 1] 
      }}
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center overflow-hidden origin-center"
    >
      {/* Background Grid - Reacts to progress */}
      <motion.div 
        style={{ 
          scale: bgScale, 
          opacity: bgOpacity,
          backgroundImage: 'linear-gradient(to right, #FF0055 1px, transparent 1px), linear-gradient(to bottom, #FF0055 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }}
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
      />

      {/* Main Content Container - Inner zoom effect */}
      <motion.div 
        className="relative z-20 flex flex-col items-center"
        exit={{ scale: 1.1, opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Large Percentage - Smooth scaling */}
        <motion.div 
          style={{ 
            scale: textScale,
            // Removed filter: textBlur
          }}
          className="font-display text-[25vw] md:text-[20vw] leading-none text-neon select-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {displayProgress}
        </motion.div>
        
        <motion.div 
          className="mt-4 flex flex-col items-center w-full max-w-xs px-4"
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Current Loading Step */}
          <div className="h-6 flex items-center justify-center mb-4 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div 
                key={stepIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                className="font-mono text-neon text-[10px] md:text-xs tracking-[0.5em] uppercase font-bold text-center"
              >
                {LOADING_STEPS[stepIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Liquid Progress Bar */}
          <div className="w-full h-[1px] bg-neon/5 relative">
            {/* Ghost bar (Trailing liquid effect) */}
            <motion.div 
              className="absolute inset-y-0 left-0 bg-neon/30 blur-[2px]"
              style={{ width: ghostWidthPercent }}
            />
            {/* Main bar */}
            <motion.div 
              className="absolute inset-y-0 left-0 bg-neon shadow-[0_0_15px_rgba(255,0,85,0.8)]"
              style={{ width: widthPercent }}
            />
          </div>

          <div className="flex justify-between w-full mt-3 font-mono text-[9px] text-neon/30 uppercase tracking-[0.2em]">
            <motion.span animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2, repeat: Infinity }}>
              System_Load
            </motion.span>
            <span className="tabular-nums">
              {displayProgress}%
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Ambient Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [-20, 20, -20],
          y: [-20, 20, -20]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[60vw] h-[60vw] rounded-full bg-neon/10 blur-[120px] pointer-events-none"
      />

      {/* Dynamic Noise Overlay */}
      <motion.div 
        animate={{ opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 0.15, repeat: Infinity }}
        className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay opacity-5" 
      />
    </motion.div>
  );
};

export default Preloader;