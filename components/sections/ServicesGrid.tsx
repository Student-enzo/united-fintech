'use client'

import Link from 'next/link'
import { InteractiveImageAccordion, AccordionServiceItem } from '@/components/ui/interactive-image-accordion'

const CYAN = '#2BB8E6'
const TEXT = '#E8EDF2'
const MUTED = '#7E8794'

const SERVICES: AccordionServiceItem[] = [
  {
    id: 1,
    title: 'Global acquiring for high-risk & complex eCommerce',
    subtitle: 'Merchant Processing',
    imageUrl: 'https://images.pexels.com/photos/6771985/pexels-photo-6771985.jpeg?auto=compress&cs=tinysrgb&w=800&h=900&fit=crop',
  },
  {
    id: 2,
    title: 'Banking infrastructure built directly into your platform',
    subtitle: 'Embedded Finance',
    imageUrl: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=800&h=900&fit=crop',
  },
  {
    id: 3,
    title: 'Multi-processor redundancy & chargeback protection',
    subtitle: 'Risk Mitigation',
    imageUrl: 'https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?auto=compress&cs=tinysrgb&w=800&h=900&fit=crop',
  },
  {
    id: 4,
    title: 'Strategic advisory from setup through ongoing scale',
    subtitle: 'Advisory & Strategy',
    imageUrl: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800&h=900&fit=crop',
  },
  {
    id: 5,
    title: 'Global markets and cross-border payment corridors',
    subtitle: 'Market Coverage',
    imageUrl: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800&h=900&fit=crop',
  },
]

export default function ServicesGrid() {
  return (
    <section id="services" style={{ backgroundColor: '#161616', padding: '5rem 0' }}>

      {/* Header — constrained */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ color: CYAN, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
              CONNECTED ACROSS COUNTRIES
            </p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 800, color: TEXT, letterSpacing: '-0.02em' }}>
              Solutions that drive global finance.
            </h2>
            <p style={{ color: MUTED, fontSize: '0.9rem', marginTop: '0.6rem', maxWidth: 480, lineHeight: 1.6 }}>
              From acquiring banks to embedded finance layers — connecting ambitious businesses with global infrastructure.
            </p>
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
      </div>

      {/* Accordion — full bleed */}
      <div style={{ padding: '0 1.5rem' }}>
        <InteractiveImageAccordion items={SERVICES} defaultActiveIndex={2} />
      </div>

    </section>
  )
}
