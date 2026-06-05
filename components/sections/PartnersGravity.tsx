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
const CARD_W = 116
const CARD_H = 68

// Gentle idle sway — applied to inner div so drag on outer div stays clean
const IDLE_CSS = `
@keyframes uf-i0{0%,100%{transform:translate(0,0)rotate(0deg)}30%{transform:translate(5px,-4px)rotate(1.2deg)}65%{transform:translate(-4px,3px)rotate(-0.8deg)}}
@keyframes uf-i1{0%,100%{transform:translate(0,0)rotate(0deg)}30%{transform:translate(-5px,4px)rotate(-1.2deg)}65%{transform:translate(4px,-4px)rotate(0.9deg)}}
@keyframes uf-i2{0%,100%{transform:translate(0,0)rotate(0deg)}30%{transform:translate(4px,5px)rotate(0.7deg)}65%{transform:translate(-5px,-3px)rotate(-1.1deg)}}
@keyframes uf-i3{0%,100%{transform:translate(0,0)rotate(0deg)}30%{transform:translate(-4px,-5px)rotate(-0.9deg)}65%{transform:translate(5px,4px)rotate(1.0deg)}}
@keyframes uf-i4{0%,100%{transform:translate(0,0)rotate(0deg)}30%{transform:translate(6px,3px)rotate(1.3deg)}65%{transform:translate(-3px,-5px)rotate(-0.7deg)}}
@keyframes uf-i5{0%,100%{transform:translate(0,0)rotate(0deg)}30%{transform:translate(-6px,-3px)rotate(-1.3deg)}65%{transform:translate(3px,5px)rotate(0.8deg)}}
`

const IDLE_DUR = [4.2, 4.8, 3.9, 5.1, 4.5, 3.7, 5.3, 4.1, 4.9, 3.6, 5.0, 4.4]

// Stratified zones: 4 cols × 3 rows guarantees even spread across the container
// Each zone: [leftMin%, leftMax%, yMin, yMax]
const ZONES: [number, number, number, number][] = [
  [1, 20, 8, 120],   [23, 42, 8, 120],   [46, 65, 8, 120],   [68, 87, 8, 120],
  [1, 20, 145, 255], [23, 42, 145, 255], [46, 65, 145, 255], [68, 87, 145, 255],
  [1, 20, 280, 370], [23, 42, 280, 370], [46, 65, 280, 370], [68, 87, 280, 370],
]

type PosData = { left: number; finalY: number; fi: number; delay: number }
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
      controls.set({ y: -580, opacity: 0 })
      await new Promise<void>(r => setTimeout(r, pos.delay))
      controls.set({ opacity: 1 })

      // Fall to near-bottom with bounce
      await controls.start({
        y: CONTAINER_H - CARD_H - 6,
        transition: { type: 'spring', damping: 9, stiffness: 110, mass: 1, velocity: 24 },
      })
      // Spring up to final resting place
      await controls.start({
        y: pos.finalY,
        transition: { type: 'spring', damping: 16, stiffness: 190, mass: 1 },
      })
      setSettled(true)
    }
    run()
  }, [triggered, controls, pos])

  return (
    <motion.div
      animate={controls}
      initial={{ y: -580, opacity: 0 }}
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
      whileDrag={{ scale: 1.12, zIndex: 20, cursor: 'grabbing' }}
      whileHover={settled ? { scale: 1.08, zIndex: 10 } : {}}
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
      {/* Inner div carries the idle sway — separate from drag transform */}
      <div style={{
        width: '100%',
        height: '100%',
        animation: settled
          ? `uf-i${pos.fi} ${IDLE_DUR[idx]}s ease-in-out ${(idx * 0.3) % 2.5}s infinite`
          : 'none',
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(255,255,255,0.11)',
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 14px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
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
      </div>
    </motion.div>
  )
}

export default function PartnersGravity() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.2 })
  const [positions, setPositions] = useState<PosData[] | null>(null)

  useEffect(() => {
    // Shuffle zones so visual order isn't grid-predictable
    const shuffledZones = [...ZONES].sort(() => Math.random() - 0.5)
    setPositions(PARTNERS.map((_, i) => {
      const [lMin, lMax, yMin, yMax] = shuffledZones[i]
      return {
        left: lMin + Math.random() * (lMax - lMin),
        finalY: yMin + Math.random() * (yMax - yMin),
        fi: Math.floor(Math.random() * 6),
        delay: i * 55 + Math.random() * 30,
      }
    }))
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
      <style>{IDLE_CSS}</style>

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
