'use client'

import { useState } from 'react'
import {
  Search, X, Plus, ChevronDown, Download, TrendingUp,
  UserCheck, UserPlus, Star, MoreVertical, Mail,
  Edit2, AlertTriangle, CheckCircle,
} from 'lucide-react'
import { BRAND } from '@/lib/brand'
import { fmtDate, fmtCurrency } from '@/lib/utils'

// ─── Types ─────────────────────────────────────────────────────────────────────

type ISOType = 'Agent' | 'Sub-ISO' | 'ISO'
type PartnerStatus = 'active' | 'pending' | 'suspended'

type Partner = {
  id: string
  name: string
  iso_type: ISOType
  contact_email: string
  contact_phone: string
  active_merchants: number
  monthly_volume: number
  commission_rate: number
  status: PartnerStatus
  joined_date: string
  notes?: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_PARTNERS: Partner[] = [
  {
    id: '1',
    name: 'Apex Payment Solutions',
    iso_type: 'ISO',
    contact_email: 'apex@payments.com',
    contact_phone: '+1 (305) 555-0101',
    active_merchants: 142,
    monthly_volume: 3_840_000,
    commission_rate: 1.2,
    status: 'active',
    joined_date: '2023-03-15',
    notes: 'Top performer — hospitality and retail focus',
  },
  {
    id: '2',
    name: 'BlueStar Merchant Services',
    iso_type: 'ISO',
    contact_email: 'partners@bluestar.io',
    contact_phone: '+1 (212) 555-0202',
    active_merchants: 98,
    monthly_volume: 2_210_000,
    commission_rate: 1.1,
    status: 'active',
    joined_date: '2023-06-01',
    notes: 'E-commerce and SaaS verticals',
  },
  {
    id: '3',
    name: 'Coastal ISO Group',
    iso_type: 'Sub-ISO',
    contact_email: 'coastal@iso.net',
    contact_phone: '+1 (786) 555-0303',
    active_merchants: 54,
    monthly_volume: 980_000,
    commission_rate: 0.9,
    status: 'active',
    joined_date: '2023-09-20',
  },
  {
    id: '4',
    name: 'Prime Agent Network',
    iso_type: 'Agent',
    contact_email: 'prime@agentnet.com',
    contact_phone: '+1 (646) 555-0404',
    active_merchants: 27,
    monthly_volume: 415_000,
    commission_rate: 0.75,
    status: 'active',
    joined_date: '2024-01-10',
  },
  {
    id: '5',
    name: 'Meridian Processing Partners',
    iso_type: 'Sub-ISO',
    contact_email: 'meridian@process.co',
    contact_phone: '+1 (617) 555-0505',
    active_merchants: 0,
    monthly_volume: 0,
    commission_rate: 1.0,
    status: 'pending',
    joined_date: '2024-05-18',
    notes: 'Onboarding — awaiting agreement execution',
  },
  {
    id: '6',
    name: 'Vanguard ISO Solutions',
    iso_type: 'ISO',
    contact_email: 'vanguard@iso.com',
    contact_phone: '+1 (310) 555-0606',
    active_merchants: 11,
    monthly_volume: 0,
    commission_rate: 1.15,
    status: 'suspended',
    joined_date: '2023-01-05',
    notes: 'Suspended pending compliance review — fee dispute',
  },
  {
    id: '7',
    name: 'Harbor Point Agents',
    iso_type: 'Agent',
    contact_email: 'harbor@points.net',
    contact_phone: '+1 (404) 555-0707',
    active_merchants: 31,
    monthly_volume: 520_000,
    commission_rate: 0.8,
    status: 'active',
    joined_date: '2024-02-28',
  },
]

// ─── Style constants ───────────────────────────────────────────────────────────

const CARD: React.CSSProperties = {
  backgroundColor: BRAND.card,
  border: `1px solid ${BRAND.border}`,
  borderRadius: 16,
}

const INPUT_STYLE: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.04)',
  border: `1px solid rgba(144,196,207,0.18)`,
  borderRadius: 10,
  color: BRAND.text,
  fontSize: 13,
  outline: 'none',
  padding: '9px 12px',
  width: '100%',
}

