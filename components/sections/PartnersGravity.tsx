'use client'

import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useAnimation, useInView } from 'framer-motion'

const PARTNERS = [
  { name: 'Stripe',     slug: 'stripe',     logo: '/logos/stripe.svg' },
  { name: 'Square',     slug: 'square',     logo: '/logos/square.svg' },
  { name: 'Tipalti',    slug: 'tipalti',    logo: '/logos/tipalti.svg' },
  { name: 'Worldpay',   slug: 'worldpay',   logo: '/logos/worldpay.svg' },
  { name: 'Fiserv',     slug: 'fiserv',     logo: '/logos/fiserv.svg' },
  { name: 'Mastercard', slug: 'mastercard', logo: '/logos/mastercard.svg' },
  { name: 'FIS',        slug: 'fis',        logo: '/logos/fis.svg' },
  { name: 'Braintree',  slug: 'braintree',  logo: '/logos/braintree.svg' },
  { name: 'Visa',       slug: 'visa',       logo: '/logos/visa.svg' },
  { name: 'Adyen',      slug: 'adyen',      logo: '/logos/adyen.svg' },
  { name: 'Airwallex',  slug: 'airwallex',  logo: '/logos/airwallex.svg' },
  { name: 'PayPal',     slug: 'paypal',     logo: '/logos/paypal.svg' },
]

const CONTAINER_H = 440
const CARD_W = 108
const CARD_H = 64

type PosData = { left: number; finalY: number }
type Partner = typeof PARTNERS[number]

function PartnerCard({
  p, idx, pos, triggered, containerRef,
}: {
  p: Partner; idx: number; pos: PosData; triggered: boolean
  containerRef: React.RefObject<HTMLDivElement | null>
}) {
  const router = useRouter()
  const controls = useAnimation()
  const [settled, setSettled] = useState(false)
  const animated = useRef(false)
  const dragStart = useRef({ x: 0, y: 0, moved: false })

  useEffect(() => {
    if (!triggered || animated.current) return
    animated.current = true

    async function run() {
      controls.set({ y: -560, opacity: 0 })
      await new Promise<void>(r => setTimeout(r, idx * 45))
      controls.set({ opacity: 1 })

      await controls.start({
        y: CONTAINER_H - CARD_H - 4,
        transition: { type: 'spring', damping: 10, stiffness: 120, mass: 1, velocity: 22 },
      })
      await controls.start({
        y: pos.finalY,
        transition: { type: 'spring', damping: 18, stiffness: 200, mass: 1 },
      })
      setSettled(true)
    }
    run()
  }, [triggered, controls, idx, pos])

  return (
    <motion.div
      animate={controls}
      initial={{ y: -560, opacity: 0 }}
      drag={settled}
      dragMomentum={false}
      dragElastic={0.06}
      dragConstraints={containerRef}
      style={{
        position: 'absolute',
        left: `${pos.left}%`,
        top: 0,
        width: CARD_W,
        height: CARD_H,
        cursor: settled ? 'grab' : 'default',
        touchAction: 'none',
        userSelect: 'none',
        zIndex: 1,
      }}
      whileDrag={{ scale: 1.1, zIndex: 20, cursor: 'grabbing' }}
      whileHover={settled ? { scale: 1.06, zIndex: 10 } : {}}
      onPointerDown={(e) => {
        dragStart.current = { x: e.clientX, y: e.clientY, moved: false }
      }}
      onPointerMove={(e) => {
        if (!dragStart.current.moved) {
          const dx = Math.abs(e.clientX - dragStart.current.x)
          const dy = Math.abs(e.clientY - dragStart.current.y)
          if (dx > 4 || dy > 4) dragStart.current.moved = true
        }
      }}
      onClick={() => {
        if (!dragStart.current.moved) router.push(`/providers/${p.slug}`)
      }}
    >
      <div style={{
        width: '100%',
        height: '100%',
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 12px',
        boxShadow: '0 6px 28px rgba(0,0,0,0.45)',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.logo}
          alt={p.name}
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    </motion.div>
  )
}

export default function PartnersGravity() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.25 })
  const [positions, setPositions] = useState<PosData[] | null>(null)

  useEffect(() => {
    setPositions(PARTNERS.map(() => ({
      left: Math.random() * 74 + 2,
      finalY: Math.random() * (CONTAINER_H - CARD_H - 20) + 10,
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
      <div style={{ textAlign: 'center', padding: '4rem 1.5rem 2rem' }}>
        <p style={{ color: '#1EA8D4', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Technology Partners
        </p>
        <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', letterSpacing: '-0.03em', color: '#E8EDF2', marginBottom: '0.75rem' }}>
          Connected to the world&apos;s{' '}
          <span style={{ color: '#1EA8D4', fontStyle: 'italic' }}>payment rails.</span>
        </h2>
        <p style={{ color: 'rgba(232,237,242,0.55)', fontSize: '0.95rem', lineHeight: 1.75, maxWidth: 480, margin: '0 auto' }}>
          We integrate natively with every major processor, gateway, and banking partner.
          Click any logo to learn more, or drag to rearrange.
        </p>
      </div>

      <div
        ref={containerRef}
        style={{ position: 'relative', height: CONTAINER_H, width: '100%', overflow: 'hidden' }}
      >
        {positions && PARTNERS.map((p, i) => (
          <PartnerCard
            key={p.name}
            p={p}
            idx={i}
            pos={positions[i]}
            triggered={inView}
            containerRef={containerRef}
          />
        ))}
      </div>

      <div style={{ height: '3rem' }} />
    </section>
  )
}
