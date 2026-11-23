"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  FiHeart,
  FiVideo,
  FiCamera,
  FiAperture,
  FiArrowRight,
} from "react-icons/fi";

const iconMap = {
  Heart: <FiHeart size={24} />,
  Video: <FiVideo size={24} />,
  Camera: <FiCamera size={24} />,
  Aperture: <FiAperture size={24} />,
};

const ServiceCard = ({ icon, title, description, image, slug }) => {
  return (
    <Link
      href={`/services/${slug}`}
      className="block h-full w-full outline-none"
    >
      <motion.div
        className="group relative h-[480px] overflow-hidden rounded-[2rem] bg-[#0A0A0A] border border-white/5 cursor-pointer shadow-2xl"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Background Image with Cinematic Zoom */}
        {image && (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110 opacity-70 group-hover:opacity-100"
          />
        )}

        {/* Ambient Top Glow (Orange) */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

        {/* Multi-layered Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent opacity-90 transition-opacity duration-500"></div>

        {/* Floating Icon (Top Right) */}
        <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white group-hover:text-orange-500 group-hover:border-orange-500/50 transition-all duration-500 transform group-hover:-rotate-12 z-20">
          {iconMap[icon] || <FiCamera size={24} />}
        </div>

        {/* Content Container (Bottom Aligned) */}
        <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end z-20">
          <div className="transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] translate-y-8 group-hover:translate-y-0">
            <h3 className="font-extrabold text-xl sm:text-2xl md:text-3xl mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400 group-hover:text-white transition-colors duration-300">
              {title}
            </h3>

            <p className="text-neutral-400 text-sm leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 line-clamp-3">
              {description}
            </p>

            {/* Seamless Indicator instead of a Button */}
            <div className="flex items-center gap-3 text-orange-500 font-bold text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
              <span className="relative overflow-hidden">
                <span className="block transform transition-transform duration-300 group-hover:translate-x-0 -translate-x-full">
                  Explore Package
                </span>
              </span>
              <FiArrowRight
                className="transform transition-transform duration-500 group-hover:translate-x-2"
                size={18}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const ServicesSection = ({ services = [], heroImages = [] }) => {
  const [assignedServices, setAssignedServices] = useState([]);

  useEffect(() => {
    // 1. Shuffle the available hero images
    const shuffledImages = [...heroImages].sort(() => 0.5 - Math.random());
    let imageIndex = 0;

    // 2. Map through services and assign unique images where needed
    const processedServices = services.map((service) => {
      let finalImage = service.image;

      if (!finalImage && shuffledImages.length > 0) {
        // Assign a unique image and loop back if we run out of unique images
        finalImage = shuffledImages[imageIndex % shuffledImages.length];
        imageIndex++;
      }

      return {
        ...service,
        assignedImage: finalImage || "", // Fallback if absolutely no images exist
      };
    });

    setAssignedServices(processedServices);
  }, [services, heroImages]);

  return (
    <section
      id="services"
      className="py-32 relative bg-[#050505] overflow-hidden"
    >
      {/* Background Ambient Elements */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-orange-500 font-bold uppercase tracking-widest text-xs mb-4"
            >
              <div className="w-8 h-px bg-orange-500"></div>
              Our Expertise
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight"
            >
              আমাদের{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300 italic font-serif">
                সেবাসমূহ
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-neutral-400 text-lg leading-relaxed"
            >
              আপনার ইভেন্টকে স্পেশাল করতে আমরা দিচ্ছি প্রিমিয়াম ফটোগ্রাফি এবং
              সিনেমাটোগ্রাফি প্যাকেজ। প্রতিটি ফ্রেম হোক আপনার গল্পের নিখুঁত
              প্রতিচ্ছবি।
            </motion.p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {assignedServices.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              slug={service.slug}
              image={service.assignedImage}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
