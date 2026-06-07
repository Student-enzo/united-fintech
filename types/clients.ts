export type CrmStage = 'prospect' | 'in_conversation' | 'documents_in' | 'processing' | 'live_partner'
export type AccountType = 'Card Present' | 'eCommerce' | 'MOTO' | 'ACH'
export type PipelineStage = 'lead_identified' | 'proposal_sent' | 'agreement_sent' | 'agreement_signed' | 'setup_fee_paid' | 'underwriting' | 'account_activated' | 'merchant_live' | 'declined'
export type RiskLevel = 'low' | 'medium' | 'high'

export interface Client {
  id: string
  name: string
  dba_name?: string
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  legal_structure?: string
  partner?: string
  partner_iso?: string
  crm_stage: CrmStage
  notes?: string
  date_added: string
  created_at: string
  updated_at: string
  merchant_accounts?: MerchantAccount[]  // populated on detail fetch
}

export interface MerchantAccount {
  id: string
  client_id: string
  account_name: string
  mcc?: string
  mcc_label?: string
  account_type: AccountType
  pipeline_stage: PipelineStage
  days_in_stage: number
  monthly_volume: number
  avg_ticket: number
  card_present_pct: number
  risk: RiskLevel
  notes?: string
  date_added: string
  created_at: string
}

export interface ClientDocument {
  id: string
  client_id: string
  merchant_account_id?: string
  file_name: string
  file_url: string
  doc_type?: string
  file_size?: number
  uploaded_at: string
}

export const CRM_STAGE_META: Record<CrmStage, { label: string; color: string; bg: string; border: string }> = {
  prospect:        { label: 'Prospect',        color: '#93C5FD', bg: 'rgba(96,165,250,0.10)',  border: 'rgba(96,165,250,0.20)'  },
  in_conversation: { label: 'In Conversation', color: '#FCD34D', bg: 'rgba(251,191,36,0.10)',  border: 'rgba(251,191,36,0.20)'  },
  documents_in:    { label: 'Documents In',    color: '#C4B5FD', bg: 'rgba(139,92,246,0.10)',  border: 'rgba(139,92,246,0.20)'  },
  processing:      { label: 'Processing',      color: '#F0B23E', bg: 'rgba(240,178,62,0.10)',  border: 'rgba(240,178,62,0.20)'  },
  live_partner:    { label: 'Live Partner',    color: '#6EE7B7', bg: 'rgba(110,231,183,0.10)', border: 'rgba(110,231,183,0.22)' },
}

export const PIPELINE_STAGE_META: Record<PipelineStage, {
  label: string
  shortLabel: string
  clientLabel: string
  description: string
  action_owner: 'merchant' | 'iso' | 'done'
}> = {
  lead_identified:   {
    label: 'Lead Identified',  shortLabel: 'Lead',
    clientLabel: 'Application Received',
    description: "We've received your information and your rep will be in touch shortly.",
    action_owner: 'iso',
  },
  proposal_sent:     {
    label: 'Proposal Sent',    shortLabel: 'Proposal',
    clientLabel: 'Proposal Sent',
    description: 'Your ISO rep has sent you a proposal. Please review and respond.',
    action_owner: 'merchant',
  },
  agreement_sent:    {
    label: 'Agreement Sent',   shortLabel: 'Agreement',
    clientLabel: 'Agreement Sent',
    description: 'Please check your email for the merchant agreement to review and sign.',
    action_owner: 'merchant',
  },
  agreement_signed:  {
    label: 'Agreement Signed', shortLabel: 'Signed',
    clientLabel: 'Agreement Signed',
    description: "Agreement received. We're preparing your account setup next.",
    action_owner: 'iso',
  },
  setup_fee_paid:    {
    label: 'Setup Fee Paid',   shortLabel: 'Fee Paid',
    clientLabel: 'Fee Confirmed',
    description: 'Your setup fee has been confirmed. Preparing your file for underwriting.',
    action_owner: 'iso',
  },
  underwriting:      {
    label: 'Underwriting',     shortLabel: 'Under Review',
    clientLabel: 'Under Review',
    description: 'Our team is reviewing your financial history. Typically takes 3-7 business days. No action needed from you.',
    action_owner: 'iso',
  },
  account_activated: {
    label: 'Activated',        shortLabel: 'Ready',
    clientLabel: 'Account Ready',
    description: 'Your account is set up. Final activation steps are in progress.',
    action_owner: 'iso',
  },
  merchant_live:     {
    label: 'Live',             shortLabel: 'Live',
    clientLabel: 'Processing Active',
    description: 'Your account is live and processing payments!',
    action_owner: 'done',
  },
  declined:          {
    label: 'Declined',         shortLabel: 'Declined',
    clientLabel: 'Not Approved',
    description: 'We were unable to approve this account. Contact your ISO representative for details.',
    action_owner: 'iso',
  },
}
