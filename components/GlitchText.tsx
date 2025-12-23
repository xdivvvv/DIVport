import React, { useRef, useState, useEffect } from 'react';

interface GlitchTextProps {
  children: string;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;:,.<>?';

const GlitchText: React.FC<GlitchTextProps> = ({ 
  children, 
  speed = 0.2, 
  enableShadows = true,
  enableOnHover = true,
  className = '' 
}) => {
  const [displayText, setDisplayText] = useState(children);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startScramble = () => {
    let iteration = 0;
    
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setDisplayText(prev => 
        children
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return children[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      
      if (iteration >= children.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      
      // Speed determines how many letters (or fraction of letters) are resolved per frame
      // 0.2 means it takes ~5 frames to resolve one letter
      iteration += speed;
    }, 30);
  };

  useEffect(() => {
    // Initial scramble if not hover-only, or just cleanup
    return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (enableOnHover) {
      setIsHovered(true);
      startScramble();
    }
  };

  const handleMouseLeave = () => {
    if (enableOnHover) {
      setIsHovered(false);
    }
  };

  return (
    <span 
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="relative z-10">{displayText}</span>
      {enableShadows && isHovered && (
        <>
          <span className="absolute top-0 left-0 -z-10 text-neon opacity-70 translate-x-[2px] translate-y-[2px] mix-blend-screen pointer-events-none">
            {displayText}
          </span>
          <span className="absolute top-0 left-0 -z-10 text-cyan-400 opacity-70 -translate-x-[2px] -translate-y-[2px] mix-blend-screen pointer-events-none">
            {displayText}
          </span>
        </>
      )}
    </span>
  );
};

export default GlitchText;