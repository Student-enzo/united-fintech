'use client'

import { cn } from '@/lib/utils'
import React, { useState, useEffect } from 'react'

export interface CpuArchitectureSvgProps {
  className?: string
  width?: string
  height?: string
  showCpuConnections?: boolean
  lineMarkerSize?: number
  animateText?: boolean
  animateLines?: boolean
  animateMarkers?: boolean
}

type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unionpay' | 'jcb' | 'capitalone' | 'stripe'

function BrandCard({ cx, cy, brand }: { cx: number; cy: number; brand: CardBrand }) {
  const W = 22, H = 14
  const bgMap: Record<CardBrand, [string, string]> = {
    visa:       ['#1a1f7c', '#10164d'],
    mastercard: ['#1c1520', '#0d0a10'],
    amex:       ['#005b9f', '#003d6b'],
    discover:   ['#1a1a1a', '#0d0d0d'],
    unionpay:   ['#8b0000', '#5c0000'],
    jcb:        ['#005030', '#003020'],
    capitalone: ['#cc0000', '#8c0000'],
    stripe:     ['#6772e5', '#4b55c4'],
  }
  const [bg1, bg2] = bgMap[brand]
  const gradId = `card-bg-${brand}`

  return (
    <g transform={`translate(${cx},${cy})`} opacity="0.95">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={bg1} />
          <stop offset="100%" stopColor={bg2} />
        </linearGradient>
      </defs>
      <rect x={-W/2} y={-H/2} width={W} height={H} rx="2"
        fill={`url(#${gradId})`} stroke="rgba(255,255,255,0.18)" strokeWidth="0.35" />
      {/* EMV chip */}
      <rect x={-W/2+2} y={-H/2+2.5} width="5.5" height="4" rx="0.8"
        fill="url(#chip-grad)" stroke="rgba(200,155,50,0.5)" strokeWidth="0.2" />
      <line x1={-W/2+2} y1={-H/2+4.5} x2={-W/2+7.5} y2={-H/2+4.5}
        stroke="rgba(180,130,40,0.35)" strokeWidth="0.15" />
      <line x1={-W/2+4.75} y1={-H/2+2.5} x2={-W/2+4.75} y2={-H/2+6.5}
        stroke="rgba(180,130,40,0.35)" strokeWidth="0.15" />
      {/* NFC icon */}
      <g transform={`translate(${W/2-3}, ${-H/2+3.5})`}>
        <path d="M -1 -1.2 A 1.8 1.8 0 0 1 1 1.2" stroke="rgba(255,255,255,0.55)" strokeWidth="0.5" fill="none" />
        <path d="M -2 -2.2 A 3 3 0 0 1 2 2.2" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" fill="none" />
      </g>
      {/* Brand marks */}
      {brand === 'visa' && (
        <text x={W/2-2} y={H/2-1.5} textAnchor="end"
          fontSize="3.8" fontWeight="900" fontFamily="Arial,sans-serif" fill="white" letterSpacing="-0.03em">VISA</text>
      )}
      {brand === 'mastercard' && (
        <g transform={`translate(${W/2-5}, 0)`}>
          <circle cx="-1.4" cy="0" r="2.8" fill="#EB001B" opacity="0.92" />
          <circle cx="1.4" cy="0" r="2.8" fill="#F79E1B" opacity="0.92" />
          <ellipse cx="0" cy="0" rx="1.0" ry="2.8" fill="#FF5F00" opacity="0.6" />
        </g>
      )}
      {brand === 'amex' && (
        <text x={W/2-2} y={H/2-1.5} textAnchor="end"
          fontSize="3" fontWeight="900" fontFamily="Arial,sans-serif" fill="rgba(255,255,255,0.9)" letterSpacing="0.04em">AMEX</text>
      )}
      {brand === 'discover' && (
        <g transform={`translate(${W/2-3.5}, 0)`}>
          <circle cx="0" cy="0" r="3" fill="#FF6000" opacity="0.9" />
          <text x="-4.5" y="1.2" fontSize="2.4" fontWeight="800" fontFamily="Arial,sans-serif" fill="rgba(255,255,255,0.85)">disc</text>
        </g>
      )}
      {brand === 'unionpay' && (
        <text x={W/2-2} y={H/2-1.5} textAnchor="end"
          fontSize="2.4" fontWeight="800" fontFamily="Arial,sans-serif" fill="rgba(255,255,255,0.9)">UnionPay</text>
      )}
      {brand === 'jcb' && (
        <g transform={`translate(${W/2-5}, 0)`}>
          <rect x="-1.5" y="-2.5" width="3.2" height="5" rx="0.8" fill="#003087" />
          <rect x="0.8" y="-2.5" width="3.2" height="5" rx="0.8" fill="#cc0000" />
          <rect x="3" y="-2.5" width="3.2" height="5" rx="0.8" fill="#009f6b" />
        </g>
      )}
      {brand === 'capitalone' && (
        <text x={W/2-2} y={H/2-1.5} textAnchor="end"
          fontSize="2.4" fontWeight="800" fontFamily="Arial,sans-serif" fill="rgba(255,255,255,0.9)">Capital One</text>
      )}
      {brand === 'stripe' && (
        <text x={W/2-2} y={H/2-1.5} textAnchor="end"
          fontSize="3.2" fontWeight="800" fontFamily="Arial,sans-serif" fill="rgba(255,255,255,0.85)" letterSpacing="-0.01em">stripe</text>
      )}
      {/* Card number dots */}
      {[-3.6, -1.8, 0, 1.8].map((dx) => (
        <circle key={dx} cx={dx} cy={H/2-2} r="0.5" fill="rgba(255,255,255,0.35)" />
      ))}
    </g>
  )
}

