import React from "react";
import { FiShield, FiLock, FiEye, FiDatabase } from "react-icons/fi";
import Navbar from "../components/navbar/page";
import Footer from "../components/footer/page";

export const metadata = {
  title: "প্রাইভেসি পলিসি | ChitroJal",
  description: "চিত্রজাল-এর প্রাইভেসি পলিসি এবং তথ্য সংগ্রহ নীতিমালা।",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-neutral-300 font-sans">
      <Navbar />
      <main className="flex-1 pt-32 pb-20 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-4 bg-orange-500/10 rounded-full mb-6 border border-orange-500/20 shadow-[0_0_30px_rgba(234,88,12,0.15)]">
              <FiShield className="w-10 h-10 text-orange-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-400 mb-6 tracking-tight">
              প্রাইভেসি পলিসি
            </h1>
            <p className="text-neutral-400 text-lg">
              সর্বশেষ আপডেট: ২৪ জুলাই, ২০২৬
            </p>
          </div>

          {/* Content Container */}
          <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 md:p-12 shadow-2xl space-y-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>

            <section className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-500">
                  ১
                </span>
                তথ্য সংগ্রহ
              </h2>
              <p className="leading-relaxed text-neutral-400">
                চিত্রজাল (ChitroJal) আপনার ব্যক্তিগত তথ্যের সুরক্ষায়
                প্রতিশ্রুতিবদ্ধ। বুকিং এবং সেবা প্রদানের উদ্দেশ্যে আমরা আপনার
                নাম, ফোন নম্বর, ইমেইল ঠিকানা, ইভেন্টের স্থান এবং তারিখ সংগ্রহ
                করে থাকি। এছাড়াও আমাদের ওয়েবসাইটে আপনার ব্রাউজিং অভিজ্ঞতা
                উন্নত করতে কুকিজ (Cookies) ব্যবহার করা হতে পারে।
              </p>
            </section>

            <section className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-500">
                  ২
                </span>
                তথ্যের ব্যবহার
              </h2>
              <p className="leading-relaxed text-neutral-400 mb-4">
                আপনার প্রদানকৃত তথ্যগুলো আমরা মূলত নিচের কাজগুলোতে ব্যবহার করি:
              </p>
              <ul className="space-y-3">
                {[
                  "বুকিং কনফার্মেশন এবং ক্লায়েন্ট যোগাযোগ",
                  "ইভেন্টের দিন সঠিক সময়ে এবং সঠিক স্থানে পৌঁছানো",
                  "ছবি এবং ভিডিও ডেলিভারি প্রক্রিয়া সম্পন্ন করা",
                  "ভবিষ্যতের বিশেষ অফার বা প্রোমোশনাল আপডেট জানানো (আপনার সম্মতি সাপেক্ষে)",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <FiEye className="w-5 h-5 text-orange-500 shrink-0 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-500">
                  ৩
                </span>
                ডেটা সিকিউরিটি এবং সংরক্ষণ
              </h2>
              <p className="leading-relaxed text-neutral-400">
                ক্লায়েন্টদের ছবি এবং ভিডিও আমাদের অত্যন্ত সুরক্ষিত ক্লাউড এবং
                NAS সার্ভারে সংরক্ষণ করা হয়। আমরা কোন তৃতীয় পক্ষের
                (Third-party) কাছে আপনার ব্যক্তিগত তথ্য বা ইভেন্টের ছবি বিক্রি
                বা শেয়ার করি না। তবে, পোর্টফোলিও শোকেস করার জন্য আমরা সোশ্যাল
                মিডিয়া বা ওয়েবসাইটে কাজগুলো প্রদর্শন করতে পারি (যদি না আপনি
                প্রাইভেসি চুক্তি বা NDA সাইন করেন)।
              </p>
            </section>

            <section className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-500">
                  ৪
                </span>
                ক্লায়েন্টের অধিকার
              </h2>
              <p className="leading-relaxed text-neutral-400">
                আপনি চাইলে যেকোনো সময় আপনার ব্যক্তিগত তথ্য আমাদের ডাটাবেস থেকে
                মুছে ফেলার অনুরোধ করতে পারেন। এছাড়াও, যদি কোনো নির্দিষ্ট ছবি
                আমাদের পোর্টফোলিও থেকে সরাতে চান, তবে লিখিত অনুরোধের ভিত্তিতে
                আমরা তা দ্রুত অপসারণ করে থাকি।
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
