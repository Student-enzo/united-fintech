'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle, AlertTriangle, Info, Bell, X,
  ShieldAlert, FileSignature, Clock, UserCheck,
} from 'lucide-react'

// ── Brand tokens ─────────────────────────────────────────────────────────────
const B = {
  card:   '#282626',
  cyan:   '#90c4cf',
  text:   'rgba(255,255,255,0.85)',
  muted:  'rgba(255,255,255,0.3)',
  border: 'rgba(255,255,255,0.08)',
} as const

// ── Types ────────────────────────────────────────────────────────────────────
type Severity = 'danger' | 'warn' | 'info'

interface AlertItem {
  id:        string
  severity:  Severity
  icon:      React.ElementType
  title:     string
  detail:    string
  href:      string
  timestamp: string
}

// ── Severity style map ────────────────────────────────────────────────────────
const SEV: Record<Severity, { color: string; bg: string; border: string }> = {
  danger: { color: '#E8504A', bg: 'rgba(232,80,74,0.09)',   border: 'rgba(232,80,74,0.22)' },
  warn:   { color: '#F0B23E', bg: 'rgba(240,178,62,0.09)',  border: 'rgba(240,178,62,0.22)' },
  info:   { color: '#90c4cf', bg: 'rgba(144,196,207,0.09)',  border: 'rgba(144,196,207,0.22)' },
}

// ── Mock alerts ───────────────────────────────────────────────────────────────
const INITIAL_ALERTS: AlertItem[] = [
  {
    id:        'cb-001',
    severity:  'danger',
    icon:      ShieldAlert,
    title:     '3 merchants flagged for high chargebacks',
    detail:    'Threshold exceeded (>1%). Immediate review required.',
    href:      '/admin/merchants?filter=chargeback',
    timestamp: '10 min ago',
  },
  {
    id:        'sig-001',
    severity:  'warn',
    icon:      FileSignature,
    title:     '2 proposals pending signature',
    detail:    'BluePeak Retail & Coral Bay Hospitality awaiting e-sign.',
    href:      '/admin/agreements?status=pending',
    timestamp: '2 hrs ago',
  },
  {
    id:        'rev-001',
    severity:  'warn',
    icon:      Clock,
    title:     '5 merchants up for 90-day review',
    detail:    'Risk & compliance review due within 7 days.',
    href:      '/admin/compliance',
    timestamp: '4 hrs ago',
  },
  {
    id:        'app-001',
    severity:  'info',
    icon:      UserCheck,
    title:     '1 partner application pending approval',
    detail:    'Nexus Payment Solutions — submitted 3 days ago.',
    href:      '/admin/partners?status=pending',
    timestamp: '3 days ago',
  },
]

// ── Alert row ─────────────────────────────────────────────────────────────────
function AlertRow({
  alert,
  onDismiss,
}: {
  alert:     AlertItem
  onDismiss: (id: string) => void
}) {
  const sev  = SEV[alert.severity]
  const Icon = alert.icon

  return (
    <div
      className="group relative flex items-start gap-3 rounded-xl px-4 py-3 transition-all"
      style={{ backgroundColor: sev.bg, border: `1px solid ${sev.border}` }}
    >
      {/* Icon */}
      <Icon size={15} style={{ color: sev.color, flexShrink: 0, marginTop: 2 }} />

      {/* Body — links to the relevant page */}
      <Link href={alert.href} className="flex-1 min-w-0 block hover:opacity-90 transition-opacity">
        <p className="text-sm font-semibold leading-snug" style={{ color: B.text }}>
          {alert.title}
        </p>
        <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: B.muted }}>
          {alert.detail}
        </p>
        <p className="text-[10px] mt-1 font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>
          {alert.timestamp}
        </p>
      </Link>

      {/* Dismiss button */}
      <button
        onClick={() => onDismiss(alert.id)}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded"
        style={{ color: 'rgba(255,255,255,0.35)' }}
        aria-label="Dismiss alert"
      >
        <X size={13} />
      </button>
    </div>
  )
}

// ── Severity count badge ──────────────────────────────────────────────────────
function SeverityDot({ count, severity }: { count: number; severity: Severity }) {
  if (count === 0) return null
  return (
    <span
      className="inline-flex items-center justify-center text-[9px] font-bold w-4 h-4 rounded-full"
      style={{ backgroundColor: SEV[severity].color, color: '#1c1c1c' }}
    >
      {count}
    </span>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS)

  function dismiss(id: string) {
    setAlerts(prev => prev.filter(a => a.id !== id))
  }

  const dangerCount = alerts.filter(a => a.severity === 'danger').length
  const warnCount   = alerts.filter(a => a.severity === 'warn').length
  const infoCount   = alerts.filter(a => a.severity === 'info').length

  // Sort: danger → warn → info
  const sorted = [...alerts].sort((a, b) => {
    const order: Record<Severity, number> = { danger: 0, warn: 1, info: 2 }
    return order[a.severity] - order[b.severity]
  })

  return (
    <div
      className="rounded-2xl p-5 flex flex-col"
      style={{ backgroundColor: B.card, border: `1px solid ${B.border}` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: 'rgba(144,196,207,0.7)' }}
          >
            Alerts
          </p>
          <p className="text-[15px] font-semibold mt-0.5" style={{ color: B.text }}>
            Action Items
          </p>
        </div>

        <div className="flex items-center gap-1.5 mt-0.5">
          <SeverityDot count={dangerCount} severity="danger" />
          <SeverityDot count={warnCount}   severity="warn"   />
          <SeverityDot count={infoCount}   severity="info"   />
          <Bell size={16} style={{ color: 'rgba(144,196,207,0.45)', marginLeft: 4 }} />
        </div>
      </div>

      {/* Alert list */}
      {sorted.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10 gap-3">
          <Bell size={24} style={{ color: 'rgba(255,255,255,0.12)' }} />
          <p className="text-sm font-medium text-center" style={{ color: 'rgba(255,255,255,0.28)' }}>
            All clear — no action items
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {sorted.map(alert => (
            <AlertRow key={alert.id} alert={alert} onDismiss={dismiss} />
          ))}
        </div>
      )}

      {/* Footer summary */}
      {sorted.length > 0 && (
        <div
          className="mt-4 pt-3 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
            {sorted.length} active alert{sorted.length !== 1 ? 's' : ''}
          </p>
          <button
            onClick={() => setAlerts([])}
            className="text-[10px] font-semibold hover:underline transition-colors"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            Dismiss all
          </button>
        </div>
      )}
    </div>
  )
}