function useCountUp(target: number, duration = 3200) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let start: number | null = null
    const from = target * 0.12
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(from + (target - from) * eased)
      if (progress < 1) requestAnimationFrame(step)
    }
    const raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}

// Custom UF Gateway terminal — draws in local coords (0,0 origin), caller translates
function PaymentHub({ amount }: { amount: string }) {
  return (
    <g filter="url(#hub-glow)">
      <rect x="79" y="27" width="42" height="46" rx="5"
        fill="url(#hub-body-grad)" stroke="rgba(30,168,212,0.6)" strokeWidth="0.6" />
      <rect x="82.5" y="30.5" width="35" height="18" rx="2"
        fill="#010810" stroke="rgba(30,168,212,0.25)" strokeWidth="0.3" />
      <rect x="82.5" y="30.5" width="35" height="1.8" rx="2" fill="rgba(30,168,212,0.35)" />
      <rect x="82.5" y="30.5" width="35" height="18" rx="2" fill="url(#screen-inner-grad)" opacity="0.5" />
      <text x="84" y="38.5" fontSize="3.8" fontWeight="700" letterSpacing="0.03em"
        fontFamily="monospace" fill="url(#cpu-text-gradient)" filter="url(#screen-glow)">
        ${amount}
      </text>
      <text x="84" y="41.8" fontSize="1.8" letterSpacing="0.14em" fontFamily="monospace" fill="rgba(30,168,212,0.55)">
        PROCESSING
      </text>
      <circle cx="111" cy="40.5" r="1.1" fill="#3DD68C">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="111" cy="40.5" r="2.2" fill="rgba(61,214,140,0.2)">
        <animate attributeName="r" values="1.4;2.8;1.4" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0;0.6" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <rect x="82.5" y="30.5" width="35" height="0.5" fill="rgba(30,168,212,0.08)" rx="0">
        <animate attributeName="y" values="30.5;47.5;30.5" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.6;0" dur="2.8s" repeatCount="indefinite" />
      </rect>
      <rect x="84" y="51.5" width="32" height="2.5" rx="0.8"
        fill="#000" stroke="rgba(30,168,212,0.35)" strokeWidth="0.3" />
      <line x1="84" y1="52.75" x2="116" y2="52.75"
        stroke="rgba(30,168,212,0.15)" strokeWidth="0.15" strokeDasharray="2 1.5" />
      <text x="100" y="51" textAnchor="middle" fontSize="1.4" fontFamily="monospace"
        letterSpacing="0.08em" fill="rgba(30,168,212,0.35)">INSERT CARD</text>
      <g transform="translate(100, 62)">
        <path d="M -3 -3 A 4.5 4.5 0 0 1 3 3" stroke="rgba(30,168,212,0.7)" strokeWidth="0.7" fill="none" />
        <path d="M -5 -5 A 7 7 0 0 1 5 5" stroke="rgba(30,168,212,0.4)" strokeWidth="0.7" fill="none" />
        <path d="M -7 -7 A 10 10 0 0 1 7 7" stroke="rgba(30,168,212,0.2)" strokeWidth="0.7" fill="none" />
        <circle cx="0" cy="0" r="1" fill="rgba(30,168,212,0.8)" />
      </g>
      <circle cx="88" cy="68" r="0.9" fill="#3DD68C" opacity="0.9" />
      <circle cx="91" cy="68" r="0.9" fill="rgba(30,168,212,0.7)" />
      <circle cx="94" cy="68" r="0.9" fill="rgba(255,255,255,0.2)" />
      <text x="100" y="71.5" textAnchor="middle" fontSize="1.5" fontFamily="Arial,sans-serif"
        letterSpacing="0.12em" fontWeight="700" fill="rgba(30,168,212,0.4)">UF GATEWAY</text>
      {([[81.5,29.5],[118.5,29.5],[81.5,71],[118.5,71]] as [number,number][]).map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r="0.9"
          fill="rgba(30,168,212,0.15)" stroke="rgba(30,168,212,0.3)" strokeWidth="0.25" />
      ))}
    </g>
  )
}

