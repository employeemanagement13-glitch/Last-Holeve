"use client"
import { HeroHeadingProps } from '@/types/datatypes';
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const HeroHeading: React.FC<HeroHeadingProps> = ({ 
  text, 
  date, 
  belongsto, 
  paragraph, 
  headingclass, 
  paraClass, 
  className = '' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { 
    once: true,
    amount: 0.3,
    margin: "-50px"
  });

  // Animation variants with explicit Variants type
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const childVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: custom * 0.1,
        ease: "easeOut"
      }
    })
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.3,
        ease: "easeOut"
      }
    }
  };

  const paragraphVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {/* Meta info container */}
      <div className="flex flex-col xs:flex-row flex-wrap items-start xs:items-center justify-start gap-2 xs:gap-4 sm:gap-6 md:gap-8 mb-3 xs:mb-4 sm:mb-5">
        {belongsto && (
          <motion.span
            custom={0}
            variants={childVariants}
            className="text-xs xs:text-sm sm:text-base md:text-lg tracking-wider xs:tracking-widest uppercase font-medium text-yellow-600 whitespace-nowrap"
          >
            {belongsto}
          </motion.span>
        )}
        {date && (
          <motion.span
            custom={1}
            variants={childVariants}
            className="text-xs xs:text-sm sm:text-base md:text-lg tracking-wider xs:tracking-widest uppercase font-medium text-yellow-600 whitespace-nowrap"
          >
            {date}
          </motion.span>
        )}
      </div>
      
      {/* Main heading */}
      <motion.h1
        variants={textVariants}
        className={`font-bold leading-tight wrap-break-word hyphens-auto ${headingclass}`}
        style={{ wordBreak: 'keep-all' }}
      >
        {text}
      </motion.h1>
      
      {/* Paragraph */}
      {paragraph && (
        <motion.p
          variants={paragraphVariants}
          className={`
            font-light leading-snug xs:leading-tight
            text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl
            mt-4 xs:mt-5 sm:mt-6 md:mt-8 lg:mt-10
            mb-4 xs:mb-5 sm:mb-6 md:mb-8
            max-w-4xl lg:max-w-5xl xl:max-w-6xl
            ${paraClass}`
          }
        >
          {paragraph}
        </motion.p>
      )}
    </motion.div>
  );
};

export default HeroHeading;