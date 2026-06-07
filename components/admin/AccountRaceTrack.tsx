'use client'

import React, { useState, useCallback } from 'react'
import { ArrowLeft, CheckCircle, Circle, ChevronRight } from 'lucide-react'
import { BRAND } from '@/lib/brand'
import type { MerchantAccount, PipelineStage } from '@/types/clients'
import { PIPELINE_STAGE_META } from '@/types/clients'

// ─── Stage order ──────────────────────────────────────────────────────────────

const ORDERED_STAGES: PipelineStage[] = [
  'lead_identified', 'proposal_sent', 'agreement_sent', 'agreement_signed',
  'setup_fee_paid', 'underwriting', 'account_activated', 'merchant_live',
]

function stageIndex(stage: PipelineStage) {
  return ORDERED_STAGES.indexOf(stage)
}

// ─── Stage-level checklists ────────────────────────────────────────────────────

const STAGE_CHECKLISTS: Partial<Record<PipelineStage, string[]>> = {
  lead_identified:   ['Verify contact info', 'Confirm business type', 'Identify processing needs', 'Schedule follow-up call'],
  proposal_sent:     ['Prepare custom proposal', 'Send pricing to merchant', 'Follow up within 3 days', 'Answer merchant questions'],
  agreement_sent:    ['Send merchant agreement', 'Explain terms to merchant', 'Set signing deadline', 'Confirm merchant received docs'],
  agreement_signed:  ['Collect signed agreement', 'Verify signature validity', 'Upload signed agreement', 'Notify processing team'],
  setup_fee_paid:    ['Invoice merchant for setup fee', 'Confirm payment received', 'Record payment in system', 'Prepare boarding docs'],
  underwriting:      ['Submit to processor', 'Provide additional docs if requested', 'Monitor underwriting status', 'Respond to processor queries'],
  account_activated: ['Confirm terminal/gateway setup', 'Test transaction with merchant', 'Verify settlement account', 'Send activation confirmation'],
  merchant_live:     ['Monitor first batch settlement', 'Check for processing issues', 'Set up residual tracking', 'Schedule 30-day check-in'],
}

// ─── Account type accent colour ───────────────────────────────────────────────

const TYPE_COLOR: Record<string, string> = {
  'Card Present': BRAND.cyan,
  'eCommerce':    BRAND.warn,
  'MOTO':         BRAND.silver,
  'ACH':          BRAND.success,
}
function accentFor(account: MerchantAccount): string {
  if (account.pipeline_stage === 'declined') return BRAND.danger
  return TYPE_COLOR[account.account_type] ?? BRAND.muted
}

// ─── Partner badge ────────────────────────────────────────────────────────────

const PARTNER_COLOR: Record<string, string> = {
  HPS:    '#22c55e',
  TSYS:   '#3b82f6',
  FISERV: '#f97316',
  NMI:    '#8b5cf6',
  PCC:    '#ef4444',
  DMS:    '#6366f1',
  PKG:    '#eab308',
  ACHG:   '#14b8a6',
  PRI:    '#90C4CF',
  PLD:    '#ec4899',
}

function PartnerBadge({ iso, name, size = 'sm' }: { iso: string; name: string; size?: 'sm' | 'md' }) {
  const color = PARTNER_COLOR[iso] ?? BRAND.muted
  if (size === 'md') {
    return (
      <div title={name} style={{
        display:'inline-flex', alignItems:'center', gap:6, padding:'3px 10px',
        borderRadius:6, backgroundColor:`${color}18`, border:`1px solid ${color}44`, flexShrink:0,
      }}>
        <div style={{ width:8, height:8, borderRadius:'50%', backgroundColor:color, boxShadow:`0 0 6px ${color}` }} />
        <span style={{ fontSize:11, fontWeight:700, color, letterSpacing:'0.04em' }}>{name}</span>
      </div>
    )
  }
  return (
    <div title={name} style={{
      display:'inline-flex', alignItems:'center', justifyContent:'center',
      padding:'1px 5px', borderRadius:3, flexShrink:0,
      backgroundColor:`${color}1A`, border:`1px solid ${color}44`,
      fontSize:8, fontWeight:800, letterSpacing:'0.04em', textTransform:'uppercase', color,
    }}>
      {iso.slice(0, 5)}
    </div>
  )
}

