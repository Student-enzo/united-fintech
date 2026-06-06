// ============================================================
// Onboarding CRM — TypeScript Types
// ============================================================

// ---- Enums ----

export type RiskTier = 'unscored' | 'low' | 'medium' | 'high' | 'very_high'

export type Phase =
  | 'intake_sent'
  | 'document_review'
  | 'partner_selection'
  | 'pursuit'
  | 'live'
  | 'declined'

export type LinkStatus = 'sent' | 'opened' | 'submitted'

export type DocStatus = 'pending' | 'accepted' | 'rejected' | 're_upload_requested'

export type PursuitStage =
  | 'not_submitted'
  | 'submitted'
  | 'initial_review'
  | 'underwriting'
  | 'conditionally_approved'
  | 'approved'
  | 'declined'

export type PursuitOutcome = 'approved' | 'declined' | 'conditional' | null

export type PartnerType = 'bank' | 'processor' | 'gateway'

export type PartnerRiskAppetite = 'low' | 'medium' | 'high'

export type EmailType =
  | 'intake_link'
  | 'acknowledgment'
  | 're_upload_request'
  | 'representation_agreement'
  | 'partner_update'
  | 'submission_confirm'
  | 'underwriting_update'
  | 'doc_request'
  | 'conditional_approval'
  | 'approved'
  | 'declined'
  | 'client_live'

export type EmailStatus = 'draft' | 'sent'

export type BusinessType = 'LLC' | 'Corp' | 'Sole_Proprietor' | 'Partnership'

export type DocRequestStatus = 'pending' | 'fulfilled' | 'cancelled'

// ---- Nested Interfaces ----

export interface AiFlags {
  suspicious: boolean
  stale: boolean
  misclassified: boolean
  suggested_type?: string
  extracted_date?: string
  extracted_data?: Record<string, string>
}

export interface WebsiteCompliance {
  has_terms: boolean
  has_privacy: boolean
  has_refund: boolean
}

export interface CoOwner {
  name: string
  ownership_percent: string
  ssn_last4?: string
  dob?: string
  email?: string
}

// ---- Table Interfaces ----

export interface OnboardingApplication {
  id: string
  intake_token: string

  // Business info
  business_name: string | null
  owner_name: string | null
  owner_email: string
  owner_phone: string | null
  business_type: BusinessType | null
  ein: string | null
  website: string | null
  mcc: string | null
  monthly_volume: string | null
  avg_ticket: string | null
  card_present_percent: string | null
  years_in_business: string | null

  // Addresses
  business_address: string | null
  city: string | null
  state: string | null
  zip: string | null
  owner_address: string | null
  owner_city: string | null
  owner_state: string | null
  owner_zip: string | null

  // Owner KYC
  owner_dob: string | null
  owner_ssn_last4: string | null
  ownership_percent: string | null

  // Processing history
  current_processor: string | null
  chargeback_history: string

  // Co-owners
  co_owners: CoOwner[]

  // Risk & phase
  risk_tier: RiskTier
  current_phase: Phase
  link_status: LinkStatus

  // AI fields
  ai_summary: string | null
  ai_risk_reasoning: string | null
  ai_preapproval_recommendation: string | null
  ai_risk_score: number | null
  website_compliance: WebsiteCompliance | null
  match_list_checked: boolean

  // Client portal
  portal_email: string | null
  client_auth_user_id: string | null

  // Duplicate detection
  duplicate_of: string | null

  // Timestamps
  intake_token_expires_at: string
  created_at: string
  intake_submitted_at: string | null
  preapproved_at: string | null
  live_at: string | null
  created_by: string | null
}

export interface OnboardingDocument {
  id: string
  application_id: string

  doc_type: string
  doc_label: string | null
  file_url: string | null
  file_name: string | null
  file_size_bytes: number | null

  status: DocStatus

  // AI analysis
  ai_analysis: string | null
  ai_flags: AiFlags

  notes: string | null
  reviewed_by: string | null
  reviewed_at: string | null

  uploaded_at: string
  is_client_visible: boolean
}

export interface OnboardingNote {
  id: string
  application_id: string
  document_id: string | null

  content: string
  created_by: string
  is_ai_generated: boolean
  is_client_visible: boolean

  created_at: string
}

export interface PartnerDirectory {
  id: string
  name: string
  type: PartnerType
  risk_appetite: PartnerRiskAppetite

  accepted_mcc_codes: string[]
  training_notes: string | null

  contact_email: string | null
  contact_name: string | null
  logo_url: string | null
  is_active: boolean

  created_at: string
  updated_at: string
}

export interface OnboardingPursuit {
  id: string
  application_id: string
  partner_id: string | null
  partner_name: string

  current_stage: PursuitStage
  outcome: PursuitOutcome
  conditions: string | null
  condition_review_date: string | null

  ai_match_score: number | null
  ai_match_reasoning: string | null

  underwriting_sla_deadline: string | null

  started_at: string
  resolved_at: string | null
  notes: string | null
}

export interface PursuitStageLog {
  id: string
  pursuit_id: string

  stage: string
  notes: string | null
  changed_by: string
  changed_at: string
}

export interface PursuitDocumentRequest {
  id: string
  pursuit_id: string
  application_id: string

  document_name: string
  reason: string | null
  status: DocRequestStatus

  requested_at: string
  fulfilled_at: string | null
  deadline_at: string
}

export interface OnboardingEmail {
  id: string
  application_id: string
  pursuit_id: string | null

  email_type: EmailType
  subject: string
  body: string
  to_email: string | null
  status: EmailStatus

  created_at: string
  sent_at: string | null
}

// ---- Joined / Extended Types ----

export interface ApplicationWithRelations extends OnboardingApplication {
  documents?: OnboardingDocument[]
  notes?: OnboardingNote[]
  pursuits?: OnboardingPursuit[]
  emails?: OnboardingEmail[]
}
