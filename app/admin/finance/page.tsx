'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { BarChart2, TrendingUp, DollarSign, Receipt, CreditCard } from 'lucide-react'

function LoadingPulse() {
  return (
    <div className="flex flex-col gap-4 mt-2">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} />
      ))}
    </div>
  )
}

const CashflowView    = dynamic(() => import('../cashflow/page'),    { ssr: false, loading: () => <LoadingPulse /> })
const ExpensesView    = dynamic(() => import('../expenses/page'),    { ssr: false, loading: () => <LoadingPulse /> })
const PayablesView    = dynamic(() => import('../payables/page'),    { ssr: false, loading: () => <LoadingPulse /> })
const ResidualsView   = dynamic(() => import('@/components/admin/ResidualsTable'),   { ssr: false, loading: () => <LoadingPulse /> })
const CommissionsView = dynamic(() => import('@/components/admin/CommissionsTable'), { ssr: false, loading: () => <LoadingPulse /> })

type FinanceTab = 'cashflow' | 'residuals' | 'commissions' | 'expenses' | 'payables'

const TABS: { key: FinanceTab; label: string; icon: React.ElementType; color: string; desc: string }[] = [
  { key: 'cashflow',    label: 'Cash Flow',   icon: BarChart2,  color: '#90c4cf', desc: 'Inflows vs outflows' },
  { key: 'residuals',   label: 'Residuals',   icon: TrendingUp, color: '#6EE7B7', desc: 'Monthly residuals'   },
  { key: 'commissions', label: 'Commissions', icon: DollarSign, color: '#FCD34D', desc: 'Agent commissions'   },
  { key: 'expenses',    label: 'Expenses',    icon: Receipt,    color: '#EF4444', desc: 'Tracked spend'       },
  { key: 'payables',    label: 'Payables',    icon: CreditCard, color: '#FBBF24', desc: 'Recurring bills'     },
]

export default function FinanceHubPage() {
  const [tab, setTab] = useState<FinanceTab>('cashflow')
  const active = TABS.find(t => t.key === tab)!

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Finance</h1>
        <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Cash flow · residuals · commissions · expenses · payables
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1.5 mb-7 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {TABS.map(t => {
          const Icon = t.icon
          const isActive = tab === t.key
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0"
              style={isActive
                ? { backgroundColor: `${t.color}14`, color: t.color, border: `1px solid ${t.color}45` }
                : { backgroundColor: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.07)' }
              }
            >
              <Icon size={14} />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Breadcrumb strip */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-6"
        style={{ backgroundColor: `${active.color}08`, border: `1px solid ${active.color}22` }}
      >
        <active.icon size={13} style={{ color: active.color }} />
        <span className="text-xs font-semibold" style={{ color: active.color }}>{active.label}</span>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{active.desc}</span>
      </div>

      {/* Content */}
      <div>
        {tab === 'cashflow'    && <CashflowView />}
        {tab === 'residuals'   && <ResidualsView />}
        {tab === 'commissions' && <CommissionsView />}
        {tab === 'expenses'    && <ExpensesView />}
        {tab === 'payables'    && <PayablesView />}
      </div>
    </div>
  )
}
