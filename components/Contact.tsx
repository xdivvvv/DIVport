import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TextHover from './TextHover';

const Contact: React.FC = () => {
  const [time, setTime] = useState<string>('00:00 AM');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      setTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer id="contact" className="bg-neon text-offwhite dark:text-black h-screen flex flex-col justify-between px-6 relative overflow-hidden transition-colors duration-500 scroll-snap-align-start">
        
        {/* Animated Background SVG */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-0 opacity-20">
             <svg className="block w-full h-32 md:h-64" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-offwhite dark:fill-black transition-colors duration-500"></path>
            </svg>
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
          <div className="w-full h-full" style={{ 
            backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto flex-grow flex flex-col items-center justify-center text-center relative z-10 pt-32">
            <p className="font-mono text-lg mb-8 uppercase tracking-widest border border-offwhite dark:border-black transition-colors duration-500 px-4 py-1 rounded-full">
                <TextHover hoverColor="contrast">Project in mind?</TextHover>
            </p>
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                whileInView={{ scale: 1, opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="text-[12vw] font-display font-black uppercase leading-[0.8] mb-12 cursor-pointer"
            >
                <TextHover hoverColor="contrast">LET'S ROCK</TextHover>
            </motion.div>

            <a 
                href="mailto:hello@dc.des" 
                className="text-2xl md:text-4xl font-serif italic border-b-2 border-offwhite dark:border-black hover:text-black dark:hover:text-offwhite hover:border-black dark:hover:border-offwhite transition-colors duration-300 pb-1"
            >
                <TextHover hoverColor="contrast">hello@dc.des</TextHover>
            </a>
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-offwhite dark:border-black transition-colors duration-500 pt-8 items-end">
                <div className="font-mono text-sm">
                    <p><TextHover hoverColor="contrast">© 2025 DC.DES</TextHover></p>
                    <p><TextHover hoverColor="contrast">ALL RIGHTS RESERVED</TextHover></p>
                </div>

                <div className="flex justify-center gap-4 md:gap-8 flex-wrap">
                     {['TWITTER', 'LINKEDIN', 'GITHUB', 'INSTAGRAM'].map((social) => (
                         <a key={social} href="#" className="font-bold hover:underline decoration-2 underline-offset-4 text-xs md:text-base">
                            <TextHover hoverColor="contrast">{social}</TextHover>
                         </a>
                     ))}
                </div>

                <div className="text-right font-mono text-xs hidden md:block">
                     <p><TextHover hoverColor="contrast">LOCAL TIME</TextHover></p>
                     <p className="text-xl font-bold"><TextHover hoverColor="contrast">{time}</TextHover></p>
                </div>
            </div>
        </div>
    </footer>
  );
};

export default Contact;