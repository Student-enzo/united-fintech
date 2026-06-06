'use client'

import { useEffect, useState } from 'react'
import { BRAND } from '@/lib/brand'
import { useColors } from '@/lib/theme'
import { supabase } from '@/lib/supabase'

type PartnerType = 'bank' | 'processor' | 'gateway'
type RiskAppetite = 'low' | 'medium' | 'high'
type FilterType = 'all' | PartnerType | RiskAppetite

interface Partner {
  id: string
  name: string
  type: PartnerType
  risk_appetite: RiskAppetite
  accepted_mcc_codes: string[]
  training_notes: string | null
  contact_email: string | null
  contact_name: string | null
  is_active: boolean
  created_at: string
}

const MOCK_PARTNERS: Partner[] = [
  {
    id: '1', name: 'Chase Paymentech', type: 'bank', risk_appetite: 'low',
    accepted_mcc_codes: [], training_notes: 'Ideal for established retail and restaurants, minimum 2 years in business, strict on chargebacks above 0.5%, requires 6 months bank statements',
    contact_email: 'iso@chasepaymentech.com', contact_name: null, is_active: true, created_at: new Date().toISOString(),
  },
  {
    id: '2', name: 'Global Payments', type: 'processor', risk_appetite: 'medium',
    accepted_mcc_codes: [], training_notes: 'Good for e-commerce and SaaS, accepts subscription models, typically requires rolling reserve for merchants under 1 year old',
    contact_email: 'iso@globalpayments.com', contact_name: null, is_active: true, created_at: new Date().toISOString(),
  },
  {
    id: '3', name: 'Paya', type: 'processor', risk_appetite: 'medium',
    accepted_mcc_codes: [], training_notes: 'Specializes in healthcare and B2B, ACH processing strong suit, good for recurring billing',
    contact_email: 'iso@paya.com', contact_name: null, is_active: true, created_at: new Date().toISOString(),
  },
]

const FILTER_PILLS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Banks', value: 'bank' },
  { label: 'Processors', value: 'processor' },
  { label: 'Gateways', value: 'gateway' },
  { label: 'Low Risk', value: 'low' },
  { label: 'Medium Risk', value: 'medium' },
  { label: 'High Risk', value: 'high' },
]

const TYPE_LABELS: Record<PartnerType, string> = { bank: 'Bank', processor: 'Processor', gateway: 'Gateway' }
const RISK_COLORS: Record<RiskAppetite, string> = { low: BRAND.success, medium: BRAND.warn, high: '#F97316' }

const EMPTY_FORM = {
  name: '', type: 'processor' as PartnerType, risk_appetite: 'medium' as RiskAppetite,
  accepted_mcc_codes: '', training_notes: '', contact_name: '', contact_email: '', is_active: true,
}

export default function PartnersPage() {
  const c = useColors()
  const [partners, setPartners] = useState<Partner[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<Partner | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchPartners() }, [])

  async function fetchPartners() {
    setLoading(true)
    const { data, error } = await supabase.from('partner_directory').select('*').order('name')
    setPartners(data && !error ? (data as Partner[]) : MOCK_PARTNERS)
    setLoading(false)
  }

  function openAdd() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setDrawerOpen(true)
  }

  function openEdit(p: Partner) {
    setEditing(p)
    setForm({
      name: p.name, type: p.type, risk_appetite: p.risk_appetite,
      accepted_mcc_codes: (p.accepted_mcc_codes || []).join(', '),
      training_notes: p.training_notes || '', contact_name: p.contact_name || '',
      contact_email: p.contact_email || '', is_active: p.is_active,
    })
    setDrawerOpen(true)
  }

  async function handleSave() {
    if (!form.name.trim()) return
    setSaving(true)
    const payload = {
      name: form.name.trim(), type: form.type, risk_appetite: form.risk_appetite,
      accepted_mcc_codes: form.accepted_mcc_codes ? form.accepted_mcc_codes.split(',').map(s => s.trim()).filter(Boolean) : [],
      training_notes: form.training_notes.trim() || null,
      contact_name: form.contact_name.trim() || null,
      contact_email: form.contact_email.trim() || null,
      is_active: form.is_active,
    }
    if (editing) {
      await supabase.from('partner_directory').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing.id)
    } else {
      await supabase.from('partner_directory').insert(payload)
    }
    setSaving(false)
    setDrawerOpen(false)
    fetchPartners()
  }

  async function toggleActive(p: Partner) {
    await supabase.from('partner_directory').update({ is_active: !p.is_active }).eq('id', p.id)
    setPartners(prev => prev.map(x => x.id === p.id ? { ...x, is_active: !x.is_active } : x))
  }

  const filtered = partners.filter(p => {
    if (filter === 'all') return true
    if (['bank', 'processor', 'gateway'].includes(filter)) return p.type === filter
    if (['low', 'medium', 'high'].includes(filter)) return p.risk_appetite === filter
    return true
  })

  return (
    <div style={{ minHeight: '100vh', background: BRAND.bg, padding: '32px 24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', color: BRAND.silver, textTransform: 'uppercase' }}>
              Partner Directory
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: BRAND.muted }}>
              Training notes teach the AI who to recommend
            </p>
          </div>
          <button onClick={openAdd} style={{
            background: BRAND.cyan, color: BRAND.bg, border: 'none', borderRadius: 8,
            padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.04em',
          }}>
            + Add Partner
          </button>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {FILTER_PILLS.map(pill => (
            <button key={pill.value} onClick={() => setFilter(pill.value)} style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer',
              border: `1px solid ${filter === pill.value ? BRAND.cyan : BRAND.border}`,
              background: filter === pill.value ? `${BRAND.cyan}22` : 'transparent',
              color: filter === pill.value ? BRAND.cyan : BRAND.silverLo,
              transition: 'all 0.15s',
            }}>
              {pill.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: BRAND.muted, fontSize: 14 }}>Loading partners...</div>
        ) : filtered.length === 0 ? (
          <EmptyState onAdd={openAdd} hasFilter={filter !== 'all'} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {filtered.map(p => (
              <PartnerCard key={p.id} partner={p} onEdit={() => openEdit(p)} onToggle={() => toggleActive(p)} />
            ))}
          </div>
        )}
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <Drawer
          editing={editing}
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onClose={() => setDrawerOpen(false)}
          saving={saving}
        />
      )}
    </div>
  )
}

