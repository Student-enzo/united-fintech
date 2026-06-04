'use client'

import { motion } from 'framer-motion'
import { CpuArchitecture } from '@/components/ui/cpu-architecture'


export default function PaymentArchitecture() {
  return (
    <section style={{
      background: 'linear-gradient(to bottom, #0A0C12 0%, #0D1118 100%)',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      overflow: 'hidden',
      padding: '4rem 1.5rem',
    }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
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

        {/* SVG fills the container; paths scale naturally */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ color: 'rgba(43,184,230,0.18)' }}
        >
          <div style={{ minHeight: 260, maxHeight: 380 }}>
            <CpuArchitecture width="100%" height="100%" className="w-full" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
