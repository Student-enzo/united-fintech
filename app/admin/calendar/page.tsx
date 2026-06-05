'use client'

import { useState, useMemo } from 'react'
import { BRAND } from '@/lib/brand'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Phone,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  Building2,
  User,
  FileText,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

type EventType =
  | 'discovery_call'
  | 'merchant_review'
  | 'agreement_expiry'
  | 'underwriting_deadline'
  | 'partner_call'
  | 'compliance_review'

interface CalendarEvent {
  id: string
  type: EventType
  title: string
  date: string        // YYYY-MM-DD
  time: string        // HH:MM (24h)
  duration: number    // minutes
  merchant?: string
  contactName?: string
  company?: string
  estimatedVolume?: string
  notes?: string
  completed?: boolean
}

// ─── Config ─────────────────────────────────────────────────────────────────

const EVENT_CONFIG: Record<
  EventType,
  { label: string; color: string; bg: string; border: string }
> = {
  discovery_call: {
    label: 'Discovery Call',
    color: BRAND.cyan,
    bg: 'rgba(144,196,207,0.12)',
    border: 'rgba(144,196,207,0.35)',
  },
  merchant_review: {
    label: 'Merchant Review',
    color: BRAND.warn,
    bg: 'rgba(240,178,62,0.12)',
    border: 'rgba(240,178,62,0.35)',
  },
  agreement_expiry: {
    label: 'Agreement Expiry',
    color: BRAND.danger,
    bg: 'rgba(232,80,74,0.12)',
    border: 'rgba(232,80,74,0.35)',
  },
  underwriting_deadline: {
    label: 'Underwriting Deadline',
    color: '#A78BFA',
    bg: 'rgba(167,139,250,0.12)',
    border: 'rgba(167,139,250,0.35)',
  },
  partner_call: {
    label: 'Partner Call',
    color: '#2DD4BF',
    bg: 'rgba(45,212,191,0.12)',
    border: 'rgba(45,212,191,0.35)',
  },
  compliance_review: {
    label: 'Compliance Review',
    color: '#FB923C',
    bg: 'rgba(251,146,60,0.12)',
    border: 'rgba(251,146,60,0.35)',
  },
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// ─── Mock data ───────────────────────────────────────────────────────────────
// Dates are relative to June 2026 (current month per system date)

const today = new Date()
const thisYear = today.getFullYear()
const thisMonth = today.getMonth() // 0-indexed

function mockDate(monthOffset: number, day: number): string {
  const d = new Date(thisYear, thisMonth + monthOffset, day)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

const MOCK_EVENTS: CalendarEvent[] = [
  // Discovery calls from BookCall form
  {
    id: 'dc-001',
    type: 'discovery_call',
    title: 'Strategy Session — NovaPay',
    date: mockDate(0, 3),
    time: '10:00',
    duration: 45,
    contactName: 'Sarah Whitfield',
    company: 'NovaPay Solutions',
    estimatedVolume: '$250K – $1M / month',
    notes: 'Interested in risk mitigation strategy for high-volume e-commerce.',
  },
  {
    id: 'dc-002',
    type: 'discovery_call',
    title: 'Discovery Call — OrbisCommerce',
    date: mockDate(0, 5),
    time: '14:30',
    duration: 30,
    contactName: 'Marcus Lee',
    company: 'OrbisCommerce Inc.',
    estimatedVolume: '$1M – $5M / month',
    notes: 'Looking to replace current high-risk processor. Wants embedded finance.',
  },
  {
    id: 'dc-003',
    type: 'discovery_call',
    title: 'Consultation — PeakRetail',
    date: mockDate(0, 10),
    time: '11:00',
    duration: 45,
    contactName: 'Angela Torres',
    company: 'PeakRetail Group',
    estimatedVolume: '$50K – $250K / month',
    notes: 'Merchant processing. Asked about onboarding timeline.',
  },
  {
    id: 'dc-004',
    type: 'discovery_call',
    title: 'Strategy Session — FluxPay',
    date: mockDate(0, 17),
    time: '09:30',
    duration: 45,
    contactName: 'Derek Osman',
    company: 'FluxPay Ltd.',
    estimatedVolume: 'Over $5M / month',
    notes: 'Large volume travel vertical. Multi-currency settlement required.',
  },
  {
    id: 'dc-005',
    type: 'discovery_call',
    title: 'Discovery Call — BrightMed',
    date: mockDate(1, 4),
    time: '13:00',
    duration: 30,
    contactName: 'Claire Sutton',
    company: 'BrightMed Services',
    estimatedVolume: '$250K – $1M / month',
    notes: 'Healthcare vertical. Needs compliant merchant processing.',
  },
  // Merchant reviews
  {
    id: 'mr-001',
    type: 'merchant_review',
    title: '30-Day Review — Vantage Commerce',
    date: mockDate(0, 6),
    time: '15:00',
    duration: 60,
    merchant: 'Vantage Commerce',
    notes: '30-day milestone review. Check chargeback ratio and volume ramp.',
  },
  {
    id: 'mr-002',
    type: 'merchant_review',
    title: '90-Day Review — GlobeTech Payments',
    date: mockDate(0, 14),
    time: '10:00',
    duration: 60,
    merchant: 'GlobeTech Payments',
    notes: 'Quarterly review. Processor performance and reserve release assessment.',
  },
  {
    id: 'mr-003',
    type: 'merchant_review',
    title: '60-Day Review — Luxora Retail',
    date: mockDate(1, 8),
    time: '14:00',
    duration: 60,
    merchant: 'Luxora Retail',
    notes: 'Mid-cycle check. Volume growth 18% above projection.',
  },
  // Agreement expiry
  {
    id: 'ae-001',
    type: 'agreement_expiry',
    title: 'MPA Expiry — Prism Payments',
    date: mockDate(0, 20),
    time: '09:00',
    duration: 30,
    merchant: 'Prism Payments',
    notes: 'MPA expires end of month. Renewal terms need approval. URGENT.',
  },
  {
    id: 'ae-002',
    type: 'agreement_expiry',
    title: 'MPA Expiry — ClearSky Processing',
    date: mockDate(1, 12),
    time: '09:00',
    duration: 30,
    merchant: 'ClearSky Processing',
    notes: 'Agreement renewal — 45 days out. Begin renegotiation.',
  },
  // Underwriting deadlines
  {
    id: 'ud-001',
    type: 'underwriting_deadline',
    title: 'Underwriting Deadline — TradeVault',
    date: mockDate(0, 8),
    time: '17:00',
    duration: 30,
    merchant: 'TradeVault',
    notes: 'Processor requires final docs by 5PM. Banking statements + 3-month processing history.',
  },
  {
    id: 'ud-002',
    type: 'underwriting_deadline',
    title: 'Underwriting Deadline — ApexPOS',
    date: mockDate(0, 22),
    time: '12:00',
    duration: 30,
    merchant: 'ApexPOS',
    notes: 'First Republic processor. Due diligence package due at noon.',
  },
  // Partner calls
  {
    id: 'pc-001',
    type: 'partner_call',
    title: 'ISO Strategy Call — Meridian Payments',
    date: mockDate(0, 11),
    time: '11:30',
    duration: 60,
    contactName: 'Roberto Fierro',
    company: 'Meridian Payments ISO',
    notes: 'Quarterly ISO sync. Review referral pipeline and co-branding opportunities.',
  },
  {
    id: 'pc-002',
    type: 'partner_call',
    title: 'Processor Sync — Nexum Acquiring',
    date: mockDate(0, 25),
    time: '10:00',
    duration: 45,
    company: 'Nexum Acquiring',
    notes: 'Interchange update review and Q3 pricing discussion.',
  },
  {
    id: 'pc-003',
    type: 'partner_call',
    title: 'Bank Partner Meeting — Atlantic Coast Bank',
    date: mockDate(1, 15),
    time: '14:00',
    duration: 60,
    company: 'Atlantic Coast Bank',
    notes: 'Sponsoring bank annual relationship review. Reserve policy update.',
  },
  // Compliance reviews
  {
    id: 'cr-001',
    type: 'compliance_review',
    title: 'KYC Review — PeakRetail Group',
    date: mockDate(0, 16),
    time: '13:00',
    duration: 45,
    merchant: 'PeakRetail Group',
    notes: 'Annual KYC refresh. Updated beneficial ownership docs required.',
  },
  {
    id: 'cr-002',
    type: 'compliance_review',
    title: 'AML Audit — Vantage Commerce',
    date: mockDate(1, 20),
    time: '09:00',
    duration: 90,
    merchant: 'Vantage Commerce',
    notes: 'Quarterly AML transaction monitoring review with compliance officer.',
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(time: string, duration: number): string {
  const [h, m] = time.split(':').map(Number)
  const totalMins = h * 60 + m + duration
  const endH = Math.floor(totalMins / 60) % 24
  const endM = totalMins % 60
  const fmt = (v: number) => String(v).padStart(2, '0')
  const ampm = (hr: number) => (hr >= 12 ? 'PM' : 'AM')
  const to12 = (hr: number) => hr % 12 || 12
  return `${to12(h)}:${fmt(m)} ${ampm(h)} – ${to12(endH)}:${fmt(endM)} ${ampm(endH)}`
}

function isoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function EventPill({ event, onClick }: { event: CalendarEvent; onClick: () => void }) {
  const cfg = EVENT_CONFIG[event.type]
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick() }}
      className="w-full text-left truncate rounded px-1.5 py-0.5 text-[10px] font-medium leading-tight"
      style={{
        backgroundColor: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
      }}
    >
      {event.time.slice(0, 5)} {event.title}
    </button>
  )
}

function TypeBadge({ type }: { type: EventType }) {
  const cfg = EVENT_CONFIG[type]
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      {cfg.label}
    </span>
  )
}

