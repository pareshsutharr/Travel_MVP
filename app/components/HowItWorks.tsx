const steps = [
  {
    number: '01',
    title: 'Soma',
    description:
      'Tell Soma about the journey you imagine — the feeling, the pace, the people.',
  },
  {
    number: '02',
    title: 'See the draft',
    description:
      'Soma builds a named itinerary with real hotels, real guides, and real prices.',
  },
  {
    number: '03',
    title: 'One tap',
    description:
      'Approve. Flights, stays, cabs, visas, SIM, insurance — confirmed in seconds.',
  },
  {
    number: '04',
    title: 'Walk',
    description:
      'Every morning, your day is laid out. Soma and your guide are one message away.',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 px-6 lg:px-8"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <p
            className="text-xs tracking-widest uppercase mb-4"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#B89A4E', letterSpacing: '0.2em' }}
          >
            How It Works
          </p>
          <h2
            className="text-4xl lg:text-5xl xl:text-6xl leading-tight max-w-2xl"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#1C1917', fontWeight: 400 }}
          >
            Four steps from{' '}
            <em style={{ color: '#B89A4E', fontStyle: 'italic' }}>wish to ticket.</em>
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line (desktop only, not on last item) */}
              {index < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-6 left-full w-full h-px -translate-x-1/2 z-0"
                  style={{ backgroundColor: '#E8E3D9', width: 'calc(100% - 2rem)' }}
                />
              )}

              <div className="relative z-10">
                {/* Number */}
                <p
                  className="text-4xl lg:text-5xl mb-4"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#B89A4E', fontWeight: 300 }}
                >
                  {step.number}
                </p>

                {/* Title */}
                <h3
                  className="text-2xl lg:text-3xl mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#1C1917', fontWeight: 500 }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#9C9589', fontWeight: 300 }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 flex justify-center">
          <button
            className="px-8 py-4 rounded-full text-sm text-white transition-all duration-200 hover:opacity-90"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif", backgroundColor: '#B89A4E', fontWeight: 400 }}
          >
            Begin with Soma →
          </button>
        </div>
      </div>
    </section>
  );
}
