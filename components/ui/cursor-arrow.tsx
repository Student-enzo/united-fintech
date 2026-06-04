'use client'

import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react'

// UF brand cyan
const CYAN = '43,184,230'

interface CursorArrowContextValue {
  register: (el: HTMLElement) => () => void
}

const CursorArrowContext = createContext<CursorArrowContextValue>({
  register: () => () => {},
})

export function CursorArrowProvider({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ratiosRef = useRef<Map<HTMLElement, number>>(new Map())
  const activeRef = useRef<HTMLElement | null>(null)
  const mouseRef = useRef<{ x: number; y: number } | null>(null)
  const rafRef = useRef<number>(0)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const pendingRef = useRef<HTMLElement[]>([])

  const updateActive = useCallback(() => {
    let best: HTMLElement | null = null
    let bestRatio = 0
    ratiosRef.current.forEach((ratio, el) => {
      if (ratio > bestRatio) { bestRatio = ratio; best = el }
    })
    activeRef.current = best
  }, [])

  const register = useCallback((el: HTMLElement) => {
    ratiosRef.current.set(el, 0)
    if (observerRef.current) {
      observerRef.current.observe(el)
    } else {
      pendingRef.current.push(el)
    }
    return () => {
      ratiosRef.current.delete(el)
      observerRef.current?.unobserve(el)
      updateActive()
    }
  }, [updateActive])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratiosRef.current.set(e.target as HTMLElement, e.intersectionRatio))
        updateActive()
      },
      { threshold: Array.from({ length: 11 }, (_, i) => i / 10) }
    )
    pendingRef.current.forEach(el => {
      if (ratiosRef.current.has(el)) observerRef.current!.observe(el)
    })
    pendingRef.current = []
    return () => observerRef.current?.disconnect()
  }, [updateActive])

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    const onLeave = () => { mouseRef.current = null }
    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const mouse = mouseRef.current
      const target = activeRef.current
      if (mouse && target) {
        const rect = target.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const a = Math.atan2(cy - mouse.y, cx - mouse.x)
        const x1 = cx - Math.cos(a) * (rect.width / 2 + 12)
        const y1 = cy - Math.sin(a) * (rect.height / 2 + 12)
        const dist = Math.hypot(x1 - mouse.x, y1 - mouse.y)
        const opacity = Math.min(1, (dist - Math.max(rect.width, rect.height) / 2) / 500)

        if (opacity > 0) {
          const midX = (mouse.x + x1) / 2
          const midY = (mouse.y + y1) / 2
          const offset = Math.min(200, dist * 0.5)
          const t = Math.max(-1, Math.min(1, (mouse.y - y1) / 200))
          const cpX = midX
          const cpY = midY + offset * t

          ctx.save()
          ctx.strokeStyle = `rgba(${CYAN},${opacity * 0.8})`
          ctx.lineWidth = 1.5
          ctx.setLineDash([8, 5])
          ctx.beginPath()
          ctx.moveTo(mouse.x, mouse.y)
          ctx.quadraticCurveTo(cpX, cpY, x1, y1)
          ctx.stroke()
          ctx.restore()

          const angle = Math.atan2(y1 - cpY, x1 - cpX)
          ctx.save()
          ctx.strokeStyle = `rgba(${CYAN},${opacity})`
          ctx.lineWidth = 1.5
          ctx.setLineDash([])
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x1 - 9 * Math.cos(angle - Math.PI / 6), y1 - 9 * Math.sin(angle - Math.PI / 6))
          ctx.moveTo(x1, y1)
          ctx.lineTo(x1 - 9 * Math.cos(angle + Math.PI / 6), y1 - 9 * Math.sin(angle + Math.PI / 6))
          ctx.stroke()
          ctx.restore()
        }
      }
      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <CursorArrowContext.Provider value={{ register }}>
      {children}
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}
      />
    </CursorArrowContext.Provider>
  )
}

export function useCursorArrow<T extends HTMLElement = HTMLElement>() {
  const { register } = useContext(CursorArrowContext)
  const ref = useRef<T>(null)
  useEffect(() => {
    if (!ref.current) return
    return register(ref.current)
  }, [register])
  return ref
}
