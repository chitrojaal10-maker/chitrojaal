"use client";

import { motion } from "framer-motion";
import {
  FiCamera,
  FiStar,
  FiArrowUpRight,
  FiAward,
  FiEdit,
  FiLayers,
} from "react-icons/fi";

const QuotesShowcase = () => {
  const features = [
    {
      icon: FiAward,
      title: "প্রিমিয়াম কোয়ালিটি",
      description:
        "আপনার প্রতিটি ছবির জন্য আমরা ব্যবহার করি সেরা সরঞ্জাম এবং প্রযুক্তি।",
    },
    {
      icon: FiCamera,
      title: "অভিজ্ঞ ফটোগ্রাফার",
      description:
        "আমাদের অভিজ্ঞ টিম আপনার সেরা মুহূর্তগুলো ক্যামেরাবন্দী করতে সর্বদা প্রস্তুত।",
    },
    {
      icon: FiEdit,
      title: "প্রফেশনাল এডিটিং",
      description:
        "প্রতিটি ছবিকে আরও আকর্ষণীয় করে তুলতে আমাদের রয়েছে প্রফেশনাল এডিটিং প্যানেল।",
    },
    {
      icon: FiLayers,
      title: "কাস্টমাইজড প্যাকেজ",
      description:
        "আপনার প্রয়োজন অনুযায়ী আমরা বিভিন্ন প্যাকেজ অফার করে থাকি।",
    },
  ];

  return (
    <section className="relative bg-[#040404] text-white py-28 md:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden z-10 border-t border-b border-white/10">
      {/* ================= BACKGROUND OBJECTS & GLOWS ================= */}
      {/* Animated Floating Glow Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [-20, 20, -20],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[160px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1],
          y: [-30, 30, -30],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-[180px] pointer-events-none"
      />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Floating Decorative Rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute -top-24 -right-24 w-96 h-96 border border-orange-500/10 rounded-full pointer-events-none border-dashed"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] border border-orange-500/10 rounded-full pointer-events-none"
      />

      {/* ================= MAIN CONTAINER ================= */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs sm:text-sm font-semibold tracking-wider uppercase backdrop-blur-md">
            <FiStar
              className="animate-spin text-orange-500"
              style={{ animationDuration: "6s" }}
            />
            ChitroJaal অনুভূতির গল্প
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
            মুহূর্তগুলো হোক <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500">
              চিরন্তন ও জীবন্ত
            </span>
          </h2>

          <p className="text-neutral-400 text-sm sm:text-lg max-w-xl mx-auto leading-relaxed">
            ক্যানভাসে রঙ ছড়াবে আপনার হাসির ঝলক, আর প্রতিটি ফ্রেমে বাঁধাই থাকবে
            ভালোবাসার অকৃত্রিম ছোঁয়া।
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-[#0B0B0B]/90 p-8 rounded-2xl border border-white/10 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <Icon size={28} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-400">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Bottom Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-20 relative p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0F0F0F] via-[#141414] to-[#0F0F0F] border border-orange-500/30 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left"
        >
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 blur-3xl pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <h4 className="text-2xl sm:text-3xl font-bold text-white">
              আপনার বিশেষ মুহূর্তটি কি ফ্রেমে বন্দি করতে চান?
            </h4>
            <p className="text-neutral-400 text-sm sm:text-base">
              ChitroJaal-এর সাথে আপনার ভালোবাসার গল্পগুলো অমর করে রাখুন।
            </p>
          </div>

          <a
            href="tel:01834258375"
            className="relative z-10 shrink-0 inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm tracking-wide shadow-[0_0_30px_rgba(234,88,12,0.4)] hover:shadow-[0_0_45px_rgba(234,88,12,0.6)] transition-all transform hover:-translate-y-1"
          >
            <span>কথা বলুন আমাদের সাথে</span>
            <FiArrowUpRight size={20} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default QuotesShowcase;
