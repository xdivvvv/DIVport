import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
      
      const target = e.target as HTMLElement;
      // Check if the element or its parent is interactive
      const isPointer = 
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') !== null ||
        target.closest('button') !== null;
      
      setIsHovered(isPointer);
    };

    const mouseDown = () => setIsClicked(true);
    const mouseUp = () => setIsClicked(false);

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mouseup", mouseUp);
    };
  }, []);

  // Variants for different cursor states
  const variants = {
    default: {
      x: mousePosition.x - 10,
      y: mousePosition.y - 10,
      height: 20,
      width: 20,
      scale: 1,
    },
    hover: {
      x: mousePosition.x - 32,
      y: mousePosition.y - 32,
      height: 64,
      width: 64,
      scale: 1,
    },
    clicked: {
      x: mousePosition.x - (isHovered ? 32 : 10),
      y: mousePosition.y - (isHovered ? 32 : 10),
      height: isHovered ? 64 : 20,
      width: isHovered ? 64 : 20,
      scale: 0.8,
    }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 z-[100] pointer-events-none bg-offwhite rounded-full mix-blend-difference hidden md:block"
      variants={variants}
      animate={isClicked ? "clicked" : isHovered ? "hover" : "default"}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
        mass: 0.5
      }}
    />
  );
};

export default CustomCursor;