export interface PaletteSlotTokens {
  accent: string
  iconBg: string
  iconBorder: string
  iconFg: string
  cardBorder: string
  cardHoverBorder: string
  actionBg: string
  actionBorder: string
  actionFg: string
  actionHoverBg: string
  tagBg: string
  tagBorder: string
  tagFg: string
  textFg: string
  subtleBg: string
}

export interface PaletteTokens {
  id: string
  name: string
  headerDot: { light: string; dark: string }
  aurora: { light: [string, string, string]; dark: [string, string, string] }
  canvas: { light: string; dark: string }
  slots: Record<
    'primary' | 'secondary' | 'tertiary' | 'quaternary',
    { light: PaletteSlotTokens; dark: PaletteSlotTokens }
  >
}

type Slot = keyof PaletteTokens['slots']

function makeSlotTokens(
  accentHex: string,
  lightHex: string,
  mode: 'light' | 'dark',
): PaletteSlotTokens {
  if (mode === 'dark') {
    return {
      accent: accentHex,
      iconBg: `${accentHex}18`,
      iconBorder: `${accentHex}38`,
      iconFg: accentHex,
      cardBorder: 'rgba(255, 255, 255, 0.1)',
      cardHoverBorder: `${accentHex}66`,
      actionBg: `${accentHex}14`,
      actionBorder: `${accentHex}40`,
      actionFg: accentHex,
      actionHoverBg: `${accentHex}24`,
      tagBg: `${accentHex}20`,
      tagBorder: `${accentHex}40`,
      tagFg: accentHex,
      textFg: accentHex,
      subtleBg: '#020617',
    }
  }

  return {
    accent: lightHex,
    iconBg: `${lightHex}18`,
    iconBorder: `${lightHex}35`,
    iconFg: lightHex,
    cardBorder: 'rgba(0, 0, 0, 0.1)',
    cardHoverBorder: `${lightHex}60`,
    actionBg: `${lightHex}12`,
    actionBorder: `${lightHex}35`,
    actionFg: lightHex,
    actionHoverBg: `${lightHex}20`,
    tagBg: `${lightHex}18`,
    tagBorder: `${lightHex}3d`,
    tagFg: lightHex,
    textFg: lightHex,
    subtleBg: '#ffffff',
  }
}

function makeUnifiedSlots(
  slots: Record<Slot, { dark: string; light: string }>,
): Record<Slot, { light: PaletteSlotTokens; dark: PaletteSlotTokens }> {
  return {
    primary: {
      light: makeSlotTokens(slots.primary.dark, slots.primary.light, 'light'),
      dark: makeSlotTokens(slots.primary.dark, slots.primary.light, 'dark'),
    },
    secondary: {
      light: makeSlotTokens(slots.secondary.dark, slots.secondary.light, 'light'),
      dark: makeSlotTokens(slots.secondary.dark, slots.secondary.light, 'dark'),
    },
    tertiary: {
      light: makeSlotTokens(slots.tertiary.dark, slots.tertiary.light, 'light'),
      dark: makeSlotTokens(slots.tertiary.dark, slots.tertiary.light, 'dark'),
    },
    quaternary: {
      light: makeSlotTokens(slots.quaternary.dark, slots.quaternary.light, 'light'),
      dark: makeSlotTokens(slots.quaternary.dark, slots.quaternary.light, 'dark'),
    },
  }
}

// 1. Emerald (Original signature emerald theme)
const emeraldPalette: PaletteTokens = {
  id: 'emerald',
  name: 'Emerald',
  headerDot: { light: '#047857', dark: '#10b981' },
  aurora: {
    light: ['#a7f3d0', '#99f6e4', '#d9f99d'],
    dark: ['#064e3b', '#134e4a', '#365314'],
  },
  canvas: { light: '#f8fafc', dark: '#020617' },
  slots: makeUnifiedSlots({
    primary: { dark: '#10b981', light: '#047857' },
    secondary: { dark: '#2dd4bf', light: '#0f766e' },
    tertiary: { dark: '#14b8a6', light: '#0d9488' },
    quaternary: { dark: '#a3e635', light: '#4d7c0f' },
  }),
}

// 2. Fuchsia (Original signature fuchsia theme)
const fuchsiaPalette: PaletteTokens = {
  id: 'fuchsia',
  name: 'Fuchsia',
  headerDot: { light: '#c026d3', dark: '#d946ef' },
  aurora: {
    light: ['#f5d0fe', '#e9d5ff', '#fbcfe8'],
    dark: ['#701a75', '#581c87', '#831843'],
  },
  canvas: { light: '#f8fafc', dark: '#020617' },
  slots: makeUnifiedSlots({
    primary: { dark: '#d946ef', light: '#a21caf' },
    secondary: { dark: '#c084fc', light: '#7e22ce' },
    tertiary: { dark: '#f472b6', light: '#be185d' },
    quaternary: { dark: '#e879f9', light: '#9333ea' },
  }),
}

