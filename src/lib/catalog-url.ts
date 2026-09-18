const HTTP_PROTOCOLS = new Set(['http:', 'https:'])

function hasRootTraversal(pathname: string): boolean {
  if (!pathname.startsWith('/')) return false

  let depth = 0
  for (const segment of pathname.split('/')) {
    if (!segment || segment === '.') continue
    if (segment === '..') {
      depth -= 1
      if (depth < 0) return true
    } else {
      depth += 1
    }
  }

  return false
}

function isValidMailto(url: string): boolean {
  if (!/^mailto:[^\s]+$/i.test(url) || url.slice(7).startsWith('//')) return false

  const address = url.slice(7).split('?', 1)[0]
  const at = address.lastIndexOf('@')
  if (at <= 0 || at === address.length - 1) return false

  const local = address.slice(0, at)
  const domain = address.slice(at + 1)
  return (
    /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local) &&
    /^(?:[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*|\[[0-9A-Fa-f:.]+\])$/.test(domain)
  )
}

export function isValidCatalogUrl(url: string, allowMailto = false): boolean {
  if (!url || url.trim() !== url || /\s|\\/.test(url) || /%5c/i.test(url) || url.startsWith('//')) return false

  if (url.toLowerCase().startsWith('mailto:')) return allowMailto && isValidMailto(url)

  const isRelative = url.startsWith('/') || url.startsWith('./') || url.startsWith('../')
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(url)
  if (!isRelative && !hasScheme) return false

  const pathname = url.split(/[?#]/, 1)[0]
  let decodedPathname = pathname
  try {
    decodedPathname = decodeURIComponent(pathname)
  } catch {
    return false
  }
  if (isRelative && hasRootTraversal(decodedPathname)) return false

  try {
    const parsed = new URL(url, 'http://localhost')
    if (parsed.username || parsed.password) return false
    if (isRelative) return parsed.protocol === 'http:'
    return HTTP_PROTOCOLS.has(parsed.protocol)
  } catch {
    return false
  }
}

export interface ResolvedLinkProps {
  href: string
  target?: '_blank'
  rel?: 'noopener noreferrer'
  isExternal: boolean
}

export function resolveLinkProps(
  href: string,
  target?: 'same-tab' | 'new-tab',
): ResolvedLinkProps {
  const parsed = new URL(href, 'http://localhost')
  const isMailto = parsed.protocol === 'mailto:'
  const isExternal = HTTP_PROTOCOLS.has(parsed.protocol)
  const shouldOpenNewTab = !isMailto && target === 'new-tab'
  const defaultsToNewTab = isExternal && target === undefined

  return {
    href,
    target: shouldOpenNewTab || defaultsToNewTab ? '_blank' : undefined,
    rel: shouldOpenNewTab || defaultsToNewTab ? 'noopener noreferrer' : undefined,
    isExternal,
  }
}
