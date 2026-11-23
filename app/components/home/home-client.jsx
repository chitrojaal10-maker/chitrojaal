"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import ContactSection from "../contacts/page";
import BentoGridHero from "./BentoGridHero";
import VideoCarousel from "./VideoCarousel";
import {
  Phone,
  CheckCircle2,
  Heart,
  Video,
  Camera,
  Aperture,
} from "lucide-react";
import QuotesShowcase from "../section1/page";

const StatItem = ({ number, text }) => (
  <div className="text-center px-6 border-r border-white/10 last:border-0">
    <h4 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mb-2">
      {number}
    </h4>
    <p className="text-gray-400 uppercase tracking-widest text-xs md:text-sm">
      {text}
    </p>
  </div>
);

const serviceThemes = {
  "wedding-photography": {
    border: "border-rose-500/40 hover:border-rose-400/80",
    bg: "bg-gradient-to-br from-rose-950/50 via-pink-950/25 to-[#0A0A0A]",
    iconBg: "border-rose-500/40 bg-rose-500/20 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.25)]",
    icon: <Heart className="w-8 h-8 text-rose-400" />,
    titleColor: "text-rose-100 group-hover:text-white",
    glow: "shadow-[0_0_25px_rgba(244,63,94,0.12)] group-hover:shadow-[0_0_35px_rgba(244,63,94,0.3)]",
    badge: "border-rose-500/40 bg-rose-500/15 text-rose-300",
    tag: "ওয়েডিং সেগমেন্ট",
  },
  "cinematic-wedding": {
    border: "border-cyan-500/40 hover:border-cyan-400/80",
    bg: "bg-gradient-to-br from-cyan-950/50 via-blue-950/25 to-[#0A0A0A]",
    iconBg: "border-cyan-500/40 bg-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]",
    icon: <Video className="w-8 h-8 text-cyan-400" />,
    titleColor: "text-cyan-100 group-hover:text-white",
    glow: "shadow-[0_0_25px_rgba(6,182,212,0.12)] group-hover:shadow-[0_0_35px_rgba(6,182,212,0.3)]",
    badge: "border-cyan-500/40 bg-cyan-500/15 text-cyan-300",
    tag: "সিনেমাটিক ফিল্ম",
  },
  "pre-wedding-shoot": {
    border: "border-purple-500/40 hover:border-purple-400/80",
    bg: "bg-gradient-to-br from-purple-950/50 via-fuchsia-950/25 to-[#0A0A0A]",
    iconBg: "border-purple-500/40 bg-purple-500/20 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.25)]",
    icon: <Camera className="w-8 h-8 text-purple-400" />,
    titleColor: "text-purple-100 group-hover:text-white",
    glow: "shadow-[0_0_25px_rgba(168,85,247,0.12)] group-hover:shadow-[0_0_35px_rgba(168,85,247,0.3)]",
    badge: "border-purple-500/40 bg-purple-500/15 text-purple-300",
    tag: "ক্রিয়েটিভ শ্যুট",
  },
  "holud-and-mehendi": {
    border: "border-amber-500/40 hover:border-amber-400/80",
    bg: "bg-gradient-to-br from-amber-950/50 via-orange-950/25 to-[#0A0A0A]",
    iconBg: "border-amber-500/40 bg-amber-500/20 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]",
    icon: <Aperture className="w-8 h-8 text-amber-400" />,
    titleColor: "text-amber-100 group-hover:text-white",
    glow: "shadow-[0_0_25px_rgba(245,158,11,0.12)] group-hover:shadow-[0_0_35px_rgba(245,158,11,0.3)]",
    badge: "border-amber-500/40 bg-amber-500/15 text-amber-300",
    tag: "কালারফুল উৎসব",
  },
};

