'use client'

import { useState, useMemo } from 'react'
import {
  FileText,
  UserCheck,
  Send,
  UserPlus,
  DollarSign,
  AlertTriangle,
  Settings,
  LogIn,
  Download,
  Search,
  Calendar,
  ChevronDown,
} from 'lucide-react'
import { BRAND } from '@/lib/brand'

// ─── Types ───────────────────────────────────────────────────────────────────

type EventType =
  | 'agreement_created'
  | 'merchant_activated'
  | 'deal_sent'
  | 'partner_added'
  | 'commission_paid'
  | 'compliance_flagged'
  | 'settings_changed'
  | 'login'

type DateRange = '7d' | '30d' | '90d' | 'all'
type FilterTab = 'all' | 'agreements' | 'merchants' | 'finance' | 'compliance' | 'auth'

interface ActivityEvent {
  id: string
  type: EventType
  user: string
  description: string
  detail?: string
  timestamp: Date
}

// ─── Config ──────────────────────────────────────────────────────────────────

const EVENT_CONFIG: Record<
  EventType,
  { label: string; icon: React.ElementType; color: string; bg: string; filter: FilterTab }
> = {
  agreement_created:  { label: 'Agreement Created',   icon: FileText,       color: '#90c4cf', bg: 'rgba(144,196,207,0.12)',  filter: 'agreements' },
  merchant_activated: { label: 'Merchant Activated',  icon: UserCheck,      color: '#3DD68C', bg: 'rgba(61,214,140,0.12)',  filter: 'merchants'  },
  deal_sent:          { label: 'Deal Sent',            icon: Send,           color: '#90c4cf', bg: 'rgba(144,196,207,0.12)',  filter: 'agreements' },
  partner_added:      { label: 'Partner Added',        icon: UserPlus,       color: '#A78BFA', bg: 'rgba(167,139,250,0.12)', filter: 'merchants'  },
  commission_paid:    { label: 'Commission Paid',      icon: DollarSign,     color: '#3DD68C', bg: 'rgba(61,214,140,0.12)',  filter: 'finance'    },
  compliance_flagged: { label: 'Compliance Flagged',   icon: AlertTriangle,  color: '#E8504A', bg: 'rgba(232,80,74,0.12)',   filter: 'compliance' },
  settings_changed:   { label: 'Settings Changed',     icon: Settings,       color: '#F0B23E', bg: 'rgba(240,178,62,0.12)',  filter: 'auth'       },
  login:              { label: 'Login',                icon: LogIn,          color: 'rgba(255,255,255,0.3)', bg: 'rgba(126,135,148,0.12)', filter: 'auth'       },
}

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'all',         label: 'All Events'  },
  { id: 'agreements',  label: 'Agreements'  },
  { id: 'merchants',   label: 'Merchants'   },
  { id: 'finance',     label: 'Finance'     },
  { id: 'compliance',  label: 'Compliance'  },
  { id: 'auth',        label: 'Auth'        },
]

const DATE_RANGES: { id: DateRange; label: string }[] = [
  { id: '7d',  label: 'Last 7 days'  },
  { id: '30d', label: 'Last 30 days' },
  { id: '90d', label: 'Last 90 days' },
  { id: 'all', label: 'All time'     },
]

// ─── Mock data ────────────────────────────────────────────────────────────────

function daysAgo(n: number, hours = 0, mins = 0): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(d.getHours() - hours)
  d.setMinutes(d.getMinutes() - mins)
  return d
}

