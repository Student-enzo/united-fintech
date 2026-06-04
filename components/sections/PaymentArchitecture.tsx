'use client'

import { motion } from 'framer-motion'
import { CpuArchitecture } from '@/components/ui/cpu-architecture'
import { useCursorArrow } from '@/components/ui/cursor-arrow'

export default function PaymentArchitecture() {
  const consultationRef = useCursorArrow<HTMLAnchorElement>()
  return (
    <section style={{
      background: '#161616',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      overflow: 'hidden',
      padding: '5rem 1.5rem 4rem',
    }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <p style={{
            color: '#2BB8E6', fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem',
          }}>
            Payment Infrastructure
          </p>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: '#E8EDF2',
            marginBottom: '0.75rem',
          }}>
            Every transaction.{' '}
            <span style={{ color: '#2BB8E6', fontWeight: 300, letterSpacing: '0.06em' }}>
              Every network.
            </span>
          </h2>
          <p style={{
            color: '#7E8794', fontSize: '0.95rem', lineHeight: 1.75,
            maxWidth: 460, margin: '0 auto',
          }}>
            A single routing layer connecting your business to 150+ acquiring banks,
            card networks, and payment processors — globally.
          </p>
        </motion.div>

        {/* SVG diagram */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ color: 'rgba(43,184,230,0.18)' }}
        >
          <div style={{ minHeight: 340 }}>
            <CpuArchitecture width="100%" height="100%" className="w-full" />
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.4 }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '3rem' }}
        >
          <a
            ref={consultationRef}
            href="#consultation"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.875rem 2rem', borderRadius: 999,
              backgroundColor: '#2BB8E6', color: '#161616',
              fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
              boxShadow: '0 0 28px rgba(43,184,230,0.3)',
            }}
          >
            Book a Consultation →
          </a>
          <a
            href="#services"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.875rem 2rem', borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.15)', color: '#E8EDF2',
              fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none',
              backdropFilter: 'blur(8px)',
            }}
          >
            Our Solutions
          </a>
        </motion.div>
      </div>
    </section>
  )
}
