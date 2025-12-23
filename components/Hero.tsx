import React, { useRef, useEffect, useState, memo } from 'react';
import { motion, useMotionValue, useAnimationFrame, useSpring, AnimatePresence } from 'framer-motion';
import { QrCode } from 'lucide-react';
import { flushSync } from 'react-dom';
import TextHover from './TextHover';
import GlitchText from './GlitchText';

// --- Math Helpers for Cubic Bezier & Geometry ---

interface Point { x: number; y: number; }

const getPointOnBezier = (t: number, p0: Point, p1: Point, p2: Point, p3: Point): Point => {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  return {
    x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y
  };
};

const getTangentOnBezier = (t: number, p0: Point, p1: Point, p2: Point, p3: Point): Point => {
  const u = 1 - t;
  const uu = u * u;
  const tt = t * t;

  return {
    x: 3 * uu * (p1.x - p0.x) + 6 * u * t * (p2.x - p1.x) + 3 * tt * (p3.x - p2.x),
    y: 3 * uu * (p1.y - p0.y) + 6 * u * t * (p2.y - p1.y) + 3 * tt * (p3.y - p2.y)
  };
};

const getNormal = (tangent: Point): Point => {
  const len = Math.sqrt(tangent.x * tangent.x + tangent.y * tangent.y);
  if (len === 0) return { x: 0, y: 1 };
  return { x: -tangent.y / len, y: tangent.x / len };
};

// --- Fluid Line Component (Memoized for Performance) ---

interface FluidLineProps {
  mouseX: any;
  mouseY: any;
  color: string;
  baseYRatio: number;
  timeSpeed: number;
  waveFrequency: number;
  waveAmplitude: number;
  baseThickness: number;
  controlPointRange: { x: number; y: number };
  mouseInfluence: number;
  phaseOffset: number;
  variant: 1 | 2;
}

