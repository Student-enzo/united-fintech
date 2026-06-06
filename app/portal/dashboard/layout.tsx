import { PortalNav } from '@/components/portal/portal-nav'
import { createPortalServerClient } from '@/lib/supabase-server'
import { getApplicationForUser } from '@/lib/portal-db'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createPortalServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const app = await getApplicationForUser(user.id)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#1c1c1c' }}>
      <PortalNav businessName={app?.business_name} />
      <main style={{ flex: 1, padding: '32px 24px', maxWidth: 900 }}>
        {children}
      </main>
    </div>
  )
}
