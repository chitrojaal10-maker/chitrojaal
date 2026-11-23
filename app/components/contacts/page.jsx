"use client";

import { motion } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiMessageCircle,
  FiArrowUpRight,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const ContactSection = () => {
  const email = "Chitrojaal@gmail.com";
  const phone = "01834258375";
  const whatsappNumber = "8801834258375"; // International format for WhatsApp API

  return (
    <section id="contact" className="relative bg-[#050505] text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden z-10 border-t border-white/10">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center space-y-8">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold tracking-wider uppercase">
            <FiMessageCircle className="text-orange-500" /> সরাসরি যোগাযোগ
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            যোগাযোগ করুন আমাদের সাথে
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-md mx-auto">
            আপনার যেকোনো প্রশ্ন বা বুকিং সংক্রান্ত তথ্যের জন্য সরাসরি কল, মেসেজ
            অথবা ইমেইল করুন।
          </p>
        </motion.div>

        {/* Action Buttons Container (Centered) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          {/* Call Button */}
          <a
            href={`tel:${phone}`}
            className="group flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-orange-500/50 text-white font-medium text-sm transition-all duration-300 hover:shadow-[0_0_25px_rgba(234,88,12,0.2)] hover:-translate-y-0.5"
          >
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <FiPhone size={18} />
            </div>
            <div className="text-left">
              <span className="block text-[10px] text-neutral-400 font-normal uppercase tracking-wider">
                কল করুন
              </span>
              <span className="text-sm font-semibold">{phone}</span>
            </div>
          </a>

          {/* WhatsApp Button (Prominent Accent) */}
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-emerald-600/10 border border-emerald-500/30 hover:bg-emerald-600 text-white font-medium text-sm transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:-translate-y-0.5"
          >
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:bg-white group-hover:text-emerald-600 transition-colors">
              <FaWhatsapp size={20} />
            </div>
            <div className="text-left">
              <span className="block text-[10px] text-emerald-300/80 group-hover:text-emerald-100 font-normal uppercase tracking-wider">
                হোয়াটসঅ্যাপে চ্যাট করুন
              </span>
              <span className="text-sm font-bold text-emerald-400 group-hover:text-white flex items-center gap-1">
                {phone} <FiArrowUpRight size={14} />
              </span>
            </div>
          </a>

          {/* Mail Button */}
          <a
            href={`mailto:${email}`}
            className="group flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-orange-500/50 text-white font-medium text-sm transition-all duration-300 hover:shadow-[0_0_25px_rgba(234,88,12,0.2)] hover:-translate-y-0.5"
          >
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <FiMail size={18} />
            </div>
            <div className="text-left">
              <span className="block text-[10px] text-neutral-400 font-normal uppercase tracking-wider">
                মেইল করুন
              </span>
              <span className="text-sm font-semibold">{email}</span>
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
