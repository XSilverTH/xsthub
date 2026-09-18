# XSilverTH Hub — clean-room implementation plan

## 1. Mandate and handoff boundary

Build a new, frontend-only hub with Vue 3, TypeScript, Bun, Vite, and heavily customized shadcn-vue components. Use Reka UI directly only when a lower-level primitive provides an actual benefit. This is a clean rewrite, not a port.

**The implementation agent may read this file and `planning-assets/` only as references to the original. It must not open the original repositories, original built HTML/JS/CSS, source maps, or original agent transcripts.** Do not copy original components, CSS, scripts, dependencies, or architecture. Obtain fonts/icons independently from their legitimate distributions. Screenshots and the descriptions below are clean-room observations, not implementation instructions extracted from source.

The planning parent did not inspect original source. A lightweight source scout produced a descriptive report; a separate lightweight runtime scout inspected rendered UI, captured screenshots, and corrected several assumptions. The parent reviewed the screenshots. Only screenshots and this synthesized plan belong in the implementation handoff.

Planning changed no application files. The only authorized outputs are this plan and reference screenshots. Do not ship reference screenshots with production assets.

### Non-negotiable scope

- Static files served over ordinary HTTP(S); no backend, server runtime, SSR, API proxy, database, accounts, CMS, or server-side rendering requirement.
- `bun install`, Bun-driven development/build/typecheck/content-validation scripts, and a committed Bun lockfile.
- One externally editable, same-host JSON catalog, fetched at runtime. Content changes must not require a frontend rebuild.
- Preserve the original visual identity, not a generic shadcn dashboard. Layout improvements are welcome.
- One small hub page, roughly 5–20 cards. No search, filters, sorting UI, internal detail pages, router, or pagination now.
- Support future cross-page/View Transition work architecturally, but implement **no cross-page transitions, View Transition API calls, transition router, or speculative route system**.
- Retain local entrance, aurora/parallax, hover and clipboard feedback motion, with accessible reduced-motion treatment.
- No live service checks now. Availability is optional, manually authored catalog data.

## 2. Agreed product decisions

| Area | Decision |
| --- | --- |
| Likely deployment | `xsth.ir` and `xsth.space`, but portable to other hosts and subdirectories |
| Packaging | Ordinary Vite static `dist/` with separate fingerprinted assets; not single-file HTML; `file://` support is not required |
| Runtime data | Same-host `hub.json`, relative to the app entry location |
| Caching | Browser HTTP cache with revalidation on page load; Retry on errors; no polling and no app-maintained stale/offline catalog |
| Invalid update | Reject the entire catalog, never silently omit malformed cards |
| Content control | Title, subtitle, contacts, ordered cards, copy values, instructions, descriptions, links and optional status all in JSON |
| Appearance control | Curated palette definitions in frontend code; individual card preset/custom-color choices in JSON |
| Color choice | Random palette once per full page load; stable automatic card color within that palette |
| Mode | Dark / Light / System selector; remember choice; System follows OS changes |
| Contacts | Maximum 8; first 3 visible. Desktop hover/focus expands remaining contacts without a More button. Phone/touch has an explicit expansion control |
| Links | Per-link same/new-tab choice; domains do not get rewritten when hub hosting changes |
| Initial content | Keep candid original copy and retained service details as editable starting content, not as assertions that endpoints are live |
| Remove | Incident timer/banner, Game Auto-Searcher, coming-soon placeholder |
| Matrix | Fully supported and present in creation-time catalog; owner will remove its entire card from production JSON for now and re-add it later |
| RustDesk | Keep server/details. Owner supplies public copy payload later; do not recover original payload or fabricate one |

## 3. Reference evidence and visual target

### Screenshot index

All paths below are relative to this plan. All screenshots show the **original**, including content intentionally removed in the rewrite. They are visual references, not the final catalog specification.

| Screenshot | Purpose |
| --- | --- |
| `planning-assets/desktop-dark-full-1440x1000.png` | Complete desktop reference; 1440×1000 viewport, 1440×1792 full capture |
| `planning-assets/desktop-dark-viewport-1440x1000.png` | Desktop initial viewport and background treatment |
| `planning-assets/desktop-light-full-1440x1000.png` | Complete light reference |
| `planning-assets/desktop-light-viewport-1440x1000.png` | Light typography, pastel background, borders/shadows |
| `planning-assets/tablet-dark-full-768x1024.png` | Two-column layout, 768×1024 viewport |
| `planning-assets/tablet-dark-viewport-768x1024.png` | Tablet initial viewport |
| `planning-assets/tablet-light-full-768x1024.png` | Tablet light mode |
| `planning-assets/mobile-dark-full-390x844.png` | Single-column page; 390×844 viewport, 390×3037 full capture |
| `planning-assets/mobile-dark-viewport-390x844.png` | Mobile header/contact placement |
| `planning-assets/mobile-light-full-390x844.png` | Mobile light mode |
| `planning-assets/desktop-hover-card-rustdesk.png` | Pointer-positioned card reference; see hover caveat below |
| `planning-assets/desktop-hover-button-rustdesk.png` | Pointer-positioned action reference; see hover caveat below |
| `planning-assets/desktop-copied-rustdesk.png` | Observed successful-copy label/checkmark feedback |
| `planning-assets/desktop-hover-theme-toggle.png` | Theme-control visual reference |

