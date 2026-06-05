const CYAN = '#1EA8D4'
const BG = '#161616'
const TEXT = '#E8EDF2'
const MUTED = '#7E8794'

const POINTS = [
  { icon: '◈', title: 'Direct Relationships', body: 'Not aggregators. Actual underwriters who know our name and pick up the phone — every time.' },
  { icon: '↗', title: 'Better Rates', body: 'Volume-negotiated rates across 150+ banks. You benefit from the collective leverage of our entire portfolio.' },
  { icon: '⬡', title: 'Vertical Matching', body: 'We know which banks love your industry. And which ones to avoid. That knowledge takes years to build.' },
]

export default function BankingNetworkPage() {
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
          The Network
        </span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
          150+ banking relationships.<br />Built over years — not scraped from a list.
        </h1>
        <p style={{ color: 'rgba(232,237,242,0.65)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
          Most brokers email the same 5 processors. We pick up the phone and call a friend. That&apos;s the difference between a placement and the right placement.
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[{ v: '150+', l: 'Direct banking partners', s: 'Not white-labelled aggregators' }, { v: '30+', l: 'Countries covered', s: 'With local bank relationships' }].map((s) => (
            <div key={s.v} style={{ padding: '1.5rem', backgroundColor: 'rgba(30,168,212,0.06)', border: '1px solid rgba(30,168,212,0.18)', borderRadius: 16, textAlign: 'center' }}>
              <p style={{ color: CYAN, fontWeight: 900, fontSize: '2rem', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>{s.v}</p>
              <p style={{ color: TEXT, fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.2rem' }}>{s.l}</p>
              <p style={{ color: MUTED, fontSize: '0.72rem' }}>{s.s}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '1.25rem', padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
          <p style={{ color: 'rgba(232,237,242,0.8)', fontSize: '0.9rem', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '0.75rem' }}>
            &ldquo;They matched us with the exact bank that understood our subscription billing model. First call, first placement.&rdquo;
          </p>
          <p style={{ color: MUTED, fontSize: '0.78rem', fontWeight: 600 }}>— CFO, B2B SaaS company</p>
        </div>
      </section>

      <section style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.5rem 6rem', textAlign: 'center' }}>
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(30,168,212,0.2) 50%, transparent)', marginBottom: '3rem' }} />
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
          Ready to get started?
        </h2>
        <p style={{ color: MUTED, fontSize: '0.95rem', marginBottom: '2rem' }}>
          Tell us your vertical and volume. We&apos;ll tell you which bank is the exact right fit.
        </p>
        <a
          href="/contact?interest=all&topic=Banking+Network+Access"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.25rem', backgroundColor: CYAN, color: BG, borderRadius: 999, fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 0 32px rgba(30,168,212,0.3)' }}
        >
          See which bank fits your business
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BG} strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
        <p style={{ color: MUTED, fontSize: '0.78rem', marginTop: '1rem' }}>No commitment. Response within 24 hours.</p>
      </section>
    </div>
  )
}
