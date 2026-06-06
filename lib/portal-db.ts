import { createPortalServerClient } from './supabase-server'
import type {
  OnboardingApplication, OnboardingDocument, OnboardingNote,
  OnboardingPursuit, OnboardingEmail, PursuitDocumentRequest,
} from './onboarding-types'

export async function getApplicationForUser(userId: string): Promise<OnboardingApplication | null> {
  const supabase = await createPortalServerClient()
  const { data } = await supabase
    .from('onboarding_applications')
    .select('*')
    .eq('client_auth_user_id', userId)
    .single()
  return data ?? null
}

export async function getApplicationDocuments(appId: string): Promise<OnboardingDocument[]> {
  const supabase = await createPortalServerClient()
  const { data } = await supabase
    .from('onboarding_documents')
    .select('*')
    .eq('application_id', appId)
    .eq('is_client_visible', true)
    .order('uploaded_at', { ascending: false })
  return data ?? []
}

export async function getApplicationPursuits(appId: string): Promise<OnboardingPursuit[]> {
  const supabase = await createPortalServerClient()
  const { data } = await supabase
    .from('onboarding_pursuits')
    .select('*')
    .eq('application_id', appId)
    .order('started_at', { ascending: true })
  return data ?? []
}

export async function getClientVisibleNotes(appId: string): Promise<OnboardingNote[]> {
  const supabase = await createPortalServerClient()
  const { data } = await supabase
    .from('onboarding_notes')
    .select('*')
    .eq('application_id', appId)
    .eq('is_client_visible', true)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getClientEmails(appId: string): Promise<OnboardingEmail[]> {
  const supabase = await createPortalServerClient()
  const { data } = await supabase
    .from('onboarding_emails')
    .select('*')
    .eq('application_id', appId)
    .eq('status', 'sent')
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getPursuitDocumentRequests(appId: string): Promise<PursuitDocumentRequest[]> {
  const supabase = await createPortalServerClient()
  const { data } = await supabase
    .from('pursuit_document_requests')
    .select('*')
    .eq('application_id', appId)
    .order('requested_at', { ascending: false })
  return data ?? []
}
