'use client'
// Admin theme context — keep in sync with lib/brand.ts + app/globals.css :root
import React, { createContext, useContext, useEffect, useState } from 'react'
import { BRAND } from '@/lib/brand'

export type Theme = 'dark' | 'light'

export interface Colors {
  bg: string
  card: string
  sidebarGradient: string
  sidebarBorder: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  border: string
  borderAccent: string
  inputBg: string
  inputBorder: string
  rowHover: string
  tableHead: string
  tableBorder: string
  pillBg: string
  accent: string
}

export const DARK: Colors = {
  bg:             BRAND.bg,
  card:           BRAND.card,
  sidebarGradient:`linear-gradient(180deg, ${BRAND.cardAlt} 0%, ${BRAND.card} 100%)`,
  sidebarBorder:  BRAND.borderCyan,
  textPrimary:    BRAND.text,
  textSecondary:  BRAND.muted,
  textMuted:      BRAND.silverLo,
  border:         BRAND.border,
  borderAccent:   BRAND.borderCyan,
  inputBg:        'rgba(255,255,255,0.05)',
  inputBorder:    BRAND.borderCyan,
  rowHover:       'rgba(255,255,255,0.03)',
  tableHead:      'rgba(255,255,255,0.03)',
  tableBorder:    'rgba(30,168,212,0.08)',
  pillBg:         'rgba(30,168,212,0.1)',
  accent:         BRAND.cyan,
}

export const LIGHT: Colors = {
  bg:             '#F0F4F8',
  card:           '#FFFFFF',
  sidebarGradient:'linear-gradient(180deg, #1A1F2A 0%, #141821 100%)',
  sidebarBorder:  BRAND.borderCyan,
  textPrimary:    'rgba(15,23,42,0.88)',
  textSecondary:  'rgba(15,23,42,0.58)',
  textMuted:      'rgba(15,23,42,0.38)',
  border:         'rgba(0,0,0,0.08)',
  borderAccent:   'rgba(30,168,212,0.35)',
  inputBg:        'rgba(0,0,0,0.04)',
  inputBorder:    'rgba(0,0,0,0.14)',
  rowHover:       'rgba(0,0,0,0.025)',
  tableHead:      'rgba(0,0,0,0.03)',
  tableBorder:    'rgba(0,0,0,0.06)',
  pillBg:         'rgba(30,168,212,0.15)',
  accent:         BRAND.cyanDeep,
}

const ThemeCtx = createContext<{
  theme: Theme
  setTheme: (t: Theme) => void
  colors: Colors
}>({ theme: 'dark', setTheme: () => {}, colors: DARK })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('uf_theme') as Theme | null
    const t = saved === 'light' ? 'light' : 'dark'
    setThemeState(t)
    document.documentElement.classList.toggle('light', t === 'light')
  }, [])

  function setTheme(t: Theme) {
    setThemeState(t)
    localStorage.setItem('uf_theme', t)
    document.cookie = `uf_theme=${t};path=/;max-age=31536000`
    document.documentElement.classList.toggle('light', t === 'light')
  }

  return (
    <ThemeCtx.Provider value={{ theme, setTheme, colors: theme === 'light' ? LIGHT : DARK }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export function useTheme() { return useContext(ThemeCtx) }
export function useColors() { return useContext(ThemeCtx).colors }
