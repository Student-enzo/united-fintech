'use client'

import { useState, useCallback } from 'react'
import { ThemeProvider, useColors } from '@/lib/theme'
import Sidebar from './Sidebar'

function AppShell({ children }: { children: React.ReactNode }) {
  const colors = useColors()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const toggleSidebar = useCallback(() => setSidebarOpen(v => !v), [])
  const closeSidebar  = useCallback(() => setSidebarOpen(false), [])

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Backdrop — mobile only */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div
        className="md:ml-60 flex flex-col min-h-screen"
        style={{ backgroundColor: colors.bg }}
      >
        <main
          className="flex-1 p-4 md:p-8 relative"
          style={{ backgroundColor: colors.bg }}
        >
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden mb-5 flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
            style={{
              backgroundColor: 'rgba(43,184,230,0.1)',
              color: '#2BB8E6',
              border: '1px solid rgba(43,184,230,0.2)',
            }}
            onClick={toggleSidebar}
            aria-label="Open navigation"
          >
            <span className="text-lg leading-none">☰</span>
          </button>

          <div className="relative" style={{ zIndex: 1 }}>
            {children}
          </div>
        </main>
      </div>
    </>
  )
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppShell>{children}</AppShell>
    </ThemeProvider>
  )
}
