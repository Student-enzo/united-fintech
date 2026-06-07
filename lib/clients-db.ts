'use client'

import { supabasePublic } from './supabase-public'
import type { Client, MerchantAccount, ClientDocument, CrmStage, PipelineStage, AccountType, RiskLevel } from '@/types/clients'

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

// ─── Mock data (fallback when DB is empty) ───────────────────────────────────

const MOCK_CLIENTS: Client[] = [
  {
    id: 'c-001',
    name: 'Suncoast Retail Group',
    dba_name: 'Suncoast Shops',
    contact_name: 'Michael Torres',
    contact_email: 'mtorres@suncoast.com',
    contact_phone: '813-555-0192',
    legal_structure: 'LLC',
    partner: 'First Capital ISO',
    partner_iso: 'FC-ISO',
    crm_stage: 'live_partner',
    notes: 'Long-standing client, 3 locations.',
    date_added: '2024-01-10',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-06-01T08:00:00Z',
    merchant_accounts: [
      {
        id: 'ma-001a', client_id: 'c-001', account_name: 'Suncoast Tampa',
        mcc: '5411', mcc_label: 'Grocery Stores', account_type: 'Card Present',
        pipeline_stage: 'merchant_live', days_in_stage: 45, monthly_volume: 385000,
        avg_ticket: 62, card_present_pct: 94, risk: 'low',
        date_added: '2024-01-10', created_at: '2024-01-10T10:00:00Z',
      },
      {
        id: 'ma-001b', client_id: 'c-001', account_name: 'Suncoast Online',
        mcc: '5411', mcc_label: 'Grocery Stores', account_type: 'eCommerce',
        pipeline_stage: 'account_activated', days_in_stage: 12, monthly_volume: 95000,
        avg_ticket: 88, card_present_pct: 0, risk: 'low',
        date_added: '2024-03-15', created_at: '2024-03-15T10:00:00Z',
      },
    ],
  },
  {
    id: 'c-002',
    name: 'Blue Wave Hospitality LLC',
    dba_name: 'Blue Wave Hotels',
    contact_name: 'Sandra Kim',
    contact_email: 'skim@bluewave.io',
    contact_phone: '305-555-0741',
    legal_structure: 'LLC',
    partner: 'Meridian Partners',
    partner_iso: 'MP',
    crm_stage: 'processing',
    date_added: '2024-04-02',
    created_at: '2024-04-02T09:00:00Z',
    updated_at: '2024-05-20T14:30:00Z',
    merchant_accounts: [
      {
        id: 'ma-002a', client_id: 'c-002', account_name: 'Blue Wave Miami',
        mcc: '7011', mcc_label: 'Hotels & Lodging', account_type: 'Card Present',
        pipeline_stage: 'underwriting', days_in_stage: 8, monthly_volume: 520000,
        avg_ticket: 310, card_present_pct: 78, risk: 'medium',
        date_added: '2024-04-02', created_at: '2024-04-02T09:00:00Z',
      },
    ],
  },
  {
    id: 'c-003',
    name: 'Apex MedSpa Inc',
    contact_name: 'James Reilly',
    contact_email: 'james@apexmedspa.com',
    contact_phone: '212-555-0384',
    legal_structure: 'Inc',
    partner: 'Northeast ISO Group',
    partner_iso: 'NIG',
    crm_stage: 'documents_in',
    notes: 'High-volume MOTO; needs underwriting review.',
    date_added: '2024-05-14',
    created_at: '2024-05-14T11:00:00Z',
    updated_at: '2024-06-03T16:00:00Z',
    merchant_accounts: [
      {
        id: 'ma-003a', client_id: 'c-003', account_name: 'Apex MOTO Billing',
        mcc: '8049', mcc_label: 'Medical Services', account_type: 'MOTO',
        pipeline_stage: 'agreement_signed', days_in_stage: 5, monthly_volume: 280000,
        avg_ticket: 450, card_present_pct: 0, risk: 'high',
        date_added: '2024-05-14', created_at: '2024-05-14T11:00:00Z',
      },
      {
        id: 'ma-003b', client_id: 'c-003', account_name: 'Apex In-Office',
        mcc: '8049', mcc_label: 'Medical Services', account_type: 'Card Present',
        pipeline_stage: 'proposal_sent', days_in_stage: 3, monthly_volume: 60000,
        avg_ticket: 200, card_present_pct: 100, risk: 'medium',
        date_added: '2024-05-20', created_at: '2024-05-20T10:00:00Z',
      },
    ],
  },
  {
    id: 'c-004',
    name: 'Clearview Auto Parts',
    dba_name: 'Clearview Auto',
    contact_name: 'Dana Ruiz',
    contact_email: 'druiz@clearviewauto.net',
    contact_phone: '469-555-0218',
    legal_structure: 'LLC',
    partner: 'Southwest Merchant Services',
    partner_iso: 'SMS',
    crm_stage: 'in_conversation',
    date_added: '2024-06-01',
    created_at: '2024-06-01T08:00:00Z',
    updated_at: '2024-06-04T09:00:00Z',
    merchant_accounts: [
      {
        id: 'ma-004a', client_id: 'c-004', account_name: 'Clearview Retail',
        mcc: '5533', mcc_label: 'Auto Parts & Supplies', account_type: 'Card Present',
        pipeline_stage: 'proposal_sent', days_in_stage: 2, monthly_volume: 175000,
        avg_ticket: 95, card_present_pct: 85, risk: 'low',
        date_added: '2024-06-01', created_at: '2024-06-01T08:00:00Z',
      },
      {
        id: 'ma-004b', client_id: 'c-004', account_name: 'Clearview eShop',
        mcc: '5533', mcc_label: 'Auto Parts & Supplies', account_type: 'eCommerce',
        pipeline_stage: 'lead_identified', days_in_stage: 1, monthly_volume: 40000,
        avg_ticket: 120, card_present_pct: 0, risk: 'low',
        date_added: '2024-06-01', created_at: '2024-06-01T08:00:00Z',
      },
      {
        id: 'ma-004c', client_id: 'c-004', account_name: 'Clearview ACH Payables',
        mcc: '5533', mcc_label: 'Auto Parts & Supplies', account_type: 'ACH',
        pipeline_stage: 'lead_identified', days_in_stage: 1, monthly_volume: 25000,
        avg_ticket: 500, card_present_pct: 0, risk: 'low',
        date_added: '2024-06-01', created_at: '2024-06-01T08:00:00Z',
      },
    ],
  },
  {
    id: 'c-005',
    name: 'FreshBite Restaurants LLC',
    dba_name: 'FreshBite',
    contact_name: 'Priya Nair',
    contact_email: 'priya@freshbite.com',
    contact_phone: '773-555-0654',
    legal_structure: 'LLC',
    partner: 'Midwest ISO Alliance',
    partner_iso: 'MIA',
    crm_stage: 'prospect',
    date_added: '2024-06-05',
    created_at: '2024-06-05T12:00:00Z',
    updated_at: '2024-06-05T12:00:00Z',
    merchant_accounts: [
      {
        id: 'ma-005a', client_id: 'c-005', account_name: 'FreshBite Chicago',
        mcc: '5812', mcc_label: 'Eating Places & Restaurants', account_type: 'Card Present',
        pipeline_stage: 'lead_identified', days_in_stage: 1, monthly_volume: 95000,
        avg_ticket: 28, card_present_pct: 72, risk: 'low',
        date_added: '2024-06-05', created_at: '2024-06-05T12:00:00Z',
      },
    ],
  },
  {
    id: 'c-006',
    name: 'TechSolutions Corp',
    contact_name: 'Aaron Webb',
    contact_email: 'awebb@techsolutions.io',
    contact_phone: '415-555-0923',
    legal_structure: 'Corp',
    partner: 'Pacific ISO',
    partner_iso: 'PISO',
    crm_stage: 'live_partner',
    notes: 'Enterprise SaaS billing via ACH.',
    date_added: '2023-11-20',
    created_at: '2023-11-20T10:00:00Z',
    updated_at: '2024-05-01T10:00:00Z',
    merchant_accounts: [
      {
        id: 'ma-006a', client_id: 'c-006', account_name: 'TechSolutions ACH',
        mcc: '7372', mcc_label: 'Computer Programming & Software', account_type: 'ACH',
        pipeline_stage: 'merchant_live', days_in_stage: 180, monthly_volume: 1200000,
        avg_ticket: 4500, card_present_pct: 0, risk: 'low',
        date_added: '2023-11-20', created_at: '2023-11-20T10:00:00Z',
      },
      {
        id: 'ma-006b', client_id: 'c-006', account_name: 'TechSolutions Cards',
        mcc: '7372', mcc_label: 'Computer Programming & Software', account_type: 'eCommerce',
        pipeline_stage: 'merchant_live', days_in_stage: 90, monthly_volume: 320000,
        avg_ticket: 1200, card_present_pct: 0, risk: 'low',
        date_added: '2024-01-15', created_at: '2024-01-15T10:00:00Z',
      },
    ],
  },
  {
    id: 'c-007',
    name: 'Harbor Freight Logistics',
    dba_name: 'HFL',
    contact_name: 'Tom Briggs',
    contact_email: 'tbriggs@hfl.com',
    contact_phone: '617-555-0477',
    legal_structure: 'LLC',
    partner: 'East Coast ISO',
    partner_iso: 'ECI',
    crm_stage: 'documents_in',
    date_added: '2024-05-28',
    created_at: '2024-05-28T09:00:00Z',
    updated_at: '2024-06-02T11:00:00Z',
    merchant_accounts: [
      {
        id: 'ma-007a', client_id: 'c-007', account_name: 'HFL Main Account',
        mcc: '4731', mcc_label: 'Freight Transport', account_type: 'MOTO',
        pipeline_stage: 'setup_fee_paid', days_in_stage: 4, monthly_volume: 440000,
        avg_ticket: 2200, card_present_pct: 5, risk: 'medium',
        date_added: '2024-05-28', created_at: '2024-05-28T09:00:00Z',
      },
      {
        id: 'ma-007b', client_id: 'c-007', account_name: 'HFL ACH Receivables',
        mcc: '4731', mcc_label: 'Freight Transport', account_type: 'ACH',
        pipeline_stage: 'agreement_sent', days_in_stage: 6, monthly_volume: 220000,
        avg_ticket: 5000, card_present_pct: 0, risk: 'medium',
        date_added: '2024-05-28', created_at: '2024-05-28T09:00:00Z',
      },
      {
        id: 'ma-007c', client_id: 'c-007', account_name: 'HFL Spot Loads',
        mcc: '4731', mcc_label: 'Freight Transport', account_type: 'Card Present',
        pipeline_stage: 'lead_identified', days_in_stage: 2, monthly_volume: 55000,
        avg_ticket: 800, card_present_pct: 60, risk: 'low',
        date_added: '2024-06-01', created_at: '2024-06-01T08:00:00Z',
      },
    ],
  },
  {
    id: 'c-008',
    name: 'NovaPay Financial Services',
    contact_name: 'Lisa Chambers',
    contact_email: 'lchambers@novapay.finance',
    contact_phone: '646-555-0315',
    legal_structure: 'Inc',
    partner: 'Atlantic ISO Group',
    partner_iso: 'AIG',
    crm_stage: 'in_conversation',
    notes: 'High-risk category; processor pre-approval required.',
    date_added: '2024-06-03',
    created_at: '2024-06-03T14:00:00Z',
    updated_at: '2024-06-05T10:00:00Z',
    merchant_accounts: [
      {
        id: 'ma-008a', client_id: 'c-008', account_name: 'NovaPay eCommerce',
        mcc: '6099', mcc_label: 'Financial Services', account_type: 'eCommerce',
        pipeline_stage: 'proposal_sent', days_in_stage: 3, monthly_volume: 750000,
        avg_ticket: 350, card_present_pct: 0, risk: 'high',
        date_added: '2024-06-03', created_at: '2024-06-03T14:00:00Z',
      },
      {
        id: 'ma-008b', client_id: 'c-008', account_name: 'NovaPay ACH Disbursements',
        mcc: '6099', mcc_label: 'Financial Services', account_type: 'ACH',
        pipeline_stage: 'lead_identified', days_in_stage: 2, monthly_volume: 300000,
        avg_ticket: 1500, card_present_pct: 0, risk: 'high',
        date_added: '2024-06-03', created_at: '2024-06-03T14:00:00Z',
      },
      {
        id: 'ma-008c', client_id: 'c-008', account_name: 'NovaPay MOTO',
        mcc: '6099', mcc_label: 'Financial Services', account_type: 'MOTO',
        pipeline_stage: 'lead_identified', days_in_stage: 2, monthly_volume: 90000,
        avg_ticket: 800, card_present_pct: 0, risk: 'high',
        date_added: '2024-06-03', created_at: '2024-06-03T14:00:00Z',
      },
      {
        id: 'ma-008d', client_id: 'c-008', account_name: 'NovaPay POS Kiosks',
        mcc: '6099', mcc_label: 'Financial Services', account_type: 'Card Present',
        pipeline_stage: 'lead_identified', days_in_stage: 1, monthly_volume: 45000,
        avg_ticket: 120, card_present_pct: 100, risk: 'medium',
        date_added: '2024-06-04', created_at: '2024-06-04T09:00:00Z',
      },
    ],
  },
]

