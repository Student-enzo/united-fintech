'use client'

import Link from 'next/link'
import { Clock, ArrowRight } from 'lucide-react'
import { BRAND } from '@/lib/brand'
import MerchantTabNav from '@/components/admin/MerchantTabNav'
import type { MerchantRecord, PipelineStage } from '@/components/admin/ManageMerchantDrawer'

// ─── Mock data (same as MerchantsBoard) ──────────────────────────────────────

const MOCK_MERCHANTS: MerchantRecord[] = [
  { id: 'm-001', name: 'Suncoast Retail Group',    dba_name: 'Suncoast Shops',    mcc: '5411', mcc_label: 'Grocery Stores',                      legal_structure: 'LLC',         account_type: 'Card Present', monthly_volume: 385000, avg_ticket: 62,   card_present_pct: 94, partner: 'First Capital ISO',  partner_iso: 'FC-ISO', pipeline_stage: 'merchant_live',    days_in_stage: 42, date_added: '2025-11-14', notes: 'Multi-location grocery chain, flagship account', risk: 'low' },
  { id: 'm-002', name: 'BluePeak eCommerce LLC',   dba_name: 'BluePeak Store',    mcc: '5999', mcc_label: 'Retail Stores, NEC',                  legal_structure: 'LLC',         account_type: 'eCommerce',    monthly_volume: 210000, avg_ticket: 128,  card_present_pct: 0,  partner: 'Meridian Partners',  partner_iso: 'MP-001', pipeline_stage: 'account_activated', days_in_stage: 11, date_added: '2026-01-03', risk: 'low' },
  { id: 'm-003', name: 'Atlas Medical Supplies',   dba_name: undefined,           mcc: '5047', mcc_label: 'Medical & Hospital Equipment',         legal_structure: 'C-Corp',      account_type: 'MOTO',         monthly_volume: 95000,  avg_ticket: 310,  card_present_pct: 10, partner: 'HealthPay ISO',      partner_iso: 'HP-ISO', pipeline_stage: 'underwriting',     days_in_stage: 7,  date_added: '2026-02-18', notes: 'Requires enhanced underwriting — DME category', risk: 'medium' },
  { id: 'm-004', name: 'NovaBrew Coffee Co.',      dba_name: 'NovaBrew',          mcc: '5812', mcc_label: 'Eating Places & Restaurants',          legal_structure: 'S-Corp',      account_type: 'Card Present', monthly_volume: 52000,  avg_ticket: 18,   card_present_pct: 98, partner: 'First Capital ISO',  partner_iso: 'FC-ISO', pipeline_stage: 'setup_fee_paid',   days_in_stage: 3,  date_added: '2026-03-05', risk: 'low' },
  { id: 'm-005', name: 'PrimeAuto Finance',        dba_name: undefined,           mcc: '5511', mcc_label: 'Auto Dealers - New & Used',            legal_structure: 'LLC',         account_type: 'Card Present', monthly_volume: 720000, avg_ticket: 4200, card_present_pct: 75, partner: 'Velocity ISO Group', partner_iso: 'VG-ISO', pipeline_stage: 'agreement_signed', days_in_stage: 5,  date_added: '2026-03-12', notes: 'High ticket — needs VP approval', risk: 'medium' },
  { id: 'm-006', name: 'ClearView Law Group',      dba_name: undefined,           mcc: '8111', mcc_label: 'Legal Services',                      legal_structure: 'Partnership', account_type: 'MOTO',         monthly_volume: 68000,  avg_ticket: 850,  card_present_pct: 5,  partner: 'Meridian Partners',  partner_iso: 'MP-001', pipeline_stage: 'agreement_sent',   days_in_stage: 9,  date_added: '2026-03-20', risk: 'low' },
  { id: 'm-007', name: 'Apex Fitness Studios',     dba_name: 'Apex Fit',          mcc: '7997', mcc_label: 'Membership Sports & Recreation Clubs', legal_structure: 'LLC',         account_type: 'Card Present', monthly_volume: 41000,  avg_ticket: 55,   card_present_pct: 88, partner: 'First Capital ISO',  partner_iso: 'FC-ISO', pipeline_stage: 'proposal_sent',    days_in_stage: 14, date_added: '2026-04-01', risk: 'low' },
  { id: 'm-008', name: 'OceanTech Imports',        dba_name: undefined,           mcc: '5065', mcc_label: 'Electrical Parts & Equipment',         legal_structure: 'C-Corp',      account_type: 'eCommerce',    monthly_volume: 155000, avg_ticket: 240,  card_present_pct: 0,  partner: 'Velocity ISO Group', partner_iso: 'VG-ISO', pipeline_stage: 'lead_identified',  days_in_stage: 2,  date_added: '2026-04-10', risk: 'medium' },
  { id: 'm-009', name: 'Harborside Hospitality',   dba_name: 'Harborside Hotels', mcc: '7011', mcc_label: 'Hotels & Motels',                     legal_structure: 'LLC',         account_type: 'Card Present', monthly_volume: 490000, avg_ticket: 195,  card_present_pct: 82, partner: 'Meridian Partners',  partner_iso: 'MP-001', pipeline_stage: 'merchant_live',    days_in_stage: 88, date_added: '2025-09-30', risk: 'low' },
  { id: 'm-010', name: 'RedLine Logistics Inc.',   dba_name: undefined,           mcc: '4215', mcc_label: 'Courier Services',                    legal_structure: 'C-Corp',      account_type: 'ACH',          monthly_volume: 320000, avg_ticket: 1100, card_present_pct: 0,  partner: 'HealthPay ISO',      partner_iso: 'HP-ISO', pipeline_stage: 'underwriting',     days_in_stage: 12, date_added: '2026-02-28', notes: 'ACH debit — fleet billing model', risk: 'medium' },
  { id: 'm-011', name: 'StarPath Education',       dba_name: 'StarPath Online',   mcc: '8299', mcc_label: 'Schools & Educational Services',      legal_structure: 'S-Corp',      account_type: 'eCommerce',    monthly_volume: 78000,  avg_ticket: 299,  card_present_pct: 0,  partner: 'First Capital ISO',  partner_iso: 'FC-ISO', pipeline_stage: 'proposal_sent',    days_in_stage: 6,  date_added: '2026-04-05', risk: 'low' },
  { id: 'm-012', name: 'TerraVerde Cannabis Dist.', dba_name: 'TerraVerde',       mcc: '5912', mcc_label: 'Drug Stores & Pharmacies',            legal_structure: 'LLC',         account_type: 'Card Present', monthly_volume: 165000, avg_ticket: 72,   card_present_pct: 95, partner: 'Velocity ISO Group', partner_iso: 'VG-ISO', pipeline_stage: 'declined',         days_in_stage: 0,  date_added: '2026-03-01', notes: 'Declined — prohibited MCC in processing network', risk: 'high' },
]

