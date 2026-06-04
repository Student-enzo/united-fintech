'use client'

const CYAN = '#2BB8E6'
const TEXT = '#E8EDF2'
const MUTED = '#7E8794'
const GREEN = '#3DD68C'
const BORDER = 'rgba(255,255,255,0.06)'

const ADVANTAGES = [
  'Specialists in high-risk, cross-border, and complex verticals that mainstream brokers decline.',
  '150+ acquiring banks and processors across 30+ countries — relationships built over years, not databases.',
  'Multi-processor setups with failover routing so your revenue never stops because one provider has an issue.',
  'Chargeback management, reserve negotiation, and PCI compliance frameworks from day one.',
  'We stay involved after the deal — onboarding, optimization, and ongoing strategy.',
]

const ADVANTAGE_TITLES = [
  'Deep Expertise',
  'Global Provider Network',
  'Stability & Redundancy',
  'Risk Mitigation Built-In',
  'Strategic Advisory',
]

export default function WhyUs() {
  return (
    <section
      id="partners"
      className="photo-hero mob-pad-section"
      style={{
        backgroundImage: "url('https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1600')",
        padding: '6rem 1.5rem',
        minHeight: 580,
      }}
    >
      {/* Heavy left overlay, fades right */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(95deg, rgba(10,8,4,0.95) 0%, rgba(10,8,4,0.82) 52%, rgba(10,8,4,0.35) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,8,4,0.2) 0%, transparent 30%, transparent 70%, rgba(22,22,22,0.85) 100%)' }} />

      <div
        style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', display: 'grid', gap: '3rem', alignItems: 'center' }}
        className="grid grid-cols-1 lg:grid-cols-2"
      >
        {/* Left — copy */}
        <div>
          <span style={{
            display: 'inline-block', padding: '0.3rem 0.875rem',
            backgroundColor: 'rgba(43,184,230,0.15)',
            border: '1px solid rgba(43,184,230,0.35)',
            borderRadius: 999, color: CYAN,
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
            marginBottom: '1.5rem',
          }}>
            WHY UNITED FINTECH
          </span>

          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3.25rem)',
            fontWeight: 900, color: TEXT,
            letterSpacing: '-0.03em', lineHeight: 1.05,
            marginBottom: '1rem',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          }}>
            We connect where others{' '}
            <span style={{ color: CYAN, fontStyle: 'italic' }}>can&apos;t.</span>
          </h2>

          <p style={{ color: 'rgba(232,237,242,0.75)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: 440 }}>
            Mainstream brokers turn away high-risk and complex merchants. We specialize in exactly those cases — and we&apos;ve built the global network to back it up.
          </p>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {ADVANTAGE_TITLES.map((title, i) => (
              <li key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}>
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>
                  <span style={{ color: TEXT, fontWeight: 700, fontSize: '0.9rem' }}>{title}</span>
                  <span style={{ color: 'rgba(232,237,242,0.65)', fontSize: '0.85rem', display: 'block', marginTop: '0.1rem' }}>{ADVANTAGES[i]}</span>
                </span>
              </li>
            ))}
          </ul>

          <a
            href="#consultation"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.875rem 1.75rem',
              backgroundColor: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 999, color: TEXT,
              fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
              transition: 'background-color 0.15s, border-color 0.15s',
            }}
          >
            Start a conversation
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={TEXT} strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>

        {/* Right — key metrics on desktop */}
        <div className="hidden lg:flex" style={{ justifyContent: 'center', alignItems: 'center', position: 'relative', height: 460 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: 320 }}>
            {[
              { value: '30+', label: 'Countries in our network' },
              { value: '150+', label: 'Financial institution partners' },
              { value: '99.9%', label: 'Client retention rate' },
              { value: '$5B+', label: 'In annual processing volume' },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  backgroundColor: 'rgba(22,22,22,0.82)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(43,184,230,0.18)',
                  borderRadius: 16,
                  padding: '1.25rem 1.5rem',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}
              >
                <p style={{ color: CYAN, fontWeight: 900, fontSize: '2rem', lineHeight: 1, marginBottom: '0.2rem' }}>{s.value}</p>
                <p style={{ color: MUTED, fontSize: '0.82rem' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="pexels-credit">Photo via Pexels</a>
    </section>
  )
}