Runtime scout recorded initial palette as fuchsia, then explicitly selected the original multicolor/default palette for reproducible captures. Full-page screenshots include a viewport-fixed background; do not reproduce any apparent capture seam as a design element. The hover screenshots establish pointer placement, not conclusive activation of all hover styles: the original guards hover under hover-capable media queries, which can be inactive in headless configurations.

### Visual identity to preserve

- Oversized `XSilverTH` title with a small colored terminal period, tight tracking, generous empty space.
- Space Grotesk for primary UI and JetBrains Mono for handles, endpoint values and technical details.
- Near-black navy dark canvas, broad soft violet/blue/green-type aurora washes; light mode uses near-white canvas with subtle pastel washes.
- Thin softly outlined, generously rounded translucent cards. Icons sit inside tinted rounded-square tiles; action buttons use restrained tinted fill and accent borders/text.
- No sidebar, opaque dashboard toolbar, generic table treatment, harsh stock primary buttons, or blanket monochrome shadcn theme.
- Content-led bento rhythm; consistent action alignment without making every card an identical giant fixed-height box.
- Candid/personal language is intentional. Do not sanitize it or replace it with marketing prose.

### Measured reference geometry

These are anchors, not an obligation to retain empty space caused by removed content.

- Centered outer container max width: 1280px including 24px horizontal padding each side. At 1440px, content begins around x=104 and ends around x=1336: 1232px usable width.
- Outer vertical padding: approximately 96px desktop, 48px mobile.
- Grid gap: 24px. Original columns: 3 at desktop ≥1024px, 2 at 768–1023px, 1 below 768px.
- Measured columns: about 394.67px at 1440 viewport; 348px at 768; 342px at 390.
- Cards: 24px radius, around 32px internal padding. Smaller screens may reduce padding only where readability requires it.
- Icon tiles: roughly 48px, 16px radius. Action/input-like detail surfaces: 12px radius. Original action height around 46px.
- Header title: 48px mobile / 72px desktop, bold and tightly tracked. Subtitle: 18px / 20px, light weight, relaxed line height, max width about 36rem.
- Card titles: 20px standard / 24px featured; descriptions 14px; contact labels 14px monospace.
- Dark base reference: background approximately `#020617`, main text `#e2e8f0`, muted text `#94a3b8`. Light: `#f8fafc`, `#1e293b`, muted `#64748b`. Verify final contrast instead of blindly inheriting every old shade.
- Dark card fill roughly black at 20%, white border at 10%; light fill white at 40%, black border at 10%. Light mode has visible soft shadows; dark shadows are restrained.
- **Runtime correction:** original cards have no computed backdrop blur. Ambient background blur creates the soft glass-like appearance. Do not add expensive per-card backdrop filters merely because the screenshots look glassy.
- Original ambient layers: three blurred shapes, approximately 70vw square, 60vw square, and 80vw×50vw, extending outside the viewport. Treat these as compositional guidance; tune against screenshots.
- Original overflow checks passed at 1440, 768, 390 viewport widths.

### Revised layout behavior

Retain the recognizable header-plus-bento composition, but eliminate the removed incident banner and its vacant space. Header-to-grid spacing should read as intentional, approximately 48px as a starting point.

Use natural ordered grid flow, not hardcoded service positions. Support a generic optional wide card hint; Matrix can use it because it contains instructions plus clients. At desktop it may span two columns. Do not use dense packing that changes visual order relative to DOM/tab order. Standard cards need no named service logic. At tablet, avoid the original trap of squeezing two internal instruction/client columns into a single narrow card; collapse internal sections or allow a wide card to span the available grid. At mobile, all spans collapse to one column.

The layout must work when Matrix is removed, cards are reordered or added, and copy grows. An incomplete last row is preferable to inventing a fake filler card. No permanently featured service or service-name-dependent layout branch.

## 4. Color and mode contract

### Preset palettes

Create curated palette objects with stable IDs. Every palette supplies:

- Background/aurora colors for light and dark modes.
- Shared card slots named `primary`, `secondary`, `tertiary`, `quaternary`.
- For each slot and mode, semantic accent tokens for icon, border, tinted surface, action and readable foreground treatment.
- A header accent, coordinated with the palette.

The user did not request a count or the original seven palettes. Keep a multicolor palette close to the reference among the choices. Add only palettes that look good in **both modes**; no quota, no arbitrary random RGB generation, no user-facing palette selector. Exact hues require implementation-stage visual review, not speculative claims in this plan.

Choose one palette uniformly from the curated list once per full page load. Do not reroll on data completion, Retry, rerender, OS theme change, or manual mode change.