function PartnerCard({ partner: p, onEdit, onToggle }: { partner: Partner; onEdit: () => void; onToggle: () => void }) {
  const notes = p.training_notes || ''
  const preview = notes.length > 120 ? notes.slice(0, 120) + '...' : notes

  return (
    <div style={{
      background: BRAND.card, border: `1px solid ${BRAND.border}`, borderRadius: 12,
      padding: 20, opacity: p.is_active ? 1 : 0.55, transition: 'opacity 0.2s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: BRAND.silver, flex: 1, marginRight: 8 }}>{p.name}</span>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <span style={{
            width: 36, height: 20, borderRadius: 10, position: 'relative', display: 'inline-block',
            background: p.is_active ? BRAND.cyan : BRAND.silverLo, transition: 'background 0.2s',
          }}>
            <span style={{
              position: 'absolute', top: 2, left: p.is_active ? 18 : 2, width: 16, height: 16,
              borderRadius: '50%', background: '#fff', transition: 'left 0.2s',
            }} />
          </span>
          <input type="checkbox" checked={p.is_active} onChange={onToggle} style={{ display: 'none' }} />
        </label>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600, letterSpacing: '0.05em',
          background: `${BRAND.cyan}22`, color: BRAND.cyan, border: `1px solid ${BRAND.borderCyan}`,
        }}>
          {TYPE_LABELS[p.type]}
        </span>
        <span style={{
          fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600,
          background: `${RISK_COLORS[p.risk_appetite]}22`, color: RISK_COLORS[p.risk_appetite],
          border: `1px solid ${RISK_COLORS[p.risk_appetite]}44`,
        }}>
          {p.risk_appetite.charAt(0).toUpperCase() + p.risk_appetite.slice(1)} Risk
        </span>
      </div>

      {p.contact_email && (
        <div style={{ fontSize: 12, color: BRAND.muted, marginBottom: 10 }}>{p.contact_email}</div>
      )}

      {preview ? (
        <div style={{
          fontSize: 12, color: BRAND.silverLo, lineHeight: 1.5, marginBottom: 14,
          padding: '8px 10px', background: 'rgba(144,196,207,0.05)', borderRadius: 6,
          borderLeft: `2px solid ${BRAND.borderCyan}`,
        }}>
          {preview}
        </div>
      ) : (
        <div style={{ fontSize: 12, color: BRAND.muted, fontStyle: 'italic', marginBottom: 14 }}>
          No training notes yet — add them so the AI can make recommendations.
        </div>
      )}

      <button onClick={onEdit} style={{
        background: 'transparent', border: `1px solid ${BRAND.borderCyan}`, borderRadius: 6,
        padding: '7px 16px', fontSize: 12, fontWeight: 600, color: BRAND.cyan, cursor: 'pointer',
        width: '100%', transition: 'background 0.15s',
      }}
        onMouseEnter={e => (e.currentTarget.style.background = `${BRAND.cyan}15`)}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        Edit
      </button>
    </div>
  )
}