const FluidLine = memo(({ 
  mouseX, mouseY, color, baseYRatio,
  timeSpeed, waveFrequency, waveAmplitude, baseThickness,
  controlPointRange, mouseInfluence, phaseOffset,
  variant
}: FluidLineProps) => {
  const pathRef = useRef<SVGPathElement>(null);
  const timeRef = useRef(phaseOffset);
  const swellValue = useSpring(0, { stiffness: 100, damping: 20 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    swellValue.set(isHovered ? 1 : 0);
  }, [isHovered, swellValue]);

  useAnimationFrame((t, delta) => {
    if (!pathRef.current) return;
    
    timeRef.current += (delta / 1000) * timeSpeed;
    const time = timeRef.current;
    const mx = mouseX.get(); 
    const my = mouseY.get(); 
    
    const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const height = typeof window !== 'undefined' ? window.innerHeight : 800;
    const currentBaseY = height * baseYRatio;

    const p0 = { x: -100, y: currentBaseY + Math.sin(time * 0.5) * (controlPointRange.y * 0.5) };
    const p3 = { x: width + 100, y: currentBaseY + Math.cos(time * 0.3) * (controlPointRange.y * 0.5) };

    let p1, p2;
    if (variant === 1) {
      p1 = { 
        x: width * 0.3 + Math.sin(time * 0.7) * controlPointRange.x + (mx - 0.5) * mouseInfluence, 
        y: currentBaseY - 150 + Math.cos(time * 0.6) * controlPointRange.y + (my - 0.5) * mouseInfluence
      };
      p2 = { 
        x: width * 0.7 + Math.cos(time * 0.8) * controlPointRange.x - (mx - 0.5) * mouseInfluence, 
        y: currentBaseY + 150 + Math.sin(time * 0.5) * controlPointRange.y - (my - 0.5) * mouseInfluence
      };
    } else {
      p1 = { 
        x: width * 0.3 + Math.cos(time * 0.45) * controlPointRange.x + (mx - 0.5) * mouseInfluence, 
        y: currentBaseY - 150 + Math.sin(time * 0.85) * controlPointRange.y + (my - 0.5) * mouseInfluence
      };
      p2 = { 
        x: width * 0.7 + Math.sin(time * 0.65) * controlPointRange.x - (mx - 0.5) * mouseInfluence, 
        y: currentBaseY + 150 + Math.cos(time * 0.35) * controlPointRange.y - (my - 0.5) * mouseInfluence
      };
    }

    const swell = swellValue.get();
    const effectiveBaseThickness = baseThickness + (swell * 30);
    const effectiveWaveAmplitude = waveAmplitude + (swell * 60);

    const segments = 25; // Optimized segment count
    const topPoints: Point[] = [];
    const bottomPoints: Point[] = [];

    for (let i = 0; i <= segments; i++) {
      const tVal = i / segments;
      const point = getPointOnBezier(tVal, p0, p1, p2, p3);
      const tangent = getTangentOnBezier(tVal, p0, p1, p2, p3);
      const normal = getNormal(tangent);

      const wave = Math.sin(tVal * waveFrequency + time * 2);
      const thickness = effectiveBaseThickness + (effectiveWaveAmplitude * (1 + wave) * 0.5) * (1 + Math.sin(time * 0.5) * 0.3);

      topPoints.push({ x: point.x + normal.x * (thickness / 2), y: point.y + normal.y * (thickness / 2) });
      bottomPoints.push({ x: point.x - normal.x * (thickness / 2), y: point.y - normal.y * (thickness / 2) });
    }

    let d = `M ${topPoints[0].x.toFixed(1)} ${topPoints[0].y.toFixed(1)} `;
    for (let i = 1; i < topPoints.length; i++) d += `L ${topPoints[i].x.toFixed(1)} ${topPoints[i].y.toFixed(1)} `;
    for (let i = bottomPoints.length - 1; i >= 0; i--) d += `L ${bottomPoints[i].x.toFixed(1)} ${bottomPoints[i].y.toFixed(1)} `;
    d += "Z";

    pathRef.current.setAttribute("d", d);
  });

  return (
    <path 
      ref={pathRef} 
      fill={color} 
      className="transition-colors duration-500 cursor-pointer pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ willChange: 'd' }}
    />
  );
});

// --- Main Hero Component ---

const ACCENT_COLORS = [
  '#FF0055', // Neon Pink (Original)
  '#00FF99', // Emerald Green
  '#0099FF', // Electric Blue
  '#FFCC00', // Gold/Yellow
  '#9D00FF'  // Vivid Purple
];

