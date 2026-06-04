'use client'

import { cn } from '@/lib/utils'
import React from 'react'

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

// Mini credit card at a given (cx,cy) with an accent color
function Card({ cx, cy, accent }: { cx: number; cy: number; accent: string }) {
  return (
    <g transform={`translate(${cx},${cy})`}>
      <rect x="-8" y="-5" width="16" height="10" rx="1.5"
        fill="#0c1220" stroke={accent} strokeWidth="0.5" opacity="0.95" />
      {/* EMV chip */}
      <rect x="-6" y="-1.8" width="4" height="3.2" rx="0.5"
        fill="#8a7040" stroke="#b89050" strokeWidth="0.25" />
      <line x1="-6" y1="-0.2" x2="-2" y2="-0.2" stroke="#6a5030" strokeWidth="0.25" />
      {/* Magnetic stripe */}
      <rect x="-8" y="-0.8" width="16" height="2" fill="rgba(0,0,0,0.35)" />
      {/* Brand mark dot */}
      <circle cx="4.5" cy="-2.5" r="1.2" fill={accent} opacity="0.6" />
      <circle cx="6.2" cy="-2.5" r="1.2" fill={accent} opacity="0.35" />
    </g>
  )
}

const CpuArchitecture = ({
  className,
  width = '100%',
  height = '100%',
  showCpuConnections = true,
  animateText = true,
  lineMarkerSize = 18,
  animateLines = true,
  animateMarkers = true,
}: CpuArchitectureSvgProps) => {
  return (
    <svg
      className={cn('text-muted', className)}
      width={width}
      height={height}
      viewBox="0 0 200 100"
    >
      {/* Connection paths */}
      <g
        stroke="currentColor"
        fill="none"
        strokeWidth="0.3"
        strokeDasharray="100 100"
        pathLength="100"
      >
        <path strokeDasharray="100 100" pathLength="100" d="M 10 20 h 79.5 q 5 0 5 5 v 30" />
        <path strokeDasharray="100 100" pathLength="100" d="M 180 10 h -69.7 q -5 0 -5 5 v 30" />
        <path d="M 130 20 v 21.8 q 0 5 -5 5 h -10" />
        <path d="M 170 80 v -21.8 q 0 -5 -5 -5 h -50" />
        <path strokeDasharray="100 100" pathLength="100"
          d="M 135 65 h 15 q 5 0 5 5 v 10 q 0 5 -5 5 h -39.8 q -5 0 -5 -5 v -20" />
        <path d="M 94.8 95 v -36" />
        <path d="M 88 88 v -15 q 0 -5 -5 -5 h -10 q -5 0 -5 -5 v -5 q 0 -5 5 -5 h 14" />
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

      {/* Credit cards at path origins */}
      <Card cx={10}   cy={20}  accent="#0088FF" />
      <Card cx={180}  cy={10}  accent="#FFD800" />
      <Card cx={130}  cy={20}  accent="#FF008B" />
      <Card cx={170}  cy={80}  accent="#ffffff" />
      <Card cx={135}  cy={65}  accent="#22c55e" />
      <Card cx={95}   cy={95}  accent="#f97316" />
      <Card cx={88}   cy={88}  accent="#06b6d4" />
      <Card cx={30}   cy={30}  accent="#f43f5e" />

      {/* POS Terminal (replaces CPU box) */}
      <g>
        {/* Connection pins — same layout as original */}
        {showCpuConnections && (
          <g fill="url(#cpu-connection-gradient)">
            <rect x="93"   y="37"   width="2.5" height="5" rx="0.7" />
            <rect x="104"  y="37"   width="2.5" height="5" rx="0.7" />
            <rect x="116.3" y="44"  width="2.5" height="5" rx="0.7" transform="rotate(90 116.25 45.5)" />
            <rect x="122.8" y="44"  width="2.5" height="5" rx="0.7" transform="rotate(90 116.25 45.5)" />
            <rect x="104"  y="16"   width="2.5" height="5" rx="0.7" transform="rotate(180 105.25 39.5)" />
            <rect x="114.5" y="16"  width="2.5" height="5" rx="0.7" transform="rotate(180 105.25 39.5)" />
            <rect x="80"   y="-13.6" width="2.5" height="5" rx="0.7" transform="rotate(270 115.25 19.5)" />
            <rect x="87"   y="-13.6" width="2.5" height="5" rx="0.7" transform="rotate(270 115.25 19.5)" />
          </g>
        )}

        {/* Terminal body */}
        <rect x="84" y="35" width="32" height="30" rx="2.5"
          fill="#0c1220" stroke="rgba(43,184,230,0.5)" strokeWidth="0.5"
          filter="url(#cpu-light-shadow)" />

        {/* Screen */}
        <rect x="87" y="38" width="26" height="10" rx="1.5"
          fill="#060e1a" stroke="rgba(43,184,230,0.25)" strokeWidth="0.3" />
        {/* Screen glow top bar */}
        <rect x="87" y="38" width="26" height="2.5" rx="1.5"
          fill="rgba(43,184,230,0.12)" />
        {/* Amount text — animated shimmer */}
        <text x="88.5" y="45.5" fontSize="4" fontWeight="700" letterSpacing="0.04em"
          fill={animateText ? 'url(#cpu-text-gradient)' : '#2BB8E6'}>
          $24,891.50
        </text>
        <text x="88.5" y="47.2" fontSize="2.2" fill="rgba(43,184,230,0.4)" letterSpacing="0.06em">
          APPROVED
        </text>

        {/* Card slot */}
        <rect x="87" y="49.5" width="26" height="1.8" rx="0.4"
          fill="#030810" stroke="rgba(43,184,230,0.4)" strokeWidth="0.3" />
        {/* Slot arrow hint */}
        <text x="96" y="51" fontSize="2" fill="rgba(43,184,230,0.35)" letterSpacing="0.04em">
          ▶ INSERT
        </text>

        {/* Keypad area */}
        <rect x="87" y="53" width="26" height="10" rx="1.2" fill="#08101c" />
        {/* Keys: 3 cols × 2 rows */}
        {[91, 100, 109].map((cx) =>
          [56.5, 60].map((cy) => (
            <rect key={`${cx}-${cy}`}
              x={cx - 2.5} y={cy - 1.5} width="5" height="3" rx="0.6"
              fill="#111827" stroke="rgba(255,255,255,0.08)" strokeWidth="0.2" />
          ))
        )}
        {/* Confirm key (cyan) */}
        <rect x="106.5" y="58.5" width="5" height="3" rx="0.6"
          fill="rgba(43,184,230,0.25)" stroke="rgba(43,184,230,0.6)" strokeWidth="0.3" />

        {/* NFC symbol in top-right of terminal */}
        <g stroke="rgba(43,184,230,0.5)" fill="none" strokeWidth="0.4" transform="translate(111,41)">
          <path d="M0 2 a2.5 2.5 0 0 1 0 -4" />
          <path d="M1.2 2.8 a4 4 0 0 1 0 -5.6" />
        </g>
      </g>

      <defs>
        {/* Path masks for light orbs */}
        <mask id="cpu-mask-1">
          <path d="M 10 20 h 79.5 q 5 0 5 5 v 24" strokeWidth="0.5" stroke="white" />
        </mask>
        <mask id="cpu-mask-2">
          <path d="M 180 10 h -69.7 q -5 0 -5 5 v 24" strokeWidth="0.5" stroke="white" />
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
          <path d="M 94.8 95 v -46" strokeWidth="0.5" stroke="white" />
        </mask>
        <mask id="cpu-mask-7">
          <path d="M 88 88 v -15 q 0 -5 -5 -5 h -10 q -5 0 -5 -5 v -5 q 0 -5 5 -5 h 28"
            strokeWidth="0.5" stroke="white" />
        </mask>
        <mask id="cpu-mask-8">
          <path d="M 30 30 h 25 q 5 0 5 5 v 6.5 q 0 5 5 5 h 35"
            strokeWidth="0.5" stroke="white" />
        </mask>

        {/* Radial gradients for orbs */}
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
          <stop offset="0%" stopColor="#2BB8E6" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="cpu-rose-grad" fx="1">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        <filter id="cpu-light-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="3"
            floodColor="#2BB8E6" floodOpacity="0.2" />
        </filter>

        <marker id="cpu-circle-marker" viewBox="0 0 10 10" refX="5" refY="5"
          markerWidth={lineMarkerSize} markerHeight={lineMarkerSize}>
          <circle id="innerMarkerCircle" cx="5" cy="5" r="2"
            fill="black" stroke="#232323" strokeWidth="0.5">
            {animateMarkers && (
              <animate attributeName="r" values="0; 3; 2" dur="0.5s" />
            )}
          </circle>
        </marker>

        <linearGradient id="cpu-connection-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4F4F4F" />
          <stop offset="60%" stopColor="#121214" />
        </linearGradient>

        <linearGradient id="cpu-text-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2BB8E6">
            <animate attributeName="offset" values="-2; -1; 0" dur="4s"
              repeatCount="indefinite" calcMode="spline"
              keyTimes="0; 0.5; 1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
          </stop>
          <stop offset="25%" stopColor="white">
            <animate attributeName="offset" values="-1; 0; 1" dur="4s"
              repeatCount="indefinite" calcMode="spline"
              keyTimes="0; 0.5; 1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
          </stop>
          <stop offset="50%" stopColor="#2BB8E6">
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