const ServiceCard = ({ slug, icon, title, description }) => {
  const theme = serviceThemes[slug] || {
    border: "border-orange-500/40 hover:border-orange-400/80",
    bg: "bg-gradient-to-br from-orange-950/50 via-amber-950/25 to-[#0A0A0A]",
    iconBg: "border-orange-500/40 bg-orange-500/20 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.25)]",
    icon: <Camera className="w-8 h-8 text-orange-400" />,
    titleColor: "text-orange-100 group-hover:text-white",
    glow: "shadow-[0_0_25px_rgba(249,115,22,0.12)] group-hover:shadow-[0_0_35px_rgba(249,115,22,0.3)]",
    badge: "border-orange-500/40 bg-orange-500/15 text-orange-300",
    tag: "বিশেষ সেবা",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`group relative p-8 rounded-3xl border ${theme.border} ${theme.bg} ${theme.glow} flex flex-col items-center text-center transition-all duration-300 overflow-hidden backdrop-blur-xl`}
    >
      {/* Top Tag Badge */}
      <div className="mb-4">
        <span className={`inline-block px-3 py-1 rounded-full border text-[11px] font-bold tracking-wider ${theme.badge}`}>
          {theme.tag}
        </span>
      </div>

      {/* Icon Badge */}
      <div className={`p-4 rounded-2xl mb-4 border transition-transform duration-300 group-hover:scale-110 ${theme.iconBg}`}>
        {theme.icon}
      </div>

      {/* Title */}
      <h3 className={`text-xl font-extrabold mb-3 transition-colors duration-300 ${theme.titleColor}`}>
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-300/80 text-sm leading-relaxed font-sans mb-6 flex-grow">
        {description}
      </p>

      {/* Bottom Action Badge */}
      <Link href="/booking">
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all duration-300 group-hover:gap-2.5 ${theme.badge} px-4 py-2 rounded-xl border`}>
          বুকিং করুন <Phone className="w-3.5 h-3.5" />
        </span>
      </Link>
    </motion.div>
  );
};

const HomeClient = ({ services, carouselData, videoData, packageImages, bentoSettings }) => {
  return (
    <main>
      <BentoGridHero
        carouselData={carouselData}
        packageImages={packageImages}
        bentoSettings={bentoSettings}
      />

      <section id="services" className="py-24 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[160px] pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 rounded-full text-orange-400 text-xs font-bold uppercase tracking-widest mb-4">
              আমাদের সেবাসমূহ
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-4">
              আমাদের প্রিমিয়াম সেবাসমূহ
            </h2>
            <p className="text-gray-400 text-lg">
              আপনার বিশেষ মুহূর্তগুলোকে ফ্রেমবন্দি করতে আমরা বিভিন্ন ধরনের
              ফটোগ্রাফি এবং সিনেমাটোগ্রাফি সেবা প্রদান করি।
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <ServiceCard
                key={service.slug}
                slug={service.slug}
                icon={service.icon}
                title={service.title}
                description={service.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-y-8 md:gap-y-0">
            <StatItem number="১০০০+" text="ইভেন্ট কাভারড" />
            <StatItem number="১৩+" text="বছরের অভিজ্ঞতা" />
          </div>
        </div>
      </section>

      <ContactSection />
      <VideoCarousel videoData={videoData} />
      <QuotesShowcase />

      <section id="about" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 w-full">
            <div className="relative aspect-video md:aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-orange-900/20">
              <Image
                src="/why_us.jpg"
                alt="Why Choose ChitroJal"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
          <div className="flex-1 w-full">
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6">
              কেন আমাদের{" "}
              <span className="text-orange-500 italic font-serif">
                বেছে নেবেন?
              </span>
            </h2>
            <p className="text-gray-400 mb-8 text-lg leading-relaxed">
              চিত্রজাল শুধু ছবি তোলে না, আমরা আবেগ এবং ভালোবাসার গল্প বুনি।
              আমাদের এক্সপেরিয়েন্সড টিম আপনার স্পেশাল দিনটিকে করে তুলবে एकदम
              পারফেক্ট।
            </p>

            <div className="space-y-4">
              {[
                "প্রফেশনাল এবং ক্রিয়েটিভ ফটোগ্রাফার টিম",
                "আধুনিক সিনেমাটিক গিয়ার্স ও ইকুইপমেন্ট",
                "অত্যন্ত যত্নশীল এডিটিং ও কালার গ্রেডিং",
                "সময়মতো ছবি ও ভিডিও ডেলিভারি",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5"
                >
                  <CheckCircle2 className="text-orange-500" size={24} />
                  <span className="text-gray-200 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-900 bg-cover bg-fixed bg-center"></div>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-6 font-serif">
            আপনার স্পেশাল দিনটি <br />{" "}
            <span className="text-orange-500 font-serif">বুক করুন</span>
          </h2>
          <p className="text-base md:text-lg text-gray-300 mb-10">
            আমাদের ডেটগুলো খুব দ্রুত বুক হয়ে যায়। তাই আপনার ইভেন্টের তারিখ
            কনফার্ম করতে আজই যোগাযোগ করুন আমাদের সাথে।
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/booking">
              <motion.button
                className="bg-orange-600 text-white font-bold px-8 py-3 sm:px-10 sm:py-4 rounded-full shadow-[0_0_30px_rgba(255,122,0,0.4)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                বুকিং ফর্ম পূরণ করুন
              </motion.button>
            </Link>
            <motion.button
              className="bg-white/10 border border-white/20 text-white font-semibold px-8 py-3 sm:px-10 sm:py-4 rounded-full backdrop-blur-md flex items-center justify-center gap-2"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255,255,255,0.15)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone size={20} /> কল করুন: +8801834258375
            </motion.button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomeClient;
