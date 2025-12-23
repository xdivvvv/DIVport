import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ScrollArrow: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if we are near the bottom of the page (within 100px)
      const scrolledToBottom = 
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      
      setIsFlipped(scrolledToBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    if (isFlipped) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Define section order
      const sections = ['about', 'work', 'contact'];
      
      // Determine the next logical section to scroll to
      let nextSectionId = null;
      
      // If we are at the very top, the next section is 'about'
      if (window.scrollY < 100) {
        nextSectionId = 'about';
      } else {
         // Find the first section that starts below the current scroll position
         for (const id of sections) {
             const element = document.getElementById(id);
             if (element) {
                 // Add a small buffer (10px) to ensure we don't get stuck on the current one
                 if (element.offsetTop > window.scrollY + 10) {
                     nextSectionId = id;
                     break;
                 }
             }
         }
      }

      if (nextSectionId) {
        document.getElementById(nextSectionId)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        // If no specific next section found (e.g., inside Contact), ensure we go to bottom
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 cursor-pointer group mix-blend-difference"
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: isFlipped ? 0 : [0, 10, 0],
        rotate: isFlipped ? 180 : 0
      }}
      transition={{ 
        y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        opacity: { duration: 0.5, delay: 1 },
        rotate: { duration: 0.5 }
      }}
      onClick={handleClick}
    >
        <div className="flex flex-col items-center gap-2">
            {/* "Fictional" / Functional Label */}
            <span className="font-mono text-[10px] text-neon opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -top-8 whitespace-nowrap tracking-widest bg-black/80 text-offwhite px-2 py-1 rounded">
                {isFlipped ? 'INIT_RETURN_SEQ' : 'NEXT_SECTOR'}
            </span>
            
            {/* Custom Long Arrow SVG - Resized from 24x60 to 16x40 */}
            <svg 
                width="16" 
                height="40" 
                viewBox="0 0 24 60" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-neon drop-shadow-[0_0_6px_rgba(255,0,85,0.8)] group-hover:stroke-offwhite transition-colors duration-300"
            >
                <path d="M12 0V58" strokeWidth="3" />
                <path d="M2 48L12 58L22 48" strokeWidth="3" strokeLinecap="square" />
            </svg>
        </div>
    </motion.div>
  );
};

export default ScrollArrow;