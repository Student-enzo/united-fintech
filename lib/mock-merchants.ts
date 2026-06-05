export type PipelineStage =
  | 'lead_identified' | 'proposal_sent' | 'agreement_sent'
  | 'agreement_signed' | 'setup_fee_paid' | 'underwriting'
  | 'account_activated' | 'merchant_live' | 'declined'

export type AccountType = 'Card Present' | 'eCommerce' | 'MOTO' | 'ACH'

export type MerchantRecord = {
  id: string
  name: string
  dba_name?: string
  mcc: string
  mcc_label: string
  legal_structure: string
  account_type: AccountType
  monthly_volume: number
  avg_ticket: number
  card_present_pct: number
  partner: string
  partner_iso: string
  pipeline_stage: PipelineStage
  days_in_stage: number
  date_added: string
  notes?: string
  risk?: 'low' | 'medium' | 'high'
  basis_points_earned?: number
  owner_name?: string
  contact_email?: string
  contact_phone?: string
  processor?: string | null
}

export const STAGE_META: Record<PipelineStage, { label: string; shortLabel: string; color: string; bg: string; border: string }> = {
  lead_identified:   { label:'Lead Identified',   shortLabel:'Lead',         color:'#93C5FD', bg:'rgba(96,165,250,0.10)',  border:'rgba(96,165,250,0.22)' },
  proposal_sent:     { label:'Proposal Sent',     shortLabel:'Proposal',     color:'#FCD34D', bg:'rgba(251,191,36,0.10)',  border:'rgba(251,191,36,0.22)' },
  agreement_sent:    { label:'Agreement Sent',    shortLabel:'Agmt Out',     color:'#C4B5FD', bg:'rgba(139,92,246,0.10)',  border:'rgba(139,92,246,0.22)' },
  agreement_signed:  { label:'Agreement Signed',  shortLabel:'Signed',       color:'#3DD68C', bg:'rgba(61,214,140,0.10)',  border:'rgba(61,214,140,0.22)' },
  setup_fee_paid:    { label:'Setup Fee Paid',    shortLabel:'Fee Paid',     color:'#34D399', bg:'rgba(52,211,153,0.12)',  border:'rgba(52,211,153,0.28)' },
  underwriting:      { label:'Underwriting',      shortLabel:'Underwriting', color:'#F0B23E', bg:'rgba(240,178,62,0.10)',  border:'rgba(240,178,62,0.22)' },
  account_activated: { label:'Account Activated', shortLabel:'Activated',    color:'#90C4CF', bg:'rgba(144,196,207,0.10)', border:'rgba(144,196,207,0.25)' },
  merchant_live:     { label:'Merchant Live',     shortLabel:'Live',         color:'#3DD68C', bg:'rgba(61,214,140,0.12)',  border:'rgba(61,214,140,0.28)' },
  declined:          { label:'Declined',          shortLabel:'Declined',     color:'rgba(255,255,255,0.28)', bg:'rgba(255,255,255,0.04)', border:'rgba(255,255,255,0.10)' },
}

