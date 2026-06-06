import { supabase } from '@/lib/supabase'
import type {
  OnboardingApplication,
  OnboardingDocument,
  OnboardingNote,
  PartnerDirectory,
  OnboardingPursuit,
  OnboardingEmail,
  ApplicationWithRelations,
} from '@/lib/onboarding-types'

// ============================================================
// Applications
// ============================================================

export async function getApplications(): Promise<OnboardingApplication[]> {
  const { data, error } = await supabase
    .from('onboarding_applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getApplication(id: string): Promise<ApplicationWithRelations | null> {
  const { data, error } = await supabase
    .from('onboarding_applications')
    .select(`
      *,
      documents:onboarding_documents(*),
      notes:onboarding_notes(*),
      pursuits:onboarding_pursuits(*),
      emails:onboarding_emails(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function createApplication(
  email: string,
  businessName: string,
  customDocs?: string[]
): Promise<OnboardingApplication> {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30)

  const { data, error } = await supabase
    .from('onboarding_applications')
    .insert({
      owner_email: email,
      business_name: businessName,
      intake_token_expires_at: expiresAt.toISOString(),
      current_phase: 'intake_sent',
      link_status: 'sent',
    })
    .select()
    .single()

  if (error) throw error

  // If custom doc types are specified, pre-create pending document slots
  if (customDocs && customDocs.length > 0) {
    const docRows = customDocs.map((docType) => ({
      application_id: data.id,
      doc_type: docType,
      doc_label: docType,
      status: 'pending' as const,
    }))
    const { error: docError } = await supabase
      .from('onboarding_documents')
      .insert(docRows)
    if (docError) throw docError
  }

  return data
}

export async function updateApplicationPhase(
  id: string,
  phase: string
): Promise<void> {
  const update: Record<string, unknown> = { current_phase: phase }

  if (phase === 'live') {
    update.live_at = new Date().toISOString()
  } else if (phase === 'document_review') {
    update.preapproved_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('onboarding_applications')
    .update(update)
    .eq('id', id)

  if (error) throw error
}

export async function checkDuplicate(
  ein: string,
  businessName: string
): Promise<OnboardingApplication[]> {
  // Check for matching EIN (exact) or similar business name (case-insensitive)
  const { data, error } = await supabase
    .from('onboarding_applications')
    .select('*')
    .or(`ein.eq.${ein},business_name.ilike.${businessName}`)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

// ============================================================
// Documents
// ============================================================

export async function getDocuments(applicationId: string): Promise<OnboardingDocument[]> {
  const { data, error } = await supabase
    .from('onboarding_documents')
    .select('*')
    .eq('application_id', applicationId)
    .order('uploaded_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function updateDocumentStatus(
  docId: string,
  status: string,
  notes?: string
): Promise<void> {
  const update: Record<string, unknown> = {
    status,
    reviewed_at: new Date().toISOString(),
    reviewed_by: 'admin',
  }
  if (notes !== undefined) update.notes = notes

  const { error } = await supabase
    .from('onboarding_documents')
    .update(update)
    .eq('id', docId)

  if (error) throw error
}

// ============================================================
// Notes
// ============================================================

export async function addNote(
  applicationId: string,
  content: string,
  opts?: {
    documentId?: string
    isAiGenerated?: boolean
    isClientVisible?: boolean
  }
): Promise<OnboardingNote> {
  const { data, error } = await supabase
    .from('onboarding_notes')
    .insert({
      application_id: applicationId,
      content,
      document_id: opts?.documentId ?? null,
      is_ai_generated: opts?.isAiGenerated ?? false,
      is_client_visible: opts?.isClientVisible ?? false,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================================
// Partners
// ============================================================

export async function getPartners(): Promise<PartnerDirectory[]> {
  const { data, error } = await supabase
    .from('partner_directory')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function upsertPartner(
  partnerData: Partial<PartnerDirectory>
): Promise<PartnerDirectory> {
  const payload = {
    ...partnerData,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('partner_directory')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================================
// Pursuits
// ============================================================

export async function getPursuits(applicationId: string): Promise<OnboardingPursuit[]> {
  const { data, error } = await supabase
    .from('onboarding_pursuits')
    .select('*')
    .eq('application_id', applicationId)
    .order('started_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createPursuit(
  applicationId: string,
  partnerId: string,
  partnerName: string,
  matchScore?: number,
  matchReasoning?: string
): Promise<OnboardingPursuit> {
  const { data, error } = await supabase
    .from('onboarding_pursuits')
    .insert({
      application_id: applicationId,
      partner_id: partnerId,
      partner_name: partnerName,
      current_stage: 'not_submitted',
      ai_match_score: matchScore ?? null,
      ai_match_reasoning: matchReasoning ?? null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePursuitStage(
  pursuitId: string,
  stage: string,
  notes?: string
): Promise<void> {
  const update: Record<string, unknown> = { current_stage: stage }

  if (notes !== undefined) update.notes = notes

  // Auto-set SLA deadline when entering underwriting
  if (stage === 'underwriting') {
    const deadline = new Date()
    deadline.setDate(deadline.getDate() + 7)
    update.underwriting_sla_deadline = deadline.toISOString()
  }

  // Auto-set condition review date when conditionally approved
  if (stage === 'conditionally_approved') {
    const reviewDate = new Date()
    reviewDate.setDate(reviewDate.getDate() + 90)
    update.condition_review_date = reviewDate.toISOString()
    update.outcome = 'conditional'
  }

  // Mark resolved_at for terminal stages
  if (stage === 'approved' || stage === 'declined') {
    update.resolved_at = new Date().toISOString()
    update.outcome = stage
  }

  const { error } = await supabase
    .from('onboarding_pursuits')
    .update(update)
    .eq('id', pursuitId)

  if (error) throw error

  // Log to pursuit_stage_log
  const { error: logError } = await supabase
    .from('pursuit_stage_log')
    .insert({
      pursuit_id: pursuitId,
      stage,
      notes: notes ?? null,
      changed_by: 'admin',
    })

  if (logError) throw logError
}

// ============================================================
// Emails
// ============================================================

export async function getEmailDrafts(applicationId: string): Promise<OnboardingEmail[]> {
  const { data, error } = await supabase
    .from('onboarding_emails')
    .select('*')
    .eq('application_id', applicationId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createEmailDraft(
  applicationId: string,
  type: string,
  subject: string,
  body: string,
  toEmail: string,
  pursuitId?: string
): Promise<OnboardingEmail> {
  const { data, error } = await supabase
    .from('onboarding_emails')
    .insert({
      application_id: applicationId,
      pursuit_id: pursuitId ?? null,
      email_type: type,
      subject,
      body,
      to_email: toEmail,
      status: 'draft',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function markEmailSent(emailId: string): Promise<void> {
  const { error } = await supabase
    .from('onboarding_emails')
    .update({
      status: 'sent',
      sent_at: new Date().toISOString(),
    })
    .eq('id', emailId)

  if (error) throw error
}
