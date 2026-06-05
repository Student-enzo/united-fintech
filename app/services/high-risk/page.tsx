const CYAN = '#1EA8D4'
const BG = '#161616'
const TEXT = '#E8EDF2'
const MUTED = '#7E8794'

const POINTS = [
  { icon: '⚡', title: '72-Hour Approval', body: 'From intro call to live account in days, not weeks. We know which banks move fast.' },
  { icon: '○', title: 'No Hidden Fees', body: 'Flat rate pricing. No surprise reserves. No fees you didn\'t explicitly agree to.' },
  { icon: '◎', title: 'Real People, Real Answers', body: 'A direct line to the underwriter — not a support ticket queue with a 3-day SLA.' },
]

export default function HighRiskPage() {
  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh', color: TEXT }}>
      {/* Mini nav */}
      <nav style={{ maxWidth: 760, margin: '0 auto', padding: '1.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/#partners" style={{ color: MUTED, fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back
        </a>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <span style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: CYAN, display: 'flex', alignItems: 'center', justifyContent: 'center', color: BG, fontWeight: 900, fontSize: '0.75rem', letterSpacing: '-0.02em' }}>UF</span>
          <span style={{ color: TEXT, fontWeight: 600, fontSize: '0.9rem' }}>United Fintech</span>
        </a>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '4rem 1.5rem 3rem', textAlign: 'center' }}>
        <span style={{ display: 'inline-block', padding: '0.25rem 0.875rem', backgroundColor: 'rgba(30,168,212,0.12)', border: '1px solid rgba(30,168,212,0.3)', borderRadius: 999, color: CYAN, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: '1.75rem' }}>
          Our Specialty
        </span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
          We place the accounts every<br />mainstream broker declines.
        </h1>
        <p style={{ color: 'rgba(232,237,242,0.65)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
          If you&apos;ve been turned down before, that&apos;s exactly where we come in. We work exclusively with complex, high-risk merchants — and we get them approved.
        </p>
      </section>

      {/* Value cards */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem 3.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {POINTS.map((p) => (
            <div key={p.title} style={{ padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(30,168,212,0.12)', borderRadius: 16 }}>
              <div style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: CYAN }}>{p.icon}</div>
              <p style={{ color: TEXT, fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>{p.title}</p>
              <p style={{ color: MUTED, fontSize: '0.82rem', lineHeight: 1.6 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem 3.5rem' }}>
        <div style={{ padding: '1.75rem 2rem', backgroundColor: 'rgba(30,168,212,0.06)', border: '1px solid rgba(30,168,212,0.18)', borderRadius: 16, textAlign: 'center' }}>
          <p style={{ color: CYAN, fontWeight: 900, fontSize: '1.75rem', marginBottom: '0.35rem', fontFamily: 'var(--font-heading)' }}>98%</p>
          <p style={{ color: TEXT, fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.25rem' }}>Approval rate for high-risk accounts</p>
          <p style={{ color: MUTED, fontSize: '0.78rem' }}>Across gaming, nutra, CBD, travel, subscription, and adult verticals</p>
        </div>
        <div style={{ marginTop: '1.25rem', padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
          <p style={{ color: 'rgba(232,237,242,0.8)', fontSize: '0.9rem', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '0.75rem' }}>
            &ldquo;We tried 4 other brokers over 6 months. United Fintech got us live in 3 days.&rdquo;
          </p>
          <p style={{ color: MUTED, fontSize: '0.78rem', fontWeight: 600 }}>— High-risk e-commerce founder</p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.5rem 6rem', textAlign: 'center' }}>
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(30,168,212,0.2) 50%, transparent)', marginBottom: '3rem' }} />
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
          Ready to get approved?
        </h2>
        <p style={{ color: MUTED, fontSize: '0.95rem', marginBottom: '2rem' }}>
          Tell us about your business. We&apos;ll tell you which bank is the right fit.
        </p>
        <a
          href="/contact?interest=merchant_processing&topic=High-Risk+Account+Approval"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.25rem', backgroundColor: CYAN, color: BG, borderRadius: 999, fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 0 32px rgba(30,168,212,0.3)' }}
        >
          Get approved in 72 hours
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BG} strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
        <p style={{ color: MUTED, fontSize: '0.78rem', marginTop: '1rem' }}>No commitment. Response within 24 hours.</p>
      </section>
    </div>
  )
}
