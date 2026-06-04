'use client'

const BG2 = '#161616'
const TEXT = '#E8EDF2'
const MUTED = '#7E8794'
const CYAN = '#1EA8D4'
const BORDER = 'rgba(255,255,255,0.06)'

const FACTS = [
  { label: 'No hidden fees', icon: '✕', negative: true },
  { label: 'No mainstream-only networks', icon: '✕', negative: true },
  { label: 'United Fintech secures your processing', icon: '✓', negative: false },
]

export default function StatsBar() {
  return (
    <section style={{ backgroundColor: BG2, borderBottom: `1px solid ${BORDER}`, padding: '0.875rem 1.5rem' }}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0',
          flexWrap: 'wrap',
        }}
      >
        {FACTS.map((item, i) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1.25rem', flexShrink: 0 }}>
            {i > 0 && (
              <span style={{ color: BORDER, marginRight: '1.25rem', fontSize: '1.2rem', fontWeight: 200 }}>|</span>
            )}
            <span style={{ color: item.negative ? '#E8504A' : CYAN, fontWeight: 700, fontSize: '0.85rem' }}>
              {item.icon}
            </span>
            <span style={{ color: item.negative ? MUTED : TEXT, fontSize: '0.85rem', fontWeight: item.negative ? 400 : 600 }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
