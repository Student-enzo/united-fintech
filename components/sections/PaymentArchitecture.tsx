'use client'

import { motion } from 'framer-motion'
import { useCursorArrow } from '@/components/ui/cursor-arrow'

const CYAN = '#2BB8E6'
const MUTED = '#7E8794'

const NETWORKS = [
  { name: 'Visa',             region: 'Global' },
  { name: 'Mastercard',       region: 'Global' },
  { name: 'American Express', region: 'Global' },
  { name: 'Discover / Diners',region: 'Global' },
  { name: 'UnionPay',         region: 'Asia Pacific' },
  { name: 'JCB',              region: 'Asia Pacific' },
  { name: 'SWIFT',            region: 'Cross-border' },
  { name: 'ACH / SEPA',       region: 'Americas · EU' },
]

const STATS = [
  { value: '150+', label: 'Acquiring institutions' },
  { value: '30+',  label: 'Countries' },
  { value: '6',    label: 'Card networks' },
  { value: '$5B+', label: 'Annual volume' },
]

export default function PaymentArchitecture() {
  const consultationRef = useCursorArrow<HTMLAnchorElement>()

  return (
    <section style={{ background: '#161616', padding: '6rem 1.5rem', overflow: 'hidden' }}>
      <div className="max-w-6xl mx-auto">
        <div
          style={{ display: 'grid', gap: '4rem', alignItems: 'center' }}
          className="grid grid-cols-1 lg:grid-cols-2"
        >

          {/* ── Left: headline + stats + CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          >
            <p style={{
              color: CYAN, fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem',
            }}>
              Payment Infrastructure
            </p>

            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800, letterSpacing: '-0.03em',
              lineHeight: 1.1, color: '#E8EDF2', marginBottom: '1.25rem',
            }}>
              One connection.<br />
              <span style={{ color: CYAN, fontStyle: 'italic' }}>Every network.</span>
            </h2>

            <p style={{ color: MUTED, fontSize: '1rem', lineHeight: 1.75, maxWidth: 400, marginBottom: '2.5rem' }}>
              A single strategic relationship with United Fintech routes your transactions through 150+ acquiring banks and every major card network — globally.
            </p>

            {/* Stats grid */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '1.25rem 2rem', marginBottom: '2.5rem',
            }}>
              {STATS.map((s) => (
                <div key={s.label}>
                  <p style={{ color: CYAN, fontWeight: 900, fontSize: '1.75rem', lineHeight: 1, letterSpacing: '-0.02em' }}>
                    {s.value}
                  </p>
                  <p style={{ color: 'rgba(232,237,242,0.45)', fontSize: '0.78rem', marginTop: '0.25rem', letterSpacing: '0.02em' }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a
                ref={consultationRef}
                href="#consultation"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.75rem 1.75rem', borderRadius: 999,
                  backgroundColor: CYAN, color: '#161616',
                  fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
                }}
              >
                Book a Consultation
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#161616" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
              <a
                href="#services"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.75rem 1.75rem', borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.12)', color: '#E8EDF2',
                  fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
                }}
              >
                Our Solutions
              </a>
            </div>
          </motion.div>

          {/* ── Right: terminal-style network panel ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: 'easeOut', delay: 0.15 }}
          >
            <div style={{
              border: '1px solid rgba(43,184,230,0.15)',
              borderRadius: 16,
              overflow: 'hidden',
              backgroundColor: 'rgba(255,255,255,0.02)',
            }}>
              {/* Terminal header bar */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.875rem 1.25rem',
                borderBottom: '1px solid rgba(43,184,230,0.1)',
                backgroundColor: 'rgba(43,184,230,0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: CYAN, boxShadow: `0 0 6px ${CYAN}` }} />
                  <span style={{ color: CYAN, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.15em', fontFamily: 'monospace' }}>
                    ROUTING LAYER — ACTIVE
                  </span>
                </div>
                <span style={{ color: 'rgba(43,184,230,0.4)', fontSize: '0.65rem', fontFamily: 'monospace' }}>
                  LIVE
                </span>
              </div>

              {/* Network rows */}
              <div style={{ padding: '0.5rem 0' }}>
                {NETWORKS.map((n, i) => (
                  <motion.div
                    key={n.name}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: 0.05 * i }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.65rem 1.25rem',
                      borderBottom: i < NETWORKS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{
                        width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                        backgroundColor: CYAN, opacity: 0.7,
                      }} />
                      <span style={{ color: '#E8EDF2', fontSize: '0.875rem', fontWeight: 500 }}>
                        {n.name}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: MUTED, fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                        {n.region}
                      </span>
                      <span style={{
                        width: 5, height: 5, borderRadius: '50%',
                        backgroundColor: '#22c55e', flexShrink: 0,
                      }} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer line */}
              <div style={{
                padding: '0.875rem 1.25rem',
                borderTop: '1px solid rgba(43,184,230,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                backgroundColor: 'rgba(43,184,230,0.03)',
              }}>
                <span style={{ color: MUTED, fontSize: '0.72rem', letterSpacing: '0.06em' }}>
                  + 142 ACQUIRING INSTITUTIONS
                </span>
                <span style={{ color: 'rgba(43,184,230,0.5)', fontSize: '0.65rem', fontFamily: 'monospace' }}>
                  30+ COUNTRIES
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
