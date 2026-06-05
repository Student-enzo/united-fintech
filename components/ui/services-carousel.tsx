'use client'

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const CYAN = '#1EA8D4'
const TEXT = '#E8EDF2'
const MUTED = '#7E8794'

export interface ServiceItem {
  id: number
  subtitle: string
  title: string
  excerpt: string
  imageUrl: string
  href: string
}

function calculateGap(width: number) {
  const minWidth = 1024
  const maxWidth = 1456
  const minGap = 55
  const maxGap = 80
  if (width <= minWidth) return minGap
  if (width >= maxWidth) return maxGap
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth))
}

export function ServicesCarousel({ items }: { items: ServiceItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoverPrev, setHoverPrev] = useState(false)
  const [hoverNext, setHoverNext] = useState(false)
  const [containerWidth, setContainerWidth] = useState(600)

  const imageContainerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const count = useMemo(() => items.length, [items])
  const active = useMemo(() => items[activeIndex], [activeIndex, items])

  useEffect(() => {
    const handleResize = () => {
      if (imageContainerRef.current) setContainerWidth(imageContainerRef.current.offsetWidth)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((p) => (p + 1) % count)
    }, 5000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [count])

  const stopAutoplay = () => { if (intervalRef.current) clearInterval(intervalRef.current) }

  const handleNext = useCallback(() => {
    setActiveIndex((p) => (p + 1) % count)
    stopAutoplay()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  const handlePrev = useCallback(() => {
    setActiveIndex((p) => (p - 1 + count) % count)
    stopAutoplay()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  function getImgStyle(index: number): React.CSSProperties {
    const gap = calculateGap(containerWidth)
    const stickUp = gap * 0.8
    const isActive = index === activeIndex
    const isLeft = (activeIndex - 1 + count) % count === index
    const isRight = (activeIndex + 1) % count === index
    if (isActive) return {
      zIndex: 3, opacity: 1, pointerEvents: 'auto',
      transform: 'translateX(0px) translateY(0px) scale(1) rotateY(0deg)',
      transition: 'all 0.8s cubic-bezier(.4,2,.3,1)',
    }
    if (containerWidth < 380) return { zIndex: 1, opacity: 0, pointerEvents: 'none', transition: 'all 0.8s cubic-bezier(.4,2,.3,1)' }
    if (isLeft) return {
      zIndex: 2, opacity: 1, pointerEvents: 'auto',
      transform: `translateX(-${gap}px) translateY(-${stickUp}px) scale(0.84) rotateY(14deg)`,
      transition: 'all 0.8s cubic-bezier(.4,2,.3,1)',
    }
    if (isRight) return {
      zIndex: 2, opacity: 1, pointerEvents: 'auto',
      transform: `translateX(${gap}px) translateY(-${stickUp}px) scale(0.84) rotateY(-14deg)`,
      transition: 'all 0.8s cubic-bezier(.4,2,.3,1)',
    }
    return { zIndex: 1, opacity: 0, pointerEvents: 'none', transition: 'all 0.8s cubic-bezier(.4,2,.3,1)' }
  }

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{ display: 'grid', gap: '5rem', alignItems: 'center' }}
        className="grid-cols-1 md:grid-cols-2"
      >
        {/* Stacked image fan */}
        <div
          ref={imageContainerRef}
          style={{ position: 'relative', width: '100%', height: '26rem', perspective: 1000 }}
        >
          {items.map((item, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={item.id}
              src={item.imageUrl}
              alt={item.title}
              onError={(e) => {
                const t = e.target as HTMLImageElement
                t.onerror = null
                t.src = 'https://placehold.co/600x352/1e1e1e/2BB8E6?text=UF'
              }}
              style={{
                position: 'absolute',
                width: '100%', height: '100%',
                objectFit: 'cover',
                borderRadius: '1.25rem',
                boxShadow: '0 12px 48px rgba(0,0,0,0.6)',
                ...getImgStyle(index),
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '18rem', justifyContent: 'space-between' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ flex: 1 }}
            >
              {/* Category badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{
                  padding: '0.2rem 0.65rem', borderRadius: 999,
                  backgroundColor: 'rgba(30,168,212,0.1)', color: CYAN,
                  fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}>
                  {active.subtitle}
                </span>
              </div>

              {/* Title */}
              <h3 style={{
                color: TEXT, fontSize: 'clamp(1.15rem, 2vw, 1.6rem)',
                fontWeight: 900, lineHeight: 1.2, letterSpacing: '-0.01em',
                marginBottom: '1rem', fontFamily: 'var(--font-heading)',
              }}>
                {active.title}
              </h3>

              {/* Excerpt with word-blur animation */}
              <motion.p style={{ color: 'rgba(232,237,242,0.65)', fontSize: '0.95rem', lineHeight: 1.75 }}>
                {active.excerpt.split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ filter: 'blur(8px)', opacity: 0, y: 4 }}
                    animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut', delay: 0.02 * i }}
                    style={{ display: 'inline-block' }}
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          {/* Nav row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '2rem', flexWrap: 'wrap' }}>
            <button
              onClick={handlePrev}
              onMouseEnter={() => setHoverPrev(true)}
              onMouseLeave={() => setHoverPrev(false)}
              aria-label="Previous"
              style={{
                width: 44, height: 44, borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: hoverPrev ? CYAN : '#1e1e1e',
                transition: 'background-color 0.2s',
              }}
            >
              <FaArrowLeft size={14} color={hoverPrev ? '#161616' : TEXT} />
            </button>
            <button
              onClick={handleNext}
              onMouseEnter={() => setHoverNext(true)}
              onMouseLeave={() => setHoverNext(false)}
              aria-label="Next"
              style={{
                width: 44, height: 44, borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: hoverNext ? CYAN : '#1e1e1e',
                transition: 'background-color 0.2s',
              }}
            >
              <FaArrowRight size={14} color={hoverNext ? '#161616' : TEXT} />
            </button>

            {/* current index counter */}
            <span style={{ color: MUTED, fontSize: '0.78rem', fontVariantNumeric: 'tabular-nums' }}>
              {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </span>

            {/* CTA Button */}
            <Link
              href={active.href}
              style={{
                marginLeft: 'auto',
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                backgroundColor: CYAN, color: '#0A0C12',
                fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none',
                padding: '0.55rem 1.25rem', borderRadius: 999,
                whiteSpace: 'nowrap', transition: 'opacity 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Get Started
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0A0C12" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Service tabs */}
      <div style={{ marginTop: '2.5rem', overflowX: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', gap: '0.5rem', width: 'max-content' }}>
          {items.map((item, i) => {
            const isActive = i === activeIndex
            const isPast = i < activeIndex
            return (
              <button
                key={item.id}
                onClick={() => { setActiveIndex(i); stopAutoplay() }}
                style={{
                  padding: '0.45rem 1.1rem',
                  borderRadius: 999,
                  border: isActive ? `1px solid ${CYAN}` : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: isActive ? CYAN : isPast ? 'rgba(30,168,212,0.07)' : 'transparent',
                  color: isActive ? '#0D1117' : isPast ? 'rgba(30,168,212,0.65)' : MUTED,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.25s ease',
                  boxShadow: isActive ? `0 0 16px rgba(30,168,212,0.3)` : 'none',
                }}
              >
                {item.subtitle}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
