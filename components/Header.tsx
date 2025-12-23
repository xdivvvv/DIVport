import React, { useState, useLayoutEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { flushSync } from 'react-dom';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Default to true (Dark Mode default)
  const [isDark, setIsDark] = useState(true);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  useLayoutEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const toggleTheme = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // @ts-ignore
    if (!document.startViewTransition) {
      setIsDark(!isDark);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // @ts-ignore
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setIsDark(!isDark);
      });
    });

    await transition.ready;

    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];

    document.documentElement.animate(
      {
        clipPath: clipPath,
      },
      {
        duration: 750,
        easing: "cubic-bezier(0.76, 0, 0.24, 1)", // easeInOutQuart for liquid feel
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 mix-blend-difference text-offwhite">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <a 
          href="#hero" 
          onClick={() => setIsOpen(false)}
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
          className="font-display text-2xl tracking-tight z-50 relative flex items-baseline cursor-pointer"
        >
          <span>D</span>
          <motion.span
            initial={{ width: 0, opacity: 0 }}
            animate={{ 
              width: isLogoHovered ? 'auto' : 0,
              opacity: isLogoHovered ? 1 : 0 
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} 
            className="overflow-hidden whitespace-nowrap"
          >
            IVYANSHU
          </motion.span>
          <motion.span
            initial={{ width: 0, opacity: 0 }}
            animate={{ 
              width: isLogoHovered ? 'auto' : 0,
              opacity: isLogoHovered ? 1 : 0 
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} 
            className="overflow-hidden text-neon"
          >
            .
          </motion.span>
          <span>C</span>
          <motion.span
            initial={{ width: 0, opacity: 0 }}
            animate={{ 
              width: isLogoHovered ? 'auto' : 0,
              opacity: isLogoHovered ? 1 : 0 
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden whitespace-nowrap"
          >
            HAUDHARY
          </motion.span>
          <span className="text-neon">.</span>DES
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <a 
              key={item.label} 
              href={item.href} 
              onClick={handleNavClick}
              className="font-mono text-sm tracking-widest hover:bg-offwhite hover:text-black transition-colors duration-300 px-2 py-1"
            >
              {item.label}
            </a>
          ))}
          <button onClick={toggleTheme} className="ml-4 hover:text-neon transition-colors">
             {isDark ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden z-50 relative" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>
    </header>

    {/* Mobile Nav Overlay */}
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-40 flex flex-col items-center justify-center"
        >
           <div className="flex flex-col gap-8 text-center">
            {NAV_ITEMS.map((item) => (
                <a 
                  key={item.label} 
                  href={item.href} 
                  onClick={handleNavClick}
                  className="font-display text-5xl text-offwhite hover:bg-offwhite hover:text-black transition-colors px-6 py-2"
                >
                  {item.label}
                </a>
              ))}
              <button onClick={(e) => {
                  toggleTheme(e);
                  // Optional: Close menu on toggle? Or keep open.
              }} className="flex items-center justify-center gap-2 font-mono text-offwhite hover:text-neon transition-colors mt-4">
                {isDark ? <Moon size={24} /> : <Sun size={24} />}
                <span>{isDark ? 'DARK THEME' : 'LIGHT THEME'}</span>
              </button>
           </div>
           
           <div className="absolute bottom-12 left-0 w-full text-center">
             <div className="font-mono text-gray-500 text-xs">
                MENU OPENED
             </div>
           </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default Header;