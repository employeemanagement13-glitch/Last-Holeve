"use client";

import { images } from "@/lib/data";
import Image from "next/image";
/* ---------- Image Wrapper ---------- */
const NextImage = ({ src, alt }: { src: string; alt: string }) => (
  <Image
    src={src}
    alt={alt}
    fill
    className="object-cover rounded-xl shadow-lg"
    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 33vw, 25vw"
  />
);

/* ---------- Main Component ---------- */
export default function Culture() {


  return (
    <section className="py-20 bg-white">
      <div className="mx-auto w-[90%]">

        {/* ================= DESKTOP GRID ================= */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-6 h-150">

          {/* LEFT PORTRAIT (spans both rows) */}
          <div className="relative row-span-2 rounded-xl overflow-hidden">
            <NextImage src={images[0].src} alt={images[0].alt} />
          </div>

          {/* TOP ROW - 3 images in columns 2-4 */}
          <div className="col-span-3 grid grid-cols-3 gap-6">
            {images.slice(1, 4).map((img) => (
              <div
                key={img.id}
                className="relative rounded-xl overflow-hidden"
              >
                <NextImage src={img.src} alt={img.alt} />
              </div>
            ))}
          </div>

          {/* BOTTOM ROW - Big image and small image */}
          <div className="col-span-2 relative rounded-xl overflow-hidden">
            <NextImage src={images[4].src} alt={images[4].alt} />
          </div>

          <div className="relative rounded-xl overflow-hidden">
            <NextImage src={images[5].src} alt={images[5].alt} />
          </div>
        </div>

        {/* ================= MOBILE ================= */}
        <div className="md:hidden space-y-6">
          <div className="relative aspect-3/4 rounded-xl overflow-hidden">
            <NextImage src={images[0].src} alt={images[0].alt} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {images.slice(1, 5).map((img) => (
              <div
                key={img.id}
                className="relative aspect-4/3 rounded-xl overflow-hidden"
              >
                <NextImage src={img.src} alt={img.alt} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {images.slice(5).map((img) => (
              <div
                key={img.id}
                className="relative aspect-4/3 rounded-xl overflow-hidden"
              >
                <NextImage src={img.src} alt={img.alt} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}