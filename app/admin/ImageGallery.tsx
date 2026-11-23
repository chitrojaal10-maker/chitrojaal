"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface ImageGalleryProps {
  images: {
    src: string;
    alt: string;
  }[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isFullScreenViewerOpen, setIsFullScreenViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const openGalleryModal = () => {
    setIsGalleryModalOpen(true);
  };

  const openFullScreenViewer = (index: number) => {
    setCurrentImageIndex(index);
    setIsFullScreenViewerOpen(true);
  };

  const closeFullScreenViewer = () => {
    setIsFullScreenViewerOpen(false);
  };

  const closeGalleryModal = () => setIsGalleryModalOpen(false);

  const showNextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]); // images.length is stable if images array is not expected to change length while component is mounted.

  const showPrevImage = useCallback(() => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
  }, [images.length]); // images.length is stable if images array is not expected to change length while component is mounted.

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullScreenViewerOpen) {
        if (e.key === "ArrowRight") showNextImage();
        else if (e.key === "ArrowLeft") showPrevImage();
        else if (e.key === "Escape") closeFullScreenViewer();
      } else if (isGalleryModalOpen) {
        if (e.key === "Escape") closeGalleryModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isGalleryModalOpen,
    isFullScreenViewerOpen,
    showNextImage,
    showPrevImage,
  ]);

  useEffect(() => {
    if (isFullScreenViewerOpen && thumbnailContainerRef.current) {
      const activeThumbnail = thumbnailContainerRef.current.children[
        currentImageIndex
      ] as HTMLElement;
      if (activeThumbnail) {
        activeThumbnail.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [currentImageIndex, isFullScreenViewerOpen]);

  return (
    <div className="relative z-10">
      <h2 className="text-xl font-bold text-white mb-4">Gallery</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="cursor-pointer group aspect-square"
            onClick={openGalleryModal}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              className="rounded-lg object-cover group-hover:opacity-75 transition-opacity"
            />
          </div>
        ))}
      </div>

      {isGalleryModalOpen && !isFullScreenViewerOpen && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-40 backdrop-blur-sm p-4 transition-opacity duration-300 animate-fadeIn">
          <div className="w-full h-full max-w-7xl mx-auto flex flex-col">
            <div className="flex justify-between items-center py-4 px-2 flex-shrink-0">
              <h2 className="text-xl font-bold text-white">Gallery</h2>
              <button
                onClick={closeGalleryModal}
                className="text-white/70 text-3xl hover:text-orange-400 transition-colors z-50"
              >
                <FiX />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="cursor-pointer group aspect-square"
                    onClick={() => openFullScreenViewer(index)}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, (max-width: 1280px) 16vw, 12.5vw"
                      className="rounded-md object-cover group-hover:opacity-75 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isFullScreenViewerOpen && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50 backdrop-blur-sm p-4 transition-opacity duration-300 animate-fadeIn">
          {/* Close Button */}
          <button
            onClick={closeFullScreenViewer}
            className="absolute top-4 right-4 text-white/70 text-3xl hover:text-orange-400 transition-colors z-50"
          >
            <FiX />
          </button>

          {/* Main Image Viewer */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Main Image */}
            <div className="relative w-full h-full">
              <Image
                key={images[currentImageIndex].src}
                src={images[currentImageIndex].src}
                alt={images[currentImageIndex].alt}
                fill
                className="object-contain animate-zoomIn"
              />
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={showPrevImage}
              className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 text-white text-3xl bg-black/30 p-2 rounded-full hover:bg-black/50 transition-colors"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={showNextImage}
              className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 text-white text-3xl bg-black/30 p-2 rounded-full hover:bg-black/50 transition-colors"
            >
              <FiChevronRight />
            </button>
          </div>

          {/* Thumbnail Gallery */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
            <div
              ref={thumbnailContainerRef}
              className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent"
            >
              {images.map((image, index) => (
                <div
                  key={image.src}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 cursor-pointer rounded-md overflow-hidden transition-all duration-300 ${currentImageIndex === index ? "ring-2 ring-orange-500 scale-105" : "opacity-60 hover:opacity-100"}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
