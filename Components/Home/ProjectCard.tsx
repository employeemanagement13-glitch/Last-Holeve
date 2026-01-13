import React from 'react'
import NextImage from '../General/NextImage';
import { ProjectData } from '@/types/datatypes';
import { motion } from 'framer-motion';

// --- PROJECT CARD COMPONENT ---

const ProjectCard: React.FC<ProjectData> = ({ imageUrl, title, subtitle, link, dark }) => {
    return (
        <motion.a 
            href={link}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ 
                transition: { duration: 0.3 }
            }}
            className={`block w-[90%] max-w-sm rounded-xl shrink-0 snap-center ${dark ? "bg-black" : "bg-white"}`}
            style={{ width: '320px' }}
        >
            <div className="p-4">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="overflow-hidden rounded-xl mb-4"
                >
                    <NextImage
                        src={imageUrl}
                        alt={title}
                        style={{ aspectRatio: '4/3', maxHeight: '240px' }}
                        className="w-full object-cover rounded-xl hover:scale-110 transition-transform duration-500"
                    />
                </motion.div>
                <motion.h3 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className={dark ? 'brightinsightcardtext' : 'insightcardtext'}
                >
                    {title}
                </motion.h3>
                <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="text-base text-gray-600"
                >
                    {subtitle}
                </motion.p>
            </div>
        </motion.a>
    );
};

export default ProjectCard;