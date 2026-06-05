'use client'

import { useState, useRef, useCallback } from 'react'
import {
  Upload, AlertTriangle, CheckCircle2, FileText,
  ChevronDown, X, Clock, Download,
} from 'lucide-react'

// ─── Brand ────────────────────────────────────────────────────────────────────
const B = {
  bg:      '#1c1c1c',
  card:    '#282626',
  cyan:    '#90c4cf',
  text:    'rgba(255,255,255,0.85)',
  muted:   'rgba(255,255,255,0.3)',
  border:  'rgba(144,196,207,0.15)',
  success: '#6EE7B7',
  warn:    '#FCD34D',
  danger:  '#E8504A',
} as const

// ─── Types ────────────────────────────────────────────────────────────────────
type Processor = 'TSYS' | 'Worldpay' | 'Paysafe' | 'Fiserv' | 'NMI'

type ParsedRow = {
  id:           string
  merchant:     string
  volume:       number
  residual:     number
  period:       string
  anomaly:      boolean
  anomalyDelta: number   // % change vs prior month mock
}

type ImportRecord = {
  id:        string
  date:      string
  processor: Processor
  rows:      number
  anomalies: number
  status:    'imported'
}

// ─── Mock prior-month residuals (for anomaly detection) ──────────────────────
const PRIOR_MONTH: Record<string, number> = {
  'Harbor Point Marina':     1_250,
  'Blue Horizon Travel':     1_080,
  'Coastal Auto Group':      1_900,
  'Summit Medical Billing':    610,
  'Skyline Restaurant Group':  690,
  'Atlantic E-Commerce Co':  2_100,
  'Riverside Dental':          400,
  'Pacific Logistics LLC':   2_300,
  'Greenfield Retail':         920,
  'Nexus Digital Agency':      710,
}

// Mock CSV content per processor (for demo parse)
const MOCK_CSV_CONTENT: Record<Processor, ParsedRow[]> = {
  TSYS: [
    { id: 'r1',  merchant: 'Harbor Point Marina',     volume: 487_250, residual: 1_365, period: 'May 2026', anomaly: false, anomalyDelta:  9.2 },
    { id: 'r2',  merchant: 'Blue Horizon Travel',     volume: 312_800, residual: 1_095, period: 'May 2026', anomaly: false, anomalyDelta:  1.4 },
    { id: 'r3',  merchant: 'Coastal Auto Group',      volume: 892_000, residual: 1_962, period: 'May 2026', anomaly: false, anomalyDelta:  3.3 },
    { id: 'r4',  merchant: 'Summit Medical Billing',  volume: 145_600, residual:   655, period: 'May 2026', anomaly: false, anomalyDelta:  7.4 },
    { id: 'r5',  merchant: 'Skyline Restaurant Group',volume: 234_100, residual:   702, period: 'May 2026', anomaly: false, anomalyDelta:  1.7 },
    { id: 'r6',  merchant: 'Atlantic E-Commerce Co',  volume: 678_900, residual: 2_172, period: 'May 2026', anomaly: false, anomalyDelta:  3.4 },
  ],
  Worldpay: [
    { id: 'r7',  merchant: 'Riverside Dental',        volume:  98_300, residual:   413, period: 'May 2026', anomaly: false, anomalyDelta:  3.3 },
    { id: 'r8',  merchant: 'Pacific Logistics LLC',   volume: 1_240_000, residual: 2_356, period: 'May 2026', anomaly: false, anomalyDelta:  2.4 },
    { id: 'r9',  merchant: 'Greenfield Retail',       volume: 356_700, residual:   787, period: 'May 2026', anomaly: true,  anomalyDelta: -14.5 },
    { id: 'r10', merchant: 'Nexus Digital Agency',    volume: 189_400, residual:   720, period: 'May 2026', anomaly: false, anomalyDelta:  1.4 },
  ],
  Paysafe: [
    { id: 'r11', merchant: 'Harbor Point Marina',     volume: 487_250, residual: 1_100, period: 'May 2026', anomaly: true,  anomalyDelta: -12.0 },
    { id: 'r12', merchant: 'Atlantic E-Commerce Co',  volume: 678_900, residual: 1_750, period: 'May 2026', anomaly: true,  anomalyDelta: -16.7 },
  ],
  Fiserv: [
    { id: 'r13', merchant: 'Coastal Auto Group',      volume: 892_000, residual: 2_050, period: 'May 2026', anomaly: false, anomalyDelta:  7.9 },
    { id: 'r14', merchant: 'Summit Medical Billing',  volume: 145_600, residual:   700, period: 'May 2026', anomaly: false, anomalyDelta: 14.8 },
    { id: 'r15', merchant: 'Nexus Digital Agency',    volume: 189_400, residual:   590, period: 'May 2026', anomaly: true,  anomalyDelta: -16.9 },
  ],
  NMI: [
    { id: 'r16', merchant: 'Blue Horizon Travel',     volume: 312_800, residual:   920, period: 'May 2026', anomaly: true,  anomalyDelta: -14.8 },
    { id: 'r17', merchant: 'Skyline Restaurant Group',volume: 234_100, residual:   680, period: 'May 2026', anomaly: false, anomalyDelta: -1.4 },
  ],
}

