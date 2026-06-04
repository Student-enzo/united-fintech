'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ServicesCarousel, ServiceItem } from '@/components/ui/services-carousel'
import { useCursorArrow } from '@/components/ui/cursor-arrow'

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
    href: '/contact?interest=all&topic=Strategic+Advisory',
  },
  {
    id: 5,
    subtitle: 'Market Coverage',
    title: 'Global Markets & Cross-Border Payment Corridors',
    excerpt: '150+ acquiring and banking partners across six continents. Multi-currency settlement, local payment methods, and cross-border routing built for global operations.',
    imageUrl: '/brand-globe-network.png',
    href: '/contact?interest=all&topic=Global+Markets+%26+Cross-Border',
  },
  {
    id: 6,
    subtitle: 'FX & Treasury',
    title: 'Tailored FX, Treasury & Capital Flow Solutions',
    excerpt: 'Real-time FX, treasury management, and capital flow solutions with a dedicated hedging desk. Protect margins on international settlements and streamline cash repatriation.',
    imageUrl: '/brand-platform.png',
    href: '/contact?interest=all&topic=FX+%26+Treasury+Solutions',
  },
]

const CYAN = '#1EA8D4'
const TEXT = '#E8EDF2'

export default function IdealClient() {
  const servicesRef = useCursorArrow<HTMLAnchorElement>()
  return (
    <section id="services" style={{ backgroundColor: '#161616', padding: '6rem 1.5rem' }}>
      <div className="max-w-7xl mx-auto">

        {/* Header row — HOP style: left title + right CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '3.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <p style={{
              color: CYAN,
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}>
              Our Services
            </p>
            <h2
              className="chrome-text"
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 300,
                fontSize: 'clamp(1.875rem, 4vw, 3rem)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              Solutions Built for Global Scale
            </h2>
          </div>

          <Link
            ref={servicesRef}
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
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <ServicesCarousel items={SERVICES} />
        </motion.div>

      </div>
    </section>
  )
}
