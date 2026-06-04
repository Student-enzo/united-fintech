'use client'

import Link from 'next/link'

const BG = '#161616'
const CARD = '#1e1e1e'
const TEXT = '#E8EDF2'
const MUTED = '#7E8794'
const CYAN = '#2BB8E6'
const BORDER = 'rgba(255,255,255,0.06)'

const SERVICES = [
  {
    name: 'Global acquiring for high-risk & complex eCommerce',
    sub: 'Merchant Processing',
    from: '30+ Countries',
    time: '24/7 Support',
    href: '/services/merchant-processing',
    bg: 'https://images.pexels.com/photos/6771985/pexels-photo-6771985.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  },
  {
    name: 'Banking infrastructure built directly into your platform',
    sub: 'Embedded Finance',
    from: 'BaaS Ready',
    time: 'API First',
    href: '/services/embedded-finance',
    bg: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  },
  {
    name: 'Multi-processor redundancy & chargeback protection',
    sub: 'Risk Mitigation',
    from: 'Zero Downtime',
    time: 'PCI Compliant',
    href: '/services/risk-mitigation',
    bg: 'https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  },
  {
    name: 'Strategic advisory from setup through ongoing scale',
    sub: 'Advisory & Strategy',
    from: 'Long-Term',
    time: 'Dedicated Team',
    href: '/#consultation',
    bg: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  },
  {
    name: 'Global markets and cross-border payment corridors',
    sub: 'Market Coverage',
    from: '150+ Partners',
    time: 'Multi-currency',
    href: '/#markets',
    bg: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  },
  {
    name: 'Tailored FX, treasury, and capital flow solutions',
    sub: 'FX & Treasury',
    from: 'Real-time FX',
    time: 'Hedging Desk',
    href: '/#consultation',
    bg: 'https://images.pexels.com/photos/95916/pexels-photo-95916.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
  },
]

export default function ServicesGrid() {
  return (
    <section id="services" className="mob-pad-section" style={{ backgroundColor: BG, padding: '5rem 1.5rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
          <div>
            <p style={{ color: CYAN, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>WHAT WE DO</p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 800, color: TEXT, letterSpacing: '-0.02em' }}>
              Solutions that drive global finance.
            </h2>
          </div>
          <Link
            href="/about"
            style={{ color: CYAN, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0, transition: 'gap 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.gap = '0.65rem' }}
            onMouseLeave={(e) => { e.currentTarget.style.gap = '0.4rem' }}
          >
            All solutions
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>

        {/* Card grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {SERVICES.map((s) => (
            <Link
              key={s.href + s.sub}
              href={s.href}
              className="service-card"
              style={{ backgroundImage: `url('${s.bg}')` }}
            >
              <div className="service-card-content">
                {/* Tag */}
                <div style={{
                  position: 'absolute', top: '1.25rem', left: '1.25rem',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: 'rgba(43,184,230,0.18)',
                  border: '1px solid rgba(43,184,230,0.35)',
                  borderRadius: 999,
                  color: CYAN,
                  fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em',
                  zIndex: 2,
                }}>
                  {s.sub.toUpperCase()}
                </div>

                {/* Bottom content */}
                <p style={{ color: TEXT, fontWeight: 700, fontSize: '1rem', lineHeight: 1.3, marginBottom: '0.75rem' }}>
                  {s.name}
                </p>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ color: CYAN, fontWeight: 700, fontSize: '0.82rem' }}>{s.from}</span>
                  <span style={{ width: 1, height: 12, backgroundColor: BORDER }} />
                  <span style={{ color: MUTED, fontSize: '0.78rem' }}>{s.time}</span>
                  <span style={{ marginLeft: 'auto' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
