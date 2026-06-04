'use client'
import { motion } from 'framer-motion'
import Navbar from '@/components/sections/Navbar'
import { useCursorArrow } from '@/components/ui/cursor-arrow'
import BookCall from '@/components/sections/BookCall'
import Footer from '@/components/sections/Footer'
import Link from 'next/link'

const VALUES = [
  { title: 'Strategic, Not Transactional', desc: 'We are not a lead-generation broker. We stay deeply involved from initial strategy through ongoing optimization, acting as a true extension of your finance and operations team.' },
  { title: 'Network-First', desc: 'Our value is the relationships we have built over years with acquiring banks, processors, and financial institutions across 30+ countries. We know who to call, how to position your business, and how to close deals.' },
  { title: 'Transparent & Aligned', desc: 'We succeed when our clients succeed. Our fee structures are transparent, our recommendations are unbiased, and we tell you when a solution is not right for your business.' },
  { title: 'Specialists, Not Generalists', desc: 'The merchants who benefit most from working with us are those that mainstream brokers turn away. Complex, high-risk, and cross-border businesses are our specialty — not our exception.' },
]

export default function AboutPage() {
  const consultationRef = useCursorArrow<HTMLAnchorElement>()
  return (
    <main className="min-h-screen bg-[#0E1118] text-[#E8EDF2]">
      <Navbar />

      {/* Hero */}
      <section className="uf-section-navy" style={{ padding: '9rem 1.5rem 6rem', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{
          position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 500, borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(30,168,212,0.07) 0%, transparent 70%)',
          zIndex: 0,
        }} />
        <div className="max-w-4xl mx-auto relative" style={{ zIndex: 1, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p style={{ color: '#1EA8D4', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              Who We Are
            </p>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontWeight: 700,
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              letterSpacing: '0.01em', textTransform: 'uppercase',
              marginBottom: '1.5rem', lineHeight: 1.1,
            }} className="chrome-text">
              About United Fintech
            </h1>
            <p style={{ color: '#7E8794', fontSize: '1.125rem', lineHeight: 1.85, maxWidth: 620, margin: '0 auto' }}>
              United Fintech is a strategic financial services partner built for the merchants that global payment infrastructure was not designed for. We specialize in acquiring, embedded finance, and risk strategy for complex, cross-border, and high-risk businesses.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Positioning copy */}
      <section style={{ backgroundColor: '#0E1118', padding: '6rem 1.5rem' }}>
        <div className="max-w-4xl mx-auto">
          <div style={{ display: 'grid', gap: '4rem' }} className="grid grid-cols-1 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <p style={{ color: '#1EA8D4', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Our Mission</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '0.01em', textTransform: 'uppercase', marginBottom: '1.5rem' }} className="chrome-text">
                Making Global Finance Accessible
              </h2>
              <div style={{ width: 32, height: 2, backgroundColor: '#1EA8D4', borderRadius: 1, marginBottom: '1.5rem' }} />
              <p style={{ color: '#7E8794', fontSize: '0.95rem', lineHeight: 1.85, marginBottom: '1.25rem' }}>
                United Fintech was founded on a simple premise: the businesses that need sophisticated financial infrastructure the most are often the ones that get the worst service. High-risk verticals, cross-border merchants, and complex payment use cases are underserved by mainstream brokers who lack the relationships and expertise to help.
              </p>
              <p style={{ color: '#7E8794', fontSize: '0.95rem', lineHeight: 1.85 }}>
                We built United Fintech to change that. By combining deep banking relationships with strategic advisory, we give global merchants access to the same quality of financial infrastructure that was previously reserved for large enterprises with in-house teams.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}>
              <p style={{ color: '#1EA8D4', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>What We Do</p>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '0.01em', textTransform: 'uppercase', marginBottom: '1.5rem' }} className="chrome-text">
                Strategy, Connections, Execution
              </h2>
              <div style={{ width: 32, height: 2, backgroundColor: '#1EA8D4', borderRadius: 1, marginBottom: '1.5rem' }} />
              <p style={{ color: '#7E8794', fontSize: '0.95rem', lineHeight: 1.85, marginBottom: '1.25rem' }}>
                Our work spans three connected disciplines: merchant processing solutions (acquiring bank relationships, card network coverage, and payment processor onboarding), embedded finance (BaaS, card issuing, and account infrastructure), and risk mitigation (redundancy architecture, chargeback management, and compliance frameworks).
              </p>
              <p style={{ color: '#7E8794', fontSize: '0.95rem', lineHeight: 1.85 }}>
                We work as partners — staying involved in onboarding, optimization, and ongoing strategy rather than closing a deal and moving on.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="uf-section-navy" style={{ padding: '6rem 1.5rem' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{ color: '#1EA8D4', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>Our Principles</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', letterSpacing: '0.01em', textTransform: 'uppercase' }} className="chrome-text">
              How We Work
            </h2>
          </motion.div>
          <div style={{ display: 'grid', gap: '1.5rem' }} className="grid grid-cols-1 md:grid-cols-2">
            {VALUES.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}>
                <div className="uf-card" style={{ padding: '2rem' }}>
                  <div style={{ width: 32, height: 2, backgroundColor: '#1EA8D4', borderRadius: 1, marginBottom: '1.25rem' }} />
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: '1.05rem', color: '#E8EDF2', marginBottom: '0.75rem' }}>{v.title}</h3>
                  <p style={{ color: '#7E8794', fontSize: '0.875rem', lineHeight: 1.8 }}>{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bridge */}
      <section style={{ backgroundColor: '#0E1118', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="max-w-xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p style={{ color: '#7E8794', fontSize: '1rem', lineHeight: 1.75, marginBottom: '2rem' }}>
              Ready to see if United Fintech is the right partner for your business?
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
              <a ref={consultationRef} href="#consultation" className="btn-cyan"
                style={{ padding: '0.875rem 2rem', fontSize: '0.95rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                Book a Consultation
              </a>
              <Link href="/contact" className="btn-cyan-outline"
                style={{ padding: '0.875rem 2rem', fontSize: '0.95rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <BookCall />
      <Footer />
    </main>
  )
}
