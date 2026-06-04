// United Fintech brand palette — SINGLE SOURCE OF TRUTH
// Edit this file when the logo/palette changes; keep app/globals.css :root in sync.

export const BRAND = {
  // Backgrounds
  bg:           '#0A0C12',   // near-black page background
  bgNavy:       '#0D1B2A',   // deep navy for hero / feature bands
  card:         '#141821',   // lifted card surface
  cardAlt:      '#1A1F2A',   // alternate card / hover

  // Signature cyan accent (CTAs, links, logo F-bar, orbit node, "Global Interchange")
  cyan:         '#1EA8D4',
  cyanBright:   '#33BEDE',   // glow highlight
  cyanDeep:     '#0E8FB8',   // teal "Global Interchange" tone

  // Chrome / silver (wordmark, logo)
  silverHi:     '#FFFFFF',   // chrome highlight
  silver:       '#C9D1D9',   // chrome mid-tone
  silverLo:     '#8A929C',   // chrome shadow / muted text

  // Text
  text:         '#E8EDF2',   // primary off-white
  muted:        '#7E8794',   // secondary / caption

  // Borders
  border:       'rgba(255,255,255,0.08)',
  borderCyan:   'rgba(30,168,212,0.25)',

  // Status
  success:      '#3DD68C',
  warn:         '#F0B23E',
  danger:       '#E8504A',

  // Glow helpers
  glowCyan:     '0 0 24px rgba(30,168,212,0.30)',
  glowCyanLg:   '0 0 48px rgba(30,168,212,0.20)',
} as const

export type BrandColors = typeof BRAND
