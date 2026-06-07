'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { fetchMerchants, saveMerchantStage } from '@/lib/merchants-db'
import {
  LayoutGrid, List, Search, X, Plus, ChevronUp, ChevronDown,
  Building2, Users, DollarSign, TrendingUp, AlertCircle,
  CheckCircle2, Clock, ArrowRight, Filter, SortAsc,
  ExternalLink, GripVertical, Copy, Mail, CheckCircle,
  Zap, BarChart3, Activity,
} from 'lucide-react'
import { BRAND } from '@/lib/brand'
import ManageMerchantDrawer from './ManageMerchantDrawer'
import type { PipelineStage, AccountType, MerchantRecord } from './ManageMerchantDrawer'

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function MerchantTabs({
  active,
  counts,
}: {
  active: 'all' | 'onboarding' | 'live'
  counts: { all: number; onboarding: number; live: number }
}) {
  const tabs = [
    { key: 'all' as const,        label: 'All Merchants', href: '/admin/merchants',     count: counts.all },
    { key: 'onboarding' as const, label: 'Onboarding',    href: '/admin/onboarding-crm', count: counts.onboarding },
    { key: 'live' as const,       label: 'Live',          href: '/admin/portfolio',     count: counts.live },
  ]
  return (
    <div style={{ display: 'flex', gap: 2, borderBottom: `1px solid rgba(144,196,207,0.12)`, marginBottom: 28 }}>
      {tabs.map(t => (
        <Link key={t.key} href={t.href} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 16px', fontSize: 13, fontWeight: active === t.key ? 600 : 400,
          color: active === t.key ? BRAND.cyan : 'rgba(255,255,255,0.4)',
          borderBottom: active === t.key ? `2px solid ${BRAND.cyan}` : '2px solid transparent',
          textDecoration: 'none', letterSpacing: '0.02em', transition: 'color 0.15s',
        }}>
          {t.label}
          {t.count > 0 && (
            <span style={{
              fontSize: 10, fontWeight: 700,
              padding: '1px 6px', borderRadius: 999,
              backgroundColor: active === t.key ? `${BRAND.cyan}22` : 'rgba(255,255,255,0.06)',
              color: active === t.key ? BRAND.cyan : 'rgba(255,255,255,0.3)',
            }}>
              {t.count}
            </span>
          )}
        </Link>
      ))}
    </div>
  )
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KPICard({
  label, value, sub, icon, accent,
}: {
  label: string
  value: string
  sub?: string
  icon: React.ReactNode
  accent: string
}) {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      backgroundColor: BRAND.card,
      border: `1px solid rgba(255,255,255,0.07)`,
      borderRadius: 14,
      padding: '16px 20px',
      display: 'flex', flexDirection: 'column', gap: 10,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${accent}00, ${accent}70, ${accent}00)`,
      }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
          {label}
        </span>
        <span style={{
          width: 28, height: 28, borderRadius: 8,
          backgroundColor: `${accent}15`,
          border: `1px solid ${accent}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: accent,
        }}>
          {icon}
        </span>
      </div>
      <div>
        <p style={{ fontSize: 22, fontWeight: 700, color: BRAND.silver, lineHeight: 1 }}>{value}</p>
        {sub && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginTop: 4 }}>{sub}</p>}
      </div>
    </div>
  )
}

// ─── Stage metadata ───────────────────────────────────────────────────────────

const STAGE_META: Record<PipelineStage, {
  label: string; shortLabel: string
  color: string; bg: string; border: string
  icon: React.ReactNode
}> = {
  lead_identified:   { label: 'Lead Identified',   shortLabel: 'Lead',         color: '#93C5FD', bg: 'rgba(96,165,250,0.10)',   border: 'rgba(96,165,250,0.22)',   icon: <AlertCircle size={11} /> },
  proposal_sent:     { label: 'Proposal Sent',     shortLabel: 'Proposal',     color: '#FCD34D', bg: 'rgba(251,191,36,0.10)',   border: 'rgba(251,191,36,0.22)',   icon: <ArrowRight size={11} /> },
  agreement_sent:    { label: 'Agreement Sent',    shortLabel: 'Agmt Out',     color: '#C4B5FD', bg: 'rgba(139,92,246,0.10)',   border: 'rgba(139,92,246,0.22)',   icon: <ExternalLink size={11} /> },
  agreement_signed:  { label: 'Agreement Signed',  shortLabel: 'Signed',       color: '#3DD68C', bg: 'rgba(61,214,140,0.10)',   border: 'rgba(61,214,140,0.22)',   icon: <CheckCircle2 size={11} /> },
  setup_fee_paid:    { label: 'Setup Fee Paid',    shortLabel: 'Fee Paid',     color: '#34D399', bg: 'rgba(52,211,153,0.12)',   border: 'rgba(52,211,153,0.28)',   icon: <DollarSign size={11} /> },
  underwriting:      { label: 'Underwriting',      shortLabel: 'Underwriting', color: BRAND.warn, bg: 'rgba(240,178,62,0.10)', border: 'rgba(240,178,62,0.22)',   icon: <Clock size={11} /> },
  account_activated: { label: 'Account Activated', shortLabel: 'Activated',    color: BRAND.cyan, bg: 'rgba(144,196,207,0.10)', border: 'rgba(144,196,207,0.25)', icon: <TrendingUp size={11} /> },
  merchant_live:     { label: 'Merchant Live',     shortLabel: 'Live',         color: BRAND.success, bg: 'rgba(61,214,140,0.12)', border: 'rgba(61,214,140,0.28)', icon: <Zap size={11} /> },
  declined:          { label: 'Declined',          shortLabel: 'Declined',     color: 'rgba(255,255,255,0.28)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.10)', icon: <X size={11} /> },
}

