const CYAN = '#1EA8D4'
const BG = '#161616'
const TEXT = '#E8EDF2'
const MUTED = '#7E8794'

const POINTS = [
  { icon: '∞', title: 'No Volume Ceiling', body: 'Whether you process $1M or $500M annually, our bank relationships and infrastructure scale with you.' },
  { icon: '⬡', title: 'Residual Splits That Make Sense', body: 'Competitive structures that improve as your volume grows. You shouldn\'t be paying startup rates at $50M/month.' },
  { icon: '◈', title: 'Built for Scale', body: 'Enterprise-grade redundancy, multi-acquirer failover, and real-time settlement reporting across your entire portfolio.' },
]

export default function HighVolumePage() {
  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh', color: TEXT }}>
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

      <section style={{ maxWidth: 760, margin: '0 auto', padding: '4rem 1.5rem 3rem', textAlign: 'center' }}>
        <span style={{ display: 'inline-block', padding: '0.25rem 0.875rem', backgroundColor: 'rgba(30,168,212,0.12)', border: '1px solid rgba(30,168,212,0.3)', borderRadius: 999, color: CYAN, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: '1.75rem' }}>
          Scale
        </span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
          $5B+ processed annually.<br />You&apos;re in good company.
        </h1>
        <p style={{ color: 'rgba(232,237,242,0.65)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
          We work with merchants who process serious volume — not because it&apos;s easy, but because we&apos;ve built the infrastructure and relationships to actually handle it without cutting corners.
        </p>
      </section>

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

      <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem 3.5rem' }}>
        <div style={{ padding: '1.75rem 2rem', backgroundColor: 'rgba(30,168,212,0.06)', border: '1px solid rgba(30,168,212,0.18)', borderRadius: 16, textAlign: 'center', marginBottom: '1.25rem' }}>
          <p style={{ color: CYAN, fontWeight: 900, fontSize: '1.75rem', marginBottom: '0.35rem', fontFamily: 'var(--font-heading)' }}>$5B+</p>
          <p style={{ color: TEXT, fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.25rem' }}>Annual volume processed across our portfolio</p>
          <p style={{ color: MUTED, fontSize: '0.78rem' }}>Serious merchants trust us with serious money</p>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
          <p style={{ color: 'rgba(232,237,242,0.8)', fontSize: '0.9rem', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '0.75rem' }}>
            &ldquo;Other brokers plateaued us at the same acquirer for years. United Fintech opened three new acquiring relationships when we hit $50M/month.&rdquo;
          </p>
          <p style={{ color: MUTED, fontSize: '0.78rem', fontWeight: 600 }}>— High-volume merchant, e-commerce</p>
        </div>
      </section>

      <section style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.5rem 6rem', textAlign: 'center' }}>
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(30,168,212,0.2) 50%, transparent)', marginBottom: '3rem' }} />
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
          Ready to get started?
        </h2>
        <p style={{ color: MUTED, fontSize: '0.95rem', marginBottom: '2rem' }}>
          Share your current volume and processor setup. We&apos;ll show you what&apos;s possible.
        </p>
        <a
          href="/contact?interest=merchant_processing&topic=High-Volume+Processing"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.25rem', backgroundColor: CYAN, color: BG, borderRadius: 999, fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 0 32px rgba(30,168,212,0.3)' }}
        >
          Process at your scale
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BG} strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
        <p style={{ color: MUTED, fontSize: '0.78rem', marginTop: '1rem' }}>No commitment. Response within 24 hours.</p>
      </section>
    </div>
  )
}