### Deterministic per-card choice

A card can omit its color selection (automatic), select a named shared slot, or request a custom color. Automatic mapping depends **only** on stable palette ID and stable card ID, not array index, title, theme mode, current time, or number/order of cards.

Concrete implementation contract: use a small fixed deterministic hash (for example unsigned 32-bit FNV-1a over UTF-8 `${paletteId}:${cardId}`) modulo the fixed four-slot list in the order above. Document the chosen algorithm and keep it stable. No seeded-randomness dependency is necessary. Changing a card ID can change its slot; changing order must not. Palette selection is intentionally random per load; slot selection is intentionally deterministic within it.

### Custom colors

Accept only full six-digit `#RRGGBB` values, case-insensitive, either one value for both modes or an explicit light/dark pair. Reject CSS strings, variable references, functions and arbitrary style injection.

Preserve requested hue for decoration; derive/choose readable foreground tokens independently. Never use a low-contrast custom color as essential text simply because it was supplied. Ensure normal text meets WCAG AA 4.5:1 and relevant large text/UI boundaries 3:1 against the actual composed surface. A custom color is not grounds to omit a valid card. Do not reuse status red/green as the only status communication.

### Mode selection

A compact top-right glass control uses a shadcn-vue DropdownMenu radio group for Light, Dark, System. Default System; persist explicit choice in localStorage with guarded access. System responds to `prefers-color-scheme` changes; explicit mode does not. Use an early small mode initializer to avoid a bright flash before mount. A tiny mode-preference entry is allowed; storing catalogs is not.

Keep palette and mode as separate state. Mode changes keep each card's selected slot and switch its mode-specific tokens. Icons have accessible labels; selection is exposed to assistive technology. Preserve approximately 46px hit target and mobile clearance from the heading.

## 5. Catalog contract

### File and validation

Runtime URL: `./hub.json`, resolved against the app entry/base URL. Do not hardcode a hostname. Use `schemaVersion: 1` and one canonical runtime schema (Zod 4 is a suitable concrete choice). Infer TypeScript types from that schema rather than maintaining drifting parallel interfaces. Generate a JSON Schema file from the same source for editor support; support an optional `$schema` property in the catalog. No code generation from untrusted data.

Provide `bun run validate:content <path>` to report actionable paths such as `cards[2].actions[0].href`. This is a local maintenance command, not a hosted service or an admin UI. Runtime applies the same rules. Reject unsupported versions, duplicate IDs, invalid URLs/colors, missing required data and unknown object keys so typos are not silently ignored.

### Normative data shape

The following notation describes the agreed schema; implementation must turn it into actual runtime validation and inferred TypeScript types.

```ts
type Slot = 'primary' | 'secondary' | 'tertiary' | 'quaternary'
type CardColor =
  | { kind: 'auto' }
  | { kind: 'preset'; slot: Slot }
  | { kind: 'custom'; value: string }
  | { kind: 'custom'; light: string; dark: string }

// target omitted => new tab for HTTP(S), native handling for mailto.
type LinkAction = {
  id: string
  kind: 'link'
  label: string
  href: string
  target?: 'same-tab' | 'new-tab'
}
type CopyAction = {
  id: string
  kind: 'copy'
  label: string
  value: string
  successLabel?: string
}
type Action = LinkAction | CopyAction

type Block =
  | { id: string; kind: 'text'; heading?: string; text: string }
  | { id: string; kind: 'instructions'; heading?: string; items: string[] }
  | { id: string; kind: 'details'; heading?: string;
      items: { id: string; label: string; value: string }[] }
  | { id: string; kind: 'actions'; heading?: string; actions: Action[] }

type Contact = {
  id: string
  label: string
  icon: string
  action:
    | { kind: 'link'; href: string; target?: 'same-tab' | 'new-tab' }
    | { kind: 'copy'; value: string }
}

type Card = {
  id: string
  title: string
  subtitle?: string
  description?: string
  icon: string
  layout?: 'standard' | 'wide' // standard if omitted
  color?: CardColor           // auto if omitted
  availability?: {
    state: 'online' | 'offline' | 'maintenance' | 'planned' | 'unknown'
    label?: string
    note?: string
  }
  blocks?: Block[]
  actions?: Action[]         // bottom action area
}

type Catalog = {
  $schema?: string
  schemaVersion: 1
  site: { title: string; subtitle: string }
  contacts: Contact[]       // 0–8
  cards: Card[]             // ordered; empty is valid
}
```

The colored title period is decoration; store `XSilverTH` without the period in `site.title`. The page renders the accent dot separately, without duplicating punctuation for the initial catalog.

### Semantics and constraints

