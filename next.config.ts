import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hostinger also forces standalone. Keep a config object (not a function)
  // so their wrapper can merge this file.
  output: "standalone",
};

export default nextConfig;
