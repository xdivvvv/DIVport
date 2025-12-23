import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const GridOverlay: React.FC = () => {
  const { scrollY } = useScroll();
  
  // Parallax effect: Shift background based on scroll
  // Moving the background up at a fraction of the scroll speed creates depth.
  // We use a template literal to ensure the unit is pixels.
  // Increased multiplier to 0.5 for a more pronounced parallax effect
  const backgroundPositionY = useTransform(scrollY, (value) => `-${value * 0.5}px`);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden h-screen w-screen">
      <motion.div 
        className="absolute inset-0 text-black dark:text-offwhite opacity-[0.05] dark:opacity-[0.1] transition-colors duration-500"
        style={{ 
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          // Using ~8.33% to maintain the roughly 12-column/row look from the original design
          backgroundSize: '8.33vw 8.33vh', 
          backgroundPositionX: '50%',
          backgroundPositionY: backgroundPositionY
        }}
      />
    </div>
  );
};

export default GridOverlay;