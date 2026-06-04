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

      {/* Card body */}
      <rect x={-W/2} y={-H/2} width={W} height={H} rx="2"
        fill={`url(#${gradId})`} stroke="rgba(255,255,255,0.18)" strokeWidth="0.35" />

      {/* EMV chip */}
      <rect x={-W/2+2} y={-H/2+2.5} width="5.5" height="4" rx="0.8"
        fill="url(#chip-grad)" stroke="rgba(200,155,50,0.5)" strokeWidth="0.2" />
      <line x1={-W/2+2} y1={-H/2+4.5} x2={-W/2+7.5} y2={-H/2+4.5}
        stroke="rgba(180,130,40,0.35)" strokeWidth="0.15" />
      <line x1={-W/2+4.75} y1={-H/2+2.5} x2={-W/2+4.75} y2={-H/2+6.5}
        stroke="rgba(180,130,40,0.35)" strokeWidth="0.15" />

      {/* NFC tap icon */}
      <g transform={`translate(${W/2-3}, ${-H/2+3.5})`}>
        <path d="M -1 -1.2 A 1.8 1.8 0 0 1 1 1.2" stroke="rgba(255,255,255,0.55)" strokeWidth="0.5" fill="none" />
        <path d="M -2 -2.2 A 3 3 0 0 1 2 2.2" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" fill="none" />
      </g>

      {/* Brand mark */}
      {brand === 'visa' && (
        <text x={W/2-2} y={H/2-1.5} textAnchor="end"
          fontSize="3.8" fontWeight="900" fontFamily="Arial,sans-serif"
          fill="white" letterSpacing="-0.03em">VISA</text>
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
          fontSize="3" fontWeight="900" fontFamily="Arial,sans-serif"
          fill="rgba(255,255,255,0.9)" letterSpacing="0.04em">AMEX</text>
      )}
      {brand === 'discover' && (
        <g transform={`translate(${W/2-3.5}, 0)`}>
          <circle cx="0" cy="0" r="3" fill="#FF6000" opacity="0.9" />
          <text x="-4.5" y="1.2" fontSize="2.4" fontWeight="800" fontFamily="Arial,sans-serif"
            fill="rgba(255,255,255,0.85)">disc</text>
        </g>
      )}
      {brand === 'unionpay' && (
        <text x={W/2-2} y={H/2-1.5} textAnchor="end"
          fontSize="2.4" fontWeight="800" fontFamily="Arial,sans-serif"
          fill="rgba(255,255,255,0.9)" letterSpacing="0.02em">UnionPay</text>
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
          fontSize="2.4" fontWeight="800" fontFamily="Arial,sans-serif"
          fill="rgba(255,255,255,0.9)" letterSpacing="0.01em">Capital One</text>
      )}
      {brand === 'stripe' && (
        <text x={W/2-2} y={H/2-1.5} textAnchor="end"
          fontSize="3.2" fontWeight="800" fontFamily="Arial,sans-serif"
          fill="rgba(255,255,255,0.85)" letterSpacing="-0.01em">stripe</text>
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

// Custom SVG payment processing terminal
function PaymentHub({ amount }: { amount: string }) {
  return (
    <g filter="url(#hub-glow)">
      {/* Outer body */}
      <rect x="79" y="27" width="42" height="46" rx="5"
        fill="url(#hub-body-grad)" stroke="rgba(30,168,212,0.6)" strokeWidth="0.6" />

      {/* Screen bezel */}
      <rect x="82.5" y="30.5" width="35" height="18" rx="2"
        fill="#010810" stroke="rgba(30,168,212,0.25)" strokeWidth="0.3" />

      {/* Screen top accent bar */}
      <rect x="82.5" y="30.5" width="35" height="1.8" rx="2"
        fill="rgba(30,168,212,0.35)" />

      {/* Screen glow overlay */}
      <rect x="82.5" y="30.5" width="35" height="18" rx="2"
        fill="url(#screen-inner-grad)" opacity="0.5" />

      {/* Amount text */}
      <text x="84" y="38.5"
        fontSize="3.8" fontWeight="700" letterSpacing="0.03em"
        fontFamily="monospace"
        fill="url(#cpu-text-gradient)"
        filter="url(#screen-glow)">
        ${amount}
      </text>

      {/* Status label */}
      <text x="84" y="41.8"
        fontSize="1.8" letterSpacing="0.14em"
        fontFamily="monospace"
        fill="rgba(30,168,212,0.55)">
        PROCESSING
      </text>

      {/* Live indicator dot */}
      <circle cx="111" cy="40.5" r="1.1" fill="#3DD68C">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="111" cy="40.5" r="2.2" fill="rgba(61,214,140,0.2)">
        <animate attributeName="r" values="1.4;2.8;1.4" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0;0.6" dur="1.6s" repeatCount="indefinite" />
      </circle>

      {/* Scan line */}
      <rect x="82.5" y="30.5" width="35" height="0.5" fill="rgba(30,168,212,0.08)" rx="0">
        <animate attributeName="y" values="30.5;47.5;30.5" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.6;0" dur="2.8s" repeatCount="indefinite" />
      </rect>

      {/* Card insert slot */}
      <rect x="84" y="51.5" width="32" height="2.5" rx="0.8"
        fill="#000" stroke="rgba(30,168,212,0.35)" strokeWidth="0.3" />
      <line x1="84" y1="52.75" x2="116" y2="52.75"
        stroke="rgba(30,168,212,0.15)" strokeWidth="0.15" strokeDasharray="2 1.5" />

      {/* Slot label */}
      <text x="100" y="51" textAnchor="middle"
        fontSize="1.4" fontFamily="monospace" letterSpacing="0.08em"
        fill="rgba(30,168,212,0.35)">INSERT CARD</text>

      {/* NFC tap zone */}
      <g transform="translate(100, 62)">
        <path d="M -3 -3 A 4.5 4.5 0 0 1 3 3" stroke="rgba(30,168,212,0.7)" strokeWidth="0.7" fill="none" />
        <path d="M -5 -5 A 7 7 0 0 1 5 5" stroke="rgba(30,168,212,0.4)" strokeWidth="0.7" fill="none" />
        <path d="M -7 -7 A 10 10 0 0 1 7 7" stroke="rgba(30,168,212,0.2)" strokeWidth="0.7" fill="none" />
        <circle cx="0" cy="0" r="1" fill="rgba(30,168,212,0.8)" />
      </g>

      {/* Status LEDs row */}
      <circle cx="88" cy="68" r="0.9" fill="#3DD68C" opacity="0.9" />
      <circle cx="91" cy="68" r="0.9" fill="rgba(30,168,212,0.7)" />
      <circle cx="94" cy="68" r="0.9" fill="rgba(255,255,255,0.2)" />

      {/* Brand label */}
      <text x="100" y="71.5" textAnchor="middle"
        fontSize="1.5" fontFamily="Arial,sans-serif" letterSpacing="0.12em"
        fontWeight="700" fill="rgba(30,168,212,0.4)">UF GATEWAY</text>

      {/* Corner accent screws */}
      {[[81.5,29.5],[118.5,29.5],[81.5,71],[118.5,71]].map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r="0.9"
          fill="rgba(30,168,212,0.15)" stroke="rgba(30,168,212,0.3)" strokeWidth="0.25" />
      ))}
    </g>
  )
}

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
      viewBox="0 0 200 110"
    >
      {/* Connection paths */}
      <g
        stroke="currentColor"
        fill="none"
        strokeWidth="0.3"
        strokeDasharray="100 100"
        pathLength="100"
      >
        <path strokeDasharray="100 100" pathLength="100" d="M 10 20 h 79.5 q 5 0 5 5 v 25" />
        <path strokeDasharray="100 100" pathLength="100" d="M 180 10 h -69.7 q -5 0 -5 5 v 25" />
        <path d="M 130 20 v 21.8 q 0 5 -5 5 h -10" />
        <path d="M 170 80 v -21.8 q 0 -5 -5 -5 h -50" />
        <path strokeDasharray="100 100" pathLength="100"
          d="M 135 65 h 15 q 5 0 5 5 v 10 q 0 5 -5 5 h -39.8 q -5 0 -5 -5 v -20" />
        <path d="M 94.8 100 v -24" />
        <path d="M 88 93 v -15 q 0 -5 -5 -5 h -10 q -5 0 -5 -5 v -5 q 0 -5 5 -5 h 14" />
        <path d="M 30 30 h 25 q 5 0 5 5 v 6.5 q 0 5 5 5 h 20" />
        {animateLines && (
          <animate attributeName="stroke-dashoffset" from="100" to="0" dur="1s"
            fill="freeze" calcMode="spline" keySplines="0.25,0.1,0.5,1" keyTimes="0; 1" />
        )}
      </g>

      {/* Animated light orbs */}
      <g mask="url(#cpu-mask-1)">
        <circle className="cpu-architecture cpu-line-1" cx="0" cy="0" r="8" fill="url(#cpu-blue-grad)" />
      </g>
      <g mask="url(#cpu-mask-2)">
        <circle className="cpu-architecture cpu-line-2" cx="0" cy="0" r="8" fill="url(#cpu-yellow-grad)" />
      </g>
      <g mask="url(#cpu-mask-3)">
        <circle className="cpu-architecture cpu-line-3" cx="0" cy="0" r="8" fill="url(#cpu-pinkish-grad)" />
      </g>
      <g mask="url(#cpu-mask-4)">
        <circle className="cpu-architecture cpu-line-4" cx="0" cy="0" r="8" fill="url(#cpu-white-grad)" />
      </g>
      <g mask="url(#cpu-mask-5)">
        <circle className="cpu-architecture cpu-line-5" cx="0" cy="0" r="8" fill="url(#cpu-green-grad)" />
      </g>
      <g mask="url(#cpu-mask-6)">
        <circle className="cpu-architecture cpu-line-6" cx="0" cy="0" r="8" fill="url(#cpu-orange-grad)" />
      </g>
      <g mask="url(#cpu-mask-7)">
        <circle className="cpu-architecture cpu-line-7" cx="0" cy="0" r="8" fill="url(#cpu-cyan-grad)" />
      </g>
      <g mask="url(#cpu-mask-8)">
        <circle className="cpu-architecture cpu-line-8" cx="0" cy="0" r="8" fill="url(#cpu-rose-grad)" />
      </g>

      {/* Brand cards at path origins */}
      <BrandCard cx={10}  cy={20}  brand="visa" />
      <BrandCard cx={180} cy={10}  brand="mastercard" />
      <BrandCard cx={130} cy={20}  brand="amex" />
      <BrandCard cx={170} cy={80}  brand="jcb" />
      <BrandCard cx={135} cy={65}  brand="discover" />
      <BrandCard cx={95}  cy={100} brand="unionpay" />
      <BrandCard cx={88}  cy={93}  brand="stripe" />
      <BrandCard cx={30}  cy={30}  brand="capitalone" />

      {/* Custom UF Gateway terminal */}
      <PaymentHub amount={formatted} />

      <defs>
        {/* Hub body gradient */}
        <linearGradient id="hub-body-grad" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#1a2535" />
          <stop offset="50%" stopColor="#0d1620" />
          <stop offset="100%" stopColor="#06090f" />
        </linearGradient>

        {/* Screen inner gradient */}
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

        {/* Path masks for orbs */}
        <mask id="cpu-mask-1">
          <path d="M 10 20 h 79.5 q 5 0 5 5 v 20" strokeWidth="0.5" stroke="white" />
        </mask>
        <mask id="cpu-mask-2">
          <path d="M 180 10 h -69.7 q -5 0 -5 5 v 20" strokeWidth="0.5" stroke="white" />
        </mask>
        <mask id="cpu-mask-3">
          <path d="M 130 20 v 21.8 q 0 5 -5 5 h -25" strokeWidth="0.5" stroke="white" />
        </mask>
        <mask id="cpu-mask-4">
          <path d="M 170 80 v -21.8 q 0 -5 -5 -5 h -65" strokeWidth="0.5" stroke="white" />
        </mask>
        <mask id="cpu-mask-5">
          <path d="M 135 65 h 15 q 5 0 5 5 v 10 q 0 5 -5 5 h -39.8 q -5 0 -5 -5 v -35"
            strokeWidth="0.5" stroke="white" />
        </mask>
        <mask id="cpu-mask-6">
          <path d="M 94.8 100 v -46" strokeWidth="0.5" stroke="white" />
        </mask>
        <mask id="cpu-mask-7">
          <path d="M 88 93 v -15 q 0 -5 -5 -5 h -10 q -5 0 -5 -5 v -5 q 0 -5 5 -5 h 28"
            strokeWidth="0.5" stroke="white" />
        </mask>
        <mask id="cpu-mask-8">
          <path d="M 30 30 h 25 q 5 0 5 5 v 6.5 q 0 5 5 5 h 35"
            strokeWidth="0.5" stroke="white" />
        </mask>

        {/* EMV chip gradient */}
        <linearGradient id="chip-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d4a843" />
          <stop offset="45%" stopColor="#8a6a28" />
          <stop offset="100%" stopColor="#c4983a" />
        </linearGradient>

        {/* Orb gradients */}
        <radialGradient id="cpu-blue-grad" fx="1">
          <stop offset="0%" stopColor="#00E8ED" />
          <stop offset="50%" stopColor="#0088FF" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="cpu-yellow-grad" fx="1">
          <stop offset="0%" stopColor="#FFD800" />
          <stop offset="50%" stopColor="#FFD800" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="cpu-pinkish-grad" fx="1">
          <stop offset="0%" stopColor="#830CD1" />
          <stop offset="50%" stopColor="#FF008B" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="cpu-white-grad" fx="1">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="cpu-green-grad" fx="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="cpu-orange-grad" fx="1">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="cpu-cyan-grad" fx="1">
          <stop offset="0%" stopColor="#1EA8D4" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="cpu-rose-grad" fx="1">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        <marker id="cpu-circle-marker" viewBox="0 0 10 10" refX="5" refY="5"
          markerWidth={lineMarkerSize} markerHeight={lineMarkerSize}>
          <circle id="innerMarkerCircle" cx="5" cy="5" r="2"
            fill="black" stroke="#232323" strokeWidth="0.5">
            {animateMarkers && (
              <animate attributeName="r" values="0; 3; 2" dur="0.5s" />
            )}
          </circle>
        </marker>

        <linearGradient id="cpu-text-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1EA8D4">
            <animate attributeName="offset" values="-2; -1; 0" dur="4s"
              repeatCount="indefinite" calcMode="spline"
              keyTimes="0; 0.5; 1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
          </stop>
          <stop offset="25%" stopColor="white">
            <animate attributeName="offset" values="-1; 0; 1" dur="4s"
              repeatCount="indefinite" calcMode="spline"
              keyTimes="0; 0.5; 1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
          </stop>
          <stop offset="50%" stopColor="#1EA8D4">
            <animate attributeName="offset" values="0; 1; 2" dur="4s"
              repeatCount="indefinite" calcMode="spline"
              keyTimes="0; 0.5; 1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
          </stop>
        </linearGradient>
      </defs>
    </svg>
  )
}

export { CpuArchitecture }
