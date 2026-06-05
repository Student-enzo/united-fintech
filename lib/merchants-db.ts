'use client'

import { supabasePublic } from './supabase-public'
import type { MerchantRecord, PipelineStage, AccountType } from './mock-merchants'

// ─── Field mappers ────────────────────────────────────────────────────────────

function toAccountType(db: string): AccountType {
  const map: Record<string, AccountType> = {
    card_present: 'Card Present',
    ecommerce:    'eCommerce',
    moto:         'MOTO',
    ach:          'ACH',
  }
  return map[db] ?? 'Card Present'
}

function toDBAccountType(ui: AccountType): string {
  const map: Record<AccountType, string> = {
    'Card Present': 'card_present',
    'eCommerce':    'ecommerce',
    'MOTO':         'moto',
    'ACH':          'ach',
  }
  return map[ui] ?? 'card_present'
}

function partnerIso(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toMerchantRecord(row: any): MerchantRecord {
  const daysInStage = Math.max(0, Math.floor(
    (Date.now() - new Date(row.updated_at ?? row.created_at).getTime()) / 86400000
  ))
  const partner = row.partners ?? null
  return {
    id:                 row.id,
    name:               row.business_name,
    dba_name:           row.dba_name ?? undefined,
    mcc:                row.mcc_code  ?? '',
    mcc_label:          row.mcc_label ?? '',
    legal_structure:    (row.legal_structure ?? 'llc').replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
    account_type:       toAccountType(row.account_type),
    monthly_volume:     Math.round((row.monthly_volume_est ?? 0) / 100),
    avg_ticket:         Math.round((row.avg_ticket ?? 0) / 100),
    card_present_pct:   Number(row.card_present_pct ?? 0),
    partner:            partner?.name ?? row.assigned_ae ?? '',
    partner_iso:        partner ? partnerIso(partner.name) : '',
    pipeline_stage:     row.pipeline_stage as PipelineStage,
    days_in_stage:      daysInStage,
    date_added:         (row.created_at ?? '').slice(0, 10),
    notes:              row.notes ?? undefined,
    risk:               (row.risk_level as 'low' | 'medium' | 'high') ?? 'low',
    basis_points_earned: row.basis_points_earned ?? 15,
    owner_name:         row.contact_name ?? undefined,
    contact_email:      row.contact_email ?? undefined,
    contact_phone:      row.contact_phone ?? undefined,
  }
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function fetchMerchants(): Promise<MerchantRecord[]> {
  const { data, error } = await supabasePublic
    .from('merchants')
    .select('*, partners(id, name, iso_type)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(toMerchantRecord)
}

export async function fetchMerchant(id: string): Promise<MerchantRecord | null> {
  const { data, error } = await supabasePublic
    .from('merchants')
    .select('*, partners(id, name, iso_type)')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data ? toMerchantRecord(data) : null
}

export async function saveMerchantStage(id: string, stage: PipelineStage): Promise<void> {
  const { error } = await supabasePublic
    .from('merchants')
    .update({ pipeline_stage: stage })
    .eq('id', id)
  if (error) throw error
}

export async function insertMerchant(
  data: Pick<MerchantRecord, 'name' | 'dba_name' | 'mcc' | 'mcc_label' | 'legal_structure' | 'account_type' |
    'monthly_volume' | 'avg_ticket' | 'card_present_pct' | 'risk' | 'basis_points_earned' |
    'owner_name' | 'contact_email' | 'contact_phone'>
): Promise<MerchantRecord> {
  const { data: row, error } = await supabasePublic
    .from('merchants')
    .insert({
      business_name:      data.name,
      dba_name:           data.dba_name           ?? null,
      mcc_code:           data.mcc                || null,
      mcc_label:          data.mcc_label          || null,
      legal_structure:    data.legal_structure.toLowerCase().replace(/\s+/g, '_').replace('c-corp','corporation').replace('s-corp','s_corp') || 'llc',
      account_type:       toDBAccountType(data.account_type),
      monthly_volume_est: (data.monthly_volume    ?? 0) * 100,
      avg_ticket:         (data.avg_ticket        ?? 0) * 100,
      card_present_pct:   data.card_present_pct   ?? 0,
      contact_name:       data.owner_name         || data.name,
      contact_email:      data.contact_email      ?? null,
      contact_phone:      data.contact_phone      ?? null,
      risk_level:         data.risk               ?? 'low',
      basis_points_earned: data.basis_points_earned ?? 15,
      pipeline_stage:     'lead_identified',
    })
    .select('*, partners(id, name, iso_type)')
    .single()
  if (error) throw error
  return toMerchantRecord(row)
}
