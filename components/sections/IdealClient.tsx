'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCursorArrow } from '@/components/ui/cursor-arrow'

const SERVICES = [
  {
    image: '/brand-merchant.png',
    category: 'MERCHANT PROCESSING',
    title: 'Global Acquiring & Payment Infrastructure',
    desc: 'End-to-end merchant account acquisition across 30+ countries — from mainstream to high-risk verticals.',
    href: '/services/merchant-processing',
  },
  {
    image: '/brand-embedded.png',
    category: 'EMBEDDED FINANCE',
    title: 'Banking Infrastructure for Your Platform',
    desc: 'BaaS relationships, embedded accounts, card issuing, and API-first financial infrastructure.',
    href: '/services/embedded-finance',
  },
  {
    image: '/brand-risk.png',
    category: 'RISK MITIGATION',
    title: 'Multi-Processor Redundancy & Protection',
    desc: 'Chargeback management, reserve negotiation, and compliance frameworks that keep revenue flowing.',
    href: '/services/risk-mitigation',
  },
]

function ServiceCard({ image, category, title, desc, href }: (typeof SERVICES)[0]) {
  const [hovered, setHovered] = useState(false)
  const learnMoreRef = useCursorArrow<HTMLAnchorElement>()

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: '#141C28',
        border: `1px solid ${hovered ? 'rgba(43,184,230,0.28)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 16,
        overflow: 'hidden',
        transition: 'border-color 0.2s ease',
      }}
    >
      <img
        src={image}
        alt={title}
        style={{
          width: '100%',
          height: 220,
          objectFit: 'cover',
          borderRadius: '12px 12px 0 0',
          display: 'block',
        }}
      />
      <div style={{ padding: '1.5rem' }}>
        <p style={{
          color: '#2BB8E6',
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginBottom: '0.625rem',
        }}>
          {category}
        </p>
        <p style={{
          color: '#E8EDF2',
          fontWeight: 700,
          fontSize: '1rem',
          lineHeight: 1.4,
          marginBottom: '0.625rem',
        }}>
          {title}
        </p>
        <p style={{
          color: '#7E8794',
          fontSize: '0.875rem',
          lineHeight: 1.6,
          marginBottom: '1.25rem',
        }}>
          {desc}
        </p>
        <a
          ref={learnMoreRef}
          href={href}
          style={{
            color: '#2BB8E6',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Learn More →
        </a>
      </div>
    </div>
  )
}

export default function IdealClient() {
  return (
    <section style={{ backgroundColor: '#161616', padding: '6rem 0' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <p style={{
            color: '#2BB8E6',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
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
            }}
          >
            Solutions Built for Global Scale
          </h2>
          <p style={{
            color: '#7E8794',
            fontSize: '1rem',
            marginTop: '1.25rem',
            maxWidth: 520,
            margin: '1.25rem auto 0',
          }}>
            A complete platform for merchant processing, risk management, and financial infrastructure.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {SERVICES.map((service) => (
            <ServiceCard key={service.href} {...service} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
