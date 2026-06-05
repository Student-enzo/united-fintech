'use client'

import { Mail, Phone, User, Tag, Building2, CreditCard, Globe, Users, Calendar, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { BRAND } from '@/lib/brand'
import type { MerchantRecord } from '@/lib/mock-merchants'

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 }).format(n)
}
function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })
}

const RISK_COLOR: Record<string, string> = { low: BRAND.success, medium: BRAND.warn, high: BRAND.danger }

// Mock 6-month volume sparkline data
function mockVolumeHistory(base: number) {
  return [0.78, 0.85, 0.91, 0.88, 0.95, 1.0].map(f => Math.round(base * f))
}

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - (v / max) * 80
    return `${x},${y}`
  }).join(' ')
  return (
    <svg viewBox="0 0 100 100" className="w-full h-14" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,100 ${pts} 100,100`} fill={`${color}18`} stroke="none" />
    </svg>
  )
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun']

export default function MDOverview({ merchant: m }: { merchant: MerchantRecord }) {
  const bps = m.basis_points_earned ?? 15
  const residual = Math.round(m.monthly_volume * bps / 10000)
  const volume6mo = mockVolumeHistory(m.monthly_volume)
  const alerts: { msg: string; level: 'warn' | 'danger' | 'ok' }[] = []
  if (!m.contact_email) alerts.push({ msg: 'No contact email on file', level: 'warn' })
  if (!m.contact_phone) alerts.push({ msg: 'No contact phone on file', level: 'warn' })
  if (m.risk === 'high') alerts.push({ msg: 'High-risk merchant — enhanced monitoring required', level: 'danger' })
  if (m.days_in_stage > 14 && !['merchant_live','declined'].includes(m.pipeline_stage))
    alerts.push({ msg: `Stuck in ${m.pipeline_stage.replace(/_/g,' ')} for ${m.days_in_stage} days`, level: 'warn' })
  if (alerts.length === 0) alerts.push({ msg: 'No active alerts', level: 'ok' })

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

      {/* Left col — KPIs + chart */}
      <div className="xl:col-span-2 flex flex-col gap-5">

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label:'Monthly Volume', value:fmtCurrency(m.monthly_volume), color:BRAND.cyan },
            { label:'Avg Ticket',     value:fmtCurrency(m.avg_ticket),     color:BRAND.text },
            { label:'Est. Residual',  value:fmtCurrency(residual),         color:BRAND.success, sub:`${(bps/100).toFixed(2)}%` },
            { label:'Card Present',   value:`${m.card_present_pct}%`,       color:BRAND.silverLo },
          ].map(({ label, value, color, sub }) => (
            <div key={label} className="p-4 rounded-2xl flex flex-col gap-1.5"
              style={{ backgroundColor:BRAND.card, border:`1px solid ${BRAND.border}` }}>
              <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color:BRAND.muted }}>{label}</span>
              <span className="text-2xl font-bold" style={{ color }}>{value}</span>
              {sub && <span className="text-[10px]" style={{ color:BRAND.muted }}>{sub} rate</span>}
            </div>
          ))}
        </div>

        {/* Volume chart */}
        <div className="rounded-2xl p-5" style={{ backgroundColor:BRAND.card, border:`1px solid ${BRAND.border}` }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color:BRAND.muted }}>6-Month Volume Trend</p>
            <span className="text-xs font-semibold" style={{ color:BRAND.cyan }}>
              {fmtCurrency(m.monthly_volume)}/mo current
            </span>
          </div>
          <MiniChart data={volume6mo} color={BRAND.cyan} />
          <div className="flex justify-between mt-1">
            {MONTHS.map(mo => (
              <span key={mo} className="text-[9px]" style={{ color:BRAND.muted }}>{mo}</span>
            ))}
          </div>
        </div>

        {/* Details grid */}
        <div className="rounded-2xl p-5" style={{ backgroundColor:BRAND.card, border:`1px solid ${BRAND.border}` }}>
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-4" style={{ color:BRAND.muted }}>Account Details</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {[
              { icon:<Tag size={12}/>,        label:'MCC',             value:`${m.mcc} — ${m.mcc_label}` },
              { icon:<Building2 size={12}/>,  label:'Legal Structure', value:m.legal_structure },
              { icon:<CreditCard size={12}/>, label:'Account Type',    value:m.account_type },
              { icon:<Globe size={12}/>,      label:'Card Present %',  value:`${m.card_present_pct}%` },
              { icon:<Users size={12}/>,      label:'Partner / ISO',   value:`${m.partner} (${m.partner_iso})` },
              { icon:<Calendar size={12}/>,   label:'Date Added',      value:fmtDate(m.date_added) },
              { icon:<Clock size={12}/>,      label:'Days in Stage',   value:`${m.days_in_stage} days` },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center justify-between py-2.5"
                style={{ borderBottom:`1px solid ${BRAND.border}` }}>
                <span className="flex items-center gap-2 text-xs" style={{ color:BRAND.muted }}>{icon}{label}</span>
                <span className="text-xs font-semibold text-right max-w-[220px] truncate" style={{ color:BRAND.text }}>{value}</span>
              </div>
            ))}
          </div>
          {m.notes && (
            <div className="mt-4 px-3.5 py-3 rounded-xl text-xs italic"
              style={{ backgroundColor:'rgba(255,255,255,0.03)', borderLeft:`3px solid ${BRAND.borderCyan}`, color:BRAND.muted }}>
              {m.notes}
            </div>
          )}
        </div>
      </div>

      {/* Right col — contact + alerts */}
      <div className="flex flex-col gap-5">

        {/* Contact card */}
        <div className="rounded-2xl p-5" style={{ backgroundColor:BRAND.card, border:`1px solid ${BRAND.border}` }}>
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-4" style={{ color:BRAND.muted }}>Contact</p>
          <div className="flex flex-col gap-3">
            {m.owner_name && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor:`${BRAND.cyan}18`, border:`1px solid ${BRAND.borderCyan}` }}>
                  <User size={14} style={{ color:BRAND.cyan }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color:BRAND.text }}>{m.owner_name}</p>
                  <p className="text-[10px]" style={{ color:BRAND.muted }}>Owner / Principal</p>
                </div>
              </div>
            )}
            {m.contact_email && (
              <a href={`mailto:${m.contact_email}`}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-opacity hover:opacity-80"
                style={{ backgroundColor:'rgba(255,255,255,0.03)', border:`1px solid ${BRAND.border}` }}>
                <Mail size={13} style={{ color:BRAND.cyan }} />
                <span className="text-xs truncate" style={{ color:BRAND.text }}>{m.contact_email}</span>
              </a>
            )}
            {m.contact_phone && (
              <a href={`tel:${m.contact_phone}`}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-opacity hover:opacity-80"
                style={{ backgroundColor:'rgba(255,255,255,0.03)', border:`1px solid ${BRAND.border}` }}>
                <Phone size={13} style={{ color:BRAND.cyan }} />
                <span className="text-xs" style={{ color:BRAND.text }}>{m.contact_phone}</span>
              </a>
            )}
            {!m.owner_name && !m.contact_email && !m.contact_phone && (
              <p className="text-xs italic" style={{ color:BRAND.muted }}>No contact info on file.</p>
            )}
          </div>
        </div>

        {/* Alerts */}
        <div className="rounded-2xl p-5" style={{ backgroundColor:BRAND.card, border:`1px solid ${BRAND.border}` }}>
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-4" style={{ color:BRAND.muted }}>Alerts</p>
          <div className="flex flex-col gap-2.5">
            {alerts.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl"
                style={{
                  backgroundColor: a.level === 'ok' ? 'rgba(61,214,140,0.06)' : a.level === 'danger' ? 'rgba(232,80,74,0.06)' : 'rgba(240,178,62,0.06)',
                  border: `1px solid ${a.level === 'ok' ? 'rgba(61,214,140,0.2)' : a.level === 'danger' ? 'rgba(232,80,74,0.2)' : 'rgba(240,178,62,0.2)'}`,
                }}>
                {a.level === 'ok'
                  ? <CheckCircle2 size={13} className="flex-shrink-0 mt-0.5" style={{ color:BRAND.success }} />
                  : <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" style={{ color: a.level === 'danger' ? BRAND.danger : BRAND.warn }} />
                }
                <span className="text-xs" style={{ color: a.level === 'ok' ? BRAND.success : a.level === 'danger' ? BRAND.danger : BRAND.warn }}>
                  {a.msg}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk score */}
        <div className="rounded-2xl p-5" style={{ backgroundColor:BRAND.card, border:`1px solid ${BRAND.border}` }}>
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-4" style={{ color:BRAND.muted }}>Risk Profile</p>
          {[
            { label:'Chargeback History', score: m.risk === 'high' ? 30 : m.risk === 'medium' ? 60 : 90 },
            { label:'MCC Category',       score: m.risk === 'high' ? 20 : m.risk === 'medium' ? 55 : 85 },
            { label:'Volume Consistency', score: 78 },
            { label:'Doc Completeness',   score: m.risk === 'high' ? 40 : 82 },
          ].map(({ label, score }) => {
            const c = score >= 75 ? BRAND.success : score >= 50 ? BRAND.warn : BRAND.danger
            return (
              <div key={label} className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-[11px]" style={{ color:BRAND.muted }}>{label}</span>
                  <span className="text-[11px] font-bold" style={{ color:c }}>{score}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ backgroundColor:'rgba(255,255,255,0.06)' }}>
                  <div className="h-1.5 rounded-full transition-all" style={{ width:`${score}%`, backgroundColor:c }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
