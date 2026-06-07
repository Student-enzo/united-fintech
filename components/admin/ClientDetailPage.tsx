'use client'

import React, { useEffect, useState, useRef, useCallback, DragEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Plus, FileText, File, CreditCard, Building2,
  Upload, ExternalLink, AlertCircle, ChevronRight,
  CheckCircle2, Circle, Pencil, Check, X, RefreshCw, Zap,
  Download, Trash2, Mail,
} from 'lucide-react'
import { BRAND } from '@/lib/brand'
import type { Client, MerchantAccount, ClientDocument, PipelineStage, RiskLevel, AccountType } from '@/types/clients'
import { CRM_STAGE_META } from '@/types/clients'
import { fetchClient, updateAccountStage, fetchDocuments, insertMerchantAccount } from '@/lib/clients-db'
import AccountRaceTrack from './AccountRaceTrack'

// ─── Partner recommendation engine ────────────────────────────────────────────

interface Partner { name: string; iso: string; types: AccountType[]; risks: RiskLevel[]; tagline: string }

const PARTNERS: Partner[] = [
  { name: 'Heartland Payment Systems', iso: 'HPS',    types: ['Card Present','eCommerce','ACH'],           risks: ['low','medium'],         tagline: 'Best for retail, restaurants & hospitality' },
  { name: 'TSYS / Global Payments',    iso: 'TSYS',   types: ['Card Present','eCommerce','MOTO','ACH'],     risks: ['low'],                  tagline: 'Tier-1 processor, preferred for low-risk merchants' },
  { name: 'First Data / Fiserv',       iso: 'FISERV', types: ['Card Present','eCommerce','MOTO'],           risks: ['low','medium'],         tagline: 'High-volume enterprise merchants' },
  { name: 'NMI Gateway',               iso: 'NMI',    types: ['eCommerce','MOTO'],                          risks: ['low','medium','high'],  tagline: 'Flexible gateway for online & MOTO merchants' },
  { name: 'PaymentCloud',              iso: 'PCC',    types: ['Card Present','eCommerce','MOTO','ACH'],     risks: ['medium','high'],        tagline: 'Specializes in high-risk merchant accounts' },
  { name: 'Durango Merchant Services', iso: 'DMS',    types: ['eCommerce','MOTO'],                          risks: ['high'],                 tagline: 'High-risk & offshore-friendly solutions' },
  { name: 'PayKings',                  iso: 'PKG',    types: ['Card Present','eCommerce','MOTO'],           risks: ['high'],                 tagline: 'CBD, adult, firearms & restricted MCCs' },
  { name: 'ACH Genie',                 iso: 'ACHG',   types: ['ACH'],                                       risks: ['low','medium'],         tagline: 'ACH-only, fast next-day settlement' },
  { name: 'Priority Commerce',         iso: 'PRI',    types: ['Card Present','eCommerce','MOTO','ACH'],     risks: ['low','medium'],         tagline: 'Full-service ISO with competitive pricing' },
  { name: 'Payline Data',              iso: 'PLD',    types: ['Card Present','eCommerce'],                  risks: ['low'],                  tagline: 'Small business friendly, transparent pricing' },
]

function getRecommendedPartners(type: AccountType, risk: RiskLevel): Partner[] {
  return PARTNERS.filter(p => p.types.includes(type) && p.risks.includes(risk)).slice(0, 3)
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DOC_TYPES = [
  'Driver License', 'Bank Statement', 'Voided Check', 'Articles of Inc',
  'EIN Letter', 'Processing Statement', 'Business License', 'Lease Agreement',
  'Tax Return', 'Other',
] as const
type DocType = typeof DOC_TYPES[number]

const REQUIRED_DOCS: { label: string; key: DocType; required: boolean }[] = [
  { label: 'Government ID (Driver License)',   key: 'Driver License',       required: true  },
  { label: 'Bank Statements (3 months)',        key: 'Bank Statement',       required: true  },
  { label: 'Voided Check',                     key: 'Voided Check',         required: true  },
  { label: 'Processing Statements (3 months)', key: 'Processing Statement', required: true  },
  { label: 'Articles of Incorporation',         key: 'Articles of Inc',      required: false },
  { label: 'EIN Letter',                       key: 'EIN Letter',           required: false },
  { label: 'Business License',                 key: 'Business License',     required: false },
  { label: 'Lease Agreement',                  key: 'Lease Agreement',      required: false },
  { label: 'Tax Return (last 2 years)',         key: 'Tax Return',           required: false },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function docIcon(t?: string) {
  switch (t) {
    case 'Articles of Inc':      return <Building2 size={14} />
    case 'Voided Check':         return <CreditCard size={14} />
    case 'Driver License':       return <File size={14} />
    default:                     return <FileText size={14} />
  }
}
function docColor(t?: string) {
  switch (t) {
    case 'Articles of Inc':      return BRAND.cyan
    case 'Voided Check':         return BRAND.success
    case 'Driver License':       return BRAND.warn
    case 'Bank Statement':       return BRAND.silver
    case 'Processing Statement': return '#a78bfa'
    default:                     return BRAND.muted
  }
}
const fmt = {
  bytes: (b?: number) => !b ? '' : b < 1024 ? `${b}B` : b < 1048576 ? `${(b/1024).toFixed(0)}KB` : `${(b/1048576).toFixed(1)}MB`,
  date:  (s?: string) => s ? new Date(s).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) : '—',
  money: (n?: number) => n ? `$${n.toLocaleString()}` : '—',
}

// ─── Micro components ─────────────────────────────────────────────────────────

const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ backgroundColor:BRAND.card, borderRadius:12, border:`1px solid ${BRAND.border}`, padding:20, ...style }}>
    {children}
  </div>
)
const RiskDot = ({ risk }: { risk?: RiskLevel }) => {
  const c = risk==='high' ? BRAND.danger : risk==='medium' ? BRAND.warn : BRAND.success
  return <span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%', backgroundColor:c, boxShadow:`0 0 6px ${c}88`, marginRight:6 }} />
}
const Skeleton = ({ w, h=14 }: { w?: number|string; h?: number }) => (
  <div style={{ width:w??'100%', height:h, borderRadius:4, backgroundColor:'rgba(255,255,255,0.06)' }} />
)
const Divider = () => <div style={{ height:1, backgroundColor:'rgba(255,255,255,0.05)', margin:'10px 0' }} />

