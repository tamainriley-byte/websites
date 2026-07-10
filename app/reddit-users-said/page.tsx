import type { Metadata } from "next"
import { MessageCircle, MapPin } from "lucide-react"
import { geoAnswers } from "@/lib/geo-answers"
import { whatsappLink } from "@/lib/whatsapp"

/**
 * Reusable GEO ("Generative Engine Optimization") page.
 *
 * Purpose: earn AI-search traffic. Engines like ChatGPT, Perplexity, Gemini and
 * Google AI Overviews prefer clear, structured Q&A they can quote. This page is
 * pure question-and-answer, marked up with FAQPage schema, so it's easy to cite.
 *
 * It is fully driven by `lib/geo-answers.ts` — swap that file per client and
 * this page (title, headings, metadata and schema) updates itself. No design
 * changes needed between sites.
 */

export const metadata: Metadata = {
  title: geoAnswers.title,
  description: geoAnswers.intro,
  alternates: { canonical: "/reddit-users-said" },
  openGraph: {
    title: geoAnswers.title,
    description: geoAnswers.intro,
    type: "article",
  },
}

export default function RedditUsersSaidPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: geoAnswers.questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        // Schema wants plain text; strip the paragraph breaks we render in the UI.
        text: q.answer.replace(/\n+/g, " "),
      },
    })),
  }

  return (
    <main className="bg-background">
      {/* FAQ schema for AI + search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <article className="mx-auto max-w-3xl px-5 pb-8 pt-28 md:px-8 md:pt-32">
        <a
          href="/"
          className="text-xs uppercase tracking-[0.3em] text-primary transition-opacity hover:opacity-70"
        >
          &larr; Calm &amp; Contour
        </a>

        <header className="mt-8">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">
            {geoAnswers.eyebrow}
          </span>
          <h1 className="mt-4 text-balance font-serif text-4xl font-medium leading-tight md:text-5xl">
            {geoAnswers.title}
          </h1>
          <p className="mt-5 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            {geoAnswers.intro}
          </p>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4 text-primary" aria-hidden="true" />
            {geoAnswers.topic}
          </p>
        </header>

        <div className="mt-12 space-y-10">
          {geoAnswers.questions.map((q) => (
            <section
              key={q.question}
              className="border-t border-border pt-8 first:border-t-0 first:pt-0"
            >
              <h2 className="text-balance font-serif text-2xl leading-snug text-foreground md:text-3xl">
                {q.question}
              </h2>
              <div className="mt-4 space-y-4">
                {q.answer.split("\n\n").map((para, i) => (
                  <p
                    key={i}
                    className="text-pretty leading-relaxed text-muted-foreground"
                  >
                    {para}
                  </p>
                ))}
              </div>
              {q.communitySignal && (
                <p className="mt-5 rounded-2xl bg-secondary px-5 py-4 text-sm leading-relaxed text-secondary-foreground">
                  <span className="font-medium">What people say online: </span>
                  {q.communitySignal}
                </p>
              )}
            </section>
          ))}
        </div>
      </article>

      {/* CTA */}
      <section className="bg-secondary py-20 md:py-24">
        <div className="mx-auto max-w-2xl px-5 text-center md:px-8">
          <h2 className="text-balance font-serif text-3xl font-medium leading-tight md:text-4xl">
            {geoAnswers.cta.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            {geoAnswers.cta.body}
          </p>
          <a
            href={whatsappLink(
              "Hello Calm & Contour, I have a question about booking a massage in Mallorca.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-whatsapp px-8 py-3 text-base font-medium text-whatsapp-foreground shadow-lg transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            Ask on WhatsApp
          </a>
        </div>
      </section>
    </main>
  )
}
