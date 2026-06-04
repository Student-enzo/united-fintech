"use client"

import { useEffect, useRef, useCallback } from "react"
import createGlobe from "cobe"

interface CdnMarker {
  id: string
  location: [number, number]
  region: string
}

interface CdnArc {
  id: string
  from: [number, number]
  to: [number, number]
  label?: string
}

interface GlobeCdnProps {
  markers?: CdnMarker[]
  arcs?: CdnArc[]
  className?: string
  speed?: number
  showLabels?: boolean
}

const defaultMarkers: CdnMarker[] = [
  { id: "cdn-iad", location: [38.95, -77.45],   region: "iad1" },
  { id: "cdn-sfo", location: [37.62, -122.38],  region: "sfo1" },
  { id: "cdn-cdg", location: [49.01, 2.55],     region: "cdg1" },
  { id: "cdn-hnd", location: [35.55, 139.78],   region: "hnd1" },
  { id: "cdn-syd", location: [-33.95, 151.18],  region: "syd1" },
  { id: "cdn-gru", location: [-23.43, -46.47],  region: "gru1" },
  { id: "cdn-sin", location: [1.36, 103.99],    region: "sin1" },
  { id: "cdn-bom", location: [19.09, 72.87],    region: "bom1" },
]

const defaultArcs: CdnArc[] = [
  { id: "cdn-arc-1", from: [38.95, -77.45],  to: [49.01, 2.55],    label: "$420M" },
  { id: "cdn-arc-2", from: [37.62, -122.38], to: [35.55, 139.78],  label: "$453M" },
  { id: "cdn-arc-3", from: [49.01, 2.55],    to: [1.36, 103.99],   label: "$166M" },
  { id: "cdn-arc-4", from: [38.95, -77.45],  to: [-23.43, -46.47], label: "$177M" },
  { id: "cdn-arc-5", from: [35.55, 139.78],  to: [-33.95, 151.18], label: "$98M"  },
  { id: "cdn-arc-6", from: [49.01, 2.55],    to: [19.09, 72.87],   label: "$214M" },
]

// dark gray for markers/arcs on the white globe
const DARK_RGB: [number, number, number] = [0.18, 0.18, 0.22]

/** Project a lat/lng point on the globe to CSS-pixel coordinates.
 *  Matches cobe's Y-then-X rotation convention.
 *  Returns {x, y} in pixels from top-left of the square canvas,
 *  and `hidden` = true when the point is on the far side of the globe.
 */
function projectGlobePoint(
  location: [number, number],
  phi: number,
  theta: number,
  width: number
): { x: number; y: number; hidden: boolean } {
  const [lat, lng] = location
  const latR = (lat * Math.PI) / 180
  const lngR = (lng * Math.PI) / 180

  // Spherical → Cartesian (unit sphere)
  let x = Math.cos(latR) * Math.sin(lngR)
  let y = Math.sin(latR)
  let z = Math.cos(latR) * Math.cos(lngR)

  // Rotate around Y axis by phi
  const cp = Math.cos(phi), sp = Math.sin(phi)
  const xr = cp * x + sp * z
  z = -sp * x + cp * z
  x = xr

  // Rotate around X axis by theta
  const ct = Math.cos(theta), st = Math.sin(theta)
  const yr = ct * y + st * z
  z = -st * y + ct * z
  y = yr

  const hidden = z < 0

  const radius = width * 0.455
  return {
    x: width / 2 + x * radius,
    y: width / 2 - y * radius,
    hidden,
  }
}

/** Great-circle midpoint between two lat/lng points */
function arcMidpoint(
  from: [number, number],
  to: [number, number]
): [number, number] {
  return [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2]
}