- IDs are stable author-controlled lowercase identifiers (`[a-z0-9][a-z0-9-]*`). Unique contacts and unique cards; block IDs unique within a card; action IDs unique within a card across all action locations; detail IDs unique within their block. Use IDs as Vue keys, not positions.
- Array order is display order. Removal means deleting the entry; no scheduler, enable/disable rules or artificial lifecycle engine.
- Status is optional. Omission renders no badge. Never imply a live probe, count players or auto-mark a service online. Status does not silently disable actions: the owner controls the actions themselves.
- All text is plain text; no HTML, `v-html`, Markdown engine, executable snippets, arbitrary component names, injected classes, CSS or SVG.
- Icon names resolve through a small explicit Lucide icon registry. Include mail, hash, terminal, message-square, server, folder-open, activity, radar and a general project/code icon initially. Unknown icon names are validation errors with supported names reported. Do not bundle the entire icon set dynamically.
- Link URLs: allow absolute HTTP(S), `mailto:` for contacts, and explicit `/…`, `./…`, `../…` relative paths. Reject scheme-relative `//…`, backslash variants, script/data/file URLs, embedded credentials and unsupported schemes. Resolve/validate with URL parsing, not a weak starts-with check. Catalog strings never feed executable contexts.
- `/radar` means host root; `./radar` means app-relative. Absolute `https://xsth.ir/radar` stays on that domain even if the hub moves. Document these differences.
- Mail links use native handling. New-tab web links carry `rel="noopener noreferrer"` and a visual/accessibility cue. Anchors remain anchors, not JS-only buttons.
- Copy strings are literal public data. Base64 is not encryption. No passwords, private keys or client secrets belong in this publicly served catalog.
- Require meaningful nonempty labels/values; reject empty instruction/detail/action blocks. Permit zero cards and zero contacts with intentional empty states. Do not impose a 20-card hard cap; that is expected scale, not validity.
- A card must be representable by generic blocks and actions. No `if id === 'rustdesk'` or service-name-specific renderer.
- Each card may combine instructions, endpoint details, web links and downloads; this is enough for a future Matrix entry without a special Matrix component or app rebuild.

### Example authoring patterns

```json
{
  "schemaVersion": 1,
  "site": {
    "title": "XSilverTH",
    "subtitle": "Shit doesn’t look as cool when there isn’t a subtitle so just pretend like something important is written here"
  },
  "contacts": [
    {
      "id": "email",
      "label": "silver@xsth.ir",
      "icon": "mail",
      "action": { "kind": "link", "href": "mailto:silver@xsth.ir" }
    }
  ],
  "cards": [
    {
      "id": "fileserver",
      "title": "Fileserver",
      "description": "A repository of shit I host.",
      "icon": "folder-open",
      "color": { "kind": "preset", "slot": "secondary" },
      "actions": [
        {
          "id": "browse",
          "kind": "link",
          "label": "Browse Directory",
          "href": "https://fileserver.xsth.ir/",
          "target": "new-tab"
        }
      ]
    }
  ]
}
```

Automatic card: omit `color`. Custom one-color form: `{"kind":"custom","value":"#22D3EE"}`. Custom mode pair: `{"kind":"custom","light":"#0E7490","dark":"#22D3EE"}`. A later RustDesk copy action is a normal `kind: copy` action with the owner's exact public payload, not an app-specific encoding routine.

## 6. Creation-time content inventory

Populate the creation-time `hub.json` with these five cards, using generic fields/blocks. Keep ordering from the retained original content: Matrix, Minecraft, Fileserver, RustDesk, NetRadar. These are observed published descriptions and destinations; live service availability has not been checked.

### Header and contacts

- Title: `XSilverTH` with decorative accent period.
- Subtitle: `Shit doesn’t look as cool when there isn’t a subtitle so just pretend like something important is written here`.
- Email: `silver@xsth.ir`, mailto link.
- Matrix: `@xsilverth:xsth.ir`, link `https://matrix.to/#/@xsilverth:xsth.ir`.
- Handle: `@xsilverth`, copy that exact handle rather than guessing a social site.

### Matrix

- Title `Matrix Server`, subtitle/endpoint `xsth.ir`, message-square icon, optional wide layout.
- Instructions heading `Instructions`; steps: download an Element client; select “Custom Server” / “Edit”; enter homeserver `xsth.ir`; log in with your credentials.
- Client action group heading `Clients & Web`.
- Element Web → `https://element.xsth.ir`.
- Sable Web → `https://sable.xsth.ir`.
- Element Desktop → `https://fileserver.xsth.ir/Element/Element%20Setup.exe`.
- Element X → `https://myket.ir/app/io.element.android.x`.
- Do not broaden platform support or replace these URLs unasked. The desktop URL is specifically a Windows installer.
- During creation, treat this as existing content; omit an availability badge rather than invent a live status. Owner removes the card from production JSON until the service returns. All supporting generic rendering must remain.

### Minecraft

- Title `Minecraft`, server icon, manual `offline` availability badge.
- Description: `Nobody played this shit so i turned it off. If i see players wanting to play i’ll turn it on again`.
- No fabricated server address, connection button, player count or probe.

### Fileserver

- Title `Fileserver`, folder icon.
- Description: `A repository of shit I host.`
- `Browse Directory` → `https://fileserver.xsth.ir/`.
- No status unless explicitly configured.

