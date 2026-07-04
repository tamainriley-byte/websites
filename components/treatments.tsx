const locations = [
  {
    title: "In the Studio",
    description:
      "Unwind at the Calm & Contour studio for massage, body and facial treatments in a serene, private setting.",
    image: "/images/paris-portrait.jpeg",
    alt: "Paris Elizabeth in her Calm & Contour studio with a contouring tool",
  },
  {
    title: "Villa & Home",
    description:
      "We bring the full treatment to your villa terrace or residence, set against Mallorca's sunset and olive groves.",
    image: "/images/villa-terrace.png",
    alt: "Massage table set up on a villa terrace overlooking the sea",
  },
  {
    title: "On Your Yacht",
    description:
      "Onboard treatments for guests at anchor or in port — calm, discreet and tailored to life at sea.",
    image: "/images/yacht-cabin.png",
    alt: "Massage table prepared inside a luxury yacht cabin",
  },
  {
    title: "At Your Hotel",
    description:
      "In-suite treatments delivered to your hotel — slip into total relaxation without leaving your room.",
    image: "/images/hotel-suite.png",
    alt: "Massage table set up in an elegant luxury hotel suite with a sea view",
  },
  {
    title: "Body & Contour",
    description:
      "Lymphatic drainage and body contouring treatments to sculpt, de-puff and leave skin glowing.",
    image: "/images/body-contour.png",
    alt: "Body contouring treatment with a sculpting tool",
  },
]

export function Treatments() {
  return (
    <section id="treatments" className="bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">
            Where we treat
          </span>
          <h2 className="mt-4 text-balance font-serif text-4xl font-medium leading-tight md:text-5xl">
            Luxury wellness, wherever you are
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">
            Choose the setting that suits you. Each treatment is delivered with
            the same boutique care, whether in our studio or at your residence.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {locations.map((item) => (
            <article
              key={item.title}
              className="group overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border transition-shadow hover:shadow-md"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.alt}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-2xl text-card-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
