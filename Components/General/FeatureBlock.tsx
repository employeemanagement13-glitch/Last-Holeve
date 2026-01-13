"use client";

import { FeatureBlockProps } from "@/types/datatypes";
import React, { useRef } from "react";
import NextImage from "./NextImage";
import { motion, useInView } from "framer-motion";

const FeatureBlock: React.FC<FeatureBlockProps> = ({
  title,
  imageUrl,
  imageAlt,
  subheading,
  paragraph,
  readMoreLink,
  readMoreText = "Read here",
  layout,
  bright,
  className = "",
  imageinfo
}) => {
  const isBright = bright;
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  const bgColor = isBright ? "brightbg" : "darkbg";
  const textColor = isBright ? "textcolor" : "darktext";
  const subtextColor = isBright ? "black" : "white";

  // Desktop-only direction switch
  const desktopDirection =
    layout === "right" ? "md:flex-row-reverse" : "md:flex-row";

  return (
    <motion.section 
      ref={containerRef}
      initial={{ opacity: 1 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <div className="w-full">
        <div className={`${bgColor} p-6 md:p-10 lg:p-16`}>
          {/* MAIN WRAPPER */}
          <div
            className={`
              mx-auto w-[90%]
              flex flex-col
              ${desktopDirection}
              gap-10 md:gap-16
              items-center
            `}
          >
            {/* IMAGE COLUMN */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7 }}
              className="w-full md:w-1/2 flex justify-center"
            >
              <div className="w-full max-w-130">
                <NextImage
                  src={imageUrl}
                  alt={imageAlt}
                  className="w-full h-auto rounded-xl transition-transform duration-500"
                  style={{
                    aspectRatio: "4/3",
                    maxHeight: "450px",
                  }}
                />
                {imageinfo && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 }}
                    className="text-sm font-semibold mt-2 text-[#000000] max-w-full"
                  >
                    {imageinfo}
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* TEXT COLUMN */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="w-full md:w-1/2"
            >
              {subheading && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 }}
                  className={`text-lg font-semibold mb-2 ${subtextColor}`}
                >
                  {subheading}
                </motion.p>
              )}

              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
                className={`text-3xl sm:text-4xl font-bold mb-6 leading-tight ${textColor}`}
              >
                {title}
              </motion.h2>

              {paragraph && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7 }}
                  className={`text-lg leading-relaxed mb-8 ${textColor}`}
                >
                  {paragraph}
                </motion.p>
              )}

              {readMoreLink && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5 }}
                  className="flex items-center space-x-2"
                >
                  <a
                    href={readMoreLink}
                    className={`text-lg font-semibold transition duration-300 hover:opacity-95 ${textColor} hover:underline`}
                  >
                    {readMoreText}
                  </a>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default FeatureBlock;