### RustDesk

- Title `RustDesk Relay`, activity icon.
- Description: `Self-hosted, ultra-low latency remote desktop server for personal and team assistance.`
- Detail `ID Server` → `rustdesk.xsth.ir`.
- **Pending owner data:** public RustDesk client configuration. Until supplied, omit the copy action entirely—no dummy payload, broken button, invented key or base64 reconstruction. The generic copy implementation is exercised by the header handle and a throwaway public fixture during verification.
- When supplied, use action label `Copy RustDesk Config`, success label `Config Copied!` and literal supplied payload.

### NetRadar

- Title `NetRadar`, radar icon.
- Description: `Check if a lot of popular international websites are available really fast.`
- `Access Radar` → `https://xsth.ir/radar`.
- NetRadar remains an external destination; do not build its network-checking functionality into this hub.

There is no outage timer, incident schema, searcher entry or coming-soon card in this rewrite.

## 7. Fetching, caching and error states

Implement a small catalog loader/composable, not a general data platform or query framework.

1. Begin one fetch on page mount using `cache: 'no-cache'` to request HTTP revalidation. No cache-busting timestamp, no periodic refresh, no service worker and no IndexedDB/localStorage catalog cache.
2. Use AbortController to cancel on unmount/replacement and a finite request deadline (10 seconds is a reasonable implementation default) so a stalled request reaches actionable error UI. No automatic retry loop.
3. Require successful HTTP response, parse JSON, validate the whole document, then commit it atomically. Never temporarily render an unvalidated object or a partially accepted catalog.
4. Show a designed loading skeleton within the real aurora/header/grid composition. Do not flash fake service names or briefly display a hardcoded catalog. A minimal static document title/loading label is fine.
5. On transport, parse, schema or deadline failure, show a concise error panel and real Retry button. Distinguish unavailable data from invalid configuration without exposing the entire response. Provide a concise field path where useful for the site owner. A static host returning HTML with status 200 must be treated as invalid data, not as an empty catalog.
6. Retry starts one new attempt; disable duplicate attempts while pending and prevent stale responses from winning. Keep the page palette stable.
7. A valid zero-card catalog shows its configured header and a restrained “No services configured” empty state, not an error or invented card.
8. No manual refresh UI or refresh-on-focus behavior is required. Changes appear on the next page reload (or Retry after failure).

### Host caching guidance

- `hub.json`: ideally `Cache-Control: no-cache` with host-managed ETag or Last-Modified. Conditional requests can return 304 and reuse bytes without serving stale data blindly.
- HTML: revalidate (`no-cache`).
- Fingerprinted JS/CSS/fonts: long-lived `public, max-age=31536000, immutable` when supported.
- CDN rules must not override the JSON with a long unvalidated cache. Document host-specific header examples only for a host actually chosen; do not assume a backend can set headers dynamically.
- On hosts without custom header controls, request-side revalidation still helps, but cannot defeat an incorrectly configured intermediary. Explain the limitation rather than promising instant cache invalidation.
- Independent data publication should atomically replace/upload `hub.json` where hosting supports it. Run local validation before uploading.

## 8. Contacts and action interaction contracts

### Contact expansion

- 0–3 contacts: render them normally; no overflow indicator or disclosure control.
- 4–8: first three remain visible in declared order.
- Hover-capable fine-pointer desktop: hovering the group reveals the remaining contacts in an anchored panel contiguous with the group. **No More button.** A subtle stacked-edge/chevron affordance may indicate expansion. The group also opens when keyboard focus enters a visible contact.
- Keep expanded content open while pointer or focus is anywhere inside the combined group/panel. Avoid a gap that closes the panel while moving onto it. Use a short closing grace period if needed, not a hover puzzle.
- Escape closes overflow; if focus was in hidden content, restore it to an appropriate visible contact. Avoid immediately reopening due to that programmatic focus restoration; allow reopening after leaving/re-entering the group.
- Touch/coarse-pointer/no-hover: display first three plus an explicit Show more/Show fewer icon-button with accessible name, `aria-expanded`, and `aria-controls`. Tap toggles the same contacts panel; outside interaction and Escape dismiss. Touch laptops must not lose their only reveal path; capability detection is more important than viewport width alone.
- Contacts are links/buttons, not ARIA menuitems. No modal focus trap. Closed items are not tabbable. Cap height to viewport and allow scrolling if needed. Position so it does not cover the theme control or extend offscreen.
- Use shadcn-vue Popover structure where it serves this behavior. If its wrapper prevents controlled hover/focus behavior, use Reka Popover primitives directly for this one component with an explicit trigger/focus contract. Do not force HoverCard semantics onto essential actionable links.

### Clipboard

