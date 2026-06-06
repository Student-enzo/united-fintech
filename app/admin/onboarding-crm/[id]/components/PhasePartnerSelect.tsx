'use client'

import { useState, useEffect } from 'react'
import { Bot, RefreshCw, Check } from 'lucide-react'
import { BRAND } from '@/lib/brand'
import { getPartners, createPursuit, updateApplicationPhase } from '@/lib/onboarding-db'
import type {
  OnboardingApplication, PartnerDirectory, OnboardingPursuit,
} from '@/lib/onboarding-types'

interface Props {
  application: OnboardingApplication
  partners: PartnerDirectory[]
  pursuits: OnboardingPursuit[]
  onUpdate: () => void
}

interface AiMatch {
  partner_id: string
  score: number
  reasoning: string
}

const RISK_COLORS: Record<string, string> = {
  low:    BRAND.success,
  medium: BRAND.warn,
  high:   BRAND.danger,
}

const TYPE_COLORS: Record<string, string> = {
  bank:      '#818cf8',
  processor: BRAND.cyan,
  gateway:   '#fb923c',
}

export default function PhasePartnerSelect({ application: app, pursuits, onUpdate }: Props) {
  const [allPartners, setAllPartners]   = useState<PartnerDirectory[]>([])
  const [aiMatches, setAiMatches]       = useState<AiMatch[]>([])
  const [selected, setSelected]         = useState<Set<string>>(new Set())
  const [aiLoading, setAiLoading]       = useState(false)
  const [confirming, setConfirming]     = useState(false)
  const [saving, setSaving]             = useState(false)
  const [loadingPartners, setLoadingPartners] = useState(true)

  const alreadyPursued = pursuits.length > 0

  useEffect(() => {
    getPartners()
      .then(ps => {
        setAllPartners(ps)
        if (ps.length > 0 && !alreadyPursued) {
          // Pre-select all by default until AI runs
        }
      })
      .catch(console.error)
      .finally(() => setLoadingPartners(false))
  }, [alreadyPursued])

  async function runAIMatch() {
    setAiLoading(true)
    try {
      const res = await fetch('/api/ai/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'suggest_partners', applicationId: app.id }),
      })
      const json = await res.json()
      const matches: AiMatch[] = json.matches ?? []
      setAiMatches(matches)
      const preSelected = new Set(matches.filter(m => m.score >= 50).map(m => m.partner_id))
      setSelected(preSelected)
    } catch (e) { console.error(e) }
    setAiLoading(false)
  }

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function confirmPartners() {
    if (selected.size === 0) return
    setSaving(true)
    try {
      for (const partnerId of selected) {
        const p = allPartners.find(x => x.id === partnerId)
        if (!p) continue
        const match = aiMatches.find(m => m.partner_id === partnerId)
        await createPursuit(app.id, partnerId, p.name, match?.score, match?.reasoning)
      }
      await updateApplicationPhase(app.id, 'pursuit')
      onUpdate()
    } catch (e) { console.error(e) }
    setSaving(false)
    setConfirming(false)
  }

  if (loadingPartners) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 rounded-full border-2 animate-spin"
        style={{ borderColor: BRAND.cyan, borderTopColor: 'transparent' }}/>
    </div>
  )

  if (alreadyPursued) return (
    <div className="max-w-2xl space-y-4">
      <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: BRAND.cyan }}>Selected Partners</h2>
      <p className="text-xs" style={{ color: BRAND.muted }}>Partners have been selected and pursuit has begun.</p>
      {pursuits.map(p => (
        <div key={p.id} className="rounded-xl p-4 flex items-center gap-4"
          style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold block" style={{ color: BRAND.text }}>{p.partner_name}</span>
            {p.ai_match_score !== null && (
              <span className="text-xs" style={{ color: BRAND.muted }}>AI match: {p.ai_match_score}%</span>
            )}
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
            style={{ backgroundColor: `${BRAND.success}15`, color: BRAND.success }}>
            Pursuing
          </span>
        </div>
      ))}
    </div>
  )

  const sortedPartners = [...allPartners].sort((a, b) => {
    const sa = aiMatches.find(m => m.partner_id === a.id)?.score ?? 0
    const sb = aiMatches.find(m => m.partner_id === b.id)?.score ?? 0
    return sb - sa
  })

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: BRAND.cyan }}>Partner Selection</h2>
        <button onClick={runAIMatch} disabled={aiLoading}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-75"
          style={{ backgroundColor: 'rgba(144,196,207,0.1)', color: BRAND.cyan, border: `1px solid ${BRAND.borderCyan}` }}>
          {aiLoading ? <><RefreshCw size={13} className="animate-spin"/> Matching…</> : <><Bot size={13}/> Run AI Partner Match</>}
        </button>
      </div>

      {allPartners.length === 0 && (
        <div className="rounded-xl p-8 text-center" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
          <span className="text-sm" style={{ color: BRAND.muted }}>No active partners in directory.</span>
        </div>
      )}

      {sortedPartners.map(partner => {
        const isSelected = selected.has(partner.id)
        const match      = aiMatches.find(m => m.partner_id === partner.id)
        const riskColor  = RISK_COLORS[partner.risk_appetite] ?? BRAND.muted
        const typeColor  = TYPE_COLORS[partner.type] ?? BRAND.muted
        const score      = match?.score ?? null

        return (
          <div key={partner.id}
            onClick={() => toggle(partner.id)}
            className="rounded-xl p-4 cursor-pointer transition-all"
            style={{
              backgroundColor: BRAND.card,
              border: `1px solid ${isSelected ? BRAND.cyan : BRAND.border}`,
              boxShadow: isSelected ? BRAND.glowCyan : 'none',
            }}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0 w-4 h-4 rounded flex items-center justify-center"
                style={{ backgroundColor: isSelected ? BRAND.cyan : 'rgba(255,255,255,0.08)', border: `1px solid ${isSelected ? BRAND.cyan : BRAND.border}` }}>
                {isSelected && <Check size={10} color={BRAND.bg}/>}
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold" style={{ color: BRAND.text }}>{partner.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                    style={{ backgroundColor: `${typeColor}20`, color: typeColor }}>
                    {partner.type}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                    style={{ backgroundColor: `${riskColor}15`, color: riskColor }}>
                    {partner.risk_appetite} risk
                  </span>
                </div>

                {score !== null && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase" style={{ color: BRAND.muted }}>AI Match</span>
                      <span className="text-xs font-bold" style={{ color: score >= 70 ? BRAND.success : score >= 40 ? BRAND.warn : BRAND.danger }}>
                        {score}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-full rounded-full" style={{
                        width: `${score}%`,
                        backgroundColor: score >= 70 ? BRAND.success : score >= 40 ? BRAND.warn : BRAND.danger,
                      }}/>
                    </div>
                    {match?.reasoning && (
                      <p className="text-xs" style={{ color: BRAND.muted }}>{match.reasoning}</p>
                    )}
                  </div>
                )}

                {partner.training_notes && (
                  <p className="text-xs" style={{ color: BRAND.muted }}>
                    {partner.training_notes.slice(0, 80)}{partner.training_notes.length > 80 ? '…' : ''}
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {allPartners.length > 0 && (
        <div className="sticky bottom-6 rounded-xl px-5 py-4 flex items-center justify-between gap-4"
          style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.borderCyan}`, boxShadow: BRAND.glowCyan }}>
          <span className="text-sm font-semibold" style={{ color: BRAND.silver }}>
            {selected.size} partner{selected.size !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-3">
            {confirming ? (
              <>
                <span className="text-sm" style={{ color: BRAND.warn }}>Begin pursuit with these partners?</span>
                <button onClick={confirmPartners} disabled={saving}
                  className="text-sm font-bold px-5 py-2 rounded-lg"
                  style={{ backgroundColor: BRAND.cyan, color: BRAND.bg }}>
                  {saving ? 'Saving…' : 'Confirm'}
                </button>
                <button onClick={() => setConfirming(false)} className="text-sm" style={{ color: BRAND.muted }}>Cancel</button>
              </>
            ) : (
              <button onClick={() => setConfirming(true)} disabled={selected.size === 0}
                className="text-sm font-bold px-6 py-2.5 rounded-lg transition-opacity hover:opacity-75"
                style={{
                  backgroundColor: selected.size > 0 ? BRAND.cyan : 'rgba(255,255,255,0.06)',
                  color: selected.size > 0 ? BRAND.bg : BRAND.muted,
                  cursor: selected.size > 0 ? 'pointer' : 'not-allowed',
                }}>
                Confirm Selected Partners & Begin Pursuit →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
