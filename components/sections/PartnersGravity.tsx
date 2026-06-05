'use client'

import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useAnimation, useInView } from 'framer-motion'

const PARTNERS = [
  { name: 'Stripe',     slug: 'stripe',     logo: 'https://logo.clearbit.com/stripe.com',            style: { background: '#635BFF', color: '#fff' } },
  { name: 'Square',     slug: 'square',     logo: 'https://logo.clearbit.com/squareup.com',           style: { background: '#1a1a1a', color: '#fff' } },
  { name: 'Tipalti',    slug: 'tipalti',    logo: 'https://logo.clearbit.com/tipalti.com',            style: { background: '#0073CF', color: '#fff' } },
  { name: 'Worldpay',   slug: 'worldpay',   logo: 'https://logo.clearbit.com/worldpay.com',           style: { background: '#004B87', color: '#fff' } },
  { name: 'Fiserv',     slug: 'fiserv',     logo: 'https://logo.clearbit.com/fiserv.com',             style: { background: '#FF6600', color: '#fff' } },
  { name: 'Mastercard', slug: 'mastercard', logo: 'https://logo.clearbit.com/mastercard.com',         style: { background: '#EB001B', color: '#fff' } },
  { name: 'FIS',        slug: 'fis',        logo: 'https://logo.clearbit.com/fisglobal.com',          style: { background: '#2D4E91', color: '#fff' } },
  { name: 'Braintree',  slug: 'braintree',  logo: 'https://logo.clearbit.com/braintreepayments.com', style: { background: '#009CDE', color: '#fff' } },
  { name: 'Visa',       slug: 'visa',       logo: 'https://logo.clearbit.com/visa.com',               style: { background: '#1A1F71', color: '#FAA61A' } },
  { name: 'Adyen',      slug: 'adyen',      logo: 'https://logo.clearbit.com/adyen.com',              style: { background: '#0ABF53', color: '#fff' } },
  { name: 'Airwallex',  slug: 'airwallex',  logo: 'https://logo.clearbit.com/airwallex.com',          style: { background: '#1B2B4B', color: '#1EA8D4' } },
  { name: 'PayPal',     slug: 'paypal',     logo: 'https://logo.clearbit.com/paypal.com',             style: { background: '#003087', color: '#F7C94B' } },
]

const CONTAINER_H = 400

const FLOAT_CSS = `
@keyframes uf-f0{0%,100%{transform:translate(0,0)rotate(0deg)}33%{transform:translate(18px,-14px)rotate(3deg)}66%{transform:translate(-10px,12px)rotate(-2deg)}}
@keyframes uf-f1{0%,100%{transform:translate(0,0)rotate(0deg)}33%{transform:translate(-16px,18px)rotate(-4deg)}66%{transform:translate(12px,-10px)rotate(2deg)}}
@keyframes uf-f2{0%,100%{transform:translate(0,0)rotate(0deg)}33%{transform:translate(14px,16px)rotate(2deg)}66%{transform:translate(-18px,-8px)rotate(-3deg)}}
@keyframes uf-f3{0%,100%{transform:translate(0,0)rotate(0deg)}33%{transform:translate(-12px,-16px)rotate(-2deg)}66%{transform:translate(16px,12px)rotate(4deg)}}
@keyframes uf-f4{0%,100%{transform:translate(0,0)rotate(0deg)}33%{transform:translate(20px,8px)rotate(4deg)}66%{transform:translate(-8px,-18px)rotate(-3deg)}}
@keyframes uf-f5{0%,100%{transform:translate(0,0)rotate(0deg)}33%{transform:translate(-20px,-8px)rotate(-4deg)}66%{transform:translate(8px,18px)rotate(3deg)}}
`

const FLOAT_DURATIONS = [4, 4.5, 3.8, 5, 4.2, 4.8, 4.1, 5.2, 3.9, 4.6, 4.4, 5.5]

type PosData = { left: number; finalY: number; fi: number; d: number }
type Partner = typeof PARTNERS[number]

function PartnerPill({ p, idx, pos, triggered }: {
  p: Partner; idx: number; pos: PosData; triggered: boolean
}) {
  const router = useRouter()
  const controls = useAnimation()
  const [settled, setSettled] = useState(false)
  const animated = useRef(false)

  useEffect(() => {
    if (!triggered || animated.current) return
    animated.current = true

    async function run() {
      controls.set({ y: -520, opacity: 1 })
      await new Promise<void>(r => setTimeout(r, idx * 35))

      // damping:14 limits overshoot to ~8% — pills stay inside the container
      await controls.start({
        y: CONTAINER_H - 60,
        transition: { type: 'spring', damping: 14, stiffness: 140, mass: 1, velocity: 18 },
      })
      await controls.start({
        y: pos.finalY,
        transition: { type: 'spring', damping: 14, stiffness: 220, mass: 1 },
      })
      setSettled(true)
    }
    run()
  }, [triggered, controls, idx, pos])

  return (
    <motion.div
      animate={controls}
      initial={{ y: -520, opacity: 0 }}
      style={{ position: 'absolute', left: `${pos.left}%`, top: 0, cursor: 'pointer', zIndex: 1, touchAction: 'none', userSelect: 'none' }}
      whileHover={{ scale: 1.1, zIndex: 10 }}
      onClick={() => router.push(`/providers/${p.slug}`)}
    >
      <div style={{ animation: settled ? `uf-f${pos.fi} ${FLOAT_DURATIONS[idx]}s ease-in-out ${pos.d}s infinite` : 'none' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.45rem',
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 9999,
          padding: '0.4rem 0.9rem 0.4rem 0.45rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
          pointerEvents: 'none', whiteSpace: 'nowrap',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', flexShrink: 0,
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.logo} alt={p.name} width={22} height={22}
              style={{ objectFit: 'contain', display: 'block' }}
              onError={(e) => {
                const t = e.currentTarget; t.style.display = 'none'
                const parent = t.parentElement
                if (parent) {
                  parent.style.background = p.style.background
                  parent.innerHTML = `<span style="color:${p.style.color};font-size:0.55rem;font-weight:900">${p.name.slice(0,2).toUpperCase()}</span>`
                }
              }}
            />
          </div>
          <span style={{ color: '#E8EDF2', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.04em' }}>
            {p.name}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default function PartnersGravity() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.25 })
  const [positions, setPositions] = useState<PosData[] | null>(null)

  useEffect(() => {
    setPositions(PARTNERS.map(() => ({
      left: Math.random() * 78 + 2,
      finalY: Math.random() * 290 + 15,  // 15–305px, safely inside 400px container
      fi: Math.floor(Math.random() * 6),
      d: Math.random() * 2.5,
    })))
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

      {/* overflow:visible so pills never clip at the bottom boundary */}
      <div style={{ position: 'relative', height: CONTAINER_H, width: '100%', overflow: 'visible' }}>
        {positions && PARTNERS.map((p, i) => (
          <PartnerPill key={p.name} p={p} idx={i} pos={positions[i]} triggered={inView} />
        ))}
      </div>

      <div style={{ height: '3rem' }} />
    </section>
  )
}
