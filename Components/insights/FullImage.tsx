"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

/* ================= TYPES ================= */

interface WorkInfo {
    client: string;
    size: string;
    cmpdate: string;
    sustainability: string;
}

interface SocialsImage {
    image: string;
    link: string;
    platform?: string;
}

interface ImageContentBlockProps {
    imageSrc: string;
    heading?: string;
    paragraph?: string;
    socials?: boolean;
    work?: boolean;
    wrapperClass?: string;
    headingClass?: string;
    paragraphClass?: string;
    contentClass?: string;
    workdata?: WorkInfo;
    bg?: string;
    socialImages?: SocialsImage[];
}

interface SocialsBarProps {
    color?: string;
    socialImages?: SocialsImage[];
}

/* ================= SUB COMPONENTS ================= */

const SocialsBar = ({ color, socialImages }: SocialsBarProps) => {
    if (!socialImages || socialImages.length === 0) {
        return null;
    }

    return (
        <div className="flex space-x-4 pt-8 border-t border-neutral-700 mt-8">
            <h4 className={`text-lg font-semibold ${color} mt-0`}>Connect:</h4>
            <div className="flex space-x-6 text-neutral-400">
                {socialImages.map((social, index) => (
                    <Link 
                        href={social.link} 
                        key={index} 
                        aria-label={social.platform || "Social link"}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="rounded-full overflow-hidden"
                        >
                            <Image 
                                src={social.image} 
                                height={40} 
                                width={40} 
                                className="rounded-full"
                                alt={social.platform || "Social icon"}
                            />
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

const WorkDetails: React.FC<{ data: WorkInfo }> = ({ data }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.3 });

    const workItems = [
        { key: "client", label: "Client", value: data.client },
        { key: "size", label: "Size", value: data.size },
        { key: "cmpdate", label: "Completion", value: data.cmpdate },
        { key: "sustainability", label: "Sustainability", value: data.sustainability }
    ];

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="pt-8 mt-8 flex flex-col gap-6 w-full lg:w-1/2"
        >
            {workItems.map((item, index) => (
                <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex flex-col sm:flex-row gap-2 sm:gap-5 w-full"
                >
                    <p className="workdatahead">
                        {item.label}
                    </p>
                    <p className="textcolor font-medium">{item.value}</p>
                </motion.div>
            ))}
        </motion.div>
    );
};

/* ================= MAIN COMPONENT ================= */

export const ImageContentBlock: React.FC<ImageContentBlockProps> = ({
    imageSrc,
    heading = "",
    paragraph,
    socials = false,
    work = false,
    wrapperClass = "w-full mx-auto",
    headingClass = "text-4xl font-bold mb-4",
    paragraphClass = "text-xl font-light text-neutral-300 leading-relaxed",
    contentClass = "",
    workdata,
    bg,
    socialImages
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { 
        once: true,
        amount: 0.2,
        margin: "-50px"
    });

    // Animation variants with proper TypeScript types
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const imageVariants: Variants = {
        hidden: { opacity: 0, scale: 0.98 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    const contentVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
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
            className={`text-white font-sans ${wrapperClass} ${bg}`}
        >
            {/* Image */}
            <motion.div 
                variants={imageVariants}
                className="mb-8 max-md:mb-2 overflow-hidden shadow-2xl"
            >
                <Image
                    src={imageSrc}
                    width={1000}
                    height={1000}
                    alt="Content illustration"
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            "https://placehold.co/1200x600/1F2937/FFFFFF?text=Image+Missing";
                    }}
                />
            </motion.div>

            <div className="flex flex-col lg:flex-row w-[90%] mx-auto mt-20 max-md:mt-5 justify-center gap-8 lg:gap-16 items-start">
                {/* Text Content */}
                <motion.div 
                    variants={contentVariants}
                    className={`w-full ${contentClass}`}
                >
                    {heading && (
                        <motion.h2 
                            initial={{ opacity: 0, y: 10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className={`${headingClass} text-3xl sm:text-4xl`}
                        >
                            {heading}
                        </motion.h2>
                    )}
                    
                    {paragraph && (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className={`mt-10 ${paragraphClass}`}
                        >
                            {paragraph}
                        </motion.p>
                    )}
                    
                    {socials && socialImages && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            <SocialsBar color={paragraphClass} socialImages={socialImages} />
                        </motion.div>
                    )}
                </motion.div>

                {/* Work Info */}
                {work && workdata && <WorkDetails data={workdata} />}
            </div>
        </motion.div>
    );
};