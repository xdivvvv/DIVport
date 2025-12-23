import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform, useInView, animate } from 'framer-motion';
import { AWARDS } from '../constants';
import TextHover from './TextHover';

const CountUp = ({ to }: { to: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      animate(count, to, { duration: 1.5, ease: "circOut" });
    } else {
      count.set(0);
    }
  }, [isInView, to, count]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

const Awards: React.FC = () => {
  const baseX = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  useAnimationFrame((t, delta) => {
    // Calculate movement based on time delta
    const baseSpeed = 0.0005; 
    const hoverSpeed = 0.0001;
    
    const speed = isHovered ? hoverSpeed : baseSpeed;
    baseX.set(baseX.get() - (speed * delta));
  });

  const x = useTransform(baseX, (v) => `${(v % 50)}%`);

  return (
    <section id="awards" className="relative min-h-screen flex flex-col bg-offwhite dark:bg-offblack text-black dark:text-offwhite transition-colors duration-500 overflow-x-hidden scroll-snap-align-start">
      
      {/* Marquee Header */}
      <div 
        className="bg-neon text-offwhite dark:text-black transition-colors duration-500 py-4 overflow-hidden whitespace-nowrap border-b-2 border-offwhite dark:border-black flex shrink-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div 
          className="flex gap-8 font-display text-4xl uppercase items-center"
          style={{ x }}
        >
          {[0, 1].map((setIndex) => (
             <div key={setIndex} className="flex gap-8 shrink-0 items-center">
                {Array.from({ length: 12 }).map((_, i) => (
                    <React.Fragment key={`${setIndex}-${i}`}>
                    <span><TextHover hoverColor="contrast">RECOGNITION</TextHover></span>
                    <span className="w-4 h-4 bg-offwhite dark:bg-black rounded-full transition-colors duration-500" />
                    </React.Fragment>
                ))}
             </div>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex-grow flex flex-col justify-center w-full py-12 md:py-24">
        <div className="flex flex-col gap-0">
          {AWARDS.map((award, index) => (
            <div key={index} className="group relative">
               {/* Diagonal Hatch Divider */}
              <div 
                className="h-2 md:h-4 w-full opacity-30 my-1 md:my-2" 
                style={{ 
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, var(--stripe-color) 10px, var(--stripe-color) 12px)`
                }}
              />
              
              <motion.div 
                className="flex flex-col md:flex-row items-baseline justify-between py-6 md:py-12 group-hover:bg-black/5 dark:group-hover:bg-offwhite/5 transition-colors duration-300 px-4"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: false, amount: 0.4 }}
              >
                <div className="flex items-baseline gap-4 md:gap-8">
                  <h3 className="text-4xl md:text-9xl font-display font-black text-transparent leading-none">
                    <TextHover stroke>{award.title}</TextHover>
                  </h3>
                  <span className="text-neon font-display text-2xl md:text-6xl flex items-baseline">
                    <TextHover>x</TextHover>
                    <CountUp to={award.count} />
                  </span>
                </div>
                
                <div className="mt-2 md:mt-0 flex items-center gap-4">
                  <span className="font-mono text-gray-500 hidden md:inline-block">
                    <TextHover>{`// ${award.description}`}</TextHover>
                  </span>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-black dark:border-offwhite flex items-center justify-center group-hover:bg-neon group-hover:border-neon transition-all duration-300 text-black dark:text-offwhite group-hover:text-black">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:stroke-black md:w-6 md:h-6">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        <div className="mt-8 md:mt-16 bg-black/5 dark:bg-offwhite/10 p-4 md:p-8 border border-black/20 dark:border-offwhite/20 relative overflow-hidden transition-colors duration-500">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, var(--stripe-color) 10px, var(--stripe-color) 20px)` }}></div>
            <div className="relative z-10 text-center">
                <p className="font-mono text-neon mb-1 md:mb-2 text-xs md:text-base"><TextHover>LATEST ACHIEVEMENT</TextHover></p>
                <p className="font-display text-2xl md:text-5xl uppercase"><TextHover>2025 Webby Awards Winner</TextHover></p>
                <p className="font-serif italic mt-1 md:mt-2 text-sm md:text-base"><TextHover>Best Home Page</TextHover></p>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Awards;