function EmptyState({ onAdd, hasFilter }: { onAdd: () => void; hasFilter: boolean }) {
  return (
    <div style={{
      textAlign: 'center', padding: '80px 24px', border: `1px dashed ${BRAND.border}`,
      borderRadius: 12, background: BRAND.card,
    }}>
      <div style={{ fontSize: 36, marginBottom: 16 }}>🏦</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: BRAND.silver, marginBottom: 8 }}>
        {hasFilter ? 'No partners match this filter' : 'No partners yet'}
      </div>
      <div style={{ fontSize: 13, color: BRAND.muted, marginBottom: 24, maxWidth: 380, margin: '0 auto 24px' }}>
        {hasFilter
          ? 'Try a different filter or add a new partner.'
          : 'Add banks, processors, and gateways. The AI reads their training notes to make smart onboarding recommendations.'}
      </div>
      {!hasFilter && (
        <button onClick={onAdd} style={{
          background: BRAND.cyan, color: BRAND.bg, border: 'none', borderRadius: 8,
          padding: '10px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>
          Add First Partner
        </button>
      )}
    </div>
  )
}

function Drawer({
  editing, form, setForm, onSave, onClose, saving,
}: {
  editing: Partner | null
  form: typeof EMPTY_FORM
  setForm: React.Dispatch<React.SetStateAction<typeof EMPTY_FORM>>
  onSave: () => void
  onClose: () => void
  saving: boolean
}) {
  const set = (key: keyof typeof EMPTY_FORM, val: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: val }))

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${BRAND.border}`,
    borderRadius: 8, padding: '9px 12px', fontSize: 13, color: BRAND.silver,
    outline: 'none', boxSizing: 'border-box' as const,
  }
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, color: BRAND.silverLo, marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' as const }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 480, background: BRAND.card,
        borderLeft: `1px solid ${BRAND.border}`, zIndex: 50, overflowY: 'auto', padding: 28,
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: BRAND.silver, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {editing ? 'Edit Partner' : 'Add Partner'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: BRAND.muted, fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        <div>
          <label style={labelStyle}>Name *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} style={inputStyle} placeholder="e.g. Chase Paymentech" />
        </div>

        <div>
          <label style={labelStyle}>Type</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {(['bank', 'processor', 'gateway'] as PartnerType[]).map(t => (
              <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: form.type === t ? BRAND.cyan : BRAND.silverLo }}>
                <input type="radio" name="type" value={t} checked={form.type === t} onChange={() => set('type', t)} style={{ accentColor: BRAND.cyan }} />
                {TYPE_LABELS[t]}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Risk Appetite</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {(['low', 'medium', 'high'] as RiskAppetite[]).map(r => (
              <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: form.risk_appetite === r ? RISK_COLORS[r] : BRAND.silverLo }}>
                <input type="radio" name="risk" value={r} checked={form.risk_appetite === r} onChange={() => set('risk_appetite', r)} style={{ accentColor: RISK_COLORS[r] }} />
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Accepted MCC Codes (comma-separated, optional)</label>
          <input value={form.accepted_mcc_codes} onChange={e => set('accepted_mcc_codes', e.target.value)} style={inputStyle} placeholder="e.g. 5812, 5411, 7011" />
        </div>

        <div>
          <label style={labelStyle}>Contact Name</label>
          <input value={form.contact_name} onChange={e => set('contact_name', e.target.value)} style={inputStyle} placeholder="ISO manager name" />
        </div>

        <div>
          <label style={labelStyle}>Contact Email</label>
          <input type="email" value={form.contact_email} onChange={e => set('contact_email', e.target.value)} style={inputStyle} placeholder="iso@partner.com" />
        </div>

        <div>
          <label style={labelStyle}>Training Notes — The AI reads these to decide who to recommend</label>
          <textarea
            value={form.training_notes}
            onChange={e => set('training_notes', e.target.value)}
            rows={5}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
            placeholder="e.g. Loves established retail and restaurants. Strict on chargebacks above 0.5%. Requires 6 months bank statements. Won't touch CBD or adult content."
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 10 }}>
            <span style={{
              width: 40, height: 22, borderRadius: 11, position: 'relative', display: 'inline-block',
              background: form.is_active ? BRAND.cyan : BRAND.silverLo, transition: 'background 0.2s',
            }}>
              <span style={{
                position: 'absolute', top: 3, left: form.is_active ? 20 : 3, width: 16, height: 16,
                borderRadius: '50%', background: '#fff', transition: 'left 0.2s',
              }} />
            </span>
            <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} style={{ display: 'none' }} />
            <span style={{ fontSize: 13, color: BRAND.silverLo }}>Active</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button onClick={onSave} disabled={saving || !form.name.trim()} style={{
            flex: 1, background: BRAND.cyan, color: BRAND.bg, border: 'none', borderRadius: 8,
            padding: '11px 0', fontSize: 13, fontWeight: 700, cursor: saving ? 'wait' : 'pointer',
            opacity: !form.name.trim() ? 0.5 : 1,
          }}>
            {saving ? 'Saving...' : 'Save Partner'}
          </button>
          <button onClick={onClose} style={{
            flex: 1, background: 'transparent', color: BRAND.silverLo, border: `1px solid ${BRAND.border}`,
            borderRadius: 8, padding: '11px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}