export function GlobeCdn({
  markers = defaultMarkers,
  arcs = defaultArcs,
  className = "",
  speed = 0.003,
  showLabels = true,
}: GlobeCdnProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)

  // DOM refs for labels — indexed by marker/arc index
  const markerLabelRefs = useRef<(HTMLDivElement | null)[]>([])
  const arcLabelRefs    = useRef<(HTMLDivElement | null)[]>([])

  // Ensure ref arrays are sized correctly
  markerLabelRefs.current = markerLabelRefs.current.slice(0, markers.length)
  arcLabelRefs.current    = arcLabelRefs.current.slice(0, arcs.length)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    isPausedRef.current = true
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current  += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi:   (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        }
      }
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup",   handlePointerUp,   { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup",   handlePointerUp)
    }
  }, [handlePointerUp])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    let globe: ReturnType<typeof createGlobe> | null = null
    let animationId: number
    let phi = 0

    function updateLabels(currentPhi: number, currentTheta: number) {
      if (!showLabels) return
      const w = canvas.offsetWidth
      if (!w) return

      // Marker labels
      markers.forEach((m, i) => {
        const el = markerLabelRefs.current[i]
        if (!el) return
        const { x, y, hidden } = projectGlobePoint(m.location, currentPhi, currentTheta, w)
        el.style.left    = `${x}px`
        el.style.top     = `${y}px`
        el.style.opacity = hidden ? "0" : "1"
      })

      // Arc midpoint labels
      arcs.forEach((arc, i) => {
        const el = arcLabelRefs.current[i]
        if (!el || !arc.label) return
        const mid = arcMidpoint(arc.from, arc.to)
        const { x, y, hidden } = projectGlobePoint(mid, currentPhi, currentTheta, w)
        el.style.left    = `${x}px`
        el.style.top     = `${y}px`
        el.style.opacity = hidden ? "0" : "1"
      })
    }

    function init() {
      const width = canvas.offsetWidth
      if (width === 0 || globe) return

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 0,
        theta: 0.2,
        dark: 0,
        diffuse: 2.8,
        mapSamples: 16000,
        mapBrightness: 8,
        baseColor: [0.92, 0.94, 0.97],
        markerColor: DARK_RGB,
        glowColor: [0.06, 0.06, 0.08],
        markerElevation: 0.02,
        markers: markers.map((m) => ({ location: m.location, size: 0.035 })),
        arcs: arcs.map((a) => ({ from: a.from, to: a.to })),
        arcColor: DARK_RGB,
        arcWidth: 1.2,
        arcHeight: 0.3,
        opacity: 0.9,
      })

      function animate() {
        if (!isPausedRef.current) phi += speed
        const currentPhi   = phi + phiOffsetRef.current + dragOffset.current.phi
        const currentTheta = 0.2 + thetaOffsetRef.current + dragOffset.current.theta
        globe!.update({ phi: currentPhi, theta: currentTheta })
        updateLabels(currentPhi, currentTheta)
        animationId = requestAnimationFrame(animate)
      }
      animate()
      setTimeout(() => canvas && (canvas.style.opacity = "1"))
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect()
          init()
        }
      })
      ro.observe(canvas)
      return () => ro.disconnect()
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      if (globe) globe.destroy()
    }
  }, [markers, arcs, speed, showLabels])

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.2s ease",
          borderRadius: "50%",
          touchAction: "none",
        }}
      />


      {/* City / node labels */}
      {showLabels && markers.map((m, i) => (
        <div
          key={m.id}
          ref={(el) => { markerLabelRefs.current[i] = el }}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transform: "translate(-50%, calc(-100% - 10px))",
            opacity: 0,
            transition: "opacity 0.12s ease",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {/* Dot + label */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              backgroundColor: "rgba(15,15,20,0.88)",
              backdropFilter: "blur(6px)",
              borderRadius: 5,
              padding: "2px 7px",
              color: "#ffffff",
              fontSize: "0.65rem",
              fontFamily: "var(--font-heading, monospace)",
              fontWeight: 600,
              letterSpacing: "0.06em",
              whiteSpace: "nowrap",
            }}>
              {m.region}
            </div>
            {/* Stem line */}
            <div style={{ width: 1, height: 8, backgroundColor: "rgba(30,30,40,0.6)" }} />
            {/* Node dot */}
            <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "rgba(30,30,40,0.85)" }} />
          </div>
        </div>
      ))}

      {/* Arc volume labels */}
      {showLabels && arcs.map((arc, i) => arc.label ? (
        <div
          key={arc.id}
          ref={(el) => { arcLabelRefs.current[i] = el }}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transform: "translate(-50%, -50%)",
            opacity: 0,
            transition: "opacity 0.12s ease",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <div style={{
            backgroundColor: "rgba(15,15,20,0.88)",
            backdropFilter: "blur(6px)",
            borderRadius: 5,
            padding: "2px 8px",
            color: "#ffffff",
            fontSize: "0.6rem",
            fontFamily: "var(--font-heading, monospace)",
            fontWeight: 700,
            letterSpacing: "0.05em",
            whiteSpace: "nowrap",
          }}>
            {arc.label}
          </div>
        </div>
      ) : null)}
    </div>
  )
}
