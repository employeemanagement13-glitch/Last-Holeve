"use client"
import { FeedbackCardProps } from '@/types/datatypes';
import React, { useCallback, useMemo, useState, useRef } from 'react'
import NextImage from '../General/NextImage';
import SliderNavigation from '../General/SliderNavigation';
import { motion, AnimatePresence, useInView } from 'framer-motion';

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedbacks, title, subtitle, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  // Safely get the current feedback item
  const currentFeedback = useMemo(() => feedbacks[currentIndex], [feedbacks, currentIndex]);

  // Function to handle transitions for prev/next buttons
  const handleTransition = useCallback((newIndex: number) => {
    if (isTransitioning || feedbacks.length <= 1) return;
    
    setIsTransitioning(true);
    
    // Short delay to allow animation to start
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsTransitioning(false);
    }, 100);
  }, [feedbacks.length, isTransitioning]);

  // Go to the previous feedback item with transition
  const goToPrev = useCallback(() => {
    const newIndex = (currentIndex - 1 + feedbacks.length) % feedbacks.length;
    handleTransition(newIndex);
  }, [currentIndex, feedbacks.length, handleTransition]);

  // Go to the next feedback item with transition
  const goToNext = useCallback(() => {
    const newIndex = (currentIndex + 1) % feedbacks.length;
    handleTransition(newIndex);
  }, [currentIndex, feedbacks.length, handleTransition]);

  // Check if feedback data is available
  if (feedbacks.length === 0) {
    return <section className="text-center py-20 text-gray-500">No feedback available.</section>;
  }

  // Animation configurations
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: "easeOut" as const 
      }
    }
  };

  const imageAnimation = {
    hidden: { opacity: 0, scale: 0.95, rotateY: -5 },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotateY: 0,
      transition: { 
        duration: 0.7, 
        ease: "easeOut" as const 
      }
    }
  };

  const slideAnimation = {
    enter: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.5, 
        ease: "easeOut" as const 
      }
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: { 
        duration: 0.3, 
        ease: "easeIn" as const 
      }
    }
  };

  return (
    <motion.section 
      ref={containerRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerAnimation}
      className={`py-12 md:py-20 bg-white ${className}`}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <motion.div 
          variants={itemAnimation}
          className="mb-12"
        >
          {/* Subtitle (e.g., "Feedbacks") */}
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-lg font-semibold mb-2 black"
          >
            {title}
          </motion.p>
          
          {/* Main Heading (e.g., "Here is prove...") */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold mb-6 leading-tight textcolor"
          >
            {subtitle}
          </motion.h2>
        </motion.div>

        {/* Main Content Area: Image and Text/Feedback Side-by-Side */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-start justify-center">

          {/* LEFT COLUMN: Image & Arrows */}
          <div className="w-full md:w-1/2 shrink-0 relative">
            {/* Image Container with AnimatePresence */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`img-${currentFeedback.id}`}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={imageAnimation}
                className="w-full"
              >
                <NextImage
                  src={currentFeedback.imageUrl}
                  alt={`Feedback by ${currentFeedback.author}`}
                  className="w-full h-auto object-cover rounded-xl shadow-lg"
                  style={{ aspectRatio: '4/3', maxHeight: '300px' }}
                />
              </motion.div>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <SliderNavigation
                onPrev={goToPrev}
                onNext={goToNext}
                disabled={feedbacks.length <= 1 || isTransitioning}
                prevLabel="Previous feedback"
                nextLabel="Next feedback"
                buttonClass='feedbackbutton'
              />
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Text Content with AnimatePresence */}
          <div className="w-full md:w-1/2">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${currentFeedback.id}`}
                initial="exit"
                animate="enter"
                exit="exit"
                variants={slideAnimation}
                className="h-full"
              >
                {/* The Feedback Quote/Text */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <p className="text-lg leading-relaxed mb-8 textcolor">
                    {currentFeedback.feedbackText}
                  </p>
                </motion.div>

                {/* Author/Source */}
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="text-lg font-bold text-gray-900 mb-6"
                >
                  — {currentFeedback.author}
                </motion.p>

                {/* Read More Link */}
                <motion.a
                  href={currentFeedback.readMoreLink}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  whileHover={{ x: 5 }}
                  className="text-lg font-semibold text-gray-900 flex items-center group transition duration-300 hover:opacity-80"
                >
                  {currentFeedback.readMoreText}
                  <motion.span
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      repeatType: "loop" as const 
                    }}
                  >
                    →
                  </motion.span>
                </motion.a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        
        {/* Dots indicator */}
        {feedbacks.length > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex justify-center mt-10 gap-2"
          >
            {feedbacks.map((_, index) => (
              <button
                key={index}
                onClick={() => handleTransition(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-[#D55900] scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to feedback ${index + 1}`}
                disabled={isTransitioning}
              />
            ))}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default FeedbackCard;