const MOCK_EVENTS: ActivityEvent[] = [
  { id: '1',  type: 'login',              user: 'admin',      description: 'Admin signed in',                             timestamp: daysAgo(0, 0, 12) },
  { id: '2',  type: 'merchant_activated', user: 'admin',      description: 'Merchant activated: Sunshine Café LLC',       detail: 'MID #84920183',       timestamp: daysAgo(0, 0, 45) },
  { id: '3',  type: 'agreement_created',  user: 'jsmith',     description: 'Agreement created for Apex Retail Group',     detail: 'Agreement #2024-117', timestamp: daysAgo(0, 1, 10) },
  { id: '4',  type: 'deal_sent',          user: 'jsmith',     description: 'Deal sent to Blue Harbor Restaurants',        detail: 'Est. volume $40k/mo',  timestamp: daysAgo(0, 2, 5)  },
  { id: '5',  type: 'commission_paid',    user: 'system',     description: 'Residual payout processed',                   detail: '$3,840.00 → 6 agents', timestamp: daysAgo(0, 3, 0)  },
  { id: '6',  type: 'compliance_flagged', user: 'system',     description: 'Chargeback threshold exceeded: Vega Motors',  detail: 'CB ratio 2.4%',        timestamp: daysAgo(0, 4, 30) },
  { id: '7',  type: 'partner_added',      user: 'admin',      description: 'New partner onboarded: FinEdge Advisors',     detail: 'ISO partner',          timestamp: daysAgo(1, 0, 20) },
  { id: '8',  type: 'settings_changed',   user: 'admin',      description: 'Reserve % updated: 5% → 7%',                 timestamp: daysAgo(1, 1, 0)  },
  { id: '9',  type: 'agreement_created',  user: 'mrivera',    description: 'Agreement created for Coastal Wellness Spa',  detail: 'Agreement #2024-116', timestamp: daysAgo(1, 2, 15) },
  { id: '10', type: 'merchant_activated', user: 'mrivera',    description: 'Merchant activated: Downtown Dry Cleaning',   detail: 'MID #84920182',       timestamp: daysAgo(1, 3, 45) },
  { id: '11', type: 'login',              user: 'jsmith',     description: 'Agent signed in',                             timestamp: daysAgo(2, 0, 5)  },
  { id: '12', type: 'deal_sent',          user: 'mrivera',    description: 'Deal sent to Metro Auto Group',               detail: 'Est. volume $95k/mo',  timestamp: daysAgo(2, 1, 30) },
  { id: '13', type: 'compliance_flagged', user: 'system',     description: 'High-risk MCC detected: CryptoXchange LLC',   detail: 'MCC 6051',             timestamp: daysAgo(2, 2, 0)  },
  { id: '14', type: 'commission_paid',    user: 'system',     description: 'Manual commission adjustment posted',          detail: '$720.00 → jsmith',    timestamp: daysAgo(3, 0, 0)  },
  { id: '15', type: 'partner_added',      user: 'admin',      description: 'New partner onboarded: Gulf State Payments',  detail: 'Referral partner',     timestamp: daysAgo(3, 2, 0)  },
  { id: '16', type: 'agreement_created',  user: 'admin',      description: 'Agreement created for Summit Tech Solutions', detail: 'Agreement #2024-115', timestamp: daysAgo(4, 1, 0)  },
  { id: '17', type: 'merchant_activated', user: 'admin',      description: 'Merchant activated: Harbor Light Gallery',    detail: 'MID #84920180',       timestamp: daysAgo(4, 3, 0)  },
  { id: '18', type: 'settings_changed',   user: 'admin',      description: 'Auto-approve threshold updated: $500 → $750', timestamp: daysAgo(5, 0, 30) },
  { id: '19', type: 'deal_sent',          user: 'jsmith',     description: 'Deal sent to Pacific Rim Imports',            detail: 'Est. volume $55k/mo',  timestamp: daysAgo(6, 1, 0)  },
  { id: '20', type: 'login',              user: 'mrivera',    description: 'Agent signed in',                             timestamp: daysAgo(6, 2, 0)  },
  { id: '21', type: 'compliance_flagged', user: 'system',     description: 'Merchant at risk: Lakewood Pawn Shop',        detail: 'CB 1.9% + late fees',  timestamp: daysAgo(8, 0, 0)  },
  { id: '22', type: 'commission_paid',    user: 'system',     description: 'Monthly residual batch completed',             detail: '$18,240.00 total',    timestamp: daysAgo(15, 0, 0) },
  { id: '23', type: 'partner_added',      user: 'admin',      description: 'New partner onboarded: Keystone Brokers',     detail: 'ISO partner',          timestamp: daysAgo(20, 0, 0) },
  { id: '24', type: 'agreement_created',  user: 'mrivera',    description: 'Agreement created for Northgate Dental',      detail: 'Agreement #2024-112', timestamp: daysAgo(25, 0, 0) },
  { id: '25', type: 'merchant_activated', user: 'jsmith',     description: 'Merchant activated: Rapid Print Services',    detail: 'MID #84920175',       timestamp: daysAgo(28, 0, 0) },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatRelative(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1)   return 'just now'
  if (diffMin < 60)  return `${diffMin} min ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24)   return `${diffHr} hour${diffHr !== 1 ? 's' : ''} ago`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 30)  return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`
  const diffMo = Math.floor(diffDay / 30)
  return `${diffMo} month${diffMo !== 1 ? 's' : ''} ago`
}

