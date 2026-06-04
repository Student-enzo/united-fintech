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

// Premium dark credit card
function Card({ cx, cy, accent }: { cx: number; cy: number; accent: string }) {
  return (
    <g transform={`translate(${cx},${cy})`} opacity="0.92">
      {/* Card body — dark gradient with silver border */}
      <rect x="-9" y="-6" width="18" height="12" rx="1.8"
        fill="url(#card-body-grad)" stroke="rgba(255,255,255,0.22)" strokeWidth="0.35" />
      {/* Subtle accent top-edge shimmer */}
      <rect x="-9" y="-6" width="18" height="1.6" rx="1.8"
        fill={accent} opacity="0.22" />
      {/* EMV chip — gold gradient */}
      <rect x="-6.5" y="-2.8" width="5" height="4" rx="0.7"
        fill="url(#chip-grad)" stroke="rgba(200,155,50,0.5)" strokeWidth="0.2" />
      <line x1="-6.5" y1="-0.8" x2="-1.5" y2="-0.8" stroke="rgba(180,130,40,0.35)" strokeWidth="0.15" />
      <line x1="-4" y1="-2.8" x2="-4" y2="1.2" stroke="rgba(180,130,40,0.35)" strokeWidth="0.15" />
      {/* Card number dots */}
      {[-2.2, -0.4, 1.4, 3.2].map((dx, i) => (
        <circle key={i} cx={dx} cy="2.8" r="0.45" fill="rgba(255,255,255,0.32)" />
      ))}
      {/* Brand mark — overlapping circles */}
      <circle cx="4.6" cy="-3.6" r="1.5" fill={accent} opacity="0.75" />
      <circle cx="6.5" cy="-3.6" r="1.5" fill={accent} opacity="0.38" />
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
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(from + (target - from) * eased)
      if (progress < 1) requestAnimationFrame(step)
    }
    const raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
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
  const amount = useCountUp(142739.85)
  const formatted = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

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

      {/* Credit cards at path origins — premium palette */}
      <Card cx={10}   cy={20}  accent="#5B9BD5" />
      <Card cx={180}  cy={10}  accent="#C4A436" />
      <Card cx={130}  cy={20}  accent="#9B4A8E" />
      <Card cx={170}  cy={80}  accent="#B8C4CE" />
      <Card cx={135}  cy={65}  accent="#3A8C6A" />
      <Card cx={95}   cy={95}  accent="#C46030" />
      <Card cx={88}   cy={88}  accent="#1EA8D4" />
      <Card cx={30}   cy={30}  accent="#C45A5A" />

      {/* POS Terminal — photorealistic image */}
      <g filter="url(#cpu-light-shadow)">
        <image
          href="/pos-terminal.png"
          x="82" y="32" width="36" height="36"
          preserveAspectRatio="xMidYMid meet"
          clipPath="url(#terminal-clip)"
        />
      </g>

      {/* Screen overlay — clipped to screen area */}
      <g clipPath="url(#screen-clip)">
        {/* Screen fill */}
        <rect x="86" y="37.2" width="22" height="7.2" fill="#020c18" opacity="0.82" rx="0.5" />
        {/* Screen top glow bar */}
        <rect x="86" y="37.2" width="22" height="1.2" fill="rgba(30,168,212,0.18)" rx="0.4" />
        {/* Amount — animated shimmer */}
        <text
          x="87" y="41.8"
          fontSize="3.2" fontWeight="700" letterSpacing="0.04em"
          fontFamily="monospace"
          fill={animateText ? 'url(#cpu-text-gradient)' : '#1EA8D4'}
          filter="url(#screen-glow)"
        >
          ${formatted}
        </text>
        {/* Status label */}
        <text
          x="87" y="43.8"
          fontSize="1.6" letterSpacing="0.12em"
          fontFamily="monospace"
          fill="rgba(30,168,212,0.5)"
        >
          PROCESSING
        </text>
        {/* Scan line flicker */}
        <rect x="86" y="37.2" width="22" height="0.4" fill="rgba(30,168,212,0.06)" rx="0">
          <animate attributeName="y" values="37.2;44;37.2" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.5;0" dur="2.4s" repeatCount="indefinite" />
        </rect>
      </g>

      <defs>
        {/* Terminal + screen clip regions */}
        <clipPath id="terminal-clip">
          <rect x="82" y="32" width="36" height="36" rx="2" />
        </clipPath>
        <clipPath id="screen-clip">
          <rect x="86" y="37.2" width="22" height="7.2" rx="0.5" />
        </clipPath>
        <filter id="screen-glow" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="0.4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

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

        {/* Card body gradient — dark premium */}
        <linearGradient id="card-body-grad" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#1e2638" />
          <stop offset="100%" stopColor="#080d16" />
        </linearGradient>

        {/* EMV chip gradient — gold */}
        <linearGradient id="chip-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d4a843" />
          <stop offset="45%" stopColor="#8a6a28" />
          <stop offset="100%" stopColor="#c4983a" />
        </linearGradient>

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
          <stop offset="0%" stopColor="#1EA8D4" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="cpu-rose-grad" fx="1">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        <filter id="cpu-light-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="3"
            floodColor="#1EA8D4" floodOpacity="0.2" />
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
