/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@repo/ui", "@repo/config", "@repo/utils", "@repo/database"],
};

export default nextConfig;