const MOCK_HISTORY: ImportRecord[] = [
  { id: 'h1', date: '2026-05-02', processor: 'TSYS',     rows: 6,  anomalies: 0, status: 'imported' },
  { id: 'h2', date: '2026-05-04', processor: 'Worldpay', rows: 4,  anomalies: 1, status: 'imported' },
  { id: 'h3', date: '2026-04-01', processor: 'TSYS',     rows: 6,  anomalies: 0, status: 'imported' },
  { id: 'h4', date: '2026-04-03', processor: 'Fiserv',   rows: 3,  anomalies: 0, status: 'imported' },
]

const PROCESSORS: Processor[] = ['TSYS', 'Worldpay', 'Paysafe', 'Fiserv', 'NMI']

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ─── Drop zone ────────────────────────────────────────────────────────────────
function DropZone({ onFile, isDragging, setDragging }: {
  onFile: (name: string) => void
  isDragging: boolean
  setDragging: (v: boolean) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file.name)
  }, [onFile, setDragging])

  return (
    <div
      className="rounded-2xl flex flex-col items-center justify-center gap-3 py-12 px-6 cursor-pointer transition-all"
      style={{
        border: `2px dashed ${isDragging ? B.cyan : B.border}`,
        backgroundColor: isDragging ? 'rgba(144,196,207,0.05)' : 'transparent',
      }}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.txt"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) onFile(file.name)
          e.target.value = ''
        }}
      />
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: isDragging ? 'rgba(144,196,207,0.15)' : 'rgba(255,255,255,0.05)' }}
      >
        <Upload size={22} style={{ color: isDragging ? B.cyan : B.muted }} />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold" style={{ color: B.text }}>
          Drop CSV statement here or{' '}
          <span style={{ color: B.cyan }}>browse</span>
        </p>
        <p className="text-xs mt-1" style={{ color: B.muted }}>
          Supports TSYS, Worldpay, Paysafe, Fiserv, NMI formats
        </p>
      </div>
    </div>
  )
}