// Viewbox: 0 0 280 160 — terminal translated +40x +30y → center ≈ (140, 80)
// Terminal bounds: x 119–161, y 57–103
const PATHS = [
  // 1 Visa top-left     → terminal left
  { d: 'M 15 20 H 92 Q 102 20 102 30 V 80 H 119',                                            color: '#3B82F6' },
  // 2 Mastercard top-right → terminal top
  { d: 'M 265 15 H 168 Q 155 15 150 28 V 57',                                                color: '#F59E0B' },
  // 3 Amex upper-right  → terminal right top
  { d: 'M 215 25 V 50 Q 215 62 203 62 H 161',                                                color: '#8B5CF6' },
  // 4 JCB far lower-right → terminal right lower
  { d: 'M 262 128 H 200 Q 188 128 188 116 V 96 Q 188 84 176 84 H 161',                      color: '#10B981' },
  // 5 Discover right    → terminal right mid
  { d: 'M 228 98 H 192 Q 180 98 180 86 V 80 H 161',                                          color: '#F97316' },
  // 6 UnionPay bottom   → terminal bottom
  { d: 'M 140 152 V 103',                                                                     color: '#EF4444' },
  // 7 Stripe bottom-left → terminal bottom-left
  { d: 'M 80 145 H 115 Q 127 145 127 133 V 103',                                             color: '#6366F1' },
  // 8 Capital One left  → terminal left lower
  { d: 'M 18 105 H 94 Q 106 105 106 93 V 88 H 119',                                         color: '#EC4899' },
]

