import { z } from 'zod'
import { isValidCatalogUrl } from './catalog-url'
import { iconNames } from './icons'

export const IdSchema = z
  .string()
  .regex(/^[a-z0-9][a-z0-9-]*$/, 'Must contain only lowercase letters, numbers, and hyphens')

export const ColorHexSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, 'Must be a six-digit hexadecimal color')

export const IconNameSchema = z.enum(iconNames)

const UrlSchema = z.string().min(1).refine((value) => isValidCatalogUrl(value), {
  message: 'Invalid URL',
})

const ContactUrlSchema = z.string().min(1).refine((value) => isValidCatalogUrl(value, true), {
  message: 'Invalid URL',
})

export { UrlSchema }

const AutoColorSchema = z.object({ kind: z.literal('auto') }).strict()
const PresetColorSchema = z
  .object({
    kind: z.literal('preset'),
    slot: z.enum(['primary', 'secondary', 'tertiary', 'quaternary']),
  })
  .strict()
const CustomColorValueSchema = z
  .object({ kind: z.literal('custom'), value: ColorHexSchema })
  .strict()
const CustomColorPairSchema = z
  .object({
    kind: z.literal('custom'),
    light: ColorHexSchema,
    dark: ColorHexSchema,
  })
  .strict()

export const CardColorSchema = z.union([
  AutoColorSchema,
  PresetColorSchema,
  CustomColorValueSchema,
  CustomColorPairSchema,
])

export const LinkActionSchema = z
  .object({
    id: IdSchema,
    kind: z.literal('link'),
    label: z.string().min(1),
    href: UrlSchema,
    target: z.enum(['same-tab', 'new-tab']).optional(),
  })
  .strict()

export const CopyActionSchema = z
  .object({
    id: IdSchema,
    kind: z.literal('copy'),
    label: z.string().min(1),
    value: z.string().min(1),
    successLabel: z.string().min(1).optional(),
  })
  .strict()

export const ActionSchema = z.discriminatedUnion('kind', [LinkActionSchema, CopyActionSchema])

const ContactLinkActionSchema = z
  .object({
    kind: z.literal('link'),
    href: ContactUrlSchema,
    target: z.enum(['same-tab', 'new-tab']).optional(),
  })
  .strict()

const ContactCopyActionSchema = z
  .object({ kind: z.literal('copy'), value: z.string().min(1) })
  .strict()

export const ContactActionSchema = z.discriminatedUnion('kind', [
  ContactLinkActionSchema,
  ContactCopyActionSchema,
])

const TextBlockSchema = z
  .object({
    id: IdSchema,
    kind: z.literal('text'),
    heading: z.string().min(1).optional(),
    text: z.string().min(1),
  })
  .strict()

const InstructionsBlockSchema = z
  .object({
    id: IdSchema,
    kind: z.literal('instructions'),
    heading: z.string().min(1).optional(),
    items: z.array(z.string().min(1)).min(1),
  })
  .strict()

const DetailItemSchema = z
  .object({
    id: IdSchema,
    label: z.string().min(1),
    value: z.string().min(1),
  })
  .strict()

const DetailsBlockSchema = z
  .object({
    id: IdSchema,
    kind: z.literal('details'),
    heading: z.string().min(1).optional(),
    items: z.array(DetailItemSchema).min(1),
  })
  .strict()

const ActionsBlockSchema = z
  .object({
    id: IdSchema,
    kind: z.literal('actions'),
    heading: z.string().min(1).optional(),
    actions: z.array(ActionSchema).min(1),
  })
  .strict()

export const BlockSchema = z.discriminatedUnion('kind', [
  TextBlockSchema,
  InstructionsBlockSchema,
  DetailsBlockSchema,
  ActionsBlockSchema,
])

export const ContactSchema = z
  .object({
    id: IdSchema,
    label: z.string().min(1),
    icon: IconNameSchema,
    action: ContactActionSchema,
  })
  .strict()

