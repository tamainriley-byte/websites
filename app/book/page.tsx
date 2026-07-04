import type { Metadata } from "next"
import { BookForm } from "@/components/book-form"

export const metadata: Metadata = {
  title: "Book with Parissa | Calm & Contour Mallorca",
  description:
    "Send Parissa your details and she'll check availability and confirm your VIP mobile massage in Mallorca.",
}

export default function BookPage() {
  return (
    <main className="min-h-[100svh] bg-background px-5 py-16 md:py-24">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <div className="size-40 overflow-hidden rounded-full border-4 border-card shadow-xl md:size-48">
          <img
            src="/images/paris-portrait.jpeg"
            alt="Parissa, founder of Calm & Contour"
            className="size-full object-cover"
          />
        </div>

        <h1 className="mt-8 text-balance font-serif text-4xl font-medium leading-tight tracking-tight text-foreground md:text-5xl">
          Book with Parissa
        </h1>

        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
          Tell me what you&apos;d like and where you&apos;re staying, and
          I&apos;ll check availability and confirm your time.
        </p>

        <div className="mt-10 w-full">
          <BookForm />
        </div>
      </div>
    </main>
  )
}
