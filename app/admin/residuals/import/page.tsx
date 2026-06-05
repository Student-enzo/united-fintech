export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Upload, ArrowLeft } from 'lucide-react'
import ResidualImporter from '@/components/admin/ResidualImporter'

const B = {
  card:   '#282626',
  cyan:   '#90c4cf',
  text:   'rgba(255,255,255,0.85)',
  muted:  'rgba(255,255,255,0.3)',
  border: 'rgba(144,196,207,0.15)',
} as const

export default function ResidualImportPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', 'Poppins', Arial, sans-serif" }}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl mb-6 px-6 py-5"
        style={{ backgroundColor: B.card, border: `1px solid ${B.border}` }}
      >
        <div className="flex items-center gap-4 mb-3">
          <Link
            href="/admin/residuals"
            className="flex items-center gap-1.5 text-xs font-semibold hover:underline"
            style={{ color: B.muted }}
          >
            <ArrowLeft size={12} /> Residuals
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${B.cyan} 0%, #4A9B7F 100%)` }}
          >
            <Upload size={16} style={{ color: '#1c1c1c' }} />
          </div>
          <div>
            <h1 className="font-bold tracking-widest text-base" style={{ color: B.text }}>
              RESIDUAL STATEMENT IMPORT
            </h1>
            <p className="text-[10px] uppercase tracking-[0.18em] mt-0.5" style={{ color: B.cyan }}>
              United Fintech · Finance · Processor Statement Upload
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed max-w-2xl" style={{ color: B.muted }}>
          Upload processor residual statement CSV files (TSYS, Worldpay, Paysafe, Fiserv, NMI).
          The importer parses merchant rows, detects anomalies against prior-month data,
          and posts approved rows to the residuals table.
        </p>
      </div>

      {/* ── Importer ────────────────────────────────────────────────────────── */}
      <ResidualImporter />
    </div>
  )
}
