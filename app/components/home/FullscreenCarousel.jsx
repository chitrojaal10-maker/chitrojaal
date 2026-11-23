'use client';

import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const FullscreenCarousel = ({ images, startIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = React.useState(startIndex);

  useEffect(() => {
    // Disable body scroll when the fullscreen carousel is open
    document.body.style.overflow = 'hidden';
    // Re-enable scrolling when the component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-white/20 transition-all z-50"
          aria-label="Close fullscreen view"
        >
          <X size={32} />
        </button>

        {/* Image Display */}
        <div className="relative w-[90vw] h-[80vh] flex items-center justify-center">
            <div className="relative w-full h-full">
                {images.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`Fullscreen image ${index + 1}`}
                        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                            index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                    />
                ))}
            </div>
        </div>


        {/* Prev Button */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-2 hover:bg-white/20 transition-all"
          aria-label="Previous image"
        >
          <ChevronLeft size={40} />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-2 hover:bg-white/20 transition-all"
          aria-label="Next image"
        >
          <ChevronRight size={40} />
        </button>
      </div>
    </div>
  );
};

export default FullscreenCarousel;
