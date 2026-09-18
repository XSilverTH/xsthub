import { ref, type Ref } from 'vue'
import { safeParseCatalog, type Catalog } from '../lib/catalog-schema'
import { getCatalogUrl } from '../lib/catalog-url'

export type CatalogLoadStatus = 'loading' | 'success' | 'error'

function formatIssuePath(path: PropertyKey[]): string {
  let formatted = ''
  for (const segment of path) {
    if (typeof segment === 'number') {
      formatted += `[${segment}]`
    } else {
      formatted += formatted ? `.${String(segment)}` : String(segment)
    }
  }
  return formatted || 'catalog'
}

function describeError(error: unknown): string {
  if (error instanceof Error && error.message) return error.message
  return 'Unknown catalog loading error'
}

export function useCatalog(): {
  status: Ref<CatalogLoadStatus>
  catalog: Ref<Catalog | null>
  errorMessage: Ref<string | null>
  errorDetails: Ref<string | null>
  loadCatalog: () => Promise<void>
  retry: () => Promise<void>
} {
  const status = ref<CatalogLoadStatus>('loading')
  const catalog = ref<Catalog | null>(null)
  const errorMessage = ref<string | null>(null)
  const errorDetails = ref<string | null>(null)

  async function loadCatalog(): Promise<void> {
    status.value = 'loading'
    errorMessage.value = null
    errorDetails.value = null

    const controller = new AbortController()
    const deadline = setTimeout(() => controller.abort(), 10_000)

    try {
      const url = getCatalogUrl()
      const response = await fetch(url, {
        cache: 'no-cache',
        signal: controller.signal,
      })
      if (!response.ok) {
        throw new Error(`Catalog request failed (${response.status}${response.statusText ? ` ${response.statusText}` : ''})`)
      }

      const contentType = response.headers.get('content-type')?.toLowerCase() ?? ''
      if (contentType.includes('text/html')) {
        throw new Error('Catalog response was HTML instead of JSON')
      }

      let payload: unknown
      try {
        payload = await response.json()
      } catch (error) {
        throw new Error(`Catalog JSON could not be parsed: ${describeError(error)}`)
      }

      const parsed = safeParseCatalog(payload)
      if (!parsed.success) {
        const issue = parsed.error.issues[0]
        const path = issue ? formatIssuePath(issue.path) : 'catalog'
        const detail = issue ? `${path}: ${issue.message}` : 'Catalog does not match the expected schema'
        throw new Error(`Catalog validation failed: ${detail}`)
      }

      catalog.value = parsed.data
      status.value = 'success'
    } catch (error) {
      status.value = 'error'
      errorMessage.value = error instanceof Error && error.name === 'AbortError'
        ? 'Catalog request timed out. Please try again.'
        : error instanceof Error && error.message.startsWith('Catalog')
          ? error.message.split(':', 1)[0]
          : 'Unable to load the catalog.'
      errorDetails.value = describeError(error)
    } finally {
      clearTimeout(deadline)
    }
  }

  async function retry(): Promise<void> {
    await loadCatalog()
  }

  return { status, catalog, errorMessage, errorDetails, loadCatalog, retry }
}
