import React from 'react'
import ProjectCard from './ProjectCard';
import { ProjectSliderProps } from '@/types/datatypes';
import ParallelContent from './ParallelContent';
import { motion } from 'framer-motion';

const ProjectSlider: React.FC<ProjectSliderProps> = ({ 
  projects, 
  title, 
  subtitle, 
  className = '' 
}) => {
  // If no projects, don't render anything
  if (!projects || projects.length === 0) {
    return null;
  }
  
  // Duplicate projects array to enable seamless continuous scrolling animation
  // Only duplicate if we have enough items for a smooth animation
  const shouldDuplicate = projects.length >= 4;
  const doubledProjects = shouldDuplicate ? [...projects, ...projects] : projects;

  // Define the custom CSS keyframes for continuous right-to-left scrolling
  const animationStyle = `
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `;

  // Calculate total width needed for the animation
  const cardWidth = 250; 
  const gap = 32; // Tailwind 'gap-8'
  const totalContentWidth = (cardWidth + gap) * doubledProjects.length;
  
  // Animation duration based on number of items
  const animationDuration = shouldDuplicate ? 60 : 40;
  
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8 }}
      className={`py-12 md:py-20 ${className}`}
    >
      <style>{animationStyle}</style>

      {/* Animate the ParallelContent component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <ParallelContent title={title} subtitle={subtitle} />
      </motion.div>
      
      {/* Slider Container - Uses overflow-hidden to hide the duplicated content */}
      <div className="overflow-hidden relative mt-8 flex px-12.5">
        {/* Subtle gradient overlays for visual effect */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute left-0 top-0 bottom-0 w-16 bg--white to-transparent z-10 pointer-events-none"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-white to-transparent z-10 pointer-events-none"
        />
        
        {/* Scroll Track - Applies animation */}
        <div
          className="flex space-x-8"
          style={{
            width: `${totalContentWidth}px`, 
            animation: shouldDuplicate 
              ? `scroll ${animationDuration}s linear infinite`
              : 'none',
            paddingRight: '32px' 
          }}
        >
          {doubledProjects.map((project, index) => (
            // Ensure key is unique when duplicating the array
            <motion.div 
              key={`${project.id}-${index}`} 
              className="shrink-0"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ 
                // y: -5,
                transition: { duration: 0.3 }
              }}
            >
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Pause animation on hover - optional enhancement */}
      <style jsx>{`
        .overflow-hidden:hover div {
          animation-play-state: paused;
        }
      `}</style>
    </motion.section>
  );
};

export default ProjectSlider;