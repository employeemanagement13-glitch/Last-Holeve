"use client";
import React from "react";
import Image from "next/image";

interface SayHelloProps {
  data: {
    name: string;
    location: string;
    phoneNumber: string;
  };
  imageUrl: string;
  imageAlt?: string;
  className?: string;
  imagePosition?: 'left' | 'right';
}

const SayHello: React.FC<SayHelloProps> = ({ 
  data, 
  imageUrl, 
  imageAlt = "Contact illustration",
  className = "",
  imagePosition = 'right'
}) => {
  return (
    <div className={`font-sans ${className}`}>
      <div className={`flex flex-col ${imagePosition === 'left' ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-16 items-center`}>
        {/* Image Section */}
        <div className="lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-lg mx-auto">
            <Image
              src={imageUrl}
              alt={imageAlt}
              width={600}
              height={400}
              className="w-[80%] h-auto rounded-lg shadow-lg object-cover"
              style={{ width: '80%' }}
              priority
            />
          </div>
        </div>
        
        {/* Text Content */}
        <div className="lg:w-1/2">
          <h1 className="parallelheading textcolor underline">
            {data.name}
          </h1>
          
          <div className="mt-8 space-y-2">
            {data.location.split('\n').map((line, index) => (
              <p 
                key={index} 
                className="paralleltext textcolor leading-relaxed"
              >
                {line}
              </p>
            ))}
          <p className="paralleltext textcolor">
            {data.phoneNumber}
          </p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SayHello;