import Link from 'next/link'
import SoluraLogo from './SoluraLogo'

const footerLinks = {
  Journeys: [
    ['The Slow Ganges', '/journeys/the-slow-ganges'],
    ['Three Buddhas', '/journeys/three-buddhas'],
    ['Annapurna in Hush', '/journeys/annapurna-in-hush'],
    ['Kashi after Dusk', '/journeys?category=spiritual'],
    ['Himalayan Silence', '/journeys?category=wellness'],
  ],
  Company: [
    ['How it works', '/#how-it-works'],
    ['About Solura', '/#solutions'],
    ['Reviews', '/#reviews'],
    ['The Story Line', '/journeys'],
  ],
  Support: [
    ['Counsel', '/build/type'],
    ['SOS line', '/dashboard/counsel'],
    ['Visa help', '/dashboard/documents'],
    ['Insurance', '/dashboard/documents'],
  ],
};

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#2D2F33', color: '#F3F7F8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 gap-8 sm:gap-12 lg:grid-cols-5 lg:gap-8">
          {/* Logo & CTA Column */}
          <div className="col-span-2 lg:col-span-2 flex flex-col gap-6">
            {/* Logo */}
            <SoluraLogo href="/" showTagline variant="light" className="w-40" />

            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: 'rgba(156, 149, 137, 0.8)', fontWeight: 300 }}
            >
              Luxury curated journeys through India and Nepal. Every detail handled before you arrive.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              <Link
                href="/build/type"
                className="w-fit px-6 py-3 rounded-full text-sm text-platinum transition-all duration-200 hover:opacity-90"
                style={{ fontFamily: "'DM Sans', system-ui, sans-serif", backgroundColor: '#D4AF35', fontWeight: 400 }}
              >
                Begin a journey →
              </Link>
              <Link
                href="/build/type"
                className="w-fit px-6 py-3 rounded-full text-sm transition-all duration-200 hover:border-metallic-gold hover:text-metallic-gold"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  color: 'rgba(250, 250, 248, 0.7)',
                  border: '1px solid rgba(250, 250, 248, 0.2)',
                  fontWeight: 300,
                }}
              >
                Talk with Soma →
              </Link>
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
                {links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm transition-colors duration-200 hover:text-metallic-gold"
                      style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: 'rgba(250, 250, 248, 0.6)', fontWeight: 300 }}
                    >
                      {label}
                    </Link>
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
            © 2026 Solura · A radiant inner journey · solura.travel
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="transition-colors hover:text-metallic-gold"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: 'rgba(156, 149, 137, 0.6)', fontWeight: 300 }}
            >
              Privacy
            </Link>
            <Link
              href="/"
              className="transition-colors hover:text-metallic-gold"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: 'rgba(156, 149, 137, 0.6)', fontWeight: 300 }}
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
