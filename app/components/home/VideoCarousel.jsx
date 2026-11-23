"use client";
import React, { useState } from "react";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";

const VideoCarousel = ({ videoData = [] }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState({ isOpen: false, video: null });

  const currentVideo = videoData[currentVideoIndex];

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoData.length);
  };

  const handlePrevVideo = () => {
    setCurrentVideoIndex(
      (prevIndex) => (prevIndex - 1 + videoData.length) % videoData.length,
    );
  };

  const openFullscreen = (video) => {
    setFullscreen({ isOpen: true, video });
  };

  const closeFullscreen = () => {
    setFullscreen({ isOpen: false, video: null });
  };

  const handleFullscreenNext = () => {
    const currentIndex = videoData.findIndex(
      (v) => v.id === fullscreen.video.id,
    );
    const nextIndex = (currentIndex + 1) % videoData.length;
    setFullscreen({ isOpen: true, video: videoData[nextIndex] });
  };

  const handleFullscreenPrev = () => {
    const currentIndex = videoData.findIndex(
      (v) => v.id === fullscreen.video.id,
    );
    const prevIndex = (currentIndex - 1 + videoData.length) % videoData.length;
    setFullscreen({ isOpen: true, video: videoData[prevIndex] });
  };

  return (
    <>
      <section className="py-24 bg-[#0A0A0A] relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              আমাদের এক্সপার্টাইজ ইন মোশন
            </h2>
            <p className="text-gray-400 text-lg">
              সিনেমাটিক ফিল্মের মাধ্যমে আপনার গল্পগুলি জীবন্ত করে তোলা।
            </p>
          </div>

          <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
            <img
              src={currentVideo.thumbnail || "/why_us.jpg"}
              alt={currentVideo.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6">
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                {currentVideo.title}
              </h3>
              <p className="text-gray-300">{currentVideo.description}</p>
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => openFullscreen(currentVideo)}
            >
              <Play size={64} className="text-white" />
            </div>

            {/* Navigation buttons */}
            <button
              onClick={handlePrevVideo}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNextVideo}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {fullscreen.isOpen && fullscreen.video && (
        <FullscreenVideoPlayer
          video={fullscreen.video}
          onClose={closeFullscreen}
          onNext={handleFullscreenNext}
          onPrev={handleFullscreenPrev}
        />
      )}
    </>
  );
};

const FullscreenVideoPlayer = ({ video, onClose, onNext, onPrev }) => {
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-4xl aspect-video">
        {video.localSrc ? (
          <video
            src={video.localSrc}
            poster={video.thumbnail || undefined}
            className="w-full h-full object-cover"
            controls
            autoPlay
            muted
            playsInline
          ></video>
        ) : video.facebookSrc ? (
          <iframe
            src={video.facebookSrc}
            className="w-full h-full"
            style={{ border: "none", overflow: "hidden" }}
            scrolling="no"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen={true}
          ></iframe>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black text-white text-center p-4">
            <p>
              ভিডিও লোড করা যায়নি। অনুগ্রহ করে পরবর্তী আপডেটের জন্য অপেক্ষা
              করুন বা ফেসবুক লিঙ্কটি খুলুন।
            </p>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="text-white bg-black/50 rounded-full p-2 z-10"
          >
            <X size={32} />
          </button>
        </div>
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <button
            onClick={onPrev}
            className="text-white bg-black/50 rounded-full p-2 z-10"
          >
            <ChevronLeft size={48} />
          </button>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <button
            onClick={onNext}
            className="text-white bg-black/50 rounded-full p-2 z-10"
          >
            <ChevronRight size={48} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCarousel;
