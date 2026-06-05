// AYC color palette — SINGLE SOURCE OF TRUTH for admin portal
// All admin files inherit these values via BRAND imports.

export const BRAND = {
  // Backgrounds
  bg:           '#1c1c1c',   // dark page background
  bgNavy:       '#1c1c1c',   // same dark (no navy in AYC palette)
  card:         '#282626',   // card / panel surface
  cardAlt:      '#282626',   // alternate card / hover (same as card)

  // Primary accent — AYC teal
  cyan:         '#90c4cf',
  cyanBright:   '#90c4cf',   // same teal (no separate bright in AYC)
  cyanDeep:     '#4A9B7F',   // darker teal / emerald

  // Chrome / silver (wordmark, logo)
  silverHi:     '#FFFFFF',
  silver:       '#C9D1D9',
  silverLo:     '#8A929C',

  // Text
  text:         'rgba(255,255,255,0.85)',
  muted:        'rgba(255,255,255,0.3)',

  // Borders
  border:       'rgba(144,196,207,0.15)',
  borderCyan:   'rgba(144,196,207,0.25)',

  // Status
  success:      '#6EE7B7',
  warn:         '#FCD34D',
  danger:       '#E8504A',

  // Glow helpers
  glowCyan:     '0 0 24px rgba(144,196,207,0.25)',
  glowCyanLg:   '0 0 48px rgba(144,196,207,0.15)',
} as const

export type BrandColors = typeof BRAND
