import type { MetadataRoute } from "next"

const BASE = "https://www.calmandcontour.com"

// Every public page, so Google finds the service pages without having to
// crawl for them. Keep in sync when adding a page.
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1.0 },
    { path: "/treatments", priority: 0.9 },
    { path: "/mobile-massage-mallorca", priority: 0.9 },
    { path: "/villa-massage-mallorca", priority: 0.8 },
    { path: "/yacht-massage-mallorca", priority: 0.8 },
    { path: "/massage-near-me", priority: 0.8 },
    { path: "/massage-palma", priority: 0.8 },
    { path: "/lymphatic-drainage-mallorca", priority: 0.8 },
    { path: "/body-contouring-mallorca", priority: 0.8 },
    { path: "/ritual-massage-mallorca", priority: 0.8 },
    { path: "/serene-flow-ritual-mallorca", priority: 0.7 },
    { path: "/tension-release-massage-mallorca", priority: 0.7 },
  ]
  return pages.map((p) => ({
    url: `${BASE}${p.path}`,
    changeFrequency: "weekly" as const,
    priority: p.priority,
  }))
}