const KANBAN_STAGES: PipelineStage[] = [
  'lead_identified', 'proposal_sent', 'agreement_sent',
  'agreement_signed', 'setup_fee_paid', 'underwriting',
  'account_activated', 'merchant_live',
]

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_MERCHANTS: MerchantRecord[] = [
  { id: 'm-001', name: 'Suncoast Retail Group',    dba_name: 'Suncoast Shops',   mcc: '5411', mcc_label: 'Grocery Stores',                     legal_structure: 'LLC',         account_type: 'Card Present', monthly_volume: 385000, avg_ticket: 62,   card_present_pct: 94, partner: 'First Capital ISO',    partner_iso: 'FC-ISO',  pipeline_stage: 'merchant_live',    days_in_stage: 42, date_added: '2025-11-14', notes: 'Multi-location grocery chain, flagship account', risk: 'low' },
  { id: 'm-002', name: 'BluePeak eCommerce LLC',   dba_name: 'BluePeak Store',   mcc: '5999', mcc_label: 'Retail Stores, NEC',                 legal_structure: 'LLC',         account_type: 'eCommerce',    monthly_volume: 210000, avg_ticket: 128,  card_present_pct: 0,  partner: 'Meridian Partners',    partner_iso: 'MP-001',  pipeline_stage: 'account_activated', days_in_stage: 11, date_added: '2026-01-03', risk: 'low' },
  { id: 'm-003', name: 'Atlas Medical Supplies',   dba_name: undefined,          mcc: '5047', mcc_label: 'Medical & Hospital Equipment',        legal_structure: 'C-Corp',      account_type: 'MOTO',         monthly_volume: 95000,  avg_ticket: 310,  card_present_pct: 10, partner: 'HealthPay ISO',        partner_iso: 'HP-ISO',  pipeline_stage: 'underwriting',     days_in_stage: 7,  date_added: '2026-02-18', notes: 'Requires enhanced underwriting — DME category', risk: 'medium' },
  { id: 'm-004', name: 'NovaBrew Coffee Co.',      dba_name: 'NovaBrew',         mcc: '5812', mcc_label: 'Eating Places & Restaurants',         legal_structure: 'S-Corp',      account_type: 'Card Present', monthly_volume: 52000,  avg_ticket: 18,   card_present_pct: 98, partner: 'First Capital ISO',    partner_iso: 'FC-ISO',  pipeline_stage: 'setup_fee_paid',   days_in_stage: 3,  date_added: '2026-03-05', risk: 'low' },
  { id: 'm-005', name: 'PrimeAuto Finance',        dba_name: undefined,          mcc: '5511', mcc_label: 'Auto Dealers - New & Used',           legal_structure: 'LLC',         account_type: 'Card Present', monthly_volume: 720000, avg_ticket: 4200, card_present_pct: 75, partner: 'Velocity ISO Group',   partner_iso: 'VG-ISO',  pipeline_stage: 'agreement_signed', days_in_stage: 5,  date_added: '2026-03-12', notes: 'High ticket — needs VP approval', risk: 'medium' },
  { id: 'm-006', name: 'ClearView Law Group',      dba_name: undefined,          mcc: '8111', mcc_label: 'Legal Services',                     legal_structure: 'Partnership', account_type: 'MOTO',         monthly_volume: 68000,  avg_ticket: 850,  card_present_pct: 5,  partner: 'Meridian Partners',    partner_iso: 'MP-001',  pipeline_stage: 'agreement_sent',   days_in_stage: 9,  date_added: '2026-03-20', risk: 'low' },
  { id: 'm-007', name: 'Apex Fitness Studios',     dba_name: 'Apex Fit',         mcc: '7997', mcc_label: 'Membership Sports & Recreation Clubs',legal_structure: 'LLC',         account_type: 'Card Present', monthly_volume: 41000,  avg_ticket: 55,   card_present_pct: 88, partner: 'First Capital ISO',    partner_iso: 'FC-ISO',  pipeline_stage: 'proposal_sent',    days_in_stage: 14, date_added: '2026-04-01', risk: 'low' },
  { id: 'm-008', name: 'OceanTech Imports',        dba_name: undefined,          mcc: '5065', mcc_label: 'Electrical Parts & Equipment',        legal_structure: 'C-Corp',      account_type: 'eCommerce',    monthly_volume: 155000, avg_ticket: 240,  card_present_pct: 0,  partner: 'Velocity ISO Group',   partner_iso: 'VG-ISO',  pipeline_stage: 'lead_identified',  days_in_stage: 2,  date_added: '2026-04-10', risk: 'medium' },
  { id: 'm-009', name: 'Harborside Hospitality',   dba_name: 'Harborside Hotels',mcc: '7011', mcc_label: 'Hotels & Motels',                    legal_structure: 'LLC',         account_type: 'Card Present', monthly_volume: 490000, avg_ticket: 195,  card_present_pct: 82, partner: 'Meridian Partners',    partner_iso: 'MP-001',  pipeline_stage: 'merchant_live',    days_in_stage: 88, date_added: '2025-09-30', risk: 'low' },
  { id: 'm-010', name: 'RedLine Logistics Inc.',   dba_name: undefined,          mcc: '4215', mcc_label: 'Courier Services',                   legal_structure: 'C-Corp',      account_type: 'ACH',          monthly_volume: 320000, avg_ticket: 1100, card_present_pct: 0,  partner: 'HealthPay ISO',        partner_iso: 'HP-ISO',  pipeline_stage: 'underwriting',     days_in_stage: 12, date_added: '2026-02-28', notes: 'ACH debit — fleet billing model', risk: 'medium' },
  { id: 'm-011', name: 'StarPath Education',       dba_name: 'StarPath Online',  mcc: '8299', mcc_label: 'Schools & Educational Services',     legal_structure: 'S-Corp',      account_type: 'eCommerce',    monthly_volume: 78000,  avg_ticket: 299,  card_present_pct: 0,  partner: 'First Capital ISO',    partner_iso: 'FC-ISO',  pipeline_stage: 'proposal_sent',    days_in_stage: 6,  date_added: '2026-04-05', risk: 'low' },
  { id: 'm-012', name: 'TerraVerde Cannabis Dist.',dba_name: 'TerraVerde',       mcc: '5912', mcc_label: 'Drug Stores & Pharmacies',           legal_structure: 'LLC',         account_type: 'Card Present', monthly_volume: 165000, avg_ticket: 72,   card_present_pct: 95, partner: 'Velocity ISO Group',   partner_iso: 'VG-ISO',  pipeline_stage: 'declined',         days_in_stage: 0,  date_added: '2026-03-01', notes: 'Declined — prohibited MCC in processing network', risk: 'high' },
]

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtVolume(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

function fmtCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function fmtDate(d: string): string {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const INPUT_STYLE: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.04)',
  border: `1px solid rgba(255,255,255,0.08)`,
  color: BRAND.text,
}

