"use client"
import { ProjectSliderProps } from '@/types/datatypes'
import React, { useEffect, useState, useRef } from 'react'
import ProjectCard from '../Home/ProjectCard'
import ParallelContent from '../Home/ParallelContent'
import { motion, useInView, stagger } from 'framer-motion'

const ParallelCards: React.FC<ProjectSliderProps> = ({ projects, title, subtitle, className = '' }) => {
    const [dark, setdark] = useState(false);
    const containerRef = useRef<HTMLElement>(null);
    const cardsContainerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.1 });
    
    useEffect(() => {
        className.includes("darkbg") ? setdark(true) : setdark(false)
    }, [className])

    return (
        <motion.section 
            ref={containerRef}
            initial={{ opacity: 1 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className={`py-12 md:py-20 ${className}`}
        >
            {/* Animate ParallelContent */}
            <motion.div
                initial={{ opacity: 0.5, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4 }}
            >
                {className.includes("darkbg") ? 
                    <ParallelContent title={title} subtitle={subtitle} dark={dark} /> : 
                    <ParallelContent title={title} subtitle={subtitle} />
                }
            </motion.div>
            
            {/* Animated Cards Container */}
            <motion.div
                ref={cardsContainerRef}
                initial="visible"
                animate={isInView ? "visible" : "hidden"}
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.3
                        }
                    }
                }}
                className="flex flex-wrap justify-start w-[90%] mx-auto"
            >
                {projects.map((project, index) => (
                    <motion.div 
                        key={`${project.id}-${index}`} 
                        className="shrink-0 mb-6"
                        variants={{
                            hidden: { opacity: 0, y: 30, scale: 0.95 },
                            visible: { 
                                opacity: 1, 
                                y: 0, 
                                scale: 1,
                                transition: {
                                    duration: 0.5,
                                    ease: "easeOut"
                                }
                            }
                        }}
                        whileHover={{ 
                            // y: -5,
                            // scale: 1.02,
                            transition: { duration: 0.3 }
                        }}
                    >
                        <ProjectCard {...project} dark={dark} />
                    </motion.div>
                ))}
            </motion.div>
        </motion.section>
    )
}

export default ParallelCards