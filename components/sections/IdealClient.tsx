'use client'
import { Globe, Zap, AlertTriangle, Landmark, Shield } from 'lucide-react'

const CLIENTS = [
  {
    icon: Globe,
    title: 'Global eCommerce Merchants',
    description: 'Businesses selling internationally that need multi-currency acquiring, cross-border payment routing, and global bank relationships.',
  },
  {
    icon: Zap,
    title: 'Complex Payment Use Cases',
    description: 'Platforms with subscription billing, marketplace payouts, multi-party transactions, or other non-standard payment flows that standard processors won\'t support.',
  },
  {
    icon: AlertTriangle,
    title: 'High-Risk Verticals',
    description: 'Merchants in categories like nutraceuticals, adult, gaming, travel, crypto-adjacent, and other sectors that mainstream acquiring banks decline or restrict.',
  },
  {
    icon: Landmark,
    title: 'Businesses Needing Embedded Banking',
    description: 'Companies looking to integrate financial services into their product — embedded accounts, card programs, or BaaS infrastructure as a feature layer.',
  },
  {
    icon: Shield,
    title: 'Merchants Seeking Risk Protection',
    description: 'Organizations recovering from account terminations, managing chargeback exposure, or building redundant processing infrastructure to protect their revenue.',
  },
]

export default function IdealClient() {
  return (
    <section className="uf-section-navy" style={{ padding: '6rem 1.5rem' }}>
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ color: '#2BB8E6', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Our Clients
          </p>
          <h2 style={{
            fontFamily: 'var(--font-outfit)', fontWeight: 200,
            fontSize: 'clamp(1.875rem, 4vw, 3rem)',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }} className="chrome-text">
            Who We Serve
          </h2>
          <p style={{ color: '#7E8794', fontSize: '1rem', marginTop: '1.25rem', maxWidth: 520, margin: '1.25rem auto 0' }}>
            We work with businesses that need more than a standard payment processor — they need a strategic financial partner.
          </p>
        </div>

        {/* Cards grid */}
        <div style={{ display: 'grid', gap: '1rem' }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {CLIENTS.map((client, i) => {
            const Icon = client.icon
            // Last row: if 5 items in 3-col layout, center the last two
            const isLastRow = i >= 3
            return (
              <div
                key={i}
                className="uf-card"
                style={{
                  padding: '1.75rem',
                  display: 'flex', flexDirection: 'column', gap: '1rem',
                  transition: 'border-color 0.2s',
                  gridColumn: isLastRow && i === 3 ? 'span 1' : undefined,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(43,184,230,0.25)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)' }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  backgroundColor: 'rgba(43,184,230,0.08)',
                  border: '1px solid rgba(43,184,230,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} color="#2BB8E6" strokeWidth={1.5} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-outfit)', fontWeight: 500, fontSize: '1rem', color: '#E8EDF2', letterSpacing: '0.01em' }}>
                  {client.title}
                </h3>
                <p style={{ color: '#7E8794', fontSize: '0.875rem', lineHeight: 1.75 }}>
                  {client.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
