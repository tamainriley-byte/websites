export function About() {
  return (
    <section id="about" className="bg-background py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2 md:gap-16 md:px-8">
        <div className="relative">
          <img
            src="/images/paris-seaside.jpeg"
            alt="Parissa giving a massage on a wooden deck by the sea in Mallorca"
            className="aspect-[4/5] w-full rounded-2xl object-cover shadow-sm"
          />
          <img
            src="/images/paris-portrait.jpeg"
            alt="Parissa in her studio holding a wooden body-contouring tool"
            className="absolute -bottom-8 -right-4 hidden w-44 rounded-2xl border-4 border-background object-cover shadow-lg md:block lg:w-56"
          />
        </div>

        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-primary">
            Calm &amp; Contour by Parissa
          </span>
          <h2 className="mt-4 text-balance font-serif text-4xl font-medium leading-tight md:text-5xl">
            A boutique body studio, brought to you
          </h2>
          <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
            Calm and Contour Clinic by Parissa is a boutique body studio
            specialising in massage, body and facial treatments and lymphatic
            drainage. Every treatment is tailored to leave you feeling restored,
            sculpted and deeply cared for.
          </p>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Prefer the comfort of your own space? Our mobile service comes to
            your residence by appointment &mdash; villa, yacht or hotel suite,
            anywhere across the Balearic Isles.
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-8">
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Specialties
              </dt>
              <dd className="mt-1 font-serif text-lg text-foreground">
                Massage &amp; Lymphatic Drainage
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Service
              </dt>
              <dd className="mt-1 font-serif text-lg text-foreground">
                Studio &amp; Mobile by Appointment
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
