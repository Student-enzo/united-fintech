'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, Network, TrendingUp, ShieldCheck, Lightbulb } from 'lucide-react'

const DIFFERENTIATORS = [
  {
    id: 'expertise',
    icon: Layers,
    title: 'Deep Expertise in Complex Merchants',
    detail:
      'We specialize in merchant categories that mainstream brokers avoid — high-risk verticals, cross-border businesses, and complex payment use cases. Our team has the technical and regulatory knowledge to structure solutions that hold.',
  },
  {
    id: 'network',
    icon: Network,
    title: 'Strategic Provider & Bank Network',
    detail:
      'Years of relationship-building with acquiring banks, card networks, and payment processors across the globe. We know who to call, what they need, and how to structure a deal that works for your specific business model.',
  },
  {
    id: 'stability',
    icon: TrendingUp,
    title: 'Stability, Optionality & Revenue Growth',
    detail:
      'We architect your processing infrastructure for resilience — multiple processors, redundant acquiring relationships, and failover routing so a single provider issue never stops your business from operating.',
  },
  {
    id: 'risk',
    icon: ShieldCheck,
    title: 'Risk Mitigation & Client Protection',
    detail:
      'From chargeback management to reserve negotiation to PCI compliance frameworks, we build protection into your payment stack from the start — not as an afterthought when something breaks.',
  },
  {
    id: 'advisory',
    icon: Lightbulb,
    title: 'High-Value Advisory — Not a Referral Source',
    detail:
      'United Fintech is a strategic partner, not a lead-gen broker. We stay involved in structuring, onboarding, and ongoing optimization. Our value is in solving problems, not collecting referral fees.',
  },
]

export default function WhyUs() {
  const [active, setActive] = useState(0)
  const current = DIFFERENTIATORS[active]

  return (
    <section style={{ backgroundColor: '#0D1B2A', padding: '6rem 1.5rem' }}>
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div style={{ marginBottom: '4rem' }}>
          <p style={{ color: '#2BB8E6', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Why Choose Us
          </p>
          <h2 style={{
            fontFamily: 'var(--font-outfit)', fontWeight: 200,
            fontSize: 'clamp(1.875rem, 4vw, 3rem)',
            letterSpacing: '0.08em', textTransform: 'uppercase', maxWidth: 560,
          }} className="chrome-text">
            Why United Fintech
          </h2>
        </div>

        <div style={{ display: 'grid', gap: '3rem' }} className="grid grid-cols-1 lg:grid-cols-2">

          {/* Left — feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {DIFFERENTIATORS.map((item, i) => {
              const Icon = item.icon
              const isActive = i === active
              return (
                <button
                  key={item.id}
                  onClick={() => setActive(i)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'left', padding: '1rem 1.25rem', borderRadius: 14,
                    display: 'flex', alignItems: 'center', gap: '0.875rem',
                    transition: 'background-color 0.2s, border-color 0.2s',
                    backgroundColor: isActive ? 'rgba(43,184,230,0.08)' : 'transparent',
                    borderLeft: isActive ? '2px solid #2BB8E6' : '2px solid transparent',
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    backgroundColor: isActive ? 'rgba(43,184,230,0.15)' : 'rgba(255,255,255,0.05)',
                    border: isActive ? '1px solid rgba(43,184,230,0.3)' : '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background-color 0.2s',
                  }}>
                    <Icon size={18} color={isActive ? '#2BB8E6' : '#7E8794'} strokeWidth={1.5} />
                  </div>
                  <span style={{
                    color: isActive ? '#E8EDF2' : '#7E8794',
                    fontSize: '0.9rem', fontWeight: isActive ? 600 : 500,
                    transition: 'color 0.2s',
                  }}>
                    {item.title}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Right — detail panel */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="uf-card"
                style={{ padding: '2.5rem', width: '100%' }}
              >
                {/* Icon badge */}
                <div style={{
                  width: 56, height: 56, borderRadius: 14, marginBottom: '1.5rem',
                  backgroundColor: 'rgba(43,184,230,0.12)',
                  border: '1px solid rgba(43,184,230,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <current.icon size={26} color="#2BB8E6" strokeWidth={1.5} />
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-outfit)', fontWeight: 400,
                  fontSize: '1.25rem', color: '#E8EDF2',
                  letterSpacing: '0.02em', marginBottom: '1rem',
                }}>
                  {current.title}
                </h3>

                <div style={{ width: 32, height: 2, backgroundColor: '#2BB8E6', borderRadius: 1, marginBottom: '1.25rem' }} />

                <p style={{ color: '#7E8794', fontSize: '0.95rem', lineHeight: 1.8 }}>
                  {current.detail}
                </p>

                {/* Dot indicators */}
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '2rem' }}>
                  {DIFFERENTIATORS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      style={{
                        width: i === active ? 20 : 6, height: 6, borderRadius: 999,
                        backgroundColor: i === active ? '#2BB8E6' : 'rgba(255,255,255,0.2)',
                        border: 'none', cursor: 'pointer', padding: 0,
                        transition: 'width 0.3s, background-color 0.3s',
                      }}
                      aria-label={`Show ${DIFFERENTIATORS[i].title}`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
