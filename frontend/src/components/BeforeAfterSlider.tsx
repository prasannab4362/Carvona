"use client";

import React, { useState, useRef, useEffect, MouseEvent, TouchEvent } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function BeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto slide animation on mount to demo the comparison interactivity
  useEffect(() => {
    if (hasInteracted) return;

    const delay = setTimeout(() => {
      let step = 0;
      const interval = setInterval(() => {
        if (hasInteracted) {
          clearInterval(interval);
          return;
        }

        step += 1;
        if (step <= 15) {
          // Slide left to 35%
          setSliderPos((prev) => prev - 1);
        } else if (step <= 45) {
          // Slide right to 65%
          setSliderPos((prev) => prev + 1);
        } else if (step <= 60) {
          // Slide back to 50%
          setSliderPos((prev) => prev - 1);
        } else {
          clearInterval(interval);
        }
      }, 25);

      return () => clearInterval(interval);
    }, 800);

    return () => clearTimeout(delay);
  }, [hasInteracted]);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    setHasInteracted(true);
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    handleMove(e.clientX);
  };

  // Image source urls - Indian SUV (Original and Processed)
  const originalUrl = "/sample-suv.png";
  const processedUrl = "/sample-suv-processed.png";

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-center px-2">
        <div>
          <h3 className="text-xl font-bold text-text-main">Visual Comparison</h3>
          <p className="text-sm text-text-muted">Drag the slider to see the AI result</p>
        </div>
        <div className="flex gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1 text-text-muted">
            <EyeOff size={14} /> Before (Original)
          </span>
          <span className="flex items-center gap-1 text-primary">
            <Eye size={14} /> After (Carvona AI)
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseDown={handleMouseDown}
        className="relative w-full h-[350px] md:h-[450px] rounded-3xl overflow-hidden cursor-ew-resize border border-border-light select-none shadow-ambient"
      >
        {/* BEFORE: Original Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={originalUrl}
            alt="Original car"
            className="w-full h-full object-cover"
            draggable="false"
          />
        </div>

        {/* AFTER: Replaced Image (clipped by slider position) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)` }}
        >
          <img
            src={processedUrl}
            alt="Processed car"
            className="w-full h-full object-cover"
            draggable="false"
          />
        </div>

        {/* Divider line & handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-2 border-primary shadow-md flex items-center justify-center text-primary font-bold text-sm pointer-events-none hover:scale-115 transition-transform">
            ↔
          </div>
        </div>
      </div>
    </div>
  );
}