// ─── Badges ───────────────────────────────────────────────────────────────────

const ACCT_COLORS: Record<AccountType, { color: string; bg: string }> = {
  'Card Present': { color: BRAND.cyan,     bg: 'rgba(144,196,207,0.12)' },
  'eCommerce':    { color: '#A78BFA',       bg: 'rgba(139,92,246,0.12)' },
  'MOTO':         { color: BRAND.warn,      bg: 'rgba(240,178,62,0.12)' },
  'ACH':          { color: '#4A9B7F',       bg: 'rgba(74,155,127,0.12)' },
}

function AccountTypeBadge({ type }: { type: AccountType }) {
  const c = ACCT_COLORS[type]
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 999, fontSize: 9, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', backgroundColor: c.bg, color: c.color, border: `1px solid ${c.color}30` }}>
      {type}
    </span>
  )
}

function StageBadge({ stage }: { stage: PipelineStage }) {
  const m = STAGE_META[stage]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 999, fontSize: 9, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', backgroundColor: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
      {m.icon}{m.label}
    </span>
  )
}

const RISK_COLORS: Record<string, string> = { low: BRAND.success, medium: BRAND.warn, high: BRAND.danger }

function RiskDot({ risk }: { risk?: 'low' | 'medium' | 'high' }) {
  if (!risk || risk === 'low') return null
  const color = RISK_COLORS[risk]
  return <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: color, flexShrink: 0, display: 'inline-block' }} title={`${risk} risk`} />
}

