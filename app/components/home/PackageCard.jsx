"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const animationVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 1.0, ease: "easeInOut" },
  },
  zoom: {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.08 },
    transition: { duration: 1.0, ease: [0.25, 1, 0.5, 1] },
  },
  slide: {
    initial: { opacity: 0, x: 45 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -45 },
    transition: { duration: 0.9, ease: [0.25, 1, 0.5, 1] },
  },
  slideUp: {
    initial: { opacity: 0, y: 35 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -35 },
    transition: { duration: 0.9, ease: [0.25, 1, 0.5, 1] },
  },
  blur: {
    initial: { opacity: 0, filter: "blur(12px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(12px)" },
    transition: { duration: 1.0, ease: "easeInOut" },
  },
};

const PackageCard = ({
  packageImages = [],
  onClick,
  autoScroll = true,
  intervalDuration = 2000,
  animationType = "zoom",
  imageClassName = "object-cover object-top",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (autoScroll && packageImages && packageImages.length > 1 && !isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % packageImages.length);
      }, intervalDuration);

      return () => clearInterval(interval);
    }
  }, [autoScroll, packageImages, isHovered, intervalDuration]);

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === 0 ? packageImages.length - 1 : prev - 1,
    );
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === packageImages.length - 1 ? 0 : prev + 1,
    );
  };

  const handleDotClick = (e, index) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(currentIndex);
    }
  };

  if (packageImages.length === 0) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center rounded-3xl overflow-hidden bg-slate-900/90 border border-slate-800 shadow-2xl p-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          Packages Coming Soon
        </h3>
        <p className="text-slate-400">
          New and exciting packages will be available shortly.
        </p>
      </div>
    );
  }

  const currentSrc = packageImages[currentIndex] || packageImages[0];
  const variant = animationVariants[animationType] || animationVariants.zoom;

  return (
    <div
      className="relative w-full h-full group cursor-pointer overflow-hidden rounded-3xl bg-black"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Slider Container with configurable animation transition */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentSrc}
          initial={variant.initial}
          animate={variant.animate}
          exit={variant.exit}
          transition={variant.transition}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={currentSrc}
            alt={`Package image ${currentIndex + 1}`}
            fill
            className={`${imageClassName} group-hover:scale-[1.02] transition-transform duration-700`}
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw"
            priority={currentIndex === 0}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Floating Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/50 text-white hover:bg-orange-500/80 border border-white/10 shadow-xl transition-all duration-300 active:scale-90 opacity-0 group-hover:opacity-100"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Floating Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/50 text-white hover:bg-orange-500/80 border border-white/10 shadow-xl transition-all duration-300 active:scale-90 opacity-0 group-hover:opacity-100"
        aria-label="Next Slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex justify-center items-center gap-2">
        {packageImages.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => handleDotClick(e, idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === idx ? "w-6 bg-orange-500" : "w-2 bg-white/50"
            }`}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PackageCard;
