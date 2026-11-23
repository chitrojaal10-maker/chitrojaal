"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
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

/**
 * Reusable card component displaying a carousel of images with configurable transition animations and intervals.
 */
const CarouselCard = ({
  images,
  title,
  subtitle,
  className = "",
  textClassName = "",
  titleClassName = "",
  subtitleClassName = "",
  imageClassName = "object-cover object-top",
  onClick,
  autoScroll = true,
  intervalDuration = 2000,
  animationType = "fade",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
  }, [JSON.stringify(images)]);

  useEffect(() => {
    if (autoScroll && images && images.length > 1 && !isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, intervalDuration);

      return () => clearInterval(interval);
    }
  }, [autoScroll, images, isHovered, intervalDuration]);

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const isContain = imageClassName.includes("object-contain");
  const currentSrc =
    images && images.length > 0 ? images[currentIndex] || images[0] : null;

  const variant = animationVariants[animationType] || animationVariants.fade;

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-3xl group cursor-pointer bg-black ${className}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {currentSrc ? (
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSrc}
            initial={variant.initial}
            animate={variant.animate}
            exit={variant.exit}
            transition={variant.transition}
            className="absolute inset-0 w-full h-full"
          >
            {isContain && (
              <Image
                src={currentSrc}
                alt=""
                fill
                className="object-cover blur-2xl opacity-40 scale-110"
                aria-hidden="true"
              />
            )}
            <Image
              src={currentSrc}
              alt={`${title} - image ${currentIndex + 1}`}
              fill
              className={`${imageClassName} group-hover:scale-[1.02] transition-transform duration-700`}
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw"
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="w-full h-full bg-gray-700" />
      )}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
      <div className={`absolute bottom-0 left-0 z-30 p-6 md:p-8 ${textClassName}`}>
        <h2
          className={`text-xl sm:text-2xl md:text-3xl font-bold text-orange-400 font-poppins uppercase ${titleClassName}`}
        >
          {title}
        </h2>
        <p className={`mt-1 text-xs text-gray-200 ${subtitleClassName}`}>
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default CarouselCard;