- Invoke `navigator.clipboard.writeText` from the user gesture; only claim success after the promise resolves.
- Success: checkmark + success label, subtle local ripple, polite status announcement; return to idle after about 2 seconds. Avoid noisy duplicate announcements.
- Failure/insecure context/unsupported API: explain that copying failed and expose the literal value in a selectable, labeled surface for manual copying. Never show “Copied” on failure and never require a backend fallback.
- Clean up timeouts on unmount. Repeated clicks must not leave multiple racing reset timers. Do not display public configuration as though it were secret storage.
- No clickable card wrapper around nested links/actions; use a semantic article with a heading and independent action controls.

## 9. Architecture and shadcn-vue usage

Use Vue Composition API with `<script setup lang="ts">`. Prefer simple props/composables; no Pinia or router is needed for this scope. Resolve mutually compatible stable Vue/Vite/Tailwind/shadcn-vue/Reka versions during implementation using official documentation and lock them with Bun. Do not reuse original dependency manifests.

Suggested boundaries (names can follow the fresh project's conventions):

```text
src/
  main.ts
  App.vue
  components/
    ui/                    # shadcn-vue-generated, owned/customized UI components
    HubHeader.vue
    ContactList.vue
    ThemeControl.vue
    AuroraBackground.vue
    ServiceGrid.vue
    ServiceCard.vue
    CardBlocks.vue
    HubAction.vue
    AvailabilityBadge.vue
    CatalogState.vue
  composables/
    useCatalog.ts
    useTheme.ts
    useClipboardFeedback.ts
  lib/
    catalog-schema.ts
    catalog-url.ts
    palettes.ts
    card-colors.ts
    icons.ts
  styles/
    app.css
public/
  hub.json                 # independently publishable creation-time catalog
  hub.schema.json          # generated editor schema, versioned with frontend
scripts/
  validate-content.ts
  generate-content-schema.ts
```

Do not split every heading or static paragraph into a component. Do not create a general block plugin system, dependency injection framework or configurable layout DSL. The small discriminated block union is sufficient.

### Component mapping

- Card/CardHeader/CardContent/CardFooter: structural card shell, fully styled to the reference.
- Button with `asChild` where appropriate: actual anchors for navigation, actual buttons for copy/theme/retry.
- Badge: availability, with text plus dot/icon.
- DropdownMenu + radio items: mode selector.
- Popover: contact overflow/manual-copy surface where appropriate.
- Separator: setup section divisions.
- Skeleton and Alert: loading/error states.
- Tooltip only for genuinely ambiguous icon-only controls; essential explanations cannot be tooltip-only.

shadcn-vue is the component/interaction foundation, not the final visual identity. Override tokens, spacing, radii, variants and foreground treatments. Use Reka directly only for useful lower-level control, not to duplicate shadcn components already serving the purpose.

### Separation for future transitions

- Stable semantic card/contact/block/action IDs and predictable DOM anchors (`data-card-id`) independent of array positions.
- Root app shell/background separate from main content; card shells separate from data acquisition and local decorative motion.
- Keep local entrance/hover transforms on suitable inner wrappers so a later page-transition wrapper need not fight them.
- No hardwired navigation interception; ordinary anchors retain native behavior.
- No View Transition CSS names, `document.startViewTransition`, snapshots, route stubs or unused abstraction now. Stable identities and separation are the complete current deliverable for readiness.

## 10. Motion, accessibility and performance

### Motion

- Recreate subtle ambient aurora/parallax, local staggered fade/up entrances and restrained hover/click feedback.
- Reference entrances use approximately 20px travel, a small scale change and around 800ms duration. Refine if the retained smaller catalog feels sluggish; do not delay access to actions.
- Hover border/glow transitions roughly 200–500ms; theme control slightly scales; copy feedback lasts around 2 seconds.
- Decorative pulse on an offline badge is optional visual parity, not a live-status signal.
- `prefers-reduced-motion: reduce`: remove parallax, continuous drifting/pulse/ripple and stagger travel; reveal content immediately and keep concise non-motion feedback.
- Pointer parallax only on appropriate pointer devices; one requestAnimationFrame loop, no Vue-wide rerender per pointer event. Pause decorative loops when document is hidden and clean up listeners.
- Keep aurora behind content, pointer-events none, clipped safely without clipping focused controls. Avoid large animations that repaint every card.

### Accessibility and resilience

- Semantic main/header/articles/headings and consistent keyboard order.
- Visible focus rings tuned for both modes and all palettes, not clipped by decorative overflow.
- Contrast verification on real composed backgrounds, including light mode, muted copy, action borders and custom color extremes.
- Controls at least approximately 44px tap targets; reflow at 320px and 200% zoom. Long endpoint/handle text wraps without horizontal page scrolling.
- Prefer intrinsic heights; action rows can align through flex layout without fixed content heights.
- Status uses text, not color alone. Theme selection, loading, copy result and errors expose appropriate accessible state/announcements.
- No unnecessary global live region announcing the entire catalog or every decorative change.
- Bundle/self-host licensed Space Grotesk and JetBrains Mono WOFF2 assets with `font-display: swap`; do not depend on Google Fonts or another runtime font network request. Include needed weights only.
- No external runtime icon/CDN dependencies, telemetry or analytics added without a requirement.

## 11. Implementation sequence

### Execution model: orchestrator-led, subagent-built

- The main implementation agent acts primarily as the **orchestrator**, not the primary code author. Most actual implementation work must be delegated to writing subagents: scaffold/tooling, catalog/schema/loading, visual components, interactions/colors, and focused fixes.
- The orchestrator owns interpretation of this plan, decomposition, shared contracts, task ordering, integration, review, final verification and delivery. It may make small integration fixes directly, but must not quietly implement most of the app itself.
- Before delegation, define each task's file ownership, dependencies, inputs, outputs and observable acceptance criteria. Give every subagent the relevant requirements and screenshot paths; the clean-room prohibition applies to every agent, including nested agents. No agent may inspect the original source or built bundle.
- Run genuinely independent work concurrently once shared prerequisites and interfaces are settled. Do not invent parallel tasks that compete to edit the same files. Name a single integration owner for shared boundaries and serialize those edits, or use isolated worktrees with orchestrator-controlled integration.
- Suitable independent slices after the initial scaffold/contracts are settled include catalog loading/validation, card/block rendering, theme/palette logic, and contact/clipboard interactions. Split styling ownership carefully so concurrent agents do not overwrite shared tokens or component variants.
- Subagents must report changed files, completed acceptance criteria and remaining integration concerns. During concurrent editing, they must skip formatters, builds, lint and tests; the orchestrator coordinates verification after each integrated milestone against a stable tree.
- The orchestrator must inspect delivered changes and exercise the relevant behavior rather than treating a subagent's completion message as proof. Delegate substantial corrective work back to the responsible subagent; retain end-to-end responsibility.

### Git workflow: incremental, verified commits

- Perform implementation in a Git repository. Reuse the destination repository if present; otherwise initialize one before implementation. Inspect existing work first and preserve unrelated/uncommitted user changes. Never reset, discard, overwrite or sweep unrelated files into a commit.
- Make **step-by-step commits throughout implementation**, not one final bulk commit. Each commit should represent a coherent, reviewed milestone that can be understood independently. The numbered sequence below supplies the default milestones; split larger milestones into additional coherent commits when useful.
- Suggested progression: scaffold/toolchain; catalog/schema/validator and initial content; visual shell; data-driven rendering/loading states; theme/colors and contacts/actions (separate commits where independent); local motion/accessibility; verified fixes; final documentation/cleanup.
- The main orchestrator owns staging and commits in the shared checkout. Subagents should not race to commit or stage shared files. Isolated-worktree commits are acceptable only when explicitly assigned; the orchestrator integrates them in dependency order.
- Before each milestone commit, run the checks appropriate to that milestone on the integrated tree and review the exact staged changes. UI milestones require actual browser evidence; schema/data milestones require exercising their contracts. Do not run a full project suite after every tiny edit, but do not commit knowingly broken integration as a completed milestone.
- Stage explicit task-owned paths, use descriptive commit messages, and exclude temporary scripts, debug artifacts, secrets, generated build output and original application files. Keep the committed Bun lockfile synchronized with dependency changes. Never bypass hooks or rewrite existing history merely to make the sequence look cleaner.
- Keep a concise verification record for each milestone and report the final commit sequence with verification results at handoff. If Git identity or another prerequisite prevents committing, report the exact blocker; do not fabricate identity, claim commits were made, or silently substitute an uncommitted final dump.

### Ordered delivery milestones

1. **Fresh scaffold and toolchain:** initialize Vue 3 + TypeScript + Vite with Bun; configure relative base (`base: './'`), Tailwind and shadcn-vue; add minimal scripts and local fonts/icons. Do not import original source or built assets.
2. **Catalog contract first:** implement runtime schema, inferred types, safe URL semantics, editor schema generation and local validator. Author the creation-time catalog above, leaving RustDesk copy absent until owner payload exists.
3. **Static visual shell:** reproduce header, typography, aurora, card shell, grid and dark/light foundations against screenshots before adding visual flourishes. Verify actual rendered screenshots at desktop/tablet/mobile.
4. **Generic data rendering:** connect atomic catalog loading, ordered cards, reusable blocks/actions, optional availability and correct empty/loading/error states. Demonstrate removing Matrix by data alone.
5. **Interaction and colors:** implement mode selector, random palette/stable card-slot system, custom colors, contacts hover/focus/tap expansion and clipboard feedback/error handling.
6. **Local motion:** add parallax/entrances/hover feedback within reduced-motion and lifecycle constraints. Do not build cross-page transitions.
7. **Verification:** execute the scenarios below and fix observed behavior/visual discrepancies. Do not treat passing typecheck/build as visual proof.
8. **After proof, cleanup and handoff:** remove throwaway fixtures/scripts, document JSON editing, public-data safety, deployment/cache policy and RustDesk payload insertion. Commit no runtime output or accidental original files. Include fresh implementation screenshots for visual comparison if useful.

## 12. Verification and acceptance

### Build/runtime proof

Run installation with Bun, typecheck, production build, and the local content validator. Serve the real production build with an ordinary static file server, not only Vite dev mode. Confirm it works without any backend process or private environment value.

Serve it at both `/` and an arbitrary directory such as `/hub/`. Confirm JS/CSS/fonts and `hub.json` resolve from the app base; the JSON's absolute external URLs remain unchanged. No history fallback/routing server configuration should be required.

### Actual browser scenarios

- Capture new desktop 1440×1000, tablet 768×1024 and mobile 390×844 in both modes, and inspect 320px width plus zoom/long text. Compare visual character to references while explicitly accounting for intentionally removed content.
- Check every curated palette in light and dark with a development-only deterministic selection mechanism or component harness; do not depend on repeatedly reloading until lucky. Do not ship a hidden production palette selector just for testing.
- Reorder/add/remove cards without rebuilding. Retained IDs keep their slot under the same palette; full reload may choose a different palette. Switching mode must not reroll.
- Test auto/manual slot/custom single/custom pair colors, including near-white and near-black custom input; essential text/focus remain readable.
- Test contacts with 0, 3, 4 and 8 entries. Desktop must reveal by hover and keyboard without a More button; phone/touch must reveal via explicit control. Verify Escape, outside interaction, no hover gap, no invisible tabbable links and no focus-reopen loop.
- Exercise mode persistence, OS theme changes in System, unavailable localStorage and initial-load flash behavior.
- Exercise clipboard success, denied access and unsupported/insecure context. Confirm actual copied public value in a safe fixture or header handle; verify success is not shown for rejection.
- Test fetch success, delayed response, deadline, failed HTTP, HTML-with-200, malformed JSON, unknown schema version, duplicate IDs, unsafe link and invalid colors. Whole invalid catalog must fail, Retry must work, and no invented/stale service list should appear.
- Serve valid empty catalog and verify deliberate empty state.
- Change `hub.json` on the static server, reload, and verify updated content with HTTP revalidation rather than fingerprint/cached-catalog interference.
- Remove Matrix from the catalog, render correctly, then re-add its instruction/client blocks without changing source or rebuilding.
- Verify all navigation/copy actions from generic configuration, including same/new-tab choice and root/app-relative URLs.
- Verify reduced motion removes decorative continuous motion, and no implemented code initiates cross-page/View Transitions.

### Test discipline

Use focused throwaway browser/CLI smoke scenarios for broad visual/feature proof; retain automated tests only for plausible uncertain failures: catalog rejection/safe URL rules, palette stability under reorder and mode changes, contact focus/escape transitions, and clipboard rejection behavior are good candidates. No snapshot assertions pinning original source structure, copied markup, exact marketing wording or component internals. Tests must assert observable contracts.

### Definition of done

- The app visibly retains the personal aurora/bento/typographic identity, rather than merely using similar colors on stock components.
- All cards/contacts/content come from externally replaceable JSON and adding an ordinary service needs no component edit.
- Matrix-style setup is supported without a dedicated hardcoded Matrix component.
- Runtime failures are usable, safe and explicit; no silent partial acceptance or stale catalog fallback.
- All agreed interaction/color/responsiveness behavior is exercised on the actual surface.
- Static root and subdirectory deployment both work; no backend is required.
- Documentation covers content validation/publishing, stable IDs, palette slots/custom colors, link resolution, cache headers and public-data safety.
- RustDesk's missing payload is explicitly documented as owner-provided content; its unavailable copy action is absent, not a fake implementation. Generic copy behavior is complete and verified independently.

## 13. Deployment and maintenance notes

`public/hub.json` is a convenient creation-time copy, but production content is independently managed. Vite copies it into `dist/`; **a frontend-only deploy must exclude or preserve the site's existing `hub.json`**, otherwise an old build can overwrite newer live content. Document two explicit workflows:

1. First deploy: build and upload dist plus validated initial catalog.
2. Subsequent frontend deploy: upload frontend assets/HTML without overwriting managed JSON; catalog-only update: validate and replace `hub.json` without rebuilding.

Keep schema version 1 compatible through ordinary changes. Any future incompatible catalog schema change requires an explicit catalog/frontend deployment migration, not a silent parser relaxation. JSON/schema files are public and must contain only public data.

No host-specific automation is needed until a host is chosen. The implementation should give ordinary static upload instructions and cache guidance, not build a deployment platform.

## 14. Evidence limitations and deliberately unresolved content

- Screenshots prove rendered original appearance and observed UI state, not that service endpoints are currently reachable. No endpoint health was asserted.
- Original copied-state screenshot shows feedback; this plan does not include or approve the old RustDesk payload.
- Hover screenshots can reflect headless hover-capability limitations; verify final hover behavior on a correctly emulated/actual hover-capable device.
- Exact new palette hues are intentionally delegated to visual review under the settled palette contract; there is no arbitrary palette-count target.
- Only outstanding required owner-supplied content is the desired RustDesk public copy payload. Its absence does not block the complete generic hub implementation.
