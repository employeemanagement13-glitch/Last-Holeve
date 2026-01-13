import { SinceSectionProps } from '@/types/datatypes';
import React from 'react'

const SinceSection: React.FC<SinceSectionProps> = ({ year, bodyText, className = '' }) => {
  return (
    <div className={`mt-8 max-md:mt-0 md:mt-0 md:max-w-sm ${className}`}>
      <p className="text-xl headingcolor mb-4">
        ~ {year}
      </p>
      <p className="text-base subtext leading-relaxed">
        {bodyText}
      </p>
    </div>
  );
};


export default SinceSection
