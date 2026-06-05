'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Calculator, CheckCircle2, TrendingDown, Save } from 'lucide-react'

// ─── Recharts (SSR-safe) ──────────────────────────────────────────────────────
const ResponsiveContainer = dynamic(
  () => import('recharts').then(m => m.ResponsiveContainer), { ssr: false },
)
const BarChart = dynamic(
  () => import('recharts').then(m => m.BarChart), { ssr: false },
)
const Bar = dynamic(() => import('recharts').then(m => m.Bar), { ssr: false })
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false })
const Cell = dynamic(() => import('recharts').then(m => m.Cell), { ssr: false })

// ─── Brand ────────────────────────────────────────────────────────────────────
const B = {
  bg:     '#1c1c1c',
  card:   '#282626',
  cyan:   '#90c4cf',
  text:   'rgba(255,255,255,0.85)',
  muted:  'rgba(255,255,255,0.3)',
  border: 'rgba(144,196,207,0.15)',
  success:'#6EE7B7',
  warn:   '#FCD34D',
  danger: '#E8504A',
} as const

// ─── Pricing logic ────────────────────────────────────────────────────────────
// Interchange-Plus: blended IC base varies by card-present % and MCC risk.
// Flat Rate: fixed 2.9% (industry default, Stripe-style)
// Tiered: qualified 1.79%, mid-qual 2.39%, non-qual 3.49% (weighted by card mix)

function calcResults(
  volume: number,
  avgTicket: number,
  cardPresentPct: number,
  highRiskMCC: boolean,
) {
  if (volume <= 0 || avgTicket <= 0) return null

  const cnpPct = 1 - cardPresentPct / 100

  // IC base: card-present blended ~1.65%, CNP ~1.95%
  const icBase = (cardPresentPct / 100) * 0.0165 + cnpPct * 0.0195
  const icRiskAdder = highRiskMCC ? 0.005 : 0
  const icMarkup = 0.003  // 30bps ISO markup
  const icRate = icBase + icRiskAdder + icMarkup

  // Flat Rate: 2.9% standard
  const flatRate = 0.029

  // Tiered: qualified CP, mid-qual mixed, non-qual CNP & rewards
  const qualRate   = 0.0179
  const midRate    = 0.0239
  const nonqualRate= 0.0349 + (highRiskMCC ? 0.005 : 0)
  const qualPct    = (cardPresentPct / 100) * 0.6
  const midPct     = (cardPresentPct / 100) * 0.4 * 0.5 + cnpPct * 0.3
  const nonPct     = 1 - qualPct - midPct
  const tieredRate = qualPct * qualRate + midPct * midRate + nonPct * nonqualRate

  // Per-transaction fee estimate
  const txCount = Math.round(volume / avgTicket)
  const txFee   = 0.10  // $0.10 per transaction standard

  const monthlyCost = (rate: number) => volume * rate + txCount * txFee
  const annualCost  = (rate: number) => monthlyCost(rate) * 12
  const annualSavings = (rate: number) => annualCost(0.03) - annualCost(rate)  // vs 3% flat industry default

  return {
    ic: {
      name: 'Interchange-Plus',
      rate: icRate,
      monthly: monthlyCost(icRate),
      annual:  annualCost(icRate),
      savings: annualSavings(icRate),
      color:   B.cyan,
      details: `IC base ${(icBase * 100).toFixed(2)}% + ${(icMarkup * 100).toFixed(0)}bps markup${highRiskMCC ? ' + 50bps risk' : ''}`,
    },
    flat: {
      name: 'Flat Rate',
      rate: flatRate,
      monthly: monthlyCost(flatRate),
      annual:  annualCost(flatRate),
      savings: annualSavings(flatRate),
      color:   B.warn,
      details: '2.90% flat on all transaction types',
    },
    tiered: {
      name: 'Tiered',
      rate: tieredRate,
      monthly: monthlyCost(tieredRate),
      annual:  annualCost(tieredRate),
      savings: annualSavings(tieredRate),
      color:   '#A78BFA',
      details: `Qual ${(qualRate*100).toFixed(2)}% / Mid ${(midRate*100).toFixed(2)}% / Non-Qual ${(nonqualRate*100).toFixed(2)}%`,
    },
  }
}

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}
function fmtPct(n: number) {
  return `${(n * 100).toFixed(2)}%`
}

