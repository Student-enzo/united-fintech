import { FeatureCarousel } from '@/components/ui/feature-carousel'

export default function IdealClient() {
  return (
    <section className="uf-section-navy" style={{ padding: '6rem 0' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ color: '#2BB8E6', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Platform
          </p>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 200,
            fontSize: 'clamp(1.875rem, 4vw, 3rem)',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }} className="chrome-text">
            Everything You Need to Scale
          </h2>
          <p style={{ color: '#7E8794', fontSize: '1rem', marginTop: '1.25rem', maxWidth: 520, margin: '1.25rem auto 0' }}>
            A complete platform for merchant processing, risk management, and financial infrastructure.
          </p>
        </div>
      </div>
      <FeatureCarousel />
    </section>
  )
}
