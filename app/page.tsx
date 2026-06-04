import Navbar from '@/components/sections/Navbar'
import Hero from '@/components/sections/Hero'
import StatsBar from '@/components/sections/StatsBar'
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero'
import GlobalNetwork from '@/components/sections/GlobalNetwork'
import ServicesGrid from '@/components/sections/ServicesGrid'
import WhyUs from '@/components/sections/WhyUs'
import IdealClient from '@/components/sections/IdealClient'
import Testimonials from '@/components/sections/Testimonials'
import PartnersGravity from '@/components/sections/PartnersGravity'
import BookCall from '@/components/sections/BookCall'
import Footer from '@/components/sections/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#161616] text-[#E8EDF2]">
      <Navbar />
      <Hero />
      <StatsBar />
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="/scroll-expand-bg.png"
        bgImageSrc="https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=1600"
        title="Scale Without Limits Globally"
        scrollToExpand="Scroll to expand"
        textBlend={false}
      >
        <div className="hidden md:block" style={{ maxWidth: '52rem', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#2BB8E6', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '1rem', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>UNITED FINTECH</p>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            fontWeight: 800,
            color: '#E8EDF2',
            letterSpacing: '-0.02em',
            marginBottom: '1.25rem',
            lineHeight: 1.2,
            textShadow: '0 2px 16px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.9)',
          }}>
            The world&apos;s financial infrastructure,{' '}
            <span style={{ color: '#2BB8E6', fontStyle: 'italic' }}>simplified.</span>
          </h2>
          <p style={{ color: 'rgba(232,237,242,0.9)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '36rem', margin: '0 auto 2rem', textShadow: '0 1px 12px rgba(0,0,0,0.95)' }}>
            From acquiring banks to embedded finance layers — we connect ambitious businesses with the global infrastructure they need to scale without friction.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="#consultation"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.875rem 1.75rem', borderRadius: 999,
                backgroundColor: '#2BB8E6', color: '#161616',
                fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
                boxShadow: '0 0 32px rgba(43,184,230,0.35)',
              }}
            >
              Book a Consultation →
            </a>
            <a
              href="#services"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.875rem 1.75rem', borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.2)', color: '#E8EDF2',
                fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none',
              }}
            >
              Our Solutions
            </a>
          </div>
        </div>
      </ScrollExpandMedia>
      <div id="markets"><GlobalNetwork /></div>
      <ServicesGrid />
      <div id="partners"><WhyUs /></div>
      <IdealClient />
      <Testimonials />
      <PartnersGravity />
      <BookCall />
      <Footer />
    </main>
  )
}
