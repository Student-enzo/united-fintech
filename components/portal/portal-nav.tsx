'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, TrendingUp, MessageSquare, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { createPortalBrowserClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/portal/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/portal/documents', icon: FileText,        label: 'Documents' },
  { href: '/portal/progress',  icon: TrendingUp,      label: 'Progress' },
  { href: '/portal/messages',  icon: MessageSquare,   label: 'Messages' },
]

export function PortalNav({ businessName }: { businessName?: string | null }) {
  const pathname = usePathname()
  const router   = useRouter()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    const supabase = createPortalBrowserClient()
    await supabase.auth.signOut()
    router.push('/portal/login')
  }

  return (
    <>
      {/* Mobile header */}
      <header style={{ background: '#1c1c1c', borderBottom: '1px solid rgba(144,196,207,0.15)' }}
        className="lg:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-50">
        <span style={{ color: '#90c4cf', fontWeight: 300, letterSpacing: '0.12em', fontSize: 14 }}
          className="uppercase">UNITED FINTECH</span>
        <button onClick={() => setOpen(!open)} style={{ color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', cursor: 'pointer' }}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)}
          style={{ background: 'rgba(0,0,0,0.6)' }}>
          <nav onClick={e => e.stopPropagation()} style={{ background: '#1c1c1c', width: 240, height: '100%', borderRight: '1px solid rgba(144,196,207,0.15)', padding: '24px 16px' }}>
            <NavContent pathname={pathname} businessName={businessName} handleLogout={handleLogout} />
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <nav className="hidden lg:flex flex-col" style={{ background: '#1c1c1c', width: 220, minHeight: '100vh', borderRight: '1px solid rgba(144,196,207,0.15)', padding: '32px 16px', flexShrink: 0 }}>
        <NavContent pathname={pathname} businessName={businessName} handleLogout={handleLogout} />
      </nav>
    </>
  )
}

function NavContent({ pathname, businessName, handleLogout }: {
  pathname: string
  businessName?: string | null
  handleLogout: () => void
}) {
  return (
    <div className="flex flex-col h-full">
      <div style={{ marginBottom: 32 }}>
        <div style={{ color: '#90c4cf', fontWeight: 300, letterSpacing: '0.12em', fontSize: 13, textTransform: 'uppercase' }}>United Fintech</div>
        {businessName && (
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{businessName}</div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              borderRadius: 8, textDecoration: 'none',
              background: active ? 'rgba(144,196,207,0.1)' : 'transparent',
              color: active ? '#90c4cf' : 'rgba(255,255,255,0.6)',
              fontSize: 14, transition: 'all 0.15s',
              borderLeft: active ? '2px solid #90c4cf' : '2px solid transparent',
            }}>
              <Icon size={16} /> {label}
            </Link>
          )
        })}
      </div>

      <button onClick={handleLogout} style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
        borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer',
        color: 'rgba(255,255,255,0.4)', fontSize: 14, width: '100%', textAlign: 'left',
      }}>
        <LogOut size={16} /> Sign out
      </button>
    </div>
  )
}
