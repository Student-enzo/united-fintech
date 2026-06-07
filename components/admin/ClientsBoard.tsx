'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, X, AlertCircle } from 'lucide-react'
import { BRAND } from '@/lib/brand'
import { fetchClients, insertClient } from '@/lib/clients-db'
import type { Client, CrmStage } from '@/types/clients'
import { CRM_STAGE_META } from '@/types/clients'
import MerchantTabNav from '@/components/admin/MerchantTabNav'

// ─── Constants ───────────────────────────────────────────────────────────────

const ONBOARDING_STAGES = ['underwriting', 'account_activated']
const PAST_PROPOSAL_STAGES = ['proposal_sent', 'agreement_sent', 'agreement_signed', 'setup_fee_paid', 'underwriting', 'account_activated', 'merchant_live']
const CRM_COLUMNS: CrmStage[] = ['prospect', 'in_conversation', 'documents_in', 'processing', 'live_partner']

// ─── Helpers ─────────────────────────────────────────────────────────────────

function daysSince(dateStr: string): number {
  const added = new Date(dateStr).getTime()
  const now = Date.now()
  return Math.floor((now - added) / (1000 * 60 * 60 * 24))
}

function dayChipStyle(days: number): { bg: string; color: string } {
  if (days <= 7) return { bg: 'rgba(144,196,207,0.10)', color: BRAND.cyan }
  if (days <= 14) return { bg: 'rgba(240,178,62,0.15)', color: BRAND.warn }
  return { bg: 'rgba(232,80,74,0.15)', color: BRAND.danger }
}

// ─── ClientCard ───────────────────────────────────────────────────────────────

