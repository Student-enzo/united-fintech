import Navbar from '@/components/sections/Navbar'
import Hero from '@/components/sections/Hero'
import StatsBar from '@/components/sections/StatsBar'
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero'
import GlobalNetwork from '@/components/sections/GlobalNetwork'
import ServicesGrid from '@/components/sections/ServicesGrid'
import WhyUs from '@/components/sections/WhyUs'
import IdealClient from '@/components/sections/IdealClient'
import Testimonials from '@/components/sections/Testimonials'
import BookCall from '@/components/sections/BookCall'
import Footer from '@/components/sections/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0A0C12] text-[#E8EDF2]">
      <Navbar />
      <Hero />
      <StatsBar />
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="/uf-globe.jpg"
        bgImageSrc="/uf-data-wave.jpg"
        title="Scale Without Limits Globally"
        scrollToExpand="Scroll to expand"
      >
        <div style={{
          maxWidth: '48rem',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.5rem',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 200,
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#E8EDF2',
            lineHeight: 1.15,
          }}>
            The World&apos;s Financial Infrastructure,{' '}
            <span style={{ color: '#2BB8E6' }}>Simplified.</span>
          </h2>
          <p style={{
            color: '#7E8794',
            fontSize: '1rem',
            lineHeight: 1.8,
            maxWidth: '36rem',
          }}>
            From acquiring banks to embedded finance layers — United Fintech connects ambitious businesses with the global financial infrastructure they need to operate, grow, and scale without friction.
          </p>
          <a
            href="#consultation"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.875rem 2rem',
              borderRadius: 999,
              backgroundColor: '#2BB8E6',
              color: '#0A0C12',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.875rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              boxShadow: '0 0 32px rgba(43,184,230,0.35)',
              transition: 'box-shadow 0.2s',
            }}
          >
            Book a Consultation →
          </a>
        </div>
      </ScrollExpandMedia>
      <div id="markets"><GlobalNetwork /></div>
      <ServicesGrid />
      <div id="partners"><WhyUs /></div>
      <IdealClient />
      <div id="insights"><Testimonials /></div>
      <BookCall />
      <Footer />
    </main>
  )
}
