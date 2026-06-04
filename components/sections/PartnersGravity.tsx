'use client'

import { Gravity, MatterBody } from '@/components/ui/gravity'
import { motion } from 'framer-motion'

const PARTNERS = [
  {
    name: 'Stripe',
    x: '15%', y: '8%', angle: -5,
    style: { background: 'rgba(99,91,255,0.12)', border: '1px solid rgba(99,91,255,0.35)', color: '#A5A0FF' },
  },
  {
    name: 'PayPal',
    x: '35%', y: '5%', angle: 3,
    style: { background: 'rgba(0,112,243,0.12)', border: '1px solid rgba(0,112,243,0.35)', color: '#60A9FF' },
  },
  {
    name: 'Airwallex',
    x: '55%', y: '10%', angle: -8,
    style: { background: 'rgba(43,184,230,0.12)', border: '1px solid rgba(43,184,230,0.35)', color: '#2BB8E6' },
  },
  {
    name: 'Tipalti',
    x: '75%', y: '6%', angle: 6,
    style: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)', color: '#C8D0DA' },
  },
  {
    name: 'Adyen',
    x: '20%', y: '25%', angle: -3,
    style: { background: 'rgba(10,45,90,0.4)', border: '1px solid rgba(0,175,230,0.35)', color: '#00AFE6' },
  },
  {
    name: 'Visa',
    x: '45%', y: '22%', angle: 4,
    style: { background: 'rgba(26,31,113,0.4)', border: '1px solid rgba(250,166,26,0.35)', color: '#FAA61A' },
  },
  {
    name: 'Mastercard',
    x: '65%', y: '28%', angle: -6,
    style: { background: 'rgba(235,0,27,0.08)', border: '1px solid rgba(235,0,27,0.25)', color: '#FF6B72' },
  },
  {
    name: 'Braintree',
    x: '85%', y: '15%', angle: 7,
    style: { background: 'rgba(43,184,230,0.08)', border: '1px solid rgba(43,184,230,0.25)', color: '#7ED8F0' },
  },
  {
    name: 'Square',
    x: '10%', y: '40%', angle: -2,
    style: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)', color: '#C8D0DA' },
  },
  {
    name: 'Worldpay',
    x: '30%', y: '38%', angle: 5,
    style: { background: 'rgba(0,84,166,0.2)', border: '1px solid rgba(0,150,255,0.3)', color: '#5BB8FF' },
  },
  {
    name: 'Fiserv',
    x: '60%', y: '35%', angle: -4,
    style: { background: 'rgba(255,102,0,0.08)', border: '1px solid rgba(255,102,0,0.25)', color: '#FF8C42' },
  },
  {
    name: 'FIS',
    x: '80%', y: '42%', angle: 8,
    style: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', color: '#9BA5B0' },
  },
]

export default function PartnersGravity() {
  return (
    <section
      style={{
        position: 'relative',
        background: 'linear-gradient(to bottom, #0A0C12 0%, #0D1018 100%)',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Subtle grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(43,184,230,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(43,184,230,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Header — static above the physics canvas */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '4rem 1.5rem 0' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p style={{ color: '#2BB8E6', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Technology Partners
          </p>
          <h2 style={{
            fontWeight: 900,
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: '#E8EDF2',
            marginBottom: '0.75rem',
          }}>
            Connected to the world&apos;s{' '}
            <span style={{ color: '#2BB8E6', fontStyle: 'italic' }}>payment rails.</span>
          </h2>
          <p style={{ color: '#7E8794', fontSize: '0.95rem', lineHeight: 1.75, maxWidth: 480, margin: '0 auto' }}>
            Drag the logos. We integrate natively with every major processor, gateway, and banking partner.
          </p>
        </motion.div>
      </div>

      {/* Physics canvas */}
      <div style={{ position: 'relative', height: 380, width: '100%' }}>
        <Gravity gravity={{ x: 0, y: 0.8 }} grabCursor addTopWall={false} className="w-full h-full">
          {PARTNERS.map((partner) => (
            <MatterBody
              key={partner.name}
              matterBodyOptions={{ friction: 0.3, restitution: 0.4, density: 0.002 }}
              x={partner.x}
              y={partner.y}
              angle={partner.angle}
            >
              <div
                style={{
                  ...partner.style,
                  borderRadius: 9999,
                  padding: '0.6rem 1.4rem',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  userSelect: 'none',
                }}
              >
                {partner.name}
              </div>
            </MatterBody>
          ))}
        </Gravity>
      </div>
    </section>
  )
}