// ─── DocRow ───────────────────────────────────────────────────────────────────

function DocRow({ doc, onDelete }: { doc: ClientDocument; onDelete: (id: string) => void }) {
  const [requested, setRequested] = useState(false)
  const [hov, setHov] = useState(false)
  const color = docColor(doc.doc_type)
  const btn: React.CSSProperties = {
    display:'flex', alignItems:'center', gap:4, padding:'3px 8px', borderRadius:5,
    border:'1px solid rgba(255,255,255,0.1)', backgroundColor:'transparent',
    color:BRAND.muted, fontSize:10, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0,
  }
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', borderRadius:7, backgroundColor: hov ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)', transition:'background-color 0.15s' }}
    >
      <span style={{ color:BRAND.muted, flexShrink:0 }}>{docIcon(doc.doc_type)}</span>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:12, color:BRAND.silver, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{doc.file_name}</div>
        <div style={{ fontSize:11, color:BRAND.muted }}>{fmt.date(doc.uploaded_at)}{doc.file_size ? ` · ${fmt.bytes(doc.file_size)}` : ''}</div>
      </div>
      {doc.doc_type && (
        <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', color, backgroundColor:`${color}1A`, border:`1px solid ${color}33`, padding:'2px 6px', borderRadius:4, whiteSpace:'nowrap', flexShrink:0 }}>{doc.doc_type}</span>
      )}
      {/* Action buttons — visible on hover */}
      <div style={{ display:'flex', gap:4, alignItems:'center', opacity: hov ? 1 : 0, transition:'opacity 0.15s' }}>
        {/* View */}
        <a
          href={doc.file_url} target="_blank" rel="noopener noreferrer"
          title="View document"
          style={{ ...btn, color:BRAND.cyan, border:'1px solid rgba(144,196,207,0.25)', textDecoration:'none' }}
        >
          <ExternalLink size={10}/>View
        </a>
        {/* Download */}
        <a
          href={doc.file_url} download={doc.file_name}
          title="Download document"
          style={{ ...btn, textDecoration:'none' }}
        >
          <Download size={10}/>Download
        </a>
        {/* Request re-upload */}
        <button
          onClick={() => setRequested(r => !r)}
          title={requested ? 'Re-upload requested' : 'Request merchant to re-upload'}
          style={{ ...btn, color: requested ? BRAND.success : BRAND.muted, border:`1px solid ${requested ? 'rgba(110,231,183,0.3)' : 'rgba(255,255,255,0.1)'}` }}
        >
          <RefreshCw size={10}/>{requested ? 'Sent' : 'Re-request'}
        </button>
        {/* Delete */}
        <button
          onClick={() => onDelete(doc.id)}
          title="Remove document"
          style={{ ...btn, color:BRAND.danger, border:'1px solid rgba(232,80,74,0.25)' }}
        >
          <Trash2 size={10}/>
        </button>
      </div>
    </div>
  )
}

// ─── RequiredDocRow ───────────────────────────────────────────────────────────

