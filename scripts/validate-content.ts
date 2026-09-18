import { safeParseCatalog } from '../src/lib/catalog-schema'

const filePath = process.argv[2] ?? 'public/hub.json'

function formatPath(path: (string | number)[]): string {
  let formatted = ''
  for (const part of path) {
    if (typeof part === 'number') formatted += `[${part}]`
    else formatted += formatted ? `.${part}` : part
  }
  return formatted || '<root>'
}

try {
  const input = await Bun.file(filePath).text()
  let json: unknown
  try {
    json = JSON.parse(input)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid JSON'
    console.error(`✗ Catalog validation failed: ${filePath}`)
    console.error(`  <root>: ${message}`)
    process.exit(1)
  }

  const result = safeParseCatalog(json)
  if (!result.success) {
    console.error(`✗ Catalog validation failed: ${filePath}`)
    for (const issue of result.error.issues) {
      console.error(`  ${formatPath(issue.path)}: ${issue.message}`)
    }
    process.exit(1)
  }

  console.log(
    `✓ Catalog is valid: ${filePath} (${result.data.cards.length} cards, ${result.data.contacts.length} contacts)`,
  )
  process.exit(0)
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unable to read catalog'
  console.error(`✗ Catalog validation failed: ${filePath}`)
  console.error(`  <root>: ${message}`)
  process.exit(1)
}
