'use client'

import { useRouter } from 'next/navigation'
import { Clock, ArrowRight, Building2 } from 'lucide-react'
import { BRAND } from '@/lib/brand'
import MerchantTabNav from '@/components/admin/MerchantTabNav'
import type { MerchantRecord, PipelineStage, AccountType } from '@/components/admin/ManageMerchantDrawer'

// ─── Mock data (local copy — do not import from MerchantsBoard) ───────────────

const MOCK_MERCHANTS: MerchantRecord[] = [
  { id: 'm-001', name: 'Suncoast Retail Group',    dba_name: 'Suncoast Shops',    mcc: '5411', mcc_label: 'Grocery Stores',                      legal_structure: 'LLC',         account_type: 'Card Present', monthly_volume: 385000, avg_ticket: 62,   card_present_pct: 94, partner: 'First Capital ISO',  partner_iso: 'FC-ISO', pipeline_stage: 'merchant_live',     days_in_stage: 42, date_added: '2025-11-14', notes: 'Multi-location grocery chain, flagship account', risk: 'low' },
  { id: 'm-002', name: 'BluePeak eCommerce LLC',   dba_name: 'BluePeak Store',    mcc: '5999', mcc_label: 'Retail Stores, NEC',                  legal_structure: 'LLC',         account_type: 'eCommerce',    monthly_volume: 210000, avg_ticket: 128,  card_present_pct: 0,  partner: 'Meridian Partners',  partner_iso: 'MP-001', pipeline_stage: 'account_activated', days_in_stage: 11, date_added: '2026-01-03', risk: 'low' },
  { id: 'm-003', name: 'Atlas Medical Supplies',   dba_name: undefined,           mcc: '5047', mcc_label: 'Medical & Hospital Equipment',         legal_structure: 'C-Corp',      account_type: 'MOTO',         monthly_volume: 95000,  avg_ticket: 310,  card_present_pct: 10, partner: 'HealthPay ISO',      partner_iso: 'HP-ISO', pipeline_stage: 'underwriting',      days_in_stage: 7,  date_added: '2026-02-18', notes: 'Requires enhanced underwriting — DME category', risk: 'medium' },
  { id: 'm-004', name: 'NovaBrew Coffee Co.',      dba_name: 'NovaBrew',          mcc: '5812', mcc_label: 'Eating Places & Restaurants',          legal_structure: 'S-Corp',      account_type: 'Card Present', monthly_volume: 52000,  avg_ticket: 18,   card_present_pct: 98, partner: 'First Capital ISO',  partner_iso: 'FC-ISO', pipeline_stage: 'setup_fee_paid',    days_in_stage: 3,  date_added: '2026-03-05', risk: 'low' },
  { id: 'm-005', name: 'PrimeAuto Finance',        dba_name: undefined,           mcc: '5511', mcc_label: 'Auto Dealers - New & Used',            legal_structure: 'LLC',         account_type: 'Card Present', monthly_volume: 720000, avg_ticket: 4200, card_present_pct: 75, partner: 'Velocity ISO Group', partner_iso: 'VG-ISO', pipeline_stage: 'agreement_signed',  days_in_stage: 5,  date_added: '2026-03-12', notes: 'High ticket — needs VP approval', risk: 'medium' },
  { id: 'm-006', name: 'ClearView Law Group',      dba_name: undefined,           mcc: '8111', mcc_label: 'Legal Services',                      legal_structure: 'Partnership', account_type: 'MOTO',         monthly_volume: 68000,  avg_ticket: 850,  card_present_pct: 5,  partner: 'Meridian Partners',  partner_iso: 'MP-001', pipeline_stage: 'agreement_sent',    days_in_stage: 9,  date_added: '2026-03-20', risk: 'low' },
  { id: 'm-007', name: 'Apex Fitness Studios',     dba_name: 'Apex Fit',          mcc: '7997', mcc_label: 'Membership Sports & Recreation Clubs', legal_structure: 'LLC',         account_type: 'Card Present', monthly_volume: 41000,  avg_ticket: 55,   card_present_pct: 88, partner: 'First Capital ISO',  partner_iso: 'FC-ISO', pipeline_stage: 'proposal_sent',     days_in_stage: 14, date_added: '2026-04-01', risk: 'low' },
  { id: 'm-008', name: 'OceanTech Imports',        dba_name: undefined,           mcc: '5065', mcc_label: 'Electrical Parts & Equipment',         legal_structure: 'C-Corp',      account_type: 'eCommerce',    monthly_volume: 155000, avg_ticket: 240,  card_present_pct: 0,  partner: 'Velocity ISO Group', partner_iso: 'VG-ISO', pipeline_stage: 'lead_identified',   days_in_stage: 2,  date_added: '2026-04-10', risk: 'medium' },
  { id: 'm-009', name: 'Harborside Hospitality',   dba_name: 'Harborside Hotels', mcc: '7011', mcc_label: 'Hotels & Motels',                     legal_structure: 'LLC',         account_type: 'Card Present', monthly_volume: 490000, avg_ticket: 195,  card_present_pct: 82, partner: 'Meridian Partners',  partner_iso: 'MP-001', pipeline_stage: 'merchant_live',     days_in_stage: 88, date_added: '2025-09-30', risk: 'low' },
  { id: 'm-010', name: 'RedLine Logistics Inc.',   dba_name: undefined,           mcc: '4215', mcc_label: 'Courier Services',                    legal_structure: 'C-Corp',      account_type: 'ACH',          monthly_volume: 320000, avg_ticket: 1100, card_present_pct: 0,  partner: 'HealthPay ISO',      partner_iso: 'HP-ISO', pipeline_stage: 'underwriting',      days_in_stage: 12, date_added: '2026-02-28', notes: 'ACH debit — fleet billing model', risk: 'medium' },
  { id: 'm-011', name: 'StarPath Education',       dba_name: 'StarPath Online',   mcc: '8299', mcc_label: 'Schools & Educational Services',      legal_structure: 'S-Corp',      account_type: 'eCommerce',    monthly_volume: 78000,  avg_ticket: 299,  card_present_pct: 0,  partner: 'First Capital ISO',  partner_iso: 'FC-ISO', pipeline_stage: 'proposal_sent',     days_in_stage: 6,  date_added: '2026-04-05', risk: 'low' },
  { id: 'm-012', name: 'TerraVerde Cannabis Dist.',dba_name: 'TerraVerde',        mcc: '5912', mcc_label: 'Drug Stores & Pharmacies',            legal_structure: 'LLC',         account_type: 'Card Present', monthly_volume: 165000, avg_ticket: 72,   card_present_pct: 95, partner: 'Velocity ISO Group', partner_iso: 'VG-ISO', pipeline_stage: 'declined',          days_in_stage: 0,  date_added: '2026-03-01', notes: 'Declined — prohibited MCC in processing network', risk: 'high' },
]