const CpuArchitecture = ({
  className,
  width = '100%',
  height = '100%',
  animateText = true,
  lineMarkerSize = 18,
  animateLines = true,
  animateMarkers = true,
}: CpuArchitectureSvgProps) => {
  const amount = useCountUp(142739.85)
  const formatted = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <svg
      className={cn('text-muted', className)}
      width={width}
      height={height}
      viewBox="0 0 280 160"
    >
      {/* Colored connection paths */}
      {PATHS.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill="none"
          stroke={p.color}
          strokeWidth="0.45"
          strokeOpacity="0.45"
          strokeDasharray={animateLines ? '100 100' : undefined}
          pathLength={animateLines ? 100 : undefined}
        >
          {animateLines && (
            <animate attributeName="stroke-dashoffset" from="100" to="0" dur="1s"
              fill="freeze" calcMode="spline" keySplines="0.25,0.1,0.5,1" keyTimes="0; 1" />
          )}
        </path>
      ))}

      {/* Animated light orbs — one per line */}
      {PATHS.map((p, i) => (
        <g key={i} mask={`url(#cpu-mask-${i+1})`}>
          <circle className={`cpu-architecture cpu-line-${i+1}`} cx="0" cy="0" r="8"
            fill={`url(#cpu-orb-grad-${i+1})`} />
        </g>
      ))}

      {/* Brand cards at path origins */}
      <BrandCard cx={15}  cy={20}  brand="visa" />
      <BrandCard cx={265} cy={15}  brand="mastercard" />
      <BrandCard cx={215} cy={25}  brand="amex" />
      <BrandCard cx={262} cy={128} brand="jcb" />
      <BrandCard cx={228} cy={98}  brand="discover" />
      <BrandCard cx={140} cy={152} brand="unionpay" />
      <BrandCard cx={80}  cy={145} brand="stripe" />
      <BrandCard cx={18}  cy={105} brand="capitalone" />

      {/* UF Gateway terminal — translated to center of new viewBox */}
      <g transform="translate(40, 30)">
        <PaymentHub amount={formatted} />
      </g>

      <defs>
        <linearGradient id="hub-body-grad" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#1a2535" />
          <stop offset="50%" stopColor="#0d1620" />
          <stop offset="100%" stopColor="#06090f" />
        </linearGradient>
        <radialGradient id="screen-inner-grad" cx="0.5" cy="0.1" r="0.6">
          <stop offset="0%" stopColor="rgba(30,168,212,0.15)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="hub-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#1EA8D4" floodOpacity="0.35" />
        </filter>
        <filter id="screen-glow" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="0.4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        {/* Per-path masks — match PATHS exactly */}
        {PATHS.map((p, i) => (
          <mask key={i} id={`cpu-mask-${i+1}`}>
            <path d={p.d} strokeWidth="0.8" stroke="white" fill="none" />
          </mask>
        ))}

        {/* Per-orb radial gradients */}
        {[
          ['#3B82F6','#0088FF'],   // 1 Visa blue
          ['#F59E0B','#FFD800'],   // 2 Mastercard gold
          ['#8B5CF6','#FF008B'],   // 3 Amex violet
          ['#10B981','#22c55e'],   // 4 JCB emerald
          ['#F97316','#f97316'],   // 5 Discover orange
          ['#EF4444','#EF4444'],   // 6 UnionPay red
          ['#6366F1','#818CF8'],   // 7 Stripe indigo
          ['#EC4899','#f43f5e'],   // 8 Capital One pink
        ].map(([c1, c2], i) => (
          <radialGradient key={i} id={`cpu-orb-grad-${i+1}`} fx="1">
            <stop offset="0%" stopColor={c1} />
            <stop offset="50%" stopColor={c2} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        ))}

        <linearGradient id="chip-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d4a843" />
          <stop offset="45%" stopColor="#8a6a28" />
          <stop offset="100%" stopColor="#c4983a" />
        </linearGradient>

        <marker id="cpu-circle-marker" viewBox="0 0 10 10" refX="5" refY="5"
          markerWidth={lineMarkerSize} markerHeight={lineMarkerSize}>
          <circle cx="5" cy="5" r="2" fill="black" stroke="#232323" strokeWidth="0.5">
            {animateMarkers && <animate attributeName="r" values="0; 3; 2" dur="0.5s" />}
          </circle>
        </marker>

        <linearGradient id="cpu-text-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1EA8D4">
            <animate attributeName="offset" values="-2; -1; 0" dur="4s" repeatCount="indefinite"
              calcMode="spline" keyTimes="0; 0.5; 1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
          </stop>
          <stop offset="25%" stopColor="white">
            <animate attributeName="offset" values="-1; 0; 1" dur="4s" repeatCount="indefinite"
              calcMode="spline" keyTimes="0; 0.5; 1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
          </stop>
          <stop offset="50%" stopColor="#1EA8D4">
            <animate attributeName="offset" values="0; 1; 2" dur="4s" repeatCount="indefinite"
              calcMode="spline" keyTimes="0; 0.5; 1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
          </stop>
        </linearGradient>
      </defs>
    </svg>
  )
}

export { CpuArchitecture }
