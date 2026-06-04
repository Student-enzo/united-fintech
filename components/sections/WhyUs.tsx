'use client'

import Image from 'next/image'

const ADVANTAGES = [
  {
    title: 'Deep Expertise',
    description: 'Specialists in high-risk, cross-border, and complex payment verticals that mainstream brokers decline.',
  },
  {
    title: 'Global Provider Network',
    description: '150+ acquiring banks and processors across 30+ countries — relationships built over years, not databases.',
  },
  {
    title: 'Stability & Redundancy',
    description: 'Multi-processor setups with failover routing so your revenue never stops because one provider has an issue.',
  },
  {
    title: 'Risk Mitigation Built-In',
    description: 'Chargeback management, reserve negotiation, and PCI compliance frameworks from day one.',
  },
  {
    title: 'Strategic Advisory',
    description: 'We stay involved after the deal — onboarding, optimization, and ongoing strategy.',
  },
]

export default function WhyUs() {
  return (
    <section style={{ backgroundColor: '#0D1B2A', padding: '6rem 1.5rem' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Left column */}
          <div>
            <p style={{
              color: '#2BB8E6',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}>
              Why Choose Us
            </p>
            <h2
              className="chrome-text"
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 200,
                fontSize: 'clamp(1.875rem, 4vw, 3rem)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '2.5rem',
              }}
            >
              Why United Fintech
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {ADVANTAGES.map((item) => (
                <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                  <span
                    style={{
                      width: '0.5rem',
                      height: '0.5rem',
                      borderRadius: '50%',
                      backgroundColor: '#2BB8E6',
                      flexShrink: 0,
                      marginTop: '0.35rem',
                    }}
                  />
                  <div>
                    <p style={{ color: '#E8EDF2', fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>
                      {item.title}
                    </p>
                    <p style={{ color: '#7E8794', fontSize: '0.875rem', lineHeight: 1.6 }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — brand image */}
          <div
            className="rounded-2xl"
            style={{
              position: 'relative',
              width: '100%',
              height: 480,
              boxShadow: '0 0 60px rgba(43,184,230,0.15)',
              border: '1px solid rgba(43,184,230,0.2)',
              borderRadius: '1rem',
              overflow: 'hidden',
            }}
          >
            <Image
              src="/uf-boardroom.jpg"
              alt="Global Network"
              fill
              style={{ objectFit: 'cover', borderRadius: '1rem' }}
            />
          </div>

        </div>
      </div>
    </section>
  )
}
