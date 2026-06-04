'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  ScrollText,
  TrendingUp,
  DollarSign,
  Handshake,
  Shield,
  Activity,
  Settings,
  LogOut,
  X,
} from 'lucide-react'
import { useColors } from '@/lib/theme'

const CYAN = '#1EA8D4'

function SectionHeader({ label }: { label: string }) {
  return (
    <p
      className="mt-5 mb-1 px-4 text-[9px] font-bold uppercase tracking-[0.22em]"
      style={{ color: 'rgba(255,255,255,0.22)' }}
    >
      {label}
    </p>
  )
}

function NavItem({
  href,
  label,
  icon: Icon,
  pathname,
  onClick,
}: {
  href: string
  label: string
  icon: React.ElementType
  pathname: string
  onClick?: () => void
}) {
  const isActive =
    pathname === href || (href !== '/admin' && pathname.startsWith(href + '/'))

  return (
    <Link
      href={href}
      onClick={onClick}
      className="py-2.5 px-4 rounded-lg text-sm flex items-center gap-3 transition-all cursor-pointer"
      style={
        isActive
          ? {
              backgroundColor: 'rgba(30,168,212,0.08)',
              color: CYAN,
              boxShadow: 'inset 3px 0 0 0 #1EA8D4',
            }
          : { color: 'rgba(255,255,255,0.55)' }
      }
      onMouseEnter={e => {
        if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)'
      }}
      onMouseLeave={e => {
        if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'
      }}
    >
      <Icon size={15} />
      <span className="tracking-wide">{label}</span>
    </Link>
  )
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()
  const colors   = useColors()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <aside
      className={[
        'fixed top-0 left-0 w-60 h-screen flex flex-col z-50 transition-transform duration-300',
        'md:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')}
      style={{ background: colors.sidebarGradient, borderRight: `1px solid ${colors.sidebarBorder}` }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 pt-6 pb-5"
        style={{ borderBottom: `1px solid ${colors.sidebarBorder}` }}
      >
        {/* UF monogram */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black"
          style={{
            background: `linear-gradient(135deg, ${CYAN} 0%, #0E8FB8 100%)`,
            color: '#fff',
            boxShadow: '0 0 14px rgba(30,168,212,0.30)',
          }}
        >
          UF
        </div>
        <div>
          <p
            className="text-[11px] font-bold uppercase tracking-[0.14em]"
            style={{
              background: 'linear-gradient(90deg, #C9D1D9 0%, #FFFFFF 50%, #8A929C 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            United Fintech
          </p>
          <p className="text-[9px] uppercase tracking-[0.18em]" style={{ color: 'rgba(30,168,212,0.5)' }}>
            Admin Portal
          </p>
        </div>

        {/* Mobile close */}
        <button
          className="md:hidden ml-auto flex items-center justify-center w-7 h-7 rounded-lg"
          style={{ color: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.06)' }}
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X size={14} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-4 pb-2 flex flex-col overflow-y-auto">
        <div className="flex flex-col gap-0.5">
          <NavItem href="/admin" label="Dashboard" icon={LayoutDashboard} pathname={pathname} onClick={onClose} />
        </div>

        <SectionHeader label="Pipeline" />
        <div className="flex flex-col gap-0.5">
          <NavItem href="/admin/merchants"  label="Merchants"           icon={Users}        pathname={pathname} onClick={onClose} />
          <NavItem href="/admin/deals"      label="Deals & Applications" icon={FileText}     pathname={pathname} onClick={onClose} />
          <NavItem href="/admin/agreements" label="Agreements"          icon={ScrollText}   pathname={pathname} onClick={onClose} />
        </div>

        <SectionHeader label="Finance" />
        <div className="flex flex-col gap-0.5">
          <NavItem href="/admin/residuals"   label="Residuals"   icon={TrendingUp}  pathname={pathname} onClick={onClose} />
          <NavItem href="/admin/commissions" label="Commissions" icon={DollarSign}  pathname={pathname} onClick={onClose} />
        </div>

        <SectionHeader label="Partners" />
        <div className="flex flex-col gap-0.5">
          <NavItem href="/admin/partners" label="Partner Network" icon={Handshake} pathname={pathname} onClick={onClose} />
        </div>

        <SectionHeader label="Compliance" />
        <div className="flex flex-col gap-0.5">
          <NavItem href="/admin/compliance" label="KYC / Compliance" icon={Shield} pathname={pathname} onClick={onClose} />
        </div>

        <SectionHeader label="Reporting" />
        <div className="flex flex-col gap-0.5">
          <NavItem href="/admin/activity" label="Activity Log" icon={Activity} pathname={pathname} onClick={onClose} />
        </div>

        <SectionHeader label="Settings" />
        <div className="flex flex-col gap-0.5">
          <NavItem href="/admin/settings" label="Settings" icon={Settings} pathname={pathname} onClick={onClose} />
        </div>

        <div className="flex-1" />
      </nav>

      {/* Footer */}
      <div
        className="px-4 py-4 flex items-center justify-between"
        style={{ borderTop: `1px solid rgba(30,168,212,0.1)` }}
      >
        <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: 'rgba(255,255,255,0.2)' }}>
          United Fintech
        </p>
        <button
          onClick={handleLogout}
          title="Sign out"
          className="flex items-center justify-center w-7 h-7 rounded-lg transition-all cursor-pointer"
          style={{ color: 'rgba(255,255,255,0.2)' }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLElement).style.color = 'rgba(232,80,74,0.7)'
            ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(232,80,74,0.08)'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.2)'
            ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
          }}
        >
          <LogOut size={13} />
        </button>
      </div>
    </aside>
  )
}