// ─── DB row → Client mapper ───────────────────────────────────────────────────

function rowToClient(row: Record<string, unknown>): Client {
  const accounts = Array.isArray(row.merchant_accounts)
    ? (row.merchant_accounts as Record<string, unknown>[]).map(rowToMerchantAccount)
    : undefined
  return {
    id:             row.id as string,
    name:           row.name as string,
    dba_name:       row.dba_name as string | undefined,
    contact_name:   row.contact_name as string | undefined,
    contact_email:  row.contact_email as string | undefined,
    contact_phone:  row.contact_phone as string | undefined,
    legal_structure:row.legal_structure as string | undefined,
    partner:        row.partner as string | undefined,
    partner_iso:    row.partner_iso as string | undefined,
    crm_stage:      row.crm_stage as CrmStage,
    notes:          row.notes as string | undefined,
    date_added:     row.date_added as string,
    created_at:     row.created_at as string,
    updated_at:     row.updated_at as string,
    merchant_accounts: accounts,
  }
}

function rowToMerchantAccount(row: Record<string, unknown>): MerchantAccount {
  return {
    id:             row.id as string,
    client_id:      row.client_id as string,
    account_name:   row.account_name as string,
    mcc:            row.mcc as string | undefined,
    mcc_label:      row.mcc_label as string | undefined,
    account_type:   toAccountType(row.account_type as string),
    pipeline_stage: row.pipeline_stage as PipelineStage,
    days_in_stage:  row.days_in_stage as number,
    monthly_volume: row.monthly_volume as number,
    avg_ticket:     row.avg_ticket as number,
    card_present_pct: row.card_present_pct as number,
    risk:           (row.risk as RiskLevel) ?? 'low',
    notes:          row.notes as string | undefined,
    date_added:     row.date_added as string,
    created_at:     row.created_at as string,
  }
}

