const testimonials = [
  {
    quote: 'Felt like a friend in Delhi had thought of everything before we arrived.',
    name: 'Margaret & John · USA · 2026',
    journey: 'The Slow Ganges · 14 days',
  },
  {
    quote: 'Soma planned better than I could have in three months of research.',
    name: 'Sarah B. · UK · 2025',
    journey: 'Kashi Discovery · 9 days',
  },
  {
    quote: 'The Annapurna trail was hard. Everything else was effortless.',
    name: 'David & Anna M. · Germany · 2026',
    journey: 'Annapurna in Hush · 12 days',
  },
];

export default function TestimonialsSection() {
  return (
    <section
      id="reviews"
      className="bg-platinum px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <p
            className="text-xs tracking-widest uppercase mb-4"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#D4AF35', letterSpacing: '0.2em' }}
          >
            Reviews
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#2D2F33', fontWeight: 400 }}
          >
            What the path{' '}
            <em style={{ color: '#D4AF35', fontStyle: 'italic' }}>feels like.</em>
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="flex flex-col justify-between gap-6 rounded-2xl border border-pale-sky bg-platinum p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, si) => (
                  <span key={si} style={{ color: '#D4AF35', fontSize: '0.875rem' }}>★</span>
                ))}
              </div>

              {/* Quote */}
              <p
                className="text-lg lg:text-xl leading-relaxed flex-1"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  color: '#2D2F33',
                  fontStyle: 'italic',
                  fontWeight: 400,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Attribution */}
              <div style={{ borderTop: '1px solid #BFDDE7', paddingTop: '1rem' }}>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#2D2F33', fontWeight: 500 }}
                >
                  {t.name}
                </p>
                <p
                  className="text-xs"
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#D4AF35' }}
                >
                  {t.journey}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust strip */}
        <div
          className="mt-12 flex flex-col items-center justify-center gap-6 rounded-2xl bg-graphite py-8 sm:flex-row sm:gap-12"
        >
          <div className="text-center">
            <p
              className="text-3xl lg:text-4xl mb-1"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#F3F7F8', fontWeight: 500 }}
            >
              4.9
            </p>
            <p
              className="text-xs tracking-widest uppercase"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#BFDDE7', letterSpacing: '0.1em' }}
            >
              Trustpilot Rating
            </p>
          </div>
          <div className="hidden h-10 w-px bg-platinum/15 sm:block" />
          <div className="text-center">
            <p
              className="text-3xl lg:text-4xl mb-1"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#F3F7F8', fontWeight: 500 }}
            >
              1,420+
            </p>
            <p
              className="text-xs tracking-widest uppercase"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#BFDDE7', letterSpacing: '0.1em' }}
            >
              Journeys Completed
            </p>
          </div>
          <div className="hidden h-10 w-px bg-platinum/15 sm:block" />
          <div className="text-center">
            <p
              className="text-3xl lg:text-4xl mb-1"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#F3F7F8', fontWeight: 500 }}
            >
              24×7
            </p>
            <p
              className="text-xs tracking-widest uppercase"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#BFDDE7', letterSpacing: '0.1em' }}
            >
              Live Counsel
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
