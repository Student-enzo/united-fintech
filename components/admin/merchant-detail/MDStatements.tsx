'use client'

import { useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, FileText, Upload, RotateCcw } from 'lucide-react'
import { BRAND } from '@/lib/brand'
import type { MerchantRecord } from '@/lib/mock-merchants'

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

const STMT_MONTHS = ['Jan', 'Feb', 'Mar']

function SmallBarChart({ data, labels }: { data: number[]; labels: string[] }) {
  const max = Math.max(...data)
  const W = 360
  const H = 120
  const PAD_LEFT = 52
  const PAD_RIGHT = 8
  const PAD_TOP = 24
  const PAD_BOT = 24
  const chartW = W - PAD_LEFT - PAD_RIGHT
  const chartH = H - PAD_TOP - PAD_BOT
  const barW = Math.floor((chartW / data.length) * 0.52)
  const gap = chartW / data.length

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 120 }}>
      {/* Y-axis grid */}
      {[0, 0.5, 1.0].map((t, i) => {
        const tick = Math.round(max * t)
        const y = PAD_TOP + chartH - t * chartH
        return (
          <g key={i}>
            <line x1={PAD_LEFT} y1={y} x2={W - PAD_RIGHT} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={PAD_LEFT - 5} y={y + 4} textAnchor="end" fontSize="8" fill={BRAND.muted}>
              {tick >= 1000 ? `$${Math.round(tick / 1000)}k` : `$${tick}`}
            </text>
          </g>
        )
      })}

      {/* Bars */}
      {data.map((val, i) => {
        const isLast = i === data.length - 1
        const barH = (val / max) * chartH
        const x = PAD_LEFT + gap * i + (gap - barW) / 2
        const y = PAD_TOP + chartH - barH
        return (
          <g key={i}>
            <rect
              x={x} y={y} width={barW} height={barH}
              fill={isLast ? BRAND.cyan : `${BRAND.cyan}B3`}
              fillOpacity={isLast ? 1 : 0.7}
              rx="3" ry="3"
            />
            <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize="7.5" fill={isLast ? BRAND.cyan : BRAND.muted} fontWeight={isLast ? 'bold' : 'normal'}>
              {val >= 1000 ? `$${Math.round(val / 1000)}k` : `$${val}`}
            </text>
            <text x={x + barW / 2} y={PAD_TOP + chartH + 15} textAnchor="middle" fontSize="8.5" fill={isLast ? BRAND.text : BRAND.muted}>
              {labels[i]}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

type AnalysisResults = {
  avgMonthlyDeposits: number
  largestTransaction: number
  nsfCount: number
  monthsAnalyzed: number
  deposits: number[]
}

export default function MDStatements({ merchant: m }: { merchant: MerchantRecord }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null)

  function handleFile(file: File) {
    setUploadedFile(file.name)
    setAnalyzed(false)
    setAnalysisResults(null)
  }

  function runAnalysis() {
    setAnalyzing(true)
    setTimeout(() => {
      const results: AnalysisResults = {
        avgMonthlyDeposits: Math.round(m.monthly_volume * 0.97),
        largestTransaction: Math.round(m.avg_ticket * 8.5),
        nsfCount: m.risk === 'high' ? 3 : m.risk === 'medium' ? 1 : 0,
        monthsAnalyzed: 3,
        deposits: [0.82, 0.89, 0.97].map(f => Math.round(m.monthly_volume * f)),
      }
      setAnalysisResults(results)
      setAnalyzing(false)
      setAnalyzed(true)
    }, 1500)
  }

  function reset() {
    setUploadedFile(null)
    setAnalyzing(false)
    setAnalyzed(false)
    setAnalysisResults(null)
  }

  const results = analysisResults

  // Compute risk flags when results are available
  const flags: { msg: string; level: 'warn' | 'danger' | 'ok' }[] = []
  if (results) {
    if (results.nsfCount > 2) {
      flags.push({ msg: `${results.nsfCount} NSF events detected in 3-month period`, level: 'danger' })
    } else if (results.nsfCount > 0) {
      flags.push({ msg: `${results.nsfCount} NSF event on record`, level: 'warn' })
    }
    if (results.largestTransaction > results.avgMonthlyDeposits * 0.4) {
      flags.push({ msg: 'Large single transaction exceeds 40% of monthly average', level: 'warn' })
    }
    if (results.avgMonthlyDeposits > m.monthly_volume * 1.05) {
      flags.push({ msg: 'Deposits exceed declared processing volume — review recommended', level: 'warn' })
    }
    if (flags.length === 0) {
      flags.push({ msg: 'No risk flags detected in statement analysis', level: 'ok' })
    }
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Upload area — hidden when analyzed */}
      {!analyzed && (
        <div className="rounded-2xl p-5" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: BRAND.muted }}>
            Bank Statement Analysis
          </p>

          {/* Drop zone */}
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
            onClick={() => fileRef.current?.click()}
            className="transition-all"
            style={{
              border: `2px dashed ${uploadedFile ? BRAND.success + '66' : BRAND.borderCyan}`,
              borderRadius: 16,
              cursor: 'pointer',
              padding: 32,
              textAlign: 'center',
              backgroundColor: uploadedFile ? `${BRAND.success}08` : 'rgba(144,196,207,0.03)',
            }}
          >
            <input
              type="file"
              accept=".pdf"
              ref={fileRef}
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />

            {uploadedFile ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${BRAND.success}18`, border: `1px solid ${BRAND.success}44` }}>
                  <CheckCircle2 size={20} style={{ color: BRAND.success }} />
                </div>
                <p className="text-sm font-semibold" style={{ color: BRAND.success }}>File ready</p>
                <p className="text-xs" style={{ color: BRAND.muted }}>{uploadedFile}</p>
                <p className="text-[10px] mt-1" style={{ color: BRAND.muted }}>Click to replace</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2.5">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${BRAND.cyan}14`, border: `1px solid ${BRAND.borderCyan}` }}>
                  <Upload size={18} style={{ color: BRAND.cyan }} />
                </div>
                <p className="text-sm font-semibold" style={{ color: BRAND.text }}>
                  Drop bank statement PDF here
                </p>
                <p className="text-xs" style={{ color: BRAND.muted }}>or click to browse</p>
                <p className="text-[10px] mt-1 px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: BRAND.muted }}>
                  PDF files only
                </p>
              </div>
            )}
          </div>

          {/* Analyze button */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={runAnalysis}
              disabled={!uploadedFile || analyzing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                backgroundColor: uploadedFile && !analyzing ? BRAND.cyan : 'rgba(255,255,255,0.06)',
                color: uploadedFile && !analyzing ? BRAND.bg : BRAND.muted,
                cursor: uploadedFile && !analyzing ? 'pointer' : 'not-allowed',
                border: 'none',
                opacity: uploadedFile && !analyzing ? 1 : 0.6,
              }}
            >
              {analyzing ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <FileText size={14} />
                  Analyze Statement
                </>
              )}
            </button>
            {uploadedFile && !analyzing && (
              <p className="text-[10px]" style={{ color: BRAND.muted }}>
                AI-powered analysis of 3-month statement
              </p>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {analyzed && results && (
        <>
          {/* Summary KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: 'Avg Monthly Deposits',
                value: fmtCurrency(results.avgMonthlyDeposits),
                color: BRAND.cyan,
              },
              {
                label: 'Largest Transaction',
                value: fmtCurrency(results.largestTransaction),
                color: BRAND.text,
              },
              {
                label: 'NSF Events',
                value: String(results.nsfCount),
                color: results.nsfCount > 0 ? BRAND.danger : BRAND.success,
              },
              {
                label: 'Months Analyzed',
                value: String(results.monthsAnalyzed),
                color: BRAND.muted,
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="p-4 rounded-2xl flex flex-col gap-1.5"
                style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}
              >
                <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: BRAND.muted }}>
                  {label}
                </span>
                <span className="text-2xl font-bold" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>

          {/* 2-col: chart + flags */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

            {/* Monthly deposit chart */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: BRAND.muted }}>
                  Monthly Deposits
                </p>
                <span className="text-xs" style={{ color: BRAND.muted }}>
                  {uploadedFile}
                </span>
              </div>
              <SmallBarChart data={results.deposits} labels={STMT_MONTHS} />
            </div>

            {/* Risk flags */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: BRAND.card, border: `1px solid ${BRAND.border}` }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: BRAND.muted }}>
                Risk Flags
              </p>
              <div className="flex flex-col gap-2.5">
                {flags.map((flag, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl"
                    style={{
                      backgroundColor:
                        flag.level === 'ok'
                          ? 'rgba(61,214,140,0.06)'
                          : flag.level === 'danger'
                          ? 'rgba(232,80,74,0.06)'
                          : 'rgba(240,178,62,0.06)',
                      border: `1px solid ${
                        flag.level === 'ok'
                          ? 'rgba(61,214,140,0.2)'
                          : flag.level === 'danger'
                          ? 'rgba(232,80,74,0.2)'
                          : 'rgba(240,178,62,0.2)'
                      }`,
                    }}
                  >
                    {flag.level === 'ok' ? (
                      <CheckCircle2 size={13} className="flex-shrink-0 mt-0.5" style={{ color: BRAND.success }} />
                    ) : (
                      <AlertTriangle
                        size={13}
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: flag.level === 'danger' ? BRAND.danger : BRAND.warn }}
                      />
                    )}
                    <span
                      className="text-xs"
                      style={{
                        color:
                          flag.level === 'ok'
                            ? BRAND.success
                            : flag.level === 'danger'
                            ? BRAND.danger
                            : BRAND.warn,
                      }}
                    >
                      {flag.msg}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* New Analysis button */}
          <div className="flex justify-start">
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: `1px solid ${BRAND.border}`,
                color: BRAND.text,
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={12} />
              New Analysis
            </button>
          </div>
        </>
      )}
    </div>
  )
}
