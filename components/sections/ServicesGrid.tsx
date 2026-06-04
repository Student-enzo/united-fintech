'use client'

import Link from 'next/link'
import { ServicesCarousel, ServiceItem } from '@/components/ui/services-carousel'

const CYAN = '#2BB8E6'
const TEXT = '#E8EDF2'
const MUTED = '#7E8794'

const SERVICES: ServiceItem[] = [
  {
    id: 1,
    subtitle: 'Merchant Processing',
    title: 'Global Acquiring & Payment Infrastructure',
    excerpt: 'End-to-end merchant account acquisition across 30+ countries — from mainstream to high-risk verticals. We connect you to the right acquiring relationships fast.',
    imageUrl: '/brand-merchant.png',
    href: '/services/merchant-processing',
  },
  {
    id: 2,
    subtitle: 'Embedded Finance',
    title: 'Banking Infrastructure for Your Platform',
    excerpt: 'BaaS relationships, embedded accounts, card issuing, and API-first financial infrastructure. Build financial products without becoming a bank.',
    imageUrl: '/brand-embedded.png',
    href: '/services/embedded-finance',
  },
  {
    id: 3,
    subtitle: 'Risk Mitigation',
    title: 'Multi-Processor Redundancy & Protection',
    excerpt: 'Chargeback management, reserve negotiation, and compliance frameworks that keep revenue flowing. Redundant routing so a single processor failure never takes you down.',
    imageUrl: '/brand-risk.png',
    href: '/services/risk-mitigation',
  },
  {
    id: 4,
    subtitle: 'Advisory & Strategy',
    title: 'Strategic Advisory from Setup Through Scale',
    excerpt: 'From initial setup through ongoing expansion, our dedicated team guides your payments strategy — processor selection, contract negotiation, and long-term optimization.',
    imageUrl: '/brand-office.png',
    href: '/#consultation',
  },
  {
    id: 5,
    subtitle: 'Market Coverage',
    title: 'Global Markets & Cross-Border Payment Corridors',
    excerpt: '150+ acquiring and banking partners across six continents. Multi-currency settlement, local payment methods, and cross-border routing built for global operations.',
    imageUrl: '/brand-globe-network.png',
    href: '/#consultation',
  },
  {
    id: 6,
    subtitle: 'FX & Treasury',
    title: 'Tailored FX, Treasury & Capital Flow Solutions',
    excerpt: 'Real-time FX, treasury management, and capital flow solutions with a dedicated hedging desk. Protect margins on international settlements and streamline cash repatriation.',
    imageUrl: '/brand-platform.png',
    href: '/#consultation',
  },
]

export default function ServicesGrid() {
  return (
    <section id="services" style={{ backgroundColor: '#161616', padding: '5rem 1.5rem' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ color: CYAN, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              Our Services
            </p>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 900,
              color: TEXT,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              lineHeight: 1.05,
              margin: 0,
            }}>
              Solutions Built for Global Scale
            </h2>
          </div>
          <Link
            href="/services"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              color: CYAN, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none',
              whiteSpace: 'nowrap', transition: 'gap 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.gap = '0.65rem')}
            onMouseLeave={(e) => (e.currentTarget.style.gap = '0.4rem')}
          >
            All services
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Carousel */}
        <ServicesCarousel items={SERVICES} />

      </div>
    </section>
  )
}
