"use client";

import React, { useState } from "react";
import { FiImage, FiHeart, FiEye, FiTrash2 } from "react-icons/fi";

type PoseCardProps = {
  pose: {
    _id: string;
    name: string;
    imageUrls: string[];
    likes?: number;
  };
  onOpenView: (pose: PoseCardProps["pose"]) => void;
  onDelete: (id: string) => void;
};

export default function PoseCard({
  pose,
  onOpenView,
  onDelete,
}: PoseCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % pose.imageUrls.length,
    );
  };

  const handlePrevImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + pose.imageUrls.length) % pose.imageUrls.length,
    );
  };

  return (
    <div
      key={pose._id}
      className="bg-[#0A0A0A] border border-white/5 rounded-[1.5rem] overflow-hidden hover:border-orange-500/30 hover:shadow-[0_0_30px_rgba(234,88,12,0.1)] transition-all duration-300 group"
    >
      <div className="h-48 relative overflow-hidden bg-neutral-900 border-b border-white/5">
        <img
          src={pose.imageUrls[currentImageIndex]}
          alt={pose.name}
          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent z-10"></div>
        <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 text-xs font-bold text-white shadow-lg">
          <FiImage className="text-orange-500" /> {pose.imageUrls.length}
        </div>
        {pose.imageUrls.length > 1 && (
          <>
            <div className="absolute top-1/2 left-2 transform -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handlePrevImage}
                className="p-2 rounded-full bg-black/50 hover:bg-white/20 text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>
            <div className="absolute top-1/2 right-2 transform -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleNextImage}
                className="p-2 rounded-full bg-black/50 hover:bg-white/20 text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
      <div className="p-6 relative z-20">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-extrabold text-lg text-white group-hover:text-orange-400 transition-colors">
            {pose.name}
          </h3>
        </div>
        <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 mb-6 border-t border-white/5 pt-4">
          <span className="flex items-center gap-1.5 hover:text-red-400 transition-colors cursor-pointer">
            <FiHeart className="text-red-500" /> {pose.likes || 0} Saves
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onOpenView(pose)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-orange-500/10 border border-white/10 hover:border-orange-500/50 text-white text-sm font-bold transition-all"
          >
            <FiEye size={16} /> View
          </button>
          <button
            onClick={() => onDelete(pose._id)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/50 text-neutral-400 hover:text-red-500 transition-all"
            title="Delete Collection"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
