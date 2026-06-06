import { createPortalServerClient } from '@/lib/supabase-server'
import { getApplicationForUser, getApplicationDocuments, getPursuitDocumentRequests } from '@/lib/portal-db'
import { redirect } from 'next/navigation'
import { DocumentsClient } from '@/components/portal/documents-client'

export default async function DocumentsPage() {
  const supabase = await createPortalServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const app = await getApplicationForUser(user.id)
  if (!app) {
    return <div style={{ color: 'rgba(255,255,255,0.5)', paddingTop: 40 }}>No application found.</div>
  }

  const [documents, requests] = await Promise.all([
    getApplicationDocuments(app.id),
    getPursuitDocumentRequests(app.id),
  ])

  return <DocumentsClient applicationId={app.id} documents={documents} requests={requests} />
}
