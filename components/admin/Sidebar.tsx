'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  BarChart2,
  Handshake,
  Activity,
  Settings,
  LogOut,
  X,
  Calendar,
  Sparkles,
  Mail,
  Briefcase,
  ClipboardList,
} from 'lucide-react'
import { useColors } from '@/lib/theme'
import { BRAND } from '@/lib/brand'

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
  badge,
  matchPaths,
}: {
  href: string
  label: string
  icon: React.ElementType
  pathname: string
  onClick?: () => void
  badge?: number
  matchPaths?: string[]
}) {
  const isActive =
    pathname === href ||
    (href !== '/admin' && pathname.startsWith(href + '/')) ||
    (matchPaths?.some(p => pathname.startsWith(p)) ?? false)

  return (
    <Link
      href={href}
      onClick={onClick}
      className="py-2.5 px-4 rounded-lg text-sm flex items-center gap-3 transition-all cursor-pointer"
      style={
        isActive
          ? {
              backgroundColor: 'rgba(144,196,207,0.08)',
              color: BRAND.cyan,
              boxShadow: 'inset 3px 0 0 0 #90c4cf',
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
      {badge !== undefined && badge > 0 && (
        <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
          style={{ backgroundColor: 'rgba(240,178,62,0.2)', color: '#FCD34D', border: '1px solid rgba(240,178,62,0.3)' }}>
          {badge}
        </span>
      )}
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
        className="flex flex-col items-center pt-7 pb-5 px-5 relative"
        style={{ borderBottom: `1px solid ${colors.sidebarBorder}` }}
      >
        <Image
          src="/logo-vertical.png"
          alt="United Fintech"
          width={140}
          height={50}
          className="object-contain"
          priority
        />
        <p className="mt-2 text-[9px] uppercase tracking-[0.18em]" style={{ color: 'rgba(144,196,207,0.5)' }}>
          Admin Portal
        </p>

        <button
          className="md:hidden absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ color: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
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
          <NavItem
            href="/admin/merchants"
            label="Merchants"
            icon={Users}
            pathname={pathname}
            onClick={onClose}
            matchPaths={[
              '/admin/onboarding-crm', '/admin/portfolio',
              '/admin/deals', '/admin/onboarding', '/admin/underwriting',
              '/admin/agreements', '/admin/chargebacks', '/admin/attrition',
              '/admin/compliance', '/admin/post-activation',
            ]}
          />
        </div>

        <SectionHeader label="Finance" />
        <div className="flex flex-col gap-0.5">
          <NavItem
            href="/admin/finance"
            label="Finance Hub"
            icon={BarChart2}
            pathname={pathname}
            onClick={onClose}
            matchPaths={['/admin/cashflow', '/admin/residuals', '/admin/commissions', '/admin/expenses', '/admin/payables']}
          />
        </div>

        <SectionHeader label="Network" />
        <div className="flex flex-col gap-0.5">
          <NavItem href="/admin/partners" label="Partners" icon={Handshake} pathname={pathname} onClick={onClose} />
        </div>

        <SectionHeader label="Tools" />
        <div className="flex flex-col gap-0.5">
          <NavItem href="/admin/ai"       label="AI Assistant"    icon={Sparkles}  pathname={pathname} onClick={onClose} />
          <NavItem href="/admin/calendar" label="Calendar"        icon={Calendar}  pathname={pathname} onClick={onClose} />
          <NavItem href="/admin/emails"   label="Communications"  icon={Mail}      pathname={pathname} onClick={onClose} />
        </div>

        <SectionHeader label="System" />
        <div className="flex flex-col gap-0.5">
          <NavItem href="/admin/activity" label="Activity Log" icon={Activity} pathname={pathname} onClick={onClose} />
          <NavItem href="/admin/settings" label="Settings"     icon={Settings} pathname={pathname} onClick={onClose} />
        </div>

        <div className="flex-1" />
      </nav>

      {/* Footer */}
      <div
        className="px-4 py-4 flex items-center justify-between"
        style={{ borderTop: `1px solid rgba(144,196,207,0.1)` }}
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
