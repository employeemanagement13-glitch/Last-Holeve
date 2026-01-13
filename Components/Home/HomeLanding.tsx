import React from 'react';
import HeroHeading from '../General/HeroHeading';
import SinceSection from '../General/SinceSection';
import BackgroundMedia from '../General/BackgroundMedia';
import { motion } from 'framer-motion';

const HomeLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="grow relative z-10 pt-0 pb-48 md:pt-20 lg:pt-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Heading */}
            <motion.div 
              className="md:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <HeroHeading
                text="Designing the Future, Building your Vision"
                headingclass='text-[34px] sm:text-[48px] lg:text-[56px] font-bold text-[#1A1A1A]'
              />
            </motion.div>

            {/* Right Column: Since Section */}
            <motion.div 
              className="md:col-span-1 flex justify-start md:justify-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            >
              <SinceSection
                year="Since 1989"
                bodyText="Innovative architectural solutions tailored to your dreams. Let's create something extraordinary together."
              />
            </motion.div>
          </div>
        </div>
      </main>

      {/* Background with animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <BackgroundMedia 
          mediaType="image" 
          mediaUrl='/buildinggg.jpg' 
          className="z-0" 
        />
      </motion.div>
    </div>
  );
};

export default HomeLanding;