function RequiredDocRow({
  rd, submitted, contactEmail, clientId, onUploaded,
}: {
  rd: { label: string; key: DocType; required: boolean }
  submitted: boolean
  contactEmail: string
  clientId: string
  onUploaded: (d: ClientDocument) => void
}) {
  const uploadRef = useRef<HTMLInputElement>(null)
  const mailtoLink = `mailto:${contactEmail}?subject=Document Request: ${encodeURIComponent(rd.label)}&body=${encodeURIComponent(`Hello,\n\nWe need the following document to process your merchant account:\n\n${rd.label}\n\nPlease reply to this email with the document attached.\n\nThank you.`)}`

  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 6px', borderRadius:6, backgroundColor:'rgba(255,255,255,0.015)', border:'1px solid rgba(255,255,255,0.05)' }}>
      {submitted
        ? <CheckCircle2 size={13} color={BRAND.success} style={{ flexShrink:0 }}/>
        : <Circle size={13} color={rd.required ? BRAND.danger : BRAND.muted} style={{ flexShrink:0 }}/>
      }
      <span style={{ flex:1, fontSize:11, color:submitted ? BRAND.silver : rd.required ? BRAND.danger : BRAND.muted }}>{rd.label}</span>
      <div style={{ display:'flex', gap:4, alignItems:'center' }}>
        {submitted ? (
          <span style={{ fontSize:10, fontWeight:600, padding:'1px 6px', borderRadius:4, color:BRAND.success, backgroundColor:'rgba(110,231,183,0.10)', border:'1px solid rgba(110,231,183,0.22)' }}>✓ Received</span>
        ) : (
          <>
            <button
              onClick={() => uploadRef.current?.click()}
              style={{ display:'flex', alignItems:'center', gap:4, padding:'2px 7px', borderRadius:4, border:'1px solid rgba(144,196,207,0.3)', backgroundColor:'rgba(144,196,207,0.06)', color:BRAND.cyan, fontSize:10, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' }}
            >
              <Upload size={9}/>Upload
            </button>
            <input
              ref={uploadRef} type="file" style={{ display:'none' }}
              onChange={e => {
                const f = e.target.files?.[0]; if (!f) return
                onUploaded({ id:`upload-${Date.now()}`, client_id:clientId, file_name:f.name, file_url:URL.createObjectURL(f), doc_type:rd.key, file_size:f.size, uploaded_at:new Date().toISOString() })
                e.target.value = ''
              }}
            />
            {contactEmail && (
              <a href={mailtoLink} style={{ display:'flex', alignItems:'center', gap:4, padding:'2px 7px', borderRadius:4, border:'1px solid rgba(255,255,255,0.1)', backgroundColor:'transparent', color:BRAND.muted, fontSize:10, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap', textDecoration:'none' }}>
                <Mail size={9}/>Request
              </a>
            )}
            <span style={{ fontSize:10, fontWeight:600, padding:'1px 5px', borderRadius:4, color:rd.required ? BRAND.danger : BRAND.muted, backgroundColor:rd.required ? 'rgba(232,80,74,0.08)' : 'rgba(255,255,255,0.04)', border:`1px solid ${rd.required ? 'rgba(232,80,74,0.22)' : 'rgba(255,255,255,0.08)'}` }}>
              {rd.required ? 'Missing' : 'Optional'}
            </span>
          </>
        )}
      </div>
    </div>
  )
}

// ─── AddAccountModal ──────────────────────────────────────────────────────────

function AddAccountModal({
  clientId, client, onClose, onAdded,
}: {
  clientId: string
  client: Client | null
  onClose: () => void
  onAdded: (a: MerchantAccount, partner?: Partner) => void
}) {
  const [form, setForm] = useState({
    account_name: '', account_type: 'Card Present' as AccountType, mcc: '', mcc_label: '', risk: 'low' as RiskLevel,
  })
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string|null>(null)

  const recommendations = getRecommendedPartners(form.account_type, form.risk)

  // Auto-select first match whenever type/risk changes
  React.useEffect(() => {
    const recs = getRecommendedPartners(form.account_type, form.risk)
    setSelectedPartner(recs[0] ?? null)
  }, [form.account_type, form.risk])

  const inp: React.CSSProperties = { width:'100%', backgroundColor:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'8px 10px', fontSize:13, color:BRAND.silver, outline:'none', boxSizing:'border-box' }
  const lbl: React.CSSProperties = { display:'block', fontSize:11, color:BRAND.muted, marginBottom:4, fontWeight:600, letterSpacing:'0.04em' }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.account_name.trim()) { setErr('Account name required.'); return }
    setLoading(true); setErr(null)
    const now = new Date().toISOString()
    const base = {
      client_id: clientId, account_name: form.account_name.trim(), account_type: form.account_type,
      mcc: form.mcc.trim()||undefined, mcc_label: form.mcc_label.trim()||undefined, risk: form.risk,
      pipeline_stage: 'lead_identified' as PipelineStage, days_in_stage: 0,
      monthly_volume: 0, avg_ticket: 0, card_present_pct: 0, date_added: now.slice(0,10),
    }
    try { onAdded(await insertMerchantAccount(base), selectedPartner ?? undefined) }
    catch { onAdded({ id:`local-${Date.now()}`, created_at:now, ...base }, selectedPartner ?? undefined) }
    setLoading(false)
  }

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.72)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div onClick={e=>e.stopPropagation()} style={{ backgroundColor:BRAND.card, border:`1px solid ${BRAND.border}`, borderRadius:14, padding:28, width:500, maxWidth:'93vw', boxShadow:'0 24px 64px rgba(0,0,0,0.75)', maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ fontSize:16, fontWeight:700, color:BRAND.silver, marginBottom:20 }}>Add Merchant Account</div>
        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <label style={lbl}>Account Name *</label>
            <input style={inp} value={form.account_name} onChange={e=>setForm(f=>({...f,account_name:e.target.value}))} placeholder="e.g. Main Retail Account"/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={lbl}>Account Type</label>
              <select style={{...inp,cursor:'pointer'}} value={form.account_type} onChange={e=>setForm(f=>({...f,account_type:e.target.value as AccountType}))}>
                {(['Card Present','eCommerce','MOTO','ACH'] as const).map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Risk Level</label>
              <select style={{...inp,cursor:'pointer'}} value={form.risk} onChange={e=>setForm(f=>({...f,risk:e.target.value as RiskLevel}))}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:12 }}>
            <div>
              <label style={lbl}>MCC Code</label>
              <input style={inp} value={form.mcc} onChange={e=>setForm(f=>({...f,mcc:e.target.value}))} placeholder="5411" maxLength={4}/>
            </div>
            <div>
              <label style={lbl}>MCC Label</label>
              <input style={inp} value={form.mcc_label} onChange={e=>setForm(f=>({...f,mcc_label:e.target.value}))} placeholder="Grocery Stores"/>
            </div>
          </div>

          {/* Smart Partner Match */}
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', paddingTop:14 }}>
            <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:10 }}>
              <Zap size={13} color={BRAND.cyan}/>
              <span style={{ fontSize:11, fontWeight:700, color:BRAND.cyan, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                Smart Partner Match
              </span>
              <span style={{ fontSize:10, color:BRAND.muted }}>— auto-selected based on account type & risk</span>
            </div>

            {recommendations.length === 0 ? (
              <p style={{ fontSize:12, color:BRAND.muted, margin:0 }}>No partners matched — adjust account type or risk.</p>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                {recommendations.map((p, i) => {
                  const active = selectedPartner?.iso === p.iso
                  return (
                    <div
                      key={p.iso}
                      onClick={() => setSelectedPartner(active ? null : p)}
                      style={{
                        display:'flex', alignItems:'center', gap:10, padding:'9px 12px',
                        borderRadius:8, cursor:'pointer', transition:'all 0.18s',
                        backgroundColor: active ? `${BRAND.cyan}12` : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${active ? BRAND.cyan + '55' : 'rgba(255,255,255,0.08)'}`,
                        boxShadow: active ? `0 0 12px ${BRAND.cyan}18` : 'none',
                      }}
                    >
                      {/* Rank badge */}
                      <span style={{
                        width:20, height:20, borderRadius:'50%', flexShrink:0,
                        backgroundColor: i === 0 ? '#F0B23E22' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${i === 0 ? '#F0B23E55' : 'rgba(255,255,255,0.1)'}`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:9, fontWeight:700,
                        color: i === 0 ? '#F0B23E' : BRAND.muted,
                      }}>
                        {i === 0 ? '★' : i + 1}
                      </span>

                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12, fontWeight:700, color: active ? BRAND.cyan : BRAND.silver, marginBottom:2 }}>
                          {p.name}
                          <span style={{ fontSize:10, color:BRAND.muted, fontWeight:400, marginLeft:6 }}>[{p.iso}]</span>
                        </div>
                        <div style={{ fontSize:11, color:BRAND.muted }}>{p.tagline}</div>
                      </div>

                      {active && (
                        <CheckCircle2 size={16} color={BRAND.cyan} style={{ flexShrink:0 }}/>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {selectedPartner && (
              <div style={{ marginTop:8, fontSize:11, color:BRAND.muted }}>
                This will set <strong style={{ color:BRAND.silver }}>{selectedPartner.name}</strong> as the partner for this client.
              </div>
            )}
          </div>

          {err && <div style={{ display:'flex', alignItems:'center', gap:6, color:BRAND.danger, fontSize:12 }}><AlertCircle size={12}/>{err}</div>}
          <div style={{ display:'flex', gap:10, marginTop:4 }}>
            <button type="submit" disabled={loading} style={{ flex:1, padding:'9px 0', borderRadius:7, border:'none', backgroundColor:BRAND.cyan, color:'#0d0d0d', fontWeight:700, fontSize:13, cursor:loading?'not-allowed':'pointer', opacity:loading?0.7:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              <Plus size={14}/>{loading?'Adding…':'Add Account'}
            </button>
            <button type="button" onClick={onClose} style={{ padding:'9px 18px', borderRadius:7, border:'1px solid rgba(255,255,255,0.1)', backgroundColor:'transparent', color:BRAND.muted, fontSize:13, cursor:'pointer' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── UploadZone ───────────────────────────────────────────────────────────────

function UploadZone({ clientId, onUploaded }: { clientId:string; onUploaded:(d:ClientDocument)=>void }) {
  const [dragOver, setDragOver] = useState(false)
  const [docType, setDocType]   = useState<DocType>('Other')
  const inputRef                = useRef<HTMLInputElement>(null)
  const handle = useCallback((files: FileList|null) => {
    if (!files) return
    Array.from(files).forEach(f => onUploaded({ id:`upload-${Date.now()}-${Math.random().toString(36).slice(2)}`, client_id:clientId, file_name:f.name, file_url:URL.createObjectURL(f), doc_type:docType, file_size:f.size, uploaded_at:new Date().toISOString() }))
  }, [clientId, docType, onUploaded])
  return (
    <div style={{ marginTop:12 }}>
      <div style={{ marginBottom:8, display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ fontSize:11, color:BRAND.muted }}>Type:</span>
        <select value={docType} onChange={e=>setDocType(e.target.value as DocType)} style={{ backgroundColor:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:5, padding:'3px 8px', fontSize:11, color:BRAND.silver, cursor:'pointer', outline:'none' }}>
          {DOC_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div onClick={()=>inputRef.current?.click()} onDragOver={e=>{e.preventDefault();setDragOver(true)}} onDragLeave={()=>setDragOver(false)} onDrop={(e:DragEvent<HTMLDivElement>)=>{e.preventDefault();setDragOver(false);handle(e.dataTransfer.files)}}
        style={{ border:`2px dashed ${dragOver?BRAND.cyan:'rgba(144,196,207,0.3)'}`, borderRadius:8, padding:'20px 16px', display:'flex', flexDirection:'column', alignItems:'center', gap:8, cursor:'pointer', backgroundColor:dragOver?'rgba(144,196,207,0.05)':'transparent', transition:'border-color 0.2s, background-color 0.2s' }}>
        <Upload size={20} color={dragOver?BRAND.cyan:BRAND.muted}/>
        <span style={{ fontSize:12, color:BRAND.muted, textAlign:'center' }}>Drop files here or <span style={{ color:BRAND.cyan }}>browse</span></span>
      </div>
      <input ref={inputRef} type="file" multiple style={{ display:'none' }} onChange={e=>handle(e.target.files)}/>
    </div>
  )
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div style={{ padding:'32px 40px', maxWidth:1200 }}>
      <Skeleton w={80} h={12}/><br/>
      <Skeleton w={280} h={28}/><br/>
      <Skeleton w={200} h={12}/>
      <div style={{ display:'flex', gap:32, marginTop:32 }}>
        <div style={{ flex:3 }}>{[1,2,3].map(i=><Skeleton key={i} h={72}/>)}</div>
        <div style={{ flex:2, display:'flex', flexDirection:'column', gap:16 }}><Skeleton h={280}/><Skeleton h={320}/></div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ClientDetailPage({ clientId }: { clientId: string }) {
  const router = useRouter()
  const [client,    setClient]    = useState<Client|null>(null)
  const [accounts,  setAccounts]  = useState<MerchantAccount[]>([])
  const [documents, setDocuments] = useState<ClientDocument[]>([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string|null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editMode,  setEditMode]  = useState(false)
  const [editForm,  setEditForm]  = useState<Partial<Client>>({})
  const [savingInfo, setSavingInfo] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true); setError(null)
      try {
        const [c, docs] = await Promise.all([fetchClient(clientId), fetchDocuments(clientId)])
        if (cancelled) return
        if (!c) { setError('Client not found.'); setLoading(false); return }
        setClient(c)
        setEditForm({ name:c.name, dba_name:c.dba_name, contact_name:c.contact_name, contact_email:c.contact_email, contact_phone:c.contact_phone, legal_structure:c.legal_structure, partner:c.partner, partner_iso:c.partner_iso, notes:c.notes })
        setAccounts(c.merchant_accounts??[])
        setDocuments(docs)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load client.')
      }
      if (!cancelled) setLoading(false)
    })()
    return () => { cancelled = true }
  }, [clientId])

  const handleStageChange = useCallback(async (accountId: string, stage: PipelineStage) => {
    setAccounts(prev => prev.map(a => a.id===accountId ? {...a, pipeline_stage:stage, days_in_stage:0} : a))
    try { await updateAccountStage(accountId, stage) }
    catch (e) { console.error('[ClientDetailPage] stage update failed:', e) }
  }, [])

  const handleSaveClientInfo = async () => {
    if (!client) return
    setSavingInfo(true)
    try {
      const { supabasePublic } = await import('@/lib/supabase-public')
      await supabasePublic.from('fintech_clients').update(editForm).eq('id', client.id)
      setClient(prev => prev ? { ...prev, ...editForm } : prev)
      setEditMode(false)
    } catch (e) { console.error('[ClientDetailPage] save info failed:', e) }
    setSavingInfo(false)
  }

  if (loading) return <LoadingSkeleton/>
  if (error || !client) {
    return (
      <div style={{ padding:'48px 40px', display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
        <AlertCircle size={32} color={BRAND.danger}/>
        <div style={{ color:BRAND.danger, fontSize:14 }}>{error??'Client not found.'}</div>
        <button onClick={()=>router.push('/admin/merchants')} style={{ color:BRAND.cyan, background:'none', border:'none', cursor:'pointer', fontSize:13 }}>Back to Merchants</button>
      </div>
    )
  }

  const crm = CRM_STAGE_META[client.crm_stage]
  const daysOnFile = Math.max(0, Math.floor((Date.now()-new Date(client.date_added).getTime())/86400000))
  const inp: React.CSSProperties = { width:'100%', backgroundColor:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:5, padding:'5px 8px', fontSize:12, color:BRAND.silver, outline:'none', boxSizing:'border-box' }

  // Derived from accounts
  const allMccs      = accounts.filter(a=>a.mcc).map(a=>`${a.mcc}${a.mcc_label?' — '+a.mcc_label:''}`)
  const avgTicket    = accounts.length ? accounts.reduce((s,a)=>s+a.avg_ticket,0)/accounts.length : 0
  const monthlyVol   = accounts.reduce((s,a)=>s+a.monthly_volume, 0)
  const cpPct        = accounts.length ? Math.round(accounts.reduce((s,a)=>s+a.card_present_pct,0)/accounts.length) : 0
  const overallRisk  = accounts[0]?.risk

  return (
    <div style={{ padding:'28px 40px', maxWidth:1280, margin:'0 auto' }}>
      {/* Back */}
      <button onClick={()=>router.push('/admin/merchants')} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', color:BRAND.muted, fontSize:12, cursor:'pointer', marginBottom:20, padding:0 }}>
        <ArrowLeft size={14}/>Back to Merchants
      </button>

      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:12, flexWrap:'wrap' }}>
          <h1 style={{ fontSize:24, fontWeight:700, color:BRAND.silver, margin:0, lineHeight:1.2 }}>{client.name}</h1>
          {client.dba_name && <span style={{ fontSize:14, color:BRAND.muted }}>dba {client.dba_name}</span>}
        </div>
        <div style={{ display:'flex', gap:18, marginTop:6, flexWrap:'wrap', alignItems:'center' }}>
          {client.contact_email && <span style={{ fontSize:13, color:BRAND.muted }}>{client.contact_email}</span>}
          {client.contact_phone && <span style={{ fontSize:13, color:BRAND.muted }}>{client.contact_phone}</span>}
          {client.contact_name  && <span style={{ fontSize:13, color:BRAND.muted }}>Attn: {client.contact_name}</span>}
        </div>
        <div style={{ display:'flex', alignItems:'center', marginTop:10, gap:10 }}>
          <span style={{ display:'inline-flex', alignItems:'center', padding:'3px 10px', borderRadius:6, fontSize:11, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', color:crm.color, backgroundColor:crm.bg, border:`1px solid ${crm.border}` }}>{crm.label}</span>
          <span style={{ display:'inline-block', padding:'2px 8px', borderRadius:5, fontSize:11, color:daysOnFile>30?BRAND.warn:BRAND.muted, backgroundColor:daysOnFile>30?'rgba(252,211,77,0.08)':'rgba(255,255,255,0.05)', border:`1px solid ${daysOnFile>30?'rgba(252,211,77,0.2)':'rgba(255,255,255,0.08)'}` }}>{daysOnFile}d on file</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ display:'flex', gap:32, alignItems:'flex-start' }}>
        {/* Left: Account Pipeline */}
        <div style={{ flex:3, minWidth:0 }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:BRAND.cyan, marginBottom:12 }}>Account Pipeline</div>
          {accounts.length > 0
            ? <AccountRaceTrack
                accounts={accounts}
                onStageChange={handleStageChange}
                partnerIso={client?.partner_iso ?? undefined}
                partnerName={client?.partner ?? undefined}
              />
            : (
              <div style={{ padding:'40px 24px', textAlign:'center', backgroundColor:'rgba(255,255,255,0.02)', borderRadius:12, border:'1px dashed rgba(255,255,255,0.08)', marginBottom:16 }}>
                <ChevronRight size={28} color={BRAND.muted} style={{ marginBottom:10, opacity:0.5 }}/>
                <div style={{ fontSize:14, color:BRAND.muted, marginBottom:6 }}>No merchant accounts yet.</div>
                <div style={{ fontSize:12, color:BRAND.muted, opacity:0.7 }}>Add your first account to start tracking.</div>
              </div>
            )
          }
          <button onClick={()=>setShowModal(true)} onMouseEnter={e=>(e.currentTarget.style.backgroundColor='rgba(144,196,207,0.06)')} onMouseLeave={e=>(e.currentTarget.style.backgroundColor='transparent')}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:7, border:`1px solid ${BRAND.borderCyan}`, backgroundColor:'transparent', color:BRAND.cyan, fontSize:12, fontWeight:600, cursor:'pointer', marginTop:8, letterSpacing:'0.04em', transition:'background-color 0.15s' }}>
            <Plus size={13}/>Add Merchant Account
          </button>
        </div>

        {/* Right: Info + Docs */}
        <div style={{ flex:2, minWidth:0, display:'flex', flexDirection:'column', gap:16 }}>

          {/* ── Client Info Card ── */}
          <Card>
            {/* Header row with pencil */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:BRAND.cyan }}>Client Info</span>
              <div style={{ display:'flex', gap:6 }}>
                {editMode && (
                  <>
                    <button onClick={()=>setEditMode(false)} style={{ display:'flex', alignItems:'center', gap:4, padding:'3px 8px', borderRadius:5, border:'1px solid rgba(255,255,255,0.1)', backgroundColor:'transparent', color:BRAND.muted, fontSize:11, cursor:'pointer' }}>
                      <X size={11}/>Cancel
                    </button>
                    <button onClick={handleSaveClientInfo} disabled={savingInfo} style={{ display:'flex', alignItems:'center', gap:4, padding:'3px 10px', borderRadius:5, border:'none', backgroundColor:BRAND.cyan, color:'#0d0d0d', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                      <Check size={11}/>{savingInfo?'Saving…':'Save'}
                    </button>
                  </>
                )}
                {!editMode && (
                  <button onClick={()=>setEditMode(true)} title="Edit client info" style={{ display:'flex', alignItems:'center', justifyContent:'center', width:26, height:26, borderRadius:6, border:'1px solid rgba(255,255,255,0.08)', backgroundColor:'rgba(255,255,255,0.04)', color:BRAND.muted, cursor:'pointer' }}>
                    <Pencil size={12}/>
                  </button>
                )}
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
              {/* Contact group */}
              {editMode ? (
                <>
                  {[
                    { lbl:'Company Name', key:'name' as const },
                    { lbl:'DBA Name',     key:'dba_name' as const },
                    { lbl:'Contact Name', key:'contact_name' as const },
                    { lbl:'Email',        key:'contact_email' as const },
                    { lbl:'Phone',        key:'contact_phone' as const },
                  ].map(f => (
                    <div key={f.key}>
                      <div style={{ fontSize:10, color:BRAND.muted, marginBottom:3, fontWeight:600, letterSpacing:'0.04em' }}>{f.lbl.toUpperCase()}</div>
                      <input style={inp} value={(editForm[f.key] as string) ?? ''} onChange={e=>setEditForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.lbl}/>
                    </div>
                  ))}
                  <div>
                    <div style={{ fontSize:10, color:BRAND.muted, marginBottom:3, fontWeight:600, letterSpacing:'0.04em' }}>LEGAL STRUCTURE</div>
                    <select style={{...inp,cursor:'pointer'}} value={editForm.legal_structure??''} onChange={e=>setEditForm(p=>({...p,legal_structure:e.target.value}))}>
                      <option value="">Select…</option>
                      {['LLC','C-Corp','S-Corp','Partnership','Sole Prop'].map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  {[
                    { lbl:'Partner',     key:'partner' as const },
                    { lbl:'Partner ISO', key:'partner_iso' as const },
                  ].map(f => (
                    <div key={f.key}>
                      <div style={{ fontSize:10, color:BRAND.muted, marginBottom:3, fontWeight:600, letterSpacing:'0.04em' }}>{f.lbl.toUpperCase()}</div>
                      <input style={inp} value={(editForm[f.key] as string) ?? ''} onChange={e=>setEditForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.lbl}/>
                    </div>
                  ))}
                  <div>
                    <div style={{ fontSize:10, color:BRAND.muted, marginBottom:3, fontWeight:600, letterSpacing:'0.04em' }}>NOTES</div>
                    <textarea value={editForm.notes??''} onChange={e=>setEditForm(p=>({...p,notes:e.target.value}))} rows={3} placeholder="Internal notes…" style={{ width:'100%', backgroundColor:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:5, padding:'6px 8px', fontSize:12, color:BRAND.silver, resize:'vertical', outline:'none', lineHeight:1.5, boxSizing:'border-box', fontFamily:'inherit' }}/>
                  </div>
                </>
              ) : (
                <>
                  {/* Contact */}
                  {client.contact_name  && <Row label="Contact"        value={client.contact_name}/>}
                  {client.contact_email && <Row label="Email"          value={client.contact_email}/>}
                  {client.contact_phone && <Row label="Phone"          value={client.contact_phone}/>}
                  {client.dba_name      && <Row label="DBA"            value={client.dba_name}/>}
                  {(client.contact_name||client.contact_email) && <Divider/>}

                  {/* Business */}
                  {client.legal_structure && <Row label="Legal Structure" value={client.legal_structure}/>}
                  {client.partner         && <Row label="Partner ISO"     value={`${client.partner_iso?`[${client.partner_iso}] `:''}${client.partner}`}/>}
                  <Row label="Date Added"   value={fmt.date(client.date_added)}/>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, alignItems:'center' }}>
                    <span style={{ color:BRAND.muted }}>Risk Level</span>
                    <span style={{ display:'flex', alignItems:'center', color:BRAND.silver }}>
                      <RiskDot risk={overallRisk}/>{((overallRisk??'low').charAt(0).toUpperCase()+(overallRisk??'low').slice(1))}
                    </span>
                  </div>
                  <Divider/>

                  {/* Processing / account summary */}
                  {allMccs.length > 0 && (
                    <div style={{ fontSize:12 }}>
                      <span style={{ color:BRAND.muted }}>MCC{allMccs.length>1?'s':''}</span>
                      <div style={{ display:'flex', flexDirection:'column', gap:3, marginTop:4 }}>
                        {allMccs.map((m,i)=><span key={i} style={{ color:BRAND.silver, fontSize:11, paddingLeft:4 }}>· {m}</span>)}
                      </div>
                    </div>
                  )}
                  {avgTicket > 0    && <Row label="Avg Ticket"    value={fmt.money(avgTicket)}/>}
                  {monthlyVol > 0   && <Row label="Monthly Volume" value={fmt.money(monthlyVol)}/>}
                  {cpPct > 0        && <Row label="Card Present %"  value={`${cpPct}%`}/>}
                  {accounts.length > 0 && <Row label="Accounts"    value={`${accounts.length} account${accounts.length!==1?'s':''}`}/>}

                  {/* Notes */}
                  {client.notes && (
                    <>
                      <Divider/>
                      <div>
                        <div style={{ fontSize:10, color:BRAND.muted, marginBottom:4, fontWeight:600, letterSpacing:'0.04em' }}>NOTES</div>
                        <div style={{ fontSize:12, color:BRAND.silver, lineHeight:1.55 }}>{client.notes}</div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </Card>

          {/* ── Documents Card ── */}
          <Card>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:BRAND.cyan }}>Documents</span>
              <span style={{ fontSize:10, color:BRAND.muted }}>{documents.length} uploaded · {REQUIRED_DOCS.filter(rd=>rd.required&&!documents.some(d=>d.doc_type===rd.key)).length} missing</span>
            </div>

            {/* Required checklist with action buttons */}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:10, fontWeight:700, color:BRAND.muted, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:8 }}>Required Documents</div>
              <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                {REQUIRED_DOCS.map(rd => (
                  <RequiredDocRow
                    key={rd.key}
                    rd={rd}
                    submitted={documents.some(d=>d.doc_type===rd.key)}
                    contactEmail={client?.contact_email ?? ''}
                    clientId={clientId}
                    onUploaded={d=>setDocuments(prev=>[d,...prev])}
                  />
                ))}
              </div>
            </div>

            {/* Uploaded files */}
            {documents.length > 0
              ? <div style={{ display:'flex', flexDirection:'column', gap:5, marginBottom:8 }}>
                  {documents.map(d=><DocRow key={d.id} doc={d} onDelete={id=>setDocuments(prev=>prev.filter(x=>x.id!==id))}/>)}
                </div>
              : <div style={{ fontSize:12, color:BRAND.muted, marginBottom:8, textAlign:'center', padding:'8px 0' }}>No documents uploaded yet.</div>
            }

            <UploadZone clientId={clientId} onUploaded={d=>setDocuments(prev=>[d,...prev])}/>
          </Card>
        </div>
      </div>

      {showModal && (
        <AddAccountModal
          clientId={clientId}
          client={client}
          onClose={() => setShowModal(false)}
          onAdded={(a, partner) => {
            setAccounts(p => [...p, a])
            if (partner && client) {
              setClient(prev => prev ? { ...prev, partner: partner.name, partner_iso: partner.iso } : prev)
              setEditForm(prev => ({ ...prev, partner: partner.name, partner_iso: partner.iso }))
            }
            setShowModal(false)
          }}
        />
      )}
    </div>
  )
}

// ─── Field row helper (module-level to avoid remount) ─────────────────────────

function Row({ label, value }: { label: string; value?: string|null }) {
  if (!value) return null
  return (
    <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, alignItems:'flex-start', gap:8 }}>
      <span style={{ color:BRAND.muted, flexShrink:0 }}>{label}</span>
      <span style={{ color:BRAND.silver, textAlign:'right' }}>{value}</span>
    </div>
  )
}
