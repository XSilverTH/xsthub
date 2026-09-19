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
      cardBorder: 'rgba(255, 255, 255, 0.08)',
      cardHoverBorder: `${accentHex}4d`,
      actionBg: `${accentHex}12`,
      actionBorder: `${accentHex}3d`,
      actionFg: accentHex,
      actionHoverBg: `${accentHex}24`,
      tagBg: `${accentHex}22`,
      tagBorder: `${accentHex}4d`,
      tagFg: accentHex,
      textFg: accentHex,
      subtleBg: '#0b1329',
    }
  }

  return {
    accent: lightHex,
    iconBg: `${lightHex}15`,
    iconBorder: `${lightHex}35`,
    iconFg: lightHex,
    cardBorder: 'rgba(0, 0, 0, 0.08)',
    cardHoverBorder: `${lightHex}50`,
    actionBg: `${lightHex}0f`,
    actionBorder: `${lightHex}35`,
    actionFg: lightHex,
    actionHoverBg: `${lightHex}1f`,
    tagBg: `${lightHex}15`,
    tagBorder: `${lightHex}3d`,
    tagFg: lightHex,
    textFg: lightHex,
    subtleBg: '#ffffff',
  }
}

function makeUnifiedSlots(
  accentDark: string,
  accentLight: string,
): Record<Slot, { light: PaletteSlotTokens; dark: PaletteSlotTokens }> {
  const slotTokens = {
    light: makeSlotTokens(accentDark, accentLight, 'light'),
    dark: makeSlotTokens(accentDark, accentLight, 'dark'),
  }
  return {
    primary: slotTokens,
    secondary: slotTokens,
    tertiary: slotTokens,
    quaternary: slotTokens,
  }
}

// 1. Emerald (Exact match to original screenshot from Image #2)
const emeraldPalette: PaletteTokens = {
  id: 'emerald',
  name: 'Emerald',
  headerDot: { light: '#059669', dark: '#10b981' },
  aurora: {
    light: ['#6ee7b7', '#a7f3d0', '#5eead4'],
    dark: ['#10b981', '#14b8a6', '#059669'],
  },
  canvas: { light: '#f8fafc', dark: '#020617' },
  slots: makeUnifiedSlots('#34d399', '#059669'),
}

// 2. Violet (Exact match to desktop-dark-full reference)
const violetPalette: PaletteTokens = {
  id: 'violet',
  name: 'Violet',
  headerDot: { light: '#7c3aed', dark: '#a855f7' },
  aurora: {
    light: ['#ddd6fe', '#c4b5fd', '#e0e7ff'],
    dark: ['#8b5cf6', '#6366f1', '#a855f7'],
  },
  canvas: { light: '#f8fafc', dark: '#020617' },
  slots: makeUnifiedSlots('#c084fc', '#7c3aed'),
}

// 3. Fuchsia (Observed runtime scout palette)
const fuchsiaPalette: PaletteTokens = {
  id: 'fuchsia',
  name: 'Fuchsia',
  headerDot: { light: '#c026d3', dark: '#e879f9' },
  aurora: {
    light: ['#f5d0fe', '#fbcfe8', '#e9d5ff'],
    dark: ['#d946ef', '#ec4899', '#a855f7'],
  },
  canvas: { light: '#f8fafc', dark: '#020617' },
  slots: makeUnifiedSlots('#f472b6', '#c026d3'),
}

// 4. Cyan (Cool neon teal/cyan)
const cyanPalette: PaletteTokens = {
  id: 'cyan',
  name: 'Cyan',
  headerDot: { light: '#0891b2', dark: '#22d3ee' },
  aurora: {
    light: ['#a5f3fc', '#bae6fd', '#99f6e4'],
    dark: ['#06b6d4', '#0ea5e9', '#14b8a6'],
  },
  canvas: { light: '#f8fafc', dark: '#020617' },
  slots: makeUnifiedSlots('#22d3ee', '#0891b2'),
}

// 5. Amber (Warm golden orange)
const amberPalette: PaletteTokens = {
  id: 'amber',
  name: 'Amber',
  headerDot: { light: '#d97706', dark: '#fbbf24' },
  aurora: {
    light: ['#fde68a', '#fed7aa', '#fef08a'],
    dark: ['#f59e0b', '#d97706', '#ea580c'],
  },
  canvas: { light: '#f8fafc', dark: '#020617' },
  slots: makeUnifiedSlots('#fbbf24', '#d97706'),
}

// 6. Rose (Vibrant crimson rose)
const rosePalette: PaletteTokens = {
  id: 'rose',
  name: 'Rose',
  headerDot: { light: '#e11d48', dark: '#fb7185' },
  aurora: {
    light: ['#fecdd3', '#fda4af', '#fce7f3'],
    dark: ['#f43f5e', '#e11d48', '#be123c'],
  },
  canvas: { light: '#f8fafc', dark: '#020617' },
  slots: makeUnifiedSlots('#fb7185', '#e11d48'),
}

// 7. Spectrum (Multicolor bento with distinct slot colors)
const spectrumPalette: PaletteTokens = {
  id: 'spectrum',
  name: 'Spectrum',
  headerDot: { light: '#7c3aed', dark: '#a855f7' },
  aurora: {
    light: ['#ddd6fe', '#cffafe', '#d1fae5'],
    dark: ['#8b5cf6', '#06b6d4', '#10b981'],
  },
  canvas: { light: '#f8fafc', dark: '#020617' },
  slots: {
    primary: {
      light: makeSlotTokens('#c084fc', '#7c3aed', 'light'),
      dark: makeSlotTokens('#c084fc', '#7c3aed', 'dark'),
    },
    secondary: {
      light: makeSlotTokens('#22d3ee', '#0891b2', 'light'),
      dark: makeSlotTokens('#22d3ee', '#0891b2', 'dark'),
    },
    tertiary: {
      light: makeSlotTokens('#fbbf24', '#d97706', 'light'),
      dark: makeSlotTokens('#fbbf24', '#d97706', 'dark'),
    },
    quaternary: {
      light: makeSlotTokens('#34d399', '#059669', 'light'),
      dark: makeSlotTokens('#34d399', '#059669', 'dark'),
    },
  },
}

export const PALETTES: PaletteTokens[] = [
  emeraldPalette,
  violetPalette,
  fuchsiaPalette,
  cyanPalette,
  amberPalette,
  rosePalette,
  spectrumPalette,
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
    // Uniform random palette per full page load, in both development and production
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
