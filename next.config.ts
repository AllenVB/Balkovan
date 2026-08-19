import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Tasarim gorselleri simdilik Stitch'in CDN'inden geliyor (bkz. src/lib/images.ts).
    // Gercek urun fotograflari public/images altina tasindiginda bu kural kaldirilacak.
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
