"use client";

import Image from "next/image";
import React, { useState } from "react";

type NextImageProps = {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Either a number (4/3) or a string "4/3" or "16/9".
   * Default: "4/3"
   */
  aspectRatio?: string | number;
  /**
   * sizes for responsive image loading. sensible default provided.
   */
  sizes?: string;
  /**
   * objectFit for the image. Default 'cover'.
   */
  objectFit?: "cover" | "contain" | "fill" | "scale-down" | "none";
  /**
   * If true, load as priority (use sparingly for above-the-fold).
   */
  priority?: boolean;
  /**
   * Optional fallback src when primary src fails.
   */
  fallbackSrc?: string;
};

const DEFAULT_FALLBACK =
  "https://placehold.co/800x600/F3F4F6/6B7280?text=Image+not+available";

/**
 * Responsive NextImage wrapper.
 *
 * Usage:
 * <NextImage src="/img.jpg" alt="..." aspectRatio="3/4" />
 */
const NextImage: React.FC<NextImageProps> = ({
  src,
  alt,
  className = "",
  style = {},
  aspectRatio = "4/3",
  sizes = "(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw",
  objectFit = "cover",
  priority = false,
  fallbackSrc = DEFAULT_FALLBACK,
}) => {
  const [hasError, setHasError] = useState(false);

  // normalize aspect ratio to CSS value: number like 4/3 or string "4/3" or "16/9"
  const aspect =
    typeof aspectRatio === "number"
      ? String(aspectRatio)
      : String(aspectRatio).includes("/")
      ? aspectRatio
      : aspectRatio;

  // wrapper styles: use CSS aspect-ratio when available to reserve height and avoid CLS
  const wrapperStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    overflow: "hidden",
    borderRadius: 12,
    // CSS aspect-ratio; fallback doesn't break if not supported
    ...(aspect ? { aspectRatio: aspect as React.CSSProperties["aspectRatio"] } : {}),
    ...style,
  };

  return (
    <div className={className} style={wrapperStyle}>
      {!hasError ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          style={{ objectFit }}
          onError={() => setHasError(true)}
        />
      ) : (
        // fallback uses a plain img so next/image won't try again;
        // keep it responsive and covering the container
        // `aria-hidden` false so screen readers still see alt text
        // style ensures it behaves same as next/image fill + objectFit
        <img
          src={fallbackSrc}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit,
            display: "block",
          }}
        />
      )}
    </div>
  );
};

export default NextImage;