export const MOCK_MERCHANTS: MerchantRecord[] = [
  {
    id: 'm-001', name: 'Suncoast Retail Group', dba_name: 'Suncoast Shops',
    mcc: '5411', mcc_label: 'Grocery Stores', legal_structure: 'LLC',
    account_type: 'Card Present', monthly_volume: 385000, avg_ticket: 62,
    card_present_pct: 94, partner: 'First Capital ISO', partner_iso: 'FC-ISO',
    pipeline_stage: 'merchant_live', days_in_stage: 42, date_added: '2025-11-14',
    notes: 'Multi-location grocery chain, flagship account', risk: 'low',
    basis_points_earned: 18, owner_name: 'James Harrington', contact_email: 'james@suncoastretail.com', contact_phone: '+1 (813) 555-0142',
  },
  {
    id: 'm-002', name: 'BluePeak eCommerce LLC', dba_name: 'BluePeak Store',
    mcc: '5999', mcc_label: 'Retail Stores, NEC', legal_structure: 'LLC',
    account_type: 'eCommerce', monthly_volume: 210000, avg_ticket: 128,
    card_present_pct: 0, partner: 'Meridian Partners', partner_iso: 'MP-001',
    pipeline_stage: 'account_activated', days_in_stage: 11, date_added: '2026-01-03',
    risk: 'low', basis_points_earned: 15, owner_name: 'Sofia Chen', contact_email: 'sofia@bluepeak.io', contact_phone: '+1 (305) 555-0209',
  },
  {
    id: 'm-003', name: 'Atlas Medical Supplies', dba_name: undefined,
    mcc: '5047', mcc_label: 'Medical & Hospital Equipment', legal_structure: 'C-Corp',
    account_type: 'MOTO', monthly_volume: 95000, avg_ticket: 310,
    card_present_pct: 10, partner: 'HealthPay ISO', partner_iso: 'HP-ISO',
    pipeline_stage: 'underwriting', days_in_stage: 7, date_added: '2026-02-18',
    notes: 'Requires enhanced underwriting — DME category', risk: 'medium',
    basis_points_earned: 22, owner_name: 'Dr. Marcus Webb', contact_email: 'marcus@atlasmedical.com', contact_phone: '+1 (407) 555-0317',
  },
  {
    id: 'm-004', name: 'NovaBrew Coffee Co.', dba_name: 'NovaBrew',
    mcc: '5812', mcc_label: 'Eating Places & Restaurants', legal_structure: 'S-Corp',
    account_type: 'Card Present', monthly_volume: 52000, avg_ticket: 18,
    card_present_pct: 98, partner: 'First Capital ISO', partner_iso: 'FC-ISO',
    pipeline_stage: 'setup_fee_paid', days_in_stage: 3, date_added: '2026-03-05',
    risk: 'low', basis_points_earned: 12, owner_name: 'Priya Nair', contact_email: 'priya@novabrew.co', contact_phone: '+1 (786) 555-0421',
  },
  {
    id: 'm-005', name: 'PrimeAuto Finance', dba_name: undefined,
    mcc: '5511', mcc_label: 'Auto Dealers - New & Used', legal_structure: 'LLC',
    account_type: 'Card Present', monthly_volume: 720000, avg_ticket: 4200,
    card_present_pct: 75, partner: 'Velocity ISO Group', partner_iso: 'VG-ISO',
    pipeline_stage: 'agreement_signed', days_in_stage: 5, date_added: '2026-03-12',
    notes: 'High ticket — needs VP approval', risk: 'medium',
    basis_points_earned: 20, owner_name: 'Derek Colson', contact_email: 'derek@primeauto.com', contact_phone: '+1 (954) 555-0558',
  },
  {
    id: 'm-006', name: 'ClearView Law Group', dba_name: undefined,
    mcc: '8111', mcc_label: 'Legal Services', legal_structure: 'Partnership',
    account_type: 'MOTO', monthly_volume: 68000, avg_ticket: 850,
    card_present_pct: 5, partner: 'Meridian Partners', partner_iso: 'MP-001',
    pipeline_stage: 'agreement_sent', days_in_stage: 9, date_added: '2026-03-20',
    risk: 'low', basis_points_earned: 14, owner_name: 'Angela Torres', contact_email: 'angela@clearviewlaw.com', contact_phone: '+1 (305) 555-0612',
  },
  {
    id: 'm-007', name: 'Apex Fitness Studios', dba_name: 'Apex Fit',
    mcc: '7997', mcc_label: 'Membership Sports & Recreation Clubs', legal_structure: 'LLC',
    account_type: 'Card Present', monthly_volume: 41000, avg_ticket: 55,
    card_present_pct: 88, partner: 'First Capital ISO', partner_iso: 'FC-ISO',
    pipeline_stage: 'proposal_sent', days_in_stage: 14, date_added: '2026-04-01',
    risk: 'low', basis_points_earned: 13, owner_name: 'Tyler Brooks', contact_email: 'tyler@apexfit.com', contact_phone: '+1 (561) 555-0714',
  },
  {
    id: 'm-008', name: 'OceanTech Imports', dba_name: undefined,
    mcc: '5065', mcc_label: 'Electrical Parts & Equipment', legal_structure: 'C-Corp',
    account_type: 'eCommerce', monthly_volume: 155000, avg_ticket: 240,
    card_present_pct: 0, partner: 'Velocity ISO Group', partner_iso: 'VG-ISO',
    pipeline_stage: 'lead_identified', days_in_stage: 2, date_added: '2026-04-10',
    risk: 'medium', basis_points_earned: 16, owner_name: 'Nina Vasquez', contact_email: 'nina@oceantech.io', contact_phone: '+1 (305) 555-0831',
  },
  {
    id: 'm-009', name: 'Harborside Hospitality', dba_name: 'Harborside Hotels',
    mcc: '7011', mcc_label: 'Hotels & Motels', legal_structure: 'LLC',
    account_type: 'Card Present', monthly_volume: 490000, avg_ticket: 195,
    card_present_pct: 82, partner: 'Meridian Partners', partner_iso: 'MP-001',
    pipeline_stage: 'merchant_live', days_in_stage: 88, date_added: '2025-09-30',
    risk: 'low', basis_points_earned: 17, owner_name: 'Robert Baxter', contact_email: 'robert@harborsidehospitality.com', contact_phone: '+1 (239) 555-0944',
  },
  {
    id: 'm-010', name: 'RedLine Logistics Inc.', dba_name: undefined,
    mcc: '4215', mcc_label: 'Courier Services', legal_structure: 'C-Corp',
    account_type: 'ACH', monthly_volume: 320000, avg_ticket: 1100,
    card_present_pct: 0, partner: 'HealthPay ISO', partner_iso: 'HP-ISO',
    pipeline_stage: 'underwriting', days_in_stage: 12, date_added: '2026-02-28',
    notes: 'ACH debit — fleet billing model', risk: 'medium',
    basis_points_earned: 19, owner_name: 'Carl Metzger', contact_email: 'carl@redlinelogistics.com', contact_phone: '+1 (407) 555-1012',
  },
  {
    id: 'm-011', name: 'StarPath Education', dba_name: 'StarPath Online',
    mcc: '8299', mcc_label: 'Schools & Educational Services', legal_structure: 'S-Corp',
    account_type: 'eCommerce', monthly_volume: 78000, avg_ticket: 299,
    card_present_pct: 0, partner: 'First Capital ISO', partner_iso: 'FC-ISO',
    pipeline_stage: 'proposal_sent', days_in_stage: 6, date_added: '2026-04-05',
    risk: 'low', basis_points_earned: 14, owner_name: 'Lily Okafor', contact_email: 'lily@starpathonline.com', contact_phone: '+1 (321) 555-1108',
  },
  {
    id: 'm-012', name: 'TerraVerde Cannabis Dist.', dba_name: 'TerraVerde',
    mcc: '5912', mcc_label: 'Drug Stores & Pharmacies', legal_structure: 'LLC',
    account_type: 'Card Present', monthly_volume: 165000, avg_ticket: 72,
    card_present_pct: 95, partner: 'Velocity ISO Group', partner_iso: 'VG-ISO',
    pipeline_stage: 'declined', days_in_stage: 0, date_added: '2026-03-01',
    notes: 'Declined — prohibited MCC in processing network', risk: 'high',
    basis_points_earned: 0, owner_name: 'Grant Fuller', contact_email: 'grant@terraverde.co', contact_phone: '+1 (786) 555-1245',
  },
]