const LABEL_STYLE: React.CSSProperties = {
  color: `rgba(144,196,207,0.55)`,
  display: 'block',
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: '0.12em',
  marginBottom: 5,
  textTransform: 'uppercase',
}

// ─── Badge components ──────────────────────────────────────────────────────────

const ISO_META: Record<ISOType, { color: string; bg: string }> = {
  ISO:       { color: BRAND.cyan,    bg: 'rgba(144,196,207,0.12)' },
  'Sub-ISO': { color: '#90c4cf',     bg: 'rgba(144,196,207,0.10)' },
  Agent:     { color: BRAND.silver,  bg: 'rgba(201,209,217,0.10)' },
}

function ISOBadge({ type }: { type: ISOType }) {
  const m = ISO_META[type]
  return (
    <span style={{
      backgroundColor: m.bg, color: m.color,
      borderRadius: 20, fontSize: 10, fontWeight: 700,
      padding: '3px 8px', whiteSpace: 'nowrap',
    }}>
      {type}
    </span>
  )
}

const STATUS_META: Record<PartnerStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  active:    { label: 'Active',    color: BRAND.success, bg: 'rgba(61,214,140,0.10)', icon: <CheckCircle size={10} /> },
  pending:   { label: 'Pending',   color: BRAND.warn,    bg: 'rgba(240,178,62,0.10)', icon: <ChevronDown size={10} /> },
  suspended: { label: 'Suspended', color: BRAND.danger,  bg: 'rgba(232,80,74,0.10)',  icon: <AlertTriangle size={10} /> },
}

function StatusBadge({ status }: { status: PartnerStatus }) {
  const m = STATUS_META[status]
  return (
    <span style={{
      backgroundColor: m.bg, color: m.color,
      borderRadius: 20, fontSize: 10, fontWeight: 700,
      padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      {m.icon}{m.label}
    </span>
  )
}

// ─── Mini Bar Chart (top performers) ─────────────────────────────────────────

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div style={{ height: 6, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.06)', overflow: 'hidden', width: '100%' }}>
      <div style={{ height: '100%', width: `${pct}%`, borderRadius: 99, backgroundColor: color, transition: 'width 0.4s ease' }} />
    </div>
  )
}

// ─── Add Partner Modal ────────────────────────────────────────────────────────

function AddPartnerModal({ onClose, onAdded }: { onClose: () => void; onAdded: (p: Partner) => void }) {
  const [name, setName] = useState('')
  const [isoType, setIsoType] = useState<ISOType>('Agent')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [commission, setCommission] = useState('1.0')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  function handleAdd() {
    if (!name.trim()) { setError('Partner name is required'); return }
    if (!email.trim()) { setError('Contact email is required'); return }
    const newPartner: Partner = {
      id: String(Date.now()),
      name: name.trim(),
      iso_type: isoType,
      contact_email: email.trim(),
      contact_phone: phone.trim(),
      active_merchants: 0,
      monthly_volume: 0,
      commission_rate: parseFloat(commission) || 1.0,
      status: 'pending',
      joined_date: new Date().toISOString().slice(0, 10),
      notes: notes.trim() || undefined,
    }
    onAdded(newPartner)
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: 16,
    }}>
      <div style={{ ...CARD, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px', borderBottom: `1px solid ${BRAND.border}`,
          position: 'sticky', top: 0, backgroundColor: BRAND.card, zIndex: 10,
        }}>
          <div>
            <p style={{ color: BRAND.text, fontSize: 16, fontWeight: 700, margin: 0 }}>Add Partner / ISO</p>
            <p style={{ color: BRAND.muted, fontSize: 12, margin: '2px 0 0' }}>Register a new referral partner</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: BRAND.muted, fontSize: 20, lineHeight: 1 }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <span style={LABEL_STYLE}>Partner Name *</span>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Apex Payment Solutions" style={INPUT_STYLE} autoFocus />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <span style={LABEL_STYLE}>ISO Type *</span>
              <select value={isoType} onChange={e => setIsoType(e.target.value as ISOType)}
                style={{ ...INPUT_STYLE, appearance: 'none' as const }}>
                <option value="Agent">Agent</option>
                <option value="Sub-ISO">Sub-ISO</option>
                <option value="ISO">ISO</option>
              </select>
            </div>
            <div>
              <span style={LABEL_STYLE}>Commission Rate %</span>
              <input type="number" min="0" step="0.05" value={commission}
                onChange={e => setCommission(e.target.value)} style={INPUT_STYLE} />
            </div>
          </div>

          <div>
            <span style={LABEL_STYLE}>Contact Email *</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="partner@company.com" style={INPUT_STYLE} />
          </div>

          <div>
            <span style={LABEL_STYLE}>Contact Phone</span>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="+1 (305) 555-0000" style={INPUT_STYLE} />
          </div>

          <div>
            <span style={LABEL_STYLE}>Notes (optional)</span>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Verticals, territory, special terms…" rows={3}
              style={{ ...INPUT_STYLE, resize: 'vertical' as const }} />
          </div>

          {error && (
            <p style={{ fontSize: 12, color: BRAND.danger, margin: 0 }}>{error}</p>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              backgroundColor: 'transparent', border: `1px solid ${BRAND.border}`, color: BRAND.muted,
            }}>Cancel</button>
            <button onClick={handleAdd} style={{
              flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              backgroundColor: BRAND.cyan, color: '#1c1c1c', border: 'none',
            }}>Add Partner</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Action Menu ───────────────────────────────────────────────────────────────

