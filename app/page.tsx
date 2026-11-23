import Navbar from "./components/navbar/page";
import Footer from "./components/footer/page";
import HomeClient from "./components/home/home-client";
import { readBentoSettings, readFolderImages } from "./api/admin/hero-grid/route";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const buildVideoThumbnailUrl = (sourceUrl: string) =>
  `/api/video-thumbnail?url=${encodeURIComponent(sourceUrl)}`;

export default async function Home() {
  // Data for the services section. You can manage this here.
  const services = [
    {
      icon: "Heart",
      title: "ওয়েডিং ফটোগ্রাফি",
      slug: "wedding-photography",
      description:
        "জীবনের সবচেয়ে বিশেষ দিনের প্রতিটি মুহূর্ত, হাসি এবং আবেগগুলো আমরা ফ্রেমবন্দি করি একদম প্রিমিয়াম স্টাইলে।",
      image: "",
    },
    {
      icon: "Video",
      title: "সিনেমাটিক ওয়েডিং",
      slug: "cinematic-wedding",
      description:
        "আপনার বিয়ের গল্পকে একটি সুন্দর সিনেমার রূপ দিতে আমাদের আছে এক্সপার্ট সিনেমাটোগ্রাফি টিম।",
      image: "",
    },
    {
      icon: "Camera",
      title: "প্রি-ওয়েডিং শ্যুট",
      slug: "pre-wedding-shoot",
      description:
        "বিয়ের আগের মিষ্টি মুহূর্তগুলো আর কাপল কেমিস্ট্রি ফুটিয়ে তুলতে দারুণ সব লোকেশনে স্পেশাল শ্যুট।",
      image: "",
    },
    {
      icon: "Aperture",
      title: "গায়ে হলুদ ও মেহেদী",
      slug: "holud-and-mehendi",
      description:
        "হলুদের উৎসবের রঙিন মুহূর্তগুলো আরও প্রাণবন্ত করে তুলবে আমাদের কালারফুল ফটোগ্রাফি।",
      image: "",
    },
  ];

  // Fetch images and settings asynchronously from MongoDB / fallback files
  const [
    portfolioImages,
    portraitImages,
    landscapeImages,
    packageImages,
    bentoSettings,
  ] = await Promise.all([
    readFolderImages("portfolio"),
    readFolderImages("portrait-library"),
    readFolderImages("landscape-library"),
    readFolderImages("package"),
    readBentoSettings(),
  ]);

  const carouselData = {
    portfolio: {
      title: "PORTFOLIO",
      subtitle: "Our recent works",
      images: portfolioImages,
    },
    portraitLibrary: {
      title: "PHOTO LIBRARY",
      subtitle: "Portrait collection",
      images: portraitImages,
    },
    landscapeLibrary: {
      title: "PHOTO LIBRARY",
      subtitle: "Landscape collection",
      images: landscapeImages,
    },
  };

  const videoData = [
    {
      id: 1,
      facebookSrc:
        "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1484422342948146%2F&show_text=false&width=560&t=0",
      thumbnail: buildVideoThumbnailUrl(
        "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1484422342948146%2F&show_text=false&width=560&t=0",
      ),
      title: "সিনেমাটিক ওয়েডিং ফিল্ম",
      description: "প্রেম ও উদযাপনের এক সুন্দর গল্প।",
    },
    {
      id: 2,
      facebookSrc:
        "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1484422342948146%2F&show_text=false&width=560&t=0",
      thumbnail: buildVideoThumbnailUrl(
        "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1484422342948146%2F&show_text=false&width=560&t=0",
      ),
      title: "ফেসবুক রিল ১",
      description: "আমাদের সাম্প্রতিক কাজ থেকে একটি রিল।",
    },
  ];

  return (
    <div className="bg-[#0a0a0a] text-white selection:bg-orange-500/30 min-h-screen font-sans">
      <Navbar />
      <HomeClient
        services={services}
        carouselData={carouselData}
        videoData={videoData}
        packageImages={packageImages}
        bentoSettings={bentoSettings}
      />

      <Footer />
    </div>
  );
}

