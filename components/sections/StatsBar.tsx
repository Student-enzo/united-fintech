// TODO: Confirm real numbers before publish — current values are placeholders from brief.

const STATS = [
  { value: '30+', label: 'Countries' },
  { value: '150+', label: 'Financial Institutions' },
  { value: '24/7', label: 'Global Support' },
  { value: '99.9%', label: 'Uptime' },
]

export default function StatsBar() {
  return (
    <section style={{ backgroundColor: '#0A0C12', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-6" style={{ padding: '2.5rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}
          className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-outfit)', fontWeight: 300,
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                letterSpacing: '0.04em', color: '#2BB8E6',
                lineHeight: 1,
              }}>
                {stat.value}
              </div>
              <div style={{
                marginTop: '0.5rem',
                color: '#7E8794', fontSize: '0.7rem',
                fontWeight: 600, letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
