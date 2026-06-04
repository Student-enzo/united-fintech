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
        height: 520,
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
      {/* Gradient overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)' }} />

      {/* Active: bottom content */}
      <div
        className="absolute bottom-0 left-0 right-0 p-6 transition-opacity duration-500"
        style={{ opacity: isActive ? 1 : 0 }}
      >
        <p style={{
          color: '#2BB8E6', fontSize: '0.75rem', fontWeight: 700,
          letterSpacing: '0.14em', marginBottom: '0.6rem',
          textShadow: '0 1px 6px rgba(0,0,0,1)',
          fontFamily: 'var(--font-heading)',
        }}>
          {item.subtitle.toUpperCase()}
        </p>
        <p style={{
          color: '#ffffff', fontSize: 'clamp(1.25rem, 2vw, 1.75rem)',
          fontWeight: 800, lineHeight: 1.2,
          fontFamily: 'var(--font-heading)', letterSpacing: '0.02em',
          textShadow: '0 1px 3px rgba(0,0,0,1), 0 3px 14px rgba(0,0,0,0.95)',
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
