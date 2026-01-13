"use client";
import React from "react";
import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

interface TestimonialProps {
  quote: string;
  attribution: {
    name: string;
    title: string;
    organization: string;
  };
  className?: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ 
  quote, 
  attribution, 
  className = "" 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { 
    once: true,
    amount: 0.2,
    margin: "-30px"
  });

  // Animation variants
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const lineDraw: Variants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`max-w-5xl px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="relative">
        {/* Large decorative opening quote */}
        {/* <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 0.8, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute top-0 left-0 text-7xl sm:text-8xl md:text-9xl font-bold text-gray-200 -translate-y-4"
          aria-hidden="true"
        >
          "
        </motion.div> */}

        {/* Quote container */}
        <div className="pl-12 sm:pl-16 md:pl-20 lg:pl-24 pt-4 sm:pt-6">
          {/* Main quote text */}
          <motion.p
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl textcolor font-bold leading-relaxed md:leading-relaxed lg:leading-relaxed tracking-tight"
          >
            {quote}
          </motion.p>
          
          {/* Attribution section */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.2
                }
              }
            }}
            className="mt-10 sm:mt-12 md:mt-16 pt-6 sm:pt-8 border-t border-gray-200"
          >
            {/* Em dash with line */}
            <div className="flex items-center mb-4">
              <motion.div 
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={lineDraw}
                className="w-8 sm:w-12 h-px bg-gray-400 mr-3 sm:mr-4 origin-left"
              />
              <motion.span 
                variants={fadeInLeft}
                className="text-gray-500 text-base sm:text-lg"
              >
                —
              </motion.span>
            </div>
            
            {/* Name */}
            <motion.p 
              variants={fadeInLeft}
              className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 uppercase tracking-wider mb-1"
            >
              {attribution.name}
            </motion.p>
            
            {/* Title and organization */}
            <motion.p 
              variants={fadeInLeft}
              className="text-sm sm:text-base text-gray-600 uppercase tracking-wider font-light"
            >
              {attribution.title}, {attribution.organization}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;