// 3. Amber (Original amber theme)
const amberPalette: PaletteTokens = {
  id: 'amber',
  name: 'Amber',
  headerDot: { light: '#b45309', dark: '#f59e0b' },
  aurora: {
    light: ['#fde68a', '#fed7aa', '#fef08a'],
    dark: ['#78350f', '#7c2d12', '#713f12'],
  },
  canvas: { light: '#f8fafc', dark: '#020617' },
  slots: makeUnifiedSlots({
    primary: { dark: '#f59e0b', light: '#b45309' },
    secondary: { dark: '#fb923c', light: '#c2410c' },
    tertiary: { dark: '#eab308', light: '#a16207' },
    quaternary: { dark: '#f97316', light: '#ea580c' },
  }),
}

// 4. Red (Original red theme)
const redPalette: PaletteTokens = {
  id: 'red',
  name: 'Red',
  headerDot: { light: '#be123c', dark: '#ef4444' },
  aurora: {
    light: ['#fca5a5', '#fdba74', '#fda4af'],
    dark: ['#7f1d1d', '#7c2d12', '#881337'],
  },
  canvas: { light: '#f8fafc', dark: '#020617' },
  slots: makeUnifiedSlots({
    primary: { dark: '#ef4444', light: '#b91c1c' },
    secondary: { dark: '#f97316', light: '#c2410c' },
    tertiary: { dark: '#f43f5e', light: '#be123c' },
    quaternary: { dark: '#fb7185', light: '#e11d48' },
  }),
}

// 5. Blue (Original blue theme)
const bluePalette: PaletteTokens = {
  id: 'blue',
  name: 'Blue',
  headerDot: { light: '#1d4ed8', dark: '#3b82f6' },
  aurora: {
    light: ['#93c5fd', '#7dd3fc', '#a5b4fc'],
    dark: ['#1e3a8a', '#0c4a6e', '#312e81'],
  },
  canvas: { light: '#f8fafc', dark: '#020617' },
  slots: makeUnifiedSlots({
    primary: { dark: '#3b82f6', light: '#1d4ed8' },
    secondary: { dark: '#06b6d4', light: '#0e7490' },
    tertiary: { dark: '#38bdf8', light: '#0284c7' },
    quaternary: { dark: '#6366f1', light: '#4338ca' },
  }),
}

// 6. Monochrome (Original monochrome theme)
const monochromePalette: PaletteTokens = {
  id: 'monochrome',
  name: 'Monochrome',
  headerDot: { light: '#475569', dark: '#94a3b8' },
  aurora: {
    light: ['#cbd5e1', '#e2e8f0', '#94a3b8'],
    dark: ['#1e293b', '#475569', '#334155'],
  },
  canvas: { light: '#f8fafc', dark: '#020617' },
  slots: makeUnifiedSlots({
    primary: { dark: '#94a3b8', light: '#475569' },
    secondary: { dark: '#64748b', light: '#334155' },
    tertiary: { dark: '#cbd5e1', light: '#64748b' },
    quaternary: { dark: '#e2e8f0', light: '#1e293b' },
  }),
}

export const PALETTES: PaletteTokens[] = [
  emeraldPalette,
  fuchsiaPalette,
  amberPalette,
  redPalette,
  bluePalette,
  monochromePalette,
]

let activePalette: PaletteTokens | undefined

function requestedPaletteId(): string | undefined {
  if (typeof window === 'undefined') return undefined
  const configured = window.__XSTHUB_PALETTE__
  if (typeof configured === 'string' && configured.trim()) return configured.trim()
  try {
    const query = new URLSearchParams(window.location.search).get('palette')
    return query?.trim() || undefined
  } catch {
    return undefined
  }
}

export function getActivePalette(): PaletteTokens {
  if (activePalette) return activePalette

  const requested = requestedPaletteId()
  const requestedPalette = requested ? PALETTES.find((palette) => palette.id === requested) : undefined
  if (requestedPalette) {
    activePalette = requestedPalette
  } else {
    // Uniform random palette per full page load across both dev and prod
    activePalette = PALETTES[Math.floor(Math.random() * PALETTES.length)] ?? PALETTES[0]
  }

  return activePalette
}

declare global {
  interface Window {
    __XSTHUB_PALETTE__?: string
  }
}

export {}
