'use client'

import Link from 'next/link'
import { GlobeCdn } from '@/components/ui/cobe-globe-cdn'
import { useCursorArrow } from '@/components/ui/cursor-arrow'

const CYAN = '#2BB8E6'
const BG = '#161616'
const TEXT = '#E8EDF2'
const MUTED = '#7E8794'

const STATS = [
  {
    value: '30+',
    label: 'Countries worldwide',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
      </svg>
    ),
  },
  {
    value: '150+',
    label: 'Financial institutions',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 22V12M9 22V8M15 22V12M21 22V4" />
      </svg>
    ),
  },
  {
    value: '24/7',
    label: 'Global support desk',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    value: '99.9%',
    label: 'Processing uptime',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
]

export default function Hero() {
  const consultationRef = useCursorArrow<HTMLAnchorElement>()
  return (
    <section
      className="photo-hero"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80')",
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Gradient overlay — heavy left, fades right */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(8,8,14,0.94) 0%, rgba(8,8,14,0.78) 45%, rgba(8,8,14,0.35) 72%, rgba(8,8,14,0.10) 100%)' }} />
      {/* Bottom fade to site bg */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '18%', background: `linear-gradient(to bottom, transparent, ${BG})` }} />

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          padding: '7rem 1.5rem 5rem',
          display: 'grid',
          gap: '3rem',
          alignItems: 'center',
        }}
        className="grid grid-cols-1 lg:grid-cols-[44%_56%] mob-pad-hero"
      >
        {/* Left — headline + CTAs */}
        <div>
          {/* Three-word badge row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {['Strategic', 'Scalable', 'Trusted'].map((word, i) => (
              <span key={word} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                {i > 0 && <span style={{ color: 'rgba(43,184,230,0.4)', fontSize: '0.7rem' }}>·</span>}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.25rem 0.8rem',
                  backgroundColor: 'rgba(43,184,230,0.10)',
                  border: '1px solid rgba(43,184,230,0.28)',
                  borderRadius: '999px',
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: CYAN, flexShrink: 0, boxShadow: `0 0 5px ${CYAN}` }} />
                  <span style={{ color: CYAN, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{word}</span>
                </span>
              </span>
            ))}
          </div>

          <h1 style={{
            fontSize: 'clamp(2.6rem, 5vw, 4.4rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: TEXT,
            marginBottom: '1rem',
            textShadow: '0 2px 20px rgba(0,0,0,0.4)',
          }}>
            The financial<br />
            partner <span style={{ color: CYAN, fontStyle: 'italic' }}>complex<br />
            merchants trust.</span>
          </h1>

          <p style={{
            fontSize: '1rem',
            color: 'rgba(232,237,242,0.72)',
            lineHeight: 1.7,
            marginBottom: '1.25rem',
            maxWidth: 460,
          }}>
            We secure merchant processing accounts, deliver embedded banking solutions, and build risk protection strategies — giving global eCommerce businesses the stability and optionality to scale.
          </p>

          {/* 3-service strip */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Merchant Processing' },
              { label: 'Embedded Finance' },
              { label: 'Risk Protection' },
            ].map((s) => (
              <span key={s.label} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                color: 'rgba(232,237,242,0.6)', fontSize: '0.8rem', fontWeight: 500,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                {s.label}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a
              ref={consultationRef}
              href="#consultation"
              className="btn-primary"
              style={{ padding: '0.875rem 1.75rem', fontSize: '0.95rem', boxShadow: '0 0 24px rgba(43,184,230,0.3)' }}
            >
              Book a Consultation
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BG} strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <Link
              href="#services"
              className="btn-secondary"
              style={{ padding: '0.875rem 1.75rem', fontSize: '0.95rem' }}
            >
              Explore Solutions
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={TEXT} strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>

        {/* Right — interactive globe */}
        <div className="hidden lg:flex" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', transform: 'translateX(8%)' }}>
          <GlobeCdn className="w-full max-w-[520px]" speed={0.003} />
          {/* Stats row below globe */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.5rem',
            marginTop: '1.5rem',
            width: '100%',
            maxWidth: 520,
          }}>
            {STATS.map((s) => (
              <div
                key={s.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.75rem 0.5rem',
                  backgroundColor: 'rgba(22,22,22,0.75)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(43,184,230,0.15)',
                  borderRadius: 12,
                  textAlign: 'center',
                }}
              >
                <p style={{ color: CYAN, fontWeight: 900, fontSize: '1.1rem', lineHeight: 1 }}>{s.value}</p>
                <p style={{ color: MUTED, fontSize: '0.65rem', lineHeight: 1.3 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}
