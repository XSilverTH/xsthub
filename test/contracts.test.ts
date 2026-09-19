import { describe, expect, it } from 'bun:test'
import { safeParseCatalog } from '../src/lib/catalog-schema'
import { isValidCatalogUrl, resolveLinkProps, getCatalogUrl } from '../src/lib/catalog-url'
import { fnv1a32, resolveCardTokens } from '../src/lib/card-colors'
import { PALETTES, getActivePalette } from '../src/lib/palettes'

describe('Catalog Schema Contracts', () => {
  const validCatalog = {
    schemaVersion: 1,
    site: {
      title: 'XSilverTH',
      subtitle: 'Personal service hub',
    },
    contacts: [
      {
        id: 'email',
        label: 'silver@xsth.ir',
        icon: 'mail',
        action: { kind: 'link', href: 'mailto:silver@xsth.ir' },
      },
    ],
    cards: [
      {
        id: 'fileserver',
        title: 'Fileserver',
        icon: 'folder-open',
        description: 'File hosting',
        actions: [
          {
            id: 'browse',
            kind: 'link',
            label: 'Browse Directory',
            href: 'https://fileserver.xsth.ir/',
          },
        ],
      },
    ],
  }

  it('accepts a valid catalog', () => {
    const result = safeParseCatalog(validCatalog)
    expect(result.success).toBe(true)
  })

  it('rejects unknown top-level keys', () => {
    const result = safeParseCatalog({ ...validCatalog, unknownKey: 123 })
    expect(result.success).toBe(false)
  })

  it('rejects unknown card keys', () => {
    const result = safeParseCatalog({
      ...validCatalog,
      cards: [{ ...validCatalog.cards[0], extraProperty: 'bad' }],
    })
    expect(result.success).toBe(false)
  })

  it('rejects duplicate card IDs', () => {
    const result = safeParseCatalog({
      ...validCatalog,
      cards: [validCatalog.cards[0], { ...validCatalog.cards[0], title: 'Second Fileserver' }],
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message.includes('Duplicate card ID'))).toBe(true)
    }
  })

  it('rejects duplicate contact IDs', () => {
    const result = safeParseCatalog({
      ...validCatalog,
      contacts: [
        validCatalog.contacts[0],
        { ...validCatalog.contacts[0], label: 'second@xsth.ir' },
      ],
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message.includes('Duplicate contact ID'))).toBe(true)
    }
  })

  it('rejects duplicate action IDs across blocks and bottom actions within a card', () => {
    const result = safeParseCatalog({
      ...validCatalog,
      cards: [
        {
          id: 'test-card',
          title: 'Test',
          icon: 'server',
          blocks: [
            {
              id: 'actions-block',
              kind: 'actions',
              actions: [
                { id: 'shared-action-id', kind: 'link', label: 'Action 1', href: 'https://example.com' },
              ],
            },
          ],
          actions: [
            { id: 'shared-action-id', kind: 'link', label: 'Action 2', href: 'https://example.com' },
          ],
        },
      ],
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message.includes('Duplicate action ID'))).toBe(true)
    }
  })

  it('rejects unsupported schema versions', () => {
    const result = safeParseCatalog({ ...validCatalog, schemaVersion: 2 })
    expect(result.success).toBe(false)
  })

  it('rejects invalid uppercase or symbol IDs', () => {
    const result = safeParseCatalog({
      ...validCatalog,
      cards: [{ ...validCatalog.cards[0], id: 'Invalid_ID!' }],
    })
    expect(result.success).toBe(false)
  })
})

