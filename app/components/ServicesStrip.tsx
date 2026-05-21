const services = [
  {
    label: 'FLIGHTS',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />
      </svg>
    ),
  },
  {
    label: 'STAYS',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: 'CABS',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    label: 'VISAS',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    label: 'SIM',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <path d="M12 18h.01" />
      </svg>
    ),
  },
  {
    label: 'MONEY',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    label: 'GUIDE',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

const ServiceItem = ({ label, icon }: { label: string; icon: React.ReactNode }) => (
  <>
    <div
      className="flex items-center gap-2 mx-6 flex-shrink-0"
      style={{ color: '#9C9589' }}
    >
      <span style={{ color: '#9C9589' }}>{icon}</span>
      <span
        className="text-xs tracking-widest uppercase"
        style={{ fontFamily: "'DM Sans', system-ui, sans-serif", letterSpacing: '0.15em', fontWeight: 400 }}
      >
        {label}
      </span>
    </div>
    <span
      className="flex-shrink-0 text-sm"
      style={{ color: '#B89A4E' }}
    >
      ·
    </span>
  </>
);

export default function ServicesStrip() {
  return (
    <div
      className="w-full overflow-hidden py-5"
      style={{ backgroundColor: '#F5F0E8', borderTop: '1px solid #E8E3D9', borderBottom: '1px solid #E8E3D9' }}
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {/* First set */}
        {services.map((s, i) => (
          <ServiceItem key={`a-${i}`} label={s.label} icon={s.icon} />
        ))}
        {/* Duplicate for seamless loop */}
        {services.map((s, i) => (
          <ServiceItem key={`b-${i}`} label={s.label} icon={s.icon} />
        ))}
        {/* Third set to ensure seamless loop */}
        {services.map((s, i) => (
          <ServiceItem key={`c-${i}`} label={s.label} icon={s.icon} />
        ))}
        {services.map((s, i) => (
          <ServiceItem key={`d-${i}`} label={s.label} icon={s.icon} />
        ))}
      </div>
    </div>
  );
}
