'use client'

import { CardStack, CardStackItem } from '@/components/ui/card-stack'
import { useCursorArrow } from '@/components/ui/cursor-arrow'

const CYAN = '#1EA8D4'
const BG = '#161616'
const TEXT = '#E8EDF2'
const MUTED = '#7E8794'

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

const METRICS = [
  { value: '$5B+', label: 'Annual volume processed', sub: 'across our network' },
  { value: '150+', label: 'Banking relationships', sub: 'in 30+ countries' },
  { value: '98%', label: 'Approval rate', sub: 'for high-risk accounts' },
  { value: '72h', label: 'Average onboarding', sub: 'from intro to live' },
]

export default function WhyUs() {
  const consultationRef = useCursorArrow<HTMLAnchorElement>()

  return (
    <section
      id="partners"
      style={{ backgroundColor: BG, padding: '7rem 0 3rem', overflow: 'visible', position: 'relative' }}
    >
      {/* Subtle grid backdrop */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(30,168,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(30,168,212,0.03) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Two-column header */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[52%_48%]" style={{ gap: '4rem', alignItems: 'flex-start', marginBottom: '5rem' }}>

          {/* Left — copy */}
          <div>
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

            <h2
              className="chrome-text"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.6rem, 5.5vw, 4.5rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.0,
                marginBottom: '0.1rem',
              }}
            >
              The banks that say yes.
            </h2>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.6rem, 5.5vw, 4.5rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.0,
                color: CYAN,
                marginBottom: '2rem',
              }}
            >
              We know them.
            </h2>

            <p style={{
              color: 'rgba(232,237,242,0.65)',
              fontSize: '1.05rem', lineHeight: 1.75,
              maxWidth: 480, marginBottom: '2rem',
            }}>
              High-risk, cross-border, complex — these are the merchants we built our entire network for. Not scraped leads. Not cold outreach. Actual phone calls to people we know.
            </p>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.25rem' }}>
              {['High-Risk Approved', 'No Setup Fees', 'Same-Week Response'].map((badge) => (
                <span key={badge} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.35rem 0.85rem',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 999,
                  color: 'rgba(232,237,242,0.7)', fontSize: '0.78rem', fontWeight: 500,
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  {badge}
                </span>
              ))}
            </div>

            <a
              ref={consultationRef}
              href="#consultation"
              className="btn-cyan"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.875rem 1.875rem',
                fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
                borderRadius: 999, whiteSpace: 'nowrap',
              }}
            >
              Start a conversation
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Right — metrics panel */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {METRICS.map((m, i) => (
              <div
                key={m.label}
                style={{
                  padding: '1.75rem 1.5rem',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(30,168,212,0.12)',
                  borderRadius: 16,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(30,168,212,0.35)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(30,168,212,0.12)')}
              >
                {/* Top-left accent dot */}
                <div style={{
                  position: 'absolute', top: 14, right: 14,
                  width: 6, height: 6, borderRadius: '50%',
                  backgroundColor: CYAN, opacity: 0.6,
                  boxShadow: `0 0 8px ${CYAN}`,
                }} />
                <p style={{
                  color: CYAN, fontWeight: 900,
                  fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                  lineHeight: 1, marginBottom: '0.5rem',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '-0.02em',
                }}>
                  {m.value}
                </p>
                <p style={{ color: TEXT, fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.3, marginBottom: '0.2rem' }}>
                  {m.label}
                </p>
                <p style={{ color: MUTED, fontSize: '0.72rem', lineHeight: 1.3 }}>
                  {m.sub}
                </p>
              </div>
            ))}

            {/* Bottom-spanning divider strip */}
            <div style={{
              gridColumn: '1 / -1',
              padding: '1.25rem 1.5rem',
              backgroundColor: 'rgba(30,168,212,0.07)',
              border: '1px solid rgba(30,168,212,0.18)',
              borderRadius: 14,
              display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                backgroundColor: 'rgba(30,168,212,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <p style={{ color: TEXT, fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.1rem' }}>
                  Compliant across every jurisdiction
                </p>
                <p style={{ color: MUTED, fontSize: '0.72rem' }}>
                  AML/KYC, PCI DSS, and local licensing — already handled.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', marginBottom: '3.5rem' }}>
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(30,168,212,0.2) 30%, rgba(30,168,212,0.2) 70%, transparent)' }} />
      </div>

      {/* Full-width centered card fan */}
      <div style={{ width: '100%', maxWidth: 960, margin: '0 auto', paddingBottom: '4rem' }}>
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
