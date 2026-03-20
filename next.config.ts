import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Firebase SDK from being bundled into SSR/server chunks.
  // Firebase is browser-only; bundling it server-side causes
  // auth/invalid-api-key errors during `npm run build` when env vars
  // are not available in the SSR evaluation context.
  serverExternalPackages: ["firebase", "firebase-admin"],
};

export default nextConfig;
