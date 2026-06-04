'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero'
import { LiquidButton } from '@/components/ui/liquid-glass-button'

export default function Hero() {
  return (
    <ScrollExpandMedia
      mediaType="image"
      mediaSrc="/brand-billboard.png"
      bgImageSrc="/brand-hero.png"
      title="Connecting Markets Creating Opportunities"
      scrollToExpand="Scroll to explore"
    >
      {/* Revealed after full expansion */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <p style={{
            color: '#2BB8E6', fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            marginBottom: '1.25rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          }}>
            <span style={{ width: 20, height: 1.5, background: '#2BB8E6', display: 'inline-block', borderRadius: 1 }} />
            United Fintech — Global Interchange
            <span style={{ width: 20, height: 1.5, background: '#2BB8E6', display: 'inline-block', borderRadius: 1 }} />
          </p>

          <h1 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 200,
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            lineHeight: 1.1, marginBottom: '1.5rem',
          }}>
            <span className="chrome-text">Connecting Markets.</span>
            <br />
            <span style={{ color: '#2BB8E6' }}>Creating Opportunities.</span>
          </h1>

          <p style={{
            color: '#7E8794', fontSize: '1.1rem', lineHeight: 1.8,
            marginBottom: '2.5rem', maxWidth: 520, margin: '0 auto 2.5rem',
          }}>
            Global financial solutions. Seamless execution. Trusted partnerships across 30+ countries and 150+ financial institutions.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
            <LiquidButton
              size="xxl"
              className="bg-[#2BB8E6] text-[#0A0C12] font-bold tracking-wide rounded-full px-8 py-4"
              onClick={() => { window.location.href = '#consultation' }}
            >
              Book a Consultation →
            </LiquidButton>

            <Link
              href="#services"
              style={{
                color: '#2BB8E6', fontSize: '0.95rem', fontWeight: 600,
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                transition: 'gap 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.gap = '0.65rem' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.gap = '0.4rem' }}
            >
              Discover Our Solutions →
            </Link>
          </div>
        </motion.div>
      </div>
    </ScrollExpandMedia>
  )
}