function DaysChip({ days, stage }: { days: number; stage: PipelineStage }) {
  const urgent = days > 10 && !['merchant_live', 'declined'].includes(stage)
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 999, backgroundColor: urgent ? 'rgba(240,178,62,0.15)' : 'rgba(255,255,255,0.05)', color: urgent ? BRAND.warn : 'rgba(255,255,255,0.3)', border: `1px solid ${urgent ? 'rgba(240,178,62,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
      <Clock size={8} /> {days}d
    </span>
  )
}

// ─── Kanban card ──────────────────────────────────────────────────────────────

function KanbanCard({
  merchant, dragging, onDragStart, onDragEnd, onClick,
}: {
  merchant: MerchantRecord
  dragging: boolean
  onDragStart: () => void
  onDragEnd: () => void
  onClick: () => void
}) {
  const meta = STAGE_META[merchant.pipeline_stage]
  const initials = getInitials(merchant.name)
  const acctColor = ACCT_COLORS[merchant.account_type].color

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      style={{
        backgroundColor: BRAND.card,
        border: `1px solid ${dragging ? meta.color : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 12,
        padding: '14px',
        opacity: dragging ? 0.4 : 1,
        transform: dragging ? 'scale(0.96)' : undefined,
        cursor: 'pointer',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(144,196,207,0.25)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = dragging ? meta.color : 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}
    >
      {/* Avatar + name */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
          backgroundColor: `${acctColor}18`,
          border: `1px solid ${acctColor}35`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 800, color: acctColor, letterSpacing: '0.02em',
        }}>
          {initials}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: BRAND.text, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {merchant.name}
          </p>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
            {merchant.dba_name ? `DBA: ${merchant.dba_name}` : `MCC ${merchant.mcc}`}
          </p>
        </div>
        <RiskDot risk={merchant.risk} />
      </div>

      {/* MCC label + account type */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
          {merchant.mcc_label}
        </p>
        <AccountTypeBadge type={merchant.account_type} />
      </div>

      {/* Volume + days */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: BRAND.cyan }}>
          {fmtVolume(merchant.monthly_volume)}
          <span style={{ fontSize: 9, fontWeight: 400, color: 'rgba(255,255,255,0.3)', marginLeft: 2 }}>/mo</span>
        </span>
        <DaysChip days={merchant.days_in_stage} stage={merchant.pipeline_stage} />
      </div>

      {/* Partner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Users size={9} style={{ color: 'rgba(255,255,255,0.22)', flexShrink: 0 }} />
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {merchant.partner}
        </span>
      </div>
    </div>
  )
}

// ─── Stage funnel bar ─────────────────────────────────────────────────────────

function StageFunnelBar({ merchants }: { merchants: MerchantRecord[] }) {
  const active = merchants.filter(m => m.pipeline_stage !== 'declined')
  if (active.length === 0) return null
  const counts = KANBAN_STAGES.map(s => ({ stage: s, count: active.filter(m => m.pipeline_stage === s).length, meta: STAGE_META[s] }))
  return (
    <div style={{ display: 'flex', gap: 2, height: 4, borderRadius: 4, overflow: 'hidden', marginBottom: 24 }}>
      {counts.map(({ stage, count, meta }) => {
        const pct = (count / active.length) * 100
        if (pct === 0) return null
        return (
          <div key={stage} title={`${meta.label}: ${count}`} style={{ flex: pct, backgroundColor: meta.color, opacity: 0.7, minWidth: 4 }} />
        )
      })}
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onNew }: { onNew: () => void }) {
  const steps = [
    { icon: <Plus size={16} />, title: 'Add a merchant', body: 'Click "New Client" to generate an intake link and start the application.' },
    { icon: <Activity size={16} />, title: 'Track the pipeline', body: 'Drag merchants across stages — Lead → Proposal → Agreement → Live.' },
    { icon: <BarChart3 size={16} />, title: 'Monitor performance', body: 'Watch volume, risk, and time-in-stage across your entire portfolio.' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px 24px', gap: 40 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18, margin: '0 auto 16px',
          backgroundColor: `${BRAND.cyan}12`,
          border: `1px solid ${BRAND.cyan}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Building2 size={28} style={{ color: BRAND.cyan, opacity: 0.7 }} />
        </div>
        <p style={{ fontSize: 16, fontWeight: 700, color: BRAND.silver, marginBottom: 6 }}>No merchants yet</p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', maxWidth: 340, lineHeight: 1.6 }}>
          Add your first merchant to start tracking your pipeline.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 680 }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            flex: '1 1 180px', maxWidth: 200,
            backgroundColor: BRAND.card, border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, padding: '20px 18px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${BRAND.cyan}10`, border: `1px solid ${BRAND.cyan}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: BRAND.cyan, margin: '0 auto' }}>
              {s.icon}
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: BRAND.silver, marginBottom: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: BRAND.cyan, marginRight: 5 }}>0{i + 1}</span>
                {s.title}
              </p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onNew}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '12px 28px', borderRadius: 10,
          backgroundColor: BRAND.cyan, color: '#1c1c1c',
          fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
          letterSpacing: '0.04em', textTransform: 'uppercase',
        }}
      >
        <Plus size={15} /> New Client
      </button>
    </div>
  )
}

// ─── New Client Drawer ────────────────────────────────────────────────────────

const STANDARD_DOCS = [
  'Government ID', 'Bank Statements (3 months)', 'Voided Check',
  'Business License / Articles', 'EIN Letter', 'Processing Statements (optional)',
]

function NewClientDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail]       = useState('')
  const [phone, setPhone]       = useState('')
  const [checkedDocs, setCheckedDocs] = useState<boolean[]>(STANDARD_DOCS.map(() => true))
  const [customDocs, setCustomDocs]   = useState<string[]>([])
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState<{ link: string } | null>(null)
  const [copied, setCopied]     = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  function reset() {
    setBusinessName(''); setEmail(''); setPhone('')
    setCheckedDocs(STANDARD_DOCS.map(() => true)); setCustomDocs([])
    setResult(null); setCopied(false); setErrorMsg(null)
  }

  async function handleSubmit() {
    if (!businessName.trim() || !email.trim()) return
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = await fetch('/api/onboarding/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_name: businessName, owner_email: email, owner_phone: phone || null }),
      })
      const data = await res.json()
      if (res.status === 409) {
        setErrorMsg(`"${businessName}" already exists. Check the Onboarding tab.`)
        return
      }
      if (!res.ok) {
        setErrorMsg(data?.error ?? 'Failed to create application — please try again.')
        return
      }
      setResult({ link: data.intakeLink ?? `${window.location.origin}/apply/${data.application?.intake_token}` })
    } catch {
      setErrorMsg('Network error — check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  function copyLink() {
    if (!result) return
    navigator.clipboard.writeText(result.link); setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function openEmail() {
    if (!result) return
    const subject = encodeURIComponent(`Your Merchant Account Application — ${businessName}`)
    const body = encodeURIComponent(`Dear ${businessName} Team,\n\nPlease complete your intake form:\n\n${result.link}\n\nBest regards,\nUnited Fintech`)
    window.open(`mailto:${email}?subject=${subject}&body=${body}`)
  }

  const inp: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid rgba(255,255,255,0.1)`,
    borderRadius: 8, padding: '9px 12px', color: BRAND.text, fontSize: 13, outline: 'none', boxSizing: 'border-box',
  }

  return (
    <>
      {open && <div onClick={() => { reset(); onClose() }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 49 }} />}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, zIndex: 50,
        background: BRAND.card, borderLeft: `1px solid rgba(144,196,207,0.15)`,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.25s ease', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: `1px solid rgba(255,255,255,0.07)` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.text, letterSpacing: '0.06em', textTransform: 'uppercase' }}>New Merchant Application</div>
          <button onClick={() => { reset(); onClose() }} style={{ background: 'none', border: 'none', color: BRAND.muted, cursor: 'pointer', padding: 4 }}><X size={18} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {errorMsg && (
            <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 8, backgroundColor: `${BRAND.danger}12`, border: `1px solid ${BRAND.danger}40`, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <AlertCircle size={14} style={{ color: BRAND.danger, flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: BRAND.danger, lineHeight: 1.5 }}>{errorMsg}</p>
            </div>
          )}
          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: BRAND.success }}>
                <CheckCircle size={18} /><span style={{ fontSize: 14, fontWeight: 600 }}>Application created!</span>
              </div>
              <p style={{ fontSize: 12, color: BRAND.muted }}>Client will appear in <strong style={{ color: BRAND.cyan }}>Onboarding</strong> once they submit.</p>
              <div style={{ background: 'rgba(110,231,183,0.08)', border: '1px solid rgba(110,231,183,0.2)', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontSize: 10, color: BRAND.muted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Intake Link</div>
                <div style={{ fontSize: 12, color: BRAND.silver, wordBreak: 'break-all', marginBottom: 12 }}>{result.link}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={copyLink} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: copied ? 'rgba(110,231,183,0.15)' : 'rgba(144,196,207,0.08)', border: `1px solid rgba(144,196,207,0.25)`, borderRadius: 8, padding: '9px 12px', color: copied ? BRAND.success : BRAND.cyan, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                    <Copy size={13} />{copied ? 'Copied!' : 'Copy Link'}
                  </button>
                  <button onClick={openEmail} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(144,196,207,0.08)', border: `1px solid rgba(144,196,207,0.25)`, borderRadius: 8, padding: '9px 12px', color: BRAND.cyan, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                    <Mail size={13} />Email Client
                  </button>
                </div>
              </div>
              <button onClick={reset} style={{ background: 'none', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 8, padding: 8, color: BRAND.muted, fontSize: 12, cursor: 'pointer' }}>
                Create Another
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {([
                { label: 'Business Name *', type: 'text',  val: businessName, set: setBusinessName, placeholder: 'Acme Merchant LLC' },
                { label: 'Owner Email *',   type: 'email', val: email,        set: setEmail,        placeholder: 'owner@business.com' },
                { label: 'Owner Phone',     type: 'tel',   val: phone,        set: setPhone,        placeholder: '+1 (555) 000-0000' },
              ] as const).map(f => (
                <div key={f.label}>
                  <label style={{ fontSize: 10, color: BRAND.muted, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input style={inp} type={f.type} value={f.val} onChange={e => (f.set as (v: string) => void)(e.target.value)} placeholder={f.placeholder} />
                </div>
              ))}
              <div>
                <div style={{ fontSize: 10, color: BRAND.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Document Checklist</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {STANDARD_DOCS.map((doc, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <input type="checkbox" checked={checkedDocs[i]} onChange={() => setCheckedDocs(p => p.map((v, idx) => idx === i ? !v : v))} style={{ accentColor: BRAND.cyan, width: 14, height: 14 }} />
                      <span style={{ fontSize: 13, color: checkedDocs[i] ? BRAND.text : BRAND.muted }}>{doc}</span>
                    </label>
                  ))}
                  {customDocs.map((doc, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input style={{ ...inp, flex: 1 }} value={doc} onChange={e => setCustomDocs(p => p.map((d, idx) => idx === i ? e.target.value : d))} placeholder="Custom document" />
                      <button onClick={() => setCustomDocs(p => p.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: BRAND.muted, cursor: 'pointer', padding: 4 }}><X size={14} /></button>
                    </div>
                  ))}
                  <button onClick={() => setCustomDocs(p => [...p, ''])} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: `1px dashed rgba(144,196,207,0.3)`, borderRadius: 8, padding: '7px 12px', color: BRAND.cyan, fontSize: 12, cursor: 'pointer', marginTop: 4 }}>
                    <Plus size={13} />Add Custom Document
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {!result && (
          <div style={{ padding: '16px 24px', borderTop: `1px solid rgba(255,255,255,0.07)` }}>
            <button onClick={handleSubmit} disabled={!businessName.trim() || !email.trim() || loading}
              style={{ width: '100%', padding: 11, borderRadius: 10, border: 'none', background: (businessName.trim() && email.trim()) ? BRAND.cyan : 'rgba(144,196,207,0.15)', color: (businessName.trim() && email.trim()) ? '#1c1c1c' : BRAND.muted, fontSize: 13, fontWeight: 700, cursor: (businessName.trim() && email.trim()) ? 'pointer' : 'not-allowed', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {loading ? 'Generating…' : 'Generate Link & Send'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

// ─── Sort types ───────────────────────────────────────────────────────────────

type SortKey = 'name' | 'monthly_volume' | 'days_in_stage' | 'date_added'
type SortDir = 'asc' | 'desc'

const PARTNERS = ['First Capital ISO', 'Meridian Partners', 'Velocity ISO Group', 'HealthPay ISO']

// ─── Main board ───────────────────────────────────────────────────────────────

export default function MerchantsBoard() {
  const router = useRouter()
  const [merchants, setMerchants] = useState<MerchantRecord[]>([])
  const [loading, setLoading]     = useState(true)
  const [view, setView]           = useState<'kanban' | 'list'>('kanban')
  const [search, setSearch]       = useState('')
  const [filterStage, setFilterStage]     = useState<PipelineStage | ''>('')
  const [filterPartner, setFilterPartner] = useState('')
  const [filterAcctType, setFilterAcctType] = useState<AccountType | ''>('')
  const [showDeclined, setShowDeclined]   = useState(false)
  const [showFilters, setShowFilters]     = useState(false)
  const [drawerOpen, setDrawerOpen]       = useState(false)
  const [sortKey, setSortKey]     = useState<SortKey>('date_added')
  const [sortDir, setSortDir]     = useState<SortDir>('desc')
  const [draggingId, setDraggingId]       = useState<string | null>(null)
  const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null)
  const dragCounter = useRef<Record<string, number>>({})

  const active   = merchants.filter(m => m.pipeline_stage !== 'declined')
  const declined = merchants.filter(m => m.pipeline_stage === 'declined')
  const liveList = merchants.filter(m => m.pipeline_stage === 'merchant_live')
  const displayed = showDeclined ? merchants : active

  const filtered = displayed.filter(m => {
    const q = search.trim().toLowerCase()
    if (q) {
      const hit = m.name.toLowerCase().includes(q) || (m.dba_name ?? '').toLowerCase().includes(q) ||
        m.mcc.includes(q) || m.mcc_label.toLowerCase().includes(q) || m.account_type.toLowerCase().includes(q) ||
        m.partner.toLowerCase().includes(q) || STAGE_META[m.pipeline_stage].label.toLowerCase().includes(q)
      if (!hit) return false
    }
    if (filterStage && m.pipeline_stage !== filterStage) return false
    if (filterPartner && m.partner !== filterPartner) return false
    if (filterAcctType && m.account_type !== filterAcctType) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0
    if (sortKey === 'name')           cmp = a.name.localeCompare(b.name)
    if (sortKey === 'monthly_volume') cmp = a.monthly_volume - b.monthly_volume
    if (sortKey === 'days_in_stage')  cmp = a.days_in_stage - b.days_in_stage
    if (sortKey === 'date_added')     cmp = a.date_added.localeCompare(b.date_added)
    return sortDir === 'asc' ? cmp : -cmp
  })

  const totalVolume = active.reduce((s, m) => s + m.monthly_volume, 0)
  const avgTicket   = active.length > 0 ? Math.round(active.reduce((s, m) => s + m.avg_ticket, 0) / active.length) : 0

  useEffect(() => {
    fetchMerchants()
      .then(data => setMerchants(data.length > 0 ? data : MOCK_MERCHANTS))
      .catch(() => setMerchants(MOCK_MERCHANTS))
      .finally(() => setLoading(false))
  }, [])

  function handleStageChange(id: string, stage: PipelineStage) {
    setMerchants(prev => prev.map(m => m.id === id ? { ...m, pipeline_stage: stage, days_in_stage: 0 } : m))
    saveMerchantStage(id, stage).catch(console.error)
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <SortAsc size={10} style={{ opacity: 0.25 }} />
    return sortDir === 'asc' ? <ChevronUp size={10} /> : <ChevronDown size={10} />
  }

  const hasActiveFilters = !!filterStage || !!filterPartner || !!filterAcctType

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: `2px solid ${BRAND.cyan}`, borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ fontSize: 13, color: BRAND.muted }}>Loading merchants…</span>
      </div>
    </div>
  )

  return (
    <div>
      <MerchantTabs
        active="all"
        counts={{ all: active.length, onboarding: active.filter(m => !['merchant_live', 'account_activated'].includes(m.pipeline_stage)).length, live: liveList.length }}
      />

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{
            fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em',
            background: `linear-gradient(90deg, ${BRAND.silver} 0%, #fff 60%, ${BRAND.silverLo} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            margin: 0, lineHeight: 1.1,
          }}>
            Merchants
          </h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
            Payment processing pipeline · {active.length} active · {declined.length} declined
          </p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 10, backgroundColor: BRAND.cyan, color: '#1c1c1c', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', letterSpacing: '0.03em', flexShrink: 0 }}
        >
          <Plus size={14} /> New Client
        </button>
      </div>

      {/* ── KPI cards ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <KPICard label="Active Merchants" value={String(active.length)} sub={`${declined.length} declined`} icon={<Building2 size={14} />} accent={BRAND.cyan} />
        <KPICard label="Pipeline Volume" value={fmtVolume(totalVolume)} sub="monthly processing" icon={<TrendingUp size={14} />} accent="#6EE7B7" />
        <KPICard label="Live & Processing" value={String(liveList.length)} sub={liveList.length > 0 ? `${fmtVolume(liveList.reduce((s,m)=>s+m.monthly_volume,0))}/mo` : 'none yet'} icon={<Zap size={14} />} accent={BRAND.success} />
        <KPICard label="Avg Ticket Size" value={avgTicket > 0 ? fmtCurrency(avgTicket) : '—'} sub="across active portfolio" icon={<DollarSign size={14} />} accent={BRAND.warn} />
      </div>

      {/* Stage funnel bar */}
      <StageFunnelBar merchants={merchants} />

      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 180 }}>
          <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: `${BRAND.cyan}70`, pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search merchants, MCC, partner…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...INPUT_STYLE, width: '100%', paddingLeft: 36, paddingRight: search ? 32 : 12, paddingTop: 8, paddingBottom: 8, borderRadius: 9, fontSize: 12, outline: 'none', boxSizing: 'border-box' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 2 }}>
              <X size={12} />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: `1px solid ${hasActiveFilters ? BRAND.cyan : 'rgba(255,255,255,0.08)'}`, backgroundColor: hasActiveFilters ? `${BRAND.cyan}12` : 'rgba(255,255,255,0.03)', color: hasActiveFilters ? BRAND.cyan : 'rgba(255,255,255,0.4)', transition: 'all 0.15s', flexShrink: 0 }}
        >
          <Filter size={12} />
          Filters
          {hasActiveFilters && (
            <span style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: BRAND.cyan, color: '#1c1c1c', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {[filterStage, filterPartner, filterAcctType].filter(Boolean).length}
            </span>
          )}
        </button>

        {/* View toggle */}
        <div style={{ display: 'flex', borderRadius: 9, overflow: 'hidden', border: `1px solid rgba(255,255,255,0.08)`, flexShrink: 0 }}>
          {([['kanban', <LayoutGrid key="k" size={13} />, 'Pipeline'] as const, ['list', <List key="l" size={13} />, 'List'] as const] as const).map(([v, icon, lbl]) => (
            <button key={v} onClick={() => setView(v)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', backgroundColor: view === v ? BRAND.cyan : 'rgba(255,255,255,0.03)', color: view === v ? '#1c1c1c' : 'rgba(255,255,255,0.4)', transition: 'all 0.15s' }}>
              {icon} {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* Filter dropdowns */}
      {showFilters && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '12px 14px', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.02)', border: `1px solid rgba(255,255,255,0.07)`, marginBottom: 16 }}>
          {([
            { val: filterStage, set: setFilterStage, opts: [['', 'All Stages'], ...Object.entries(STAGE_META).map(([k, v]) => [k, v.label])], label: 'Stage' },
            { val: filterPartner, set: setFilterPartner, opts: [['', 'All Partners'], ...PARTNERS.map(p => [p, p])], label: 'Partner' },
            { val: filterAcctType, set: setFilterAcctType, opts: [['', 'All Types'], ['Card Present', 'Card Present'], ['eCommerce', 'eCommerce'], ['MOTO', 'MOTO'], ['ACH', 'ACH']], label: 'Type' },
          ] as const).map(f => (
            <select key={f.label} value={f.val} onChange={e => (f.set as (v: string) => void)(e.target.value)}
              style={{ ...INPUT_STYLE, padding: '6px 12px', borderRadius: 8, fontSize: 12, outline: 'none', minWidth: 140 }}>
              {f.opts.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          ))}
          {hasActiveFilters && (
            <button onClick={() => { setFilterStage(''); setFilterPartner(''); setFilterAcctType('') }}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: `1px solid ${BRAND.danger}40`, color: BRAND.danger, backgroundColor: `${BRAND.danger}0D`, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
              <X size={11} /> Clear
            </button>
          )}
        </div>
      )}

      {/* ── Content ───────────────────────────────────────────────────────── */}
      {merchants.length === 0 ? (
        <div style={{ backgroundColor: BRAND.card, border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 16 }}>
          <EmptyState onNew={() => setDrawerOpen(true)} />
        </div>

      ) : view === 'kanban' ? (
        /* ══ KANBAN ══════════════════════════════════════════════════════════ */
        <div>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
            <GripVertical size={11} /> Drag to move between stages · Click to open
          </p>

          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 16, scrollbarWidth: 'thin', scrollbarColor: `rgba(144,196,207,0.2) transparent` }}>
            {KANBAN_STAGES.map(stage => {
              const meta = STAGE_META[stage]
              const cards = filtered.filter(m => m.pipeline_stage === stage)
              const isOver = dragOverStage === stage && draggingId !== null
              const stageVol = cards.reduce((s, m) => s + m.monthly_volume, 0)

              return (
                <div key={stage} style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0, width: 212 }}
                  onDragOver={e => { e.preventDefault(); setDragOverStage(stage) }}
                  onDragEnter={e => { e.preventDefault(); dragCounter.current[stage] = (dragCounter.current[stage] ?? 0) + 1; setDragOverStage(stage) }}
                  onDragLeave={() => { dragCounter.current[stage] = (dragCounter.current[stage] ?? 1) - 1; if ((dragCounter.current[stage] ?? 0) <= 0) { dragCounter.current[stage] = 0; setDragOverStage(null) } }}
                  onDrop={e => { e.preventDefault(); dragCounter.current[stage] = 0; if (draggingId) handleStageChange(draggingId, stage); setDragOverStage(null); setDraggingId(null) }}
                >
                  {/* Column header */}
                  <div style={{ padding: '10px 12px', borderRadius: 10, backgroundColor: isOver ? meta.bg : 'rgba(255,255,255,0.03)', border: `1px solid ${isOver ? meta.color : 'rgba(255,255,255,0.07)'}`, boxShadow: isOver ? `0 0 0 2px ${meta.color}25` : undefined, transition: 'all 0.15s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: stageVol > 0 ? 4 : 0 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: meta.color }}>
                        {meta.icon} {meta.shortLabel}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 999, backgroundColor: `${meta.color}18`, color: meta.color }}>
                        {cards.length}
                      </span>
                    </div>
                    {stageVol > 0 && (
                      <p style={{ fontSize: 9, fontWeight: 600, color: `${meta.color}80` }}>{fmtVolume(stageVol)}/mo</p>
                    )}
                  </div>

                  {/* Cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 80, borderRadius: 10, padding: isOver ? 6 : 0, backgroundColor: isOver ? `${meta.bg}` : 'transparent', border: isOver ? `1px dashed ${meta.color}50` : '1px solid transparent', transition: 'all 0.15s' }}>
                    {cards.length === 0 ? (
                      <div style={{ padding: '20px 0', textAlign: 'center', borderRadius: 10, border: '1px dashed rgba(255,255,255,0.06)' }}>
                        <p style={{ fontSize: 10, color: isOver ? meta.color : 'rgba(255,255,255,0.15)' }}>{isOver ? 'Drop here' : 'Empty'}</p>
                      </div>
                    ) : (
                      cards.map(m => (
                        <KanbanCard key={m.id} merchant={m}
                          dragging={draggingId === m.id}
                          onDragStart={() => setDraggingId(m.id)}
                          onDragEnd={() => { setDraggingId(null); setDragOverStage(null) }}
                          onClick={() => router.push('/admin/merchants/' + m.id)}
                        />
                      ))
                    )}
                    {isOver && cards.length > 0 && (
                      <div style={{ height: 40, borderRadius: 10, border: `2px dashed ${meta.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: meta.color }}>
                        Drop here
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {declined.length > 0 && (
            <button onClick={() => setShowDeclined(v => !v)} style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4 }}>
              {showDeclined ? '↑ Hide declined' : `↓ Show ${declined.length} declined`}
            </button>
          )}
        </div>

      ) : (
        /* ══ LIST VIEW ═══════════════════════════════════════════════════════ */
        <div>
          <div style={{ backgroundColor: BRAND.card, border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: 'rgba(144,196,207,0.05)', borderBottom: `1px solid rgba(144,196,207,0.12)` }}>
                  <tr>
                    {([
                      { key: 'name' as SortKey,           label: 'Business' },
                      { key: null,                          label: 'MCC' },
                      { key: null,                          label: 'Type' },
                      { key: 'monthly_volume' as SortKey,  label: 'Volume' },
                      { key: null,                          label: 'Stage' },
                      { key: null,                          label: 'Partner' },
                      { key: 'date_added' as SortKey,      label: 'Added' },
                      { key: 'days_in_stage' as SortKey,   label: 'Age' },
                      { key: null,                          label: '' },
                    ] as { key: SortKey | null; label: string }[]).map(({ key, label }) => (
                      <th key={label} onClick={() => key && toggleSort(key)}
                        style={{ textAlign: 'left', padding: '10px 16px', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: `${BRAND.cyan}99`, cursor: key ? 'pointer' : 'default', whiteSpace: 'nowrap', userSelect: 'none' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          {label}{key && <SortIcon k={key} />}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((m, idx) => (
                    <tr key={m.id} onClick={() => router.push('/admin/merchants/' + m.id)}
                      style={{ borderTop: idx > 0 ? `1px solid rgba(255,255,255,0.04)` : undefined, cursor: 'pointer', transition: 'background 0.1s' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: `${ACCT_COLORS[m.account_type].color}15`, border: `1px solid ${ACCT_COLORS[m.account_type].color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: ACCT_COLORS[m.account_type].color, flexShrink: 0 }}>
                            {getInitials(m.name)}
                          </div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: BRAND.text }}>{m.name}</p>
                            {m.dba_name && <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 1 }}>DBA: {m.dba_name}</p>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: BRAND.text }}>{m.mcc}</p>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 2, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.mcc_label}</p>
                      </td>
                      <td style={{ padding: '12px 16px' }}><AccountTypeBadge type={m.account_type} /></td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: BRAND.cyan }}>{fmtVolume(m.monthly_volume)}</span>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 1 }}>avg {fmtCurrency(m.avg_ticket)}</p>
                      </td>
                      <td style={{ padding: '12px 16px' }}><StageBadge stage={m.pipeline_stage} /></td>
                      <td style={{ padding: '12px 16px' }}>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{m.partner}</p>
                        <p style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)', marginTop: 1 }}>{m.partner_iso}</p>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 11, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>{fmtDate(m.date_added)}</td>
                      <td style={{ padding: '12px 16px' }}><DaysChip days={m.days_in_stage} stage={m.pipeline_stage} /></td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <RiskDot risk={m.risk} />
                          <ArrowRight size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {sorted.length === 0 && (
                <div style={{ padding: '48px 0', textAlign: 'center' }}>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>No merchants match your search.</p>
                </div>
              )}
            </div>
          </div>

          {declined.length > 0 && (
            <button onClick={() => setShowDeclined(v => !v)} style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 12 }}>
              {showDeclined ? '↑ Hide declined' : `↓ Show ${declined.length} declined`}
            </button>
          )}

          <div style={{ marginTop: 12, display: 'flex', gap: 16, fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>
            <span>{sorted.length} merchants</span>
            <span>|</span>
            <span>Total: <strong style={{ color: BRAND.cyan }}>{fmtVolume(sorted.reduce((s, m) => s + m.monthly_volume, 0))}/mo</strong></span>
          </div>
        </div>
      )}

      <NewClientDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}
