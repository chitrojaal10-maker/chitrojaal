import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import {
  FiMapPin,
  FiMail,
  FiPhone,
  FiArrowRight,
  FiShield,
  FiFileText,
} from "react-icons/fi";

const Footer = () => {
  const socialLinks = [
    {
      name: "Facebook",
      icon: FaFacebookF,
      url: "https://www.facebook.com/ChitroJaal",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      url: "https://www.instagram.com/chitrojaal_/",
    },
    {
      name: "YouTube",
      icon: FaYoutube,
      url: "https://www.youtube.com",
    },
  ];

  return (
    <footer className="relative bg-[#050505] border-t border-white/10 text-neutral-400 overflow-hidden z-10 pt-16">
      {/* Ambient Glows */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[140px] pointer-events-none translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8 mb-16 items-start">
          {/* Column 1: Brand Info & Contact Details */}
          <div className="flex flex-col items-start space-y-6">
            <Link
              href="/"
              className="inline-block transition-transform hover:scale-105"
            >
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="ChitroJal Logo"
                  width={120}
                  height={120}
                  className="h-14 w-auto object-contain"
                />
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-neutral-400">
              স্মৃতির ক্যানভাসে রঙের ছোঁয়া। আপনার জীবনের সেরা মুহূর্তগুলো
              ফ্রেমবন্দী করতে আমরা আছি আপনার পাশে।
            </p>

            <div className="space-y-3.5 pt-1 w-full">
              <div className="flex items-start gap-3 group">
                <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-orange-500/10 border border-white/5 group-hover:border-orange-500/30 transition-all shrink-0">
                  <FiMapPin className="text-orange-500" size={16} />
                </div>
                <span className="text-sm text-neutral-300 leading-snug pt-1">
                  জুমা মার্কেট, মিজান রোড, ফেনী
                </span>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-orange-500/10 border border-white/5 group-hover:border-orange-500/30 transition-all shrink-0">
                  <FiPhone className="text-orange-500" size={16} />
                </div>
                <a
                  href="tel:01834258375"
                  className="text-sm text-neutral-300 hover:text-orange-400 transition-colors"
                >
                  01834258375
                </a>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-orange-500/10 border border-white/5 group-hover:border-orange-500/30 transition-all shrink-0">
                  <FiMail className="text-orange-500" size={16} />
                </div>
                <a
                  href="mailto:Chitrojaal@gmail.com"
                  className="text-sm text-neutral-300 hover:text-orange-400 transition-colors"
                >
                  Chitrojaal@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Legal & Policies */}
          <div className="relative p-6 rounded-2xl bg-orange-500/[0.03] border border-orange-500/20 backdrop-blur-sm shadow-[0_0_25px_rgba(234,88,12,0.05)] overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 blur-2xl pointer-events-none"></div>

            <h3 className="font-bold text-orange-400 mb-3 text-lg tracking-wide flex items-center gap-2">
              <FiShield className="text-orange-500" /> আইনি ও শর্তাবলী
            </h3>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
              ফটোগ্রাফি কপিরাইট, বুকিং অ্যাডভান্স এবং র-ফাইল (Raw files)
              সংক্রান্ত আমাদের গুরুত্বপূর্ণ নীতিমালাগুলো অনুগ্রহ করে পড়ুন।
            </p>

            <ul className="space-y-3.5 relative z-10">
              <li>
                <Link
                  href="/privacy"
                  className="group flex items-center gap-3 text-sm text-neutral-300 hover:text-white transition-all bg-[#0A0A0A] p-3 rounded-xl border border-white/5 hover:border-orange-500/30 shadow-sm"
                >
                  <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-orange-500 transition-colors">
                    <FiShield
                      className="text-neutral-400 group-hover:text-white transition-colors"
                      size={14}
                    />
                  </div>
                  <span className="font-medium">প্রাইভেসি পলিসি</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/condition"
                  className="group flex items-center gap-3 text-sm text-neutral-300 hover:text-white transition-all bg-[#0A0A0A] p-3 rounded-xl border border-white/5 hover:border-orange-500/30 shadow-sm"
                >
                  <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-orange-500 transition-colors">
                    <FiFileText
                      className="text-neutral-400 group-hover:text-white transition-colors"
                      size={14}
                    />
                  </div>
                  <span className="font-medium">বুকিং শর্তাবলী</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Social & Newsletter */}
          <div className="flex flex-col justify-between h-full space-y-6">
            <div>
              <h3 className="font-bold text-white mb-6 text-lg tracking-wide">
                আমাদের খুঁজুন
              </h3>
              <div className="flex gap-3 mb-8">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.name}
                    className="w-11 h-11 bg-[#0A0A0A] border border-white/10 rounded-xl flex items-center justify-center text-neutral-400 hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:shadow-[0_0_20px_rgba(234,88,12,0.4)] transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <link.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-neutral-300">
                অফার পেতে সাবস্ক্রাইব করুন
              </h4>
              <div className="relative">
                <input
                  type="email"
                  placeholder="আপনার ইমেইল..."
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
                />
                <button
                  type="button"
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-orange-600 hover:bg-orange-500 rounded-lg text-white transition-colors flex items-center justify-center"
                >
                  <FiArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-white/10 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-neutral-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <p>
              &copy; {new Date().getFullYear()}{" "}
              <span className="text-white font-semibold">ChitroJal (চিত্রজাল)</span>.
              Feni Photography Agency. All rights reserved.
            </p>
            <span className="hidden sm:inline text-neutral-600">|</span>
            <p className="text-neutral-400">
              CEO & Founder: <span className="text-white font-medium">Salman H Choudhury</span>
            </p>
            <span className="hidden sm:inline text-neutral-600">|</span>
            <p className="text-neutral-400">
              Engineered & Developed by{" "}
              <a
                href="https://dev-sahariarsupto.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 font-semibold hover:underline"
              >
                MD. SAHARIAR HOSEN SUPTO
              </a>
            </p>
          </div>
          <div className="flex gap-6 shrink-0">
            <Link
              href="/privacy"
              className="hover:text-orange-400 transition-colors"
            >
              প্রাইভেসি পলিসি
            </Link>
            <Link
              href="/condition"
              className="hover:text-orange-400 transition-colors"
            >
              শর্তাবলী
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
