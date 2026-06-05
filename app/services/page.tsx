'use client'
import Link from 'next/link'
import Navbar from '@/components/sections/Navbar'
import BookCall from '@/components/sections/BookCall'
import Footer from '@/components/sections/Footer'

const CYAN = '#1EA8D4'
const TEXT = '#E8EDF2'
const BG = '#0E1118'
const CARD_BG = '#161616'

const SERVICES = [
  {
    id: 1,
    subtitle: 'Merchant Processing',
    title: 'Global Acquiring & Payment Infrastructure',
    excerpt: 'End-to-end merchant account acquisition across 30+ countries — from mainstream to high-risk verticals. We connect you to the right acquiring relationships fast.',
    imageUrl: '/brand-merchant.png',
    href: '/services/merchant-processing',
    ctaLabel: 'Explore Service',
  },
  {
    id: 2,
    subtitle: 'Embedded Finance',
    title: 'Banking Infrastructure for Your Platform',
    excerpt: 'BaaS relationships, embedded accounts, card issuing, and API-first financial infrastructure. Build financial products without becoming a bank.',
    imageUrl: '/brand-embedded.png',
    href: '/services/embedded-finance',
    ctaLabel: 'Explore Service',
  },
  {
    id: 3,
    subtitle: 'Risk Mitigation',
    title: 'Multi-Processor Redundancy & Protection',
    excerpt: 'Chargeback management, reserve negotiation, and compliance frameworks that keep revenue flowing. Redundant routing so a single processor failure never takes you down.',
    imageUrl: '/brand-risk.png',
    href: '/services/risk-mitigation',
    ctaLabel: 'Explore Service',
  },
  {
    id: 4,
    subtitle: 'Advisory & Strategy',
    title: 'Strategic Advisory from Setup Through Scale',
    excerpt: 'From initial setup through ongoing expansion, our dedicated team guides your payments strategy — processor selection, contract negotiation, and long-term optimization.',
    imageUrl: '/brand-office.png',
    href: '/contact?interest=all&topic=Strategic+Advisory',
    ctaLabel: 'Book a Call',
  },
  {
    id: 5,
    subtitle: 'Market Coverage',
    title: 'Global Markets & Cross-Border Payment Corridors',
    excerpt: '150+ acquiring and banking partners across six continents. Multi-currency settlement, local payment methods, and cross-border routing built for global operations.',
    imageUrl: '/brand-globe-network.png',
    href: '/contact?interest=all&topic=Global+Markets',
    ctaLabel: 'Get In Touch',
  },
  {
    id: 6,
    subtitle: 'FX & Treasury',
    title: 'Tailored FX, Treasury & Capital Flow Solutions',
    excerpt: 'Real-time FX, treasury management, and capital flow solutions with a dedicated hedging desk. Protect margins on international settlements and streamline cash repatriation.',
    imageUrl: '/brand-platform.png',
    href: '/contact?interest=all&topic=FX+%26+Treasury',
    ctaLabel: 'Get In Touch',
  },
]

function ArrowRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M2.5 6.5h8m0 0L7 3m3.5 3.5L7 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ServiceCard({ service }: { service: typeof SERVICES[0] }) {
  return (
    <div
      style={{
        background: CARD_BG,
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '1.25rem',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'rgba(30,168,212,0.3)'
        el.style.boxShadow = '0 8px 32px rgba(30,168,212,0.08)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'rgba(255,255,255,0.07)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* Image */}
      <img
        src={service.imageUrl}
        alt={service.title}
        onError={e => { (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/600x352/1e1e1e/1EA8D4?text=UF' }}
        style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
      />

      {/* Body */}
      <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Badge */}
        <span style={{
          display: 'inline-block',
          alignSelf: 'flex-start',
          background: 'rgba(30,168,212,0.1)',
          color: CYAN,
          padding: '0.2rem 0.65rem',
          borderRadius: 999,
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          {service.subtitle}
        </span>

        {/* Title */}
        <h3 style={{
          color: TEXT,
          fontSize: '1.05rem',
          fontWeight: 800,
          fontFamily: 'var(--font-heading)',
          lineHeight: 1.25,
          margin: 0,
        }}>
          {service.title}
        </h3>

        {/* Excerpt */}
        <p style={{
          color: 'rgba(232,237,242,0.6)',
          fontSize: '0.875rem',
          lineHeight: 1.7,
          flex: 1,
          margin: 0,
        }}>
          {service.excerpt}
        </p>

        {/* CTA */}
        <div style={{ marginTop: 'auto', paddingTop: '1.25rem' }}>
          <Link
            href={service.href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: CYAN,
              color: '#0A0C12',
              fontWeight: 700,
              fontSize: '0.8rem',
              padding: '0.6rem 1.25rem',
              borderRadius: 999,
              textDecoration: 'none',
              transition: 'opacity 0.15s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
          >
            {service.ctaLabel}
            <ArrowRight />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: BG, color: TEXT }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '8rem 1.5rem 5rem', backgroundColor: BG, textAlign: 'center' }}>
        <p style={{
          color: CYAN,
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginBottom: '1.25rem',
        }}>
          Our Services
        </p>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 900,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: TEXT,
          margin: '0 0 1.25rem',
          lineHeight: 1.1,
        }}>
          Everything You Need to Scale
        </h1>
        <p style={{
          color: '#7E8794',
          fontSize: '1rem',
          lineHeight: 1.75,
          maxWidth: 560,
          margin: '0 auto',
        }}>
          From acquiring to embedded finance — a full-stack payments partner for ambitious businesses.
        </p>
      </section>

      {/* Services Grid */}
      <section style={{ padding: '4rem 1.5rem 8rem', backgroundColor: BG }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section style={{ backgroundColor: BG, padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <p style={{
            color: CYAN,
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
          }}>
            Ready to Scale?
          </p>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 900,
            fontSize: 'clamp(1.6rem, 3vw, 2.5rem)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: TEXT,
            margin: '0 0 1.25rem',
            lineHeight: 1.15,
          }}>
            Get Your Custom Payments Strategy
          </h2>
          <p style={{
            color: '#7E8794',
            fontSize: '1rem',
            lineHeight: 1.75,
            marginBottom: '2.5rem',
          }}>
            Book a free consultation with our team. We&apos;ll map the right acquiring, banking, and risk strategy for your business.
          </p>
          <a
            href="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: CYAN,
              color: '#0A0C12',
              fontWeight: 700,
              fontSize: '0.9rem',
              padding: '0.875rem 2rem',
              borderRadius: 999,
              textDecoration: 'none',
              transition: 'opacity 0.15s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
          >
            Book a Free Consultation →
          </a>
        </div>
      </section>

      <BookCall />
      <Footer />
    </main>
  )
}
