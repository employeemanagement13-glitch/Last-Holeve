"use client";

import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type SliderNavigationProps = {
  onPrev: () => void;
  onNext: () => void;
  disabled?: boolean;
  /**
   * Optional aria-label prefixes (accessibility)
   * Default: "Previous" / "Next"
   */
  prevLabel?: string;
  nextLabel?: string;
  className?:string;
  buttonClass?:string;
};

const SliderNavigation: React.FC<SliderNavigationProps> = ({
  onPrev,
  onNext,
  disabled = false,
  prevLabel = "Previous",
  nextLabel = "Next",
  className,
  buttonClass
}) => {
  return (
    <div className={`flex space-x-4 mt-6 ${className}`}>
      {/* Prev */}
      <button
        onClick={onPrev}
        aria-label={prevLabel}
        className={`transition duration-150 disabled:opacity-50 cursor-pointer border-2 p-3 ${buttonClass}`}
        disabled={disabled}
      >
        <ArrowLeft className={`w-6 h-6`} strokeWidth={2.5} />
      </button>

      {/* Next */}
      <button
        onClick={onNext}
        aria-label={nextLabel}
        className={`transition duration-150 disabled:opacity-50 cursor-pointer border-2 p-3 ${buttonClass}`}
        disabled={disabled}
      >
        <ArrowRight className={`w-6 h-6`} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default SliderNavigation;
