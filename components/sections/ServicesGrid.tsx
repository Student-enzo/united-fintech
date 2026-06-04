'use client'

import Link from 'next/link'
import { StackedCardsInteraction } from '@/components/ui/stacked-cards-interaction'
import type { CardData } from '@/components/ui/stacked-cards-interaction'

const SERVICE_CARDS: CardData[] = [
  {
    image:  'https://images.pexels.com/photos/6476259/pexels-photo-6476259.jpeg?auto=compress&cs=tinysrgb&w=800',
    name:   'Global acquiring for high-risk & complex eCommerce',
    sub:    'Merchant Processing',
    from:   '30+ Countries',
    time:   '24/7 Support',
    href:   '/services/merchant-processing',
  },
  {
    image:  'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800',
    name:   'Banking infrastructure built into your platform',
    sub:    'Embedded Finance',
    from:   'BaaS Ready',
    time:   'API First',
    href:   '/services/embedded-finance',
  },
  {
    image:  'https://images.pexels.com/photos/7620764/pexels-photo-7620764.jpeg?auto=compress&cs=tinysrgb&w=800',
    name:   'Multi-processor redundancy & chargeback protection',
    sub:    'Risk Mitigation',
    from:   'Zero Downtime',
    time:   'PCI Compliant',
    href:   '/services/risk-mitigation',
  },
]

const SERVICES = [
  {
    title: 'Merchant Processing Solutions',
    description:
      'End-to-end merchant account acquisition for global and complex eCommerce businesses. We connect you with acquiring banks and processors across 30+ countries — from mainstream to high-risk verticals.',
    href: '/services/merchant-processing',
  },
  {
    title: 'Embedded Finance',
    description:
      'Integrate banking infrastructure directly into your platform. From embedded accounts and card issuing to BaaS relationships, we structure the financial layer your product needs to scale.',
    href: '/services/embedded-finance',
  },
  {
    title: 'Risk Mitigation Strategy',
    description:
      'Protect your business from account terminations, chargebacks, and processing instability. We design multi-processor redundancy and compliance frameworks that keep your revenue flowing.',
    href: '/services/risk-mitigation',
  },
]

export default function ServicesGrid() {
  return (
    <section id="services" style={{ backgroundColor: '#0A0C12', padding: '6rem 1.5rem' }}>
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <p style={{ color: '#2BB8E6', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            What We Do
          </p>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 200,
            fontSize: 'clamp(1.875rem, 4vw, 3rem)',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }} className="chrome-text">
            Solutions That Drive Global Finance
          </h2>
        </div>

        {/* Two-column: text list left, stacked cards right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — service list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {SERVICES.map((service, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                {/* Step number */}
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(43,184,230,0.10)', border: '1px solid rgba(43,184,230,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ color: '#2BB8E6', fontSize: '0.72rem', fontWeight: 700 }}>0{i + 1}</span>
                </div>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)', fontWeight: 500,
                    fontSize: '1.05rem', color: '#E8EDF2',
                    letterSpacing: '0.02em', marginBottom: '0.625rem',
                  }}>
                    {service.title}
                  </h3>
                  <div style={{ width: 28, height: 2, backgroundColor: '#2BB8E6', borderRadius: 1, marginBottom: '0.75rem' }} />
                  <p style={{ color: '#7E8794', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '0.75rem' }}>
                    {service.description}
                  </p>
                  <Link href={service.href}
                    style={{ color: '#2BB8E6', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    Learn More →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Right — animated stacked cards */}
          <div className="hidden lg:flex items-center justify-center" style={{ minHeight: 580 }}>
            <StackedCardsInteraction
              cards={SERVICE_CARDS}
              spreadDistance={56}
              rotationAngle={8}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
