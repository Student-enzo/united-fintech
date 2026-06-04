'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { LiquidButton } from '@/components/ui/liquid-glass-button'

export default function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background image layer with opacity control */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/01_hero_global_network.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.5,
          zIndex: 0,
        }}
      />

      {/* Dark overlay with gradient to solid at bottom */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,12,18,0.45) 0%, rgba(10,12,18,0.45) 60%, rgba(10,12,18,0.92) 100%)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '80rem',
          padding: '0 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
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

      {/* Scroll indicator */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span style={{
          color: 'rgba(126,135,148,0.7)', fontSize: '0.6rem',
          fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
        }}>
          Scroll
        </span>
        <motion.div
          style={{
            width: 1.5,
            height: 40,
            background: 'linear-gradient(to bottom, rgba(43,184,230,0.8), rgba(43,184,230,0))',
            borderRadius: 1,
          }}
          animate={{ scaleY: [1, 0.4, 1], opacity: [0.8, 0.3, 0.8] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
