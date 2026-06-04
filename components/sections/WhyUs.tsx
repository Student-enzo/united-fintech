'use client'

import { FocusRail, FocusRailItem } from '@/components/ui/focus-rail'

const ITEMS: FocusRailItem[] = [
  {
    id: 'expertise',
    title: 'Deep Expertise',
    description: 'We specialize in merchant categories that mainstream brokers avoid — high-risk verticals, cross-border businesses, and complex payment use cases.',
    imageSrc: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=800&fit=crop',
    meta: 'Strategy',
    href: '/about',
  },
  {
    id: 'network',
    title: 'Global Provider Network',
    description: 'Years of relationship-building with acquiring banks, card networks, and payment processors across 30+ countries.',
    imageSrc: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=800&fit=crop',
    meta: 'Network',
    href: '/about',
  },
  {
    id: 'stability',
    title: 'Stability & Optionality',
    description: 'Multiple processors, redundant acquiring, failover routing — your revenue never stops because one provider has an issue.',
    imageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=800&fit=crop',
    meta: 'Infrastructure',
  },
  {
    id: 'risk',
    title: 'Risk Mitigation',
    description: 'From chargeback management to reserve negotiation to PCI compliance frameworks — protection built into your payment stack from the start.',
    imageSrc: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=800&fit=crop',
    meta: 'Protection',
  },
  {
    id: 'advisory',
    title: 'Strategic Advisory',
    description: 'United Fintech is a strategic partner, not a lead-gen broker. We stay involved in structuring, onboarding, and ongoing optimization.',
    imageSrc: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=800&fit=crop',
    meta: 'Advisory',
    href: '/about',
  },
]

export default function WhyUs() {
  return (
    <section style={{ backgroundColor: '#0D1B2A', padding: '6rem 1.5rem' }}>
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ color: '#2BB8E6', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Why Choose Us
          </p>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 200,
            fontSize: 'clamp(1.875rem, 4vw, 3rem)',
            letterSpacing: '0.08em', textTransform: 'uppercase', maxWidth: 560,
          }} className="chrome-text">
            Why United Fintech
          </h2>
        </div>

        <FocusRail
          items={ITEMS}
          autoPlay={true}
          interval={5000}
          className="rounded-2xl overflow-hidden"
        />
      </div>
    </section>
  )
}