// ─── Slider ───────────────────────────────────────────────────────────────────
function Slider({ label, value, min, max, step, onChange, format }: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; format: (v: number) => string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: B.muted }}>
          {label}
        </label>
        <span className="text-sm font-bold" style={{ color: B.cyan }}>{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-[#90c4cf] cursor-pointer"
        style={{ accentColor: B.cyan }}
      />
      <div className="flex justify-between text-[9px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────────
function NumInput({ label, value, prefix, onChange }: {
  label: string; value: string; prefix?: string; onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: B.muted }}>
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-lg px-3 py-2.5"
        style={{ backgroundColor: '#1c1c1c', border: `1px solid ${B.border}` }}>
        {prefix && <span className="text-sm font-bold" style={{ color: B.muted }}>{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 bg-transparent text-sm font-bold outline-none min-w-0"
          style={{ color: B.text }}
        />
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function RateCalculator() {
  const [volume,    setVolume]    = useState('250000')
  const [avgTicket, setAvgTicket] = useState('85')
  const [cpPct,     setCpPct]     = useState(60)
  const [highRisk,  setHighRisk]  = useState(false)

  const results = useMemo(
    () => calcResults(parseFloat(volume) || 0, parseFloat(avgTicket) || 0, cpPct, highRisk),
    [volume, avgTicket, cpPct, highRisk],
  )

  const models = results ? [results.ic, results.flat, results.tiered] : []
  const bestFit = results
    ? [results.ic, results.flat, results.tiered].reduce((a, b) => a.monthly < b.monthly ? a : b)
    : null

  const chartData = models.map(m => ({
    name:  m.name.replace('Interchange-Plus', 'IC+'),
    cost:  Math.round(m.monthly),
    color: m.color,
  }))

  return (
    <div className="space-y-6">
      {/* ── Inputs ──────────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
        style={{ backgroundColor: B.card, border: `1px solid ${B.border}` }}
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 mb-1">
            <Calculator size={15} style={{ color: B.cyan }} />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: B.cyan }}>
              Merchant Profile
            </p>
          </div>
          <NumInput
            label="Estimated Monthly Volume ($)"
            value={volume}
            prefix="$"
            onChange={setVolume}
          />
          <NumInput
            label="Average Ticket ($)"
            value={avgTicket}
            prefix="$"
            onChange={setAvgTicket}
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={15} style={{ color: B.cyan }} />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: B.cyan }}>
              Risk Parameters
            </p>
          </div>
          <Slider
            label="Card-Present %"
            value={cpPct}
            min={0}
            max={100}
            step={5}
            onChange={setCpPct}
            format={v => `${v}%`}
          />
          {/* High-Risk MCC toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: B.muted }}>
                High-Risk MCC
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.2)' }}>
                CBD, gambling, adult, pharma
              </p>
            </div>
            <button
              onClick={() => setHighRisk(r => !r)}
              className="relative w-11 h-6 rounded-full transition-colors"
              style={{ backgroundColor: highRisk ? B.danger : 'rgba(255,255,255,0.12)' }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
                style={{
                  backgroundColor: '#fff',
                  left: highRisk ? '1.375rem' : '0.125rem',
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ── Results grid ────────────────────────────────────────────────────── */}
      {results && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {models.map(m => {
              const isBest = m.name === bestFit?.name
              return (
                <div
                  key={m.name}
                  className="rounded-2xl p-5 flex flex-col gap-3 relative"
                  style={{
                    backgroundColor: B.card,
                    border: `1px solid ${isBest ? m.color : B.border}`,
                    boxShadow: isBest ? `0 0 0 1px ${m.color}30` : 'none',
                  }}
                >
                  {isBest && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1"
                      style={{ backgroundColor: m.color, color: '#1c1c1c' }}
                    >
                      <CheckCircle2 size={9} /> Best Fit
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: m.color }}>
                      {m.name}
                    </p>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${m.color}18`, color: m.color }}
                    >
                      {fmtPct(m.rate)}
                    </span>
                  </div>

                  <div>
                    <p className="text-2xl font-bold" style={{ color: B.text, fontVariantNumeric: 'tabular-nums' }}>
                      {fmt(m.monthly)}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: B.muted }}>per month</p>
                  </div>

                  <div
                    className="rounded-lg px-3 py-2 space-y-1"
                    style={{ backgroundColor: '#1c1c1c' }}
                  >
                    <div className="flex justify-between text-[11px]">
                      <span style={{ color: B.muted }}>Annual cost</span>
                      <span style={{ color: B.text, fontVariantNumeric: 'tabular-nums' }}>{fmt(m.annual)}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span style={{ color: B.muted }}>vs 3% flat baseline</span>
                      <span
                        style={{
                          color: m.savings > 0 ? B.success : B.danger,
                          fontVariantNumeric: 'tabular-nums',
                          fontWeight: 700,
                        }}
                      >
                        {m.savings > 0 ? '+' : ''}{fmt(m.savings)}/yr
                      </span>
                    </div>
                  </div>

                  <p className="text-[9px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.25)' }}>
                    {m.details}
                  </p>
                </div>
              )
            })}
          </div>

          {/* ── Bar chart comparison ─────────────────────────────────────────── */}
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: B.card, border: `1px solid ${B.border}` }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-4" style={{ color: B.muted }}>
              Monthly Cost Comparison
            </p>
            <div style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={48}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={v => `$${(v / 1000).toFixed(0)}K`}
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={50}
                  />
                  <Tooltip
                    formatter={(v) => [fmt(typeof v === 'number' ? v : Number(v ?? 0)), 'Monthly Cost']}
                    contentStyle={{ background: '#1c1c1c', border: `1px solid ${B.border}`, borderRadius: 8 }}
                    labelStyle={{ color: B.text, fontWeight: 700 }}
                    itemStyle={{ color: B.muted }}
                  />
                  <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
                    {chartData.map(d => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Save as Proposal ────────────────────────────────────────────── */}
          <div className="flex justify-end">
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
              style={{ backgroundColor: B.cyan, color: '#1c1c1c' }}
              onClick={() => alert('Save as Proposal — wire to /admin/deals/new with prefilled rate data')}
            >
              <Save size={14} />
              Save as Proposal
            </button>
          </div>
        </>
      )}

      {!results && (
        <div
          className="rounded-2xl p-8 flex items-center justify-center"
          style={{ backgroundColor: B.card, border: `1px solid ${B.border}` }}
        >
          <p style={{ color: B.muted }}>Enter monthly volume and average ticket to see rate comparison.</p>
        </div>
      )}
    </div>
  )
}
