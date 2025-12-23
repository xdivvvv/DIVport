import React, { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Work from './components/Work';
import Contact from './components/Contact';
import GridOverlay from './components/GridOverlay';
import CustomCursor from './components/CustomCursor';
import ScrollArrow from './components/ScrollArrow';
import Preloader from './components/Preloader';
import Lenis from 'lenis';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const lenisRef = useRef<Lenis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Lenis with inertial smoothing settings
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.08,
      wheelMultiplier: 1.1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // RAF loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Magnetic Snapping Logic
    let snapTimeout: any;
    
    const handleScroll = () => {
      if (snapTimeout) clearTimeout(snapTimeout);
      
      // Wait for scrolling to settle before snapping (150ms of inactivity)
      snapTimeout = setTimeout(() => {
        const sections = document.querySelectorAll('section, footer');
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        
        let closestSection: HTMLElement | null = null;
        let minDistance = Infinity;

        sections.forEach((section) => {
          const s = section as HTMLElement;
          // Calculate distance from the top of the section to the top of the viewport
          const distance = Math.abs(s.offsetTop - scrollY);
          if (distance < minDistance) {
            minDistance = distance;
            closestSection = s;
          }
        });

        const snapThreshold = viewportHeight * 0.15;
        
        // Only snap if we are within the small threshold but not perfectly aligned (minDistance > 2)
        if (closestSection && minDistance > 2 && minDistance < snapThreshold) {
          lenis.scrollTo(closestSection, {
            duration: 1.0,
            easing: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1, // easeInOutCubic
          });
        }
      }, 150); 
    };

    lenis.on('scroll', handleScroll);

    // Synchronize anchor links with Lenis
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      // If clicked element is not an anchor or inside one, ignore
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      
      // If no href, ignore
      if (!href) return;
      
      // Handle internal hash links
      if (href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const targetId = href.substring(1);
        const element = document.getElementById(targetId);
        
        if (element) {
          lenis.scrollTo(element, { offset: 0, duration: 1.5 });
        }
      }
      // If href is just '#', prevent default jump to top if desired, or let it handle by browser.
      // Usually '#' is used for buttons that shouldn't navigate.
      else if (href === '#') {
        e.preventDefault();
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      lenis.destroy();
      document.removeEventListener('click', handleAnchorClick);
      if (snapTimeout) clearTimeout(snapTimeout);
    };
  }, []);

  return (
    <div className="bg-offwhite dark:bg-offblack min-h-screen text-black dark:text-offwhite selection:bg-neon selection:text-offwhite cursor-none transition-colors duration-500 w-full relative overflow-x-hidden">
      <AnimatePresence mode="wait">
        {isLoading && (
          <Preloader onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <CustomCursor />
      <GridOverlay />
      
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <ScrollArrow />
            <Header />
            <main className="w-full">
              <Hero />
              <About />
              <Work />
              <Contact />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;