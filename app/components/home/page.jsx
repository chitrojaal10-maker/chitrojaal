import { Camera, CheckCircle, Package, Star, Clock, Heart } from "lucide-react";
import Link from "next/link";

const serviceDetails = {
  "wedding-photography": {
    title: "ওয়েডিং ফটোগ্রাফি",
    subtitle: "Premium Wedding Photography",
    description:
      "জীবনের সবচেয়ে বিশেষ দিনের প্রতিটি মুহূর্ত, হাসি এবং আবেগগুলো আমরা ফ্রেমবন্দি করি একদম প্রিমিয়াম স্টাইলে।",
  },
  "cinematic-wedding": {
    title: "সিনেমাটিক ওয়েডিং",
    subtitle: "Cinematic Wedding Films",
    description:
      "আপনার বিয়ের গল্পকে একটি সুন্দর সিনেমার রূপ দিতে আমাদের আছে এক্সপার্ট সিনেমাটোগ্রাফি টিম।",
  },
  "pre-wedding-shoot": {
    title: "প্রি-ওয়েডিং শ্যুট",
    subtitle: "Exclusive Pre-Wedding Shoots",
    description:
      "বিয়ের আগের মিষ্টি মুহূর্তগুলো আর কাপল কেমিস্ট্রি ফুটিয়ে তুলতে দারুণ সব লোকেশনে স্পেশাল শ্যুট।",
  },
  "holud-and-mehendi": {
    title: "গায়ে হলুদ ও মেহেদী",
    subtitle: "Colorful Haldi & Mehendi",
    description:
      "হলুদের উৎসবের রঙিন মুহূর্তগুলো আরও প্রাণবন্ত করে তুলবে আমাদের কালারফুল ফটোগ্রাফি।",
  },
};

const features = [
  {
    icon: Camera,
    title: "প্রিমিয়াম গিয়ার",
    desc: "সেরা মানের ছবি নিশ্চিত করতে লেটেস্ট ক্যামেরা ও লেন্স।",
  },
  {
    icon: Star,
    title: "অভিজ্ঞ টিম",
    desc: "দেশের সেরা প্রফেশনাল ফটোগ্রাফার এবং সিনেমাটোগ্রাফার।",
  },
  {
    icon: Clock,
    title: "দ্রুত ডেলিভারি",
    desc: "ইভেন্টের পর খুব দ্রুত সময়ে এডিটেড ছবি ও ভিডিও প্রদান।",
  },
  {
    icon: Heart,
    title: "কাস্টমার স্যাটিসফ্যাকশন",
    desc: "আপনার সন্তুষ্টিই আমাদের কাজের প্রধান লক্ষ্য।",
  },
];

const packages = [
  {
    name: "সিলভার প্যাকেজ",
    slug: "silver",
    price: "৳ ১৫,০০০",
    features: [
      "১ জন টপ ফটোগ্রাফার",
      "১০০ এডিটেড ছবি",
      "আনলিমিটেড র-পিকচার",
      "৪ ঘন্টা কভারেজ",
    ],
    isPopular: false,
  },
  {
    name: "গোল্ড প্যাকেজ",
    slug: "gold",
    price: "৳ ২৫,০০০",
    features: [
      "২ জন টপ ফটোগ্রাফার",
      "১ জন সিনেমাটোগ্রাফার",
      "২০০ এডিটেড ছবি",
      "৩ মিনিটের হাইলাইট ভিডিও",
      "ফুল ইভেন্ট কভারেজ",
    ],
    isPopular: true,
  },
  {
    name: "প্লাটিনাম প্যাকেজ",
    slug: "platinum",
    price: "৳ ৪০,০০০",
    features: [
      "৩ জন প্রিমিয়াম ফটোগ্রাফার",
      "২ জন সিনেমাটোগ্রাফার",
      "ড্রোন শ্যুট (শর্ত প্রযোজ্য)",
      "স্পেশাল ওয়েডিং অ্যালবাম",
      "সিনেমাটিক ট্রেইলার",
    ],
    isPopular: false,
  },
];

export default function Home({ params }) {
  const service = serviceDetails[params?.slug] || {
    title: "Service Not Found",
    subtitle: "404 Error",
    description: "দুঃখিত, আপনি যে সার্ভিসটি খুঁজছেন তা পাওয়া যায়নি।",
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-amber-500 selection:text-black">
      <main className="container mx-auto px-4 py-24 md:pt-32 pb-20">
        {/* HERO SECTION */}
        <div className="relative h-[65vh] md:h-[75vh] w-full rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-amber-900/10 mb-20 border border-white/5 bg-gray-900">
          {/* Static Background Image Space - ADD IMAGE HERE MANUALLY */}
          <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105">
            {/* Add your img or Next Image tag here */}
          </div>

          {/* Gradients for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#050505]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 p-8 md:p-16 flex flex-col justify-end h-full max-w-4xl z-10">
            <span className="text-amber-500 font-medium tracking-[0.2em] uppercase mb-4 text-sm md:text-base flex items-center gap-2">
              <span className="w-8 h-[1px] bg-amber-500"></span>
              {service.subtitle}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6 leading-tight">
              {service.title}
            </h1>
            <p className="text-base sm:text-lg md:text-2xl text-gray-300 max-w-2xl leading-relaxed font-light border-l-4 border-amber-500 pl-6">
              {service.description}
            </p>
          </div>
        </div>

        {/* WHY CHOOSE US SECTION */}
        <section className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              কেন আমাদের <span className="text-amber-500">বেছে নিবেন?</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              আপনাদের বিশেষ দিনগুলোকে আরও স্পেশাল করতে আমাদের রয়েছে ডেডিকেটেড
              টিম এবং সেরা সরঞ্জাম।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="bg-amber-500/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors">
                  <feat.icon className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3">
                  {feat.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING / PACKAGES SECTION */}
        <section id="contact" className="py-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 flex items-center gap-3">
                <Package className="w-10 h-10 text-amber-500" />
                প্যাকেজ সমূহ
              </h2>
              <p className="text-gray-400 max-w-xl">
                আপনার বাজেট এবং চাহিদা অনুযায়ী বেছে নিন আমাদের সেরা
                প্যাকেজগুলো। কাস্টম প্যাকেজের জন্য যোগাযোগ করুন।
              </p>
            </div>
            <Link href="/booking">
              <button className="px-8 py-4 bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black rounded-full font-bold transition-all duration-300">
                কাস্টম প্যাকেজ তৈরি করুন
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative rounded-3xl p-8 lg:p-10 transition-all duration-300 flex flex-col ${
                  pkg.isPopular
                    ? "bg-gradient-to-b from-amber-900/40 to-black border-2 border-amber-500 scale-100 md:scale-105 z-10 shadow-2xl shadow-amber-900/20"
                    : "bg-white/5 border border-white/10 hover:border-white/30"
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-4 py-1 rounded-full text-sm font-bold tracking-wide">
                    সবচেয়ে জনপ্রিয়
                  </div>
                )}
                <h3 className="text-xl sm:text-2xl font-bold mb-2">
                  {pkg.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-amber-500">
                    {pkg.price}
                  </span>
                </div>

                <div className="flex-grow space-y-4 mb-10">
                  {pkg.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href={`/booking?package=${pkg.slug}`} className="mt-auto">
                  <button
                    className={`w-full py-4 rounded-xl font-bold transition-colors ${
                      pkg.isPopular
                        ? "bg-amber-500 text-black hover:bg-amber-400"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    বুকিং করুন
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
