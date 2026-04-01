// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // TAMBAHKAN BLOK INI
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
  output: "standalone",
  // AKHIR BLOK TAMBAHAN
};

export default nextConfig;