// ─── Stage config (onboarding stages only) ────────────────────────────────────

type OnboardingStage =
  | 'lead_identified' | 'proposal_sent' | 'agreement_sent'
  | 'agreement_signed' | 'setup_fee_paid' | 'underwriting'

const ONBOARDING_STAGES: OnboardingStage[] = [
  'lead_identified', 'proposal_sent', 'agreement_sent',
  'agreement_signed', 'setup_fee_paid', 'underwriting',
]

const STAGE_META: Record<OnboardingStage, { label: string; color: string; bg: string; border: string }> = {
  lead_identified:  { label: 'Lead Identified',  color: '#93C5FD', bg: 'rgba(96,165,250,0.10)',  border: 'rgba(96,165,250,0.22)'  },
  proposal_sent:    { label: 'Proposal Sent',    color: '#FCD34D', bg: 'rgba(251,191,36,0.10)',  border: 'rgba(251,191,36,0.22)'  },
  agreement_sent:   { label: 'Agreement Sent',   color: '#C4B5FD', bg: 'rgba(139,92,246,0.10)',  border: 'rgba(139,92,246,0.22)'  },
  agreement_signed: { label: 'Agreement Signed', color: '#3DD68C', bg: 'rgba(61,214,140,0.10)',  border: 'rgba(61,214,140,0.22)'  },
  setup_fee_paid:   { label: 'Setup Fee Paid',   color: '#34D399', bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.28)'  },
  underwriting:     { label: 'Underwriting',     color: BRAND.warn, bg: 'rgba(240,178,62,0.10)', border: 'rgba(240,178,62,0.22)' },
}

