import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Treatments } from "@/components/treatments"
import { Pricing } from "@/components/pricing"
import { Gallery } from "@/components/gallery"
import { CtaFooter } from "@/components/cta-footer"

export default function Page() {
  return (
    <main className="bg-background">
      <SiteHeader />
      <Hero />
      <About />
      <Treatments />
      <Pricing />
      <Gallery />
      <CtaFooter />
    </main>
  )
}
