const isDev = process.env.NODE_ENV !== 'production';

// 'unsafe-inline' is needed for Next's inline bootstrap scripts and the theme
// init script; 'unsafe-eval' only in dev (React refresh / source maps).
const csp = [
  "default-src 'self'",
  // blob: is needed by drei's <Text> (troika), which runs a web worker from a blob URL.
  `script-src 'self' 'unsafe-inline' blob:${isDev ? " 'unsafe-eval'" : ''} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net",
  "connect-src 'self' https://*.supabase.co https://vitals.vercel-insights.com https://va.vercel-scripts.com https://fonts.gstatic.com https://cdn.jsdelivr.net" +
    (isDev ? ' ws: wss:' : ''),
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'"
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // Keep the admin UI and its API out of search indexes.
      {
        source: '/admin/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]
      },
      {
        source: '/api/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]
      }
    ];
  },
  images: {
    remotePatterns: [
      // Supabase storage — the darkroom frames. Pinned to this project so the
      // image optimizer can't be used to proxy other Supabase projects.
      {
        protocol: 'https',
        hostname: 'ygkixcugivkgartivbyw.supabase.co',
        pathname: '/storage/**'
      },
      { protocol: 'https', hostname: 'i.scdn.co' },
      { protocol: 'https', hostname: 'image-cdn-ak.spotifycdn.com' },
      { protocol: 'https', hostname: 'blend-playlist-covers.spotifycdn.com' },
      { protocol: 'https', hostname: 'image-cdn-fa.spotifycdn.com' },
      { protocol: 'https', hostname: 'miro.medium.com' },
      { protocol: 'https', hostname: 'cdn-images-1.medium.com' }
    ],
    formats: ['image/avif', 'image/webp'],
    // Next 16 only serves qualities listed here; the gallery asks for 80.
    qualities: [75, 80],
    unoptimized: false
  }
};

export default nextConfig;
