'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Navbar from '@/components/sections/Navbar'
import BookCall from '@/components/sections/BookCall'
import Footer from '@/components/sections/Footer'

const STATS = [
  { v: '500+', l: 'Merchants Advised' },
  { v: '$2B+', l: 'Volume Facilitated' },
  { v: '18%', l: 'Avg. Rate Reduction' },
  { v: '1–2 days', l: 'Response Time' },
]

const CHANNELS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1EA8D4" strokeWidth="1.5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: 'Email',
    value: 'info@unitedfintech.com',
    href: 'mailto:info@unitedfintech.com',
    sub: 'Response within 1–2 business days',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1EA8D4" strokeWidth="1.5">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.27-.63a2 2 0 012.11.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
    label: 'Direct Line',
    value: '+1 (800) 867-5309',
    href: 'tel:+18008675309',
    sub: 'Mon–Fri, 9am–6pm EST',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1EA8D4" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    label: 'Response Time',
    value: '1–2 Business Days',
    href: null,
    sub: 'We review every submission personally',
  },
]

function ContactPageContent() {
  const params = useSearchParams()
  const interest = params.get('interest') ?? undefined
  const topic = params.get('topic') ?? undefined

  return (
    <main className="min-h-screen text-[#E8EDF2]" style={{ backgroundColor: '#090B10' }}>
      <Navbar />

      {/* ── Hero ── */}
      <section style={{ padding: '9rem 1.5rem 5rem', position: 'relative', overflow: 'hidden' }}>
        {/* Gradient blobs */}
        <div aria-hidden style={{
          position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
          width: '70%', height: 500,
          background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(30,168,212,0.09) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />
        <div aria-hidden style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(30,168,212,0.12), transparent)',
          zIndex: 0,
        }} />

        <div className="max-w-4xl mx-auto" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <p style={{ color: '#1EA8D4', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              Get in Touch
            </p>
            <h1 style={{
              fontWeight: 900, fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
              letterSpacing: '-0.03em', lineHeight: 1.05,
              color: '#E8EDF2', marginBottom: '1.5rem',
            }}>
              {topic ? (
                <>Let&apos;s talk about <span style={{ color: '#1EA8D4', fontStyle: 'italic' }}>{topic}.</span></>
              ) : (
                <>Start a <span style={{ color: '#1EA8D4', fontStyle: 'italic' }}>conversation.</span></>
              )}
            </h1>
            <p style={{ color: 'rgba(232,237,242,0.5)', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: 520, margin: '0 auto 3rem' }}>
              Whether you have a specific processing challenge or just want to explore what&apos;s possible — we&apos;re here to help. No sales pressure, just honest advice.
            </p>

            {/* Stats row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0', flexWrap: 'wrap' }}>
              {STATS.map((s, i) => (
                <div key={s.l} style={{
                  padding: '1.25rem 2rem',
                  borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  textAlign: 'center',
                }}>
                  <div style={{ color: '#1EA8D4', fontWeight: 800, fontSize: '1.6rem', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.v}</div>
                  <div style={{ color: 'rgba(232,237,242,0.4)', fontSize: '0.75rem', marginTop: '0.3rem' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Contact channels ── */}
      <section style={{ padding: '4rem 1.5rem', backgroundColor: '#0A0C12', position: 'relative' }}>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
        }} />
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CHANNELS.map((c) => (
                <div key={c.label} style={{
                  padding: '1.75rem',
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 16,
                  display: 'flex', flexDirection: 'column', gap: '0.875rem',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'rgba(30,168,212,0.1)', border: '1px solid rgba(30,168,212,0.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {c.icon}
                  </div>
                  <div>
                    <p style={{ color: 'rgba(232,237,242,0.4)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      {c.label}
                    </p>
                    {c.href ? (
                      <a href={c.href} style={{ color: '#E8EDF2', fontSize: '0.925rem', fontWeight: 600, textDecoration: 'none', display: 'block', marginBottom: '0.3rem' }}>
                        {c.value}
                      </a>
                    ) : (
                      <p style={{ color: '#E8EDF2', fontSize: '0.925rem', fontWeight: 600, marginBottom: '0.3rem' }}>{c.value}</p>
                    )}
                    <p style={{ color: 'rgba(232,237,242,0.35)', fontSize: '0.78rem', lineHeight: 1.5 }}>{c.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <BookCall initialInterest={interest} contextTopic={topic} />
      <Footer />
    </main>
  )
}

export default function ContactPage() {
  return (
    <Suspense>
      <ContactPageContent />
    </Suspense>
  )
}
