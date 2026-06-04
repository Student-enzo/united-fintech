'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'

const PARTNERS = [
  { name: 'Stripe',     style: { background: '#635BFF', color: '#fff' },  href: 'https://stripe.com' },
  { name: 'Square',     style: { background: '#1a1a1a', color: '#fff' },  href: 'https://squareup.com' },
  { name: 'Tipalti',    style: { background: '#0073CF', color: '#fff' },  href: 'https://tipalti.com' },
  { name: 'Worldpay',   style: { background: '#004B87', color: '#fff' },  href: 'https://worldpay.com' },
  { name: 'Fiserv',     style: { background: '#FF6600', color: '#fff' },  href: 'https://fiserv.com' },
  { name: 'Mastercard', style: { background: '#EB001B', color: '#fff' },  href: 'https://mastercard.com' },
  { name: 'FIS',        style: { background: '#2D4E91', color: '#fff' },  href: 'https://fisglobal.com' },
  { name: 'Braintree',  style: { background: '#009CDE', color: '#fff' },  href: 'https://braintreepayments.com' },
  { name: 'Visa',       style: { background: '#1A1F71', color: '#FAA61A' }, href: 'https://visa.com' },
  { name: 'Adyen',      style: { background: '#0ABF53', color: '#fff' },  href: 'https://adyen.com' },
  { name: 'Airwallex',  style: { background: '#1B2B4B', color: '#1EA8D4' }, href: 'https://airwallex.com' },
  { name: 'PayPal',     style: { background: '#003087', color: '#F7C94B' }, href: 'https://paypal.com' },
]

const CONTAINER_H = 400

// Subtle float animations on the inner wrapper (separate from framer-motion outer y)
const FLOAT_CSS = `
@keyframes uf-f0{0%,100%{transform:translate(0,0)rotate(0deg)}33%{transform:translate(18px,-14px)rotate(3deg)}66%{transform:translate(-10px,12px)rotate(-2deg)}}
@keyframes uf-f1{0%,100%{transform:translate(0,0)rotate(0deg)}33%{transform:translate(-16px,18px)rotate(-4deg)}66%{transform:translate(12px,-10px)rotate(2deg)}}
@keyframes uf-f2{0%,100%{transform:translate(0,0)rotate(0deg)}33%{transform:translate(14px,16px)rotate(2deg)}66%{transform:translate(-18px,-8px)rotate(-3deg)}}
@keyframes uf-f3{0%,100%{transform:translate(0,0)rotate(0deg)}33%{transform:translate(-12px,-16px)rotate(-2deg)}66%{transform:translate(16px,12px)rotate(4deg)}}
@keyframes uf-f4{0%,100%{transform:translate(0,0)rotate(0deg)}33%{transform:translate(20px,8px)rotate(4deg)}66%{transform:translate(-8px,-18px)rotate(-3deg)}}
@keyframes uf-f5{0%,100%{transform:translate(0,0)rotate(0deg)}33%{transform:translate(-20px,-8px)rotate(-4deg)}66%{transform:translate(8px,18px)rotate(3deg)}}
`

const FLOAT_DURATIONS = [4, 4.5, 3.8, 5, 4.2, 4.8, 4.1, 5.2, 3.9, 4.6, 4.4, 5.5]

type PosData = {
  left: number   // % across container width
  finalY: number // px from top of container (settled position)
  fi: number     // which float keyframe (0–5)
  d: number      // float animation delay (s)
}

type Partner = typeof PARTNERS[number]

function PartnerPill({
  p,
  idx,
  pos,
  triggered,
}: {
  p: Partner
  idx: number
  pos: PosData
  triggered: boolean
}) {
  const controls = useAnimation()
  const [settled, setSettled] = useState(false)
  const animated = useRef(false)

  useEffect(() => {
    if (!triggered || animated.current) return
    animated.current = true

    async function run() {
      // Snap above container (invisible, ready to fall)
      controls.set({ y: -520, opacity: 1 })

      // Stagger: each pill falls like a raindrop with slight delay
      await new Promise<void>(r => setTimeout(r, idx * 35))

      // Fall to floor with natural gravity + overshoot
      await controls.start({
        y: CONTAINER_H + 15,
        transition: {
          type: 'spring',
          damping: 8,
          stiffness: 120,
          mass: 1,
          velocity: 18,
        },
      })

      // Bounce up and settle at random grid position
      await controls.start({
        y: pos.finalY,
        transition: {
          type: 'spring',
          damping: 14,
          stiffness: 220,
          mass: 1,
        },
      })

      setSettled(true)
    }

    run()
  }, [triggered, controls, idx, pos])

  return (
    <motion.div
      animate={controls}
      initial={{ y: -520, opacity: 0 }}
      style={{
        position: 'absolute',
        left: `${pos.left}%`,
        top: 0,
        cursor: 'pointer',
        zIndex: 1,
        touchAction: 'none',
        userSelect: 'none',
      }}
      whileHover={{ scale: 1.1, zIndex: 10 }}
      onClick={() => window.open(p.href, '_blank', 'noopener,noreferrer')}
    >
      {/* Inner wrapper carries the float animation after settling */}
      <div
        style={{
          animation: settled
            ? `uf-f${pos.fi} ${FLOAT_DURATIONS[idx]}s ease-in-out ${pos.d}s infinite`
            : 'none',
        }}
      >
        <div
          style={{
            ...p.style,
            borderRadius: 9999,
            padding: '0.55rem 1.35rem',
            fontSize: '0.875rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 14px rgba(0,0,0,0.18)',
            pointerEvents: 'none',
          }}
        >
          {p.name}
        </div>
      </div>
    </motion.div>
  )
}

export default function PartnersGravity() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.25 })
  const [positions, setPositions] = useState<PosData[] | null>(null)

  // Generate random grid positions client-side only (avoids SSR hydration mismatch)
  useEffect(() => {
    setPositions(
      PARTNERS.map(() => ({
        left: Math.random() * 78 + 2,        // 2–80%
        finalY: Math.random() * 310 + 15,    // 15–325px inside 400px container
        fi: Math.floor(Math.random() * 6),
        d: Math.random() * 2.5,
      }))
    )
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: '#161616',
        backgroundImage: `
          linear-gradient(rgba(30,168,212,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(30,168,212,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '44px 44px',
        overflow: 'hidden',
      }}
    >
      <style>{FLOAT_CSS}</style>

      <div style={{ textAlign: 'center', padding: '4rem 1.5rem 2rem' }}>
        <p style={{ color: '#1EA8D4', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Technology Partners
        </p>
        <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', letterSpacing: '-0.03em', color: '#E8EDF2', marginBottom: '0.75rem' }}>
          Connected to the world&apos;s{' '}
          <span style={{ color: '#1EA8D4', fontStyle: 'italic' }}>payment rails.</span>
        </h2>
        <p style={{ color: 'rgba(232,237,242,0.55)', fontSize: '0.95rem', lineHeight: 1.75, maxWidth: 480, margin: '0 auto' }}>
          We integrate natively with every major processor, gateway, and banking partner. Click any logo to learn more.
        </p>
      </div>

      <div
        style={{ position: 'relative', height: CONTAINER_H, width: '100%', overflow: 'hidden' }}
      >
        {positions && PARTNERS.map((p, i) => (
          <PartnerPill
            key={p.name}
            p={p}
            idx={i}
            pos={positions[i]}
            triggered={inView}
          />
        ))}
      </div>

      <div style={{ height: '3rem' }} />
    </section>
  )
}
