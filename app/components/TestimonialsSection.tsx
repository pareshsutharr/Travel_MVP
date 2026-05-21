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
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: '#FAFAF8' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <p
            className="text-xs tracking-widest uppercase mb-4"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#B89A4E', letterSpacing: '0.2em' }}
          >
            Reviews
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#1C1917', fontWeight: 400 }}
          >
            What the path{' '}
            <em style={{ color: '#B89A4E', fontStyle: 'italic' }}>feels like.</em>
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 flex flex-col justify-between gap-6 transition-shadow duration-300 hover:shadow-md"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E3D9' }}
            >
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, si) => (
                  <span key={si} style={{ color: '#B89A4E', fontSize: '0.875rem' }}>★</span>
                ))}
              </div>

              {/* Quote */}
              <p
                className="text-lg lg:text-xl leading-relaxed flex-1"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  color: '#1C1917',
                  fontStyle: 'italic',
                  fontWeight: 400,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Attribution */}
              <div style={{ borderTop: '1px solid #E8E3D9', paddingTop: '1rem' }}>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#1C1917', fontWeight: 500 }}
                >
                  {t.name}
                </p>
                <p
                  className="text-xs"
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#B89A4E' }}
                >
                  {t.journey}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust strip */}
        <div
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 py-8 rounded-2xl"
          style={{ backgroundColor: '#F5F0E8' }}
        >
          <div className="text-center">
            <p
              className="text-3xl lg:text-4xl mb-1"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#1C1917', fontWeight: 500 }}
            >
              4.9
            </p>
            <p
              className="text-xs tracking-widest uppercase"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#9C9589', letterSpacing: '0.1em' }}
            >
              Trustpilot Rating
            </p>
          </div>
          <div className="hidden sm:block h-10 w-px" style={{ backgroundColor: '#E8E3D9' }} />
          <div className="text-center">
            <p
              className="text-3xl lg:text-4xl mb-1"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#1C1917', fontWeight: 500 }}
            >
              1,420+
            </p>
            <p
              className="text-xs tracking-widest uppercase"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#9C9589', letterSpacing: '0.1em' }}
            >
              Journeys Completed
            </p>
          </div>
          <div className="hidden sm:block h-10 w-px" style={{ backgroundColor: '#E8E3D9' }} />
          <div className="text-center">
            <p
              className="text-3xl lg:text-4xl mb-1"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#1C1917', fontWeight: 500 }}
            >
              24×7
            </p>
            <p
              className="text-xs tracking-widest uppercase"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#9C9589', letterSpacing: '0.1em' }}
            >
              Live Counsel
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
