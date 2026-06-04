'use client'

import { CardStack, CardStackItem } from '@/components/ui/card-stack'
import { useCursorArrow } from '@/components/ui/cursor-arrow'

const CYAN = '#1EA8D4'

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
    title: 'Chargeback Defense.',
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
  const consultationRef = useCursorArrow<HTMLAnchorElement>()
  return (
    <section
      id="partners"
      style={{ backgroundColor: '#161616', padding: '7rem 0 2rem', overflow: 'visible' }}
    >
      {/* Header */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', marginBottom: '5rem' }}>

        {/* Eyebrow pill */}
        <span style={{
          display: 'inline-block', padding: '0.3rem 0.875rem',
          backgroundColor: 'rgba(30,168,212,0.12)',
          border: '1px solid rgba(30,168,212,0.3)',
          borderRadius: 999, color: CYAN,
          fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em',
          marginBottom: '2rem', textTransform: 'uppercase',
        }}>
          Why United Fintech
        </span>

        {/* Big heading — full width */}
        <h2
          className="chrome-text"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.75rem, 6vw, 5rem)',
            fontWeight: 800,
            letterSpacing: '-0.01em',
            lineHeight: 1.0,
            marginBottom: '0.25rem',
          }}
        >
          The banks that say yes.
        </h2>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.75rem, 6vw, 5rem)',
            fontWeight: 800,
            letterSpacing: '-0.01em',
            lineHeight: 1.0,
            color: CYAN,
            marginBottom: '2.5rem',
          }}
        >
          We know them.
        </h2>

        {/* Description + CTA row */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}
        >
          <p style={{
            color: 'rgba(232,237,242,0.65)',
            fontSize: '1.1rem', lineHeight: 1.75,
            maxWidth: 520, margin: 0, flex: '1 1 320px',
          }}>
            High-risk, cross-border, complex — these are the merchants we built our entire network for. Not scraped leads. Not cold outreach. Actual phone calls to people we know.
          </p>

          <a
            ref={consultationRef}
            href="#consultation"
            className="btn-cyan"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.875rem 1.875rem',
              fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
              borderRadius: 999, whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            Start a conversation
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Full-width centered card fan */}
      <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', paddingBottom: '4rem' }}>
      <CardStack
        items={CARDS}
        cardWidth={320}
        cardHeight={430}
        autoAdvance
        intervalMs={3200}
        pauseOnHover
        showDots
        overlap={0.38}
        spreadDeg={22}
        perspectivePx={2400}
        depthPx={0}
        tiltXDeg={0}
        activeLiftPx={14}
        activeScale={1.06}
        inactiveScale={0.90}
        maxVisible={5}
        springStiffness={260}
        springDamping={30}
      />
      </div>
    </section>
  )
}
