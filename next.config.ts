import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Zugriff aus dem lokalen Netzwerk (z. B. vom Handy) auf den Dev-Server erlauben
  allowedDevOrigins: ["localhost", "192.168.*"],
  // Schlankes Server-Bundle inkl. benötigter node_modules für das Deployment per FTP
  // (kein `npm install` auf dem Server nötig, siehe .github/workflows/deploy.yml)
  output: "standalone",
  images: {
    // Next's built-in Image Optimizer caches resized copies on disk for
    // minimumCacheTTL (default 4h) with no invalidation when the source
    // file changes — a swapped /public image can look "stuck" until that
    // expires. Not worth it for a handful of small decorative images on a
    // low-traffic page, so serve originals straight from /public instead.
    unoptimized: true,
  },
};

export default nextConfig;
