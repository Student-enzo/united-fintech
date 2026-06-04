'use client'
import Navbar from '@/components/sections/Navbar'
import BookCall from '@/components/sections/BookCall'
import Footer from '@/components/sections/Footer'
import { CreditCard, Globe, Zap, ShieldCheck, ArrowRight } from 'lucide-react'
import { useCursorArrow } from '@/components/ui/cursor-arrow'


const BENEFITS = [
  { icon: Globe, title: 'Global Acquiring Relationships', desc: 'Access to acquiring banks and payment processors across 30+ countries — including markets where standard brokers have no coverage.' },
  { icon: CreditCard, title: 'All Card Networks Supported', desc: 'Visa, Mastercard, Amex, Discover, JCB, and local card schemes. We structure agreements that cover your entire customer base.' },
  { icon: Zap, title: 'Fast Merchant Account Activation', desc: 'Our established relationships and deep underwriting knowledge accelerate the onboarding process from months to weeks.' },
  { icon: ShieldCheck, title: 'High-Risk Vertical Expertise', desc: 'Nutraceuticals, adult, gaming, travel, crypto-adjacent, and other complex categories — we know what banks need and how to position your application.' },
]

export default function MerchantProcessingPage() {
  const consultationRef = useCursorArrow<HTMLAnchorElement>()
  return (
    <main className="min-h-screen bg-[#0E1118] text-[#E8EDF2]">
      <Navbar />

      {/* Hero */}
      <section className="uf-section-navy" style={{ padding: '9rem 1.5rem 6rem', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{
          position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 500, borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(43,184,230,0.07) 0%, transparent 70%)',
          zIndex: 0,
        }} />
        <div className="max-w-4xl mx-auto relative" style={{ zIndex: 1, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            backgroundColor: 'rgba(43,184,230,0.10)', border: '1px solid rgba(43,184,230,0.25)',
            borderRadius: 999, padding: '0.35rem 1rem', marginBottom: '1.5rem',
          }}>
            <CreditCard size={14} color="#2BB8E6" strokeWidth={2} />
            <span style={{ color: '#2BB8E6', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Merchant Processing</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 300,
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            letterSpacing: '0.06em', textTransform: 'uppercase',
            marginBottom: '1.5rem', lineHeight: 1.1,
          }} className="chrome-text">
            Merchant Processing Solutions
          </h1>
          <p style={{ color: '#7E8794', fontSize: '1.125rem', lineHeight: 1.8, maxWidth: 580, margin: '0 auto 2.5rem' }}>
            End-to-end merchant account acquisition for global and complex eCommerce businesses. We connect you with the right acquiring relationships so your payments flow without interruption.
          </p>
          <a ref={consultationRef} href="#consultation" className="btn-cyan"
            style={{ padding: '0.875rem 2rem', fontSize: '0.95rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            Get a Strategy Session <ArrowRight size={14} />
          </a>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ backgroundColor: '#0E1118', padding: '6rem 1.5rem' }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <p style={{ color: '#2BB8E6', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>What We Deliver</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 300, fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', letterSpacing: '0.08em', textTransform: 'uppercase' }} className="chrome-text">
              Built for Complex Processing Needs
            </h2>
          </div>
          <div style={{ display: 'grid', gap: '1.5rem' }} className="grid grid-cols-1 md:grid-cols-2">
            {BENEFITS.map((b) => {
              const Icon = b.icon
              return (
                <div key={b.title} className="uf-card" style={{ padding: '2rem', display: 'flex', gap: '1.25rem', transition: 'border-color 0.2s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(43,184,230,0.25)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(43,184,230,0.10)', border: '1px solid rgba(43,184,230,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={22} color="#2BB8E6" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: '1rem', color: '#E8EDF2', marginBottom: '0.5rem' }}>{b.title}</h3>
                    <p style={{ color: '#7E8794', fontSize: '0.875rem', lineHeight: 1.75 }}>{b.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <BookCall />
      <Footer />
    </main>
  )
}