// ─── Processor select ─────────────────────────────────────────────────────────
function ProcessorSelect({ value, onChange }: { value: Processor; onChange: (v: Processor) => void }) {
  return (
    <div className="relative">
      <label className="text-[10px] font-bold uppercase tracking-[0.18em] block mb-1.5" style={{ color: B.muted }}>
        Processor
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value as Processor)}
          className="w-full appearance-none rounded-lg px-3 py-2.5 pr-8 text-sm font-semibold cursor-pointer outline-none"
          style={{
            backgroundColor: '#1c1c1c',
            border: `1px solid ${B.border}`,
            color: B.text,
          }}
        >
          {PROCESSORS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: B.muted }} />
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ResidualImporter() {
  const [processor,   setProcessor]   = useState<Processor>('TSYS')
  const [fileName,    setFileName]    = useState<string | null>(null)
  const [isDragging,  setDragging]    = useState(false)
  const [rows,        setRows]        = useState<ParsedRow[] | null>(null)
  const [imported,    setImported]    = useState(false)
  const [history,     setHistory]     = useState<ImportRecord[]>(MOCK_HISTORY)

  function handleFile(name: string) {
    setFileName(name)
    setRows(null)
    setImported(false)
    // Simulate CSV parse: use mock data for the selected processor
    setTimeout(() => {
      setRows(MOCK_CSV_CONTENT[processor] ?? [])
    }, 600)
  }

  function handleImport() {
    if (!rows) return
    const anomalyCount = rows.filter(r => r.anomaly).length
    const record: ImportRecord = {
      id:        `h${Date.now()}`,
      date:      new Date().toISOString().slice(0, 10),
      processor,
      rows:      rows.length,
      anomalies: anomalyCount,
      status:    'imported',
    }
    setHistory(prev => [record, ...prev])
    setImported(true)
  }

  function reset() {
    setFileName(null)
    setRows(null)
    setImported(false)
  }

  const anomalyRows = rows?.filter(r => r.anomaly) ?? []
  const totalResidual = rows?.reduce((s, r) => s + r.residual, 0) ?? 0

  return (
    <div className="space-y-6">
      {/* ── Upload zone ─────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 space-y-5"
        style={{ backgroundColor: B.card, border: `1px solid ${B.border}` }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-5 items-end">
          <ProcessorSelect value={processor} onChange={p => { setProcessor(p); reset() }} />
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.18em] block mb-1.5" style={{ color: B.muted }}>
              Statement Period
            </label>
            <div
              className="rounded-lg px-3 py-2.5 text-sm"
              style={{ backgroundColor: '#1c1c1c', border: `1px solid ${B.border}`, color: B.muted }}
            >
              May 2026 (auto-detected from file)
            </div>
          </div>
        </div>

        {!fileName ? (
          <DropZone onFile={handleFile} isDragging={isDragging} setDragging={setDragging} />
        ) : (
          <div
            className="flex items-center justify-between rounded-xl px-4 py-3"
            style={{ backgroundColor: '#1c1c1c', border: `1px solid ${B.border}` }}
          >
            <div className="flex items-center gap-3">
              <FileText size={16} style={{ color: B.cyan }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: B.text }}>{fileName}</p>
                <p className="text-[10px]" style={{ color: B.muted }}>
                  {rows === null ? 'Parsing...' : `${rows.length} rows parsed · ${processor}`}
                </p>
              </div>
            </div>
            <button onClick={reset} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
              <X size={14} style={{ color: B.muted }} />
            </button>
          </div>
        )}
      </div>

      {/* ── Preview table ────────────────────────────────────────────────────── */}
      {rows && !imported && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: B.card, border: `1px solid ${B.border}` }}
        >
          {/* Table header */}
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${B.border}` }}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: B.cyan }}>
                Statement Preview — {processor}
              </p>
              <p className="text-xs mt-0.5" style={{ color: B.muted }}>
                {rows.length} merchants · Total residual: {fmt(totalResidual)}
                {anomalyRows.length > 0 && (
                  <span style={{ color: B.danger }}> · {anomalyRows.length} anomaly detected</span>
                )}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[580px]">
              <thead>
                <tr style={{ borderBottom: `1px solid ${B.border}` }}>
                  {['Merchant', 'Volume', 'Residual', 'Period', 'vs Prior Month'].map(h => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em]"
                      style={{ color: 'rgba(144,196,207,0.7)', backgroundColor: '#1c1c1c' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-white/[0.025]"
                    style={{
                      borderBottom: i < rows.length - 1 ? `1px solid ${B.border}` : 'none',
                      backgroundColor: row.anomaly ? 'rgba(232,80,74,0.05)' : 'transparent',
                    }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {row.anomaly && <AlertTriangle size={12} style={{ color: B.danger, flexShrink: 0 }} />}
                        <span className="text-sm font-medium" style={{ color: row.anomaly ? B.danger : B.text }}>
                          {row.merchant}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm" style={{ color: B.text, fontVariantNumeric: 'tabular-nums' }}>
                        {fmt(row.volume)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-bold" style={{ color: B.text, fontVariantNumeric: 'tabular-nums' }}>
                        {fmt(row.residual)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs" style={{ color: B.muted }}>{row.period}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          color: row.anomaly ? B.danger : row.anomalyDelta >= 0 ? B.success : B.warn,
                          backgroundColor: row.anomaly ? 'rgba(232,80,74,0.12)'
                            : row.anomalyDelta >= 0 ? 'rgba(110,231,183,0.10)' : 'rgba(252,211,77,0.10)',
                        }}
                      >
                        {row.anomalyDelta >= 0 ? '+' : ''}{row.anomalyDelta.toFixed(1)}%
                        {row.anomaly && ' ⚠'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Anomaly summary */}
          {anomalyRows.length > 0 && (
            <div
              className="px-5 py-3 flex items-start gap-2"
              style={{ borderTop: `1px solid rgba(232,80,74,0.2)`, backgroundColor: 'rgba(232,80,74,0.05)' }}
            >
              <AlertTriangle size={13} style={{ color: B.danger, flexShrink: 0, marginTop: 1 }} />
              <p className="text-xs" style={{ color: B.danger }}>
                <strong>{anomalyRows.length} anomaly flagged:</strong>{' '}
                {anomalyRows.map(r => `${r.merchant} (${r.anomalyDelta.toFixed(1)}%)`).join(', ')} — residual differs &gt;15% vs prior month. Review before importing.
              </p>
            </div>
          )}

          {/* Import actions */}
          <div className="flex items-center justify-between px-5 py-4" style={{ borderTop: `1px solid ${B.border}` }}>
            <button
              className="flex items-center gap-2 text-xs font-semibold hover:underline"
              style={{ color: B.muted }}
              onClick={() => {
                const csv = ['Merchant,Volume,Residual,Period,Delta%',
                  ...rows.map(r => `${r.merchant},${r.volume},${r.residual},${r.period},${r.anomalyDelta}`)
                ].join('\n')
                const blob = new Blob([csv], { type: 'text/csv' })
                const url  = URL.createObjectURL(blob)
                const a    = document.createElement('a'); a.href = url
                a.download = `residual-import-${processor}-${Date.now()}.csv`; a.click()
                URL.revokeObjectURL(url)
              }}
            >
              <Download size={12} /> Export CSV
            </button>
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
              style={{ backgroundColor: B.cyan, color: '#1c1c1c' }}
              onClick={handleImport}
            >
              <CheckCircle2 size={14} />
              Approve &amp; Import {rows.length} Rows
            </button>
          </div>
        </div>
      )}

      {/* ── Success banner ───────────────────────────────────────────────────── */}
      {imported && (
        <div
          className="rounded-2xl px-5 py-4 flex items-center gap-3"
          style={{ backgroundColor: 'rgba(110,231,183,0.08)', border: `1px solid rgba(110,231,183,0.25)` }}
        >
          <CheckCircle2 size={18} style={{ color: B.success }} />
          <div>
            <p className="text-sm font-bold" style={{ color: B.success }}>
              Import complete — {rows?.length} rows imported from {processor}
            </p>
            <p className="text-xs mt-0.5" style={{ color: B.muted }}>
              Residuals table updated. View in{' '}
              <a href="/admin/residuals" className="underline" style={{ color: B.cyan }}>Residuals</a>.
            </p>
          </div>
          <button className="ml-auto hover:opacity-70" onClick={reset}>
            <X size={14} style={{ color: B.muted }} />
          </button>
        </div>
      )}

      {/* ── Import history ───────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: B.card, border: `1px solid ${B.border}` }}
      >
        <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${B.border}` }}>
          <Clock size={13} style={{ color: B.muted }} />
          <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: B.muted }}>
            Import History
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${B.border}` }}>
              {['Date', 'Processor', 'Rows', 'Anomalies', 'Status'].map(h => (
                <th
                  key={h}
                  className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em]"
                  style={{ color: 'rgba(144,196,207,0.7)', backgroundColor: '#1c1c1c' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((rec, i) => (
              <tr
                key={rec.id}
                className="transition-colors hover:bg-white/[0.025]"
                style={{ borderBottom: i < history.length - 1 ? `1px solid ${B.border}` : 'none' }}
              >
                <td className="px-5 py-3 text-sm" style={{ color: B.muted }}>{fmtDate(rec.date)}</td>
                <td className="px-5 py-3">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ color: B.cyan, backgroundColor: 'rgba(144,196,207,0.10)' }}
                  >
                    {rec.processor}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm" style={{ color: B.text }}>{rec.rows}</td>
                <td className="px-5 py-3">
                  {rec.anomalies > 0 ? (
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ color: B.danger, backgroundColor: 'rgba(232,80,74,0.10)' }}
                    >
                      {rec.anomalies} flagged
                    </span>
                  ) : (
                    <span className="text-xs" style={{ color: B.muted }}>—</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ color: B.success, backgroundColor: 'rgba(110,231,183,0.10)' }}
                  >
                    Imported
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
