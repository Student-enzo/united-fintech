'use client'

import { useRouter } from 'next/navigation'
import { Building2, DollarSign, TrendingUp, Zap, ArrowRight } from 'lucide-react'
import { BRAND } from '@/lib/brand'
import MerchantTabNav from '@/components/admin/MerchantTabNav'
import type { MerchantRecord } from '@/components/admin/ManageMerchantDrawer'

// ─── Mock data (mirrored from MerchantsBoard) ─────────────────────────────────

const MOCK_MERCHANTS: MerchantRecord[] = [
  { id: 'm-001', name: 'Suncoast Retail Group',    dba_name: 'Suncoast Shops',    mcc: '5411', mcc_label: 'Grocery Stores',                      legal_structure: 'LLC',         account_type: 'Card Present', monthly_volume: 385000, avg_ticket: 62,   card_present_pct: 94, partner: 'First Capital ISO',  partner_iso: 'FC-ISO',  pipeline_stage: 'merchant_live',    days_in_stage: 42,  date_added: '2025-11-14', notes: 'Multi-location grocery chain, flagship account', risk: 'low' },
  { id: 'm-002', name: 'BluePeak eCommerce LLC',   dba_name: 'BluePeak Store',    mcc: '5999', mcc_label: 'Retail Stores, NEC',                  legal_structure: 'LLC',         account_type: 'eCommerce',    monthly_volume: 210000, avg_ticket: 128,  card_present_pct: 0,  partner: 'Meridian Partners',  partner_iso: 'MP-001',  pipeline_stage: 'account_activated', days_in_stage: 11, date_added: '2026-01-03', risk: 'low' },
  { id: 'm-003', name: 'Atlas Medical Supplies',   dba_name: undefined,           mcc: '5047', mcc_label: 'Medical & Hospital Equipment',         legal_structure: 'C-Corp',      account_type: 'MOTO',         monthly_volume: 95000,  avg_ticket: 310,  card_present_pct: 10, partner: 'HealthPay ISO',      partner_iso: 'HP-ISO',  pipeline_stage: 'underwriting',     days_in_stage: 7,   date_added: '2026-02-18', notes: 'Requires enhanced underwriting — DME category', risk: 'medium' },
  { id: 'm-004', name: 'NovaBrew Coffee Co.',      dba_name: 'NovaBrew',          mcc: '5812', mcc_label: 'Eating Places & Restaurants',          legal_structure: 'S-Corp',      account_type: 'Card Present', monthly_volume: 52000,  avg_ticket: 18,   card_present_pct: 98, partner: 'First Capital ISO',  partner_iso: 'FC-ISO',  pipeline_stage: 'setup_fee_paid',   days_in_stage: 3,   date_added: '2026-03-05', risk: 'low' },
  { id: 'm-005', name: 'PrimeAuto Finance',        dba_name: undefined,           mcc: '5511', mcc_label: 'Auto Dealers - New & Used',            legal_structure: 'LLC',         account_type: 'Card Present', monthly_volume: 720000, avg_ticket: 4200, card_present_pct: 75, partner: 'Velocity ISO Group', partner_iso: 'VG-ISO',  pipeline_stage: 'agreement_signed', days_in_stage: 5,   date_added: '2026-03-12', notes: 'High ticket — needs VP approval', risk: 'medium' },
  { id: 'm-006', name: 'ClearView Law Group',      dba_name: undefined,           mcc: '8111', mcc_label: 'Legal Services',                      legal_structure: 'Partnership', account_type: 'MOTO',         monthly_volume: 68000,  avg_ticket: 850,  card_present_pct: 5,  partner: 'Meridian Partners',  partner_iso: 'MP-001',  pipeline_stage: 'agreement_sent',   days_in_stage: 9,   date_added: '2026-03-20', risk: 'low' },
  { id: 'm-007', name: 'Apex Fitness Studios',     dba_name: 'Apex Fit',          mcc: '7997', mcc_label: 'Membership Sports & Recreation Clubs', legal_structure: 'LLC',         account_type: 'Card Present', monthly_volume: 41000,  avg_ticket: 55,   card_present_pct: 88, partner: 'First Capital ISO',  partner_iso: 'FC-ISO',  pipeline_stage: 'proposal_sent',    days_in_stage: 14,  date_added: '2026-04-01', risk: 'low' },
  { id: 'm-008', name: 'OceanTech Imports',        dba_name: undefined,           mcc: '5065', mcc_label: 'Electrical Parts & Equipment',         legal_structure: 'C-Corp',      account_type: 'eCommerce',    monthly_volume: 155000, avg_ticket: 240,  card_present_pct: 0,  partner: 'Velocity ISO Group', partner_iso: 'VG-ISO',  pipeline_stage: 'lead_identified',  days_in_stage: 2,   date_added: '2026-04-10', risk: 'medium' },
  { id: 'm-009', name: 'Harborside Hospitality',   dba_name: 'Harborside Hotels', mcc: '7011', mcc_label: 'Hotels & Motels',                     legal_structure: 'LLC',         account_type: 'Card Present', monthly_volume: 490000, avg_ticket: 195,  card_present_pct: 82, partner: 'Meridian Partners',  partner_iso: 'MP-001',  pipeline_stage: 'merchant_live',    days_in_stage: 88,  date_added: '2025-09-30', risk: 'low' },
  { id: 'm-010', name: 'RedLine Logistics Inc.',   dba_name: undefined,           mcc: '4215', mcc_label: 'Courier Services',                    legal_structure: 'C-Corp',      account_type: 'ACH',          monthly_volume: 320000, avg_ticket: 1100, card_present_pct: 0,  partner: 'HealthPay ISO',      partner_iso: 'HP-ISO',  pipeline_stage: 'underwriting',     days_in_stage: 12,  date_added: '2026-02-28', notes: 'ACH debit — fleet billing model', risk: 'medium' },
  { id: 'm-011', name: 'StarPath Education',       dba_name: 'StarPath Online',   mcc: '8299', mcc_label: 'Schools & Educational Services',      legal_structure: 'S-Corp',      account_type: 'eCommerce',    monthly_volume: 78000,  avg_ticket: 299,  card_present_pct: 0,  partner: 'First Capital ISO',  partner_iso: 'FC-ISO',  pipeline_stage: 'proposal_sent',    days_in_stage: 6,   date_added: '2026-04-05', risk: 'low' },
  { id: 'm-012', name: 'TerraVerde Cannabis Dist.',dba_name: 'TerraVerde',        mcc: '5912', mcc_label: 'Drug Stores & Pharmacies',            legal_structure: 'LLC',         account_type: 'Card Present', monthly_volume: 165000, avg_ticket: 72,   card_present_pct: 95, partner: 'Velocity ISO Group', partner_iso: 'VG-ISO',  pipeline_stage: 'declined',         days_in_stage: 0,   date_added: '2026-03-01', notes: 'Declined — prohibited MCC in processing network', risk: 'high' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtVolume(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

function fmtCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function calcDaysActive(dateAdded: string): number {
  const added = new Date(dateAdded + 'T00:00:00').getTime()
  return Math.max(0, Math.floor((Date.now() - added) / 86_400_000))
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

const ACCT_COLOR: Record<string, string> = {
  'Card Present': BRAND.cyan,
  'eCommerce':    '#A78BFA',
  'MOTO':         BRAND.warn,
  'ACH':          '#4A9B7F',
}

const RISK_COLOR: Record<string, string> = {
  low:    BRAND.success,
  medium: BRAND.warn,
  high:   BRAND.danger,
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KPICard({ label, value, sub, icon, accent }: {
  label: string; value: string; sub?: string; icon: React.ReactNode; accent: string
}) {
  return (
    <div style={{ flex: 1, minWidth: 0, backgroundColor: BRAND.card, border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 14, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${accent}00, ${accent}70, ${accent}00)` }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{label}</span>
        <span style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: `${accent}15`, border: `1px solid ${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent }}>{icon}</span>
      </div>
      <div>
        <p style={{ fontSize: 22, fontWeight: 700, color: BRAND.silver, lineHeight: 1 }}>{value}</p>
        {sub && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginTop: 4 }}>{sub}</p>}
      </div>
    </div>
  )
}

// ─── Risk Dot ─────────────────────────────────────────────────────────────────

function RiskDot({ risk }: { risk?: 'low' | 'medium' | 'high' }) {
  const level = risk ?? 'low'
  const color = RISK_COLOR[level] ?? BRAND.success
  return <span title={`${level} risk`} style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '64px 24px', gap: 16 }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: `${BRAND.cyan}12`, border: `1px solid ${BRAND.cyan}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Zap size={24} style={{ color: BRAND.cyan, opacity: 0.7 }} />
      </div>
      <p style={{ fontSize: 15, fontWeight: 700, color: BRAND.silver }}>No live merchants yet</p>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textAlign: 'center', maxWidth: 320, lineHeight: 1.6 }}>
        Merchants appear here once they reach Account Activated or Merchant Live stage.
      </p>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

const LIVE_STAGES = new Set(['account_activated', 'merchant_live'])

export default function LiveBoard() {
  const router = useRouter()

  const live = MOCK_MERCHANTS.filter(m => LIVE_STAGES.has(m.pipeline_stage))

  const allCount        = MOCK_MERCHANTS.filter(m => m.pipeline_stage !== 'declined').length
  const onboardingCount = MOCK_MERCHANTS.filter(m =>
    !['merchant_live', 'account_activated', 'declined'].includes(m.pipeline_stage)
  ).length
  const liveCount       = live.length

  const totalMonthlyVol = live.reduce((s, m) => s + m.monthly_volume, 0)
  const avgTicket       = liveCount > 0
    ? Math.round(live.reduce((s, m) => s + m.avg_ticket, 0) / liveCount)
    : 0
  const highestVol      = liveCount > 0
    ? live.reduce((best, m) => m.monthly_volume > best.monthly_volume ? m : best, live[0])
    : null

  const sorted = [...live].sort((a, b) => b.monthly_volume - a.monthly_volume)
  const maxVol = sorted.length > 0 ? sorted[0].monthly_volume : 1

  return (
    <div>
      {/* Tab navigation */}
      <MerchantTabNav
        active="live"
        counts={{ all: allCount, onboarding: onboardingCount, live: liveCount }}
      />

      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em',
          background: `linear-gradient(90deg, ${BRAND.silver} 0%, #fff 60%, ${BRAND.silverLo} 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          margin: 0, lineHeight: 1.1,
        }}>
          Live Portfolio
        </h1>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
          Active processing accounts · account activated &amp; merchant live stages
        </p>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        <KPICard
          label="Total Live"
          value={String(liveCount)}
          sub={liveCount === 1 ? '1 account processing' : `${liveCount} accounts processing`}
          icon={<Building2 size={14} />}
          accent={BRAND.cyan}
        />
        <KPICard
          label="Monthly Volume"
          value={fmtVolume(totalMonthlyVol)}
          sub="combined processing"
          icon={<TrendingUp size={14} />}
          accent={BRAND.success}
        />
        <KPICard
          label="Avg Ticket"
          value={avgTicket > 0 ? fmtCurrency(avgTicket) : '—'}
          sub="across live portfolio"
          icon={<DollarSign size={14} />}
          accent={BRAND.warn}
        />
        <KPICard
          label="Highest Volume"
          value={highestVol ? fmtVolume(highestVol.monthly_volume) : '—'}
          sub={highestVol ? (highestVol.dba_name ?? highestVol.name) : 'none yet'}
          icon={<Zap size={14} />}
          accent="#A78BFA"
        />
      </div>

      {/* Performance table or empty state */}
      {liveCount === 0 ? (
        <div style={{
          backgroundColor: BRAND.card,
          border: `1px solid rgba(255,255,255,0.07)`,
          borderRadius: 16,
        }}>
          <EmptyState />
        </div>
      ) : (
        <div style={{
          backgroundColor: BRAND.card,
          border: `1px solid rgba(255,255,255,0.07)`,
          borderRadius: 14,
          overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{
                backgroundColor: 'rgba(144,196,207,0.05)',
                borderBottom: `1px solid rgba(144,196,207,0.12)`,
              }}>
                <tr>
                  {['Business', 'Type', 'Monthly Vol', 'Avg Ticket', 'Days Active', 'Risk', ''].map(col => (
                    <th
                      key={col}
                      style={{
                        textAlign: 'left',
                        padding: '10px 16px',
                        fontSize: 9,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontWeight: 700,
                        color: `${BRAND.cyan}99`,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((m, idx) => {
                  const barWidth  = Math.round((m.monthly_volume / maxVol) * 100)
                  const daysActive = calcDaysActive(m.date_added)
                  const acctColor  = ACCT_COLOR[m.account_type] ?? BRAND.cyan

                  return (
                    <tr
                      key={m.id}
                      onClick={() => router.push('/admin/merchants/' + m.id)}
                      style={{
                        borderTop: idx > 0 ? `1px solid rgba(255,255,255,0.04)` : undefined,
                        cursor: 'pointer',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'rgba(255,255,255,0.02)'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent'
                      }}
                    >
                      {/* Business */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                            backgroundColor: `${acctColor}15`,
                            border: `1px solid ${acctColor}30`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, fontWeight: 800, color: acctColor,
                          }}>
                            {getInitials(m.name)}
                          </div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: BRAND.text }}>{m.name}</p>
                            {m.dba_name && (
                              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 1 }}>
                                DBA: {m.dba_name}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Account type */}
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 8px', borderRadius: 999,
                          fontSize: 9, fontWeight: 700, letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          backgroundColor: `${acctColor}18`,
                          color: acctColor,
                          border: `1px solid ${acctColor}30`,
                        }}>
                          {m.account_type}
                        </span>
                      </td>

                      {/* Monthly volume + inline bar */}
                      <td style={{ padding: '12px 16px', minWidth: 140 }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: BRAND.cyan }}>
                          {fmtVolume(m.monthly_volume)}
                          <span style={{
                            fontSize: 9, fontWeight: 400,
                            color: 'rgba(255,255,255,0.3)', marginLeft: 2,
                          }}>/mo</span>
                        </span>
                        <div style={{
                          marginTop: 5, height: 3, borderRadius: 2,
                          backgroundColor: 'rgba(255,255,255,0.06)',
                          overflow: 'hidden', width: 100,
                        }}>
                          <div style={{
                            width: `${barWidth}%`, height: '100%',
                            backgroundColor: BRAND.cyan, opacity: 0.6, borderRadius: 2,
                          }} />
                        </div>
                      </td>

                      {/* Avg ticket */}
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: BRAND.silver }}>
                          {fmtCurrency(m.avg_ticket)}
                        </span>
                      </td>

                      {/* Days active */}
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: 12, fontWeight: 600,
                          color: daysActive > 180 ? BRAND.success : 'rgba(255,255,255,0.5)',
                        }}>
                          {daysActive}d
                        </span>
                      </td>

                      {/* Risk */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <RiskDot risk={m.risk} />
                          <span style={{
                            fontSize: 11, color: 'rgba(255,255,255,0.4)',
                            textTransform: 'capitalize',
                          }}>
                            {m.risk ?? 'low'}
                          </span>
                        </div>
                      </td>

                      {/* Row arrow */}
                      <td style={{ padding: '12px 16px' }}>
                        <ArrowRight size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div style={{
            padding: '10px 16px',
            borderTop: `1px solid rgba(255,255,255,0.05)`,
            display: 'flex', gap: 16,
            fontSize: 11, color: 'rgba(255,255,255,0.28)',
          }}>
            <span>{sorted.length} live accounts</span>
            <span>|</span>
            <span>
              Combined:{' '}
              <strong style={{ color: BRAND.cyan }}>{fmtVolume(totalMonthlyVol)}/mo</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
