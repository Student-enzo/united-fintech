'use client'

import React, { useState, useRef, useCallback } from 'react'
import { BRAND } from '@/lib/brand'
import type { MerchantAccount, PipelineStage } from '@/types/clients'
import { PIPELINE_STAGE_META } from '@/types/clients'

// ─── Stage order (excludes 'declined' — shown as special state) ───────────────

const ORDERED_STAGES: PipelineStage[] = [
  'lead_identified',
  'proposal_sent',
  'agreement_sent',
  'agreement_signed',
  'setup_fee_paid',
  'underwriting',
  'account_activated',
  'merchant_live',
]

function stageIndex(stage: PipelineStage): number {
  const idx = ORDERED_STAGES.indexOf(stage)
  return idx === -1 ? -1 : idx // -1 for 'declined'
}

// Progress 0–100 based on active stage position
function progressPercent(stage: PipelineStage): number {
  if (stage === 'declined') return 0
  const idx = stageIndex(stage)
  if (idx < 0) return 0
  return Math.round((idx / (ORDERED_STAGES.length - 1)) * 100)
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface AccountRaceTrackProps {
  accounts: MerchantAccount[]
  onStageChange?: (accountId: string, stage: PipelineStage) => void
}

interface TooltipState {
  accountId: string
  stageIdx: number
  x: number
  y: number
}

interface PopoverState {
  accountId: string
  currentStage: PipelineStage
  targetStage: PipelineStage
  nodeRef: HTMLElement
}

// ─── Account type badge ───────────────────────────────────────────────────────

function AccountTypeBadge({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    'Card Present': BRAND.cyan,
    'eCommerce':    BRAND.warn,
    'MOTO':         BRAND.silver,
    'ACH':          BRAND.success,
  }
  const color = colorMap[type] ?? BRAND.muted
  return (
    <span style={{
      display:         'inline-block',
      padding:         '1px 6px',
      borderRadius:    4,
      fontSize:        10,
      fontWeight:      600,
      letterSpacing:   '0.06em',
      textTransform:   'uppercase',
      color,
      backgroundColor: `${color}1A`,
      border:          `1px solid ${color}33`,
      whiteSpace:      'nowrap',
    }}>
      {type}
    </span>
  )
}

// ─── Days chip ────────────────────────────────────────────────────────────────

function DaysChip({ days, declined }: { days: number; declined: boolean }) {
  const color = declined ? BRAND.danger : days > 14 ? BRAND.danger : days > 7 ? BRAND.warn : BRAND.muted
  return (
    <span style={{
      display:         'inline-block',
      padding:         '1px 6px',
      borderRadius:    4,
      fontSize:        10,
      color,
      backgroundColor: `${color}14`,
      border:          `1px solid ${color}28`,
      whiteSpace:      'nowrap',
    }}>
      {days}d
    </span>
  )
}

// ─── Single lane ─────────────────────────────────────────────────────────────

interface LaneProps {
  account: MerchantAccount
  onStageChange?: (accountId: string, stage: PipelineStage) => void
  tooltip: TooltipState | null
  setTooltip: (t: TooltipState | null) => void
  popover: PopoverState | null
  setPopover: (p: PopoverState | null) => void
}

function AccountLane({ account, onStageChange, tooltip, setTooltip, popover, setPopover }: LaneProps) {
  const [hovered, setHovered] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  const isDeclined  = account.pipeline_stage === 'declined'
  const activeIdx   = stageIndex(account.pipeline_stage)
  const pct         = progressPercent(account.pipeline_stage)
  const isStalled   = !isDeclined && account.days_in_stage > 14
  const stageMeta   = PIPELINE_STAGE_META[account.pipeline_stage]
  const actionOwner = isDeclined ? null : stageMeta.action_owner

  const CYAN  = BRAND.cyan
  const RED   = BRAND.danger

  const handleNodeClick = useCallback((stage: PipelineStage, el: HTMLElement) => {
    if (!onStageChange || isDeclined) return
    const targetIdx = stageIndex(stage)
    if (targetIdx <= activeIdx) return // no regression
    setPopover({ accountId: account.id, currentStage: account.pipeline_stage, targetStage: stage, nodeRef: el })
  }, [onStageChange, isDeclined, activeIdx, account.id, account.pipeline_stage, setPopover])

  const handleNodeHover = useCallback((stageIdx: number, el: HTMLElement) => {
    const rect = el.getBoundingClientRect()
    const trackRect = trackRef.current?.getBoundingClientRect()
    if (!trackRect) return
    setTooltip({
      accountId: account.id,
      stageIdx,
      x: rect.left - trackRect.left + rect.width / 2,
      y: rect.top - trackRect.top - 4,
    })
  }, [account.id, setTooltip])

  const showTooltipForThis = tooltip?.accountId === account.id
  const showPopoverForThis = popover?.accountId === account.id

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTooltip(null) }}
      style={{
        display:         'flex',
        alignItems:      'center',
        width:           '100%',
        height:          72,
        backgroundColor: hovered ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.02)',
        borderRadius:    10,
        marginBottom:    8,
        border:          isStalled
          ? '1px solid rgba(240,178,62,0.4)'
          : `1px solid ${hovered ? 'rgba(144,196,207,0.25)' : 'transparent'}`,
        boxShadow:       hovered ? '0 0 16px rgba(144,196,207,0.08)' : 'none',
        transition:      'border-color 0.2s, box-shadow 0.2s, background-color 0.2s',
        overflow:        'hidden',
        cursor:          'default',
        position:        'relative',
      }}
    >
      {/* Left info section */}
      <div style={{
        width:        200,
        minWidth:     200,
        padding:      '0 16px',
        display:      'flex',
        flexDirection:'column',
        gap:          4,
        borderRight:  `1px solid rgba(255,255,255,0.06)`,
      }}>
        <span style={{
          fontSize:     13,
          fontWeight:   700,
          color:        BRAND.silver,
          whiteSpace:   'nowrap',
          overflow:     'hidden',
          textOverflow: 'ellipsis',
          lineHeight:   1.2,
        }}>
          {account.account_name}
        </span>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'nowrap' }}>
          <AccountTypeBadge type={account.account_type} />
          <DaysChip days={account.days_in_stage} declined={isDeclined} />
        </div>
        {!isDeclined && actionOwner && (
          <span style={{
            display:         'inline-block',
            marginTop:       3,
            padding:         '1px 6px',
            borderRadius:    4,
            fontSize:        10,
            fontWeight:      600,
            whiteSpace:      'nowrap',
            letterSpacing:   '0.03em',
            ...(actionOwner === 'merchant'
              ? { color: BRAND.warn, backgroundColor: 'rgba(240,178,62,0.12)', border: '1px solid rgba(240,178,62,0.25)' }
              : actionOwner === 'done'
              ? { color: BRAND.success, backgroundColor: 'rgba(110,231,183,0.10)', border: '1px solid rgba(110,231,183,0.22)' }
              : { color: BRAND.muted,  backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }
            ),
          }}>
            {actionOwner === 'merchant' ? '⚡ Action Needed' : actionOwner === 'done' ? '✓ Active' : '⏳ In Progress'}
          </span>
        )}
      </div>

      {/* Race track section */}
      <div
        ref={trackRef}
        style={{ flex: 1, padding: '0 24px', position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
      >
        {/* Track background line */}
        <div style={{
          position:        'absolute',
          left:            24,
          right:           24,
          top:             '50%',
          transform:       'translateY(-50%)',
          height:          2,
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderRadius:    1,
        }} />

        {/* Progress fill */}
        {!isDeclined && (
          <div style={{
            position:        'absolute',
            left:            24,
            top:             '50%',
            transform:       'translateY(-50%)',
            height:          2,
            width:           `${pct}%`,
            backgroundColor: CYAN,
            borderRadius:    1,
            boxShadow:       `0 0 8px rgba(144,196,207,0.4)`,
            transition:      'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }} />
        )}

        {/* Stage nodes */}
        <div style={{
          position:       'absolute',
          left:           24,
          right:          24,
          top:            '50%',
          transform:      'translateY(-50%)',
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
        }}>
          {ORDERED_STAGES.map((stage, idx) => {
            const isCompleted = !isDeclined && idx < activeIdx
            const isActive    = !isDeclined && idx === activeIdx
            const isFuture    = !isDeclined && idx > activeIdx
            const nodeSize    = isActive ? 18 : 12

            const nodeStyle: React.CSSProperties = {
              width:           nodeSize,
              height:          nodeSize,
              borderRadius:    '50%',
              cursor:          onStageChange && !isDeclined && idx > activeIdx ? 'pointer' : 'default',
              transition:      'transform 0.15s, box-shadow 0.15s',
              flexShrink:      0,
              position:        'relative',
              zIndex:          isActive ? 2 : 1,
              ...(isCompleted ? {
                backgroundColor: CYAN,
              } : isActive ? {
                backgroundColor: CYAN,
                boxShadow:       `0 0 12px rgba(144,196,207,0.6), 0 0 24px rgba(144,196,207,0.3)`,
                className:       'uf-pulse',
              } : isFuture ? {
                backgroundColor: 'rgba(255,255,255,0.08)',
                border:          '1px solid rgba(255,255,255,0.12)',
              } : {
                // declined
                backgroundColor: `${RED}33`,
                border:          `1px solid ${RED}55`,
              }),
            }

            return (
              <div
                key={stage}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}
              >
                <div
                  className={isActive ? 'uf-pulse' : ''}
                  role="button"
                  tabIndex={onStageChange && !isDeclined && idx > activeIdx ? 0 : -1}
                  aria-label={`${PIPELINE_STAGE_META[stage].clientLabel}${isActive ? ' — current stage' : isCompleted ? ' — completed' : ' — upcoming'}`}
                  style={nodeStyle}
                  onMouseEnter={(e) => handleNodeHover(idx, e.currentTarget)}
                  onMouseLeave={() => setTooltip(null)}
                  onClick={(e) => handleNodeClick(stage, e.currentTarget)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleNodeClick(stage, e.currentTarget as HTMLElement) }}
                />
                {/* Short label — shown on hover */}
                {hovered && (
                  <span style={{
                    position:   'absolute',
                    top:        42,
                    left:       '50%',
                    transform:  'translateX(-50%)',
                    fontSize:   11,
                    fontFamily: 'monospace',
                    color:      BRAND.muted,
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                  }}>
                    {PIPELINE_STAGE_META[stage].shortLabel}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Always-visible active stage label */}
        {!isDeclined && activeIdx >= 0 && (
          <div style={{
            position:      'absolute',
            bottom:        6,
            left:          24,
            fontSize:      11,
            fontWeight:    600,
            color:         BRAND.cyan,
            letterSpacing: '0.03em',
            pointerEvents: 'none',
          }}>
            {stageMeta.clientLabel}
          </div>
        )}

        {/* Stalled indicator */}
        {isStalled && (
          <div style={{
            position:        'absolute',
            right:           8,
            bottom:          6,
            fontSize:        10,
            fontWeight:      700,
            color:           BRAND.warn,
            letterSpacing:   '0.07em',
            textTransform:   'uppercase',
            backgroundColor: 'rgba(240,178,62,0.08)',
            padding:         '2px 6px',
            borderRadius:    4,
            border:          '1px solid rgba(240,178,62,0.22)',
            pointerEvents:   'none',
          }}>
            Stalled
          </div>
        )}

        {/* Declined overlay label */}
        {isDeclined && (
          <div style={{
            position:        'absolute',
            right:           24,
            top:             '50%',
            transform:       'translateY(-50%)',
            padding:         '2px 10px',
            borderRadius:    4,
            backgroundColor: `${RED}22`,
            border:          `1px solid ${RED}44`,
            fontSize:        11,
            fontWeight:      600,
            color:           RED,
            letterSpacing:   '0.08em',
            textTransform:   'uppercase',
          }}>
            Declined
          </div>
        )}

        {/* Tooltip */}
        {showTooltipForThis && tooltip && (
          <div
            role="tooltip"
            style={{
              position:        'absolute',
              left:            tooltip.x,
              top:             tooltip.y - 32,
              transform:       'translateX(-50%)',
              backgroundColor: '#1e1e1e',
              border:          `1px solid ${BRAND.border}`,
              borderRadius:    6,
              padding:         '6px 12px',
              fontSize:        11,
              color:           BRAND.silver,
              pointerEvents:   'none',
              zIndex:          10,
              boxShadow:       '0 4px 12px rgba(0,0,0,0.5)',
              maxWidth:        240,
              textAlign:       'center',
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 3, color: BRAND.cyan }}>
              {PIPELINE_STAGE_META[ORDERED_STAGES[tooltip.stageIdx]].clientLabel}
            </div>
            <div style={{ fontSize: 10, color: BRAND.muted, lineHeight: 1.4, whiteSpace: 'normal' }}>
              {PIPELINE_STAGE_META[ORDERED_STAGES[tooltip.stageIdx]].description}
            </div>
          </div>
        )}

        {/* Stage advance popover */}
        {showPopoverForThis && popover && onStageChange && (
          <div
            style={{
              position:        'absolute',
              top:             -70,
              left:            '50%',
              transform:       'translateX(-50%)',
              backgroundColor: BRAND.card,
              border:          `1px solid ${BRAND.borderCyan}`,
              borderRadius:    8,
              padding:         '10px 14px',
              zIndex:          20,
              boxShadow:       '0 8px 32px rgba(0,0,0,0.6)',
              display:         'flex',
              alignItems:      'center',
              gap:             10,
              whiteSpace:      'nowrap',
            }}
          >
            <span style={{ fontSize: 12, color: BRAND.silver }}>
              Advance to{' '}
              <strong style={{ color: BRAND.cyan }}>
                {PIPELINE_STAGE_META[popover.targetStage].label}
              </strong>
              ?
            </span>
            <button
              onClick={() => {
                onStageChange(popover.accountId, popover.targetStage)
                setPopover(null)
              }}
              style={{
                padding:         '3px 10px',
                borderRadius:    5,
                border:          'none',
                backgroundColor: BRAND.cyan,
                color:           '#0d0d0d',
                fontSize:        11,
                fontWeight:      700,
                cursor:          'pointer',
              }}
            >
              Confirm
            </button>
            <button
              onClick={() => setPopover(null)}
              style={{
                padding:         '3px 8px',
                borderRadius:    5,
                border:          `1px solid rgba(255,255,255,0.12)`,
                backgroundColor: 'transparent',
                color:           BRAND.muted,
                fontSize:        11,
                cursor:          'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AccountRaceTrack({ accounts, onStageChange }: AccountRaceTrackProps) {
  const [tooltip, setTooltip]   = useState<TooltipState | null>(null)
  const [popover, setPopover]   = useState<PopoverState | null>(null)

  if (!accounts || accounts.length === 0) {
    return null
  }

  return (
    <React.Fragment>
      <style>{`
        @keyframes uf-pulse {
          0%, 100% {
            box-shadow: 0 0 12px rgba(144,196,207,0.6), 0 0 24px rgba(144,196,207,0.3);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 20px rgba(144,196,207,0.9), 0 0 40px rgba(144,196,207,0.5);
            transform: scale(1.15);
          }
        }
        .uf-pulse {
          animation: uf-pulse 2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .uf-pulse { animation: none !important; }
        }
      `}</style>

      <div style={{ width: '100%' }}>
        {accounts.map(account => (
          <AccountLane
            key={account.id}
            account={account}
            onStageChange={onStageChange}
            tooltip={tooltip}
            setTooltip={setTooltip}
            popover={popover}
            setPopover={setPopover}
          />
        ))}
      </div>
    </React.Fragment>
  )
}