function formatAbsolute(date: Date): string {
  return date.toLocaleString([], {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function cutoffForRange(range: DateRange): Date | null {
  if (range === 'all') return null
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d
}

function getUserInitials(user: string): string {
  return user.slice(0, 2).toUpperCase()
}

function getUserColor(user: string): string {
  const colors: Record<string, string> = {
    admin:   BRAND.cyan,
    jsmith:  '#A78BFA',
    mrivera: '#F0B23E',
    system:  BRAND.muted,
  }
  return colors[user] ?? BRAND.silver
}

// ─── Event Row ───────────────────────────────────────────────────────────────

function EventRow({ event }: { event: ActivityEvent }) {
  const cfg = EVENT_CONFIG[event.type]
  const Icon = cfg.icon
  const userColor = getUserColor(event.user)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        padding: '14px 18px',
        borderBottom: `1px solid ${BRAND.border}`,
        transition: 'background-color 0.15s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(255,255,255,0.02)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent' }}
    >
      {/* Event type icon */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '10px',
          backgroundColor: cfg.bg,
          border: `1px solid ${cfg.color}33`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '1px',
        }}
      >
        <Icon size={16} color={cfg.color} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2px' }}>
          {/* Event type badge */}
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: cfg.color,
              backgroundColor: cfg.bg,
              border: `1px solid ${cfg.color}33`,
              borderRadius: '5px',
              padding: '1px 7px',
              flexShrink: 0,
            }}
          >
            {cfg.label}
          </span>
          {/* Description */}
          <span style={{ fontSize: '13px', color: BRAND.text, fontWeight: 500 }}>
            {event.description}
          </span>
        </div>
        {event.detail && (
          <p style={{ fontSize: '11px', color: BRAND.muted, margin: '2px 0 0' }}>
            {event.detail}
          </p>
        )}
      </div>

      {/* Right side: user + time */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
        {/* User badge */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            fontWeight: 600,
            color: userColor,
            backgroundColor: `${userColor}18`,
            border: `1px solid ${userColor}33`,
            borderRadius: '6px',
            padding: '2px 8px',
          }}
        >
          <span
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              backgroundColor: `${userColor}33`,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              fontWeight: 700,
              color: userColor,
              flexShrink: 0,
            }}
          >
            {getUserInitials(event.user)}
          </span>
          {event.user}
        </span>
        {/* Timestamp */}
        <span
          title={formatAbsolute(event.timestamp)}
          style={{ fontSize: '11px', color: BRAND.muted, cursor: 'default' }}
        >
          {formatRelative(event.timestamp)}
        </span>
      </div>
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function ActivityPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [dateRange, setDateRange] = useState<DateRange>('30d')
  const [search, setSearch] = useState('')
  const [dateOpen, setDateOpen] = useState(false)

  const filtered = useMemo(() => {
    const cutoff = cutoffForRange(dateRange)
    return MOCK_EVENTS.filter(ev => {
      if (cutoff && ev.timestamp < cutoff) return false
      if (activeFilter !== 'all' && EVENT_CONFIG[ev.type].filter !== activeFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        if (
          !ev.user.toLowerCase().includes(q) &&
          !ev.description.toLowerCase().includes(q) &&
          !ev.type.toLowerCase().includes(q)
        ) return false
      }
      return true
    })
  }, [activeFilter, dateRange, search])

  function exportLog() {
    const lines = ['Timestamp,User,Type,Description,Detail']
    filtered.forEach(ev => {
      lines.push(
        [
          formatAbsolute(ev.timestamp),
          ev.user,
          ev.type,
          `"${ev.description}"`,
          ev.detail ? `"${ev.detail}"` : '',
        ].join(',')
      )
    })
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `activity-log-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const selectedRangeLabel = DATE_RANGES.find(r => r.id === dateRange)?.label ?? 'Last 30 days'

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: 700,
              margin: '0 0 4px',
              letterSpacing: '-0.01em',
              background: `linear-gradient(135deg, ${BRAND.text} 0%, ${BRAND.cyan} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Activity Log
          </h1>
          <p style={{ fontSize: '13px', color: BRAND.muted, margin: 0 }}>
            Audit trail of all platform events and user actions
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Date range dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDateOpen(v => !v)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                border: `1px solid ${BRAND.border}`,
                backgroundColor: BRAND.card,
                color: BRAND.text,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <Calendar size={14} color={BRAND.muted} />
              {selectedRangeLabel}
              <ChevronDown size={12} color={BRAND.muted} style={{ transform: dateOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
            </button>
            {dateOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  zIndex: 50,
                  backgroundColor: BRAND.cardAlt,
                  border: `1px solid ${BRAND.border}`,
                  borderRadius: '10px',
                  overflow: 'hidden',
                  minWidth: '160px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }}
              >
                {DATE_RANGES.map(r => (
                  <button
                    key={r.id}
                    onClick={() => { setDateRange(r.id); setDateOpen(false) }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 16px',
                      fontSize: '13px',
                      color: dateRange === r.id ? BRAND.cyan : BRAND.text,
                      backgroundColor: dateRange === r.id ? 'rgba(144,196,207,0.1)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export button */}
          <button
            onClick={exportLog}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              border: `1px solid ${BRAND.borderCyan}`,
              backgroundColor: 'rgba(144,196,207,0.08)',
              color: BRAND.cyan,
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Download size={14} />
            Export Log
          </button>
        </div>
      </div>

      {/* Filters + Search row */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Filter tabs */}
        <div
          style={{
            display: 'flex',
            gap: '2px',
            padding: '4px',
            borderRadius: '12px',
            backgroundColor: BRAND.card,
            border: `1px solid ${BRAND.border}`,
            flexWrap: 'wrap',
          }}
        >
          {FILTER_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s',
                backgroundColor: activeFilter === tab.id ? 'rgba(144,196,207,0.15)' : 'transparent',
                color: activeFilter === tab.id ? BRAND.cyan : BRAND.muted,
                boxShadow: activeFilter === tab.id ? `inset 0 0 0 1px rgba(144,196,207,0.25)` : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flex: 1,
            minWidth: '200px',
            padding: '8px 14px',
            borderRadius: '10px',
            border: `1px solid ${BRAND.border}`,
            backgroundColor: BRAND.card,
          }}
        >
          <Search size={14} color={BRAND.muted} />
          <input
            type="text"
            placeholder="Search by user or event type..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              color: BRAND.text,
              fontSize: '13px',
              outline: 'none',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ color: BRAND.muted, background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div style={{ marginBottom: '12px' }}>
        <span style={{ fontSize: '12px', color: BRAND.muted }}>
          {filtered.length} event{filtered.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {/* Event list */}
      <div
        style={{
          borderRadius: '14px',
          border: `1px solid ${BRAND.border}`,
          backgroundColor: BRAND.card,
          overflow: 'hidden',
        }}
      >
        {filtered.length === 0 ? (
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <p style={{ color: BRAND.muted, fontSize: '14px', margin: 0 }}>
              No events match the current filters.
            </p>
          </div>
        ) : (
          filtered.map((ev, idx) => (
            <EventRow
              key={ev.id}
              event={ev}
            />
          ))
        )}
      </div>
    </div>
  )
}