const ACCT_COLORS: Record<AccountType, { color: string; bg: string }> = {
  'Card Present': { color: BRAND.cyan,  bg: 'rgba(144,196,207,0.12)' },
  'eCommerce':    { color: '#A78BFA',   bg: 'rgba(139,92,246,0.12)'  },
  'MOTO':         { color: BRAND.warn,  bg: 'rgba(240,178,62,0.12)'  },
  'ACH':          { color: '#4A9B7F',   bg: 'rgba(74,155,127,0.12)'  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatChip({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 2,
      padding: '10px 16px', borderRadius: 10,
      backgroundColor: BRAND.card, border: `1px solid rgba(255,255,255,0.07)`,
    }}>
      <span style={{ fontSize: 18, fontWeight: 800, color: accent ?? BRAND.cyan }}>{value}</span>
      <span style={{
        fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)',
        textTransform: 'uppercase', letterSpacing: '0.07em',
      }}>{label}</span>
    </div>
  )
}

function AccountBadge({ type }: { type: AccountType }) {
  const c = ACCT_COLORS[type]
  return (
    <span style={{
      display: 'inline-block', padding: '2px 7px', borderRadius: 999,
      fontSize: 9, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
      backgroundColor: c.bg, color: c.color, border: `1px solid ${c.color}30`,
      flexShrink: 0,
    }}>
      {type}
    </span>
  )
}

function DaysChip({ days }: { days: number }) {
  const urgent = days > 10
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 999,
      backgroundColor: urgent ? 'rgba(240,178,62,0.15)' : 'rgba(255,255,255,0.05)',
      color: urgent ? BRAND.warn : 'rgba(255,255,255,0.3)',
      border: `1px solid ${urgent ? 'rgba(240,178,62,0.3)' : 'rgba(255,255,255,0.08)'}`,
      flexShrink: 0,
    }}>
      <Clock size={8} /> {days}d
    </span>
  )
}

// ─── Merchant row ─────────────────────────────────────────────────────────────

function MerchantRow({ m, onClick }: { m: MerchantRecord; onClick: () => void }) {
  const acctColor = ACCT_COLORS[m.account_type].color
  const initials  = getInitials(m.name)

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '11px 14px', borderRadius: 10,
        backgroundColor: BRAND.card, border: `1px solid rgba(255,255,255,0.06)`,
        cursor: 'pointer', transition: 'border-color 0.15s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(144,196,207,0.22)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)' }}
    >
      {/* Avatar */}
      <div style={{
        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
        backgroundColor: `${acctColor}18`, border: `1px solid ${acctColor}35`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 800, color: acctColor,
      }}>
        {initials}
      </div>

      {/* Name + MCC */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 13, fontWeight: 700, color: BRAND.text, margin: 0,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {m.name}
        </p>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>
          {m.mcc_label}
        </p>
      </div>

      {/* Partner */}
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>
        {m.partner}
      </span>

      {/* Account type badge */}
      <AccountBadge type={m.account_type} />

      {/* Days chip */}
      <DaysChip days={m.days_in_stage} />

      {/* Arrow */}
      <ArrowRight size={13} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
    </div>
  )
}

