import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Zugriff aus dem lokalen Netzwerk (z. B. vom Handy) auf den Dev-Server erlauben
  allowedDevOrigins: ["localhost", "192.168.*"],
};

export default nextConfig;
