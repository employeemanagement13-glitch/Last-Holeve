"use client";
import React, { useState } from "react";
import NextImage from "../General/NextImage";
import SliderNavigation from "../General/SliderNavigation";
import { INSIGHTS_DATA } from "@/lib/data";
const InsightsHeader = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentInsight = INSIGHTS_DATA[currentIndex];
    const totalInsights = INSIGHTS_DATA.length;

    const goToPrev = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? totalInsights - 1 : prev - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prev) =>
            prev === totalInsights - 1 ? 0 : prev + 1
        );
    };

    const formatIndex = (index: number) =>
        (index + 1).toString().padStart(2, "0");
    return (
        <section className="bg-black text-white py-16 md:py-24 font-sans min-h-screen flex items-center">
            <style>{`
        @keyframes slideFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-fade-in {
          animation: slideFadeIn 0.5s ease-out forwards;
        }
      `}</style>

            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                    key={currentInsight.id}
                    className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center animate-slide-fade-in"
                >
                    {/* Left: Image + Pagination */}
                    <div className="relative">
                        <NextImage
                            src={currentInsight.imageSrc}
                            alt="Building exterior"
                            aspectRatio="3.2/4"
                            className="w-full shadow-xl rounded-lg"
                            priority={currentIndex === 0}
                            fallbackSrc="https://placehold.co/600x800/262626/A3A3A3?text=Image+Load+Error"
                        />

                        {/* Pagination */}
                        <div className="absolute bottom-6 left-6">
                            <div className="text-xl font-light opacity-80">
                                {formatIndex(currentIndex)} / {formatIndex(totalInsights)}
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="md:pt-16 lg:pt-0">
                        <span className="text-sm tracking-widest uppercase font-medium text-yellow-500 mb-3 block">
                            {currentInsight.tag}
                        </span>

                        <h1 className="darkmainheading">
                            {currentInsight.headline}
                        </h1>

                            <SliderNavigation
                                onPrev={goToPrev}
                                onNext={goToNext}
                                disabled={INSIGHTS_DATA.length <= 1}
                                prevLabel="Previous feedback"
                                nextLabel="Next feedback"
                                className="justify-end w-full"
                                buttonClass="darkarrowkbutton"
                            />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InsightsHeader;
