import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cdn.discordapp.com" },
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "i.pinimg.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 640, 768, 1024, 1280, 1536],
    minimumCacheTTL: 86400,
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "framer-motion",
      "date-fns",
      "react-markdown",
      "sonner",
      "qrcode.react",
    ],
  },
  async headers() {
    return [
      {
        source: "/:all*(svg|png|jpg|jpeg|gif|ico|webp|avif)",
        locale: false,
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:all*(woff2|woff|ttf|otf|eot)",
        locale: false,
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/manifest.json",
        locale: false,
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
    ];
  },
};

export default async function () {
  let config: NextConfig = { ...nextConfig };

  if (process.env.ANALYZE === "true") {
    const withBundleAnalyzer = (await import("@next/bundle-analyzer")).default({ enabled: true });
    config = withBundleAnalyzer(config);
  }

  return config;
}