function ActionMenu({ partner, onSuspend, onToast }: { partner: Partner; onSuspend: (id: string) => void; onToast: (msg: string) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(v => !v)} style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: 4,
        color: BRAND.muted, borderRadius: 6, display: 'flex', alignItems: 'center',
      }}>
        <MoreVertical size={14} />
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 30 }} />
          <div style={{
            position: 'absolute', right: 0, top: '100%', zIndex: 40, minWidth: 170,
            backgroundColor: '#282626', border: `1px solid ${BRAND.border}`,
            borderRadius: 10, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}>
            {[
              { label: 'View Profile',    icon: <UserCheck size={12} />, action: () => onToast('Partner profile — coming soon') },
              { label: 'Edit Commission', icon: <Edit2 size={12} />,    action: () => onToast('Commission editor — coming soon') },
              { label: 'Message Partner', icon: <Mail size={12} />,     action: () => onToast('Messaging — coming soon') },
            ].map(item => (
              <button key={item.label} onClick={() => { item.action(); setOpen(false) }} style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.75)', fontSize: 12, textAlign: 'left',
              }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {item.icon}{item.label}
              </button>
            ))}
            <div style={{ borderTop: `1px solid ${BRAND.border}` }} />
            <button onClick={() => { onSuspend(partner.id); setOpen(false) }} style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%',
              padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer',
              color: BRAND.danger, fontSize: 12, textAlign: 'left',
            }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(232,80,74,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <AlertTriangle size={12} />
              {partner.status === 'suspended' ? 'Reactivate' : 'Suspend'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ─── KPI Card ──────────────────────────────────────────────────────────────────

function KPICard({ label, value, sub, color, icon }: {
  label: string; value: string | number; sub?: string; color: string; icon: React.ReactNode
}) {
  return (
    <div style={{ ...CARD, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ color: BRAND.muted, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{label}</p>
        <span style={{ color }}>{icon}</span>
      </div>
      <p style={{ color, fontSize: 26, fontWeight: 800, margin: 0, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ color: BRAND.muted, fontSize: 11, margin: 0 }}>{sub}</p>}
    </div>
  )
}

// ─── Money formatter ──────────────────────────────────────────────────────────

function fmtMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

// ─── Export CSV ───────────────────────────────────────────────────────────────

function exportCSV(partners: Partner[]) {
  const headers = ['Name', 'ISO Type', 'Active Merchants', 'Monthly Volume', 'Commission %', 'Status', 'Joined']
  const rows = partners.map(p => [
    p.name, p.iso_type, p.active_merchants, p.monthly_volume, p.commission_rate, p.status, p.joined_date,
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'partners.csv'; a.click()
  URL.revokeObjectURL(url)
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PartnersTable() {
  const [partners, setPartners] = useState<Partner[]>(MOCK_PARTNERS)
  const [statusFilter, setStatusFilter] = useState<'all' | PartnerStatus>('all')
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const filtered = partners.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      p.name.toLowerCase().includes(q) ||
      p.iso_type.toLowerCase().includes(q) ||
      p.contact_email.toLowerCase().includes(q)
    )
  })

  const activeCount = partners.filter(p => p.status === 'active').length
  const pendingCount = partners.filter(p => p.status === 'pending').length
  const suspendedCount = partners.filter(p => p.status === 'suspended').length
  const totalReferrals = partners.reduce((s, p) => s + p.active_merchants, 0)
  const topPartner = [...partners].sort((a, b) => b.monthly_volume - a.monthly_volume)[0]
  const newThisMonth = partners.filter(p => {
    const d = new Date(p.joined_date)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const top3 = [...partners]
    .filter(p => p.status === 'active')
    .sort((a, b) => b.monthly_volume - a.monthly_volume)
    .slice(0, 3)
  const maxVol = top3[0]?.monthly_volume ?? 1

  function handleSuspend(id: string) {
    setPartners(prev => prev.map(p =>
      p.id === id ? { ...p, status: p.status === 'suspended' ? 'active' : 'suspended' } : p
    ))
  }

  const STATUS_TABS: { key: 'all' | PartnerStatus; label: string; count: number }[] = [
    { key: 'all',       label: 'All',       count: partners.length },
    { key: 'active',    label: 'Active',    count: activeCount },
    { key: 'pending',   label: 'Pending',   count: pendingCount },
    { key: 'suspended', label: 'Suspended', count: suspendedCount },
  ]

  return (
    <div style={{ padding: '28px 28px 64px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{
            margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-0.01em',
            background: 'linear-gradient(90deg, #C9D1D9 0%, #FFF 45%, #8A929C 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Partner / ISO Network
          </h1>
          <p style={{ color: BRAND.muted, fontSize: 13, margin: '4px 0 0' }}>
            Manage referral partners, ISOs, and sub-ISOs
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => exportCSV(filtered)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${BRAND.border}`, color: BRAND.muted,
          }}>
            <Download size={13} /> Export CSV
          </button>
          <button onClick={() => setShowAdd(true)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            backgroundColor: BRAND.cyan, border: 'none', color: '#1c1c1c',
          }}>
            <Plus size={13} /> Add Partner
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <KPICard label="Active Partners" value={activeCount} sub="currently active" color={BRAND.success} icon={<UserCheck size={16} />} />
        <KPICard label="New This Month" value={newThisMonth} sub="joined this month" color={BRAND.cyan} icon={<UserPlus size={16} />} />
        <KPICard label="Total Referrals" value={totalReferrals} sub="active merchants" color={BRAND.warn} icon={<TrendingUp size={16} />} />
        <KPICard
          label="Top Partner"
          value={topPartner?.name.split(' ')[0] ?? '—'}
          sub={topPartner ? fmtCurrency(topPartner.monthly_volume) + '/mo' : ''}
          color={BRAND.cyanBright}
          icon={<Star size={16} />}
        />
      </div>

      {/* Top Performers */}
      <div style={{ ...CARD, padding: 20, marginBottom: 28 }}>
        <p style={{ color: BRAND.muted, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 16px' }}>
          Top Performers — This Month
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {top3.map((p, i) => {
            const rankColors = [BRAND.warn, BRAND.silver, '#CD7F32']
            const c = rankColors[i] ?? BRAND.cyan
            return (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  backgroundColor: `${c}18`, color: c,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 800,
                }}>
                  #{i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                    <span style={{ color: BRAND.text, fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.name}
                    </span>
                    <span style={{ color: c, fontSize: 13, fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>
                      {fmtCurrency(p.monthly_volume)}
                    </span>
                  </div>
                  <MiniBar value={p.monthly_volume} max={maxVol} color={c} />
                </div>
                <ISOBadge type={p.iso_type} />
              </div>
            )
          })}
        </div>
      </div>

      {/* Filters + Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {/* Status tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${BRAND.border}`, paddingBottom: 0 }}>
          {STATUS_TABS.map(tab => (
            <button key={tab.key} onClick={() => setStatusFilter(tab.key)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '7px 12px', fontSize: 12, fontWeight: 600, borderRadius: 0,
              color: statusFilter === tab.key ? BRAND.cyan : BRAND.muted,
              borderBottom: statusFilter === tab.key ? `2px solid ${BRAND.cyan}` : '2px solid transparent',
              transition: 'color 0.15s',
            }}>
              {tab.label} <span style={{ opacity: 0.55 }}>({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={13} style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: `rgba(144,196,207,0.5)`, pointerEvents: 'none',
          }} />
          <input
            type="text" placeholder="Search by name, type, email…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...INPUT_STYLE, paddingLeft: 34, paddingRight: search ? 34 : 12 }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: BRAND.muted,
            }}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Card Grid */}
      {filtered.length === 0 ? (
        <div style={{ ...CARD, padding: '48px 0', textAlign: 'center', color: BRAND.muted, fontSize: 13 }}>
          No partners match your filters.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map(p => (
            <div key={p.id} style={{ ...CARD, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(144,196,207,0.28)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = BRAND.border)}
            >
              {/* Name row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ color: BRAND.text, fontSize: 14, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{p.name}</p>
                  <p style={{ color: BRAND.muted, fontSize: 11, margin: '3px 0 0' }}>{p.contact_email}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <ISOBadge type={p.iso_type} />
                  <ActionMenu partner={p} onSuspend={handleSuspend} onToast={showToast} />
                </div>
              </div>

              {/* Status */}
              <StatusBadge status={p.status} />

              {/* Metrics row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Merchants',       value: String(p.active_merchants), color: BRAND.text },
                  { label: 'Volume/Mo',        value: p.monthly_volume > 0 ? fmtCurrency(p.monthly_volume) : '—', color: BRAND.cyan },
                  { label: 'Commission %',     value: `${p.commission_rate}%`, color: BRAND.silver },
                  { label: 'Est. Commission',  value: p.monthly_volume > 0 ? fmtMoney(p.monthly_volume * p.commission_rate / 100) : '—', color: BRAND.success },
                ].map(m => (
                  <div key={m.label} style={{
                    backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${BRAND.border}`,
                    borderRadius: 10, padding: '8px 10px',
                  }}>
                    <p style={{ color: BRAND.muted, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 3px' }}>{m.label}</p>
                    <p style={{ color: m.color, fontSize: 13, fontWeight: 700, margin: 0 }}>{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Notes */}
              {p.notes && (
                <p style={{ color: BRAND.muted, fontSize: 11, fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>{p.notes}</p>
              )}

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: `1px solid ${BRAND.border}` }}>
                <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, margin: 0 }}>
                  Joined {fmtDate(p.joined_date)}
                </p>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => showToast('Partner messaging — coming soon')} style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '5px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${BRAND.border}`, color: BRAND.muted,
                  }}>
                    <Mail size={10} /> Message
                  </button>
                  <button onClick={() => showToast('Partner management — coming soon')} style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '5px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    backgroundColor: `rgba(144,196,207,0.1)`, border: `1px solid rgba(144,196,207,0.25)`, color: BRAND.cyan,
                  }}>
                    Manage
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <AddPartnerModal
          onClose={() => setShowAdd(false)}
          onAdded={p => setPartners(prev => [p, ...prev])}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl text-sm font-semibold shadow-lg"
          style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.borderCyan}`, color: BRAND.cyan }}>
          {toast}
        </div>
      )}
    </div>
  )
}
