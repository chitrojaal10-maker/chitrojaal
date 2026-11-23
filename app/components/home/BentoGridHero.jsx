"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import CarouselCard from "./CarouselCard";
import PackageCard from "./PackageCard";
import FullscreenCarousel from "./FullscreenCarousel";
import ImageGallery from "./ImageGallery";

const BentoGridHero = ({ carouselData, packageImages, bentoSettings }) => {
  const [fullscreen, setFullscreen] = useState({
    isOpen: false,
    images: [],
    startIndex: 0,
  });
  const [gallery, setGallery] = useState({
    isOpen: false,
    images: [],
    title: "",
  });

  const openFullscreen = (images, startIndex) => {
    setFullscreen({ isOpen: true, images, startIndex });
  };

  const closeFullscreen = () => {
    setFullscreen({ isOpen: false, images: [], startIndex: 0 });
  };

  const openGallery = (images, title) => {
    setGallery({ isOpen: true, images, title });
  };

  const closeGallery = () => {
    setGallery({ isOpen: false, images: [], title: "" });
  };

  const handleImageClickInGallery = (index) => {
    closeGallery();
    openFullscreen(gallery.images, index);
  };

  const portfolioConf = bentoSettings?.portfolio || {
    intervalDuration: 2000,
    animationType: "fade",
  };
  const portraitConf = bentoSettings?.["portrait-library"] || {
    intervalDuration: 2000,
    animationType: "fade",
  };
  const packageConf = bentoSettings?.package || {
    intervalDuration: 2000,
    animationType: "zoom",
  };
  const landscapeConf = bentoSettings?.["landscape-library"] || {
    intervalDuration: 2000,
    animationType: "slide",
  };

  return (
    <>
      <section id="gallery" className="w-full bg-[#040404] p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {/* Left Column */}
          <div className="md:col-span-5 flex flex-col gap-4 md:gap-6 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1.0] }}
              className="aspect-[3/4]"
            >
              <CarouselCard
                images={carouselData.portfolio.images}
                title={carouselData.portfolio.title}
                subtitle={carouselData.portfolio.subtitle}
                onClick={() =>
                  openGallery(
                    carouselData.portfolio.images,
                    carouselData.portfolio.title
                  )
                }
                autoScroll={true}
                intervalDuration={portfolioConf.intervalDuration}
                animationType={portfolioConf.animationType}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.25, 0.1, 0.25, 1.0] }}
              className="aspect-[3/4] flex-grow"
            >
              <CarouselCard
                images={carouselData.portraitLibrary.images}
                title={carouselData.portraitLibrary.title}
                subtitle={carouselData.portraitLibrary.subtitle}
                onClick={() =>
                  openGallery(
                    carouselData.portraitLibrary.images,
                    carouselData.portraitLibrary.title
                  )
                }
                textClassName="[writing-mode:vertical-rl] !left-auto !bottom-auto top-6 right-6 md:top-8 md:right-8 transform-none"
                titleClassName="tracking-[0.2em]"
                subtitleClassName="tracking-[0.2em]"
                autoScroll={true}
                intervalDuration={portraitConf.intervalDuration}
                animationType={portraitConf.animationType}
              />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-7 h-full flex flex-col gap-4 md:gap-6 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
              className="aspect-square"
            >
              <PackageCard
                packageImages={packageImages}
                onClick={() => openGallery(packageImages, "Our Packages")}
                autoScroll={true}
                intervalDuration={packageConf.intervalDuration}
                animationType={packageConf.animationType}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.25, 0.1, 0.25, 1.0] }}
              className="aspect-[16/10]"
            >
              <CarouselCard
                images={carouselData.landscapeLibrary.images}
                title={carouselData.landscapeLibrary.title}
                subtitle={carouselData.landscapeLibrary.subtitle}
                onClick={() =>
                  openGallery(
                    carouselData.landscapeLibrary.images,
                    carouselData.landscapeLibrary.title
                  )
                }
                autoScroll={true}
                intervalDuration={landscapeConf.intervalDuration}
                animationType={landscapeConf.animationType}
                imageClassName="object-cover object-center"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {gallery.isOpen && (
        <ImageGallery
          images={gallery.images}
          title={gallery.title}
          onClose={closeGallery}
          onImageClick={handleImageClickInGallery}
        />
      )}

      {fullscreen.isOpen && (
        <FullscreenCarousel
          images={fullscreen.images}
          startIndex={fullscreen.startIndex}
          onClose={closeFullscreen}
        />
      )}
    </>
  );
};

export default BentoGridHero;