function rowToDocument(row: Record<string, unknown>): ClientDocument {
  return {
    id:                  row.id as string,
    client_id:           row.client_id as string,
    merchant_account_id: row.merchant_account_id as string | undefined,
    file_name:           row.file_name as string,
    file_url:            row.file_url as string,
    doc_type:            row.doc_type as string | undefined,
    file_size:           row.file_size as number | undefined,
    uploaded_at:         row.uploaded_at as string,
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function fetchClients(): Promise<Client[]> {
  const { data, error } = await supabasePublic
    .from('fintech_clients')
    .select('*, merchant_accounts(*)')
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('[clients-db] fetchClients error — using mock data:', error.message)
    return MOCK_CLIENTS
  }
  if (!data || data.length === 0) return MOCK_CLIENTS

  return (data as Record<string, unknown>[]).map(rowToClient)
}

export async function fetchClient(id: string): Promise<Client | null> {
  const { data, error } = await supabasePublic
    .from('fintech_clients')
    .select('*, merchant_accounts(*), client_documents(*)')
    .eq('id', id)
    .single()

  if (error) {
    console.warn('[clients-db] fetchClient error:', error.message)
    return MOCK_CLIENTS.find(c => c.id === id) ?? null
  }
  if (!data) return null

  const row = data as Record<string, unknown>
  const client = rowToClient(row)
  return client
}

export async function insertClient(
  data: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'merchant_accounts'>
): Promise<Client> {
  const { data: inserted, error } = await supabasePublic
    .from('fintech_clients')
    .insert({
      name:            data.name,
      dba_name:        data.dba_name,
      contact_name:    data.contact_name,
      contact_email:   data.contact_email,
      contact_phone:   data.contact_phone,
      legal_structure: data.legal_structure,
      partner:         data.partner,
      partner_iso:     data.partner_iso,
      crm_stage:       data.crm_stage,
      notes:           data.notes,
      date_added:      data.date_added,
    })
    .select()
    .single()

  if (error) throw new Error(`[clients-db] insertClient failed: ${error.message}`)
  return rowToClient(inserted as Record<string, unknown>)
}

export async function updateClientStage(id: string, stage: CrmStage): Promise<void> {
  const { error } = await supabasePublic
    .from('fintech_clients')
    .update({ crm_stage: stage, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(`[clients-db] updateClientStage failed: ${error.message}`)
}

export async function insertMerchantAccount(
  data: Omit<MerchantAccount, 'id' | 'created_at'>
): Promise<MerchantAccount> {
  const { data: inserted, error } = await supabasePublic
    .from('fintech_merchant_accounts')
    .insert({
      client_id:        data.client_id,
      account_name:     data.account_name,
      mcc:              data.mcc,
      mcc_label:        data.mcc_label,
      account_type:     toDBAccountType(data.account_type),
      pipeline_stage:   data.pipeline_stage,
      days_in_stage:    data.days_in_stage,
      monthly_volume:   data.monthly_volume,
      avg_ticket:       data.avg_ticket,
      card_present_pct: data.card_present_pct,
      risk:             data.risk,
      notes:            data.notes,
      date_added:       data.date_added,
    })
    .select()
    .single()

  if (error) throw new Error(`[clients-db] insertMerchantAccount failed: ${error.message}`)
  return rowToMerchantAccount(inserted as Record<string, unknown>)
}

export async function updateAccountStage(id: string, stage: PipelineStage): Promise<void> {
  const { error } = await supabasePublic
    .from('fintech_merchant_accounts')
    .update({ pipeline_stage: stage, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(`[clients-db] updateAccountStage failed: ${error.message}`)
}

export async function fetchDocuments(clientId: string): Promise<ClientDocument[]> {
  const { data, error } = await supabasePublic
    .from('fintech_client_documents')
    .select('*')
    .eq('client_id', clientId)
    .order('uploaded_at', { ascending: false })

  if (error) {
    console.warn('[clients-db] fetchDocuments error:', error.message)
    return []
  }
  return (data as Record<string, unknown>[]).map(rowToDocument)
}
