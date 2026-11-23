/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        // allow all cloudinary image paths used by the app
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
