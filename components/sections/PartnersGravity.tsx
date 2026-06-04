'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'

const PARTNERS = [
  { name: 'Stripe',     x: '3%',  y: '10%', d: 0.0, a: -3, fi: 0, style: { background: '#635BFF', color: '#fff' } },
  { name: 'Square',     x: '44%', y: '4%',  d: 0.8, a: -1, fi: 1, style: { background: '#1a1a1a', color: '#fff' } },
  { name: 'Tipalti',   x: '74%', y: '8%',  d: 1.4, a:  4, fi: 2, style: { background: '#0073CF', color: '#fff' } },
  { name: 'Worldpay',  x: '22%', y: '28%', d: 0.4, a: -3, fi: 3, style: { background: '#004B87', color: '#fff' } },
  { name: 'Fiserv',    x: '64%', y: '22%', d: 2.0, a:  5, fi: 4, style: { background: '#FF6600', color: '#fff' } },
  { name: 'Mastercard',x: '12%', y: '52%', d: 1.0, a: -1, fi: 5, style: { background: '#EB001B', color: '#fff' } },
  { name: 'FIS',       x: '50%', y: '44%', d: 0.6, a:  3, fi: 0, style: { background: '#2D4E91', color: '#fff' } },
  { name: 'Braintree', x: '83%', y: '36%', d: 1.8, a: -5, fi: 1, style: { background: '#009CDE', color: '#fff' } },
  { name: 'Visa',      x: '6%',  y: '72%', d: 2.2, a:  2, fi: 2, style: { background: '#1A1F71', color: '#FAA61A' } },
  { name: 'Adyen',     x: '36%', y: '66%', d: 1.2, a: -4, fi: 3, style: { background: '#0ABF53', color: '#fff' } },
  { name: 'Airwallex', x: '66%', y: '70%', d: 0.2, a:  6, fi: 4, style: { background: '#1B2B4B', color: '#2BB8E6' } },
  { name: 'PayPal',    x: '86%', y: '60%', d: 1.6, a: -2, fi: 5, style: { background: '#003087', color: '#F7C94B' } },
]

const FLOAT_CSS = `
@keyframes uf-f0{0%,100%{transform:translate(0,0)rotate(0deg)}33%{transform:translate(18px,-14px)rotate(3deg)}66%{transform:translate(-10px,12px)rotate(-2deg)}}
@keyframes uf-f1{0%,100%{transform:translate(0,0)rotate(0deg)}33%{transform:translate(-16px,18px)rotate(-4deg)}66%{transform:translate(12px,-10px)rotate(2deg)}}
@keyframes uf-f2{0%,100%{transform:translate(0,0)rotate(0deg)}33%{transform:translate(14px,16px)rotate(2deg)}66%{transform:translate(-18px,-8px)rotate(-3deg)}}
@keyframes uf-f3{0%,100%{transform:translate(0,0)rotate(0deg)}33%{transform:translate(-12px,-16px)rotate(-2deg)}66%{transform:translate(16px,12px)rotate(4deg)}}
@keyframes uf-f4{0%,100%{transform:translate(0,0)rotate(0deg)}33%{transform:translate(20px,8px)rotate(4deg)}66%{transform:translate(-8px,-18px)rotate(-3deg)}}
@keyframes uf-f5{0%,100%{transform:translate(0,0)rotate(0deg)}33%{transform:translate(-20px,-8px)rotate(-4deg)}66%{transform:translate(8px,18px)rotate(3deg)}}
`

const DURATIONS = [6, 7, 5.5, 8, 6.5, 7.5, 6.2, 8.2, 5.8, 7.2, 6.8, 8.5]

export default function PartnersGravity() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section style={{ background: '#fff', overflow: 'hidden' }}>
      <style>{FLOAT_CSS}</style>

      {/* Header */}
      <div style={{ textAlign: 'center', padding: '4rem 1.5rem 2rem' }}>
        <p style={{ color: '#2BB8E6', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Technology Partners
        </p>
        <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', letterSpacing: '-0.03em', color: '#0D1B2A', marginBottom: '0.75rem' }}>
          Connected to the world&apos;s{' '}
          <span style={{ color: '#2BB8E6', fontStyle: 'italic' }}>payment rails.</span>
        </h2>
        <p style={{ color: '#6B7280', fontSize: '0.95rem', lineHeight: 1.75, maxWidth: 480, margin: '0 auto' }}>
          Grab the logos. We integrate natively with every major processor, gateway, and banking partner.
        </p>
      </div>

      {/* Floating canvas */}
      <div
        ref={containerRef}
        style={{ position: 'relative', height: 380, width: '100%', overflow: 'hidden' }}
      >
        {PARTNERS.map((p, i) => (
          <motion.div
            key={p.name}
            drag
            dragConstraints={containerRef}
            dragElastic={0.06}
            dragMomentum={false}
            style={{ position: 'absolute', left: p.x, top: p.y, cursor: 'grab', touchAction: 'none', zIndex: 1 }}
            whileDrag={{ scale: 1.1, zIndex: 50, cursor: 'grabbing' }}
          >
            {/* Inner div carries the CSS float — separate from drag transform */}
            <div style={{ animation: `uf-f${p.fi} ${DURATIONS[i]}s ease-in-out ${p.d}s infinite` }}>
              <div style={{
                ...p.style,
                borderRadius: 9999,
                padding: '0.55rem 1.35rem',
                fontSize: '0.875rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 14px rgba(0,0,0,0.13)',
                userSelect: 'none',
                transform: `rotate(${p.a}deg)`,
              }}>
                {p.name}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ height: '3rem' }} />
    </section>
  )
}