// ─── Pipeline stages (onboarding only — excludes live/activated/declined) ─────

const PIPELINE_STAGES: PipelineStage[] = [
  'lead_identified',
  'proposal_sent',
  'agreement_sent',
  'agreement_signed',
  'setup_fee_paid',
  'underwriting',
]

const STAGE_META: Record<PipelineStage, { label: string; color: string; bg: string; border: string }> = {
  lead_identified:   { label: 'Lead Identified',  color: '#93C5FD', bg: 'rgba(96,165,250,0.10)',    border: 'rgba(96,165,250,0.22)' },
  proposal_sent:     { label: 'Proposal Sent',    color: '#FCD34D', bg: 'rgba(251,191,36,0.10)',    border: 'rgba(251,191,36,0.22)' },
  agreement_sent:    { label: 'Agreement Sent',   color: '#C4B5FD', bg: 'rgba(139,92,246,0.10)',    border: 'rgba(139,92,246,0.22)' },
  agreement_signed:  { label: 'Agreement Signed', color: '#3DD68C', bg: 'rgba(61,214,140,0.10)',    border: 'rgba(61,214,140,0.22)' },
  setup_fee_paid:    { label: 'Setup Fee Paid',   color: '#34D399', bg: 'rgba(52,211,153,0.12)',    border: 'rgba(52,211,153,0.28)' },
  underwriting:      { label: 'Underwriting',     color: BRAND.warn, bg: 'rgba(240,178,62,0.10)',   border: 'rgba(240,178,62,0.22)' },
  account_activated: { label: 'Account Activated',color: BRAND.cyan, bg: 'rgba(144,196,207,0.10)', border: 'rgba(144,196,207,0.25)' },
  merchant_live:     { label: 'Merchant Live',    color: BRAND.success, bg: 'rgba(61,214,140,0.12)', border: 'rgba(61,214,140,0.28)' },
  declined:          { label: 'Declined',         color: 'rgba(255,255,255,0.28)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.10)' },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('')
}

