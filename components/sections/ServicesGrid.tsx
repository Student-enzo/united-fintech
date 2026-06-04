'use client'

import { InteractiveImageAccordion, AccordionServiceItem } from '@/components/ui/interactive-image-accordion'

const CYAN = '#2BB8E6'
const TEXT = '#E8EDF2'
const MUTED = '#7E8794'

const SERVICES: AccordionServiceItem[] = [
  {
    id: 1,
    title: 'Global Acquiring & Payment Infrastructure',
    subtitle: 'Merchant Processing',
    imageUrl: '/brand-merchant.png',
  },
  {
    id: 2,
    title: 'Banking Infrastructure for Your Platform',
    subtitle: 'Embedded Finance',
    imageUrl: '/brand-embedded.png',
  },
  {
    id: 3,
    title: 'Multi-Processor Redundancy & Protection',
    subtitle: 'Risk Mitigation',
    imageUrl: '/brand-risk.png',
  },
  {
    id: 4,
    title: 'Strategic Advisory from Setup Through Scale',
    subtitle: 'Advisory & Strategy',
    imageUrl: '/brand-office.png',
  },
  {
    id: 5,
    title: 'Global Markets & Cross-Border Payment Corridors',
    subtitle: 'Market Coverage',
    imageUrl: '/brand-globe-network.png',
  },
  {
    id: 6,
    title: 'Tailored FX, Treasury & Capital Flow Solutions',
    subtitle: 'FX & Treasury',
    imageUrl: '/brand-platform.png',
  },
]

export default function ServicesGrid() {
  return (
    <section id="services" style={{ backgroundColor: '#161616', padding: '5rem 0' }}>

      {/* Header */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', marginBottom: '3rem', textAlign: 'center' }}>
        <p style={{ color: CYAN, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em', marginBottom: '1rem' }}>
          OUR SERVICES
        </p>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 900,
          color: TEXT,
          fontFamily: 'var(--font-heading)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          lineHeight: 1.0,
          marginBottom: '1.25rem',
        }}>
          Solutions Built for Global Scale
        </h2>
        <p style={{ color: MUTED, fontSize: '1rem', lineHeight: 1.75, maxWidth: 560, margin: '0 auto' }}>
          A complete platform for merchant processing, risk management, and financial infrastructure.
        </p>
      </div>

      {/* Accordion */}
      <div style={{ padding: '0 1.5rem' }}>
        <InteractiveImageAccordion items={SERVICES} defaultActiveIndex={1} />
      </div>

    </section>
  )
}
