import React, { useState } from 'react';
import { PROJECTS } from '../constants';
import FlowingMenu from './FlowingMenu';
import { motion, AnimatePresence } from 'framer-motion';
import TextHover from './TextHover';
import { X } from 'lucide-react';

const Work: React.FC = () => {
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);

  // Format projects for the FlowingMenu
  const menuItems = PROJECTS.map(project => ({
    link: '#', 
    text: project.title,
    image: project.image
  }));

  const selectedProject = selectedProjectIndex !== null ? PROJECTS[selectedProjectIndex] : null;

  return (
    <section id="work" className="relative h-screen transition-colors duration-500 overflow-hidden flex flex-col scroll-snap-align-start pt-24">
      <div className="text-center z-10 relative mb-4 flex-shrink-0">
        <h2 className="font-display text-[10vw] leading-[0.8] uppercase font-black text-black dark:text-offwhite select-none">
             <TextHover>WORK</TextHover>
        </h2>
      </div>

      <motion.div 
         initial={{ opacity: 0 }}
         whileInView={{ opacity: 1 }}
         transition={{ duration: 1 }}
         className="w-full flex-grow flex items-center justify-center px-4 md:px-12 pb-12 pt-4 relative z-0 overflow-hidden"
      >
         <div className="w-full h-full">
            <FlowingMenu items={menuItems} onItemClick={setSelectedProjectIndex} />
         </div>
      </motion.div>

      {/* Full Screen Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-offwhite dark:bg-offblack flex flex-col md:flex-row"
          >
             {/* Close Button */}
             <button 
                onClick={() => setSelectedProjectIndex(null)}
                className="absolute top-6 right-6 z-50 p-2 rounded-full bg-neon text-offwhite hover:scale-110 transition-transform cursor-pointer"
             >
                <X size={32} />
             </button>

             {/* Image Section */}
             <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden group">
                <motion.img 
                    layoutId={`project-image-${selectedProject.id}`}
                    src={selectedProject.image} 
                    alt={selectedProject.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                
                {/* ID Badge */}
                <div className="absolute top-6 left-6 bg-black/50 backdrop-blur text-white px-4 py-2 font-mono text-sm border border-white/20">
                  {selectedProject.id}
                </div>
             </div>
             
             {/* Details Section */}
             <div className="w-full md:w-1/2 h-1/2 md:h-full p-6 md:p-16 flex flex-col justify-center bg-offwhite dark:bg-offblack text-black dark:text-offwhite relative">
                 {/* Background Grid */}
                 <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" style={{ 
                      backgroundImage: `linear-gradient(#888 1px, transparent 1px), linear-gradient(90deg, #888 1px, transparent 1px)`, 
                      backgroundSize: '40px 40px' 
                 }}></div>

                <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2, duration: 0.5 }}
                   className="relative z-10"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <span className="font-mono text-neon tracking-widest text-sm md:text-base">{selectedProject.code}</span>
                        <div className="h-[1px] bg-neon w-12"></div>
                    </div>
                    
                    <h2 className="font-display text-5xl md:text-8xl leading-[0.8] mb-6 uppercase break-words">
                        {selectedProject.title}
                    </h2>
                    
                    <div className="font-mono text-lg md:text-xl mb-8 border-l-4 border-neon pl-4 opacity-80">
                        {selectedProject.category}
                    </div>
                    
                    <p className="font-serif text-base md:text-lg opacity-70 mb-10 max-w-md leading-relaxed">
                        A digital exploration of form and function. This project represents a deep dive into user experience and visual storytelling, pushing the boundaries of what is possible on the web.
                    </p>
                    
                    <div className="flex gap-4">
                        <a href="#" className="px-8 py-4 bg-black dark:bg-offwhite text-offwhite dark:text-black font-bold uppercase hover:bg-neon hover:text-white transition-all tracking-wider text-sm md:text-base">
                            View Case Study
                        </a>
                    </div>
                </motion.div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Work;