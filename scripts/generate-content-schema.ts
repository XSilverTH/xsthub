import { writeFile } from 'node:fs/promises'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { CatalogSchema } from '../src/lib/catalog-schema'

const generatedSchema = zodToJsonSchema(CatalogSchema, {
  name: 'Catalog',
  $refStrategy: 'none',
  target: 'jsonSchema7',
})
const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  ...generatedSchema,
}
await writeFile('public/hub.schema.json', `${JSON.stringify(schema, null, 2)}\n`, 'utf8')
console.log('Generated public/hub.schema.json')
