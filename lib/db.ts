import { supabase } from '@/lib/supabase'

// ─── Types ────────────────────────────────────────────────────────────────────

export type PipelineStage =
  | 'new_lead'
  | 'application_started'
  | 'submitted_to_processor'
  | 'underwriting'
  | 'approved'
  | 'live'
  | 'closed_lost'

export type Merchant = {
  id: string
  name: string
  legal_entity?: string
  email?: string
  phone?: string
  website?: string
  mcc?: string
  business_type?: string
  country?: string
  monthly_volume?: number
  risk_tier?: string
  pipeline_stage: PipelineStage
  source?: string
  partner_id?: string
  notes?: string
  created_at: string
}

export type DealStatus = 'draft' | 'submitted' | 'underwriting' | 'approved' | 'declined'

export type Deal = {
  id: string
  deal_number?: string
  merchant_id: string
  partner_id?: string
  product_type: string
  proposed_rate?: number
  est_monthly_volume?: number
  status: DealStatus
  calculation?: Record<string, unknown>
  notes?: string
  created_at: string
}

export type AgreementStatus = 'draft' | 'sent' | 'signed' | 'live' | 'terminated'

export type Agreement = {
  id: string
  deal_id?: string
  merchant_id: string
  partner_id?: string
  product_type: string
  signed_date?: string
  go_live_date?: string
  rate?: number
  residual_split_pct?: number
  status: AgreementStatus
  doc_url?: string
  notes?: string
  created_at: string
}

export type Partner = {
  id: string
  name: string
  type: 'processor' | 'bank' | 'lender' | 'insurer'
  contact_email?: string
  contact_phone?: string
  risk_appetite?: string
  residual_terms?: string
  notes?: string
  created_at: string
}

export type Residual = {
  id: string
  agreement_id?: string
  merchant_id: string
  partner_id?: string
  period: string
  processing_volume?: number
  gross_residual?: number
  partner_share?: number
  net_residual?: number
  status: 'pending' | 'received'
  received_date?: string
  created_at: string
}

export type Commission = {
  id: string
  rep_id?: string
  agreement_id?: string
  merchant_id?: string
  period_label?: string
  amount?: number
  bonus?: number
  status: 'pending' | 'paid'
  paid_date?: string
  created_at: string
}

export type Consultation = {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  monthly_volume?: string
  service_interest?: string
  message?: string
  status: string
  created_at: string
}

// ─── Merchants ────────────────────────────────────────────────────────────────

export async function listMerchants(): Promise<Merchant[]> {
  const { data, error } = await supabase
    .from('merchants')
    .select('*')
    .order('name', { ascending: true })
  if (error) throw error
  return (data ?? []) as Merchant[]
}

export async function getMerchant(id: string): Promise<Merchant | null> {
  const { data, error } = await supabase
    .from('merchants')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data as Merchant | null
}

export async function createMerchant(data: Omit<Merchant, 'id' | 'created_at'>): Promise<Merchant> {
  const { data: row, error } = await supabase
    .from('merchants')
    .insert({
      name:            data.name,
      legal_entity:    data.legal_entity    ?? null,
      email:           data.email           ?? null,
      phone:           data.phone           ?? null,
      website:         data.website         ?? null,
      mcc:             data.mcc             ?? null,
      business_type:   data.business_type   ?? null,
      country:         data.country         ?? null,
      monthly_volume:  data.monthly_volume  ?? null,
      risk_tier:       data.risk_tier       ?? null,
      pipeline_stage:  data.pipeline_stage  ?? 'new_lead',
      source:          data.source          ?? null,
      partner_id:      data.partner_id      ?? null,
      notes:           data.notes           ?? null,
    })
    .select()
    .single()
  if (error) throw error
  return row as Merchant
}

export async function updateMerchant(id: string, data: Partial<Omit<Merchant, 'id' | 'created_at'>>): Promise<Merchant> {
  const patch: Record<string, unknown> = {}
  if (data.name           !== undefined) patch.name           = data.name
  if (data.legal_entity   !== undefined) patch.legal_entity   = data.legal_entity   ?? null
  if (data.email          !== undefined) patch.email          = data.email           ?? null
  if (data.phone          !== undefined) patch.phone          = data.phone           ?? null
  if (data.website        !== undefined) patch.website        = data.website         ?? null
  if (data.mcc            !== undefined) patch.mcc            = data.mcc             ?? null
  if (data.business_type  !== undefined) patch.business_type  = data.business_type   ?? null
  if (data.country        !== undefined) patch.country        = data.country         ?? null
  if (data.monthly_volume !== undefined) patch.monthly_volume = data.monthly_volume  ?? null
  if (data.risk_tier      !== undefined) patch.risk_tier      = data.risk_tier       ?? null
  if (data.pipeline_stage !== undefined) patch.pipeline_stage = data.pipeline_stage
  if (data.source         !== undefined) patch.source         = data.source          ?? null
  if (data.partner_id     !== undefined) patch.partner_id     = data.partner_id      ?? null
  if (data.notes          !== undefined) patch.notes          = data.notes           ?? null
  const { data: row, error } = await supabase
    .from('merchants')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return row as Merchant
}

