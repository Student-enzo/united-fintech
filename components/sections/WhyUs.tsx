'use client'

import { CardStack, CardStackItem } from '@/components/ui/card-stack'

const CYAN = '#2BB8E6'

const CARDS: CardStackItem[] = [
  {
    id: 1,
    title: 'High-Risk, Approved.',
    description: 'We place the accounts every mainstream broker declines.',
    imageSrc: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
    tag: 'Our Specialty',
  },
  {
    id: 2,
    title: '150+ Banking Partners',
    description: 'Real relationships built over years — not scraped from a database.',
    imageSrc: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    tag: 'The Network',
  },
  {
    id: 3,
    title: '30+ Countries',
    description: 'Cross-border coverage that actually delivers for complex merchants.',
    imageSrc: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    tag: 'Global Reach',
  },
  {
    id: 4,
    title: 'Chargeback Defense',
    description: 'Reserves, disputes, compliance — handled from day one, not day ninety.',
    imageSrc: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    tag: 'Risk Control',
  },
  {
    id: 5,
    title: '$5B+ Annual Volume',
    description: "You're in good company. Serious merchants trust us with serious money.",
    imageSrc: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
    tag: 'Scale',
  },
]

export default function WhyUs() {
  return (
    <section
      id="partners"
      style={{ backgroundColor: '#080A10', padding: '7rem 1.5rem', overflow: 'hidden' }}
    >
      <div
        style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gap: '4rem', alignItems: 'center' }}
        className="grid grid-cols-1 lg:grid-cols-2"
      >
        {/* Left — copy */}
        <div>
          <span style={{
            display: 'inline-block', padding: '0.3rem 0.875rem',
            backgroundColor: 'rgba(43,184,230,0.12)',
            border: '1px solid rgba(43,184,230,0.3)',
            borderRadius: 999, color: CYAN,
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em',
            marginBottom: '2rem', textTransform: 'uppercase',
          }}>
            Why United Fintech
          </span>

          <h2
            className="chrome-text heading-tracked"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)',
              fontWeight: 600,
              lineHeight: 1.0,
              marginBottom: '0.5rem',
            }}
          >
            The banks that say yes.
          </h2>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              lineHeight: 1.0,
              color: CYAN,
              marginBottom: '2rem',
            }}
          >
            We know them.
          </h2>

          <p style={{
            color: 'rgba(232,237,242,0.65)',
            fontSize: '1.1rem', lineHeight: 1.75,
            maxWidth: 400, marginBottom: '2.5rem',
          }}>
            High-risk, cross-border, complex — these are the merchants we built our entire network for. Not scraped leads. Not cold outreach. Actual phone calls to people we know.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
            {[
              { num: '150+', label: 'Acquiring banks & processors' },
              { num: '30+',  label: 'Countries with live relationships' },
              { num: '99.9%', label: 'Client retention rate' },
            ].map((s) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <span style={{
                  color: CYAN,
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '1.75rem',
                  minWidth: 72,
                  lineHeight: 1,
                }}>
                  {s.num}
                </span>
                <span style={{ color: 'rgba(232,237,242,0.5)', fontSize: '0.9rem', letterSpacing: '0.02em' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <a
            href="#consultation"
            className="btn-cyan"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.875rem 1.875rem',
              fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
              borderRadius: 999,
            }}
          >
            Start a conversation
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Right — card stack */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CardStack
            items={CARDS}
            cardWidth={400}
            cardHeight={270}
            autoAdvance
            intervalMs={3200}
            pauseOnHover
            showDots
            overlap={0.5}
            spreadDeg={40}
            depthPx={100}
            activeLiftPx={18}
          />
        </div>
      </div>
    </section>
  )
}
