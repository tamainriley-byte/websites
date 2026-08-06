/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Pages removed 15 Jul–5 Aug 2026 (owner decision). 301 to the homepage so
  // live ads, Google's index and old links never hit a 404.
  async redirects() {
    return [
      "/mobile-massage-mallorca",
      "/massage-near-me",
      "/massage-magaluf",
      "/massage-santa-ponsa",
      "/massage-palmanova",
      "/massage-paguera",
      "/massage-el-arenal",
      "/body-contouring-mallorca",
      "/couples-massage-mallorca",
      "/book",
    ].map((source) => ({ source, destination: "/", permanent: true }))
  },
}

export default nextConfig
