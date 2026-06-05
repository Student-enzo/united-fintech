const CYAN = '#1EA8D4'
const BG = '#161616'
const TEXT = '#E8EDF2'
const MUTED = '#7E8794'

const POINTS = [
  { icon: '⟳', title: 'Multi-Currency Settlement', body: 'Settle in the currency that makes sense for your business. We handle the FX complexity end-to-end.' },
  { icon: '✓', title: 'Compliance Built In', body: 'AML, KYC, and local licensing — already handled in every market we operate. Not your problem to solve.' },
  { icon: '◎', title: 'One Point of Contact', body: 'Regardless of how many countries you&apos;re in, you have one relationship manager and one conversation.' },
]

export default function GlobalReachPage() {
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
          Global Reach
        </span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
          30+ countries.<br />One conversation.
        </h1>
        <p style={{ color: 'rgba(232,237,242,0.65)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
          Cross-border payment infrastructure shouldn&apos;t require a legal team in every country. We&apos;ve done that work already. You just need to tell us where you want to go.
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
          <p style={{ color: TEXT, fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '0.5rem' }}>
            Serving merchants in <strong style={{ color: CYAN }}>30+ countries</strong> across North America, Europe, Asia-Pacific, and LATAM.
          </p>
          <p style={{ color: MUTED, fontSize: '0.78rem' }}>Local compliance, local banking, local settlement — all managed centrally.</p>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
          <p style={{ color: 'rgba(232,237,242,0.8)', fontSize: '0.9rem', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '0.75rem' }}>
            &ldquo;We were operating in 8 countries with 8 different processors. Now we have one call, one invoice, one relationship.&rdquo;
          </p>
          <p style={{ color: MUTED, fontSize: '0.78rem', fontWeight: 600 }}>— Founder, cross-border fintech</p>
        </div>
      </section>

      <section style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.5rem 6rem', textAlign: 'center' }}>
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(30,168,212,0.2) 50%, transparent)', marginBottom: '3rem' }} />
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
          Ready to get started?
        </h2>
        <p style={{ color: MUTED, fontSize: '0.95rem', marginBottom: '2rem' }}>
          Tell us which markets you&apos;re targeting. We&apos;ll map out the path.
        </p>
        <a
          href="/contact?interest=all&topic=Cross-Border+Payments"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.25rem', backgroundColor: CYAN, color: BG, borderRadius: 999, fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 0 32px rgba(30,168,212,0.3)' }}
        >
          Start your global expansion
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BG} strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
        <p style={{ color: MUTED, fontSize: '0.78rem', marginTop: '1rem' }}>No commitment. Response within 24 hours.</p>
      </section>
    </div>
  )
}
