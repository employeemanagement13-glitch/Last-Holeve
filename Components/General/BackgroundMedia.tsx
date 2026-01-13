"use client"
import React from 'react'
import CitySkyline from '../Home/CitySkyline';
import { BackgroundMediaProps } from '@/types/datatypes';

const BackgroundMedia: React.FC<BackgroundMediaProps> = ({ mediaType = 'default', mediaUrl, className = '' }) => {
  let content;

  // HomeLandinger styles remain the same
  const HomeLandingerClasses = `w-full absolute bottom-0 left-0 overflow-hidden ${className}`;
  const HomeLandingerStyle = { height: '500px' };

  switch (mediaType) {
    case 'image':
      if (mediaUrl) {
        content = (
          <img
            src={mediaUrl}
            alt="Background Visual"
            className="w-full h-fit object-cover"
            // Placeholder image if the URL fails to load
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; // prevents infinite loop
              target.src = 'https://placehold.co/1440x300/e0e0e0/333333?text=Image+Placeholder';
              console.error('Failed to load background image:', mediaUrl);
            }}
          />
        );
      }
      break;

    case 'video':
      if (mediaUrl) {
        content = (
          <video
            src={mediaUrl}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted // Muting is essential for autoplay
            playsInline
          >
            Your browser does not support the video tag.
          </video>
        );
      }
      break;

    case 'default':
    default:
      // Fallback: Render the original city skyline SVG
      content = (
        <CitySkyline />
      );
      break;
  }

  return (
    <div className={HomeLandingerClasses} style={HomeLandingerStyle}>
      {content}
    </div>
  );
};


export default BackgroundMedia