const Hero: React.FC = () => {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const [isMainLineHovered, setIsMainLineHovered] = useState(false);
  const [isPlusHovered, setIsPlusHovered] = useState(false);
  const [currentColor, setCurrentColor] = useState('#FF0055');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set(clientX / innerWidth);
      mouseY.set(clientY / innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const changeAccentColor = async (e: React.MouseEvent, color: string) => {
    // @ts-ignore
    if (!document.startViewTransition) {
      setCurrentColor(color);
      document.documentElement.style.setProperty('--neon-color', color);
      return;
    }

    setIsTransitioning(true);

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // @ts-ignore
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setCurrentColor(color);
        document.documentElement.style.setProperty('--neon-color', color);
      });
    });

    await transition.ready;

    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];

    const animation = document.documentElement.animate(
      {
        clipPath: clipPath,
      },
      {
        duration: 750,
        easing: "cubic-bezier(0.76, 0, 0.24, 1)", // easeInOutQuart for liquid feel
        pseudoElement: "::view-transition-new(root)",
      }
    );

    try {
      await animation.finished;
    } finally {
      setIsTransitioning(false);
    }
  };

  return (
    <section id="hero" className="relative h-screen flex flex-col justify-center items-center overflow-hidden px-6 pt-20 scroll-snap-align-start">
      
      {/* Animated Fluid Background (Memoized) */}
      <div className="absolute inset-0 z-0 opacity-40 w-full h-full pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
           <FluidLine 
             mouseX={mouseX} 
             mouseY={mouseY} 
             baseYRatio={0.40} 
             color={currentColor} 
             timeSpeed={1.15}
             waveFrequency={8}
             waveAmplitude={15}
             baseThickness={4}
             controlPointRange={{ x: 100, y: 50 }}
             mouseInfluence={200}
             phaseOffset={0}
             variant={1}
           />
           <FluidLine 
             mouseX={mouseX} 
             mouseY={mouseY} 
             baseYRatio={0.60} 
             color={currentColor} 
             timeSpeed={1.0}
             waveFrequency={3}
             waveAmplitude={40}
             baseThickness={8}
             controlPointRange={{ x: 250, y: 120 }}
             mouseInfluence={-200}
             phaseOffset={100}
             variant={2}
           />
        </svg>
      </div>

      <div className="absolute top-1/4 left-10 opacity-20 font-mono text-neon text-xs hidden md:block pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>{Math.random().toString(2).substring(2, 25)}</div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} 
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 mb-8 font-mono text-sm tracking-wider pointer-events-auto"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-neon"></span>
          </span>
          <TextHover>AVAILABLE FOR FREELANCE</TextHover>
        </motion.div>

        <div className="flex flex-col items-start leading-[0.85]">
          <div className="pointer-events-auto">
            <GlitchText 
                speed={0.5} 
                enableShadows={true} 
                enableOnHover={true}
                className="text-[12vw] md:text-[9vw] font-display font-black text-black dark:text-offwhite uppercase hover:text-neon transition-colors duration-300"
            >
                CREATIVE
            </GlitchText>
          </div>
          
          <div className="flex items-center w-full gap-4 relative">
            {/* The Main Highlighted Line Container */}
            <div className="flex-grow flex items-center h-12 relative">
                {/* Glow layer */}
                <motion.div 
                  animate={{ opacity: isMainLineHovered ? 0.4 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ 
                    background: `radial-gradient(circle, ${currentColor} 0%, transparent 70%)`,
                    willChange: 'opacity' 
                  }}
                  className="absolute inset-0 z-0 scale-[1.5]"
                />

                <motion.div 
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  animate={{ height: isMainLineHovered ? 40 : 8 }}
                  viewport={{ once: true }}
                  onMouseEnter={() => setIsMainLineHovered(true)}
                  onMouseLeave={() => setIsMainLineHovered(false)}
                  transition={{ 
                    scaleX: { delay: 0.4, duration: 0.8 },
                    height: { type: 'spring', stiffness: 300, damping: 25 }
                  }}
                  className="w-full bg-neon origin-left cursor-pointer pointer-events-auto relative z-10 flex items-center justify-center overflow-hidden"
                  style={{ willChange: 'height' }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                            opacity: isMainLineHovered ? 1 : 0,
                            y: isMainLineHovered ? 0 : 10
                        }}
                        transition={{ duration: 0.3 }}
                        className="whitespace-nowrap px-4 pointer-events-none"
                    >
                        <span className="font-mono text-[9px] md:text-xs font-bold text-black tracking-[0.2em] uppercase">
                            I design stories — in frames, motion, and form.
                        </span>
                    </motion.div>
                </motion.div>
            </div>

            {/* The Plus Icon (Color Picker Trigger) */}
            <div 
              className="relative pointer-events-auto" 
              onMouseEnter={() => setIsPlusHovered(true)} 
              onMouseLeave={() => setIsPlusHovered(false)}
            >
              {/* Entrance Animation Wrapper - Decoupled from Hover Rotation */}
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ 
                  opacity: 1, scale: 1,
                  transition: { delay: 0.6, type: "spring", stiffness: 150 }
                }}
                viewport={{ once: true }}
                className="relative w-6 h-6 md:w-12 md:h-12 flex-shrink-0 cursor-pointer"
              >
                {/* Hover Rotation Wrapper */}
                <motion.div
                   animate={{
                      rotate: isPlusHovered ? 90 : 0,
                      scale: isPlusHovered ? 1.2 : 1,
                   }}
                   transition={{ 
                      type: "spring", 
                      stiffness: 260, 
                      damping: 20 
                   }}
                   className="w-full h-full relative"
                   style={{ transformOrigin: 'center center' }}
                >
                    {/* Hover Background Glow */}
                    <motion.div 
                      animate={{ opacity: isPlusHovered ? 0.6 : 0 }}
                      style={{ 
                        background: `radial-gradient(circle, ${currentColor} 0%, transparent 80%)`,
                        willChange: 'opacity' 
                      }}
                      className="absolute inset-[-10px] rounded-full"
                    />

                    {/* Horizontal Line */}
                    <motion.div 
                      animate={{ height: isPlusHovered ? 6 : 4 }}
                      className="absolute top-1/2 left-0 w-full bg-neon -translate-y-1/2 z-10 rounded-full" 
                    />
                    
                    {/* Vertical Line */}
                    <motion.div 
                      animate={{ width: isPlusHovered ? 6 : 4 }}
                      className="absolute left-1/2 top-0 h-full bg-neon -translate-x-1/2 z-10 rounded-full" 
                    />
                </motion.div>
              </motion.div>

              {/* Color Swatch Popover */}
              <AnimatePresence>
                {isPlusHovered && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, x: '-50%', scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
                    exit={{ opacity: 0, y: 10, x: '-50%', scale: 0.9 }}
                    transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                    className="absolute bottom-[calc(100%+20px)] left-1/2 z-50"
                    style={{ willChange: 'transform, opacity', x: '-50%' }}
                  >
                     {/* Interaction Bridge */}
                    <div className="absolute top-full left-0 w-full h-8 pointer-events-auto" />

                    <div className="bg-[#0a0a0a] border border-white/20 p-5 rounded-2xl shadow-2xl flex flex-col items-center gap-4 min-w-[240px]">
                        
                        {/* Text Label */}
                        <div className="font-mono text-[11px] tracking-wider font-bold text-white/70 uppercase whitespace-nowrap">
                            Don't like the color? <span className="text-neon ml-1">Change it</span>
                        </div>

                        {/* Swatches Container */}
                        <div className="flex items-center gap-3">
                            {ACCENT_COLORS.map((color) => {
                                const isActive = currentColor === color;
                                return (
                                <button
                                    key={color}
                                    onClick={(e) => changeAccentColor(e, color)}
                                    className="relative flex items-center justify-center outline-none group"
                                >
                                    {isActive && (
                                        <motion.div 
                                            layoutId="active-ring"
                                            className="absolute inset-[-5px] border border-white/80 rounded-full"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    )}
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-6 h-6 rounded-full transition-transform duration-200"
                                        style={{ backgroundColor: color }}
                                    />
                                </button>
                                )
                            })}
                        </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="self-end md:self-auto pointer-events-auto">
            <GlitchText 
                speed={0.5} 
                enableShadows={true} 
                enableOnHover={true}
                className="text-[12vw] md:text-[9vw] font-display font-black text-black dark:text-offwhite uppercase hover:text-neon transition-colors duration-300"
            >
                DESIGNER
            </GlitchText>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end mt-12 md:mt-24 border-t border-black/20 dark:border-offwhite/20 pt-8 transition-colors duration-300 pointer-events-auto">
          <div className="font-mono text-sm text-gray-400 mb-6 md:mb-0">
            <p><TextHover>BASED IN</TextHover></p>
            <a 
              href="https://www.google.com/maps/place/Delhi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-black dark:text-offwhite block hover:opacity-80"
            >
              <TextHover>Delhi, IN</TextHover>
            </a>
            <p className="mt-2 text-neon"><TextHover>EST. 2025</TextHover></p>
          </div>

          <div className="bg-black dark:bg-offwhite p-2 transition-colors duration-300">
            <QrCode className="w-16 h-16 text-offwhite dark:text-black" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;