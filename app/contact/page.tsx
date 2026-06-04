'use client'
import { motion } from 'framer-motion'
import Navbar from '@/components/sections/Navbar'
import BookCall from '@/components/sections/BookCall'
import Footer from '@/components/sections/Footer'

// TODO: Replace placeholder contact info with real details before launch.
const CONTACT_DETAILS = [
  { label: 'Email', value: 'info@unitedfintech.com', href: 'mailto:info@unitedfintech.com' },
  { label: 'Phone', value: '+1 (555) 000-0000', href: 'tel:+15550000000' },
  { label: 'Response Time', value: '1–2 business days', href: null },
]

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0E1118] text-[#E8EDF2]">
      <Navbar />

      {/* Header */}
      <section className="uf-section-navy" style={{ padding: '9rem 1.5rem 5rem', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{
          position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 400, borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(43,184,230,0.07) 0%, transparent 70%)',
          zIndex: 0,
        }} />
        <div className="max-w-4xl mx-auto relative" style={{ zIndex: 1, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p style={{ color: '#2BB8E6', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              Get in Touch
            </p>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 300,
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              marginBottom: '1.5rem', lineHeight: 1.1,
            }} className="chrome-text">
              Contact Us
            </h1>
            <p style={{ color: '#7E8794', fontSize: '1.125rem', lineHeight: 1.8, maxWidth: 520, margin: '0 auto' }}>
              Whether you have a specific processing challenge or just want to explore what&apos;s possible, we&apos;re here to help. Fill out the form below or reach us directly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact details strip */}
      <section style={{ backgroundColor: '#0B0F1A', padding: '3rem 1.5rem 0' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
              {CONTACT_DETAILS.map((d) => (
                <div key={d.label} style={{
                  backgroundColor: '#141C28', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, padding: '1rem 1.5rem', textAlign: 'center', minWidth: 180,
                }}>
                  <p style={{ color: '#7E8794', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{d.label}</p>
                  {d.href ? (
                    <a href={d.href} style={{ color: '#2BB8E6', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>
                      {d.value}
                    </a>
                  ) : (
                    <p style={{ color: '#E8EDF2', fontSize: '0.9rem', fontWeight: 500 }}>{d.value}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <BookCall />
      <Footer />
    </main>
  )
}
