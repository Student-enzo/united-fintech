'use client'

import React, { useState } from 'react'

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
      className={`
        relative rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-700 ease-in-out flex-shrink-0
        ${isActive ? 'w-[380px]' : 'w-[60px]'}
      `}
      style={{ height: 480 }}
      onMouseEnter={onMouseEnter}
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
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
        className="absolute bottom-0 left-0 right-0 p-5 transition-opacity duration-500"
        style={{ opacity: isActive ? 1 : 0 }}
      >
        <p style={{ color: '#2BB8E6', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
          {item.subtitle.toUpperCase()}
        </p>
        <p style={{ color: '#E8EDF2', fontSize: '1rem', fontWeight: 700, lineHeight: 1.3 }}>
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

  return (
    <div className="flex flex-row items-stretch justify-center gap-3 overflow-x-auto pb-2">
      {items.map((item, index) => (
        <AccordionItem
          key={item.id}
          item={item}
          isActive={index === activeIndex}
          onMouseEnter={() => setActiveIndex(index)}
        />
      ))}
    </div>
  )
}