// ─── Stage group ──────────────────────────────────────────────────────────────

function StageGroup({ stage, merchants, onRowClick }: {
  stage: OnboardingStage
  merchants: MerchantRecord[]
  onRowClick: (id: string) => void
}) {
  const meta = STAGE_META[stage]
  if (merchants.length === 0) return null

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 14px', borderRadius: 8, marginBottom: 8,
        backgroundColor: meta.bg, border: `1px solid ${meta.border}`,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: meta.color, flexShrink: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: meta.color, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          {meta.label}
        </span>
        <span style={{
          marginLeft: 'auto', fontSize: 10, fontWeight: 700,
          padding: '1px 6px', borderRadius: 999,
          backgroundColor: `${meta.color}18`, color: meta.color,
        }}>
          {merchants.length}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {merchants.map(m => (
          <MerchantRow key={m.id} m={m} onClick={() => onRowClick(m.id)} />
        ))}
      </div>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '64px 24px', gap: 16, textAlign: 'center',
      backgroundColor: BRAND.card, border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 16,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        backgroundColor: `${BRAND.cyan}12`, border: `1px solid ${BRAND.cyan}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Building2 size={24} style={{ color: BRAND.cyan, opacity: 0.7 }} />
      </div>
      <p style={{ fontSize: 15, fontWeight: 700, color: BRAND.silver }}>No merchants in onboarding</p>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', maxWidth: 340, lineHeight: 1.6 }}>
        Merchants appear here when they are in acquisition or underwriting stages.
      </p>
    </div>
  )
}

// ─── Main board ───────────────────────────────────────────────────────────────

export default function OnboardingBoard() {
  const router = useRouter()

  const onboardingMerchants = MOCK_MERCHANTS.filter(m =>
    (ONBOARDING_STAGES as PipelineStage[]).includes(m.pipeline_stage)
  )

  const allCount        = MOCK_MERCHANTS.filter(m => m.pipeline_stage !== 'declined').length
  const onboardingCount = onboardingMerchants.length
  const liveCount       = MOCK_MERCHANTS.filter(m =>
    m.pipeline_stage === 'account_activated' || m.pipeline_stage === 'merchant_live'
  ).length

  const avgDays = onboardingMerchants.length > 0
    ? Math.round(onboardingMerchants.reduce((s, m) => s + m.days_in_stage, 0) / onboardingMerchants.length)
    : 0
  const stuck   = onboardingMerchants.filter(m => m.days_in_stage > 14).length

  return (
    <div>
      <MerchantTabNav
        active="onboarding"
        counts={{ all: allCount, onboarding: onboardingCount, live: liveCount }}
      />

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{
          fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', margin: 0, lineHeight: 1.1,
          background: `linear-gradient(90deg, ${BRAND.silver} 0%, #fff 60%, ${BRAND.silverLo} 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Onboarding Pipeline
        </h1>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
          Merchants in acquisition and underwriting stages
        </p>
      </div>

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
        <StatChip label="In Pipeline"       value={onboardingCount}                         accent={BRAND.cyan} />
        <StatChip label="Avg Days in Stage" value={avgDays > 0 ? `${avgDays}d` : '—'}      accent={BRAND.silver} />
        <StatChip label="Stuck (14d+)"      value={stuck}                                   accent={stuck > 0 ? BRAND.warn : 'rgba(255,255,255,0.3)'} />
      </div>

      {/* Stage groups or empty state */}
      {onboardingMerchants.length === 0 ? (
        <EmptyState />
      ) : (
        ONBOARDING_STAGES.map(stage => (
          <StageGroup
            key={stage}
            stage={stage}
            merchants={onboardingMerchants.filter(m => m.pipeline_stage === stage)}
            onRowClick={id => router.push(`/admin/merchants/${id}`)}
          />
        ))
      )}
    </div>
  )
}
