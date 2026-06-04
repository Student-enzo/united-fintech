'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section
      className="uf-section-navy relative overflow-hidden"
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '6rem', paddingBottom: '4rem' }}
    >
      {/* Subtle grid texture overlay */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `
            linear-gradient(rgba(43,184,230,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(43,184,230,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }}
      />
      {/* Radial glow at top */}
      <div aria-hidden style={{
        position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: 800, height: 600, borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(43,184,230,0.08) 0%, transparent 70%)',
        zIndex: 0,
      }} />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}
          className="grid-cols-1 md:grid-cols-2">

          {/* Left column — copy */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Eyebrow */}
            <p style={{
              color: '#2BB8E6', fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span style={{ width: 20, height: 1.5, background: '#2BB8E6', display: 'inline-block', borderRadius: 1 }} />
              United Fintech — Global Interchange
            </p>

            {/* Headline */}
            <h1 style={{
              fontFamily: 'var(--font-outfit)', fontWeight: 200,
              fontSize: 'clamp(2.75rem, 6vw, 5rem)',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              lineHeight: 1.05, marginBottom: '0.5rem',
            }}>
              <span className="chrome-text">Connecting</span>
            </h1>
            <h1 style={{
              fontFamily: 'var(--font-outfit)', fontWeight: 200,
              fontSize: 'clamp(2.75rem, 6vw, 5rem)',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              lineHeight: 1.05, marginBottom: '0.5rem',
            }}>
              <span className="chrome-text">Markets.</span>
            </h1>
            <h1 style={{
              fontFamily: 'var(--font-outfit)', fontWeight: 200,
              fontSize: 'clamp(2.75rem, 6vw, 5rem)',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              lineHeight: 1.05, marginBottom: '0.5rem',
            }}>
              <span className="chrome-text">Creating</span>
            </h1>
            <h1 style={{
              fontFamily: 'var(--font-outfit)', fontWeight: 200,
              fontSize: 'clamp(2.75rem, 6vw, 5rem)',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              lineHeight: 1.05, marginBottom: '2rem',
            }}>
              <span style={{ color: '#2BB8E6' }}>Opportunities.</span>
            </h1>

            {/* Subhead */}
            <p style={{ color: '#7E8794', fontSize: '1.125rem', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: 440 }}>
              Global financial solutions. Seamless execution. Trusted partnerships across 30+ countries and 150+ financial institutions.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <a
                href="#consultation"
                className="btn-cyan"
                style={{ padding: '0.875rem 2rem', fontSize: '0.95rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                Book a Consultation
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
              <Link
                href="#services"
                style={{ color: '#2BB8E6', fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'gap 0.15s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.gap = '0.65rem' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.gap = '0.4rem' }}
              >
                Discover Our Solutions →
              </Link>
            </div>
          </motion.div>

          {/* Right column — globe SVG */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
            className="hidden md:flex"
          >
            <GlobeGraphic />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function GlobeGraphic() {
  return (
    <div style={{ position: 'relative', width: 460, height: 460 }}>
      {/* Outer glow ring */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(43,184,230,0.06) 0%, transparent 70%)',
      }} />

      <svg viewBox="0 0 460 460" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        {/* Globe circle */}
        <circle cx="230" cy="230" r="160" stroke="rgba(43,184,230,0.18)" strokeWidth="1" fill="rgba(13,27,42,0.6)" />

        {/* Latitude lines */}
        {[-90, -60, -30, 0, 30, 60, 90].map((lat, i) => {
          const y = 230 + (lat / 90) * 150
          const halfW = Math.sqrt(Math.max(0, 160 * 160 - (y - 230) * (y - 230)))
          if (halfW < 5) return null
          return (
            <ellipse key={`lat-${i}`} cx="230" cy={y} rx={halfW} ry={halfW * 0.25}
              stroke="rgba(43,184,230,0.12)" strokeWidth="0.8" fill="none" />
          )
        })}

        {/* Longitude lines */}
        {[0, 30, 60, 90, 120, 150].map((lon, i) => (
          <ellipse key={`lon-${i}`} cx="230" cy="230" rx={160 * Math.abs(Math.cos((lon * Math.PI) / 180))} ry="160"
            stroke="rgba(43,184,230,0.10)" strokeWidth="0.8" fill="none"
            transform={`rotate(${lon}, 230, 230)`} />
        ))}

        {/* Outer orbit ring */}
        <motion.circle
          cx="230" cy="230" r="195"
          stroke="rgba(43,184,230,0.20)" strokeWidth="1" strokeDasharray="6 10" fill="none"
          style={{ originX: '230px', originY: '230px' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />

        {/* Mid orbit ring */}
        <motion.circle
          cx="230" cy="230" r="215"
          stroke="rgba(43,184,230,0.12)" strokeWidth="0.8" strokeDasharray="3 14" fill="none"
          style={{ originX: '230px', originY: '230px' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        />

        {/* Connection lines to node dots */}
        <line x1="230" y1="230" x2="110" y2="140" stroke="rgba(43,184,230,0.25)" strokeWidth="1" strokeDasharray="4 6" />
        <line x1="230" y1="230" x2="350" y2="150" stroke="rgba(43,184,230,0.20)" strokeWidth="1" strokeDasharray="4 6" />
        <line x1="230" y1="230" x2="380" y2="310" stroke="rgba(43,184,230,0.18)" strokeWidth="1" strokeDasharray="4 6" />
        <line x1="230" y1="230" x2="100" y2="320" stroke="rgba(43,184,230,0.20)" strokeWidth="1" strokeDasharray="4 6" />
        <line x1="230" y1="230" x2="230" y2="80" stroke="rgba(43,184,230,0.15)" strokeWidth="1" strokeDasharray="4 6" />

        {/* Outer node dots */}
        <circle cx="110" cy="140" r="5" fill="#2BB8E6" fillOpacity="0.7" />
        <circle cx="350" cy="150" r="4" fill="#2BB8E6" fillOpacity="0.6" />
        <circle cx="380" cy="310" r="5" fill="#2BB8E6" fillOpacity="0.65" />
        <circle cx="100" cy="320" r="4" fill="#2BB8E6" fillOpacity="0.5" />
        <circle cx="230" cy="80" r="4" fill="#2BB8E6" fillOpacity="0.55" />

        {/* Globe equator label markers */}
        <circle cx="75" cy="230" r="3" fill="rgba(43,184,230,0.35)" />
        <circle cx="385" cy="230" r="3" fill="rgba(43,184,230,0.35)" />

        {/* Central node dot — animated pulse */}
        <motion.circle cx="230" cy="230" r="10" fill="rgba(43,184,230,0.15)"
          animate={{ r: [10, 18, 10], opacity: [0.15, 0.05, 0.15] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} />
        <circle cx="230" cy="230" r="5" fill="#2BB8E6"
          style={{ filter: 'drop-shadow(0 0 8px rgba(43,184,230,0.8))' }} />
      </svg>

      {/* Floating stat chips */}
      <div style={{
        position: 'absolute', top: '12%', right: '-5%',
        backgroundColor: 'rgba(20,24,33,0.9)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(43,184,230,0.2)', borderRadius: 12,
        padding: '0.5rem 0.875rem',
      }}>
        <div style={{ color: '#2BB8E6', fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-outfit)' }}>30+</div>
        <div style={{ color: '#7E8794', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Countries</div>
      </div>
      <div style={{
        position: 'absolute', bottom: '18%', left: '-8%',
        backgroundColor: 'rgba(20,24,33,0.9)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(43,184,230,0.2)', borderRadius: 12,
        padding: '0.5rem 0.875rem',
      }}>
        <div style={{ color: '#2BB8E6', fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-outfit)' }}>150+</div>
        <div style={{ color: '#7E8794', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Institutions</div>
      </div>
    </div>
  )
}
