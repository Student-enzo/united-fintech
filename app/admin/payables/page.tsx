'use client'

import { useState, useCallback } from 'react'
import {
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Plus, X, Check, AlertTriangle, Clock, RefreshCw, Trash2,
  CalendarDays, List, Pencil, CreditCard, Building2, Shield,
  Code2, BarChart2, DollarSign,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type RecurringBill = {
  id: number
  label: string
  category: string
  amount: number
  due_day: number
  frequency: string
  active: boolean
  paid_this_month: boolean
}

type CalendarItem = { day: number; label: string; amount: number; color: string }

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_BILLS: RecurringBill[] = [
  { id: 1,  label: 'Salesforce CRM',            category: 'software',   amount: 1200, due_day: 1,  frequency: 'monthly', active: true, paid_this_month: true  },
  { id: 2,  label: 'E&O Insurance',             category: 'insurance',  amount: 850,  due_day: 1,  frequency: 'monthly', active: true, paid_this_month: true  },
  { id: 3,  label: 'Office Rent — Brickell',    category: 'office',     amount: 4200, due_day: 1,  frequency: 'monthly', active: true, paid_this_month: true  },
  { id: 4,  label: 'Comply Advantage Platform', category: 'compliance', amount: 450,  due_day: 2,  frequency: 'monthly', active: true, paid_this_month: false },
  { id: 5,  label: 'DataForSEO API',            category: 'software',   amount: 189,  due_day: 1,  frequency: 'monthly', active: true, paid_this_month: true  },
  { id: 6,  label: 'Processor API Fees — NMI',  category: 'processor',  amount: 2400, due_day: 10, frequency: 'monthly', active: true, paid_this_month: false },
  { id: 7,  label: 'Visa / MC Assessment Fees', category: 'processor',  amount: 3100, due_day: 15, frequency: 'monthly', active: true, paid_this_month: false },
  { id: 8,  label: 'AE Commissions — June',     category: 'payroll',    amount: 8750, due_day: 20, frequency: 'monthly', active: true, paid_this_month: false },
  { id: 9,  label: 'Partner Payouts — ISO Net', category: 'payroll',    amount: 22300,due_day: 5,  frequency: 'monthly', active: true, paid_this_month: false },
  { id: 10, label: 'Slack Business+',           category: 'software',   amount: 299,  due_day: 1,  frequency: 'monthly', active: true, paid_this_month: true  },
  { id: 11, label: 'Google Ads Budget',         category: 'marketing',  amount: 2200, due_day: 1,  frequency: 'monthly', active: true, paid_this_month: true  },
  { id: 12, label: 'Bookkeeper — Monthly Close',category: 'contractor', amount: 1800, due_day: 5,  frequency: 'monthly', active: true, paid_this_month: false },
]

const CAT_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  software:   { icon: Code2,     color: '#90c4cf', label: 'Software'    },
  insurance:  { icon: Shield,    color: '#FB923C', label: 'Insurance'   },
  office:     { icon: Building2, color: '#94A3B8', label: 'Office'      },
  compliance: { icon: Shield,    color: '#A78BFA', label: 'Compliance'  },
  processor:  { icon: CreditCard,color: '#FBBF24', label: 'Processor'   },
  payroll:    { icon: DollarSign,color: '#34D399', label: 'Payroll'     },
  marketing:  { icon: BarChart2, color: '#F472B6', label: 'Marketing'   },
  contractor: { icon: Code2,     color: '#6EE7B7', label: 'Contractor'  },
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function fmtDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function urgency(dueDate: string): 'overdue' | 'soon' | 'upcoming' {
  const diff = (new Date(dueDate).getTime() - Date.now()) / 86400000
  if (diff < 0) return 'overdue'
  if (diff <= 7) return 'soon'
  return 'upcoming'
}

const URGENCY_COLOR = { overdue: '#EF4444', soon: '#FBBF24', upcoming: '#90c4cf' }

const inputStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(144,196,207,0.2)',
  color: 'rgba(255,255,255,0.85)',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 13,
  outline: 'none',
  width: '100%',
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({
  icon: Icon, title, color, total, count, children, defaultOpen = true,
}: {
  icon: React.ElementType; title: string; color: string; total: number
  count: number; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1c1c1c', border: '1px solid rgba(255,255,255,0.08)' }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer transition-colors"
        style={{ backgroundColor: open ? 'rgba(255,255,255,0.03)' : 'transparent' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.04)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = open ? 'rgba(255,255,255,0.03)' : 'transparent'}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
            <Icon size={15} style={{ color }} />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>{title}</p>
            {count > 0 && <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{count} item{count !== 1 ? 's' : ''}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {total > 0 && <span className="text-base font-bold" style={{ color }}>{fmt(total)}</span>}
          {total === 0 && count === 0 && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(52,211,153,0.12)', color: '#34D399' }}>All clear</span>
          )}
          {open ? <ChevronUp size={14} style={{ color: 'rgba(255,255,255,0.3)' }} /> : <ChevronDown size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />}
        </div>
      </button>
      {open && <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>{children}</div>}
    </div>
  )
}

// ─── Bill Row ─────────────────────────────────────────────────────────────────

function BillRow({
  bill, monthStr, onMarkPaid, onEdit, onDelete, paying,
}: {
  bill: RecurringBill; monthStr: string
  onMarkPaid: () => void; onEdit: () => void; onDelete: () => void; paying: boolean
}) {
  const dueDate = `${monthStr}-${String(bill.due_day).padStart(2, '0')}`
  const u = urgency(dueDate)
  const uColor = URGENCY_COLOR[u]
  const catCfg = CAT_CONFIG[bill.category] ?? { icon: DollarSign, color: '#6B7280', label: bill.category }

  if (bill.paid_this_month) {
    return (
      <div className="flex items-center gap-3 px-5 py-3.5 opacity-40" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="w-0.5 h-9 rounded-full flex-shrink-0" style={{ backgroundColor: '#34D399' }} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium line-through" style={{ color: 'rgba(255,255,255,0.88)' }}>{bill.label}</p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>monthly · day {bill.due_day}</p>
        </div>
        <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>{fmt(bill.amount)}</span>
        <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(52,211,153,0.12)', color: '#34D399' }}>
          <Check size={11} /> Paid
        </span>
      </div>
    )
  }

  return (
    <div
      className="flex items-center gap-3 px-5 py-3.5 group transition-colors"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.02)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
      <div className="w-0.5 h-9 rounded-full flex-shrink-0" style={{ backgroundColor: uColor }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: 'rgba(255,255,255,0.88)' }}>
          {bill.label}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-xs font-medium flex items-center gap-1" style={{ color: uColor }}>
            {u === 'overdue' ? <AlertTriangle size={9} /> : <Clock size={9} />}
            {u === 'overdue' ? `Overdue · ${fmtDate(dueDate)}` : `Due ${fmtDate(dueDate)}`}
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: `${catCfg.color}18`, color: catCfg.color }}>
            <RefreshCw size={9} className="inline mr-1" />monthly · day {bill.due_day}
          </span>
        </div>
      </div>
      <span className="text-sm font-bold flex-shrink-0" style={{ color: 'rgba(255,255,255,0.7)' }}>{fmt(bill.amount)}</span>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button onClick={onMarkPaid} disabled={paying}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-40"
          style={{ backgroundColor: 'rgba(52,211,153,0.15)', color: '#34D399', border: '1px solid rgba(52,211,153,0.25)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(52,211,153,0.25)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(52,211,153,0.15)' }}>
          <Check size={11} />{paying ? 'Saving…' : 'Mark Paid'}
        </button>
        <button onClick={onEdit}
          className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg transition-all cursor-pointer"
          style={{ color: 'rgba(144,196,207,0.6)' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#90c4cf'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(144,196,207,0.6)'}>
          <Pencil size={13} />
        </button>
        <button onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg transition-all cursor-pointer"
          style={{ color: 'rgba(239,68,68,0.5)' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#EF4444'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.5)'}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}

// ─── Add/Edit Bill Modal ──────────────────────────────────────────────────────

function BillModal({
  bill, onClose, onSave,
}: {
  bill?: Partial<RecurringBill>
  onClose: () => void
  onSave: (b: Omit<RecurringBill, 'id' | 'paid_this_month'>) => void
}) {
  const [form, setForm] = useState({
    label:     bill?.label     ?? '',
    category:  bill?.category  ?? 'software',
    amount:    bill?.amount    ? String(bill.amount) : '',
    due_day:   bill?.due_day   ? String(bill.due_day) : '1',
    frequency: bill?.frequency ?? 'monthly',
    active:    bill?.active    ?? true,
  })
  const [saving, setSaving] = useState(false)

  const sectionLabel: React.CSSProperties = {
    color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.15em',
    fontWeight: 600, textTransform: 'uppercase', marginBottom: 6, display: 'block',
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.label || !form.amount) return
    setSaving(true)
    setTimeout(() => {
      onSave({
        label: form.label,
        category: form.category,
        amount: Number(form.amount),
        due_day: Math.min(28, Math.max(1, Number(form.due_day) || 1)),
        frequency: form.frequency,
        active: form.active,
      })
      setSaving(false)
      onClose()
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md rounded-2xl" style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(144,196,207,0.15)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'rgba(144,196,207,0.1)', backgroundColor: '#1a1a1a' }}>
          <h2 className="font-bold text-white text-lg">{bill?.id ? 'Edit' : 'Add'} Recurring Bill</h2>
          <button onClick={onClose} className="cursor-pointer" style={{ color: 'rgba(255,255,255,0.4)' }}><X size={20} /></button>
        </div>

        <form onSubmit={submit} className="p-6 flex flex-col gap-5">
          <div>
            <span style={sectionLabel}>Bill Name *</span>
            <input required value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
              placeholder="e.g. Salesforce CRM" style={inputStyle} />
          </div>

          <div>
            <span style={sectionLabel}>Category</span>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(CAT_CONFIG).map(([key, cfg]) => (
                <button key={key} type="button" onClick={() => setForm(f => ({ ...f, category: key }))}
                  className="flex items-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                  style={form.category === key
                    ? { backgroundColor: `${cfg.color}20`, border: `2px solid ${cfg.color}60`, color: cfg.color }
                    : { backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }
                  }>
                  <cfg.icon size={12} />
                  <span className="truncate">{cfg.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span style={sectionLabel}>Amount *</span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>$</span>
                <input required type="number" step="0.01" min="0" value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="0.00" style={{ ...inputStyle, paddingLeft: 28 }} />
              </div>
            </div>
            <div>
              <span style={sectionLabel}>Due Day (1–28)</span>
              <input type="number" min="1" max="28" value={form.due_day}
                onChange={e => setForm(f => ({ ...f, due_day: e.target.value }))}
                style={inputStyle} />
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(144,196,207,0.12)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw size={14} style={{ color: '#4A9B7F' }} />
                <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>Repeat monthly</span>
              </div>
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#4A9B7F' }} />
            </div>
            <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
              This bill will appear every month until marked as paid.
            </p>
          </div>

          <button type="submit" disabled={saving}
            className="py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
            style={{ backgroundColor: saving ? 'rgba(251,191,36,0.4)' : '#FBBF24', color: '#1a1a1a' }}>
            {saving ? 'Saving…' : bill?.id ? 'Update Bill' : 'Save Bill'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Calendar View ────────────────────────────────────────────────────────────

function PayablesCalendar({ year, month, items }: { year: number; month: number; items: CalendarItem[] }) {
  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today       = new Date()
  const monthTotal  = items.reduce((s, i) => s + i.amount, 0)

  const byDay: Record<number, CalendarItem[]> = {}
  for (const item of items) {
    if (!byDay[item.day]) byDay[item.day] = []
    byDay[item.day].push(item)
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1c1c1c', border: '1px solid rgba(144,196,207,0.13)' }}>
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(144,196,207,0.1)' }}>
        <p className="font-bold text-white text-base">{MONTH_NAMES[month]} {year}</p>
        {monthTotal > 0 && <p className="text-xs font-semibold" style={{ color: '#FBBF24' }}>{fmt(monthTotal)} due this month</p>}
      </div>
      <div className="grid grid-cols-7 border-b" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(144,196,207,0.08)' }}>
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="text-center text-xs font-semibold py-2" style={{ color: 'rgba(255,255,255,0.3)' }}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`e${i}`} className="min-h-[88px]"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', borderRight: '1px solid rgba(255,255,255,0.04)', backgroundColor: 'rgba(255,255,255,0.01)' }} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dayItems = byDay[day] ?? []
          const dayTotal = dayItems.reduce((s, it) => s + it.amount, 0)
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
          const isPast  = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
          const isLastCol = (firstDay + i) % 7 === 6
          return (
            <div key={day} className="min-h-[88px] p-1.5 transition-colors"
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                borderRight: isLastCol ? 'none' : '1px solid rgba(255,255,255,0.04)',
                backgroundColor: isToday ? 'rgba(251,191,36,0.07)' : (isPast && dayItems.length > 0 ? 'rgba(239,68,68,0.05)' : undefined),
              }}>
              <div className="text-xs font-bold mb-1 w-6 h-6 flex items-center justify-center rounded-full"
                style={isToday
                  ? { backgroundColor: '#FBBF24', color: '#1a1a1a' }
                  : { color: isPast ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.5)' }}>
                {day}
              </div>
              {dayTotal > 0 && <div className="text-[10px] font-bold mb-0.5" style={{ color: '#FBBF24' }}>{fmt(dayTotal)}</div>}
              <div className="space-y-0.5">
                {dayItems.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="text-[9px] px-1 py-0.5 rounded truncate font-medium"
                    style={{ backgroundColor: `${item.color}22`, color: item.color }}>
                    {item.label}
                  </div>
                ))}
                {dayItems.length > 2 && (
                  <div className="text-[9px] pl-1" style={{ color: 'rgba(255,255,255,0.3)' }}>+{dayItems.length - 2} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {items.length > 0 && (
        <div className="px-6 py-3 border-t flex items-center justify-between"
          style={{ borderColor: 'rgba(144,196,207,0.1)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{items.length} item{items.length !== 1 ? 's' : ''} due this month</span>
          <span className="text-sm font-bold" style={{ color: '#FBBF24' }}>{fmt(monthTotal)}</span>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PayablesPage() {
  const today = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [bills, setBills] = useState<RecurringBill[]>(MOCK_BILLS)
  const [paying,  setPaying]  = useState<Record<number, boolean>>({})
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [showBillModal, setShowBillModal] = useState(false)
  const [editingBill, setEditingBill] = useState<Partial<RecurringBill> | undefined>()

  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`

  function prevMonth() { month === 0 ? (setMonth(11), setYear(y => y - 1)) : setMonth(m => m - 1) }
  function nextMonth() { month === 11 ? (setMonth(0), setYear(y => y + 1)) : setMonth(m => m + 1) }

  const unpaidBills = bills.filter(b => b.active && !b.paid_this_month)
  const paidBills   = bills.filter(b => b.active && b.paid_this_month)

  const totalPending    = unpaidBills.reduce((s, b) => s + b.amount, 0)
  const totalMonthly    = bills.filter(b => b.active).reduce((s, b) => s + b.amount, 0)
  const overdueCount    = unpaidBills.filter(b => urgency(`${monthStr}-${String(b.due_day).padStart(2, '0')}`) === 'overdue').length

  function markPaid(id: number) {
    setPaying(p => ({ ...p, [id]: true }))
    setTimeout(() => {
      setBills(prev => prev.map(b => b.id === id ? { ...b, paid_this_month: true } : b))
      setPaying(p => { const n = { ...p }; delete n[id]; return n })
    }, 600)
  }

  function deleteBill(id: number) {
    if (!confirm('Delete this recurring bill?')) return
    setBills(prev => prev.filter(b => b.id !== id))
  }

  function openAdd() { setEditingBill(undefined); setShowBillModal(true) }
  function openEdit(bill: RecurringBill) { setEditingBill(bill); setShowBillModal(true) }

  function saveBill(data: Omit<RecurringBill, 'id' | 'paid_this_month'>) {
    if (editingBill?.id) {
      setBills(prev => prev.map(b => b.id === editingBill.id ? { ...b, ...data } : b))
    } else {
      setBills(prev => [...prev, { ...data, id: Date.now(), paid_this_month: false }])
    }
  }

  // Group unpaid by category for section cards
  const unpaidSoftware  = unpaidBills.filter(b => b.category === 'software')
  const unpaidProcessor = unpaidBills.filter(b => b.category === 'processor')
  const unpaidPayroll   = unpaidBills.filter(b => b.category === 'payroll')
  const unpaidOther     = unpaidBills.filter(b => !['software','processor','payroll'].includes(b.category))

  const calendarItems: CalendarItem[] = unpaidBills.map(b => ({
    day: b.due_day,
    label: b.label,
    amount: b.amount,
    color: CAT_CONFIG[b.category]?.color ?? '#6B7280',
  }))

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'rgba(255,255,255,0.95)' }}>Payables</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Recurring bills — mark each one paid as you go
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View toggle */}
          <div className="flex items-center rounded-lg p-1" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
            <button onClick={() => setView('list')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer"
              style={view === 'list'
                ? { backgroundColor: '#1c1c1c', color: '#90c4cf', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }
                : { color: 'rgba(255,255,255,0.4)' }}>
              <List size={13} /> List
            </button>
            <button onClick={() => setView('calendar')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer"
              style={view === 'calendar'
                ? { backgroundColor: '#1c1c1c', color: '#90c4cf', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }
                : { color: 'rgba(255,255,255,0.4)' }}>
              <CalendarDays size={13} /> Calendar
            </button>
          </div>

          {/* Month nav */}
          <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ backgroundColor: '#1c1c1c', border: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={prevMonth} className="p-1 rounded-lg cursor-pointer transition-colors"
              style={{ color: 'rgba(255,255,255,0.4)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'}>
              <ChevronLeft size={15} />
            </button>
            <span className="text-sm font-semibold w-36 text-center" style={{ color: 'rgba(255,255,255,0.85)' }}>
              {MONTH_NAMES[month]} {year}
            </span>
            <button onClick={nextMonth} className="p-1 rounded-lg cursor-pointer transition-colors"
              style={{ color: 'rgba(255,255,255,0.4)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'}>
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Add bill */}
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
            style={{ backgroundColor: 'rgba(251,191,36,0.15)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.3)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(251,191,36,0.25)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(251,191,36,0.15)'}>
            <Plus size={15} /> Add Bill
          </button>
        </div>
      </div>

      {/* KPI stat bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Pending',   value: fmt(totalPending), color: '#90c4cf', bg: 'rgba(144,196,207,0.1)' },
          { label: 'Overdue',         value: overdueCount > 0 ? `${overdueCount} item${overdueCount > 1 ? 's' : ''}` : 'None', color: overdueCount > 0 ? '#EF4444' : '#34D399', bg: overdueCount > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(52,211,153,0.08)' },
          { label: 'Monthly Total',   value: fmt(totalMonthly), color: '#FBBF24', bg: 'rgba(251,191,36,0.08)' },
          { label: 'Bills Paid',      value: `${paidBills.length} / ${bills.filter(b => b.active).length}`, color: '#34D399', bg: 'rgba(52,211,153,0.08)' },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl p-4" style={{ backgroundColor: stat.bg, border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{stat.label}</p>
            <p className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {view === 'calendar' ? (
        <PayablesCalendar year={year} month={month} items={calendarItems} />
      ) : (
        <div className="flex flex-col gap-4">

          {/* Processor fees */}
          <SectionCard icon={CreditCard} title="Processor Fees" color="#FBBF24"
            total={unpaidProcessor.reduce((s, b) => s + b.amount, 0)} count={unpaidProcessor.length}>
            {unpaidProcessor.length === 0 ? (
              <div className="px-5 py-6 text-center text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>All clear this month</div>
            ) : unpaidProcessor.map(bill => (
              <BillRow key={bill.id} bill={bill} monthStr={monthStr}
                onMarkPaid={() => markPaid(bill.id)} onEdit={() => openEdit(bill)}
                onDelete={() => deleteBill(bill.id)} paying={!!paying[bill.id]} />
            ))}
            {/* Paid this month */}
            {paidBills.filter(b => b.category === 'processor').map(bill => (
              <BillRow key={bill.id} bill={bill} monthStr={monthStr}
                onMarkPaid={() => {}} onEdit={() => {}} onDelete={() => {}} paying={false} />
            ))}
          </SectionCard>

          {/* AE Commissions & Partner Payouts */}
          <SectionCard icon={DollarSign} title="Payroll & Commissions" color="#34D399"
            total={unpaidPayroll.reduce((s, b) => s + b.amount, 0)} count={unpaidPayroll.length}>
            {unpaidPayroll.length === 0 ? (
              <div className="px-5 py-6 text-center text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>All clear this month</div>
            ) : unpaidPayroll.map(bill => (
              <BillRow key={bill.id} bill={bill} monthStr={monthStr}
                onMarkPaid={() => markPaid(bill.id)} onEdit={() => openEdit(bill)}
                onDelete={() => deleteBill(bill.id)} paying={!!paying[bill.id]} />
            ))}
            {paidBills.filter(b => b.category === 'payroll').map(bill => (
              <BillRow key={bill.id} bill={bill} monthStr={monthStr}
                onMarkPaid={() => {}} onEdit={() => {}} onDelete={() => {}} paying={false} />
            ))}
          </SectionCard>

          {/* Software / SaaS */}
          <SectionCard icon={Code2} title="Software & SaaS" color="#90c4cf"
            total={unpaidSoftware.reduce((s, b) => s + b.amount, 0)} count={unpaidSoftware.length}>
            {unpaidSoftware.length === 0 ? (
              <div className="px-5 py-6 text-center text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>All software bills paid</div>
            ) : unpaidSoftware.map(bill => (
              <BillRow key={bill.id} bill={bill} monthStr={monthStr}
                onMarkPaid={() => markPaid(bill.id)} onEdit={() => openEdit(bill)}
                onDelete={() => deleteBill(bill.id)} paying={!!paying[bill.id]} />
            ))}
            {paidBills.filter(b => b.category === 'software').map(bill => (
              <BillRow key={bill.id} bill={bill} monthStr={monthStr}
                onMarkPaid={() => {}} onEdit={() => {}} onDelete={() => {}} paying={false} />
            ))}
          </SectionCard>

          {/* Other (office, insurance, compliance, marketing, contractor) */}
          <SectionCard icon={Building2} title="Office & Other Bills" color="#A78BFA"
            total={unpaidOther.reduce((s, b) => s + b.amount, 0)} count={unpaidOther.length}
            defaultOpen={unpaidOther.length > 0}>
            {unpaidOther.length === 0 ? (
              <div className="px-5 py-6 text-center text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>All other bills paid</div>
            ) : unpaidOther.map(bill => (
              <BillRow key={bill.id} bill={bill} monthStr={monthStr}
                onMarkPaid={() => markPaid(bill.id)} onEdit={() => openEdit(bill)}
                onDelete={() => deleteBill(bill.id)} paying={!!paying[bill.id]} />
            ))}
            {paidBills.filter(b => !['software','processor','payroll'].includes(b.category)).map(bill => (
              <BillRow key={bill.id} bill={bill} monthStr={monthStr}
                onMarkPaid={() => {}} onEdit={() => {}} onDelete={() => {}} paying={false} />
            ))}
          </SectionCard>

          {/* Add recurring bill */}
          <button onClick={openAdd}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer"
            style={{ border: '1px dashed rgba(144,196,207,0.25)', color: 'rgba(255,255,255,0.35)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(144,196,207,0.5)'; (e.currentTarget as HTMLElement).style.color = '#90c4cf' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(144,196,207,0.25)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)' }}>
            <Plus size={14} /> Add recurring bill
          </button>

          {/* All-clear */}
          {totalPending === 0 && (
            <div className="rounded-2xl py-14 text-center" style={{ backgroundColor: '#1c1c1c', border: '1px solid rgba(52,211,153,0.2)' }}>
              <div className="text-4xl mb-3">✓</div>
              <p className="text-base font-semibold" style={{ color: '#34D399' }}>All clear for {MONTH_NAMES[month]}!</p>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Nothing left to pay this month.</p>
            </div>
          )}
        </div>
      )}

      {showBillModal && (
        <BillModal
          bill={editingBill}
          onClose={() => setShowBillModal(false)}
          onSave={data => { saveBill(data); setShowBillModal(false) }}
        />
      )}
    </div>
  )
}
