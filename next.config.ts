import type { NextConfig } from "next";

const isProd = process.env.NEXT_PUBLIC_SITE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";
const officialNavbar = process.env.NEXT_PUBLIC_CITY_NAVBAR === "official";

// Content Security Policy. Third parties are limited to the official City navbar (when enabled)
// and the existing form/map providers that the live site already embeds.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${officialNavbar ? " https://navbar.lacity.org" : ""}${isProd ? "" : " https://vercel.live"}`,
  `style-src 'self' 'unsafe-inline'${officialNavbar ? " https://fonts.googleapis.com" : ""}`,
  `font-src 'self' data:${officialNavbar ? " https://fonts.gstatic.com" : ""}`,
  "img-src 'self' data: blob:",
  `connect-src 'self'${isProd ? "" : " https://vercel.live wss://ws-us3.pusher.com"}`,
  `frame-src https://forms.indigov.com https://www.google.com https://docs.google.com${isProd ? "" : " https://vercel.live"}`,
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  // Everything except an explicitly authorized production build stays out of search engines.
  ...(isProd ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }]),
];

const nextConfig: NextConfig = {
  trailingSlash: true, // matches existing cd4.lacity.gov permalinks
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    // Old paths that no longer have their own page in the neutral information architecture.
    // Temporary (307) on staging; make permanent only once the City approves the mapping.
    return [
      { source: "/initiatives", destination: "/topics-resources/", permanent: false },
      { source: "/meet-nithya", destination: "/district-4/", permanent: false },
      { source: "/team", destination: "/district-4/", permanent: false },
      { source: "/the-latest", destination: "/news/", permanent: false },
      { source: "/press-kit", destination: "/news/", permanent: false },
      { source: "/press-releases/annual-reports", destination: "/press-releases/", permanent: false },
      { source: "/certificate-requests", destination: "/need-help/", permanent: false },
      { source: "/job-openings", destination: "/district-4/", permanent: false },
      { source: "/contact", destination: "/need-help/", permanent: false },
      { source: "/about", destination: "/district-4/", permanent: false },
    ];
  },
};

export default nextConfig;
