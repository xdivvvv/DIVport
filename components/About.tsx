import React from 'react';
import { motion } from 'framer-motion';
import TextHover from './TextHover';
import TextType from './TextType';

const About: React.FC = () => {
  const bioText = "I’m a self-taught visual storyteller crafting Design and Photography that hit different. I turn inner chaos into controlled visuals, building meaningful narratives through light, motion, and deliberate design choices.";

  return (
    <section id="about" className="relative bg-neon text-offwhite dark:text-black h-screen flex items-center px-6 overflow-hidden transition-colors duration-500 scroll-snap-align-start">
      {/* Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="w-full h-full" style={{ 
          backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 pt-20">
        <div className="flex items-center justify-between border-b-2 border-offwhite dark:border-black pb-4 mb-12 transition-colors duration-500">
          <h2 className="font-display text-4xl uppercase"><TextHover hoverColor="contrast">About Me</TextHover></h2>
          <span className="font-mono text-xl font-bold"><TextHover hoverColor="contrast">[002]</TextHover></span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 flex flex-col justify-center">
             <motion.div 
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: false, amount: 0.3 }}
               transition={{ duration: 0.6 }}
               className="font-display text-6xl md:text-8xl lg:text-7xl xl:text-8xl leading-[0.8] mb-8"
             >
               <div>
                  <TextHover hoverColor="contrast">DIGITAL</TextHover>
               </div>
               <div>
                  <TextHover hoverColor="contrast">ALCHEMIST</TextHover>
               </div>
             </motion.div>
             <div className="w-full h-4 bg-offwhite dark:bg-black mb-8 transition-colors duration-500" />
             <div className="font-mono text-sm border-l-2 border-offwhite dark:border-black pl-4 transition-colors duration-500">
                <p className="mb-2"><TextHover hoverColor="contrast">CURRENTLY WORKING @</TextHover></p>
                <p className="font-bold"><TextHover hoverColor="contrast">FREELANCE</TextHover></p>
             </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center font-serif text-2xl md:text-3xl lg:text-4xl leading-tight font-medium">
            <div className="relative">
              {/* Invisible placeholder to maintain height */}
              <div className="invisible whitespace-pre-wrap select-none" aria-hidden="true">
                {bioText}
              </div>
              
              {/* Absolute positioned typing text overlay */}
              <div className="absolute top-0 left-0 w-full">
                <TextType 
                  text={bioText}
                  typingSpeed={30}
                  cursorCharacter="_"
                  loop={false}
                  startOnVisible={true}
                  withHover={true}
                  hoverColor="contrast"
                  underlinedWords={['Design', 'Photography']}
                />
              </div>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 font-sans text-base font-bold tracking-wide uppercase">
              <div>
                <h3 className="border-b border-offwhite dark:border-black mb-4 pb-2 transition-colors duration-500"><TextHover hoverColor="contrast">SKILLS</TextHover></h3>
                <div className="flex flex-wrap gap-2">
                  {['Graphic Designing', 'Photography', 'Cinematography', 'Digital Art', 'Creative Direction'].map(skill => (
                    <span key={skill} className="bg-offwhite text-black hover:bg-black hover:text-neon dark:bg-black dark:text-neon dark:hover:bg-offwhite dark:hover:text-black px-3 py-1 rounded-full text-xs transition-colors cursor-default font-bold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="border-b border-offwhite dark:border-black mb-4 pb-2 transition-colors duration-500 uppercase"><TextHover hoverColor="contrast">Tools</TextHover></h3>
                <div className="flex flex-wrap gap-2">
                  {['Photoshop', 'Premiere Pro', 'After Effects', 'Lightroom', 'Sketchbook'].map(tag => (
                    <span key={tag} className="bg-offwhite text-black hover:bg-black hover:text-neon dark:bg-black dark:text-neon dark:hover:bg-offwhite dark:hover:text-black px-3 py-1 rounded-full text-xs transition-colors cursor-default font-bold">
                      {tag.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;