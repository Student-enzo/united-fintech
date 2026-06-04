'use client'

import { motion } from 'framer-motion'
import { useCursorArrow } from '@/components/ui/cursor-arrow'
import { CpuArchitecture } from '@/components/ui/cpu-architecture'

const CYAN = '#1EA8D4'
const MUTED = '#7E8794'

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

          {/* ── Right: CPU architecture diagram ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: 'easeOut', delay: 0.15 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '480px' }}
          >
            <CpuArchitecture
              className="text-[rgba(30,168,212,0.35)]"
              width="100%"
              height="480px"
              showCpuConnections
              animateLines
              animateMarkers
              animateText
              lineMarkerSize={18}
            />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
