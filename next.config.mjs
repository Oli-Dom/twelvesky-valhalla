/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.paypal.com https://www.sandbox.paypal.com https://www.paypalobjects.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' https: data:;
              connect-src 'self' https://www.paypal.com https://www.sandbox.paypal.com https://www.paypalobjects.com;
              font-src 'self';
              object-src 'none';
              frame-src 'self' https://www.paypal.com https://www.sandbox.paypal.com https://www.paypalobjects.com;
              frame-ancestors 'self';
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
