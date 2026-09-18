export interface PaletteSlotTokens {
  iconBg: string
  iconFg: string
  border: string
  actionBg: string
  actionBorder: string
  actionFg: string
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
const SLOTS: Slot[] = ['primary', 'secondary', 'tertiary', 'quaternary']

const lightText = '#172033'
const darkText = '#f8fafc'

function slot(
  iconBg: string,
  actionBg: string,
  accent: string,
  mode: 'light' | 'dark',
): PaletteSlotTokens {
  const textFg = mode === 'light' ? lightText : darkText
  const iconFg = mode === 'light' ? lightText : darkText
  return {
    iconBg,
    iconFg,
    border: accent,
    actionBg,
    actionBorder: accent,
    actionFg: iconFg,
    textFg,
    subtleBg: mode === 'light' ? '#ffffff' : '#111827',
  }
}

const defaultPalette: PaletteTokens = {
  id: 'default',
  name: 'Spectrum',
  headerDot: { light: '#7c3aed', dark: '#a78bfa' },
  aurora: {
    light: ['#ddd6fe', '#cffafe', '#fef3c7'],
    dark: ['#4c1d95', '#164e63', '#78350f'],
  },
  canvas: { light: '#f8fafc', dark: '#020617' },
  slots: {
    primary: {
      light: slot('#ede9fe', '#f5f3ff', '#6d28d9', 'light'),
      dark: slot('#312e81', '#1e1b4b', '#a78bfa', 'dark'),
    },
    secondary: {
      light: slot('#cffafe', '#ecfeff', '#0e7490', 'light'),
      dark: slot('#164e63', '#083344', '#67e8f9', 'dark'),
    },
    tertiary: {
      light: slot('#fef3c7', '#fffbeb', '#b45309', 'light'),
      dark: slot('#78350f', '#451a03', '#fbbf24', 'dark'),
    },
    quaternary: {
      light: slot('#d1fae5', '#ecfdf5', '#047857', 'light'),
      dark: slot('#064e3b', '#022c22', '#6ee7b7', 'dark'),
    },
  },
}

const auroraPalette: PaletteTokens = {
  id: 'aurora',
  name: 'Aurora',
  headerDot: { light: '#0891b2', dark: '#67e8f9' },
  aurora: {
    light: ['#cffafe', '#dbeafe', '#ede9fe'],
    dark: ['#164e63', '#1e3a8a', '#4c1d95'],
  },
  canvas: { light: '#f7fbff', dark: '#07111f' },
  slots: {
    primary: {
      light: slot('#dbeafe', '#eff6ff', '#1d4ed8', 'light'),
      dark: slot('#1e3a8a', '#172554', '#93c5fd', 'dark'),
    },
    secondary: {
      light: slot('#cffafe', '#ecfeff', '#0e7490', 'light'),
      dark: slot('#164e63', '#083344', '#67e8f9', 'dark'),
    },
    tertiary: {
      light: slot('#e0e7ff', '#eef2ff', '#4338ca', 'light'),
      dark: slot('#312e81', '#1e1b4b', '#a5b4fc', 'dark'),
    },
    quaternary: {
      light: slot('#ccfbf1', '#f0fdfa', '#0f766e', 'light'),
      dark: slot('#134e4a', '#042f2e', '#5eead4', 'dark'),
    },
  },
}

const cyberPalette: PaletteTokens = {
  id: 'cyber',
  name: 'Cyber',
  headerDot: { light: '#db2777', dark: '#f472b6' },
  aurora: {
    light: ['#fce7f3', '#cffafe', '#ede9fe'],
    dark: ['#831843', '#164e63', '#4c1d95'],
  },
  canvas: { light: '#fffafe', dark: '#090b1a' },
  slots: {
    primary: {
      light: slot('#fce7f3', '#fdf2f8', '#be185d', 'light'),
      dark: slot('#831843', '#500724', '#f9a8d4', 'dark'),
    },
    secondary: {
      light: slot('#cffafe', '#ecfeff', '#0e7490', 'light'),
      dark: slot('#164e63', '#083344', '#67e8f9', 'dark'),
    },
    tertiary: {
      light: slot('#ede9fe', '#f5f3ff', '#6d28d9', 'light'),
      dark: slot('#4c1d95', '#2e1065', '#c4b5fd', 'dark'),
    },
    quaternary: {
      light: slot('#ecfccb', '#f7fee7', '#4d7c0f', 'light'),
      dark: slot('#365314', '#1a2e05', '#bef264', 'dark'),
    },
  },
}

const sunsetPalette: PaletteTokens = {
  id: 'sunset',
  name: 'Sunset',
  headerDot: { light: '#c2410c', dark: '#fdba74' },
  aurora: {
    light: ['#ffedd5', '#fce7f3', '#fef3c7'],
    dark: ['#7c2d12', '#831843', '#78350f'],
  },
  canvas: { light: '#fffaf5', dark: '#160b0a' },
  slots: {
    primary: {
      light: slot('#ffedd5', '#fff7ed', '#c2410c', 'light'),
      dark: slot('#7c2d12', '#431407', '#fdba74', 'dark'),
    },
    secondary: {
      light: slot('#fce7f3', '#fdf2f8', '#be185d', 'light'),
      dark: slot('#831843', '#500724', '#f9a8d4', 'dark'),
    },
    tertiary: {
      light: slot('#fef3c7', '#fffbeb', '#b45309', 'light'),
      dark: slot('#78350f', '#451a03', '#fbbf24', 'dark'),
    },
    quaternary: {
      light: slot('#fee2e2', '#fef2f2', '#b91c1c', 'light'),
      dark: slot('#7f1d1d', '#450a0a', '#fca5a5', 'dark'),
    },
  },
}

export const PALETTES: PaletteTokens[] = [defaultPalette, auroraPalette, cyberPalette, sunsetPalette]

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
  } else if (import.meta.env.DEV) {
    activePalette = PALETTES[0]
  } else {
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
