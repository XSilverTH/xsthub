import type { Card, CardColor, Slot } from './catalog-schema'
import type { PaletteSlotTokens, PaletteTokens } from './palettes'

export const SLOTS: Slot[] = ['primary', 'secondary', 'tertiary', 'quaternary']

/** Stable unsigned FNV-1a hash used for automatic card slot assignment. */
export function fnv1a32(str: string): number {
  let hash = 0x811c9dc5
  const bytes = new TextEncoder().encode(str)
  for (const byte of bytes) {
    hash ^= byte
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}
type Rgb = { r: number; g: number; b: number }
type Mode = 'light' | 'dark'

function parseHex(value: string): Rgb | null {
  if (!/^#[0-9a-f]{6}$/i.test(value)) return null
  return {
    r: Number.parseInt(value.slice(1, 3), 16),
    g: Number.parseInt(value.slice(3, 5), 16),
    b: Number.parseInt(value.slice(5, 7), 16),
  }
}

function channel(value: number): number {
  const normalized = value / 255
  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
}

function relativeLuminance(rgb: Rgb): number {
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b)
}

function contrastRatio(first: Rgb, second: Rgb): number {
  const firstLuminance = relativeLuminance(first)
  const secondLuminance = relativeLuminance(second)
  const lighter = Math.max(firstLuminance, secondLuminance)
  const darker = Math.min(firstLuminance, secondLuminance)
  return (lighter + 0.05) / (darker + 0.05)
}

function mix(first: Rgb, second: Rgb, amount: number): Rgb {
  return {
    r: Math.round(first.r + (second.r - first.r) * amount),
    g: Math.round(first.g + (second.g - first.g) * amount),
    b: Math.round(first.b + (second.b - first.b) * amount),
  }
}

function toHex(rgb: Rgb): string {
  const component = (value: number) => value.toString(16).padStart(2, '0')
  return `#${component(rgb.r)}${component(rgb.g)}${component(rgb.b)}`
}

const WHITE: Rgb = { r: 255, g: 255, b: 255 }
const INK: Rgb = { r: 15, g: 23, b: 42 }

function readablePair(background: Rgb): { background: string; foreground: string } {
  const whiteContrast = contrastRatio(background, WHITE)
  const inkContrast = contrastRatio(background, INK)
  let foreground = whiteContrast >= inkContrast ? WHITE : INK
  let foregroundName = foreground === WHITE ? '#ffffff' : '#0f172a'

  if (Math.max(whiteContrast, inkContrast) < 4.5) {
    const toward = foreground === WHITE ? { r: 0, g: 0, b: 0 } : WHITE
    let adjusted = background
    for (let step = 0; step < 24 && contrastRatio(adjusted, foreground) < 4.5; step += 1) {
      adjusted = mix(adjusted, toward, 0.12)
    }
    return { background: toHex(adjusted), foreground: foregroundName }
  }

  return { background: toHex(background), foreground: foregroundName }
}

function readableAccent(accent: Rgb, background: Rgb): string {
  if (contrastRatio(accent, background) >= 4.5) return toHex(accent)

  const target = relativeLuminance(accent) > relativeLuminance(background) ? WHITE : { r: 0, g: 0, b: 0 }
  let adjusted = accent
  for (let step = 0; step < 24 && contrastRatio(adjusted, background) < 4.5; step += 1) {
    adjusted = mix(adjusted, target, 0.12)
  }
  return toHex(adjusted)
}

function customValue(color: CardColor, mode: Mode): string | null {
  if (color.kind !== 'custom') return null
  if ('value' in color) return color.value
  return mode === 'light' ? color.light : color.dark
}

function customTokens(color: CardColor, mode: Mode): PaletteSlotTokens | null {
  const value = customValue(color, mode)
  if (!value) return null
  const accent = parseHex(value)
  if (!accent) return null

  const hex = value
  if (mode === 'dark') {
    return {
      accent: hex,
      iconBg: `${hex}18`,
      iconBorder: `${hex}38`,
      iconFg: hex,
      cardBorder: 'rgba(255, 255, 255, 0.08)',
      cardHoverBorder: `${hex}4d`,
      actionBg: `${hex}12`,
      actionBorder: `${hex}3d`,
      actionFg: hex,
      actionHoverBg: `${hex}24`,
      tagBg: `${hex}22`,
      tagBorder: `${hex}4d`,
      tagFg: hex,
      textFg: hex,
      subtleBg: '#0b1329',
    }
  }

  return {
    accent: hex,
    iconBg: `${hex}15`,
    iconBorder: `${hex}35`,
    iconFg: hex,
    cardBorder: 'rgba(0, 0, 0, 0.08)',
    cardHoverBorder: `${hex}50`,
    actionBg: `${hex}0f`,
    actionBorder: `${hex}35`,
    actionFg: hex,
    actionHoverBg: `${hex}1f`,
    tagBg: `${hex}15`,
    tagBorder: `${hex}3d`,
    tagFg: hex,
    textFg: hex,
    subtleBg: '#ffffff',
  }
}

export function resolveCardTokens(card: Card, palette: PaletteTokens, isDark: boolean): PaletteSlotTokens {
  const mode: Mode = isDark ? 'dark' : 'light'
  const color = card.color

  if (color?.kind === 'custom') {
    const resolvedCustom = customTokens(color, mode)
    if (resolvedCustom) return resolvedCustom
  }

  if (color?.kind === 'preset') {
    return palette.slots[color.slot][mode]
  }

  const hash = fnv1a32(`${palette.id}:${card.id}`)
  const slot = SLOTS[hash % SLOTS.length]
  return palette.slots[slot][mode]
}
