"use client"
import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// --- INTERFACES ---

interface BaseComponentProps {
  className?: string;
}

// --- INTRO SECTION COMPONENT ---

const IntroSectionMinimal: React.FC<BaseComponentProps> = () => {
    // Placeholder image URL
    const imageUrl = '/Home.jpg';

    return (
        <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.1 }}
            className="min-h-screen flex items-center justify-center p-4 sm:p-8"
        >
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Card-like container */}
                <div className="rounded-2xl p-6 md:p-10 lg:p-16">
                    {/* Responsive two-column layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                        
                        {/* 1. Image Column with simple fade-in */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.2 }}
                            className="w-full overflow-hidden rounded-xl"
                        >
                            <Image
                                src={imageUrl}
                                alt="Modern building with a large tree in the center"
                                height={500}
                                width={500}
                                className="w-full h-auto object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-500"
                                style={{ aspectRatio: '4/3', maxHeight: '450px' }} 
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = '';
                                }}
                            />
                        </motion.div>

                        {/* 2. Text and Stats Column */}
                        <div>
                            {/* Descriptive Text with fade-in animation */}
                            <motion.p 
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3 }}
                                className="text-xl textcolor font-medium leading-relaxed mb-12"
                            >
                                We design building, interior landscapes and sky scrapers. We have 100+ professional on staff offices in different states of US, UK and also in middle east.
                            </motion.p>

                            {/* Stats and CTA Row */}
                            <div className="flex items-center space-x-8 sm:space-x-12">
                                
                                {/* Stat 1: 460+ Awesome Project */}
                                <div className="flex flex-col">
                                    <motion.h2 
                                        className="showcase"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1, type: "spring", stiffness: 150 }}
                                    >
                                        460+
                                    </motion.h2>
                                    <motion.p 
                                        className="showcasetext"
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        Awesome Project
                                    </motion.p>
                                </div>

                                {/* Stat 2: 100+ Best Engineers */}
                                <div className="flex flex-col">
                                    <motion.h2 
                                        className="showcase"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                                    >
                                        100+
                                    </motion.h2>
                                    <motion.p 
                                        className="showcasetext"
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        Best Engineers
                                    </motion.p>
                                </div>

                                {/* CTA Arrow Button with spring animation */}
                                <motion.a
                                    href="/work"
                                    className="buttonbg p-4 rounded-full"
                                    aria-label="Learn more about our projects"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                                >
                                    <ArrowUpRight className="w-8 h-8 text-white" strokeWidth={3} />
                                </motion.a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

// --- APP COMPONENT ---

const Showcase: React.FC = () => {
    return (
        <div className="font-sans">
            <IntroSectionMinimal />
        </div>
    );
};

export default Showcase;