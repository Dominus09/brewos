import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sin standalone: compatible con Nixpacks/Coolify usando `npm run start`.
  // Para imagen Docker optimizada en el futuro, reactivar output: "standalone"
  // y usar `node server.js` como CMD (ver docker/README.md).
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