// ─── Car Card ─────────────────────────────────────────────────────────────────

function CarCard({ account, partnerIso, partnerName, onClick }: {
  account: MerchantAccount
  partnerIso?: string
  partnerName?: string
  onClick: () => void
}) {
  const [hov, setHov] = useState(false)
  const color    = accentFor(account)
  const isStall  = account.pipeline_stage !== 'declined' && account.days_in_stage > 14
  const actionLabel =
    account.pipeline_stage === 'declined' ? null
    : PIPELINE_STAGE_META[account.pipeline_stage].action_owner === 'merchant' ? '⚡ Action Needed'
    : PIPELINE_STAGE_META[account.pipeline_stage].action_owner === 'done'     ? '✓ Active'
    : '⏳ In Progress'

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="car-idle"
      style={{
        position:        'relative',
        width:           168,
        backgroundColor: hov ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
        border:          `1px solid ${hov ? color + '66' : color + '28'}`,
        borderRadius:    9,
        padding:         '9px 10px 8px',
        cursor:          'pointer',
        transition:      'all 0.2s',
        boxShadow:       hov ? `0 0 22px ${color}22, 0 4px 14px rgba(0,0,0,0.35)` : '0 2px 6px rgba(0,0,0,0.2)',
        userSelect:      'none',
      }}
    >
      {/* Top accent stripe */}
      <div style={{
        position: 'absolute', top: 0, left: 8, right: 8, height: 2,
        backgroundColor: color, borderRadius: 1,
        boxShadow: hov ? `0 0 10px ${color}99` : `0 0 5px ${color}55`,
      }} />

      {/* Car icon + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
        <span style={{ fontSize: 15, lineHeight: 1 }}>🏎</span>
        <span style={{
          fontSize: 11, fontWeight: 700, color: hov ? BRAND.text : BRAND.silver,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
        }}>
          {account.account_name}
        </span>
        {partnerIso && partnerName && <PartnerBadge iso={partnerIso} name={partnerName} />}
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
          color: color, backgroundColor: `${color}18`, border: `1px solid ${color}33`,
          padding: '1px 5px', borderRadius: 3,
        }}>{account.account_type}</span>
        <span style={{
          fontSize: 9, padding: '1px 5px', borderRadius: 3,
          color:            isStall ? BRAND.warn : BRAND.muted,
          backgroundColor:  isStall ? 'rgba(240,178,62,0.1)' : 'rgba(255,255,255,0.05)',
          border:           `1px solid ${isStall ? 'rgba(240,178,62,0.2)' : 'rgba(255,255,255,0.08)'}`,
        }}>{account.days_in_stage}d</span>
        {actionLabel && (
          <span style={{
            fontSize: 9, fontWeight: 600,
            color: actionLabel.startsWith('✓') ? BRAND.success : actionLabel.startsWith('⚡') ? BRAND.warn : BRAND.muted,
          }}>{actionLabel}</span>
        )}
      </div>
    </div>
  )
}

// ─── Management view ──────────────────────────────────────────────────────────

function AccountManageView({
  account, partnerIso, partnerName, onBack, onStageChange,
}: {
  account: MerchantAccount
  partnerIso?: string
  partnerName?: string
  onBack: () => void
  onStageChange?: (id: string, stage: PipelineStage) => void
}) {
  const [checked,   setChecked]   = useState<Record<string, boolean>>({})
  const [confirming, setConfirming] = useState<PipelineStage | null>(null)

  const isDeclined = account.pipeline_stage === 'declined'
  const activeIdx  = stageIndex(account.pipeline_stage)
  const color      = accentFor(account)
  const meta       = PIPELINE_STAGE_META[account.pipeline_stage]
  const checklist  = STAGE_CHECKLISTS[account.pipeline_stage] ?? []
  const nextStage  = !isDeclined && activeIdx < ORDERED_STAGES.length - 1 ? ORDERED_STAGES[activeIdx + 1] : null
  const checked_n  = checklist.filter((_, i) => checked[`${account.pipeline_stage}-${i}`]).length
  const pct        = checklist.length ? Math.round((checked_n / checklist.length) * 100) : 100

  return (
    <div style={{ width: '100%' }}>
      <style>{`
        @keyframes uf-pulse {
          0%,100% { box-shadow:0 0 12px rgba(144,196,207,0.6),0 0 24px rgba(144,196,207,0.3); transform:scale(1); }
          50% { box-shadow:0 0 20px rgba(144,196,207,0.9),0 0 40px rgba(144,196,207,0.5); transform:scale(1.15); }
        }
        .uf-pulse { animation: uf-pulse 2s ease-in-out infinite; }
        @media (prefers-reduced-motion:reduce) { .uf-pulse { animation:none !important; } }
      `}</style>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'none', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6, color: BRAND.muted, fontSize: 12,
            cursor: 'pointer', padding: '4px 10px', flexShrink: 0,
          }}
        >
          <ArrowLeft size={13} /> Race Track
        </button>
        <span style={{ fontSize: 15 }}>🏎</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: BRAND.silver, flex: 1 }}>{account.account_name}</span>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
          color: color, backgroundColor: `${color}1A`, border: `1px solid ${color}33`,
          padding: '2px 7px', borderRadius: 4,
        }}>{account.account_type}</span>
        {partnerIso && partnerName && <PartnerBadge iso={partnerIso} name={partnerName} size="md" />}
        <span style={{
          fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
          color:            account.risk === 'high' ? BRAND.danger : account.risk === 'medium' ? BRAND.warn : BRAND.success,
          backgroundColor:  account.risk === 'high' ? 'rgba(232,80,74,0.1)' : account.risk === 'medium' ? 'rgba(240,178,62,0.1)' : 'rgba(110,231,183,0.1)',
          border:           `1px solid ${account.risk === 'high' ? 'rgba(232,80,74,0.25)' : account.risk === 'medium' ? 'rgba(240,178,62,0.25)' : 'rgba(110,231,183,0.25)'}`,
        }}>{account.risk} risk</span>
      </div>

      {/* Stage progress bar */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px', marginBottom: 32 }}>
        <div style={{ position: 'absolute', left: 8, right: 8, top: '50%', transform: 'translateY(-50%)', height: 2, backgroundColor: 'rgba(255,255,255,0.08)' }} />
        {!isDeclined && activeIdx >= 0 && (
          <div style={{
            position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
            height: 2, backgroundColor: color,
            width: `${(activeIdx / (ORDERED_STAGES.length - 1)) * 100}%`,
            boxShadow: `0 0 8px ${color}55`, transition: 'width 0.8s ease',
          }} />
        )}
        {ORDERED_STAGES.map((stage, idx) => {
          const done   = !isDeclined && idx < activeIdx
          const active = !isDeclined && idx === activeIdx
          const size   = active ? 20 : 14
          return (
            <div key={stage} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                className={active ? 'uf-pulse' : ''}
                style={{
                  width: size, height: size, borderRadius: '50%', flexShrink: 0,
                  backgroundColor: done || active ? color : 'rgba(255,255,255,0.1)',
                  boxShadow: active ? `0 0 12px ${color}88` : 'none',
                  border: active ? `2px solid ${color}` : '1px solid rgba(255,255,255,0.12)',
                }}
              />
              <span style={{
                position: 'absolute', top: '100%', marginTop: 5,
                fontSize: 9, whiteSpace: 'nowrap',
                color: active ? color : BRAND.muted,
                fontWeight: active ? 700 : 400,
              }}>
                {PIPELINE_STAGE_META[stage].shortLabel}
              </span>
            </div>
          )
        })}
      </div>

      {/* Current stage card */}
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: `1px solid ${color}33`, borderRadius: 10, padding: 16,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 10, color: BRAND.muted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>Current Stage</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: isDeclined ? BRAND.danger : color }}>
              {isDeclined ? 'Declined' : meta.label}
            </div>
          </div>
          {!isDeclined && (
            <span style={{
              fontSize: 11, color: account.days_in_stage > 14 ? BRAND.warn : BRAND.muted,
              backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6, padding: '3px 8px',
            }}>{account.days_in_stage}d in stage</span>
          )}
        </div>
        {!isDeclined && (
          <p style={{ fontSize: 12, color: BRAND.muted, lineHeight: 1.6, margin: '0 0 14px' }}>
            {meta.description}
          </p>
        )}

        {/* Checklist */}
        {checklist.length > 0 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: BRAND.muted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Stage Checklist</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: pct === 100 ? BRAND.success : BRAND.muted }}>
                {checked_n}/{checklist.length} · {pct}%
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
              {checklist.map((item, i) => {
                const key = `${account.pipeline_stage}-${i}`
                const isChecked = !!checked[key]
                return (
                  <div
                    key={key}
                    onClick={() => setChecked(p => ({ ...p, [key]: !p[key] }))}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '5px 8px', borderRadius: 6, cursor: 'pointer',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)')}
                  >
                    {isChecked
                      ? <CheckCircle size={14} color={color} />
                      : <Circle size={14} color="rgba(255,255,255,0.2)" />
                    }
                    <span style={{ fontSize: 12, color: isChecked ? BRAND.muted : BRAND.silver, textDecoration: isChecked ? 'line-through' : 'none' }}>
                      {item}
                    </span>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Advance stage */}
        {nextStage && onStageChange && (
          confirming === nextStage ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: BRAND.silver }}>
                Advance to <strong style={{ color }}>{PIPELINE_STAGE_META[nextStage].label}</strong>?
              </span>
              <button
                onClick={() => { onStageChange(account.id, nextStage); setConfirming(null) }}
                style={{ padding: '4px 12px', borderRadius: 5, border: 'none', backgroundColor: color, color: '#0d0d0d', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
              >Confirm</button>
              <button
                onClick={() => setConfirming(null)}
                style={{ padding: '4px 8px', borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: BRAND.muted, fontSize: 11, cursor: 'pointer' }}
              >Cancel</button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(nextStage)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                borderRadius: 7, border: `1px solid ${color}44`, backgroundColor: `${color}12`,
                color, fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = `${color}22` }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = `${color}12` }}
            >
              Advance to {PIPELINE_STAGE_META[nextStage].label}
              <ChevronRight size={14} />
            </button>
          )
        )}
      </div>
    </div>
  )
}

