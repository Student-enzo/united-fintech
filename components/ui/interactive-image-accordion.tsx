'use client'

import React, { useState, useEffect, useRef } from 'react'

export interface AccordionServiceItem {
  id: number
  title: string
  subtitle: string
  imageUrl: string
}

interface AccordionItemProps {
  item: AccordionServiceItem
  isActive: boolean
  onMouseEnter: () => void
}

const AccordionItem = ({ item, isActive, onMouseEnter }: AccordionItemProps) => {
  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ease-in-out"
      style={{
        flexShrink: isActive ? 1 : 0,
        flexGrow: isActive ? 1 : 0,
        flexBasis: isActive ? 0 : '60px',
        width: isActive ? undefined : '60px',
        maxWidth: isActive ? '460px' : '60px',
        height: 560,
      }}
      onMouseEnter={onMouseEnter}
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          animation: isActive ? 'accordion-ken-burns 12s ease-in-out infinite alternate' : 'none',
          transformOrigin: 'center center',
        }}
        onError={(e) => {
          const t = e.target as HTMLImageElement
          t.onerror = null
          t.src = 'https://placehold.co/400x480/1e1e1e/2BB8E6?text=UF'
        }}
      />
      {/* Gradient overlay — darker for readability */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.75) 100%)' }} />

      {/* Active: centered content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-8 transition-opacity duration-500"
        style={{ opacity: isActive ? 1 : 0, textAlign: 'center' }}
      >
        <p style={{
          color: '#1EA8D4', fontSize: '0.72rem', fontWeight: 800,
          letterSpacing: '0.2em', marginBottom: '0.75rem',
          textShadow: '0 0 12px rgba(0,0,0,1), 0 2px 8px rgba(0,0,0,1)',
          fontFamily: 'var(--font-heading)',
        }}>
          {item.subtitle.toUpperCase()}
        </p>
        <p style={{
          color: '#ffffff', fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
          fontWeight: 900, lineHeight: 1.15,
          fontFamily: 'var(--font-heading)', letterSpacing: '0.01em',
          textShadow: '0 2px 8px rgba(0,0,0,1), 0 4px 24px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.8)',
        }}>
          {item.title}
        </p>
      </div>

      {/* Inactive: vertical label */}
      <span
        className="absolute text-white text-sm font-semibold whitespace-nowrap transition-all duration-500"
        style={{
          opacity: isActive ? 0 : 1,
          bottom: '5rem',
          left: '50%',
          transform: 'translateX(-50%) rotate(90deg)',
          transformOrigin: 'center center',
          color: '#E8EDF2',
          letterSpacing: '0.04em',
          textShadow: '0 1px 4px rgba(0,0,0,0.9)',
        }}
      >
        {item.subtitle}
      </span>
    </div>
  )
}

interface InteractiveImageAccordionProps {
  items: AccordionServiceItem[]
  defaultActiveIndex?: number
}

export function InteractiveImageAccordion({ items, defaultActiveIndex = 0 }: InteractiveImageAccordionProps) {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex)
  const pausedRef = useRef(false)

  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current) {
        setActiveIndex((prev) => (prev + 1) % items.length)
      }
    }, 3500)
    return () => clearInterval(id)
  }, [items.length])

  return (
    <>
      <style>{`
        @keyframes accordion-ken-burns {
          0%   { transform: scale(1.0) translate(0%, 0%); }
          33%  { transform: scale(1.08) translate(-1.5%, -1%); }
          66%  { transform: scale(1.05) translate(1.5%, 1%); }
          100% { transform: scale(1.1) translate(-1%, 1.5%); }
        }
      `}</style>
      <div
        className="flex flex-row items-stretch gap-3 w-full overflow-x-auto pb-2"
        onMouseEnter={() => { pausedRef.current = true }}
        onMouseLeave={() => { pausedRef.current = false }}
      >
        {items.map((item, index) => (
          <AccordionItem
            key={item.id}
            item={item}
            isActive={index === activeIndex}
            onMouseEnter={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </>
  )
}
