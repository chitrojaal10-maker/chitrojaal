'use client';

import React from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

const ImageGallery = ({ images, title, onClose, onImageClick }) => {
  return (
    <div className="fixed inset-0 bg-black/90 z-40 flex items-center justify-center backdrop-blur-sm">
      <div className="relative w-[95vw] h-[95vh] bg-slate-900/80 border border-slate-700 rounded-2xl p-4 md:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-white bg-black/50 rounded-full p-2 hover:bg-white/20 transition-all z-50"
            aria-label="Close gallery"
          >
            <X size={24} />
          </button>
        </div>

        {/* Image Grid */}
        <div className="h-[calc(100%-4rem)] overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map((src, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => onImageClick(index)}
              >
                <Image
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
