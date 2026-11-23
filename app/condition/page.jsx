import React from "react";
import { FiFileText, FiCheckSquare, FiAlertCircle } from "react-icons/fi";
import Navbar from "../components/navbar/page";
import Footer from "../components/footer/page";

export const metadata = {
  title: "শর্তাবলী | ChitroJal",
  description: "চিত্রজাল-এর ইভেন্ট বুকিং, পেমেন্ট এবং সেবা সংক্রান্ত শর্তাবলী।",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-neutral-300 font-sans">
      <Navbar />
      <main className="flex-1 pt-32 pb-20 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none translate-y-1/2"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-4 bg-orange-500/10 rounded-full mb-6 border border-orange-500/20 shadow-[0_0_30px_rgba(234,88,12,0.15)]">
              <FiFileText className="w-10 h-10 text-orange-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-400 mb-6 tracking-tight">
              শর্তাবলী (Terms & Conditions)
            </h1>
            <p className="text-neutral-400 text-lg">
              বুকিং করার পূর্বে অনুগ্রহ করে আমাদের নীতি ও শর্তাবলী পড়ুন।
            </p>
          </div>

          {/* Content Container */}
          <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 md:p-12 shadow-2xl space-y-10 relative overflow-hidden">
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-start gap-4 mb-8">
              <FiAlertCircle className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
              <p className="text-sm text-neutral-300">
                চিত্রজাল-এ যেকোনো সার্ভিস বুকিং করার অর্থ হলো আপনি স্বতঃপ্রণোদিত
                হয়ে নিচের সকল শর্তাবলীর সাথে একমত পোষণ করছেন।
              </p>
            </div>

            <section className="relative z-10 border-l-2 border-orange-500/30 pl-6 hover:border-orange-500 transition-colors">
              <h2 className="text-xl font-bold text-white mb-3">
                ১. বুকিং এবং পেমেন্ট পলিসি
              </h2>
              <ul className="space-y-3 text-neutral-400 text-sm md:text-base leading-relaxed">
                <li className="flex items-start gap-2">
                  <FiCheckSquare className="text-orange-500 shrink-0 mt-1" />
                  <span>
                    ইভেন্টের তারিখ চূড়ান্ত করতে মোট প্যাকেজ মূল্যের{" "}
                    <strong>৩০% অগ্রিম (Advance)</strong> প্রদান করতে হবে।
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckSquare className="text-orange-500 shrink-0 mt-1" />
                  <span>
                    ইভেন্ট সম্পন্ন হওয়ার দিন অথবা ডেলিভারি নেওয়ার আগে অবশিষ্ট
                    পেমেন্ট পরিশোধ করা বাধ্যতামূলক।
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckSquare className="text-orange-500 shrink-0 mt-1" />
                  <span>
                    বুকিং বাতিল করলে অগ্রিম পেমেন্ট{" "}
                    <strong>অফেরতযোগ্য (Non-refundable)</strong> বলে গণ্য হবে।
                    তবে বিশেষ কারণে অন্তত ১৫ দিন আগে জানালে তারিখ পরিবর্তন
                    (রিসিডিউল) করার সুযোগ থাকে।
                  </span>
                </li>
              </ul>
            </section>

            <section className="relative z-10 border-l-2 border-white/10 pl-6 hover:border-orange-500 transition-colors">
              <h2 className="text-xl font-bold text-white mb-3">
                ২. ডেলিভারি এবং র-ফাইল (Raw Files)
              </h2>
              <ul className="space-y-3 text-neutral-400 text-sm md:text-base leading-relaxed">
                <li className="flex items-start gap-2">
                  <FiCheckSquare className="text-orange-500 shrink-0 mt-1" />
                  <span>
                    সম্পাদনা করা ছবি (Edited Photos) ডেলিভারি দিতে ইভেন্টের পর
                    সাধারণত <strong>২ থেকে ৩ সপ্তাহ</strong> সময় লাগে।
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckSquare className="text-orange-500 shrink-0 mt-1" />
                  <span>
                    সিনেমাটিক ভিডিও বা প্রমো ভিডিওর জন্য{" "}
                    <strong>৪ থেকে ৬ সপ্তাহ</strong> সময় প্রয়োজন হতে পারে।
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckSquare className="text-orange-500 shrink-0 mt-1" />
                  <span>
                    আমরা সাধারণত Raw Image বা আন-এডিটেড ভিডিও ফুটেজ ক্লায়েন্টকে
                    প্রদান করি না। তবে ক্লায়েন্টের বিশেষ অনুরোধে অতিরিক্ত ফি
                    প্রদানের মাধ্যমে তা সংগ্রহ করা যেতে পারে।
                  </span>
                </li>
              </ul>
            </section>

            <section className="relative z-10 border-l-2 border-white/10 pl-6 hover:border-orange-500 transition-colors">
              <h2 className="text-xl font-bold text-white mb-3">
                ৩. কপিরাইট এবং প্রমোশনাল ব্যবহার
              </h2>
              <ul className="space-y-3 text-neutral-400 text-sm md:text-base leading-relaxed">
                <li className="flex items-start gap-2">
                  <FiCheckSquare className="text-orange-500 shrink-0 mt-1" />
                  <span>
                    চিত্রজাল-এর ধারণকৃত সকল ছবি ও ভিডিওর সম্পূর্ণ কপিরাইট
                    (Copyright) চিত্রজাল-এর নিজস্ব সম্পত্তি। ক্লায়েন্ট এগুলো
                    ব্যক্তিগত কাজে ব্যবহার করতে পারবেন।
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckSquare className="text-orange-500 shrink-0 mt-1" />
                  <span>
                    চিত্রজাল তাদের ধারণকৃত সেরা কাজগুলো সোশ্যাল মিডিয়া,
                    ওয়েবসাইট বা মার্কেটিং ম্যাটেরিয়াল হিসেবে ব্যবহারের অধিকার
                    সংরক্ষণ করে। (ক্লায়েন্টের প্রাইভেসি ইস্যু থাকলে বুকিংয়ের
                    সময় লিখিতভাবে জানাতে হবে)।
                  </span>
                </li>
              </ul>
            </section>

            <section className="relative z-10 border-l-2 border-white/10 pl-6 hover:border-orange-500 transition-colors">
              <h2 className="text-xl font-bold text-white mb-3">
                ৪. ক্লায়েন্টের দায়িত্ব
              </h2>
              <ul className="space-y-3 text-neutral-400 text-sm md:text-base leading-relaxed">
                <li className="flex items-start gap-2">
                  <FiCheckSquare className="text-orange-500 shrink-0 mt-1" />
                  <span>
                    ইভেন্টের দিন ফটোগ্রাফি/ভিডিওগ্রাফির জন্য উপযুক্ত পরিবেশ এবং
                    সময় বের করা ক্লায়েন্ট বা ইভেন্ট ম্যানেজমেন্টের দায়িত্ব।
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckSquare className="text-orange-500 shrink-0 mt-1" />
                  <span>
                    ইভেন্ট চলাকালীন ক্রুদের (Crew) নিরাপত্তা এবং খাবার (ফুল ডে
                    ইভেন্টের ক্ষেত্রে) নিশ্চিত করার দায়িত্ব ক্লায়েন্টের।
                  </span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