// ─── Days chip ────────────────────────────────────────────────────────────────

function DaysChip({ days }: { days: number }) {
  const stuck = days > 14
  const warn  = days > 7 && !stuck
  const color = stuck ? BRAND.danger : warn ? BRAND.warn : 'rgba(255,255,255,0.35)'
  const bg    = stuck ? 'rgba(232,80,74,0.12)' : warn ? 'rgba(252,211,77,0.12)' : 'rgba(255,255,255,0.05)'
  const border= stuck ? 'rgba(232,80,74,0.3)'  : warn ? 'rgba(252,211,77,0.3)'  : 'rgba(255,255,255,0.10)'

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
      backgroundColor: bg, color, border: `1px solid ${border}`,
      whiteSpace: 'nowrap',
    }}>
      <Clock size={9} />{days}d
    </span>
  )
}

// ─── Merchant row ─────────────────────────────────────────────────────────────

function MerchantRow({ merchant }: { merchant: MerchantRecord }) {
  const ini = initials(merchant.name)
  const stageMeta = STAGE_META[merchant.pipeline_stage]

  return (
    <Link
      href={`/admin/merchants/${merchant.id}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '36px 1fr 160px 120px auto 20px',
          alignItems: 'center',
          gap: 14,
          padding: '10px 16px',
          borderRadius: 10,
          backgroundColor: BRAND.card,
          border: `1px solid ${BRAND.border}`,
          cursor: 'pointer',
          transition: 'border-color 0.15s, background-color 0.15s',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = BRAND.borderCyan
          el.style.backgroundColor = '#2e2c2c'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = BRAND.border
          el.style.backgroundColor = BRAND.card
        }}
      >
        {/* Initials box */}
        <div style={{
          width: 36, height: 36, borderRadius: 8, flexShrink: 0,
          backgroundColor: `${stageMeta.color}18`,
          border: `1px solid ${stageMeta.color}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, color: stageMeta.color,
          letterSpacing: '0.03em',
        }}>
          {ini}
        </div>

        {/* Name + MCC */}
        <div style={{ minWidth: 0 }}>
          <p style={{
            fontSize: 13, fontWeight: 600, color: BRAND.text,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            margin: 0,
          }}>
            {merchant.name}
          </p>
          <p style={{ fontSize: 11, color: BRAND.muted, margin: 0, marginTop: 2 }}>
            MCC {merchant.mcc} &middot; {merchant.mcc_label}
          </p>
        </div>

        {/* Partner */}
        <p style={{
          fontSize: 12, color: BRAND.silver,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          margin: 0,
        }}>
          {merchant.partner}
        </p>

        {/* Account type */}
        <span style={{
          fontSize: 11, fontWeight: 500,
          color: 'rgba(255,255,255,0.5)',
          whiteSpace: 'nowrap',
        }}>
          {merchant.account_type}
        </span>

        {/* Days chip */}
        <DaysChip days={merchant.days_in_stage} />

        {/* Arrow */}
        <ArrowRight size={13} style={{ color: BRAND.muted, flexShrink: 0 }} />
      </div>
    </Link>
  )
}

// ─── Summary bar ──────────────────────────────────────────────────────────────

