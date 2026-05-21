const footerLinks = {
  Journeys: [
    'The Slow Ganges',
    'Three Buddhas',
    'Annapurna in Hush',
    'Kashi after Dusk',
    'Himalayan Silence',
  ],
  Company: [
    'How it works',
    'About Solura',
    'Reviews',
    'The Story Line',
  ],
  Support: [
    'Counsel',
    'SOS line',
    'Visa help',
    'Insurance',
  ],
};

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1C1917', color: '#FAFAF8' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Logo & CTA Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Logo */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ border: '1px solid rgba(184, 154, 78, 0.5)' }}
                >
                  <span
                    className="text-sm font-semibold"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#B89A4E' }}
                  >
                    S
                  </span>
                </div>
                <span
                  className="text-xl font-semibold tracking-widest"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#FAFAF8' }}
                >
                  SOLURA
                </span>
              </div>
              <span
                className="text-xs tracking-widest uppercase ml-9"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  color: 'rgba(156, 149, 137, 0.8)',
                  letterSpacing: '0.15em',
                }}
              >
                Travel · India &amp; Nepal
              </span>
            </div>

            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: 'rgba(156, 149, 137, 0.8)', fontWeight: 300 }}
            >
              Luxury curated journeys through India and Nepal. Every detail handled before you arrive.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              <button
                className="w-fit px-6 py-3 rounded-full text-sm text-white transition-all duration-200 hover:opacity-90"
                style={{ fontFamily: "'DM Sans', system-ui, sans-serif", backgroundColor: '#B89A4E', fontWeight: 400 }}
              >
                Begin a journey →
              </button>
              <button
                className="w-fit px-6 py-3 rounded-full text-sm transition-all duration-200 hover:border-[#B89A4E] hover:text-[#B89A4E]"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  color: 'rgba(250, 250, 248, 0.7)',
                  border: '1px solid rgba(250, 250, 248, 0.2)',
                  fontWeight: 300,
                }}
              >
                Talk with Soma →
              </button>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4
                className="text-xs tracking-widest uppercase mb-5"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  color: 'rgba(156, 149, 137, 0.6)',
                  letterSpacing: '0.15em',
                }}
              >
                {heading}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm transition-colors duration-200 hover:text-[#B89A4E]"
                      style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: 'rgba(250, 250, 248, 0.6)', fontWeight: 300 }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs"
          style={{ borderTop: '1px solid rgba(232, 227, 217, 0.15)' }}
        >
          <p
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: 'rgba(156, 149, 137, 0.6)', fontWeight: 300 }}
          >
            © 2026 Solura Travel · India &amp; Nepal · solura.travel
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="transition-colors hover:text-[#B89A4E]"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: 'rgba(156, 149, 137, 0.6)', fontWeight: 300 }}
            >
              Privacy
            </a>
            <a
              href="#"
              className="transition-colors hover:text-[#B89A4E]"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: 'rgba(156, 149, 137, 0.6)', fontWeight: 300 }}
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