function ClientCard({ client, onClick }: { client: Client; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  const accounts = client.merchant_accounts ?? []
  const total = accounts.length
  const pastProposal = accounts.filter(a => PAST_PROPOSAL_STAGES.includes(a.pipeline_stage)).length
  const progressPct = total > 0 ? (pastProposal / total) * 100 : 0
  const days = daysSince(client.date_added)
  const chip = dayChipStyle(days)
  const hasStalled = accounts.some(a => a.pipeline_stage !== 'declined' && a.days_in_stage > 14)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: BRAND.card,
        border: `1px solid ${hovered ? 'rgba(144,196,207,0.30)' : BRAND.border}`,
        borderRadius: 10,
        padding: '14px 16px',
        marginBottom: 8,
        cursor: 'pointer',
        boxShadow: hovered ? '0 0 18px rgba(144,196,207,0.12)' : 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
    >
      {/* Row 1: Company name + stalled dot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: BRAND.silver }}>
          {client.name}
        </span>
        {hasStalled && (
          <span
            title="One or more accounts stalled (14+ days)"
            style={{
              display:         'inline-block',
              width:           7,
              height:          7,
              borderRadius:    '50%',
              backgroundColor: BRAND.warn,
              flexShrink:      0,
              boxShadow:       `0 0 5px ${BRAND.warn}88`,
            }}
          />
        )}
      </div>

      {/* Row 2: Contact name */}
      <div style={{ fontSize: 12, color: BRAND.muted, marginBottom: 8 }}>
        {client.contact_name ?? '—'}
      </div>

      {/* Row 3: Account progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: BRAND.muted }}>
          {total} account{total !== 1 ? 's' : ''}
        </span>
        <div
          style={{
            width: 80, height: 3,
            backgroundColor: 'rgba(255,255,255,0.06)',
            borderRadius: 4, overflow: 'hidden', flex: '0 0 80px',
          }}
        >
          <div
            style={{
              width: `${progressPct}%`,
              height: '100%',
              backgroundColor: BRAND.cyan,
              borderRadius: 4,
              transition: 'width 0.3s',
            }}
          />
        </div>
      </div>

      {/* Row 4: Partner + days chip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: BRAND.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
          {client.partner ?? '—'}
        </span>
        <span style={{
          fontSize: 10,
          fontWeight: 600,
          padding: '2px 7px',
          borderRadius: 999,
          backgroundColor: chip.bg,
          color: chip.color,
          whiteSpace: 'nowrap',
        }}>
          {days}d
        </span>
      </div>
    </div>
  )
}

// ─── NewClientDrawer ──────────────────────────────────────────────────────────

interface DrawerProps {
  open: boolean
  onClose: () => void
  onCreated: (client: Client) => void
}

function NewClientDrawer({ open, onClose, onCreated }: DrawerProps) {
  const [name, setName] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [legalStructure, setLegalStructure] = useState('')
  const [partner, setPartner] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function reset() {
    setName(''); setContactName(''); setContactEmail('')
    setContactPhone(''); setLegalStructure(''); setPartner('')
    setError(null)
  }

  function handleClose() { reset(); onClose() }

  async function handleSubmit() {
    if (!name.trim()) { setError('Company name is required.'); return }
    setSaving(true); setError(null)
    try {
      const today = new Date().toISOString().slice(0, 10)
      const created = await insertClient({
        name: name.trim(),
        contact_name: contactName || undefined,
        contact_email: contactEmail || undefined,
        contact_phone: contactPhone || undefined,
        legal_structure: legalStructure || undefined,
        partner: partner || undefined,
        crm_stage: 'prospect',
        date_added: today,
      })
      reset()
      onCreated(created)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add client.')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: `1px solid ${BRAND.border}`,
    borderRadius: 8,
    padding: '10px 12px',
    fontSize: 13,
    color: BRAND.text,
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    color: BRAND.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 6,
    display: 'block',
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 99,
        }}
      />
      {/* Drawer */}
      <div style={{
        position: 'fixed', right: 0, top: 0,
        height: '100vh', width: 420,
        backgroundColor: BRAND.card,
        borderLeft: `1px solid ${BRAND.border}`,
        zIndex: 100,
        padding: 32,
        display: 'flex', flexDirection: 'column', gap: 20,
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: BRAND.silver }}>
            New Client
          </span>
          <button
            onClick={handleClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: BRAND.muted, padding: 4, display: 'flex', alignItems: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            backgroundColor: 'rgba(232,80,74,0.12)',
            border: '1px solid rgba(232,80,74,0.25)',
            borderRadius: 8, padding: '10px 14px',
            color: BRAND.danger, fontSize: 12,
          }}>
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        {/* Fields */}
        {([
          { lbl: 'Company Name *', val: name,          set: setName,          ph: 'e.g. Suncoast Retail Group' },
          { lbl: 'Contact Name',   val: contactName,   set: setContactName,   ph: 'e.g. Jane Smith' },
          { lbl: 'Contact Email',  val: contactEmail,  set: setContactEmail,  ph: 'jane@company.com', type: 'email' },
          { lbl: 'Contact Phone',  val: contactPhone,  set: setContactPhone,  ph: '555-123-4567' },
          { lbl: 'Partner',        val: partner,        set: setPartner,       ph: 'e.g. First Capital ISO' },
        ] as { lbl: string; val: string; set: (v: string) => void; ph: string; type?: string }[]).map(f => (
          <div key={f.lbl}>
            <label style={labelStyle}>{f.lbl}</label>
            <input style={inputStyle} type={f.type ?? 'text'} value={f.val}
              onChange={e => f.set(e.target.value)} placeholder={f.ph} />
          </div>
        ))}

        <div>
          <label style={labelStyle}>Legal Structure</label>
          <select style={{ ...inputStyle, cursor: 'pointer' }} value={legalStructure} onChange={e => setLegalStructure(e.target.value)}>
            <option value="">Select structure...</option>
            {['LLC', 'C-Corp', 'S-Corp', 'Partnership', 'Sole Prop'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={saving}
          style={{
            marginTop: 'auto',
            backgroundColor: saving ? 'rgba(144,196,207,0.4)' : BRAND.cyan,
            color: '#0f0f0f',
            border: 'none',
            borderRadius: 8,
            padding: '12px 20px',
            fontSize: 13,
            fontWeight: 700,
            cursor: saving ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'background-color 0.15s',
          }}
        >
          <Plus size={15} />
          {saving ? 'Adding...' : 'Add Client'}
        </button>
      </div>
    </>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ClientsBoard() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [search, setSearch] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    fetchClients()
      .then(setClients)
      .catch(err => {
        console.error(err)
        setErrorMsg('Failed to load clients. Showing cached data.')
      })
  }, [])

  // Derived counts for tab nav
  const onboardingCount = clients.filter(c =>
    c.merchant_accounts?.some(a => ONBOARDING_STAGES.includes(a.pipeline_stage))
  ).length

  const liveCount = clients.filter(c =>
    c.merchant_accounts?.some(a => a.pipeline_stage === 'merchant_live')
  ).length

  // Filtered list
  const filtered = search.trim()
    ? clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : clients

  // Group by CRM stage
  function clientsForStage(stage: CrmStage): Client[] {
    return filtered.filter(c => c.crm_stage === stage)
  }

  function handleCardClick(client: Client) {
    router.push(`/admin/merchants/${client.id}`)
  }

  function handleClientCreated(client: Client) {
    setClients(prev => [client, ...prev])
    setDrawerOpen(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Tab nav */}
      <MerchantTabNav
        active="all"
        counts={{ all: clients.length, onboarding: onboardingCount, live: liveCount }}
      />

      {/* Error banner */}
      {errorMsg && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          backgroundColor: 'rgba(232,80,74,0.10)',
          border: '1px solid rgba(232,80,74,0.22)',
          borderRadius: 8, padding: '10px 14px',
          color: BRAND.danger, fontSize: 12, marginBottom: 20,
        }}>
          <AlertCircle size={14} />
          {errorMsg}
        </div>
      )}

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24,
      }}>
        {/* Search */}
        <div style={{ position: 'relative', width: 260 }}>
          <Search
            size={14}
            style={{
              position: 'absolute', left: 10, top: '50%',
              transform: 'translateY(-50%)', color: BRAND.muted, pointerEvents: 'none',
            }}
          />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clients..."
            style={{
              width: '100%',
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: `1px solid ${BRAND.border}`,
              borderRadius: 8,
              padding: '9px 12px 9px 32px',
              fontSize: 13,
              color: BRAND.text,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute', right: 8, top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: BRAND.muted, display: 'flex', alignItems: 'center', padding: 0,
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* New Client button */}
        <button
          onClick={() => setDrawerOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            backgroundColor: BRAND.cyan,
            color: '#0f0f0f',
            border: 'none',
            borderRadius: 8,
            padding: '9px 16px',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <Plus size={15} />
          New Client
        </button>
      </div>

      {/* Kanban columns */}
      <div style={{
        display: 'flex', gap: 16,
        overflowX: 'auto', paddingBottom: 16,
        flex: 1,
      }}>
        {CRM_COLUMNS.map(stage => {
          const meta = CRM_STAGE_META[stage]
          const stageClients = clientsForStage(stage)
          return (
            <div
              key={stage}
              style={{
                minWidth: 240, flex: '0 0 240px',
                display: 'flex', flexDirection: 'column',
              }}
            >
              {/* Column header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                marginBottom: 12,
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.10em',
                  textTransform: 'uppercase', color: meta.color,
                }}>
                  {meta.label}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  padding: '2px 7px', borderRadius: 999,
                  backgroundColor: 'rgba(144,196,207,0.15)',
                  color: BRAND.cyan,
                }}>
                  {stageClients.length}
                </span>
              </div>

              {/* Card list */}
              <div style={{
                maxHeight: 'calc(100vh - 280px)',
                overflowY: 'auto',
                paddingRight: 2,
              }}>
                {stageClients.length === 0 ? (
                  <div style={{
                    fontSize: 11, color: BRAND.muted, textAlign: 'center',
                    paddingTop: 24, fontStyle: 'italic',
                  }}>
                    No clients
                  </div>
                ) : (
                  stageClients.map(client => (
                    <ClientCard
                      key={client.id}
                      client={client}
                      onClick={() => handleCardClick(client)}
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* New Client Drawer */}
      <NewClientDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onCreated={handleClientCreated}
      />
    </div>
  )
}
