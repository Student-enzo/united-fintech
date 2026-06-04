'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, Info, AlertCircle, Bell } from 'lucide-react'

const CYAN = '#2BB8E6'

type AlertItem = {
  id:       string
  type:     'consultation' | 'merchant' | 'deal' | 'residual'
  severity: 'info' | 'warn' | 'danger'
  title:    string
  detail:   string
  href:     string
}

const SEV_META = {
  danger: { icon: AlertCircle,   color: '#E8504A', bg: 'rgba(232,80,74,0.08)',   border: 'rgba(232,80,74,0.18)' },
  warn:   { icon: AlertTriangle, color: '#F0B23E', bg: 'rgba(240,178,62,0.08)',  border: 'rgba(240,178,62,0.18)' },
  info:   { icon: Info,          color: CYAN,      bg: 'rgba(43,184,230,0.08)',  border: 'rgba(43,184,230,0.18)' },
}

export default function AlertsPanel() {
  const [alerts, setAlerts]   = useState<AlertItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/alerts')
      .then(r => r.json())
      .then((data: AlertItem[]) => { if (Array.isArray(data)) setAlerts(data) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="rounded-2xl p-5"
      style={{ backgroundColor: '#141821', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: 'rgba(43,184,230,0.7)' }}>
            Alerts
          </p>
          <p className="text-[15px] font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Action Items
          </p>
        </div>
        <Bell size={16} style={{ color: 'rgba(43,184,230,0.5)' }} />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-14 rounded-xl animate-pulse"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <div className="py-10 text-center">
          <Bell size={24} className="mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.15)' }} />
          <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>
            All clear — no action items
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map(alert => {
            const meta = SEV_META[alert.severity]
            const Icon = meta.icon
            return (
              <Link key={alert.id} href={alert.href}
                className="flex items-start gap-3 rounded-xl px-4 py-3 transition-opacity hover:opacity-80 block"
                style={{ backgroundColor: meta.bg, border: `1px solid ${meta.border}` }}>
                <Icon size={15} style={{ color: meta.color, flexShrink: 0, marginTop: 1 }} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug truncate"
                    style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {alert.title}
                  </p>
                  <p className="text-[11px] mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {alert.detail}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
