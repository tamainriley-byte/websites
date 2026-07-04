const images = [
  {
    src: "/images/hero-cove.png",
    alt: "Massage table on a deck above a turquoise Mallorca cove",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    src: "/images/villa-terrace.png",
    alt: "Massage table with lavender on a villa terrace at sunset",
    className: "",
  },
  {
    src: "/images/yacht-cabin.png",
    alt: "Treatment setup inside a luxury yacht cabin",
    className: "",
  },
  {
    src: "/images/paris-seaside.jpeg",
    alt: "Parissa treating a guest at a seaside massage table",
    className: "",
  },
  {
    src: "/images/paris-deck.jpeg",
    alt: "Parissa preparing a massage table on a seaside deck in Mallorca",
    className: "",
  },
]

export function Gallery() {
  return (
    <section id="gallery" className="bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">
            Gallery
          </span>
          <h2 className="mt-4 text-balance font-serif text-4xl font-medium leading-tight md:text-5xl">
            Moments of calm in Mallorca
          </h2>
        </div>

        <div className="mt-12 grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-4 md:auto-rows-[220px]">
          {images.map((img) => (
            <div
              key={img.src}
              className={`overflow-hidden rounded-2xl ${img.className}`}
            >
              <img
                src={img.src || "/placeholder.svg"}
                alt={img.alt}
                className="size-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
