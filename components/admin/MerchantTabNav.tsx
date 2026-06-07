'use client'

import Link from 'next/link'
import { BRAND } from '@/lib/brand'

// ─── Types ────────────────────────────────────────────────────────────────────

export type TabKey = 'all' | 'onboarding' | 'live'

export interface MerchantTabNavProps {
  active: TabKey
  counts: { all: number; onboarding: number; live: number }
}

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS: { key: TabKey; label: string; href: string }[] = [
  { key: 'all',        label: 'All Merchants', href: '/admin/merchants'      },
  { key: 'onboarding', label: 'Onboarding',    href: '/admin/onboarding-crm' },
  { key: 'live',       label: 'Live',          href: '/admin/portfolio'      },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function MerchantTabNav({ active, counts }: MerchantTabNavProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 2,
        borderBottom: `1px solid rgba(144,196,207,0.12)`,
        marginBottom: 28,
      }}
    >
      {TABS.map(tab => {
        const isActive = active === tab.key
        const count = counts[tab.key]

        return (
          <Link
            key={tab.key}
            href={tab.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? BRAND.cyan : 'rgba(255,255,255,0.4)',
              borderBottom: isActive
                ? `2px solid ${BRAND.cyan}`
                : '2px solid transparent',
              textDecoration: 'none',
              letterSpacing: '0.02em',
              transition: 'color 0.15s',
            }}
          >
            {tab.label}

            {count > 0 && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 999,
                  backgroundColor: isActive
                    ? 'rgba(144,196,207,0.13)'
                    : 'rgba(255,255,255,0.06)',
                  color: isActive ? BRAND.cyan : 'rgba(255,255,255,0.3)',
                }}
              >
                {count}
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}