function SummaryBar({ merchants }: { merchants: MerchantRecord[] }) {
  const total   = merchants.length
  const stuck   = merchants.filter(m => m.days_in_stage > 14).length
  const avgDays = total > 0
    ? Math.round(merchants.reduce((s, m) => s + m.days_in_stage, 0) / total)
    : 0

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 24,
      padding: '10px 16px', borderRadius: 10,
      backgroundColor: 'rgba(144,196,207,0.04)',
      border: `1px solid ${BRAND.border}`,
      marginBottom: 24,
    }}>
      <Stat label="In pipeline"        value={String(total)}   color={BRAND.cyan} />
      <Divider />
      <Stat label="Avg days in stage"  value={`${avgDays}d`}   color={BRAND.silver} />
      <Divider />
      <Stat label="Stuck >14d"         value={String(stuck)}   color={stuck > 0 ? BRAND.danger : BRAND.success} />
    </div>
  )
}

function Divider() {
  return <div style={{ width: 1, height: 24, backgroundColor: BRAND.border, flexShrink: 0 }} />
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 18, fontWeight: 700, color }}>{value}</span>
      <span style={{ fontSize: 11, color: BRAND.muted, letterSpacing: '0.02em' }}>{label}</span>
    </div>
  )
}

// ─── Stage section ────────────────────────────────────────────────────────────

function StageSection({
  stage,
  merchants,
}: {
  stage: PipelineStage
  merchants: MerchantRecord[]
}) {
  const meta = STAGE_META[stage]

  return (
    <div style={{ marginBottom: 28 }}>
      {/* Stage header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          backgroundColor: meta.color, flexShrink: 0,
        }} />
        <span style={{
          fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.08em', color: meta.color,
        }}>
          {meta.label}
        </span>
        <span style={{
          fontSize: 10, fontWeight: 700,
          padding: '1px 7px', borderRadius: 99,
          backgroundColor: `${meta.color}18`,
          color: meta.color,
          border: `1px solid ${meta.color}35`,
        }}>
          {merchants.length}
        </span>
      </div>

      {/* Rows */}
      {merchants.length === 0 ? (
        <div style={{
          padding: '12px 16px', borderRadius: 10,
          backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}`,
          fontSize: 12, color: BRAND.muted, textAlign: 'center',
        }}>
          No merchants in this stage
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {merchants.map(m => (
            <MerchantRow key={m.id} merchant={m} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main board ───────────────────────────────────────────────────────────────

export default function OnboardingBoard() {
  const pipelineMerchants = MOCK_MERCHANTS.filter(m =>
    PIPELINE_STAGES.includes(m.pipeline_stage)
  )

  const liveMerchants     = MOCK_MERCHANTS.filter(
    m => m.pipeline_stage === 'merchant_live' || m.pipeline_stage === 'account_activated'
  )
  const declinedMerchants = MOCK_MERCHANTS.filter(m => m.pipeline_stage === 'declined')

  const tabCounts = {
    all:        MOCK_MERCHANTS.filter(m => m.pipeline_stage !== 'declined').length,
    onboarding: pipelineMerchants.length,
    live:       liveMerchants.length,
  }

  return (
    <div style={{ background: BRAND.bg, minHeight: '100vh', padding: '28px 32px' }}>
      <MerchantTabNav active="onboarding" counts={tabCounts} />

      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: BRAND.silverLo, marginBottom: 4,
        }}>
          Onboarding
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: BRAND.text, margin: 0 }}>
          Merchant Pipeline
        </h1>
        <p style={{ fontSize: 13, color: BRAND.muted, marginTop: 6, marginBottom: 0 }}>
          Merchants advancing through the onboarding pipeline
          {declinedMerchants.length > 0 && ` · ${declinedMerchants.length} declined`}
        </p>
      </div>

      {/* Summary bar */}
      <SummaryBar merchants={pipelineMerchants} />

      {/* Stage sections */}
      {PIPELINE_STAGES.map(stage => (
        <StageSection
          key={stage}
          stage={stage}
          merchants={pipelineMerchants.filter(m => m.pipeline_stage === stage)}
        />
      ))}
    </div>
  )
}
