'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import * as THREE from 'three'

const ASCII_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]<>;:,._-+=!@#$%^&*|\\/\"'`~?"

const generateCode = (width: number, height: number): string => {
  let out = ''
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      out += ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)]
    }
    out += '\n'
  }
  return out
}

type ScannerCardStreamProps = {
  cardImages?: string[]
  repeat?: number
  cardGap?: number
  initialSpeed?: number
  direction?: -1 | 1
  friction?: number
  scanEffect?: 'clip' | 'scramble'
}

const defaultCardImages = [
  'https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b55e654d1341fb06f8_4.1.png',
  'https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5a080a31ee7154b19_1.png',
  'https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5c1e4919fd69672b8_3.png',
  'https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5f6a5e232e7beb4be_2.png',
  'https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5bea2f1b07392d936_4.png',
]

export function ScannerCardStream({
  cardImages = defaultCardImages,
  repeat = 6,
  cardGap = 48,
  initialSpeed = 120,
  direction = -1,
  friction = 0.97,
  scanEffect = 'scramble',
}: ScannerCardStreamProps) {
  const [isScanning, setIsScanning] = useState(false)

  const cards = useMemo(() => {
    const total = cardImages.length * repeat
    return Array.from({ length: total }, (_, i) => ({
      id: i,
      image: cardImages[i % cardImages.length],
      ascii: generateCode(Math.floor(400 / 6.5), Math.floor(200 / 13)),
    }))
  }, [cardImages, repeat])

  const cardLineRef = useRef<HTMLDivElement>(null)
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  const scannerCanvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const originalAscii = useRef(new Map<number, string>())
  const isScanningRef = useRef(false)

  const state = useRef({
    position: 0,
    velocity: initialSpeed,
    direction: direction as number,
    isDragging: false,
    lastMouseX: 0,
    lastTime: performance.now(),
    cardLineWidth: (400 + cardGap) * cards.length,
    friction,
    minVelocity: 20,
  })

  const isPausedRef = useRef(false)

  // Stable drag handlers using refs so they don't recreate the effect
  const handleMouseDown = useCallback((e: MouseEvent | TouchEvent) => {
    state.current.isDragging = true
    state.current.lastMouseX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
    if (cardLineRef.current) cardLineRef.current.style.cursor = 'grabbing'
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!state.current.isDragging) return
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
    const delta = clientX - state.current.lastMouseX
    state.current.velocity = Math.abs(delta) / 0.016
    state.current.direction = delta > 0 ? 1 : -1
    state.current.position += delta
    state.current.lastMouseX = clientX
  }, [])

  const handleMouseUp = useCallback(() => {
    state.current.isDragging = false
    if (cardLineRef.current) cardLineRef.current.style.cursor = 'grab'
  }, [])

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    state.current.velocity = Math.min(600, state.current.velocity + Math.abs(e.deltaY) * 0.5)
    state.current.direction = e.deltaY > 0 ? -1 : 1
  }, [])

  useEffect(() => {
    const cardLine = cardLineRef.current
    const particleCanvas = particleCanvasRef.current
    const scannerCanvas = scannerCanvasRef.current
    const container = containerRef.current
    if (!cardLine || !particleCanvas || !scannerCanvas || !container) return

    // Seed original ascii
    cards.forEach(card => originalAscii.current.set(card.id, card.ascii))

    // ── Three.js particle background ──────────────────────────────────────
    const CARD_H = 200
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(
      -window.innerWidth / 2, window.innerWidth / 2, CARD_H / 2, -CARD_H / 2, 1, 1000,
    )
    camera.position.z = 100
    const renderer = new THREE.WebGLRenderer({ canvas: particleCanvas, alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, CARD_H)
    renderer.setClearColor(0x000000, 0)

    const particleCount = 300
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount)
    const alphas = new Float32Array(particleCount)

    const texCanvas = document.createElement('canvas')
    texCanvas.width = 64; texCanvas.height = 64
    const texCtx = texCanvas.getContext('2d')!
    const half = 32
    const grad = texCtx.createRadialGradient(half, half, 0, half, half, half)
    grad.addColorStop(0.025, '#fff')
    grad.addColorStop(0.1, 'hsl(195, 75%, 30%)')   // UF cyan tint
    grad.addColorStop(0.35, 'hsl(195, 70%, 5%)')
    grad.addColorStop(1, 'transparent')
    texCtx.fillStyle = grad
    texCtx.arc(half, half, half, 0, Math.PI * 2)
    texCtx.fill()
    const texture = new THREE.CanvasTexture(texCanvas)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * window.innerWidth * 2
      positions[i * 3 + 1] = (Math.random() - 0.5) * CARD_H
      positions[i * 3 + 2] = 0
      velocities[i] = Math.random() * 50 + 20
      alphas[i] = (Math.random() * 6 + 2) / 10
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('alpha',    new THREE.BufferAttribute(alphas, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: { pointTexture: { value: texture } },
      vertexShader:   `attribute float alpha; varying float vAlpha; void main() { vAlpha = alpha; gl_PointSize = 12.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `uniform sampler2D pointTexture; varying float vAlpha; void main() { gl_FragColor = vec4(1.0,1.0,1.0,vAlpha)*texture2D(pointTexture,gl_PointCoord); }`,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // ── Scanner canvas particles ──────────────────────────────────────────
    const ctx = scannerCanvas.getContext('2d')!
    scannerCanvas.width  = window.innerWidth
    scannerCanvas.height = CARD_H + 50

    type SP = { x:number; y:number; vx:number; vy:number; radius:number; alpha:number; life:number; decay:number }
    const mkParticle = (): SP => ({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 4,
      y: Math.random() * (CARD_H + 50),
      vx: Math.random() * 0.7 + 0.2,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 0.5 + 0.3,
      alpha: Math.random() * 0.35 + 0.5,
      life: 1,
      decay: Math.random() * 0.018 + 0.004,
    })
    const BASE_P = 600, SCAN_P = 2000
    let scannerParticles: SP[] = Array.from({ length: BASE_P }, mkParticle)
    let currentMaxP = BASE_P

    // ── Scramble effect ───────────────────────────────────────────────────
    const runScramble = (el: HTMLElement, cardId: number) => {
      if (el.dataset.scrambling === 'true') return
      el.dataset.scrambling = 'true'
      const original = originalAscii.current.get(cardId) ?? ''
      let n = 0
      const iv = setInterval(() => {
        el.textContent = generateCode(Math.floor(400 / 6.5), Math.floor(200 / 13))
        if (++n >= 10) { clearInterval(iv); el.textContent = original; delete el.dataset.scrambling }
      }, 30)
    }

    // ── Card scan effect ──────────────────────────────────────────────────
    const updateCardEffects = () => {
      const scanX = window.innerWidth / 2
      const sw = 8
      let anyScanning = false
      cardLine.querySelectorAll<HTMLElement>('.card-wrapper').forEach((wrapper, idx) => {
        const rect = wrapper.getBoundingClientRect()
        const normal = wrapper.querySelector<HTMLElement>('.card-normal')!
        const ascii  = wrapper.querySelector<HTMLElement>('.card-ascii')!
        const pre    = ascii.querySelector<HTMLElement>('pre')!
        if (rect.left < scanX + sw / 2 && rect.right > scanX - sw / 2) {
          anyScanning = true
          if (scanEffect === 'scramble' && !wrapper.dataset.scanned) runScramble(pre, idx)
          wrapper.dataset.scanned = 'true'
          const iL = Math.max(scanX - sw / 2 - rect.left, 0)
          const iR = Math.min(scanX + sw / 2 - rect.left, rect.width)
          normal.style.setProperty('--clip-right', `${(iL / rect.width) * 100}%`)
          ascii.style.setProperty('--clip-left',   `${(iR / rect.width) * 100}%`)
        } else {
          delete wrapper.dataset.scanned
          if (rect.right < scanX - sw / 2) {
            normal.style.setProperty('--clip-right', '100%')
            ascii.style.setProperty('--clip-left',   '100%')
          } else {
            normal.style.setProperty('--clip-right', '0%')
            ascii.style.setProperty('--clip-left',   '0%')
          }
        }
      })
      isScanningRef.current = anyScanning
      setIsScanning(anyScanning)
    }

    // ── Event listeners ───────────────────────────────────────────────────
    cardLine.addEventListener('mousedown',  handleMouseDown as EventListener)
    cardLine.addEventListener('touchstart', handleMouseDown as EventListener, { passive: true })
    window.addEventListener('mousemove',  handleMouseMove as EventListener)
    window.addEventListener('touchmove',  handleMouseMove as EventListener, { passive: true })
    window.addEventListener('mouseup',    handleMouseUp)
    window.addEventListener('touchend',   handleMouseUp)
    cardLine.addEventListener('wheel',    handleWheel, { passive: false })

    // ── Resize ────────────────────────────────────────────────────────────
    const onResize = () => {
      renderer.setSize(window.innerWidth, CARD_H)
      camera.left   = -window.innerWidth / 2
      camera.right  =  window.innerWidth / 2
      camera.updateProjectionMatrix()
      scannerCanvas.width  = window.innerWidth
      scannerCanvas.height = CARD_H + 50
    }
    window.addEventListener('resize', onResize, { passive: true })

    // ── Animation loop ────────────────────────────────────────────────────
    let raf: number
    const animate = (now: number) => {
      const dt = Math.min((now - state.current.lastTime) / 1000, 0.05)
      state.current.lastTime = now

      if (!isPausedRef.current && !state.current.isDragging) {
        if (state.current.velocity > state.current.minVelocity) {
          state.current.velocity *= state.current.friction
        }
        state.current.position += state.current.velocity * state.current.direction * dt
      }

      const { position, cardLineWidth } = state.current
      const cw = container.offsetWidth
      if (position < -cardLineWidth) state.current.position = cw
      else if (position > cw)        state.current.position = -cardLineWidth
      cardLine.style.transform = `translateX(${state.current.position}px)`

      updateCardEffects()

      // Three.js particles
      const t = now * 0.001
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i] * 0.016
        if (positions[i * 3] > window.innerWidth / 2 + 100) positions[i * 3] = -window.innerWidth / 2 - 100
        positions[i * 3 + 1] += Math.sin(t + i * 0.1) * 0.4
        alphas[i] = Math.max(0.05, Math.min(0.9, alphas[i] + (Math.random() - 0.5) * 0.04))
      }
      geometry.attributes.position.needsUpdate = true
      geometry.attributes.alpha.needsUpdate    = true
      renderer.render(scene, camera)

      // Scanner canvas particles
      ctx.clearRect(0, 0, scannerCanvas.width, scannerCanvas.height)
      const targetP = isScanningRef.current ? SCAN_P : BASE_P
      currentMaxP += (targetP - currentMaxP) * 0.05
      while (scannerParticles.length < currentMaxP) scannerParticles.push(mkParticle())
      while (scannerParticles.length > currentMaxP) scannerParticles.pop()
      scannerParticles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.life -= p.decay
        if (p.life <= 0 || p.x > window.innerWidth) Object.assign(p, mkParticle())
        ctx.globalAlpha = p.alpha * p.life
        ctx.fillStyle = 'white'
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill()
      })

      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize',    onResize)
      window.removeEventListener('mousemove', handleMouseMove as EventListener)
      window.removeEventListener('touchmove', handleMouseMove as EventListener)
      window.removeEventListener('mouseup',   handleMouseUp)
      window.removeEventListener('touchend',  handleMouseUp)
      cardLine.removeEventListener('mousedown',  handleMouseDown as EventListener)
      cardLine.removeEventListener('touchstart', handleMouseDown as EventListener)
      cardLine.removeEventListener('wheel',      handleWheel)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      texture.dispose()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, cardGap, scanEffect, handleMouseDown, handleMouseMove, handleMouseUp, handleWheel])

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden" style={{ height: 200 }}>
      <style>{`
        @keyframes glitch {
          0%,16%,50%,100% { opacity:1; }
          15%,99% { opacity:0.9; }
          49% { opacity:0.8; }
        }
        .uf-ascii-glitch { animation: glitch 0.1s infinite linear alternate-reverse; }
        @keyframes scanPulse {
          0%   { opacity:0.7; transform:translateX(-50%) translateY(-50%) scaleY(1); }
          100% { opacity:1;   transform:translateX(-50%) translateY(-50%) scaleY(1.04); }
        }
        .uf-scan-pulse { animation: scanPulse 1.4s infinite alternate ease-in-out; }
      `}</style>

      {/* Three.js particle bg */}
      <canvas
        ref={particleCanvasRef}
        className="absolute inset-0 w-full pointer-events-none z-0"
        style={{ height: 200 }}
      />

      {/* Scanner particles */}
      <canvas
        ref={scannerCanvasRef}
        className="absolute inset-0 w-full pointer-events-none z-10"
        style={{ height: 200 }}
      />

      {/* Scanner line — UF cyan */}
      <div
        className={`uf-scan-pulse absolute top-1/2 left-1/2 w-px pointer-events-none z-20 rounded-full transition-opacity duration-300 ${isScanning ? 'opacity-100' : 'opacity-0'}`}
        style={{
          height: 220,
          background: 'linear-gradient(to bottom, transparent, #1EA8D4, transparent)',
          boxShadow: '0 0 10px #1EA8D4, 0 0 22px #1EA8D4, 0 0 40px rgba(30,168,212,0.5)',
        }}
      />

      {/* Card strip */}
      <div className="absolute inset-0 flex items-center" style={{ overflow: 'hidden' }}>
        <div
          ref={cardLineRef}
          className="flex items-center whitespace-nowrap cursor-grab select-none will-change-transform"
          style={{ gap: cardGap }}
        >
          {cards.map(card => (
            <div key={card.id} className="card-wrapper relative shrink-0 rounded-2xl" style={{ width: 400, height: 200 }}>
              {/* Normal image */}
              <div
                className="card-normal absolute inset-0 rounded-2xl overflow-hidden z-[2]"
                style={{ clipPath: 'inset(0 0 0 var(--clip-right,0%))' }}
              >
                <img
                  src={card.image}
                  alt=""
                  className="w-full h-full object-cover brightness-105 contrast-105"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x200/111/2BB8E6?text=UF' }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
              </div>
              {/* ASCII overlay */}
              <div
                className="card-ascii absolute inset-0 rounded-2xl overflow-hidden z-[1]"
                style={{ clipPath: 'inset(0 calc(100% - var(--clip-left,0%)) 0 0)' }}
              >
                <pre
                  className="uf-ascii-glitch absolute inset-0 m-0 p-0 overflow-hidden font-mono text-left align-top box-border"
                  style={{
                    fontSize: 11,
                    lineHeight: '13px',
                    color: 'rgba(30,168,212,0.55)',
                    maskImage: 'linear-gradient(to right,rgba(0,0,0,1) 0%,rgba(0,0,0,0.7) 40%,rgba(0,0,0,0.3) 80%,transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right,rgba(0,0,0,1) 0%,rgba(0,0,0,0.7) 40%,rgba(0,0,0,0.3) 80%,transparent 100%)',
                  }}
                >
                  {card.ascii}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edge fades */}
      <div className="absolute inset-y-0 left-0 w-24 pointer-events-none z-30" style={{ background: 'linear-gradient(to right, #111111, transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-24 pointer-events-none z-30" style={{ background: 'linear-gradient(to left, #111111, transparent)' }} />
    </div>
  )
}
