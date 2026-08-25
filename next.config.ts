import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Zugriff aus dem lokalen Netzwerk (z. B. vom Handy) auf den Dev-Server erlauben
  allowedDevOrigins: ["localhost", "192.168.*"],
  // Schlankes Server-Bundle inkl. benötigter node_modules für das Deployment per FTP
  // (kein `npm install` auf dem Server nötig, siehe .github/workflows/deploy.yml)
  output: "standalone",
};

export default nextConfig;
