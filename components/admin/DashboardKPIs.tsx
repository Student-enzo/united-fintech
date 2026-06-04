'use client'

import { useState, useEffect } from 'react'
import { Users, FileText, TrendingUp, DollarSign, BarChart2 } from 'lucide-react'
import { useColors } from '@/lib/theme'
import { fmtCurrency, fmtPercent } from '@/lib/utils'

const CYAN = '#2BB8E6'

type KPIs = {
  merchantsLive:   number
  dealsInPipeline: number
  mtdResidual:     number
  approvalRate:    number
  riskFlags:       number
}

export default function DashboardKPIs() {
  const colors = useColors()
  const [kpis, setKpis]       = useState<KPIs | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(r => r.json())
      .then((data: KPIs) => setKpis(data))
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    {
      label:    'Merchants Live',
      value:    kpis ? kpis.merchantsLive.toString() : '—',
      sub:      'active accounts',
      icon:     Users,
      color:    CYAN,
      bg:       'rgba(43,184,230,0.08)',
    },
    {
      label:    'Deals in Pipeline',
      value:    kpis ? kpis.dealsInPipeline.toString() : '—',
      sub:      'submitted + underwriting',
      icon:     FileText,
      color:    '#3DD68C',
      bg:       'rgba(61,214,140,0.08)',
    },
    {
      label:    'Residual Revenue (MTD)',
      value:    kpis ? fmtCurrency(kpis.mtdResidual) : '—',
      sub:      'current month',
      icon:     TrendingUp,
      color:    '#46D4F2',
      bg:       'rgba(70,212,242,0.08)',
    },
    {
      label:    'Approval Rate',
      value:    kpis ? `${kpis.approvalRate}%` : '—',
      sub:      'approved / total decided',
      icon:     DollarSign,
      color:    '#3DD68C',
      bg:       'rgba(61,214,140,0.08)',
    },
    {
      label:    'Risk Flags',
      value:    kpis ? kpis.riskFlags.toString() : '—',
      sub:      'high-risk merchants',
      icon:     BarChart2,
      color:    kpis && kpis.riskFlags > 0 ? '#E8504A' : '#F0B23E',
      bg:       kpis && kpis.riskFlags > 0 ? 'rgba(232,80,74,0.08)' : 'rgba(240,178,62,0.08)',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      {cards.map(card => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="rounded-xl p-5"
            style={{ backgroundColor: card.bg, border: `1px solid ${colors.border}` }}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] leading-snug"
                style={{ color: card.color }}>
                {card.label}
              </p>
              <Icon size={14} style={{ color: card.color, opacity: 0.7, flexShrink: 0 }} />
            </div>
            <p className="text-3xl font-bold"
              style={{ color: colors.textPrimary, fontVariantNumeric: 'tabular-nums' }}>
              {loading ? <span className="animate-pulse opacity-30">—</span> : card.value}
            </p>
            <p className="text-[10px] mt-1.5 font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {card.sub}
            </p>
          </div>
        )
      })}
    </div>
  )
}
