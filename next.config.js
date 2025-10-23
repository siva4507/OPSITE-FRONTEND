/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },

  allowedDevOrigins: ["20.83.156.81", "localhost", "127.0.0.1"],

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

module.exports = nextConfig;