export const AvailabilitySchema = z
  .object({
    state: z.enum(['online', 'offline', 'maintenance', 'planned', 'unknown']),
    label: z.string().min(1).optional(),
    note: z.string().min(1).optional(),
  })
  .strict()

export const SiteSchema = z
  .object({
    title: z.string().min(1),
    subtitle: z.string().min(1),
  })
  .strict()

export const CardSchema = z
  .object({
    id: IdSchema,
    title: z.string().min(1),
    subtitle: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    icon: IconNameSchema,
    layout: z.enum(['standard', 'wide']).optional(),
    color: CardColorSchema.optional(),
    availability: AvailabilitySchema.optional(),
    blocks: z.array(BlockSchema).optional(),
    actions: z.array(ActionSchema).optional(),
  })
  .strict()

export const CatalogSchema = z
  .object({
    $schema: z.string().optional(),
    schemaVersion: z.literal(1),
    site: SiteSchema,
    contacts: z.array(ContactSchema).max(8),
    cards: z.array(CardSchema),
  })
  .strict()
  .superRefine((catalog, ctx) => {
    const contactIds = new Set<string>()
    catalog.contacts.forEach((contact, index) => {
      if (contactIds.has(contact.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['contacts', index, 'id'],
          message: 'Duplicate contact ID',
        })
      }
      contactIds.add(contact.id)
    })

    const cardIds = new Set<string>()
    catalog.cards.forEach((card, cardIndex) => {
      if (cardIds.has(card.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['cards', cardIndex, 'id'],
          message: 'Duplicate card ID',
        })
      }
      cardIds.add(card.id)

      const blockIds = new Set<string>()
      const actionIds = new Set<string>()

      card.blocks?.forEach((block, blockIndex) => {
        if (blockIds.has(block.id)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['cards', cardIndex, 'blocks', blockIndex, 'id'],
            message: 'Duplicate block ID within card',
          })
        }
        blockIds.add(block.id)

        if (block.kind === 'details') {
          const detailIds = new Set<string>()
          block.items.forEach((item, itemIndex) => {
            if (detailIds.has(item.id)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['cards', cardIndex, 'blocks', blockIndex, 'items', itemIndex, 'id'],
                message: 'Duplicate detail ID within block',
              })
            }
            detailIds.add(item.id)
          })
        }

        if (block.kind === 'actions') {
          block.actions.forEach((action, actionIndex) => {
            if (actionIds.has(action.id)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['cards', cardIndex, 'blocks', blockIndex, 'actions', actionIndex, 'id'],
                message: 'Duplicate action ID within card',
              })
            }
            actionIds.add(action.id)
          })
        }
      })

      card.actions?.forEach((action, actionIndex) => {
        if (actionIds.has(action.id)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['cards', cardIndex, 'actions', actionIndex, 'id'],
            message: 'Duplicate action ID within card',
          })
        }
        actionIds.add(action.id)
      })
    })
  })

export type Slot = z.infer<typeof PresetColorSchema>['slot']
export type IconName = z.infer<typeof IconNameSchema>
export type CardColor = z.infer<typeof CardColorSchema>
export type LinkAction = z.infer<typeof LinkActionSchema>
export type CopyAction = z.infer<typeof CopyActionSchema>
export type Action = z.infer<typeof ActionSchema>
export type ContactAction = z.infer<typeof ContactActionSchema>
export type DetailItem = z.infer<typeof DetailItemSchema>
export type Block = z.infer<typeof BlockSchema>
export type Availability = z.infer<typeof AvailabilitySchema>
export type Site = z.infer<typeof SiteSchema>
export type Contact = z.infer<typeof ContactSchema>
export type Card = z.infer<typeof CardSchema>
export type Catalog = z.infer<typeof CatalogSchema>

export function parseCatalog(json: unknown): Catalog {
  return CatalogSchema.parse(json)
}

export function safeParseCatalog(json: unknown) {
  return CatalogSchema.safeParse(json)
}