describe('Safe URL Validation Contracts', () => {
  it('accepts safe HTTP and HTTPS URLs', () => {
    expect(isValidCatalogUrl('https://example.com')).toBe(true)
    expect(isValidCatalogUrl('http://localhost:3000')).toBe(true)
    expect(isValidCatalogUrl('https://xsth.ir/radar')).toBe(true)
  })

  it('accepts safe relative URLs', () => {
    expect(isValidCatalogUrl('/radar')).toBe(true)
    expect(isValidCatalogUrl('./radar')).toBe(true)
    expect(isValidCatalogUrl('../radar')).toBe(true)
  })

  it('accepts valid mailto URLs only when allowMailto is enabled', () => {
    expect(isValidCatalogUrl('mailto:silver@xsth.ir', true)).toBe(true)
    expect(isValidCatalogUrl('mailto:silver@xsth.ir', false)).toBe(false)
    expect(isValidCatalogUrl('mailto:', true)).toBe(false)
    expect(isValidCatalogUrl('mailto:bad-address', true)).toBe(false)
  })

  it('rejects scheme-relative, javascript, data, and file URLs', () => {
    expect(isValidCatalogUrl('//example.com')).toBe(false)
    expect(isValidCatalogUrl('javascript:alert(1)')).toBe(false)
    expect(isValidCatalogUrl('data:text/html,bad')).toBe(false)
    expect(isValidCatalogUrl('file:///etc/passwd')).toBe(false)
  })

  it('rejects credentials in URLs', () => {
    expect(isValidCatalogUrl('https://user:password@example.com')).toBe(false)
  })

  it('rejects backslash traversal and invalid encoding', () => {
    expect(isValidCatalogUrl('https://example.com\\evil')).toBe(false)
    expect(isValidCatalogUrl('https://example.com/%5cevil')).toBe(false)
  })

  it('resolves link props accurately', () => {
    const external = resolveLinkProps('https://fileserver.xsth.ir/')
    expect(external.target).toBe('_blank')
    expect(external.rel).toBe('noopener noreferrer')
    expect(external.isExternal).toBe(true)

    const sameTab = resolveLinkProps('https://fileserver.xsth.ir/', 'same-tab')
    expect(sameTab.target).toBeUndefined()
    expect(sameTab.rel).toBeUndefined()

    const mailto = resolveLinkProps('mailto:silver@xsth.ir')
    expect(mailto.target).toBeUndefined()
    expect(mailto.rel).toBeUndefined()
  })
})

describe('Palette and Deterministic Card Color Contracts', () => {
  it('FNV-1a produces verified 32-bit unsigned hashes', () => {
    expect(fnv1a32('')).toBe(2166136261)
    expect(fnv1a32('hello')).toBe(1335831723)
  })

  it('card slot assignment is invariant under card reordering', () => {
    const palette = PALETTES[0]
    const cardA = { id: 'matrix', title: 'Matrix', icon: 'message-square' }
    const cardB = { id: 'minecraft', title: 'Minecraft', icon: 'server' }
    const cardC = { id: 'fileserver', title: 'Fileserver', icon: 'folder-open' }

    const tokensA1 = resolveCardTokens(cardA, palette, true)
    const tokensB1 = resolveCardTokens(cardB, palette, true)
    const tokensC1 = resolveCardTokens(cardC, palette, true)

    // Reordered resolution
    const tokensC2 = resolveCardTokens(cardC, palette, true)
    const tokensA2 = resolveCardTokens(cardA, palette, true)
    const tokensB2 = resolveCardTokens(cardB, palette, true)

    expect(tokensA1).toEqual(tokensA2)
    expect(tokensB1).toEqual(tokensB2)
    expect(tokensC1).toEqual(tokensC2)
  })

  it('switching light/dark mode retains the same slot identity', () => {
    const palette = PALETTES[0]
    const card = { id: 'rustdesk', title: 'RustDesk', icon: 'activity' }
    const darkTokens = resolveCardTokens(card, palette, true)
    const lightTokens = resolveCardTokens(card, palette, false)

    expect(darkTokens.actionBorder).toBeDefined()
    expect(lightTokens.actionBorder).toBeDefined()
  })

  it('custom colors derive valid tokens for light and dark modes', () => {
    const palette = PALETTES[0]
    const card = {
      id: 'custom-card',
      title: 'Custom',
      icon: 'code',
      color: { kind: 'custom' as const, value: '#22d3ee' },
    }

    const darkTokens = resolveCardTokens(card, palette, true)
    const lightTokens = resolveCardTokens(card, palette, false)

    expect(darkTokens.iconBg).toBeDefined()
    expect(lightTokens.iconBg).toBeDefined()
  })

  it('curated palettes all have valid tokens in both modes', () => {
    expect(PALETTES.length).toBeGreaterThanOrEqual(4)
    for (const palette of PALETTES) {
      expect(palette.id).toBeDefined()
      expect(palette.headerDot.light).toBeDefined()
      expect(palette.headerDot.dark).toBeDefined()
      expect(palette.slots.primary.light).toBeDefined()
      expect(palette.slots.primary.dark).toBeDefined()
      expect(palette.slots.secondary.light).toBeDefined()
      expect(palette.slots.secondary.dark).toBeDefined()
      expect(palette.slots.tertiary.light).toBeDefined()
      expect(palette.slots.tertiary.dark).toBeDefined()
      expect(palette.slots.quaternary.light).toBeDefined()
      expect(palette.slots.quaternary.dark).toBeDefined()
    }
  })
})