// ─── Main: vertical race track ────────────────────────────────────────────────

interface AccountRaceTrackProps {
  accounts: MerchantAccount[]
  onStageChange?: (accountId: string, stage: PipelineStage) => void
  partnerIso?: string
  partnerName?: string
}

const LABEL_W = 96   // px — left column width (stage labels)
const TRACK_GAP = 16 // px — padding from track line to car zone

export default function AccountRaceTrack({ accounts, onStageChange, partnerIso, partnerName }: AccountRaceTrackProps) {
  const [selected, setSelected] = useState<MerchantAccount | null>(null)

  const handleStageChange = useCallback((id: string, stage: PipelineStage) => {
    onStageChange?.(id, stage)
    setSelected(prev => prev?.id === id ? { ...prev, pipeline_stage: stage, days_in_stage: 0 } : prev)
  }, [onStageChange])

  if (!accounts || accounts.length === 0) return null

  if (selected) {
    const live = accounts.find(a => a.id === selected.id) ?? selected
    return (
      <AccountManageView
        account={{ ...live, pipeline_stage: selected.pipeline_stage, days_in_stage: selected.days_in_stage }}
        partnerIso={partnerIso}
        partnerName={partnerName}
        onBack={() => setSelected(null)}
        onStageChange={handleStageChange}
      />
    )
  }

  const declined = accounts.filter(a => a.pipeline_stage === 'declined')

  return (
    <React.Fragment>
      <style>{`
        @keyframes car-idle {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-2px); }
        }
        .car-idle { animation: car-idle 1.8s ease-in-out infinite; }
        @media (prefers-reduced-motion:reduce) { .car-idle { animation:none; } }
      `}</style>

      <div style={{ width: '100%', position: 'relative' }}>
        {/* Start flag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1, paddingLeft: LABEL_W + 2 + TRACK_GAP }}>
          <span style={{ fontSize: 11 }}>🚦</span>
          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>Start</span>
        </div>

        {/* Stage rows */}
        {ORDERED_STAGES.map((stage, idx) => {
          const meta     = PIPELINE_STAGE_META[stage]
          const cars     = accounts.filter(a => a.pipeline_stage === stage)
          const isFinish = stage === 'merchant_live'
          const hasCars  = cars.length > 0
          const nodeColor = isFinish ? '#F0B23E' : BRAND.cyan

          return (
            <div
              key={stage}
              style={{
                display: 'flex',
                alignItems: hasCars ? 'flex-start' : 'center',
                position: 'relative',
                // occupied rows auto-expand; empty rows are one tight line
                minHeight: hasCars ? 'auto' : 0,
              }}
            >
              {/* Left: track line + label */}
              <div style={{
                width: LABEL_W, minWidth: LABEL_W, flexShrink: 0,
                borderRight: `2px solid ${hasCars ? nodeColor + '55' : 'rgba(255,255,255,0.07)'}`,
                paddingRight: 10,
                paddingTop:    hasCars ? 10 : 3,
                paddingBottom: hasCars ? 10 : 3,
                display: 'flex', position: 'relative',
                // empty: single line inline; occupied: stacked column
                flexDirection: hasCars ? 'column' : 'row',
                alignItems: hasCars ? 'flex-end' : 'center',
                justifyContent: hasCars ? 'flex-start' : 'flex-end',
                gap: hasCars ? 1 : 5,
              }}>
                {/* Track node */}
                <div style={{
                  position: 'absolute',
                  right: hasCars ? -7 : -5,
                  top: hasCars ? 14 : '50%',
                  transform: hasCars ? 'none' : 'translateY(-50%)',
                  width:  hasCars ? 12 : 7,
                  height: hasCars ? 12 : 7,
                  borderRadius: '50%',
                  backgroundColor: hasCars ? nodeColor : 'rgba(255,255,255,0.06)',
                  border: `${hasCars ? 2 : 1}px solid ${hasCars ? nodeColor : 'rgba(255,255,255,0.1)'}`,
                  boxShadow: hasCars ? `0 0 10px ${nodeColor}55` : 'none',
                  zIndex: 2,
                }} />

                {/* Stage number */}
                <span style={{
                  fontSize: 8, fontWeight: 700, letterSpacing: '0.06em',
                  color: hasCars ? BRAND.muted : 'rgba(255,255,255,0.18)',
                }}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                {/* Stage short label */}
                <span style={{
                  fontSize: hasCars ? 10 : 9, fontWeight: 600,
                  color: hasCars ? BRAND.silver : 'rgba(255,255,255,0.2)',
                  textAlign: 'right', lineHeight: 1.2,
                }}>
                  {meta.shortLabel}
                </span>
                {hasCars && (
                  <span style={{ fontSize: 9, color: nodeColor, fontWeight: 700 }}>
                    {cars.length}×
                  </span>
                )}
              </div>

              {/* Right: car zone */}
              <div style={{
                flex: 1, minWidth: 0,
                paddingLeft: TRACK_GAP,
                paddingTop:    hasCars ? 10 : 3,
                paddingBottom: hasCars ? 10 : 3,
                display: 'flex', alignItems: hasCars ? 'flex-start' : 'center',
                flexWrap: 'wrap', gap: 8,
                borderBottom: idx < ORDERED_STAGES.length - 1
                  ? `1px solid rgba(255,255,255,${hasCars ? '0.05' : '0.02'})`
                  : 'none',
                backgroundColor: hasCars ? `${nodeColor}07` : 'transparent',
              }}>
                {cars.map(a => (
                  <CarCard
                    key={a.id}
                    account={a}
                    partnerIso={partnerIso}
                    partnerName={partnerName}
                    onClick={() => setSelected(a)}
                  />
                ))}
              </div>
            </div>
          )
        })}

        {/* Finish line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2, paddingTop: 5, borderTop: '2px solid rgba(240,178,62,0.35)' }}>
          <div style={{ width: LABEL_W, minWidth: LABEL_W, display: 'flex', justifyContent: 'flex-end', paddingRight: 10 }}>
            <span style={{ fontSize: 12 }}>🏁</span>
          </div>
          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F0B23E' }}>
            Finish — Merchant Live
          </span>
        </div>

        {/* Declined section */}
        {declined.length > 0 && (
          <div style={{ display: 'flex', marginTop: 14, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{
              width: LABEL_W, minWidth: LABEL_W, flexShrink: 0,
              borderRight: `2px solid ${BRAND.danger}44`, paddingRight: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: BRAND.danger }}>Declined</span>
            </div>
            <div style={{ flex: 1, paddingLeft: TRACK_GAP, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              {declined.map(a => (
                <CarCard key={a.id} account={a} partnerIso={partnerIso} partnerName={partnerName} onClick={() => setSelected(a)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}