function EventDetailPanel({
  event,
  onClose,
  onComplete,
  onCancel,
}: {
  event: CalendarEvent
  onClose: () => void
  onComplete: (id: string) => void
  onCancel: (id: string) => void
}) {
  const cfg = EVENT_CONFIG[event.type]
  return (
    <div
      className="flex flex-col gap-4 h-full"
      style={{ color: BRAND.text }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <TypeBadge type={event.type} />
          <h3 className="text-base font-bold leading-tight" style={{ color: BRAND.text }}>
            {event.title}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 rounded-lg p-1.5 transition-colors"
          style={{ color: BRAND.muted, backgroundColor: 'rgba(255,255,255,0.05)' }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-2.5 text-sm">
        <div className="flex items-center gap-2" style={{ color: BRAND.muted }}>
          <Calendar size={13} style={{ color: cfg.color, flexShrink: 0 }} />
          <span>{new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-2" style={{ color: BRAND.muted }}>
          <Clock size={13} style={{ color: cfg.color, flexShrink: 0 }} />
          <span>{formatTime(event.time, event.duration)} ({event.duration} min)</span>
        </div>
        {(event.contactName || event.merchant) && (
          <div className="flex items-center gap-2" style={{ color: BRAND.muted }}>
            <User size={13} style={{ color: cfg.color, flexShrink: 0 }} />
            <span>{event.contactName ?? event.merchant}</span>
          </div>
        )}
        {event.company && (
          <div className="flex items-center gap-2" style={{ color: BRAND.muted }}>
            <Building2 size={13} style={{ color: cfg.color, flexShrink: 0 }} />
            <span>{event.company}</span>
          </div>
        )}
        {event.estimatedVolume && (
          <div className="flex items-center gap-2" style={{ color: BRAND.muted }}>
            <FileText size={13} style={{ color: cfg.color, flexShrink: 0 }} />
            <span>Est. volume: <strong style={{ color: BRAND.text }}>{event.estimatedVolume}</strong></span>
          </div>
        )}
      </div>

      {/* Notes */}
      {event.notes && (
        <div
          className="rounded-xl p-3 text-sm leading-relaxed"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${BRAND.border}`, color: BRAND.muted }}
        >
          {event.notes}
        </div>
      )}

      {/* Status */}
      {event.completed && (
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium"
          style={{ backgroundColor: 'rgba(61,214,140,0.1)', border: '1px solid rgba(61,214,140,0.25)', color: BRAND.success }}
        >
          <CheckCircle2 size={14} />
          Marked as complete
        </div>
      )}

      {/* Actions */}
      {!event.completed && (
        <div className="flex gap-2 mt-auto pt-2">
          <button
            onClick={() => onComplete(event.id)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'rgba(61,214,140,0.12)', color: BRAND.success, border: '1px solid rgba(61,214,140,0.25)' }}
          >
            <CheckCircle2 size={12} /> Complete
          </button>
          <button
            onClick={() => onCancel(event.id)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'rgba(232,80,74,0.1)', color: BRAND.danger, border: '1px solid rgba(232,80,74,0.25)' }}
          >
            <XCircle size={12} /> Cancel
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Add Event Modal ──────────────────────────────────────────────────────────

const EMPTY_FORM = {
  type: 'discovery_call' as EventType,
  title: '',
  date: '',
  time: '09:00',
  duration: 30,
  merchant: '',
  contactName: '',
  company: '',
  estimatedVolume: '',
  notes: '',
}

function AddEventModal({
  onClose,
  onAdd,
  defaultDate,
}: {
  onClose: () => void
  onAdd: (e: CalendarEvent) => void
  defaultDate?: string
}) {
  const [form, setForm] = useState({ ...EMPTY_FORM, date: defaultDate ?? '' })

  const handle = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.date || !form.title) return
    onAdd({
      ...form,
      id: `event-${Date.now()}`,
      duration: Number(form.duration),
    })
    onClose()
  }

  const isDiscovery = form.type === 'discovery_call'

  const inputCls = "w-full rounded-lg px-3 py-2 text-sm outline-none transition-all"
  const inputStyle = {
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: `1px solid ${BRAND.border}`,
    color: BRAND.text,
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl flex flex-col max-h-[90vh] overflow-hidden"
        style={{ backgroundColor: BRAND.card, border: `1px solid rgba(255,255,255,0.1)` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: `1px solid ${BRAND.border}` }}
        >
          <h2 className="font-bold text-base" style={{ color: BRAND.text }}>Add Event</h2>
          <button onClick={onClose} style={{ color: BRAND.muted }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4 p-6 overflow-y-auto">
          {/* Type */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: BRAND.muted }}>
              Event Type
            </label>
            <select name="type" value={form.type} onChange={handle} className={inputCls} style={{ ...inputStyle, cursor: 'pointer' }}>
              {(Object.keys(EVENT_CONFIG) as EventType[]).map(k => (
                <option key={k} value={k} style={{ backgroundColor: BRAND.card }}>{EVENT_CONFIG[k].label}</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: BRAND.muted }}>
              Title *
            </label>
            <input name="title" value={form.title} onChange={handle} placeholder="Event title" required className={inputCls} style={inputStyle} />
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: BRAND.muted }}>
                Date *
              </label>
              <input type="date" name="date" value={form.date} onChange={handle} required className={inputCls} style={{ ...inputStyle, colorScheme: 'dark' }} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: BRAND.muted }}>
                Time
              </label>
              <input type="time" name="time" value={form.time} onChange={handle} className={inputCls} style={{ ...inputStyle, colorScheme: 'dark' }} />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: BRAND.muted }}>
              Duration (minutes)
            </label>
            <select name="duration" value={form.duration} onChange={handle} className={inputCls} style={{ ...inputStyle, cursor: 'pointer' }}>
              {[15, 30, 45, 60, 90, 120].map(d => (
                <option key={d} value={d} style={{ backgroundColor: BRAND.card }}>{d} min</option>
              ))}
            </select>
          </div>

          {/* Discovery call extras */}
          {isDiscovery && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: BRAND.muted }}>
                    Contact Name
                  </label>
                  <input name="contactName" value={form.contactName} onChange={handle} placeholder="Jane Smith" className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: BRAND.muted }}>
                    Company
                  </label>
                  <input name="company" value={form.company} onChange={handle} placeholder="Acme Inc." className={inputCls} style={inputStyle} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: BRAND.muted }}>
                  Estimated Volume
                </label>
                <select name="estimatedVolume" value={form.estimatedVolume} onChange={handle} className={inputCls} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="" style={{ backgroundColor: BRAND.card }}>Select range</option>
                  {['Under $50K / month', '$50K – $250K / month', '$250K – $1M / month', '$1M – $5M / month', 'Over $5M / month'].map(v => (
                    <option key={v} value={v} style={{ backgroundColor: BRAND.card }}>{v}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Merchant (non-discovery) */}
          {!isDiscovery && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: BRAND.muted }}>
                Merchant / Partner
              </label>
              <input name="merchant" value={form.merchant} onChange={handle} placeholder="Merchant name" className={inputCls} style={inputStyle} />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: BRAND.muted }}>
              Notes
            </label>
            <textarea name="notes" value={form.notes} onChange={handle} rows={3}
              placeholder="Additional context..." className={inputCls} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <button
            type="submit"
            className="rounded-xl py-2.5 text-sm font-bold tracking-wide transition-opacity hover:opacity-80"
            style={{ backgroundColor: BRAND.cyan, color: BRAND.bg }}
          >
            Add Event
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Main Calendar Component ──────────────────────────────────────────────────

export default function AdminCalendarPage() {
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addDefaultDate, setAddDefaultDate] = useState<string | undefined>()

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const daysInMonth = getDaysInMonth(year, month)
  const firstDOW = getFirstDayOfWeek(year, month)
  const todayISO = isoDate(today.getFullYear(), today.getMonth(), today.getDate())

  // Events grouped by date
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {}
    events.forEach(ev => {
      if (!map[ev.date]) map[ev.date] = []
      map[ev.date].push(ev)
    })
    return map
  }, [events])

  // Upcoming events (next 7 days)
  const upcomingEvents = useMemo(() => {
    const cutoff = new Date(today)
    cutoff.setDate(cutoff.getDate() + 7)
    return events
      .filter(ev => ev.date >= todayISO && new Date(ev.date) <= cutoff)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  }, [events, todayISO])

  const dayEvents = useMemo(() => {
    if (!selectedDay) return []
    return (eventsByDate[selectedDay] ?? []).sort((a, b) => a.time.localeCompare(b.time))
  }, [selectedDay, eventsByDate])

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))
  const goToToday = () => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))

  const handleComplete = (id: string) => {
    setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, completed: true } : ev))
    if (selectedEvent?.id === id) setSelectedEvent(prev => prev ? { ...prev, completed: true } : null)
  }

  const handleCancel = (id: string) => {
    setEvents(prev => prev.filter(ev => ev.id !== id))
    setSelectedEvent(null)
  }

  const handleAdd = (ev: CalendarEvent) => {
    setEvents(prev => [...prev, ev])
  }

  const openAddModal = (date?: string) => {
    setAddDefaultDate(date)
    setShowAddModal(true)
  }

  // Build calendar grid cells
  const cells: (number | null)[] = [
    ...Array(firstDOW).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Pad to complete last week
  while (cells.length % 7 !== 0) cells.push(null)

  const cardBorder = `1px solid ${BRAND.border}`

  return (
    <div className="flex flex-col gap-6 p-6" style={{ minHeight: '100vh', backgroundColor: BRAND.bg, color: BRAND.text }}>
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: BRAND.text }}>
            Calendar
          </h1>
          <p className="text-sm mt-0.5" style={{ color: BRAND.muted }}>
            Scheduled calls, reviews, deadlines & compliance events
          </p>
        </div>
        <button
          onClick={() => openAddModal()}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold tracking-wide transition-opacity hover:opacity-80"
          style={{ backgroundColor: BRAND.cyan, color: BRAND.bg }}
        >
          <Plus size={15} /> Add Event
        </button>
      </div>

      {/* BookCall integration notice */}
      <div
        className="flex items-start gap-3 rounded-xl px-4 py-3 text-sm"
        style={{ backgroundColor: 'rgba(144,196,207,0.06)', border: `1px solid ${BRAND.borderCyan}` }}
      >
        <Phone size={14} style={{ color: BRAND.cyan, flexShrink: 0, marginTop: 2 }} />
        <div>
          <span className="font-semibold" style={{ color: BRAND.cyan }}>BookCall integration active.</span>
          <span style={{ color: BRAND.muted }}>
            {' '}Consultation form submissions from the marketing site are saved to the{' '}
            <code className="rounded px-1 py-0.5 text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: BRAND.text }}>
              consultations
            </code>{' '}
            Supabase table. To surface them here automatically, connect a Supabase realtime
            subscription or run a daily sync from{' '}
            <code className="rounded px-1 py-0.5 text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: BRAND.text }}>
              /app/api/consultations/route.ts
            </code>.
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {(Object.entries(EVENT_CONFIG) as [EventType, typeof EVENT_CONFIG[EventType]][]).map(([k, cfg]) => (
          <div key={k} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: cfg.color }}>
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
            {cfg.label}
          </div>
        ))}
      </div>

      {/* Main content: calendar + sidebars */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">

        {/* Calendar */}
        <div className="flex flex-col gap-0 rounded-2xl overflow-hidden" style={{ border: cardBorder, backgroundColor: BRAND.card }}>
          {/* Month nav */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: cardBorder }}
          >
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="rounded-lg p-1.5 transition-colors hover:bg-white/5" style={{ color: BRAND.muted }}>
                <ChevronLeft size={16} />
              </button>
              <h2 className="font-bold text-lg w-48 text-center" style={{ color: BRAND.text }}>
                {MONTHS[month]} {year}
              </h2>
              <button onClick={nextMonth} className="rounded-lg p-1.5 transition-colors hover:bg-white/5" style={{ color: BRAND.muted }}>
                <ChevronRight size={16} />
              </button>
            </div>
            <button
              onClick={goToToday}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all hover:opacity-80"
              style={{ backgroundColor: 'rgba(144,196,207,0.1)', color: BRAND.cyan, border: `1px solid ${BRAND.borderCyan}` }}
            >
              Today
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7">
            {DAYS.map(d => (
              <div
                key={d}
                className="py-2 text-center text-[11px] font-bold uppercase tracking-widest"
                style={{ color: BRAND.muted, borderBottom: cardBorder }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 flex-1">
            {cells.map((day, idx) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="min-h-[90px] p-1"
                    style={{
                      borderRight: (idx % 7) < 6 ? cardBorder : 'none',
                      borderBottom: idx < cells.length - 7 ? cardBorder : 'none',
                      backgroundColor: 'rgba(0,0,0,0.15)',
                    }}
                  />
                )
              }

              const dateStr = isoDate(year, month, day)
              const dayEvs = eventsByDate[dateStr] ?? []
              const isToday = dateStr === todayISO
              const isSelected = dateStr === selectedDay

              return (
                <div
                  key={dateStr}
                  onClick={() => {
                    setSelectedDay(prev => prev === dateStr ? null : dateStr)
                    setSelectedEvent(null)
                  }}
                  className="min-h-[90px] p-1 flex flex-col gap-0.5 cursor-pointer transition-colors"
                  style={{
                    borderRight: (idx % 7) < 6 ? cardBorder : 'none',
                    borderBottom: idx < cells.length - 7 ? cardBorder : 'none',
                    backgroundColor: isSelected
                      ? 'rgba(144,196,207,0.07)'
                      : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.02)'
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                  }}
                >
                  {/* Day number */}
                  <div className="flex items-center justify-between mb-0.5 px-0.5">
                    <span
                      className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full`}
                      style={
                        isToday
                          ? { backgroundColor: BRAND.cyan, color: BRAND.bg }
                          : { color: isSelected ? BRAND.cyan : BRAND.muted }
                      }
                    >
                      {day}
                    </span>
                    {dayEvs.length > 0 && (
                      <button
                        onClick={e => { e.stopPropagation(); openAddModal(dateStr) }}
                        className="opacity-0 group-hover:opacity-100 rounded p-0.5 transition-all hover:bg-white/10"
                        style={{ color: BRAND.muted }}
                        title="Add event"
                      >
                        <Plus size={10} />
                      </button>
                    )}
                  </div>

                  {/* Event pills — max 3 */}
                  <div className="flex flex-col gap-0.5">
                    {dayEvs.slice(0, 3).map(ev => (
                      <EventPill
                        key={ev.id}
                        event={ev}
                        onClick={() => {
                          setSelectedDay(dateStr)
                          setSelectedEvent(ev)
                        }}
                      />
                    ))}
                    {dayEvs.length > 3 && (
                      <span className="text-[10px] px-1.5" style={{ color: BRAND.muted }}>
                        +{dayEvs.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right column: Event detail + Upcoming */}
        <div className="flex flex-col gap-4">

          {/* Event detail panel */}
          {selectedEvent ? (
            <div
              className="rounded-2xl p-5"
              style={{ backgroundColor: BRAND.card, border: cardBorder, minHeight: 280 }}
            >
              <EventDetailPanel
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
                onComplete={handleComplete}
                onCancel={handleCancel}
              />
            </div>
          ) : selectedDay && dayEvents.length > 0 ? (
            <div
              className="rounded-2xl p-5"
              style={{ backgroundColor: BRAND.card, border: cardBorder }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm" style={{ color: BRAND.text }}>
                  {new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </h3>
                <button
                  onClick={() => openAddModal(selectedDay)}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                  style={{ backgroundColor: 'rgba(144,196,207,0.1)', color: BRAND.cyan, border: `1px solid ${BRAND.borderCyan}` }}
                >
                  <Plus size={11} /> Add
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {dayEvents.map(ev => {
                  const cfg = EVENT_CONFIG[ev.type]
                  return (
                    <button
                      key={ev.id}
                      onClick={() => setSelectedEvent(ev)}
                      className="w-full text-left rounded-xl p-3 transition-colors hover:opacity-80"
                      style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold leading-tight" style={{ color: cfg.color }}>
                          {ev.title}
                        </p>
                        <span className="text-[10px] flex-shrink-0" style={{ color: BRAND.muted }}>
                          {ev.time}
                        </span>
                      </div>
                      <p className="text-[11px] mt-0.5" style={{ color: BRAND.muted }}>
                        {cfg.label} · {ev.duration} min
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div
              className="rounded-2xl p-5 flex flex-col items-center justify-center text-center"
              style={{ backgroundColor: BRAND.card, border: cardBorder, minHeight: 180 }}
            >
              <Calendar size={24} style={{ color: 'rgba(255,255,255,0.12)', marginBottom: 12 }} />
              <p className="text-sm font-medium" style={{ color: BRAND.muted }}>
                Select a day to see events
              </p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>
                or click &ldquo;Add Event&rdquo; to schedule something
              </p>
            </div>
          )}

          {/* Upcoming 7 days */}
          <div
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{ backgroundColor: BRAND.card, border: cardBorder }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: BRAND.muted }}>
                Next 7 Days
              </h3>
              <RefreshCw size={11} style={{ color: 'rgba(255,255,255,0.15)' }} />
            </div>

            {upcomingEvents.length === 0 ? (
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                No events in the next 7 days.
              </p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {upcomingEvents.map(ev => {
                  const cfg = EVENT_CONFIG[ev.type]
                  const evDate = new Date(ev.date + 'T00:00:00')
                  const isEvToday = ev.date === todayISO
                  return (
                    <button
                      key={ev.id}
                      onClick={() => {
                        setSelectedDay(ev.date)
                        setSelectedEvent(ev)
                        setViewDate(new Date(year, evDate.getMonth(), 1))
                      }}
                      className="w-full text-left flex items-start gap-2.5 rounded-xl p-2.5 transition-colors hover:opacity-80"
                      style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${BRAND.border}` }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: cfg.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: BRAND.text }}>
                          {ev.title}
                        </p>
                        <p className="text-[11px]" style={{ color: BRAND.muted }}>
                          {isEvToday ? 'Today' : evDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          {' · '}{ev.time}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add event modal */}
      {showAddModal && (
        <AddEventModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
          defaultDate={addDefaultDate}
        />
      )}
    </div>
  )
}
