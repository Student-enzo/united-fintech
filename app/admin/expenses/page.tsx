'use client'

import { useState, useRef } from 'react'
import { Plus, Upload, X, TrendingDown, RefreshCw, Trash2 } from 'lucide-react'
import dynamic from 'next/dynamic'

const ExpensesDonutChart = dynamic(
  () => import('@/components/admin/charts/ExpensesDonutChart'),
  { ssr: false, loading: () => <div className="h-44 rounded-xl animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }} /> }
)

// ─── Types ────────────────────────────────────────────────────────────────────

type Expense = {
  id: number
  category: string
  amount: number
  description: string
  date: string
  vendor: string
  logged_by: string
  receipt_url: string | null
  status: 'approved' | 'pending' | 'rejected'
  is_recurring: boolean
  recurrence: string | null
}

const CATEGORIES = [
  { key: 'software',    label: 'Software / SaaS',       emoji: '💻', color: '#90c4cf' },
  { key: 'travel',      label: 'Travel',                 emoji: '✈️', color: '#FBBF24' },
  { key: 'marketing',   label: 'Marketing',              emoji: '📢', color: '#F472B6' },
  { key: 'legal',       label: 'Legal & Compliance',     emoji: '⚖️', color: '#A78BFA' },
  { key: 'office',      label: 'Office',                 emoji: '🏢', color: '#94A3B8' },
  { key: 'contractor',  label: 'Contractor Fees',        emoji: '🤝', color: '#34D399' },
  { key: 'client_ent',  label: 'Client Entertainment',   emoji: '🍽️', color: '#FB923C' },
] as const

const CAT_COLORS: Record<string, string> = {
  software:   '#90c4cf',
  travel:     '#FBBF24',
  marketing:  '#F472B6',
  legal:      '#A78BFA',
  office:     '#94A3B8',
  contractor: '#34D399',
  client_ent: '#FB923C',
}

const STATUS_CONFIG = {
  approved: { color: '#6EE7B7', bg: 'rgba(110,231,183,0.12)', border: 'rgba(110,231,183,0.3)' },
  pending:  { color: '#FBBF24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.3)'  },
  rejected: { color: '#F87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.3)' },
}

const LOGGED_BY = ['Enzo Godoy', 'Sarah Chen', 'Marcus Webb', 'Priya Nair']

const MOCK_EXPENSES: Expense[] = [
  { id: 1,  category: 'software',   amount: 1200,  description: 'Salesforce CRM — monthly',             vendor: 'Salesforce',           logged_by: 'Enzo Godoy',   date: '2026-06-01', receipt_url: null, status: 'approved', is_recurring: true,  recurrence: 'monthly' },
  { id: 2,  category: 'software',   amount: 299,   description: 'Slack Business+',                      vendor: 'Slack',                logged_by: 'Enzo Godoy',   date: '2026-06-01', receipt_url: null, status: 'approved', is_recurring: true,  recurrence: 'monthly' },
  { id: 3,  category: 'software',   amount: 189,   description: 'DataForSEO API subscription',          vendor: 'DataForSEO',           logged_by: 'Priya Nair',   date: '2026-06-01', receipt_url: null, status: 'approved', is_recurring: true,  recurrence: 'monthly' },
  { id: 4,  category: 'software',   amount: 450,   description: 'Compliance monitoring platform',       vendor: 'Comply Advantage',     logged_by: 'Marcus Webb',  date: '2026-06-02', receipt_url: null, status: 'approved', is_recurring: true,  recurrence: 'monthly' },
  { id: 5,  category: 'travel',     amount: 1840,  description: 'MPE Conference — Vegas flights+hotel', vendor: 'American Airlines',    logged_by: 'Enzo Godoy',   date: '2026-06-03', receipt_url: null, status: 'approved', is_recurring: false, recurrence: null },
  { id: 6,  category: 'travel',     amount: 320,   description: 'Uber & rideshare — client visits',    vendor: 'Uber Business',        logged_by: 'Sarah Chen',   date: '2026-06-04', receipt_url: null, status: 'pending',  is_recurring: false, recurrence: null },
  { id: 7,  category: 'marketing',  amount: 2200,  description: 'Google Ads — lead gen campaign',       vendor: 'Google',               logged_by: 'Priya Nair',   date: '2026-06-01', receipt_url: null, status: 'approved', is_recurring: false, recurrence: null },
  { id: 8,  category: 'marketing',  amount: 800,   description: 'LinkedIn sponsored posts',             vendor: 'LinkedIn Marketing',   logged_by: 'Priya Nair',   date: '2026-06-04', receipt_url: null, status: 'approved', is_recurring: false, recurrence: null },
  { id: 9,  category: 'marketing',  amount: 350,   description: 'Canva Pro + design tools',             vendor: 'Canva',                logged_by: 'Sarah Chen',   date: '2026-06-01', receipt_url: null, status: 'approved', is_recurring: true,  recurrence: 'monthly' },
  { id: 10, category: 'legal',      amount: 3500,  description: 'ISO agreement review — attorney fee',  vendor: 'Reed Smith LLP',       logged_by: 'Enzo Godoy',   date: '2026-05-30', receipt_url: null, status: 'approved', is_recurring: false, recurrence: null },
  { id: 11, category: 'legal',      amount: 280,   description: 'State registration renewal — FL',      vendor: 'FL Secretary of State',logged_by: 'Marcus Webb',  date: '2026-06-02', receipt_url: null, status: 'approved', is_recurring: false, recurrence: null },
  { id: 12, category: 'office',     amount: 4200,  description: 'Office rent — June',                   vendor: 'Brickell Office Center',logged_by: 'Enzo Godoy',  date: '2026-06-01', receipt_url: null, status: 'approved', is_recurring: true,  recurrence: 'monthly' },
  { id: 13, category: 'office',     amount: 125,   description: 'Office supplies',                      vendor: 'Staples',              logged_by: 'Sarah Chen',   date: '2026-06-03', receipt_url: null, status: 'pending',  is_recurring: false, recurrence: null },
  { id: 14, category: 'contractor', amount: 3200,  description: 'Backend dev — API integration work',   vendor: 'Dev Studios LLC',      logged_by: 'Marcus Webb',  date: '2026-06-01', receipt_url: null, status: 'approved', is_recurring: false, recurrence: null },
  { id: 15, category: 'contractor', amount: 1800,  description: 'Bookkeeper — May close',               vendor: 'Precision Accounting', logged_by: 'Enzo Godoy',   date: '2026-06-05', receipt_url: null, status: 'approved', is_recurring: true,  recurrence: 'monthly' },
  { id: 16, category: 'client_ent', amount: 680,   description: 'Dinner — Retail Co board members',     vendor: 'Zuma Miami',           logged_by: 'Enzo Godoy',   date: '2026-06-02', receipt_url: null, status: 'approved', is_recurring: false, recurrence: null },
  { id: 17, category: 'client_ent', amount: 340,   description: 'Client golf outing — Q2 prospects',   vendor: 'Doral Golf Resort',    logged_by: 'Sarah Chen',   date: '2026-06-04', receipt_url: null, status: 'pending',  is_recurring: false, recurrence: null },
  { id: 18, category: 'software',   amount: 99,    description: 'Notion team plan',                     vendor: 'Notion',               logged_by: 'Marcus Webb',  date: '2026-06-01', receipt_url: null, status: 'approved', is_recurring: true,  recurrence: 'monthly' },
  { id: 19, category: 'travel',     amount: 560,   description: 'NYC office visit — hotel 2 nights',    vendor: 'Marriott Bonvoy',      logged_by: 'Marcus Webb',  date: '2026-06-05', receipt_url: null, status: 'rejected', is_recurring: false, recurrence: null },
  { id: 20, category: 'legal',      amount: 150,   description: 'E&O insurance — monthly installment',  vendor: 'Hiscox Insurance',     logged_by: 'Enzo Godoy',   date: '2026-06-01', receipt_url: null, status: 'approved', is_recurring: true,  recurrence: 'monthly' },
]

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

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

const cardStyle: React.CSSProperties = {
  backgroundColor: '#282626',
  border: '1px solid rgba(144,196,207,0.13)',
  borderRadius: 16,
}

// ─── Add Expense Modal ────────────────────────────────────────────────────────

function AddExpenseModal({ onClose, onAdded }: { onClose: () => void; onAdded: (e: Expense) => void }) {
  const [form, setForm] = useState({
    category: 'software',
    amount: '',
    description: '',
    vendor: '',
    date: new Date().toISOString().slice(0, 10),
    logged_by: LOGGED_BY[0],
    is_recurring: false,
    recurrence: 'monthly',
    status: 'approved' as const,
  })
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const sectionLabel: React.CSSProperties = {
    color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.15em',
    fontWeight: 600, textTransform: 'uppercase', marginBottom: 8, display: 'block',
  }

  function handleFile(file: File | null) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => setReceiptPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      const newExpense: Expense = {
        id: Date.now(),
        category: form.category,
        amount: parseFloat(form.amount),
        description: form.description,
        vendor: form.vendor,
        date: form.date,
        logged_by: form.logged_by,
        receipt_url: receiptPreview,
        status: form.status,
        is_recurring: form.is_recurring,
        recurrence: form.is_recurring ? form.recurrence : null,
      }
      onAdded(newExpense)
      setSaving(false)
      onClose()
    }, 500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl" style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(144,196,207,0.15)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10"
          style={{ borderColor: 'rgba(144,196,207,0.1)', backgroundColor: '#1a1a1a' }}>
          <h2 className="font-bold text-white text-lg">Log Expense</h2>
          <button onClick={onClose} className="cursor-pointer" style={{ color: 'rgba(255,255,255,0.4)' }}><X size={20} /></button>
        </div>

        <form onSubmit={submit} className="p-6 flex flex-col gap-5">
          {/* Receipt */}
          <div>
            <span style={sectionLabel}>Receipt / Upload</span>
            {receiptPreview ? (
              <div className="relative w-full h-28 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(144,196,207,0.2)' }}>
                <img src={receiptPreview} alt="Receipt" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setReceiptPreview(null)}
                  className="absolute top-2 right-2 rounded-full p-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                  <X size={14} style={{ color: 'white' }} />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()}
                className="w-full h-20 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
                style={{ border: '2px dashed rgba(144,196,207,0.25)', color: 'rgba(255,255,255,0.35)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(144,196,207,0.5)'; (e.currentTarget as HTMLElement).style.color = '#90c4cf' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(144,196,207,0.25)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)' }}>
                <Upload size={18} />
                <span className="text-xs">Upload receipt (optional)</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden"
              onChange={e => handleFile(e.target.files?.[0] ?? null)} />
          </div>

          {/* Category */}
          <div>
            <span style={sectionLabel}>Category</span>
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORIES.map(cat => (
                <button key={cat.key} type="button" onClick={() => setForm(f => ({ ...f, category: cat.key }))}
                  className="flex items-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                  style={form.category === cat.key
                    ? { backgroundColor: `${cat.color}20`, border: `2px solid ${cat.color}60`, color: cat.color }
                    : { backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }
                  }>
                  <span>{cat.emoji}</span>
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Vendor + Description */}
          <div>
            <span style={sectionLabel}>Vendor</span>
            <input value={form.vendor} onChange={e => setForm(f => ({ ...f, vendor: e.target.value }))}
              placeholder="e.g. Salesforce" style={inputStyle} />
          </div>
          <div>
            <span style={sectionLabel}>Description *</span>
            <input required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="What was this for?" style={inputStyle} />
          </div>

          {/* Amount + Date */}
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
              <span style={sectionLabel}>Date</span>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} />
            </div>
          </div>

          {/* Logged by */}
          <div>
            <span style={sectionLabel}>Logged By</span>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.logged_by} onChange={e => setForm(f => ({ ...f, logged_by: e.target.value }))}>
              {LOGGED_BY.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* Recurring */}
          <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(144,196,207,0.12)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw size={14} style={{ color: '#4A9B7F' }} />
                <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>Recurring</span>
              </div>
              <button type="button" onClick={() => setForm(f => ({ ...f, is_recurring: !f.is_recurring }))}
                className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0 cursor-pointer"
                style={{ backgroundColor: form.is_recurring ? '#4A9B7F' : 'rgba(255,255,255,0.15)' }}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.is_recurring ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
            {form.is_recurring && (
              <div className="mt-3 flex gap-2">
                {['monthly', 'quarterly', 'yearly'].map(opt => (
                  <button key={opt} type="button" onClick={() => setForm(f => ({ ...f, recurrence: opt }))}
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer capitalize"
                    style={form.recurrence === opt
                      ? { backgroundColor: '#4A9B7F', color: '#fff', border: '1px solid #4A9B7F' }
                      : { border: '1px solid rgba(144,196,207,0.2)', color: 'rgba(255,255,255,0.55)', backgroundColor: 'transparent' }
                    }>
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={saving}
            className="py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
            style={{ backgroundColor: saving ? 'rgba(74,155,127,0.5)' : '#4A9B7F', color: '#fff' }}>
            {saving ? 'Saving…' : 'Save Expense'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES)
  const [showModal, setShowModal] = useState(false)
  const [filterCat, setFilterCat] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = expenses.filter(e =>
    (filterCat === 'all' || e.category === filterCat) &&
    (filterStatus === 'all' || e.status === filterStatus)
  )

  const total          = filtered.reduce((s, e) => s + e.amount, 0)
  const recurringTotal = expenses.filter(e => e.is_recurring).reduce((s, e) => s + e.amount, 0)
  const grandTotal     = expenses.reduce((s, e) => s + e.amount, 0)

  const byCategory = CATEGORIES.map(cat => ({
    ...cat,
    total: filtered.filter(e => e.category === cat.key).reduce((s, e) => s + e.amount, 0),
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total)

  const maxCat = Math.max(...byCategory.map(c => c.total), 1)

  function handleDelete(id: number) {
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'rgba(255,255,255,0.95)' }}>Expenses</h1>
          <p className="text-sm mt-0.5 flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <TrendingDown size={13} style={{ color: '#EF4444' }} />
            <span>{fmt(grandTotal)} total tracked</span>
            {recurringTotal > 0 && (
              <span className="flex items-center gap-1" style={{ color: '#4A9B7F' }}>
                <RefreshCw size={11} /> {fmt(recurringTotal)}/mo recurring
              </span>
            )}
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
          style={{ backgroundColor: '#4A9B7F', color: '#fff' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#3d8a6e'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#4A9B7F'}>
          <Plus size={16} /> Log Expense
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {CATEGORIES.slice(0, 3).map(cat => {
          const catTotal = expenses.filter(e => e.category === cat.key).reduce((s, e) => s + e.amount, 0)
          return (
            <div key={cat.key}
              className="p-4 rounded-xl cursor-pointer transition-all"
              style={{ ...cardStyle, outline: filterCat === cat.key ? `1px solid ${cat.color}60` : 'none' }}
              onClick={() => setFilterCat(filterCat === cat.key ? 'all' : cat.key)}>
              <div className="flex items-center gap-2 mb-1.5">
                <span>{cat.emoji}</span>
                <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>{cat.label}</p>
              </div>
              <p className="text-xl font-bold" style={{ color: CAT_COLORS[cat.key] }}>{fmt(catTotal)}</p>
            </div>
          )
        })}
        <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(74,155,127,0.3) 0%, rgba(74,155,127,0.15) 100%)', border: '1px solid rgba(74,155,127,0.3)' }}>
          <p className="text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {filterCat === 'all' ? 'All Expenses' : 'Filtered Total'}
          </p>
          <p className="text-xl font-bold text-white">{fmt(total)}</p>
          {recurringTotal > 0 && (
            <p className="flex items-center gap-1 text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <RefreshCw size={10} /> {fmt(recurringTotal)} recurring
            </p>
          )}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 p-6 rounded-2xl" style={cardStyle}>
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Breakdown</p>
          <p className="text-base font-bold mb-4" style={{ color: 'rgba(255,255,255,0.9)' }}>By Category</p>
          {byCategory.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: 'rgba(255,255,255,0.3)' }}>No expenses</p>
          ) : (
            <div className="space-y-3">
              {byCategory.map(cat => (
                <div key={cat.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      <span>{cat.emoji}</span>{cat.label}
                    </span>
                    <span className="text-sm font-bold" style={{ color: CAT_COLORS[cat.key] }}>{fmt(cat.total)}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${(cat.total / maxCat) * 100}%`, backgroundColor: CAT_COLORS[cat.key] }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl" style={cardStyle}>
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Distribution</p>
          <p className="text-base font-bold mb-4" style={{ color: 'rgba(255,255,255,0.9)' }}>Donut View</p>
          <ExpensesDonutChart data={
            CATEGORIES.map(cat => ({
              category: cat.label,
              amount: expenses.filter(e => e.category === cat.key).reduce((s, e) => s + e.amount, 0),
            })).filter(d => d.amount > 0)
          } />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold mr-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Category:</span>
          <button onClick={() => setFilterCat('all')}
            className="text-xs px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer"
            style={filterCat === 'all'
              ? { backgroundColor: '#4A9B7F', color: '#fff' }
              : { backgroundColor: '#282626', border: '1px solid rgba(144,196,207,0.13)', color: 'rgba(255,255,255,0.55)' }
            }>
            All
          </button>
          {CATEGORIES.map(cat => {
            const count = expenses.filter(e => e.category === cat.key).length
            if (count === 0) return null
            return (
              <button key={cat.key} onClick={() => setFilterCat(cat.key)}
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer"
                style={filterCat === cat.key
                  ? { backgroundColor: CAT_COLORS[cat.key], color: '#111' }
                  : { backgroundColor: '#282626', border: '1px solid rgba(144,196,207,0.13)', color: 'rgba(255,255,255,0.55)' }
                }>
                {cat.emoji} {cat.label} ({count})
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.35)' }}>Status:</span>
          {['all', 'approved', 'pending', 'rejected'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className="text-xs px-3 py-1.5 rounded-full font-medium capitalize transition-colors cursor-pointer"
              style={filterStatus === s
                ? { backgroundColor: '#90c4cf', color: '#111' }
                : { backgroundColor: '#282626', border: '1px solid rgba(144,196,207,0.13)', color: 'rgba(255,255,255,0.55)' }
              }>
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={cardStyle}>
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>No expenses found.</p>
            <button onClick={() => setShowModal(true)} className="mt-3 text-sm hover:underline cursor-pointer" style={{ color: '#4A9B7F' }}>
              Add your first expense →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'rgba(144,196,207,0.05)', borderBottom: '1px solid rgba(144,196,207,0.1)' }}>
                  {['Category', 'Vendor', 'Description', 'Date', 'Recurring', 'Logged By', 'Status', 'Amount', ''].map((h, i) => (
                    <th key={i} className={`${i >= 6 ? 'text-right' : 'text-left'} px-5 py-3 text-xs font-semibold uppercase tracking-wide`}
                      style={{ color: 'rgba(255,255,255,0.35)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((expense, idx) => {
                  const cat  = CATEGORIES.find(c => c.key === expense.category)
                  const sCfg = STATUS_CONFIG[expense.status]
                  return (
                    <tr key={expense.id}
                      className="group transition-colors"
                      style={{ borderBottom: idx < filtered.length - 1 ? '1px solid rgba(144,196,207,0.06)' : 'none' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.025)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium"
                          style={{ color: CAT_COLORS[expense.category] ?? '#6B7280' }}>
                          {cat?.emoji} {cat?.label ?? expense.category}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{expense.vendor}</td>
                      <td className="px-5 py-3 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>{expense.description}</td>
                      <td className="px-5 py-3 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{expense.date}</td>
                      <td className="px-5 py-3">
                        {expense.is_recurring ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: '#4A9B7F' }}>
                            <RefreshCw size={10} /> {expense.recurrence ?? 'recurring'}
                          </span>
                        ) : <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>—</span>}
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: 'rgba(144,196,207,0.12)', color: '#90c4cf' }}>
                          {expense.logged_by}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                          style={{ backgroundColor: sCfg.bg, color: sCfg.color, border: `1px solid ${sCfg.border}` }}>
                          {expense.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right text-sm font-bold" style={{ color: '#EF4444' }}>
                        -{fmt(expense.amount)}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <button onClick={() => handleDelete(expense.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg cursor-pointer"
                          title="Delete" style={{ color: 'rgba(239,68,68,0.5)' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#EF4444'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.5)'}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: '1px solid rgba(144,196,207,0.1)', backgroundColor: 'rgba(144,196,207,0.04)' }}>
                  <td colSpan={7} className="px-5 py-3 text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    Total ({filtered.length} expense{filtered.length !== 1 ? 's' : ''})
                  </td>
                  <td className="px-5 py-3 text-right text-sm font-bold" style={{ color: '#EF4444' }}>{fmt(total)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <AddExpenseModal
          onClose={() => setShowModal(false)}
          onAdded={e => { setExpenses(prev => [e, ...prev]); setShowModal(false) }}
        />
      )}
    </div>
  )
}
