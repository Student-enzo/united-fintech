'use client'
import Link from 'next/link'
import { CreditCard, Building2, Shield } from 'lucide-react'

const SERVICES = [
  {
    icon: CreditCard,
    title: 'Merchant Processing Solutions',
    description:
      'End-to-end merchant account acquisition for global and complex eCommerce businesses. We connect you with acquiring banks, card networks, and payment processors across 30+ countries — from mainstream to high-risk verticals.',
    href: '/services/merchant-processing',
    slug: 'merchant-processing',
  },
  {
    icon: Building2,
    title: 'Embedded Finance',
    description:
      'Integrate banking infrastructure directly into your platform. From embedded accounts and card issuing to BaaS relationships, we structure the financial layer your product needs to scale without friction.',
    href: '/services/embedded-finance',
    slug: 'embedded-finance',
  },
  {
    icon: Shield,
    title: 'Risk Mitigation Strategy',
    description:
      'Protect your business from account terminations, chargebacks, and processing instability. We design multi-processor redundancy, reserve strategies, and compliance frameworks that keep your revenue flowing.',
    href: '/services/risk-mitigation',
    slug: 'risk-mitigation',
  },
]

export default function ServicesGrid() {
  return (
    <section id="services" style={{ backgroundColor: '#0A0C12', padding: '6rem 1.5rem' }}>
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ color: '#2BB8E6', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            What We Do
          </p>
          <h2 style={{
            fontFamily: 'var(--font-outfit)', fontWeight: 200,
            fontSize: 'clamp(1.875rem, 4vw, 3rem)',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }} className="chrome-text">
            Solutions That Drive Global Finance
          </h2>
        </div>

        {/* Cards grid */}
        <div style={{ display: 'grid', gap: '1.5rem' }} className="grid grid-cols-1 md:grid-cols-3">
          {SERVICES.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.slug}
                className="uf-card"
                style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', transition: 'border-color 0.2s, transform 0.2s' }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = 'rgba(43,184,230,0.3)'
                  el.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = 'rgba(255,255,255,0.08)'
                  el.style.transform = 'translateY(0)'
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  backgroundColor: 'rgba(43,184,230,0.10)',
                  border: '1px solid rgba(43,184,230,0.20)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={22} color="#2BB8E6" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: 'var(--font-outfit)', fontWeight: 400,
                  fontSize: '1.125rem', color: '#E8EDF2',
                  letterSpacing: '0.02em',
                }}>
                  {service.title}
                </h3>

                {/* Cyan underline */}
                <div style={{ width: 32, height: 2, backgroundColor: '#2BB8E6', borderRadius: 1 }} />

                {/* Description */}
                <p style={{ color: '#7E8794', fontSize: '0.9rem', lineHeight: 1.75, flex: 1 }}>
                  {service.description}
                </p>

                {/* Learn More */}
                <Link
                  href={service.href}
                  style={{ color: '#2BB8E6', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', transition: 'gap 0.15s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.gap = '0.6rem' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.gap = '0.35rem' }}
                >
                  Learn More →
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