export async function updateMerchantStage(id: string, stage: PipelineStage): Promise<void> {
  const { error } = await supabase
    .from('merchants')
    .update({ pipeline_stage: stage })
    .eq('id', id)
  if (error) throw error
}

export async function deleteMerchant(id: string): Promise<void> {
  const { error } = await supabase
    .from('merchants')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ─── Deals ────────────────────────────────────────────────────────────────────

export async function listDeals(): Promise<Deal[]> {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Deal[]
}

export async function getDeal(id: string): Promise<Deal | null> {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data as Deal | null
}

export async function createDeal(data: Omit<Deal, 'id' | 'created_at'>): Promise<Deal> {
  const { data: row, error } = await supabase
    .from('deals')
    .insert({
      deal_number:        data.deal_number        ?? null,
      merchant_id:        data.merchant_id,
      partner_id:         data.partner_id         ?? null,
      product_type:       data.product_type,
      proposed_rate:      data.proposed_rate      ?? null,
      est_monthly_volume: data.est_monthly_volume ?? null,
      status:             data.status             ?? 'draft',
      calculation:        data.calculation        ?? null,
      notes:              data.notes              ?? null,
    })
    .select()
    .single()
  if (error) throw error
  return row as Deal
}

export async function updateDealStatus(id: string, status: DealStatus): Promise<void> {
  const { error } = await supabase
    .from('deals')
    .update({ status })
    .eq('id', id)
  if (error) throw error
}

// ─── Agreements ───────────────────────────────────────────────────────────────

export async function listAgreements(): Promise<Agreement[]> {
  const { data, error } = await supabase
    .from('agreements')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Agreement[]
}

export async function getAgreement(id: string): Promise<Agreement | null> {
  const { data, error } = await supabase
    .from('agreements')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data as Agreement | null
}

export async function updateAgreementStatus(id: string, status: AgreementStatus): Promise<void> {
  const { error } = await supabase
    .from('agreements')
    .update({ status })
    .eq('id', id)
  if (error) throw error
}

// ─── Partners ─────────────────────────────────────────────────────────────────

export async function listPartners(): Promise<Partner[]> {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('name', { ascending: true })
  if (error) throw error
  return (data ?? []) as Partner[]
}

export async function getPartner(id: string): Promise<Partner | null> {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data as Partner | null
}

export async function createPartner(data: Omit<Partner, 'id' | 'created_at'>): Promise<Partner> {
  const { data: row, error } = await supabase
    .from('partners')
    .insert({
      name:            data.name,
      type:            data.type,
      contact_email:   data.contact_email   ?? null,
      contact_phone:   data.contact_phone   ?? null,
      risk_appetite:   data.risk_appetite   ?? null,
      residual_terms:  data.residual_terms  ?? null,
      notes:           data.notes           ?? null,
    })
    .select()
    .single()
  if (error) throw error
  return row as Partner
}

export async function updatePartner(id: string, data: Partial<Omit<Partner, 'id' | 'created_at'>>): Promise<Partner> {
  const patch: Record<string, unknown> = {}
  if (data.name           !== undefined) patch.name           = data.name
  if (data.type           !== undefined) patch.type           = data.type
  if (data.contact_email  !== undefined) patch.contact_email  = data.contact_email  ?? null
  if (data.contact_phone  !== undefined) patch.contact_phone  = data.contact_phone  ?? null
  if (data.risk_appetite  !== undefined) patch.risk_appetite  = data.risk_appetite  ?? null
  if (data.residual_terms !== undefined) patch.residual_terms = data.residual_terms ?? null
  if (data.notes          !== undefined) patch.notes          = data.notes          ?? null
  const { data: row, error } = await supabase
    .from('partners')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return row as Partner
}

// ─── Residuals ────────────────────────────────────────────────────────────────

export async function listResiduals(): Promise<Residual[]> {
  const { data, error } = await supabase
    .from('residuals')
    .select('*')
    .order('period', { ascending: false })
  if (error) throw error
  return (data ?? []) as Residual[]
}

export async function getResidualsByPeriod(period: string): Promise<Residual[]> {
  const { data, error } = await supabase
    .from('residuals')
    .select('*')
    .eq('period', period)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Residual[]
}

// TODO: replace with RPC once DB is provisioned
export async function getProcessingVolumeByMonth(): Promise<{ month: string; volume: number }[]> {
  const { data, error } = await supabase
    .from('residuals')
    .select('period, processing_volume')
  if (error) throw error
  const totals: Record<string, number> = {}
  for (const row of data ?? []) {
    totals[row.period] = (totals[row.period] ?? 0) + (row.processing_volume ?? 0)
  }
  return Object.entries(totals)
    .map(([month, volume]) => ({ month, volume }))
    .sort((a, b) => a.month.localeCompare(b.month))
}

// ─── Commissions ──────────────────────────────────────────────────────────────

export async function listCommissions(): Promise<Commission[]> {
  const { data, error } = await supabase
    .from('commissions')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Commission[]
}

export async function getCommissionsByRep(repId: string): Promise<Commission[]> {
  const { data, error } = await supabase
    .from('commissions')
    .select('*')
    .eq('rep_id', repId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Commission[]
}

// ─── Consultations ────────────────────────────────────────────────────────────

export async function listConsultations(): Promise<Consultation[]> {
  const { data, error } = await supabase
    .from('consultations')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Consultation[]
}

export async function updateConsultationStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('consultations')
    .update({ status })
    .eq('id', id)
  if (error) throw error
}

// ─── Analytics ────────────────────────────────────────────────────────────────

// TODO: replace with RPC once DB is provisioned
export async function getMonthlyStats(): Promise<{ month: string; volume: number; residual: number }[]> {
  const { data, error } = await supabase
    .from('residuals')
    .select('period, processing_volume, net_residual')
  if (error) throw error
  const map: Record<string, { volume: number; residual: number }> = {}
  for (const row of data ?? []) {
    if (!map[row.period]) map[row.period] = { volume: 0, residual: 0 }
    map[row.period].volume   += row.processing_volume ?? 0
    map[row.period].residual += row.net_residual       ?? 0
  }
  return Object.entries(map)
    .map(([month, v]) => ({ month, ...v }))
    .sort((a, b) => a.month.localeCompare(b.month))
}

// TODO: replace with RPC once DB is provisioned
export async function getResidualsByPartner(): Promise<{ partner_name: string; residual: number }[]> {
  const { data, error } = await supabase
    .from('residuals')
    .select('partner_id, net_residual, partners(name)')
  if (error) throw error
  const map: Record<string, number> = {}
  for (const row of data ?? []) {
    const name = (row as any).partners?.name ?? row.partner_id ?? 'Unknown'
    map[name] = (map[name] ?? 0) + (row.net_residual ?? 0)
  }
  return Object.entries(map)
    .map(([partner_name, residual]) => ({ partner_name, residual }))
    .sort((a, b) => b.residual - a.residual)
}

// TODO: replace with RPC once DB is provisioned
export async function getDashboardKPIs(): Promise<{
  merchantsLive: number
  dealsInPipeline: number
  mtdResidual: number
  approvalRate: number
  riskFlags: number
}> {
  const now = new Date()
  const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const [merchantsRes, dealsRes, residualsRes, allDealsRes, riskRes] = await Promise.all([
    supabase.from('merchants').select('id', { count: 'exact', head: true }).eq('pipeline_stage', 'live'),
    supabase.from('deals').select('id', { count: 'exact', head: true }).in('status', ['submitted', 'underwriting']),
    supabase.from('residuals').select('net_residual').eq('period', currentPeriod),
    supabase.from('deals').select('status').in('status', ['approved', 'declined']),
    supabase.from('merchants').select('id', { count: 'exact', head: true }).eq('risk_tier', 'high'),
  ])

  const mtdResidual = (residualsRes.data ?? []).reduce((sum, r) => sum + (r.net_residual ?? 0), 0)

  const allDeals = allDealsRes.data ?? []
  const approved = allDeals.filter((d) => d.status === 'approved').length
  const approvalRate = allDeals.length > 0 ? Math.round((approved / allDeals.length) * 100) : 0

  return {
    merchantsLive:    merchantsRes.count  ?? 0,
    dealsInPipeline:  dealsRes.count      ?? 0,
    mtdResidual,
    approvalRate,
    riskFlags:        riskRes.count       ?? 0,
  }
}
